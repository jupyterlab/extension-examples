# JupyterLab Extensions by Examples

![Github Actions Status](https://github.com/jtpio/jupyterlab-extension-examples/workflows/CI/badge.svg)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jtpio/jupyterlab-extension-examples/master?urlpath=lab)

## TL;DR

The goal of this repository is to show how to develop extensions for [JupyterLab](https://github.com/jupyterlab/jupyterlab), presented as short tutorial series.

To get started:

```bash
git clone https://github.com/jtpio/jupyterlab-extension-examples.git &&
  cd jupyterlab-extension-examples && \
  conda env create && \
  conda activate jupyterlab-extension-examples && \
  cd basics/hello-world && \
  jlpm && \
  jlpm run build && \
  jupyter labextension link .

# In another terminal
jupyter lab --watch
```

## Develop by Examples

You may find it easier to learn how to create extensions _by examples_, instead of going through the documentation.

Start with the [Hello World](basics/hello-world) and then jump to the topic you are interested in.

- [Hello World](basics/hello-world)
- [Signals](basics/signals)
- [Datagrid](basics/datagrid)
- [Command Palette](command-palette)
- [Commands](commands)
- [Launcher](launcher)
- [Main Menu](main-menu)
- [Settings](settings)
- [State](state)
- [React Widget](react/react-widget)
- [Widgets](widget-tracker/widgets)
- [Kernel Output](advanced/kernel-output)
- [Kernel Messaging](advanced/kernel-messaging)
- [Server Hello World](advanced/server-extension)

You can expect from each example:

- An explanation of its functionality.
- An image or screencast showing its usage.
- The list of used JupyterLab API and Extension Points.
- Explanations of the internal working, illustrated with code snippets.

We have structured the examples based on the [extension points](https://jupyterlab.readthedocs.io/en/stable/developer/extension_points.html). Browse the previews below or skip them and [jump directly to the sections for developers](#prerequisites).

## Basic

### [Hello World](basics/hello-world)

[![Hello World](basics/hello-world/preview.png)](basics/hello-world)

### [Signals](basics/signals)

[![Button with Signal](basics/signals/preview.png)](basics/signals)

### [Datagrid](basics/datagrid)

[![Datagrid](basics/datagrid/preview.png)](basics/datagrid) |

## Command Palette

### [Command Palette](command-palette)

[![Commmand Palette](command-palette/preview.png)](command-palette)

## Commands

### [Commands](commands)

[![Commmand example](commands/preview.png)](commands)

## Launcher

### [Launcher](launcher)

[![Launcher](launcher/preview.gif)](launcher)

## Menus

### [Main Menu](main-menu)

[![Main Menu](main-menu/preview.png)](main-menu)

## Settings

### [Settings](settings)

[![Settings](settings/preview.gif)](settings)

## State

### [State](state)

[![State](state/preview.gif)](state)

## React

### [React Widget](react/react-widget)

[![react-widget](react/react-widget/preview.gif)](react/react-widget)

## Widget Tracker

### [Widgets](widget-tracker/widgets)

[![Custom Tab](widget-tracker/widgets/preview.png)](widget-tracker/widgets)

## Advanced

### [Kernel Output](advanced/kernel-output)

[![OutputArea class](advanced/kernel-output/preview.gif)](advanced/kernel-output)

### [Kernel Messaging](advanced/kernel-messaging)

[![Kernel Messages](advanced/kernel-messaging/preview.gif)](advanced/kernel-messaging)

### [Server Hello World](advanced/server-extension)

[![Server Hello World](advanced/server-extension/preview.png)](advanced/server-extension)

## Prerequisites

Writing an extension requires basic knowledge of JavaScript, Typescript and potentially Python.

_Don't be scared of Typescript, even if you never coded in TypeScript before you touch
JupyterLab you may find it easier to understand than pure JavaScript if you have a
basic understanding of object oriented programming and types._

These examples are developed and tested on top of JupyterLab version 1.2.
You can create a [conda](https://docs.conda.io/en/latest/miniconda.html) environment to get started.

```bash
conda env create && \
  conda activate jupyterlab-extension-examples
```

## Develop and Use the Examples

### Build and link all examples at once

```bash
jlpm
jlpm build-ext
jlpm link-ext
jlpm build-jlab
jupyter lab
```

To clean the lib folders:

```bash
jlpm clean-ext
```

### Build and link one example

Go to the example directory you want to install, e.g. `cd ./basics/hello-world`, and run the following commands:

```bash
jlpm install
jlpm run build
jupyter labextension link .
```

Rebuild the JupyterLab application:

```bash
jlpm run build
jupyter lab build
```

Start JupyterLab in watch mode:

```bash
jupyter lab --watch
```

## Install a Published Extension

Once your extension is published (outside of this scope), you can install it with the following command:

```bash
jupyter labextension install <published_extension>
```

## About JupyterLab

JupyterLab can be used as a platform to combine existing data-science components into a
new powerful application that can be deployed remotely to many users. Some of the higher
level components that can be used are text editors, terminals, notebooks, interactive widgets,
filebrowser, renderers for different file formats that provide access to an enormous ecosystem
of libraries from different languages.

## JupyterLab Documentation

Complementary to these examples, you can rely on the official JupyterLab documentation.

- [Extension Developer Guide](https://jupyterlab.readthedocs.io/en/stable/developer/extension_dev.html)
- [Common Extension Points](https://jupyterlab.readthedocs.io/en/stable/developer/extension_points.html)
- [Astronomy Picture of the Day JupyterLab Extension](https://jupyterLab.readthedocs.io/en/stable/developer/extension_tutorial.html)

## Credits

We would like to thank [MMesch](https://github.com/MMesch) for [initiating this work](https://github.com/MMesch/labextension_tutorial), as well as everyone else who contributed!
