# Server Hello World

> Create a minimal extension with backend (i.e. server) and frontend parts.

![server extension example](./preview.png)

It is strongly recommended to read the [basic hello-world](../hello-world)
example before diving into this one.

- [Server Hello World](#server-hello-world)
  - [The template folder structure](#the-template-folder-structure)
  - [Frontend Part](#frontend-part)
  - [Backend (Server) Part](#backend-server-part)
  - [Packaging the Extension](#packaging-the-extension)
    - [Python Package Manager](#python-package-manager)
    - [JupyterLab Extension Manager](#jupyterlab-extension-manager)
  - [Development](#development)
  - [Installing the Package](#installing-the-package)

## The template folder structure

Writing a JupyterLab extension usually starts from a configurable template. It
can be downloaded with the [`copier`](https://copier.readthedocs.io/) tool and the following command for an extension with a server part:

```bash
pip install "copier~=9.2" jinja2-time
mkdir my_extension
cd my_extension
copier copy --trust https://github.com/jupyterlab/extension-template .
```

You will be asked for some basic information that could for example be setup
like this (be careful to pick _server_ as _kind_):

```bash
🎤 What is your extension kind?
   server
🎤 Extension author name
   tuto
🎤 Extension author email
   tuto@help.you
🎤 JavaScript package name
   jlab-ext-example
🎤 Python package name
   jlab_ext_example
🎤 Extension short description
   A minimal JupyterLab extension with backend and frontend parts.
🎤 Does the extension have user settings?
   No
🎤 Do you want to set up Binder example?
   Yes
🎤 Do you want to set up tests for the extension?
   Yes
🎤 Git remote repository URL
   https://github.com/github_username/jlab-ext-example
```

> The python name must be a valid Python module name (characters such `-`, `@` or `/` are not allowed).
> It is nice for user to test your extension online, so the _set up Binder_ was set to _Yes_.

The template creates files in the current director
that looks like this:

```bash
.
├── CHANGELOG.md
├── .gitignore
├── LICENSE                    # License of your code
├── README.md                  # Instructions to install and build
├── RELEASE.md
├── .copier-answers.yml        # Answers given when executing the extension template
│
├── .github
│   └── workflows
│       ├── binder-on-pr.yml   # Test PR online
│       ├── build.yml          # Test extension on GitHub CI
│       ├── update-integration-tests.yml
│       │  # Handle package release as GitHub actions
│       ├── check-release.yml
│       ├── enforce-label.yml
│       ├── prep-release.yml
│       └── publish-release.yml
│
│  # Online extension demo
├── binder
│   ├── environment.yml
│   └── postBuild
│
│  # Backend (server) Files
├── conftest.py                # Python unit tests configuration
├── install.json               # Information retrieved by JupyterLab to help users know how to manage the extension
├── pyproject.toml             # Python package configuration
├── setup.py                   # Optional - for backward compatibility if a tool does not support pyproject.toml
│
├── jlab_ext_example
│   ├── handlers.py            # API handler (where things happen)
│   ├── __init__.py            # Hook the extension in the server
│   └── tests                  # Python unit tests
│       ├── __init__.py
│       └── test_handlers.py
├── jupyter-config             # Server extension auto-install
│   ├── nb-config
│   │   └── jlab_ext_example.json
│   └── server-config
│       └── jlab_ext_example.json
│
│  # Frontend Files
├── babel.config.js
├── jest.config.js
├── package.json               # Information about the frontend package
├── .prettierignore
├── tsconfig.json              # Typescript compilation configuration
├── tsconfig.test.json
├── .yarnrc.yml                # Yarn package manager configuration
│
├── src                        # Actual code of the extension
│   ├── handler.ts
│   ├── index.ts
│   └── __tests__              # JavaScript unit tests
│       └── jupyterlab_examples_server.spec.ts
│
├── style                      # CSS styling
│   ├── base.css
│   ├── index.css
│   └── index.js
│
└── ui-tests                   # Integration tests
    ├── jupyter_server_test_config.py
    ├── package.json
    ├── playwright.config.js
    ├── README.md
    ├── tests
    │   └── jupyterlab_examples_server.spec.ts
    └── yarn.lock
```

There are two major parts in the extension:

- A Python package for the server extension and the packaging
- A NPM package for the frontend extension

In this example, you will see that the template code have been extended
to demonstrate the use of GET and POST HTTP requests.

## Frontend Part

The entry point for the frontend extension is `src/index.ts`. The
communication with the server extension is contained in another file
`src/handler.ts`. So you need to import it:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L12-L12

import { requestAPI } from './handler';
```
<!-- prettier-ignore-end -->

In the `activate` function, the server extension is first called through
a GET request on the endpoint _/jlab-ext-example/hello_. The response from the server
is printed in the web browser console:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L42-L50

requestAPI<any>('hello')
  .then(data => {
    console.log(data);
  })
  .catch(reason => {
    console.error(
      `The jupyterlab_examples_server server extension appears to be missing.\n${reason}`
    );
  });
```
<!-- prettier-ignore-end -->

As the server response is not instantaneous, the request is done asynchronously
using [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).
You could also use the keyword [`async`-`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).
But it is not recommended in a plugin `activate` method as it may delay the application start
up time.

A GET request cannot carry data from the frontend to the server. To achieve that,
you will need to execute a POST request. In this example, a POST request
is sent to the _/jlab-ext-example/hello_ endpoint with the data `{name: 'George'}`:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L53-L65

const dataToSend = { name: 'George' };
requestAPI<any>('hello', {
  body: JSON.stringify(dataToSend),
  method: 'POST'
})
  .then(reply => {
    console.log(reply);
  })
  .catch(reason => {
    console.error(
      `Error on POST /jupyterlab-examples-server/hello ${dataToSend}.\n${reason}`
    );
  });
```
<!-- prettier-ignore-end -->

The difference with the GET request is the use of the `body` option to send data
and the `method` option to set the appropriate HTTP method.

The data sent from the frontend to the backend can have different types. In
JupyterLab, the most common format is JSON. But JSON cannot directly be sent to
the server, it needs to be stringified to be carried over by the request.

The communication logic with the server is hidden in the `requestAPI` function.
Its definition is :

<!-- prettier-ignore-start -->
```ts
// src/handler.ts#L12-L46

export async function requestAPI<T>(
  endPoint = '',
  init: RequestInit = {}
): Promise<T> {
  // Make request to Jupyter API
  const settings = ServerConnection.makeSettings();
  const requestUrl = URLExt.join(
    settings.baseUrl,
    'jupyterlab-examples-server', // API Namespace
    endPoint
  );

  let response: Response;
  try {
    response = await ServerConnection.makeRequest(requestUrl, init, settings);
  } catch (error) {
    throw new ServerConnection.NetworkError(error as any);
  }

  let data: any = await response.text();

  if (data.length > 0) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.log('Not a JSON response body.', response);
    }
  }

  if (!response.ok) {
    throw new ServerConnection.ResponseError(response, data.message || data);
  }

  return data;
}
```
<!-- prettier-ignore-end -->

First the server settings are obtained from:

<!-- prettier-ignore-start -->
```ts
// src/handler.ts#L17-L17

const settings = ServerConnection.makeSettings();
```
<!-- prettier-ignore-end -->

This requires to add `@jupyterlab/services` to the package dependencies:

```bash
jlpm add @jupyterlab/services
```

Then the class `ServerConnection` can be imported:

<!-- prettier-ignore-start -->
```ts
// src/handler.ts#L3-L3

import { ServerConnection } from '@jupyterlab/services';
```
<!-- prettier-ignore-end -->

The next step is to build the full request URL:

<!-- prettier-ignore-start -->
```ts
// src/handler.ts#L18-L21

const requestUrl = URLExt.join(
  settings.baseUrl,
  'jupyterlab-examples-server', // API Namespace
  endPoint
```
<!-- prettier-ignore-end -->

To concatenate the various parts, the `URLExt` utility is imported:

<!-- prettier-ignore-start -->
```ts
// src/handler.ts#L1-L1

import { URLExt } from '@jupyterlab/coreutils';
```
<!-- prettier-ignore-end -->

This requires to add another dependency to the package:

```bash
jlpm add @jupyterlab/coreutils
```

You now have all the elements to make the request:

<!-- prettier-ignore-start -->
```ts
// src/handler.ts#L26-L26

response = await ServerConnection.makeRequest(requestUrl, init, settings);
```
<!-- prettier-ignore-end -->

Finally, once the server response is obtained, its body is interpreted as
JSON. And the resulting data is returned.

<!-- prettier-ignore-start -->
```ts
// src/handler.ts#L31-L45

let data: any = await response.text();

if (data.length > 0) {
  try {
    data = JSON.parse(data);
  } catch (error) {
    console.log('Not a JSON response body.', response);
  }
}

if (!response.ok) {
  throw new ServerConnection.ResponseError(response, data.message || data);
}

return data;
```
<!-- prettier-ignore-end -->

This example also showcases how you can serve static files from the server extension.

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L67-L88

const { commands, shell } = app;
const command = CommandIDs.get;
const category = 'Extension Examples';

commands.addCommand(command, {
  label: 'Get Server Content in a IFrame Widget',
  caption: 'Get Server Content in a IFrame Widget',
  execute: () => {
    const widget = new IFrameWidget();
    shell.add(widget, 'main');
  }
});

palette.addItem({ command, category: category });

if (launcher) {
  // Add launcher
  launcher.add({
    command: command,
    category: category
  });
}
```
<!-- prettier-ignore-end -->

Invoking the command (via the command palette or the launcher) will open a new tab with
an `IFrame` that will display static content fetched from the server extension.

**Note**

- If the response is not ok (i.e. status code not in range 200-399),
  a `ResponseError` is thrown.
- The response body is interpreted as JSON even in case the response is not
  ok. In JupyterLab, it is a good practice in case of error on the server
  side to return a response with a JSON body. It should at least define a
  `message` key providing nice error message for the user.

## Backend (Server) Part

The server part of the extension is going to be presented in this section.

JupyterLab server is built on top of the [Tornado](https://www.tornadoweb.org/en/stable/guide.html) Python package. To extend the server,
your extension needs to be defined as a proper Python package with some hook functions:

```py
# jupyterlab_examples_server/__init__.py

try:
    from ._version import __version__
except ImportError:
    # Fallback when using the package in dev mode without installing
    # in editable mode with pip. It is highly recommended to install
    # the package from a stable release or in editable mode: https://pip.pypa.io/en/stable/topics/local-project-installs/#editable-installs
    import warnings
    warnings.warn("Importing 'jupyterlab_examples_server' outside a proper installation.")
    __version__ = "dev"
from .handlers import setup_handlers


def _jupyter_labextension_paths():
    return [{
        "src": "labextension",
        "dest": "@jupyterlab-examples/server-extension"
    }]


def _jupyter_server_extension_points():
    return [{
        "module": "jupyterlab_examples_server"
    }]


def _load_jupyter_server_extension(server_app):
    """Registers the API handler to receive HTTP requests from the frontend extension.

    Parameters
    ----------
    server_app: jupyterlab.labapp.LabApp
        JupyterLab application instance
    """
    setup_handlers(server_app.web_app)
    name = "jupyterlab_examples_server"
    server_app.log.info(f"Registered {name} server extension")

```

The `_jupyter_server_extension_points` provides the Python package name
to the server. But the most important one is `_load_jupyter_server_extension`
that register new handlers.

```py
# jupyterlab_examples_server/__init__.py#L34-L34

setup_handlers(server_app.web_app)
```

A handler is registered in the web application by linking an url to a class. In this
example the url is _base_server_url_`/jlab-ext-example/hello` and the class handler is `RouteHandler`:

```py
# jupyterlab_examples_server/handlers.py#L29-L35

host_pattern = ".*$"

base_url = web_app.settings["base_url"]
# Prepend the base_url so that it works in a JupyterHub setting
route_pattern = url_path_join(base_url, "jupyterlab-examples-server", "hello")
handlers = [(route_pattern, RouteHandler)]
web_app.add_handlers(host_pattern, handlers)
```

For Jupyter server, the handler class must inherit from the `APIHandler` and it should
implement the wanted HTTP verbs. For example, here, `/jlab-ext-example/hello` can be requested
by a _GET_ or a _POST_ request. They will call the `get` or `post` method respectively.

```py
# jupyterlab_examples_server/handlers.py#L10-L25

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /jupyterlab-examples-server/hello endpoint!"
        }))

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionary with a key "name"
        input_data = self.get_json_body()
        data = {"greetings": "Hello {}, enjoy JupyterLab!".format(input_data["name"])}
        self.finish(json.dumps(data))
```

**Security Note**

> The methods to handle request like `get`, `post`, etc.
> must be decorated with `tornado.web.authenticated` to ensure only
> authenticated users can request the Jupyter server.

Once the server has carried out the appropriate task, the handler should finish the request
by calling the `finish` method. That method can optionally take an argument that will
become the response body of the request in the frontend.

```py
# jupyterlab_examples_server/handlers.py#L15-L18

def get(self):
    self.finish(json.dumps({
        "data": "This is /jupyterlab-examples-server/hello endpoint!"
    }))
```

In Jupyter, it is common to use JSON as format between the frontend and the backend.
But it should first be stringified to be a valid response body. This can be done using
`json.dumps` on a dictionary.

A _POST_ request is similar to a _GET_ request except it may have a body containing data
sent by the frontend. When using JSON as communication format, you can directly use the
`get_json_body` helper method to convert the request body into a Python dictionary.

```py
# jupyterlab_examples_server/handlers.py#L23-L24

input_data = self.get_json_body()
data = {"greetings": "Hello {}, enjoy JupyterLab!".format(input_data["name"])}
```

The part responsible to serve static content with a `StaticFileHandler` handler
is the following:

```py
# jupyterlab_examples_server/handlers.py#L38-L44

doc_url = url_path_join(base_url, "jupyterlab-examples-server", "public")
doc_dir = os.getenv(
    "JLAB_SERVER_EXAMPLE_STATIC_DIR",
    os.path.join(os.path.dirname(__file__), "public"),
)
handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
web_app.add_handlers(host_pattern, handlers)
```

**Security Note**

> The `StaticFileHandler` is not secured.
> For enhanced security, please consider using `AuthenticatedFileHandler`.

**Note**

> Server extensions can be used for different frontends (like
> JupyterLab and Jupyter Notebook). Some additional
> documentation is available in the [Jupyter Server documentation](https://jupyter-server.readthedocs.io/en/latest/developers/extensions.html#adding-extension-endpoints)

## Packaging the Extension

### Python Package Manager

In the previous sections, the acting code has been described. But there are other files
with the sole purpose of packaging the full extension nicely to help its distribution
through package managers like `pip`.

To deploy simultaneously the frontend and the backend,
the frontend NPM package needs to be built and inserted in the Python package. This is
done using [hatch](https://hatch.pypa.io/) builder with some additional plugins:

- [hatch-nodejs-version](https://github.com/agoose77/hatch-nodejs-version): Get package metadata from `package.json` to align Python and JavaScript metadata.
- [hatch-jupyter-builder](https://github.com/jupyterlab/hatch-jupyter-builder/): Builder plugin to build Jupyter JavaScript assets as part of the Python package.
  Its configuration is done in `pyproject.toml`:

```toml
# pyproject.toml

[build-system]
requires = ["hatchling>=1.5.0", "jupyterlab>=4.0.0,<5", "hatch-nodejs-version"]
build-backend = "hatchling.build"

[project]
name = "jupyterlab_examples_server"
readme = "README.md"
license = {text = "BSD-3-Clause License"}
requires-python = ">=3.8"
classifiers = [
    "Framework :: Jupyter",
    "Framework :: Jupyter :: JupyterLab",
    "Framework :: Jupyter :: JupyterLab :: 4",
    "Framework :: Jupyter :: JupyterLab :: Extensions",
    "Framework :: Jupyter :: JupyterLab :: Extensions :: Prebuilt",
    "License :: OSI Approved :: BSD License",
    "Programming Language :: Python",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
]
dependencies = [
    "jupyter_server>=2.0.1,<3"
]
dynamic = ["version", "description", "authors", "urls", "keywords"]

[project.optional-dependencies]
test = [
    "coverage",
    "pytest",
    "pytest-asyncio",
    "pytest-cov",
    "pytest-jupyter[server]>=0.6.0"
]

[tool.hatch.version]
source = "nodejs"

[tool.hatch.metadata.hooks.nodejs]
fields = ["description", "authors", "urls"]

[tool.hatch.build.targets.sdist]
artifacts = ["jupyterlab_examples_server/labextension"]
exclude = [".github", "binder"]

[tool.hatch.build.targets.wheel.shared-data]
"jupyterlab_examples_server/labextension" = "share/jupyter/labextensions/@jupyterlab-examples/server-extension"
"install.json" = "share/jupyter/labextensions/@jupyterlab-examples/server-extension/install.json"
"jupyter-config/server-config" = "etc/jupyter/jupyter_server_config.d"

[tool.hatch.build.hooks.version]
path = "jupyterlab_examples_server/_version.py"

[tool.hatch.build.hooks.jupyter-builder]
dependencies = ["hatch-jupyter-builder>=0.5"]
build-function = "hatch_jupyter_builder.npm_builder"
ensured-targets = [
    "jupyterlab_examples_server/labextension/static/style.js",
    "jupyterlab_examples_server/labextension/package.json",
]
skip-if-exists = ["jupyterlab_examples_server/labextension/static/style.js"]

[tool.hatch.build.hooks.jupyter-builder.build-kwargs]
build_cmd = "build:prod"
npm = ["jlpm"]

[tool.hatch.build.hooks.jupyter-builder.editable-build-kwargs]
build_cmd = "install:extension"
npm = ["jlpm"]
source_dir = "src"
build_dir = "jupyterlab_examples_server/labextension"

[tool.jupyter-releaser.options]
version_cmd = "hatch version"

[tool.jupyter-releaser.hooks]
before-build-npm = [
    "python -m pip install 'jupyterlab>=4.0.0,<5'",
    "jlpm",
    "jlpm build:prod"
]
before-build-python = ["jlpm clean:all"]

[tool.check-wheel-contents]
ignore = ["W002"]

```

It will build the frontend NPM package through its _factory_, and will ensure one of the
generated files is `jupyterlab_examples_server/labextension/package.json`:

```py
# pyproject.toml#L57-L68

[tool.hatch.build.hooks.jupyter-builder]
dependencies = ["hatch-jupyter-builder>=0.5"]
build-function = "hatch_jupyter_builder.npm_builder"
ensured-targets = [
    "jupyterlab_examples_server/labextension/static/style.js",
    "jupyterlab_examples_server/labextension/package.json",
]
skip-if-exists = ["jupyterlab_examples_server/labextension/static/style.js"]

[tool.hatch.build.hooks.jupyter-builder.build-kwargs]
build_cmd = "build:prod"
npm = ["jlpm"]
```

It will copy the NPM package in the Python package and force it to be copied in a place
JupyterLab is looking for frontend extensions when the Python package is installed:

```py
# pyproject.toml#L49-L50

[tool.hatch.build.targets.wheel.shared-data]
"jupyterlab_examples_server/labextension" = "share/jupyter/labextensions/@jupyterlab-examples/server-extension"
```

The last piece of configuration needed is the enabling of the server extension. This is
done by copying the following JSON file:

<!-- prettier-ignore-start -->
```json5
// jupyter-config/server-config/jupyterlab_examples_server.json

{
  "ServerApp": {
    "jpserver_extensions": {
      "jupyterlab_examples_server": true
    }
  }
}

```
<!-- prettier-ignore-end -->

in the appropriate jupyter folder (`etc/jupyter/jupyter_server_config.d`):

```py
# pyproject.toml#L52-L52

"jupyter-config/server-config" = "etc/jupyter/jupyter_server_config.d"
```

### JupyterLab Extension Manager

The distribution as a Python package has been described in the previous subsection. But
in JupyterLab, users have an extension manager at their disposal to find extensions. If,
like in this example, your extension needs a server extension, you should inform the
user about that dependency by adding the `discovery` metadata to your `package.json`
file:

```json5
// package.json#L98-L108

"jupyterlab": {
    "discovery": {
        "server": {
            "managers": [
                "pip"
            ],
            "base": {
                "name": "jupyterlab_examples_server"
            }
        }
    },
```

In this example, the extension requires a `server` extension:

```json5
// package.json#L99-L99

"discovery": {
```

And that server extension is available through `pip`:

```json5
// package.json#L100-L102

"server": {
    "managers": [
        "pip"
```

For more information on the `discovery` metadata, please refer to the [documentation](https://jupyterlab.readthedocs.io/en/stable/extension/extension_dev.html#ext-author-companion-packages).

## Development

While developing your server extension, you can run JupyterLab and enable server reloading using the following command:

```bash
jupyter lab --autoreload --no-browser
```

This way, every time there is a change to the backend (server) code, JupyterLab is automatically relaunched, picking up the most recent changes.

The `--no-browser` flag is optional, but it helps prevent a new browser tab from opening each time JupyterLab is launched.

## Installing the Package

With the packaging described above, installing the extension is done in one command once the package is published on pypi.org:

```bash
# Install the server extension and
# copy the frontend extension where JupyterLab can find it
pip install jupyterlab_examples_server
```

As developer, you might want to install the package in local editable mode.
This will shunt the installation machinery described above. Therefore the commands
to get you set are:

```bash
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Enable the server extension
jupyter server extension enable jupyterlab_examples_server
# Rebuild extension Typescript source after making changes
jlpm run build
```
