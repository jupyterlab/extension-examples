import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer,
} from '@jupyterlab/application';

import { WidgetTracker, IWidgetTracker } from '@jupyterlab/apputils';

import { Token } from '@lumino/coreutils';

import { ExampleWidgetFactory, ExampleDocModelFactory } from './factory';

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
  autoStart: true,
  requires: [ILayoutRestorer],
  provides: IExampleDocTracker,
  activate: (app: JupyterFrontEnd, restorer: ILayoutRestorer) => {
    // Namespace for the tracker
    const namespace = 'documents-example';
    // Creating the tracker for the document
    const tracker = new WidgetTracker<ExampleDocWidget>({ namespace });

    // Handle state restoration.
    if (restorer) {
      // When restoring the app, if the document was open, reopen it
      restorer.restore(tracker, {
        command: 'docmanager:open',
        args: (widget) => ({ path: widget.context.path, factory: FACTORY }),
        name: (widget) => widget.context.path,
      });
    }

    // Creating the widget factory to register it so the document manager knows about
    // our new DocumentWidget
    const widgetFactory = new ExampleWidgetFactory({
      name: FACTORY,
      modelName: 'example-model',
      fileTypes: ['example'],
      defaultFor: ['example'],
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

    // Creating and registering the model factory for our custom DocumentModel
    const modelFactory = new ExampleDocModelFactory();
    app.docRegistry.addModelFactory(modelFactory);

    // register the filetype
    app.docRegistry.addFileType({
      name: 'example',
      displayName: 'Example',
      mimeTypes: ['text/json', 'application/json'],
      extensions: ['.example'],
      fileFormat: 'text',
      contentType: 'file',
    });
  },
};

export default extension;
