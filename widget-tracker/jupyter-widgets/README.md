# Jupyter Widgets: Adding Interactive Elements

A lot of advanced functionality in Jupyter notebooks comes in the form of
jupyter widgets (ipython widgets). Jupyter widgets are elements that have one
representation in a kernel and another representation in the JupyterLab
frontend code. Imagine having a large dataset in the kernel that we want to
examine and modify interactively. In this case, the frontend part of the widget
can be changed and updates synchronously the kernel data. Many other widget
types are available and can give an app-like feeling to a Jupyter notebook.
These widgets are therefore ideal component of a JupyterLab extension.

We show in this extension how the ipywidget `qgrid` can be integrated into
JupyterLab. As a first step, install `ipywidgets` and `grid`. It should work
in a similar way with any other ipywidget.

(These are the commands to install the ipywidgets with anaconda:

```bash
conda install -c conda-forge ipywidgets
conda install -c conda-forge qgrid
jupyter labextension install @jupyter-widgets/JupyterLab-manager
jupyter labextension install qgrid
```

)

Before continuing, test if you can (a) open a notebook, and (b) see a table
when executing these commands in a cell:

```bash
import pandas as pd
import numpy as np
import qgrid
df = pd.DataFrame(np.arange(25).reshape(5, 5))
qgrid.show_grid(df)
```

If yes, we can check out how we can include this table in our own app. Similar
to the previous Extension, we will use the `OutputArea` class to display the
widget. Only some minor adjustments have to be made to make it work.

The first thing is to understand the nature of the jupyter-widgets JupyterLab
extension (called `jupyterlab-manager`). As this text is written (26/6/2018) it
is a _document_ extension and not a general extension to JupyterLab. This means
it provides extra functionality to the notebook document type and not the the
full Jupyterlab app. The relevant lines from the jupyter-widgets source code
that show how it registers its renderer with Jupyterlab are the following:

```ts
export class NBWidgetExtension implements INBWidgetExtension {
  /**
   * Create a new extension object.
   */
  createNew(
    nb: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    let wManager = new WidgetManager(context, nb.rendermime);
    this._registry.forEach(data => wManager.register(data));
    nb.rendermime.addFactory(
      {
        safe: false,
        mimeTypes: [WIDGET_MIMETYPE],
        createRenderer: options => new WidgetRenderer(options, wManager)
      },
      0
    );
    return new DisposableDelegate(() => {
      if (nb.rendermime) {
        nb.rendermime.removeMimeType(WIDGET_MIMETYPE);
      }
      wManager.dispose();
    });
  }

  /**
   * Register a widget module.
   */
  registerWidget(data: base.IWidgetRegistryData) {
    this._registry.push(data);
  }
  private _registry: base.IWidgetRegistryData[] = [];
}
```

The `createNew` method of `NBWidgetExtension` takes a `NotebookPanel` as input
argument and then adds a custom mime renderer with the command
`nb.rendermime.addFactory` to it. The widget renderer (or rather RenderFactory)
is linked to the `WidgetManager` that stores the underlying data of the
jupyter-widgets. Unfortunately, this means that we have to access
jupyter-widgets through a notebook because its renderer and WidgetManager are
attached to it.

To access the current notebook, we can use an `INotebookTracker` in the
plugin's activate function:

```ts
// src/index.ts#L32-L45

const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-widgets',
  autoStart: true,
  requires: [ICommandPalette, INotebookTracker, ILauncher, IMainMenu],
  activate: activate
};

function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  tracker: INotebookTracker,
  launcher: ILauncher,
  mainMenu: IMainMenu
) {
```

We then pass the `rendermime` registry of the notebook (the one that has the
jupyter-widgets renderer added) to our panel:

```ts
// src/index.ts#L52-L72

function createPanel() {
  let current = tracker.currentWidget;
  if (!current) {
    return;
  }

  console.log(current.content.rendermime);

  return manager.ready
    .then(() => {
      if (!current) {
        return;
      }
      panel = new TutorialPanel(manager, current.content.rendermime);
      return panel.session.ready;
    })
    .then(() => {
      shell.add(panel, 'main');
      return panel;
    });
}
```

Finally we add a command to the registry that executes the code `widget` that
displays the variable `widget` in which we are going to store the qgrid widget:

```ts
// src/index.ts#L93-L101

let code = 'widget';
command = CommandIDs.execute;
commands.addCommand(command, {
  label: 'Ex4b: show widget',
  caption: 'show ipython widget',
  execute: () => {
    panel.execute(code);
  }
});
```

To render the Output we have to allow the `OutputAreaModel` to use non-default
mime types, which can be done like this:

```ts
// src/panel.ts#L44-L44

this._outputareamodel = new OutputAreaModel({ trusted: true });
```

The final output looks is demonstrated in the gif below. We also show that we
can attach a console to a kernel, that shows all executed commands, including
the one that we send from our Extension.

![Qgrid widget](_images/qgrid_widget.gif)

[Click here for the final extension: jupyter-widgets](jupyter-widgets)
