# Jupyterlab Extensions Walkthrough #

## Prerequesites ##

This is a short tutorial series on how to write jupyterlab extensions. Writing
an extension is not particularly difficult but requires a very basic knowledge
of javascript and typescript.

_Don't be scared of typescript, I never coded in typescript before I touched 
jupyterlab but found it easier to understand than pure javascript if you have a 
basic understanding of object oriented programming and types._

## Extension 1: Setting up the development environment ##

Writing a jupyterlab extension usually starts from a template. The basic
configurable extension template can be obtained with the following command:

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

What does this extension do? Well, let's have a step by step look at
`src/index.ts`. The file begins with an import section:

```typescript
import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';
```

`JupyterLab` is the main application class that will allow us
to interact and modify Jupyterlab. The `JupyterLabPlugin` is the class
of the extension that we are building. Both are imported
from a module called `@jupyterlab/application`.
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
with it in the next section.

[the full extension](extension1)

## Extension 2: Adding Commands, modifying Menus ##

For the next extension you can either copy the last folder to a new one or 
simply continue modifying it.
