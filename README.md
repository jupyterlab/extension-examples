# Jupyterlab Extensions Walkthrough #

## Table of Contents ##

* [Prerequesites](#prerequesites)
* [Extension 1: Setting up the development environment](#extension-1-setting-up-the-development-environment)
  * [The template folder structure](#the-template-folder-structure)
  * [A minimal extension that prints to the browser console](#a-minimal-extension-that-prints-to-the-browser-console)
  * [Building and Installing an Extension](#building-and-installing-an-extension)
* [Extension 2: Adding Commands, modifying Menus](#extension-2-adding-commands-modifying-menus)
  * [Jupyterlab Commands](#jupyterlab-commands)
  * [Adding new Menu tabs and items](#adding-new-menu-tabs-and-items)
* [Extension 3: Adding Widgets](#extension-3-adding-widgets)
  * [A basic tab](#a-basic-tab)
* [Extension 4: A simple datagrid](#extension-4-a-simple-datagrid)
* [Extension 5: Buttons and Signals]()


## Prerequesites ##

This is a short tutorial series on how to write jupyterlab extensions. Writing
an extension is not particularly difficult but requires a very basic knowledge
of javascript and typescript.

_Don't be scared of typescript, I never coded in typescript before I touched 
jupyterlab but found it easier to understand than pure javascript if you have a 
basic understanding of object oriented programming and types._

## Extension 1: Setting up the development environment ##

#### The template folder structure ####

Writing a jupyterlab extension usually starts from a configurable template. It
can be downloded with the `cookiecutter` tool:

```bash
cookiecutter https://github.com/jupyterlab/extension-cookiecutter-ts
```

It asks for some basic information that could for example be setup like this:
```bash
author_name []: tuto
extension_name [jupyterlab_myextension]: extension1
project_short_description [A JupyterLab extension.]: minimal lab example
repository [https://github.com/my_name/jupyterlab_myextension]: 
```

The cookiecutter creates the directory `extension1` [or your extension name]
that looks like this:

```bash
extension1/

├── README.md
├── package.json
├── tsconfig.json
├── src
│   └── index.ts
└── style
    └── index.css
```

* `README.md` contains some instructions
* `package.json` contains information about the extension such as dependencies
* `tsconfig.json` contains information for the typescript compilation
* `src/index.ts` _this contains the actual code of our extension_
* `style/index.css` contains style elements that we can use

What does this extension do?


#### A minimal extension that prints to the browser console ####

Well, let's have a step by step look at
`src/index.ts`. The file begins with an import section:

```typescript
import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';
```

`JupyterLab` is the main application class that will allow us to interact and
modify Jupyterlab. The `JupyterLabPlugin` is the class of the extension that we
are building. Both are imported from a module called `@jupyterlab/application`.
The dependency of our extension on this module is declared in the
`package.json` file:
```json
[...]
  "dependencies": {
    "@jupyterlab/application": "^0.16.0"
  },
[...]
```

With this basic import setup, we can move on to construct a new instance
of the `JupyterLabPlugin` class:

```typescript
const extension: JupyterLabPlugin<void> = {
  id: 'extension1',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension extension1 is activated!');
  }
};

export default extension;
```

a JupyterLabPlugin takes a few attributes when constructed that are fairly
self-explanatory in the case of `id` and `autoStart`. The `activate`
attribute links to a function (`() => {}` notation) that takes one 
argument `app` of type `JupyterLab` and then calls the
`console.log` function that is used to output something into the browser
console in javascript. This simple example shows the basic approach when
writing a jupyterlab extension. The activate function acts as an entry point
and gets the main JupyterLab application instance passed as an argument, which
allows us to interact and modify it. Finally our new `JupyterLabPlugin`
instance has to be exported to be visible to JupyterLab.

This brings us to the next point. How can we plug this extension into
JupyterLab?

#### Building and Installing an Extension ####

Let's look at the `README.md` file. It contains instructions how
our labextension can be installed for development:

_For a development install (requires npm version 4 or later), do the following 
in the repository directory:_

```bash
npm install
npm run build
jupyter labextension link .
```

Roughly the first command installs dependencies that are specified in 
`package.json`. Among the dependencies are also all of the `jupyterlab` 
components that we want to use in our project, but more about this later.
The second step runs the build script. In this step, the typescript code gets
converted to javascript using the compiler `tsc` and stored in a `lib`
directory. Finally, we link the module to jupyterlab.

After all of these steps are done, running
```bash
jupyter labextension list
```
should now show something like:
```bash
   local extensions:
        extension1: [...]/labextension_tutorial/extension1
```

Now let's check inside of jupyterlab if it works. Run [can take a while]:

```bash
jupyter lab --watch
```

Our extension doesn't do much so far, it just writes something to the browser
console. So let's check if it work. In firefox you can open the console
pressing the `f12` key. You should see something like:

```
JupyterLab extension extension1 is activated
```

Our extension works but it is incredibly boring. Let's start with the
development and modify the source code a bit. Simply replace the `activate`
function with the following lines:

```typescript
    activate: (app: JupyterLab) => {
        console.log('the JupyterLab main application:');
        console.log(app);
    }
```

to update the module, we simply need to go into the extension directory and
run again:

```bash
npm run build
```

Since we used the `--watch` option when starting jupyterlab, we now only have
to refresh the jupyterlab website and should see in the browser console:

```
Object { _started: true, _pluginMap: {…}, _serviceMap: Map(28), _delegate: {…}, commands: {…}, contextMenu: {…}, shell: {…}, registerPluginErrors: [], _dirtyCount: 0, _info: {…}, … } index.js:12
```

This is the main application JupyterLab object and we will see how to interact
with it in the next section. We see a few of it's attributes.

An overview of the classes and their attributes and methods can be found in the jupyterlab
documentation. The `@jupyterlab/application` module documentation is
[here](https://jupyterlab.github.io/jupyterlab/modules/_application_src_index_.html)
and which links to the [JupyterLab class](https://jupyterlab.github.io/jupyterlab/classes/_application_src_index_.jupyterlab.html).
The `JupyterLabPlugin` is a type alias [a new name] for the type `IPlugin`.
The definition of `IPlugin` is more difficult to find because it is defined by
the `phosphor.js` library that runs jupyterlab under the hood
(more about this later). Its documentation is therefore located on the
[phosphor.js website](http://phosphorjs.github.io/phosphor/api/application/interfaces/iplugin.html)


[Click here for the final extension1](extension1)

## Extension 2: Adding Commands, modifying Menus ##

For the next extension you can either copy the last folder to a new one or 
simply continue modifying it. In case that you want to have a new extension,
open the file `package.json` and modify the package name, e.g. into 
`extension2`. The same name change needs to be done in `src/index.ts`.

#### Jupyterlab Commands ####

If you don't have jupyterlab open, start it with `jupyter lab --watch`. In this
extension, we are going to add a command to the application command registry
and expose it to the user in the command palette.
The command palette can be seen when clicking on _Commands` on the left hand
side of Jupyterlab. The command palette can be seen as a list of actions that
can be executed by jupyterlab. (see screenshot below).

![Jupyter Command Registry](images/command_registry.png)

Often, extension provide some new functions to jupyterlab to the
applications command registry and then expose them to the user through the
command palette or through a menu item.

Two types play a role in this: the `CommandRegistry` type ([documentation](http://phosphorjs.github.io/phosphor/api/commands/classes/commandregistry.html))
and the command palette interface `ICommandPalette` that has to be imported:

```typescript
import {
  ICommandPalette
} from '@jupyterlab/apputils';
```

Let's see how we access the applications command registry and command palette:
to do this, open the file `src/index.ts`.

The CommandRegistry is simply an attribute of the JupyterLab application (variable
`app` in the previous section). It provides a function `addCommand` to add our
own functionality.
The ICommandPalette ([documentation](https://jupyterlab.github.io/jupyterlab/interfaces/_apputils_src_commandpalette_.icommandpalette.html))
needs to be passed in addition to the JupyterLab application (variable `app`)
as second argument (variable `palette`) to the activate function. We specify
with the property `requires: [ICommandPalette],` which additional arguments we
pass to the `activate` function in the JupyterLabPlug. The ICommandPalette
provides the method `addItem` that links a palette entry to a command in the
command registry. Our new plugin code then becomes:

```typescript
const extension: JupyterLabPlugin<void> = {
    id: 'extension2',
    autoStart: true,
    requires: [ICommandPalette],
    activate: (
        app: JupyterLab,
        palette: ICommandPalette) =>
    {
        const { commands } = app;

        let command = 'labtutorial';
        let category = 'Tutorial';

        commands.addCommand(command, {
            label: 'New Labtutorial',
            caption: 'Open the Labtutorial',
            execute: (args) => {console.log('Hey')}});

        palette.addItem({command, category});
    }
};

export default extension;
```

When this extension is build (and linked if necessary), jupyterlab looks like
this:

![New Command](images/new_command.png)

#### Adding new Menu tabs and items ####

Adding new menu items works in a similar way. The IMainMenu interface can be
passed as a new argument two the activate function, but first it has to be
imported, together with the Menu phosphor type that describes a new tab:

```typescript
import {
  IMainMenu
} from '@jupyterlab/mainmenu';

import {
  Menu
} from '@phosphor/widgets';
```

We add the IMainMenu in the `requires:` property and can then change the
extension to:

```typescript
const extension: JupyterLabPlugin<void> = {
    id: 'extension2',
    autoStart: true,
    requires: [ICommandPalette, IMainMenu],
    activate: (
        app: JupyterLab,
        palette: ICommandPalette,
        mainMenu: IMainMenu) =>
    {
        const { commands } = app;
        let command = 'labtutorial';
        let category = 'Tutorial';
        commands.addCommand(command, {
            label: 'New Labtutorial',
            caption: 'Open the Labtutorial',
            execute: (args) => {console.log('Hey')}});
        palette.addItem({command, category});


        let tutorialMenu: Menu = new Menu({commands});

        tutorialMenu.title.label = 'Tutorial';
        mainMenu.addMenu(tutorialMenu, {rank: 80});
        tutorialMenu.addItem({ command });
    }
};

export default extension;
```

In this extension, we have added a new dependency _jupyterlab/mainmenu_. Before
it builds, this dependency has to be added to the `package.json` file:

```json
  "dependencies": {
    "@jupyterlab/application": "^0.16.0",
    "@jupyterlab/mainmenu": "*"
  }
```

we can then do

```
npm install
npm run build
```

to rebuild the application. A refresh of the jupyterlab website should now show:

![New Menu](images/new_menu.png)

[the `tsconfig.json` file might have to be updated to:
```
{
  "compilerOptions": {
    "declaration": true,
    "noImplicitAny": true,
    "noEmitOnError": true,
    "noUnusedLocals": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "target": "ES6",
    "outDir": "./lib",
    "lib": ["ES6", "ES2015.Promise", "DOM"],
    "types": []
  },
  "include": ["src/*"]
}
```
]

[Click here for the final extension1](extension2)


## Extension 3: Adding Widgets ##

Woo finally we are going to do some real stuff and add a new tab to jupyterlab.
Particular visible elements such as a tab are represented by widgets in the
phosphor library that is the basis of the jupyterlab application.

#### A basic tab ####

The base
widget class can be imported with:

```typescript
import {
    Widget
} from '@phosphor/widgets';
```

a Widget can be added to the main area through the `shell` that can be accessed
as a property of the `app` variable that represents the main jupyterlab
application. Inside of our previous activate function, this looks like this:

```
    activate: (
        app: JupyterLab,
        palette: ICommandPalette,
        mainMenu: IMainMenu) =>
    {
        const { commands, shell } = app;
        let command = 'ex3:labtutorial';
        let category = 'Tutorial';
        commands.addCommand(command, {
            label: 'Ex3 command',
            caption: 'Open the Labtutorial',
            execute: (args) => {
                const widget = new TutorialView();
                shell.addToMainArea(widget);}});
        palette.addItem({command, category});

        let tutorialMenu: Menu = new Menu({commands});

        tutorialMenu.title.label = 'Tutorial';
        mainMenu.addMenu(tutorialMenu, {rank: 80});
        tutorialMenu.addItem({ command });
    }
```

Defining the custom widget `TutorialView`) is straight-forward as well:

```typescript
class TutorialView extends Widget {
    constructor() {
        super();
        this.addClass('jp-tutorial-view')
        this.id = 'tutorial'
        this.title.label = 'Tutorial View'
        this.title.closable = true;
    }
}
```

Note that we have used a custom css class that is defined in the file
`style/index.css` as:

```
.jp-tutorial-view {
    background-color: AliceBlue;
}
```

Our custom tab can be started in jupyterlab from the command palette and looks
like this:

![Custom Tab](images/custom_tab.png)

[Click here for the Widget extension3](extension3)


## Extension 4: A simple datagrid ##

Now let's do something a little more fancy. Jupyterlab is build on top of
Phosphor.js. Let's see if we can plug [this phosphor example](http://phosphorjs.github.io/examples/datagrid/)
into jupyterlab. We start by importing the `Panel` widget and the `DataGrid`
and `DataModel` classes from phosphor.

```typescript
import {
    Panel
} from '@phosphor/widgets';

import {
  DataGrid, DataModel
} from '@phosphor/datagrid';
```

The Panel widget can hold several sub-widgets that are added with its
`.addWidget` property. `DataModel` is a class that provides data that is
shown in the `DataGrid` widget.

With these three classes, we adapt the `TutorialView` as follows:

```typescript
class TutorialView extends Panel {
    constructor() {
        super();
        this.addClass('jp-tutorial-view')
        this.id = 'tutorial'
        this.title.label = 'Tutorial View'
        this.title.closable = true;

        let model = new LargeDataModel();
        let grid = new DataGrid();
        grid.model = model;

        this.addWidget(grid);
    }
}
```

That's rather easy. Let's now dive into the `DataModel` class that is taken
from the official phosphor.js example. The first few lines look like this:

```typescript
class LargeDataModel extends DataModel {

  rowCount(region: DataModel.RowRegion): number {
    return region === 'body' ? 1000000000000 : 2;
  }

  columnCount(region: DataModel.ColumnRegion): number {
    return region === 'body' ? 1000000000000 : 3;
  }
```

While it is fairly obvious that `rowCount` and `columnCount` are supposed
to return some number of rows and columns, it is a little more cryptic what
the `RowRegion` and the `ColumnRegion` input arguments are. Let's have a
look at their definition in the phosphor.js source code:

```typescript
  export
  type RowRegion = 'body' | 'column-header';

  /**
   * A type alias for the data model column regions.
   */
  export
  type ColumnRegion = 'body' | 'row-header';

  /**
   * A type alias for the data model cell regions.
   */
  export
  type CellRegion = 'body' | 'row-header' | 'column-header' | 'corner-header';
```

The meaning of these lines might be obvious for experienced users of typescript
or Haskell. The `|` can be read as or, so the `RowRegion` type is either `body`
or `column-header`. This explains what the `rowCount` and `columnCount`
functions do: They define a table with `2` header rows, with 3 index columns,
with `1000000000000` rows and `1000000000000` columns.

The remaining part of the class defines the row and column number as
data values and adds a letter prefix in case that we are in any of the
header regions:

```
  data(region: DataModel.CellRegion, row: number, column: number): any {
    if (region === 'row-header') {
      return `R: ${row}, ${column}`;
    }
    if (region === 'column-header') {
      return `C: ${row}, ${column}`;
    }
    if (region === 'corner-header') {
      return `N: ${row}, ${column}`;
    }
    return `(${row}, ${column})`;
  }
}
```

Let's see how this looks like in Jupyterlab:

![Datagrid](images/datagrid.png)

[Click here for extension4](extension4)


## Extension 5: Kernels, Buttons and Signals ##


[Click here for extension5](extension5)
