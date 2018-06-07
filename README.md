# Jupyterlab Extensions for the Impatient #

## Prerequesites ##

This is a short tutorial series on how to write jupyterlab extensions. Writing
an extension is not particularly difficult but requires a very basic knowledge
of javascript and typescript. _Don't be scared, I never
coded in typescript before I touched jupyterlab but found it easier
to understand than pure javascript if you have a basic understanding of object
oriented programming and types._

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
├── package.json
├── README.md
├── src
│   └── index.ts
├── style
│   └── index.css
└── tsconfig.json
```
