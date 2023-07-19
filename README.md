# JupyterLab Extensions by Examples

[![Github Actions Status](https://github.com/jupyterlab/extension-examples/workflows/CI/badge.svg)](https://github.com/jupyterlab/extension-examples/actions?query=workflow%3ACI)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jupyterlab/extension-examples/main?urlpath=lab)

1. [Goal](#tldr)
1. [Develop by Examples](#develop-by-examples)
   1. [CodeMirror extension](#codemirror-extension)
   1. [Commands](#commands)
   1. [Command Palette](#command-palette)
   1. [Completer](#completer)
   1. Main Widget [Content Header](#main-widget-content-header)
   1. [Context Menu](#context-menu)
   1. [Custom Log Console](#custom-log-console)
   1. [Datagrid](#datagrid)
   1. [Collaborative Document](#collaborative-document)
   1. _[Hello World](#hello-world)_
   1. [Kernel Messaging](#kernel-messaging)
   1. [Kernel Output](#kernel-output)
   1. [Launcher](#launcher)
   1. [Log Messages](#log-messages)
   1. [Main Menu](#main-menu)
   1. [Metadata Form](#metadata-form)
   1. [MIME Renderer](#mime-renderer)
   1. [Notifications](#notifications)
   1. [React Widget](#react-widget)
   1. _[Server Hello World](#server-hello-world)_
   1. [Settings](#settings)
   1. [Signals](#signals)
   1. [State](#state)
   1. [Toolbar Item](#toolbar-item)
   1. [Top Area Text Widget](toparea-text-widget)
   1. [Widgets](#widgets)
1. [Prerequisites](#prerequisites)
1. [Develop and Use the Examples](#develop-and-use-the-examples)
1. [Test the Examples](#test-the-examples)
1. [Install a Published Extension](#install-a-published-extension)
1. [About JupyterLab](#about-jupyterlab)
1. [Credits](#credits)
1. [Community Guidelines and Code of Conduct](#community-guidelines-and-code-of-conduct)

## TL;DR

The goal of this repository is to show how to develop extensions for [JupyterLab](https://github.com/jupyterlab/jupyterlab), presented as short tutorial series.

To get started:

```bash
# clone the repository
git clone https://github.com/jupyterlab/extension-examples.git jupyterlab-extension-examples

# go to the extension examples folder
cd jupyterlab-extension-examples

# create a new environment
conda env create

# activate the environment
conda activate jupyterlab-extension-examples

# go to the hello world example
cd hello-world

# Required to deal with Yarn 3 workspace rules
touch yarn.lock

# install the extension in editable mode
python -m pip install -e .

# install your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite

# build the TypeScript source after making changes
jlpm run build

# start JupyterLab
jupyter lab
```

The examples currently target **JupyterLab 4.0 or later**.

If you would like to use the examples with JupyterLab 3.x, check out the [3.x branch](https://github.com/jupyterlab/extension-examples/tree/3.x).

If you would like to use the examples with JupyterLab 2.x, check out the [2.x branch](https://github.com/jupyterlab/extension-examples/tree/2.x).

If you would like to use the examples with JupyterLab 1.x, check out the [1.x branch](https://github.com/jupyterlab/extension-examples/tree/1.x).

Note that the `1.x`, `2.x` and `3.x` branches are not updated anymore.

## Develop by Examples

You may find it easier to learn how to create extensions _by examples_, instead of going through the documentation.

Start with the [Hello World](hello-world) and then jump to the topic you are interested in.

- [CodeMirror extension](codemirror-extension)
- [Commands](commands)
- [Command Palette](command-palette)
- [Completer](completer)
- Main Widget [Content Header](contentheader)
- [Context Menu](context-menu)
- [Custom Log Console](custom-log-console)
- [Datagrid](datagrid)
- [Collaborative Document](documents)
- [Hello World](hello-world)
- [Kernel Messaging](kernel-messaging)
- [Kernel Output](kernel-output)
- [Launcher](launcher)
- [Log Messages](log-messages)
- [Main Menu](main-menu)
- [Metadata Form](metadata-form)
- [MIME Renderer](mimerenderer)
- [Notifications](notifications)
- [React Widget](react-widget)
- [Server Hello World](server-extension)
- [Settings](settings)
- [Signals](signals)
- [State](state)
- [Toolbar item](toolbar-button)
- [Top Area Text Widget](toparea-text-widget)
- [Widgets](widgets)

You can expect from each example:

- An explanation of its functionality.
- An image or screencast showing its usage.
- The list of used JupyterLab API and Extension Points.
- Explanations of the internal working, illustrated with code snippets.

We have structured the examples based on the [extension points](https://jupyterlab.readthedocs.io/en/stable/extension/extension_points.html). Browse the previews below or skip them and [jump directly to the sections for developers](#prerequisites).

You are welcome to open any [issue](https://github.com/jupyterlab/extension-examples/issues) or [pull request](https://github.com/jupyterlab/extension-examples/pulls).

### [CodeMirror extension](codemirror-extension)

Add a configurable CodeMirror extension.

[![CodeMirror extension](codemirror-extension/preview.png)](codemirror-extension)

### [Commands](commands)

Extend the main app with a Command.

[![Command example](commands/preview.png)](commands)

### [Command Palette](command-palette)

Register commands in the Command Palette.

[![Command Palette](command-palette/preview.png)](command-palette)

### [Completer](completer)

Customize tab autocomplete data sources.

[![Completer](completer/preview.png)](completer)

### Main Widget [Content Header](contentheader)

Put widgets at the top of a main JupyterLab area widget.

[![contentHeader](contentheader/preview.gif)](contentheader)

### [Context Menu](context-menu)

Add a new button to an existent context menu.

[![Context Menu](context-menu/preview.gif)](context-menu)

### [Custom Log Console](custom-log-console)

Create a new log console.

[![Custom Log Console](custom-log-console/preview.gif)](custom-log-console)

### [Datagrid](datagrid)

Display a Datagrid as a Lumino Widget.

[![Datagrid](datagrid/preview.png)](datagrid)

### [Collaborative Document](documents)

Create new documents and make them collaborative.

[![Documents](documents/preview.png)](documents)

### [Hello World](hello-world)

Set up the development environment and print to the console.

[![Hello World](hello-world/preview.png)](hello-world)

### [Kernel Messaging](kernel-messaging)

Interact with a kernel from an extension.

[![Kernel Messages](kernel-messaging/preview.gif)](kernel-messaging)

### [Kernel Output](kernel-output)

Render kernel messages in an OutputArea.

[![OutputArea class](kernel-output/preview.gif)](kernel-output)

### [Launcher](launcher)

Start your extension from the Launcher.

[![Launcher](launcher/preview.gif)](launcher)

### [Log Messages](log-messages)

Send a log message to the log console.

[![Log Messages](log-messages/preview.gif)](log-messages)

### [Main Menu](main-menu)

Add a Menu to the main app.

[![Main Menu](main-menu/preview.png)](main-menu)

### [Metadata Form](metadata-form)

Add user interface to edit cell or notebook metadata.

[![Metadata Form](metadata-form/preview.gif)](metadata-form)

## [MIME Renderer](mimerenderer)

Add a MIME renderer for mp4 content to the application.

[![MIME Renderer](mimerenderer/preview.png)](mimerenderer)

### [Notifications](notifications)

Emit notifications.

[![Notifications](notifications/preview.gif)](notifications)

### [React Widget](react-widget)

Create a React.js Widget in JupyterLab.

[![react-widget](react-widget/preview.gif)](react-widget)

### [Server Hello World](server-extension)

Create a minimal extension with backend (i.e. server) and frontend parts.

[![Server Hello World](server-extension/preview.png)](server-extension)

### [Settings](settings)

Create and use new Settings for your extension.

[![Settings](settings/preview.gif)](settings)

### [Signals](signals)

Use Signals to allow Widgets communicate with each others.

[![Button with Signal](signals/preview.png)](signals)

### [State](state)

Use State persistence in an extension.

[![State](state/preview.gif)](state)

### [Toolbar Item](toolbar-button)

Add a new button to the notebook toolbar.

[![Toolbar button](toolbar-button/preview.gif)](toolbar-button)

### [Top Area Text Widget](toparea_text_widget)

Adds a text widget to the top area.

[![Top Area Text Widget](toparea-text-widget/preview.jpg)](toparea-text-widget)

### [Widgets](widgets)

Add a new Widget element to the main window.

[![Custom Tab](widgets/preview.png)](widgets)

## Prerequisites

Writing an extension requires basic knowledge of JavaScript, Typescript and potentially Python.

_Don't be scared of Typescript, even if you never coded in TypeScript before you touch
JupyterLab you may find it easier to understand than pure JavaScript if you have a
basic understanding of object oriented programming and types._

These examples are developed and tested on top of JupyterLab.
You can create a [conda](https://docs.conda.io/en/latest/miniconda.html) environment to get started
after cloning this repository.

```bash
conda env create && \
  conda activate jupyterlab-extension-examples
```

> The previous command will use the [environment.yml](https://github.com/jupyterlab/extension-examples/blob/main/environment.yml) file as requirements for the environment.

## Develop and Use the Examples

### Build and Install all Examples at once

```bash
jlpm
jlpm build-ext
jlpm install-py
jlpm install-ext
jupyter lab
```

To rebuild all the extensions:

```bash
jlpm build-ext
```

To clean the lib folders:

```bash
jlpm clean-ext
```

### Build and Install one Example

Go to the example directory you want to install, e.g. `cd ./hello-world`, and run the following commands:

```bash
touch yarn.lock
pip install -e .
jupyter labextension develop . --overwrite
```

Rebuild the extension:

```bash
jlpm run build
```

You can now start JupyterLab and check if your extension is working fine:

```bash
jupyter lab
```

### Change the Sources

If you want to develop and iterate on the code, you will need to open 2 terminals.

In terminal 1, go to the extension folder and run the following:

```bash
jlpm watch
```

Then in terminal 2, start JupyterLab:

```bash
jupyter lab
```

From there, you can change your extension source code, it will be recompiled,
and you can refresh your browser to see your changes.

We are using [embedme](https://github.com/zakhenry/embedme) to embed code snippets into the markdown READMEs. If you make changes to the source code, ensure you update the README and run `jlpm embedme` from the root of the repository to regenerate the READMEs.

### Update extension template

Execute from the example root folder:

```sh
./scripts/update-template.sh
```

Then fix the conflicts.

## Test the Examples

The examples are automatically tested for:

- Homogeneous configuration:  
  Configuration files are compared to the reference ones of the _hello-world_ example
- TypeScript code lint
- Installation in JupyterLab:  
  The installation is checked by listing the installed extension and running JupyterLab with the helper `python -m jupyterlab.browser_check`
- Integration test:  
  Those tests are emulating user action in JupyterLab to check the extension is behaving as expected.  
  The tests are defined in the `ui-tests` subfolder within each example.
  This is possible thanks to a tool called [playwright](https://playwright.dev/).

## Install a Published Extension

Once your extension is published on [pypi.org](https://pypi.org/) (outside of this scope), you can install it
with the following command:

```bash
pip install <published_extension>
```

## About JupyterLab

JupyterLab can be used as a platform to combine existing data-science components into a
new powerful application that can be deployed remotely to many users. Some of the higher
level components that can be used are text editors, terminals, notebooks, interactive widgets,
filebrowser, renderers for different file formats that provide access to an enormous ecosystem
of libraries from different languages.

Complementary to these examples, you can rely on the official JupyterLab documentation.

- [Extension Developer Guide](https://jupyterlab.readthedocs.io/en/stable/extension/extension_dev.html)
- [Common Extension Points](https://jupyterlab.readthedocs.io/en/stable/extension/extension_points.html)
- [Astronomy Picture of the Day JupyterLab Extension](https://jupyterLab.readthedocs.io/en/stable/extension/extension_tutorial.html)

## Credits

We would like to thank [MMesch](https://github.com/MMesch) for [initiating this work](https://github.com/MMesch/labextension_tutorial), as well as everyone else who contributed!

## Community Guidelines and Code of Conduct

This examples repository is a Jupyter project and follows the Jupyter
[Community Guides and Code of Conduct](https://jupyter.readthedocs.io/en/latest/community/content-community.html).
