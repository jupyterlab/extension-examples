# clear cell outputs

This example shows how to clear all cell outputs at once by clicking on the button.

![Github Actions Status](https://github.com/yash112-lang/extension-examples/blob/master/clear_cell_outputs/Preview.gif)

<!-- A JupyterLab extension for clearing all cells output at once. -->

To use it first we need to import the packages
```
import { ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { NotebookActions, NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { IDisposable, DisposableDelegate } from '@lumino/disposable';
```

Firstly we have to register the plugin information. In this we have to pass a activate **function** & the plugin **id**.

```
const plugin: JupyterFrontEndPlugin<void> = {
  activate,
  id: 'clear-cell-outputs:buttonPlugin',
  autoStart: true
};
```
Now creating a notebook widget extension that adds a button to the toolbar. For more info [IWidgetExtension](https://jupyterlab.readthedocs.io/en/latest/api/interfaces/docregistry.documentregistry.iwidgetextension.html)

```
export
  class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  
   // Create a new extension object.
   
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    let clearOutput = () => {
      NotebookActions.clearAllOutputs(panel.content);
    };
    let button = new ToolbarButton({
      className: 'clear-output-button',
      label: 'Clear All Outputs',
      onClick: clearOutput,
      tooltip: 'Clear All Outputs'
    });

    panel.toolbar.insertItem(10, 'clearOutputs', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}
```
Now activating the extension
```
function activate(app: JupyterFrontEnd) {
  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
};
```

## Requirements

* JupyterLab >= 3.0

## Install

To install the extension, execute:

```bash
pip install clear_cell_outputs
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall clear_cell_outputs
```

