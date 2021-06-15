import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { WidgetTracker, IWidgetTracker } from '@jupyterlab/apputils';

import { Token } from '@lumino/coreutils';

import { ExampleWidgetFactory, ExampleDocModelFactory } from './factory';

import { ExampleDocWidget } from './widget';

/**
 * The name of the factory that creates editor widgets.
 */
const FACTORY = 'Example editor';

type ExampleDocTracker = IWidgetTracker<ExampleDocWidget>;

export const IExampleDocTracker = new Token<ExampleDocTracker>(
  'exampleDocTracker'
);

/**
 * Initialization data for the hello-world extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'documents',
  autoStart: true,
  requires: [ILayoutRestorer],
  provides: IExampleDocTracker,
  activate: (app: JupyterFrontEnd, restorer: ILayoutRestorer) => {
    const namespace = 'example';
    const tracker = new WidgetTracker<ExampleDocWidget>({ namespace });

    // Handle state restoration.
    if (restorer) {
      restorer.restore(tracker, {
        command: 'docmanager:open',
        args: widget => ({ path: widget.context.path, factory: FACTORY }),
        name: widget => widget.context.path
      });
    }

    const widgetFactory = new ExampleWidgetFactory({
      name: FACTORY,
      modelName: 'example-model',
      fileTypes: ['example'],
      defaultFor: ['example']
    });

    widgetFactory.widgetCreated.connect((sender, widget) => {
      // Notify the instance tracker if restore data needs to update.
      widget.context.pathChanged.connect(() => {
        tracker.save(widget);
      });
      tracker.add(widget);
    });
    app.docRegistry.addWidgetFactory(widgetFactory);

    const modelFactory = new ExampleDocModelFactory();
    app.docRegistry.addModelFactory(modelFactory);

    // register the filetype
    app.docRegistry.addFileType({
      name: 'example',
      displayName: 'Example',
      mimeTypes: ['text/json', 'application/json'],
      extensions: ['.example'],
      fileFormat: 'text',
      contentType: 'file'
    });
  }
};

export default extension;
