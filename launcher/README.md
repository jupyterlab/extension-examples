# Start your extension from the launcher

In this example, you will learn how to start your extension from the launcher and how to have optional
dependencies to JupyterLab features.

![Launcher example](preview.png)

> Acknowledgement: This example is copied from Jeremy Tuloup [Python file extension](https://github.com/jtpio/jupyterlab-python-file).

In this example, you will add the ability to create an empty Python file. To do so,
your extension will use two commands defined by the [documents manager](https://github.com/jupyterlab/jupyterlab/blob/master/packages/docmanager-extension/src/index.ts#L47-L75) of JupyterLab:

- `'docmanager:new-untitled'`: Create new untitled document
- `'docmanager:open'`: Open a document

The command will create a new Python file and then open it:

```ts
// src/index.ts#L36-L58

commands.addCommand(CommandIDs.createNew, {
  label: args => (args['isPalette'] ? 'New Python File' : 'Python File'),
  caption: 'Create a new Python file',
  iconClass: args => (args['isPalette'] ? '' : ICON_CLASS),
  execute: async args => {
    // Get the directory in which the Python file must be created;
    // otherwise take the current filebrowser directory
    let cwd = args['cwd'] || browserFactory.defaultBrowser.model.path;

    // Create a new untitled python file
    const model = await commands.execute('docmanager:new-untitled', {
      path: cwd,
      type: 'file',
      ext: 'py'
    });

    // Open the newly created file with the 'Editor'
    return commands.execute('docmanager:open', {
      path: model.path,
      factory: FACTORY
    });
  }
});
```

To link that command to the JupyterLab launcher, the `ILauncher` interface needs to be passed to the `activate`
extension function. As that interface is provided by the `@jupyterlab/launcher` package, it needs first to be installed:

```bash
jlpm add @jupyterlab/launcher
```

Then you can use it in the extension by importing it:

```ts
// src/index.ts#L10-L10

import { ILauncher } from '@jupyterlab/launcher';
```

And finally you can request it as extension dependency:

```ts
// src/index.ts#L22-L33

const extension: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/launcher',
  autoStart: true,
  optional: [ILauncher, IMainMenu, ICommandPalette],
  requires: [IFileBrowserFactory],
  activate: (
    app: JupyterFrontEnd,
    browserFactory: IFileBrowserFactory,
    launcher: ILauncher | null,
    menu: IMainMenu | null,
    palette: ICommandPalette | null
  ) => {
```

In this example, the `ILauncher` interface is requested as optional dependency and not as classical dependency. This allow other application without launcher to be able
to use your extension.  
If the application is unable to provide an optional interface, it will take a `null`
value.  
Therefore before adding the command to the launcher, you need to check if the `launcher`
variable is not `null`:

```ts
// src/index.ts#L60-L67

// Add the command to the launcher
if (launcher) {
  launcher.add({
    command: CommandIDs.createNew,
    category: 'Other',
    rank: 1
  });
}
```

## Where to Go Next

This example uses a _command_. This is an essential concept of JupyterLab. To know more about it
have a look at the [command example](../commands/README.md).

As seen in this example too, an user can execute a command from other UI elements than the launcher. To
know more about those other possible, you could look at the following examples:

- Add the command to the [command palette](../command-palette/README.md)
- Add the command to a [menu](../main-menu/README.md)
- Add the command to a [context menu](../context-menu/README.md)
