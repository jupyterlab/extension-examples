import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ToolbarButton } from '@jupyterlab/apputils';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import {
  NotebookPanel,
  INotebookModel,
} from '@jupyterlab/notebook';

/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  activate,
  id: 'toolbar-button',
  autoStart: true,
};

/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export class ButtonExtension
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
    const testCommand = () => {
      console.log('TESTING BUTTON');
    };
    const button = new ToolbarButton({
      className: 'run-test-command',
      label: 'Test Command',
      onClick: testCommand,
      tooltip: 'Test Command',
      enabled: context.path.endsWith('.tex')
    });

    panel.toolbar.insertItem(10, 'clearOutputs', button);
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
  app.docRegistry.addWidgetExtension('Editor', new ButtonExtension());
}

/**
 * Export the plugin as default.
 */
export default plugin;
