# Introduction to Server Extension

This extension describes a minimal JupyterLab extension with backend (i.e. server) and
frontend parts.

![server extension example](./preview.png)

It is strongly adviced to go over the [basic hello-world](../../basics/hello-world)
example before diving into this one.

- [The template folder structure](#the-template-folder-structure)
- [Frontend Part](#frontend-part)
- [Backend (server) Part](<#backend-(server)-part>)
- [Packaging the Extension](#packaging-the-extension)
- [Installing the Package](#installing-the-package)

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
extension_name [myextension]: server-extension
project_short_description [A JupyterLab extension.]: A minimal JupyterLab extension with backend and frontend parts.
api_namespace [hello]:
repository [https://github.com/my_name/myextension]:
```

The cookiecutter creates the directory `server-extension` [or your extension name]
that looks like this:

```bash
server-extension/
│  # Generic Files
├── LICENSE                     # License of your code
├── README.md                   # Instructions to install and build
│  
│  # Backend (server) Files
├── MANIFEST.in                 # Help Python to list your source files
├── setup.py                    # Information about the server package
├── setupbase.py                # Helpers to package the code
├── jupyter-config
│   └── server-extension.json  # Server extension enabler
├── server-extension
│   ├── __init__.py             # Hook the extension in the server
│   ├── _version.py             # Server extension version
│   └── handlers.py             # API handler (where things happen)
│  
│  # Frontend Files
├── package.json                # Information about the frontend package
├── tsconfig.json               # Typescript compilation configuration
├── src
│   ├── index.ts                # Actual code of the extension
│   └── server-extension.ts    # More code used by the extension
└── style
    └── index.css               # CSS styling
```

There are two major parts in the full extension:

- A Python package for the server extension
- A NPM package for the frontend extension

In this example, you will see that the template code have been extended
to demonstrate the use of GET and POST request.

## Frontend Part

The entry point for the frontend extension is `src/index.ts`. The
communication with the server extension is contained in another file
`src/server-extension.ts`. So you need to import it:

```ts
// src/index.ts#L6-L6

import { requestAPI } from './server-extension';
```

In the `activate` function, the server extension is first called through
a GET request on the endpoint _/hello/personal_. And the server response
is printed in the web browser console:

```ts
// src/index.ts#L17-L23

// GET request
try {
  const data = await requestAPI<any>('personal');
  console.log(data);
} catch (reason) {
  console.error(`Error on GET /hello/personal.\n${reason}`);
}
```

As the server response is not instantanious, the request is done asynchronously
using the `await` keyword:

```ts
// src/index.ts#L19-L19

const data = await requestAPI<any>('personal');
```

To use that `await` keyword, the function needs to be marked as asynchrone
using the `async` keyword:

```ts
// src/index.ts#L14-L14

activate: async (app: JupyterFrontEnd) => {
```

A GET request cannot carry data from the frontend to the server. To achieve that,
you will need to execute a POST request. In this example, a POST request
is sent to the _/hello/personal_ endpoint with the data `{name: 'George'}`:

```ts
// src/index.ts#L25-L35

// POST request
const dataToSend = { name: 'George' };
try {
  const reply = await requestAPI<any>('personal', {
    body: JSON.stringify(dataToSend),
    method: 'POST'
  });
  console.log(reply);
} catch (reason) {
  console.error(`Error on POST /hello/personal ${dataToSend}.\n${reason}`);
}
```

The difference with the GET request is the use of the `body` option to send data
and the `method` option to set the appropriate HTTP method.

The data sent from the frontend to the backend can have different types. In
JupyterLab, the most common format is JSON. But JSON cannot directly be sent to
the server, it needs to be stringified to be carried over by the request.

The communication logic with the server is hidden in the `requestAPI` function.
Its definition is :

```ts
// src/server-extension.ts#L12-L34

export async function requestAPI<T>(
  endPoint: string = '',
  init: RequestInit = {}
): Promise<T> {
  // Make request to Jupyter API
  const settings = ServerConnection.makeSettings();
  const requestUrl = URLExt.join(settings.baseUrl, 'hello', endPoint);

  let response: Response;
  try {
    response = await ServerConnection.makeRequest(requestUrl, init, settings);
  } catch (error) {
    throw new ServerConnection.NetworkError(error);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ServerConnection.ResponseError(response, data.message);
  }

  return data;
}
```

First the server settings are obtained from:

```ts
// src/server-extension.ts#L17-L17

const settings = ServerConnection.makeSettings();
```

This requires to add `@jupyterlab/services` to the package dependencies:

```bash
jlpm add @jupyterlab/services
```

Then the class `ServerConnection` can be imported:

```ts
// src/server-extension.ts#L3-L3

import { ServerConnection } from '@jupyterlab/services';
```

The next step is to build the full request URL:

```ts
// src/server-extension.ts#L18-L18

const requestUrl = URLExt.join(settings.baseUrl, 'hello', endPoint);
```

To concatenate the various parts, the `URLExt` utility is imported:

```ts
// src/server-extension.ts#L1-L1

import { URLExt } from '@jupyterlab/coreutils';
```

This requires to add another dependency to the package:

```bash
jlpm add @jupyterlab/coreutils
```

You now have all the elements to make the request:

```ts
// src/server-extension.ts#L22-L22

response = await ServerConnection.makeRequest(requestUrl, init, settings);
```

Finally, once the server response is obtained, its body is interpreted as
JSON. And the resulting data is returned.

```ts
// src/server-extension.ts#L27-L33

const data = await response.json();

if (!response.ok) {
  throw new ServerConnection.ResponseError(response, data.message);
}

return data;
```

Note:

- If the response is not ok (i.e. status code not in range 200-299),
  a `ResponseError` is thrown.
- The response body is interpreted as JSON even in case the response is not
  ok. In JupyterLab, it is a good practice in case of error on the server
  side to return a response with a JSON body. It should at least define a
  `message` key providing nice error message for the user.

## Backend (server) Part

The server part of the extension is gonna presented next.

JupyterLab server is built on top of the [Tornado](https://tornadoweb.org/en/stable/guide.html) Python package. To extend the server,
your extension needs to be defined as a proper Python package with some hook functions:

```py
# server-extension/__init__.py

from ._version import __version__
from .handlers import setup_handlers


def _jupyter_server_extension_paths():
    return [{
        'module': 'server-extension'
    }]


def load_jupyter_server_extension(nb_app):
    """Registers the API handler to receive HTTP requests from the frontend extension.
    Parameters
    ----------
    nb_app: notebook.notebookapp.NotebookApp
        Notebook application instance
    """
    setup_handlers(nb_app.web_app)
    nb_app.log.info(f'Registered HelloWorld extension at URL path /hello')

```

The `_jupyter_server_extension_paths` provides the Python package name
to the server. But the most important one is `load_jupyter_server_extension`
that register new handlers.

```py
# server-extension/__init__.py#L18-L18

setup_handlers(nb_app.web_app)
```

A handler is registered in the web application by linking an url to a class. In this
example the url is _base_server_url_`/hello/personal` and the class handler is `RouteHandler`:

```py
# server-extension/handlers.py#L21-L27

def setup_handlers(web_app):
    host_pattern = '.*$'

    base_url = web_app.settings['base_url']
    route_pattern = url_path_join(base_url, 'hello', 'personal')
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
```

For Jupyter server, the handler class must inherit from the `APIHandler` and it should
implemented the wanted HTTP verbs. For example, here, `/hello/personal` can be requested
by a _GET_ or a _POST_ request. They will call the `get` or `post` method respectively.

```py
# server-extension/handlers.py#L6-L18

class RouteHandler(APIHandler):
    def get(self):
        self.finish(json.dumps({
            'data': 'This is /hello/personal endpoint!'
        }))

    def post(self):
        # input_data is a dictionnary with a key 'name'
        input_data = self.get_json_body()
        data = {
            'greetings': 'Hello {}, enjoy JupyterLab!'.format(input_data['name'])
        }
        self.finish(json.dumps(data))
```

Once the server has carried out the appropriate task, the handler should finish the request
by calling the `finish` method. That method can optionally takes an argument that will
become the response body of the request in the frontend.

```py
# server-extension/handlers.py#L8-L10

self.finish(json.dumps({
    'data': 'This is /hello/personal endpoint!'
}))
```

In Jupyter, it is common to use JSON as format between the frontend and the backend.
But it should first be stringified to be a valid response body. This can be done executing
`json.dumps` on a dictionary.

A _POST_ request is similar to a _GET_ request except it may have a body containing data
sent by the frontend. When using JSON as communication format, you can directly use the
`get_json_body` helper method to convert the request body into a Python dictionary.

```py
# server-extension/handlers.py#L14-L17

input_data = self.get_json_body()
data = {
    'greetings': 'Hello {}, enjoy JupyterLab!'.format(input_data['name'])
}
```

> Note: Server extensions can be used for different frontends (like
> JupyterLab and the classical Jupyter Notebook). Some additional
> documentation is available in the [Notebook documentation](https://jupyter-notebook.readthedocs.io/en/stable/extending/handlers.html)

## Packaging the Extension

### Python Package Manager

In the previous sections, the acting code has been described. But there are other files
with the sole purpose of packaging the full extension nicely to help its distribution
through package manager like `pip`.

The `setup.py` file is the entry point to describe package metadata:

```py
# setup.py#L54-L83

setup_args = dict(
    name=name,
    version=version,
    url="https://github.com/my_name/myextension",
    author="my_name",
    description="A minimal JupyterLab extension with backend and frontend parts.",
    long_description= long_description,
    long_description_content_type="text/markdown",
    cmdclass= cmdclass,
    packages=setuptools.find_packages(),
    install_requires=[
        "jupyterlab",
    ],
    zip_safe=False,
    include_package_data=True,
    license="BSD-3-Clause",
    platforms="Linux, Mac OS X, Windows",
    keywords=["Jupyter", "JupyterLab"],
    classifiers=[
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Framework :: Jupyter",
    ],
)

setuptools.setup(**setup_args)
```

But in this case, it is a bit more complicated to build the frontend extension and ship it
directly with the Python package. To deploy simultaneously the frontend and the backend,
the frontend NPM package needs to be built and inserted in the Python package. This is
done by using a special `cmdclass`:

```py
# setup.py#L41-L49

cmdclass = create_cmdclass("jsdeps",
    package_data_spec=package_data_spec,
    data_files_spec=data_files_spec
)

cmdclass["jsdeps"] = combine_commands(
    install_npm(HERE, build_cmd="build:all", npm=["jlpm"]),
    ensure_targets(jstargets),
)
```

Basically it will built the frontend NPM package:

```py
# setup.py#L47-L47

install_npm(HERE, build_cmd="build:all", npm=["jlpm"]),
```

It will ensure one of the generated JS files is `lib/server-extension.js`:

```py
# setup.py#L25-L27

jstargets = [
    pjoin(HERE, "lib", "server-extension.js"),
]
```

It will copy the NPM package in the Python package and force it to be copied in a place
JupyterLab is looking for frontend extensions:

```py
# setup.py#L36-L36

("share/jupyter/lab/extensions", lab_path, "*.tgz"),
```

The last piece of configuration needed is the enabling of the server extension. This is
done by copying the following JSON file:

<!-- prettier-ignore-start -->
```json5
// jupyter-config/server-extension.json

{
  "NotebookApp": {
    "nbserver_extensions": {
      "server-extension": true
    }
  }
}

```
<!-- prettier-ignore-end -->

in the appropriate jupyter folder (`etc/jupyter/jupyter_notebook_config.d`):

```py
# setup.py#L37-L38

("etc/jupyter/jupyter_notebook_config.d",
 "jupyter-config", "server-extension.json"),
```

### JupyterLab Extension Manager

The distribution as a Python package has been described in the previous subsection. But
in JupyterLab, user have an extension manager at their disposal to find extensions. If,
like in this example, your extension needs a server extension, you should inform the
user about that dependency by adding the `discovery` metadata in your `package.json`
file:

```json5
// package.json#L52-L62

"jupyterlab": {
  "discovery": {
      "server": {
        "managers": [
          "pip"
        ],
        "base": {
          "name": "server-extension"
        }
      }
    },
```

In this example, the extension requires a `server` extension:

```json5
// package.json#L54-L54

"server": {
```

And that server extension is available through `pip`:

```json5
// package.json#L55-L57

"managers": [
  "pip"
],
```

For more information on the `discovery` metadata, please refer to the [documentation](https://jupyterlab.readthedocs.io/en/stable/developer/extension_dev.html#ext-author-companion-packages).

## Installing the Package

With the packaging described above, installing the extension is done in two commands:

```bash
# Install the server extension and
# copy the frontend extension where JupyterLab can find it
pip install server-extension
# Build JupyterLab to integrate the frontend extension
jupyter lab build
```

> Note: User will need NodeJS to installed the extension.

As developer, you will be interested to install the package in local editable mode.
This will shunt the installation machinery described above. Therefore the commands
to get you set are:

```bash
# Install server extension in editable mode
pip install -e .
# Register server extension
jupyter serverextension enable --py server-extension
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
