# clear cell outputs

This example shows how to clear all cell outputs at once by clicking on the button.

![Github Actions Status](https://github.com/yash112-lang/extension-examples/blob/master/clear_cell_outputs/Preview.gif)

To use it first we need to import the packages
```ts
// src/index.ts#L1-L19

import {
  IDisposable, DisposableDelegate
} from '@lumino/disposable';

import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  NotebookActions, NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';
```

Firstly we have to register the plugin information. In this we have to pass a activate **function** & the plugin **id**.

```ts
// src/index.ts#L25-L29
const plugin: JupyterFrontEndPlugin<void> = {
  activate,
  id: 'clear-cell-outputs:buttonPlugin',
  autoStart: true
};
```
Now creating a notebook widget extension that adds a button to the toolbar. For more info [IWidgetExtension](https://jupyterlab.readthedocs.io/en/latest/api/interfaces/docregistry.documentregistry.iwidgetextension.html)

```ts
// src/index.ts#L35-L56
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
```ts
// src/index.ts#L61-L63
function activate(app: JupyterFrontEnd) {
  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
};
```
