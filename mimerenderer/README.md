# jupyterlab-mp4

A JupyterLab extension for rendering mp4 files.

## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install @jupyterlab/mp4-extension
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

