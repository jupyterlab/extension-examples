


import { ToolbarButton } from "@jupyterlab/apputils";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { INotebookModel, NotebookPanel } from "@jupyterlab/notebook";
import { IDisposable } from "@lumino/disposable";

export class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {

  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    // Create the toolbar button
    let clearButton = new ToolbarButton({
        label: 'Clear all outputs',
        onClick: () => alert('Cleared all outputs!')
    });

    // Add the toolbar button to the notebook toolbar
    panel.toolbar.insertItem(10, 'mybutton', clearButton);

    // The ToolbarButton class implements `IDisposable`, so the
    // button *is* the extension for the purposes of this method.
    return clearButton;
  }
}


import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

const clearOutput: JupyterFrontEndPlugin<void> = {
  id: '@your-org/plugin-name',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    const clearOutput = new ButtonExtension();
    app.docRegistry.addWidgetExtension('Notebook', clearOutput);
  }
}

export default clearOutput;