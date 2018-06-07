# Jupyterlab Extensions for the Impatient #

## Prerequesites ##

This is a short tutorial series on how to write jupyterlab extensions. Writing
an extension is not particularly difficult but requires a very basic knowledge
of javascript and typescript.

_Don't be scared, I never coded in typescript before I touched jupyterlab but 
found it easier to understand than pure javascript if you have a basic
understanding of object oriented programming and types._

## Extension 1: Setting up the environment ##

Writing a jupyterlab extension usually starts from a template. The basic
configurable extension template can be obtained with the following command:

```
cookiecutter https://github.com/jupyterlab/extension-cookiecutter-ts
```

It asks for some basic information that could for example be setup like this:
```
author_name []: tuto
extension_name [jupyterlab_myextension]: extension1
project_short_description [A JupyterLab extension.]: minimal lab example
repository [https://github.com/my_name/jupyterlab_myextension]: 
```

The cookiecutter creates the directory `extension1` [or your extension name]
that looks like this:

```
extension1/

├── README.md
├── package.json
├── tsconfig.json
├── src
│   └── index.ts
└── style
    └── index.css
```

Let's walk through the different files and look inside them:

#### README.md ####

````
# extension1

minimal lab example


## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install extension1
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```
````

#### package.json ####

this file contains information about the extension package such as its name
and its dependencies. It has to be adapted to be able to use other packages
from jupyter (if your IDE doesn't do so automatically)

