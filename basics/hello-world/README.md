# Hello World - Print to the console

This minimal JupyterLab extension explains how to set up the development environment and prints to the console

- [The template folder structure](#the-template-folder-structure)
- [A minimal extension that prints to the browser console](#a-minimal-extension-that-prints-to-the-browser-console)
- [Building and Installing an Extension](#building-and-installing-an-extension)

## The template folder structure

Writing a JupyterLab extension usually starts from a configurable template. It
can be downloaded with the [`cookiecutter`](https://cookiecutter.readthedocs.io/en/latest/) tool and the following command:

```bash
cookiecutter https://github.com/jupyterlab/extension-cookiecutter-ts
```

`cookiecutter` asks for some basic information that could for example be setup
like this:

```bash
author_name []: tuto
extension_name [myextension]: hello-world
project_short_description [A JupyterLab extension.]: minimal lab example
repository [https://github.com/my_name/myextension]:
```

The cookiecutter creates the directory `hello-world` [or your extension name]
that looks like this:

```bash
hello-world/

├── README.md
├── package.json
├── tsconfig.json
├── src
│   └── index.ts
└── style
    └── index.css
```

- `README.md` contains some instructions
- `package.json` contains information about the extension such as dependencies
- `tsconfig.json` contains information for the typescript compilation
- `src/index.ts` _this contains the actual code of our extension_
- `style/index.css` contains style elements that we can use

What does this extension do? You don't need a PhD in Computer Science to take a
guess from the title of this section, but let's have a closer look:

## A minimal extension that prints to the browser console

We start with the file `src/index.ts`. This typescript file contains the main
logic of the extension. It begins with the following import section:

```ts
// src/index.ts#L1-L4

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
```

`JupyterFrontEnd` is class of the main Jupyterlab application. It allows us to
access and modify some of its main components. `JupyterFrontEndPlugin` is the class
of the extension that we are building. Both classes are imported from a package
called `@jupyterlab/application`. The dependency of our extension on this
package is declared in the file `package.json`:

```json5
// package.json#L34-L36

"dependencies": {
  "@jupyterlab/application": "^1.0.0"
},
```

With this basic import setup, we can move on to construct a new instance
of the `JupyterFrontEndPlugin` class:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L9-L12

const extension: JupyterFrontEndPlugin<void> = {
  id: 'hello-world',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
```

```ts
// src/index.ts#L13-L13

console.log('the JupyterLab main application:');
```

```ts
// src/index.ts#L18-L18

export default extension;
```
<!-- prettier-ignore-end -->

a `JupyterFrontEndPlugin` contains a few attributes that are fairly self-explanatory
in the case of `id` and `autoStart`. The `activate` attribute links to a
function (`() => {}` notation) that takes one argument `app` of type
`JupyterFrontEnd` and then calls the `console.log` function that is used to output
something into the browser console in javascript. `app` is simply the main
JupyterLab application. The activate function acts as an entry point into the
extension and we will gradually extend it to access and modify functionality
through the `app` object.

Our new `JupyterFrontEndPlugin` instance has to be finally exported to be visible to
JupyterLab, which is done with the line `export default extension`. This brings
us to the next point. How can we plug this extension into JupyterLab?

## Building and Installing an Extension

These are the instructions on how our
labextension can be installed for development:

> The `jlpm` command is JupyterLab's pinned version of
> [yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
> `yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Move to hello-world directory
# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
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
        hello-world: [...]/labextension_tutorial/hello-world
```

Now let's check inside of JupyterLab if it works. Run [can take a while]:

```bash
jupyter lab --watch
```

Our extension doesn't do much so far, it just writes something to the browser
console. So let's check if it worked. In most webbrowsers you can open the console
pressing the `F12` key. You should see something like:

```
JupyterLab extension hello-world is activated
```

Our extension works but it is incredibly boring. Let's modify the source code
a bit. Simply replace the `activate` function with the following lines:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L12-L15

activate: (app: JupyterFrontEnd) => {
  console.log('the JupyterLab main application:');
  console.log(app);
}
```
<!-- prettier-ignore-end -->

to update the module, we simply need to go into the extension directory and run
`jlpm build` again. Since we used the `--watch` option when starting
JupyterLab, we now only have to refresh the JupyterLab website in the browser
and should see in the browser console:

```
Object { _started: true, _pluginMap: {…}, _serviceMap: Map(28), _delegate: {…}, commands: {…}, contextMenu: {…}, shell: {…}, registerPluginErrors: [], _dirtyCount: 0, _info: {…}, … } index.js:12
```

This is the main application JupyterLab object and we will see how to interact
with it in the next sections.

Checkout how the core packages of JupyterLab are defined
[on this page](https://github.com/jupyterlab/jupyterlab/tree/master/packages). Each package is
structured similarly to the extension that we are writing. This modular
structure makes JupyterLab very adaptable.

An overview of the classes and their attributes and methods can be found in the
JupyterLab documentation. The `@jupyterlab/application` module documentation is
[here](https://jupyterlab.github.io/jupyterlab/application/index.html)
and which links to the [JupyterFrontEnd class](https://jupyterlab.github.io/jupyterlab/application/classes/jupyterfrontend.html).

The `JupyterFrontEndPlugin` is a type alias (a new name) for the type `IPlugin`.
The definition of `IPlugin` is more difficult to find because it is defined by
the `phosphor.js` library on top of which JupyterLab is built (more about this
later). Its documentation is therefore located on the [phosphor.js
website](https://phosphorjs.github.io/phosphor/api/application/interfaces/iplugin.html).
