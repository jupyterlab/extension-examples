# Menus

> Add a Menu to the main app.

![New Menu](preview.png)

One major concept of the Lumino library on which JupyterLab is built is
the notion of _Commands_ as explained in the [commands example](../commands/README.md).
One of the possibilities offered to the user to trigger that command is to call it from
a menu item.

Adding new menu item works in a similar way to the [command palette](../command-palette/README.md).
The `IMainMenu` interface can be requested as a new argument to the `activate`
function, but first it has to be imported. And the class `Menu` to create new
menu needs also to be imported but from the Lumino library:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L6-L8

import { IMainMenu } from '@jupyterlab/mainmenu';

import { Menu } from '@lumino/widgets';
```
<!-- prettier-ignore-end -->

You can add the `IMainMenu` in the `requires:` property such that it is injected into
the `activate` function. The extension looks like:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L15-L57

const extension: JupyterFrontEndPlugin<void> = {
  id: 'main-menu',
  autoStart: true,
  requires: [ICommandPalette, IMainMenu],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    mainMenu: IMainMenu
  ) => {
    const { commands } = app;

    // Add a command
    const command = 'jlab-examples:main-menu';
    commands.addCommand(command, {
      label: 'Execute jlab-examples:main-menu Command',
      caption: 'Execute jlab-examples:main-menu Command',
      execute: (args: any) => {
        console.log(
          `jlab-examples:main-menu has been called ${args['origin']}.`
        );
        window.alert(
          `jlab-examples:main-menu has been called ${args['origin']}.`
        );
      },
    });

    // Add the command to the command palette
    const category = 'Extension Examples';
    palette.addItem({
      command,
      category,
      args: { origin: 'from the palette' },
    });

    // Create a menu
    const tutorialMenu: Menu = new Menu({ commands });
    tutorialMenu.title.label = 'Main Menu Example';
    mainMenu.addMenu(tutorialMenu, { rank: 80 });

    // Add the command to the menu
    tutorialMenu.addItem({ command, args: { origin: 'from the menu' } });
  },
};
```
<!-- prettier-ignore-end -->

In this extension, you have the dependencies to _@jupyterlab/mainmenu_ and
_@lumino/widgets_. Before it builds, this dependencies have to be added to the
`package.json` file. This is done invoking the following command:

```bash
jlpm add @jupyterlab/mainmenu @lumino/widgets
```

After the execution of that command, `package.json` should list them in the
`dependencies`:

```json5
// package.json#L50-L54

"dependencies": {
  "@jupyterlab/application": "^3.0.11",
  "@jupyterlab/mainmenu": "^3.0.9",
  "@lumino/widgets": "^1.16.1"
},
```

With this extension installed, a new menu _Main Menu Example_ should be present. And when
clicking on the menu item _jlab-examples:main-menu_, the following text should appear
in the web browser console.

```
jlab-examples:main-menu has been called from the menu.
```
