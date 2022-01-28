import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ToolbarButton } from '@jupyterlab/apputils';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import {
  NotebookActions,
  NotebookPanel,
  INotebookModel,
} from '@jupyterlab/notebook';

/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  activate,
  id: 'toolbar-buttons',
  autoStart: true,
};

/**
 * A notebook widget extension that adds a button to the toolbar.
 */
 export class NotebookButtonExtension
 implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
 /**
  * Create a new extension for the notebook panel widget.
  *
  * @param panel Notebook panel
  * @param context Notebook context
  * @returns Disposable on the added button
  */
 createNew(
   panel: NotebookPanel,
   context: DocumentRegistry.IContext<INotebookModel>
 ): IDisposable {
   const clearOutput = () => {
     NotebookActions.clearAllOutputs(panel.content);
   };
   const button = new ToolbarButton({
     className: 'clear-output-button',
     label: 'Clear All Outputs',
     onClick: clearOutput,
     tooltip: 'Clear All Outputs',
   });

   panel.toolbar.insertItem(10, 'clearOutputs', button);
   return new DisposableDelegate(() => {
     button.dispose();
   });
 }
}

/**
 * An editor widget extension that adds a button to the toolbar.
 */
export class EditorButtonExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  /**
   * Create a new extension for the editor panel widget.
   *
   * @param panel Editor panel
   * @param context Editor context
   * @returns Disposable on the added button
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const testCommand = () => {
      console.log('TESTING BUTTON');
    };
    const button = new ToolbarButton({
      className: 'run-test-command',
      label: 'Test Command',
      onClick: testCommand,
      tooltip: 'Test Command',
    });

    if (context.path.endsWith('.tex')) {
      panel.toolbar.insertItem(10, 'clearOutputs', button);
    }
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

/**
 * Activate the extension.
 *
 * @param app Main application object
 */
 function activate(app: JupyterFrontEnd): void {
  app.docRegistry.addWidgetExtension('Notebook', new NotebookButtonExtension());
  app.docRegistry.addWidgetExtension('Editor', new EditorButtonExtension());
}

/**
 * Export the plugin as default.
 */
export default plugin;
