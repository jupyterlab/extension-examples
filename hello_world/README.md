# Hello World - Setting up the development environment

Minimal lab extension that prints to the console

* [The template folder structure](#the-template-folder-structure)
* [A minimal extension that prints to the browser console](#a-minimal-extension-that-prints-to-the-browser-console)
* [Building and Installing an Extension](#building-and-installing-an-extension)

## The template folder structure ####

Writing a JupyterLab extension usually starts from a configurable template. It
can be downloded with the `cookiecutter` tool and the following command:

```bash
cookiecutter https://github.com/JupyterLab/extension-cookiecutter-ts
```

`cookiecutter` asks for some basic information that could for example be setup
like this:

```bash
author_name []: tuto
extension_name [JupyterLab_myextension]: hello_world
project_short_description [A JupyterLab extension.]: minimal lab example
repository [https://github.com/my_name/JupyterLab_myextension]: 
```

The cookiecutter creates the directory `hello_world` [or your extension name]
that looks like this:

```bash
hello_world/

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

What does this extension do? You don't need a PhD in Computer Science to take a
guess from the title of this section, but let's have a closer look:

## A minimal extension that prints to the browser console

We start with the file `src/index.ts`. This typescript file contains the main
logic of the extension. It begins with the following import section:

```typescript
import {
  JupyterLab, JupyterLabPlugin
} from '@JupyterLab/application';

import '../style/index.css';
```

`JupyterLab` is class of the main Jupyterlab application. It allows us to
access and modify some of its main components. `JupyterLabPlugin` is the class
of the extension that we are building. Both classes are imported from a package
called `@JupyterLab/application`. The dependency of our extension on this
package is declared in the file `package.json`:

```json
  "dependencies": {
    "@JupyterLab/application": "^0.16.0"
  },
```

With this basic import setup, we can move on to construct a new instance
of the `JupyterLabPlugin` class:

```typescript
const extension: JupyterLabPlugin<void> = {
  id: 'hello_world',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension hello_world is activated!');
  }
};

export default extension;
```

a JupyterLabPlugin contains a few attributes that are fairly self-explanatory
in the case of `id` and `autoStart`. The `activate` attribute links to a
function (`() => {}` notation) that takes one argument `app` of type
`JupyterLab` and then calls the `console.log` function that is used to output
something into the browser console in javascript. `app` is simply the main
JupyterLab application. The activate function acts as an entry point into the
extension and we will gradually extend it to access and modify functionality
through the `app` object.

Our new `JupyterLabPlugin` instance has to be finally exported to be visible to
JupyterLab, which is done with the line `export default extension`. This brings
us to the next point. How can we plug this extension into JupyterLab?

## Building and Installing an Extension

Let's look at the `README.md` file. It contains instructions how our
labextension can be installed for development:

> For a development install (requires npm version 4 or later), do the following
> in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

Roughly the first command installs the dependencies that are specified in
`package.json`. Among the dependencies are also all of the `JupyterLab`
components that we want to use in our project, but more about this later. The
second step runs the build script. In this step, the typescript code gets
converted to javascript using the compiler `tsc` and stored in a `lib`
directory. Finally, we link the module to JupyterLab.

After all of these steps are done, running `jupyter labextension list` should
now show something like:
```bash
   local extensions:
        hello_world: [...]/labextension_tutorial/hello_world
```

Now let's check inside of JupyterLab if it works. Run [can take a while]:

```bash
jupyter lab --watch
```

Our extension doesn't do much so far, it just writes something to the browser
console. So let's check if it worked. In firefox you can open the console
pressing the `f12` key. You should see something like:

```
JupyterLab extension hello_world is activated
```

Our extension works but it is incredibly boring. Let's  modify the source code
a bit. Simply replace the `activate` function with the following lines:

```typescript
    activate: (app: JupyterLab) => {
        console.log('the main JupyterLab application:');
        console.log(app);
    }
```

to update the module, we simply need to go into the extension directory and run
`npm run build` again. Since we used the `--watch` option when starting
JupyterLab, we now only have to refresh the JupyterLab website in the browser
and should see in the browser console:

```
Object { _started: true, _pluginMap: {…}, _serviceMap: Map(28), _delegate: {…}, commands: {…}, contextMenu: {…}, shell: {…}, registerPluginErrors: [], _dirtyCount: 0, _info: {…}, … } index.js:12
```

This is the main application JupyterLab object and we will see how to interact
with it in the next sections.


_checkout how the core packages of JupyterLab are defined at
https://github.com/JupyterLab/JupyterLab/tree/master/packages . Each package is
structured similarly to the extension that we are writing. This modular
structure makes JupyterLab very adapatable_

An overview of the classes and their attributes and methods can be found in the
JupyterLab documentation. The `@JupyterLab/application` module documentation is
[here](https://JupyterLab.github.io/JupyterLab/modules/_application_src_index_.html)
and which links to the [JupyterLab class](https://JupyterLab.github.io/JupyterLab/classes/_application_src_index_.JupyterLab.html).
The `JupyterLabPlugin` is a type alias [a new name] for the type `IPlugin`.
The definition of `IPlugin` is more difficult to find because it is defined by
the `phosphor.js` library that runs JupyterLab under the hood (more about this
later). Its documentation is therefore located on the [phosphor.js
website](http://phosphorjs.github.io/phosphor/api/application/interfaces/iplugin.html).

[Click here for the final extension: hello_world](hello_world)
