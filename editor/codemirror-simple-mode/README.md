# jupyterlab_examples_codemirror_simple_mode

![Github Actions Status](https://github.com/jupyterlab/extension-examples/workflows/Build/badge.svg)

add a simple syntax mode to CodeMirroterLab

## Requirements

- JupyterLab >= 3.0

## Install

```bash
pip install jupyterlab_examples_codemirror_simple_mode
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab_examples_codemirror_simple_mode directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm run watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

### Uninstall

```bash
pip uninstall jupyterlab_examples_codemirror_simple_mode
jupyter labextension uninstall @jupyterlab-examples/codemirror-simple-mode
```
