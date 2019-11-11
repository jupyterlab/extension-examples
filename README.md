# Jupyterlab Extensions by Examples

![Github Actions Status](https://github.com/jtpio/jupyterlab-extension-examples/workflows/CI/badge.svg)

## TL;DR

The goal of this repository is to show how to develop extensions on [JupyterLab](https://github.com/jupyterlab/jupyterlab).
It is presented as short tutorial series.

```bash
git clone https://github.com/jtpio/jupyterlab-extension-examples.git &&
  cd jupyterlab-extension-examples && \
  conda env create && \
  conda activate jupyterlab-extension-examples && \
  cd hello_world && \
  jlpm && \
  jlpm run build && \
  jupyter labextension link .

# In another terminal
jupyter lab --watch

# open http:/localhost:8888?token=???
```

## Develop by Examples

You may find easier to learn how to extend `by examples` instead of going through the documentation. Start with the `hello_world` and jump then to the topic you are interested in.

+ [Hello World](./hello_world)
+ [Commands and Menus](./commands_and_menus)
+ [Signals and Buttons](./signals_and_buttons)
+ [Widgets](./widgets)
+ [Datagrid](./datagrid)
+ [Jupyter Widgets](./jupyter_widgets)
+ [Kernel Output](./kernel_output)
+ [Kernel Messaging](./kernel_messaging)
+ [Serving Files](./serving_files)

## About JupyterLab

Jupyterlab can be used as a platform to combine existing data-science components into a
new powerful application that can be deployed remotely for many users. Some of the higher
level components that can be used are text editors, terminals, notebooks, interactive widgets,
filebrowser, renderers for different file formats that provide access to an enormous ecosystem
of libraries from different languages.

## Prerequisites

Writing an extension is not particularly difficult but requires very basic knowledge of JavaScript
and Typescript and potentially Python.

_Don't be scared of Typescript, even if you never coded in TypeScript before you touch
JupyterLab you will find it easier to understand than pure JavaScript if you have a
basic understanding of object oriented programming and types._

These examples are developed and tested on top of JupyterLab version 1.2.
You can create a [conda](https://docs.conda.io/en/latest/miniconda.html) environment to get started.

```bash
conda env create && \
  conda activate jupyterlab-extension-tutorial
```

## Develop and Use the Examples

> Applicable to each of the examples.

For a development install (requires npm version 4 or later), do the following in the example directory.

```bash
jlpm install
jlpm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab application.

```bash
jlpm run build
jupyter lab build
```

Start JupyterLab in watch mode.

```bash
jupyter lab --watch
```

## Official Documentation

Complementary, you can rely on the official JupyterLab documentation.

* https://jupyterlab.readthedocs.io/en/stable/developer/extension_dev.html
* https://jupyterlab.readthedocs.io/en/stable/developer/extension_points.html
* http://jupyterLab.readthedocs.io/en/stable/developer/extension_tutorial.html

## Install a Published Extension

Once your extension is published (not part of this tutorial), you can install it without source compilation.

```bash
jupyter labextension install <published_extension>
```
