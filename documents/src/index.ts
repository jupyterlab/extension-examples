import { ICollaborativeDrive } from '@jupyter/collaborative-drive';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { WidgetTracker, IWidgetTracker } from '@jupyterlab/apputils';

import { Token } from '@lumino/coreutils';

import { ExampleWidgetFactory, ExampleDocModelFactory } from './factory';
import { ExampleDoc } from './model';
import { ExampleDocWidget } from './widget';

/**
 * The name of the factory that creates editor widgets.
 */
const FACTORY = 'Example editor';

// Export a token so other extensions can require it
export const IExampleDocTracker = new Token<IWidgetTracker<ExampleDocWidget>>(
  'exampleDocTracker'
);

/**
 * Initialization data for the documents extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'documents',
  description:
    'Minimal JupyterLab extension for a collaborative document widget.',
  autoStart: true,
  requires: [ILayoutRestorer],
  optional: [ICollaborativeDrive],
  provides: IExampleDocTracker,
  activate: (
    app: JupyterFrontEnd,
    restorer: ILayoutRestorer,
    drive: ICollaborativeDrive | null
  ) => {
    // Namespace for the tracker
    const namespace = 'documents-example';
    // Creating the tracker for the document
    const tracker = new WidgetTracker<ExampleDocWidget>({ namespace });

    // Handle state restoration.
    if (restorer) {
      // When restoring the app, if the document was open, reopen it
      restorer.restore(tracker, {
        command: 'docmanager:open',
        args: widget => ({ path: widget.context.path, factory: FACTORY }),
        name: widget => widget.context.path
      });
    }

    // register the filetype
    app.docRegistry.addFileType({
      name: 'example',
      displayName: 'Example',
      mimeTypes: ['text/json', 'application/json'],
      extensions: ['.example'],
      fileFormat: 'text',
      contentType: 'exampledoc' as any
    });

    // Creating and registering the shared model factory
    // As the third-party jupyter-collaboration package is not part of JupyterLab core,
    // we should support collaboration feature absence.
    if (drive) {
      const sharedExampleFactory = () => {
        return ExampleDoc.create();
      };
      drive.sharedModelFactory.registerDocumentFactory(
        'exampledoc',
        sharedExampleFactory
      );
    }

    // Creating and registering the model factory for our custom DocumentModel
    const modelFactory = new ExampleDocModelFactory();
    app.docRegistry.addModelFactory(modelFactory);

    // Creating the widget factory to register it so the document manager knows about
    // our new DocumentWidget
    const widgetFactory = new ExampleWidgetFactory({
      name: FACTORY,
      modelName: 'example-model',
      fileTypes: ['example'],
      defaultFor: ['example']
    });

    // Add the widget to the tracker when it's created
    widgetFactory.widgetCreated.connect((sender, widget) => {
      // Notify the instance tracker if restore data needs to update.
      widget.context.pathChanged.connect(() => {
        tracker.save(widget);
      });
      tracker.add(widget);
    });

    // Registering the widget factory
    app.docRegistry.addWidgetFactory(widgetFactory);
  }
};

export default extension;
