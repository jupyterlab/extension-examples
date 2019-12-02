# Introduction to Server Extension

This extension describe a minimal JupyterLab extension with a backend (i.e. server) and
frontend parts. It is strongly adviced to go over the [basic hello-world](../../basics/hello-world)
example before diving into this one.

- [The template folder structure](#the-template-folder-structure)
- [A minimal extension that prints to the browser console](#a-minimal-extension-that-prints-to-the-browser-console)

## The template folder structure

Writing a JupyterLab extension usually starts from a configurable template. It
can be downloaded with the [`cookiecutter`](https://cookiecutter.readthedocs.io/en/latest/) tool and the following command for an extension with a server part:

```bash
cookiecutter https://github.com/fcollonval/cookiecutter-jupyterlab-extension-with-serverextension
```

`cookiecutter` asks for some basic information that could for example be setup
like this:

```bash
author_name []: my_name
extension_name [myextension]: myserverextension
project_short_description [A JupyterLab extension.]: A minimal JupyterLab extension with backend and frontend parts.
api_namespace [hello]:
repository [https://github.com/my_name/myextension]:
```

The cookiecutter creates the directory `myserverextension` [or your extension name]
that looks like this:

```bash
myserverextension/
│  # Generic Files
├── LICENSE                     # License of your code
├── README.md                   # Instructions to install and build
│  
│  # Backend (server) Files
├── MANIFEST.in                 # Help Python to list your source files
├── setup.py                    # Information about the server package
├── setupbase.py                # Helpers to package the code
├── jupyter-config
│   └── myserverextension.json  # Server extension enabler
├── myserverextension
│   ├── __init__.py             # Hook the extension in the server
│   ├── _version.py             # Server extension version
│   └── handlers.py             # API handler (where things happen)
│  
│  # Frontend Files
├── package.json                # Information about the frontend package
├── tsconfig.json               # Typescript compilation configuration
├── src
│   ├── index.ts                # Actual code of the extension
│   └── myserverextension.ts    # More code used by the extension
└── style
    └── index.css               # CSS styling
```

There are two major parts in the full extension:

- A Python package for the server extension
- A NPM package for the frontend extension

In this example, you will see that the template code have been extended
to demonstrate the use of GET and POST request.

## Frontend Part

The entry point for the frontend extension is `src/index.ts`. In
communication with the server extension is contained in another file
`src/myserverextension.ts`. This is the reason in this imported:

```ts
// src/index.ts#L6-L6
```

In the activate function, the server extension is first called through
a GET request on the endpoint _/hello/personal_. And the server response
is printed in the web browser console:

```ts
// src/index.ts#L17-L23
```

As the server response is not instantanious, the request is done asynchronously
using the `await` keyword:

```ts
// src/index.ts#L19-L19
```

To use that `await` keyword, the function needs to be marked as asynchrone
using the `async` keyword:

```ts
// src/index.ts#L14-L14
```

A GET request cannot carry data from the frontend to the server. To achieve that,
you will need to execute a POST request. In this example, a POST request
is sent to the _/hello/personal_ endpoint with the data `{name: 'George'}`:

```ts
// src/index.ts#L25-L35
```

The difference with the GET request is the use of the `body` option to send data
and the `method` option to set the HTTP method.

The data sent from the frontend to the backend can have different type. But in
JupyterLab, the most common format is JSON. But JSON cannot directly be sent to
the server, it needs to stringified to be carried over by the request.

The communication logic with the server is hidden in the `requestAPI` function.
Its definition is :

```ts
// src/myserverextension.ts#L12-L34
```

First the server settings are obtained from:

```ts
// src/myserverextension.ts#L17-L17
```

This requires to add `@jupyterlab/services` to the package dependencies:

```bash
jlpm add @jupyterlab/services
```

Then the class `ServerConnection` can be imported:

```ts
// src/myserverextension.ts#L3-L3
```

The next step is to build the full request URL:

```ts
// src/myserverextension.ts#L18-L18
```

To concatenate the various parts, the `URLExt` utility is imported:

```ts
// src/myserverextension.ts#L1-L1
```

This requires to add another dependency to the package:

```bash
jlpm add @jupyterlab/coreutils
```

You now have all the elements to make the request:

```ts
// src/myserverextension.ts#L22-L22
```

Finally, once the server response is obtained, its body is interpreted as
JSON. And the resulting data is returned.

```ts
// src/myserverextension.ts#L27-L33
```

Note:

- If the response is not ok (i.e. status code not in range 200-299),
  a `ResponseError` is thrown.
- The response body is interpreted as JSON even in case the response is not
  ok. In JupyterLab, it is a good practice in case of error on the server
  side to return a response with a JSON body. It should at least define a
  `message` key providing nice error message for the user.

## Backend (server) Part

## Building and Installing an Extension

Let's look at the `README.md` file. It contains instructions how our
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
pressing the `f12` key. You should see something like:

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

_checkout how the core packages of JupyterLab are defined at
https://github.com/jupyterlab/jupyterlab/tree/master/packages . Each package is
structured similarly to the extension that we are writing. This modular
structure makes JupyterLab very adapatable_

An overview of the classes and their attributes and methods can be found in the
JupyterLab documentation. The `@jupyterlab/application` module documentation is
[here](https://jupyterlab.github.io/jupyterlab/application/index.html)
and which links to the [JupyterFrontEnd class](https://jupyterlab.github.io/jupyterlab/application/classes/jupyterfrontend.html).
The `JupyterFrontEndPlugin` is a type alias [a new name] for the type `IPlugin`.
The definition of `IPlugin` is more difficult to find because it is defined by
the `phosphor.js` library on top of which JupyterLab is built (more about this
later). Its documentation is therefore located on the [phosphor.js
website](https://phosphorjs.github.io/phosphor/api/application/interfaces/iplugin.html).

# myserverextension

![Github Actions Status](https://github.com/my_name/myextension/workflows/Build/badge.svg)

A minimal JupyterLab extension with backend and frontend parts.

This extension is composed of a Python package named `myserverextension`
for the server extension and a NPM package named `jupyterlab_myserverextension`
for the frontend extension.

## Requirements

- JupyterLab >= 1.0

## Install

Note: You will need NodeJS to installed the extension.

```bash
pip install myserverextension
jupyter lab build
```

## Troubleshoot

If you are see the frontend extension but it is not working, check
that the server extension is enabled:

```bash
jupyter serverextension list
```

If the server extension is installed and enabled but your not seeing
the frontend, check the frontend is installed:

```bash
jupyter labextension list
```

If it is installed, try:

```bash
jupyter lab clean
jupyter lab build
```

## Contributing

### Development Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Move to myserverextension directory
# Install server extension
pip install -e .
# Register server extension
jupyter serverextension enable --py myserverextension
# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter labextension link .

# Rebuild Typescript source after making changes
jlpm build
# Rebuild JupyterLab after making any changes
jupyter lab build
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Watch the source directory in another terminal tab
jlpm watch
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch
```

### Uninstall

```bash
pip uninstall myserverextension
jupyter labextension uninstall jupyterlab_myserverextension
```
