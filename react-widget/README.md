# React Widget

> Create a React.js Widget in JupyterLab.

This extension shows how to use the `ReactWidget` wrapper from `@jupyterlab/apputils` to use React in a JupyterLab extension.

![react-widget](preview2.gif)

## Install

```bash
jlpm
jlpm build
jupyter labextension install .

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

## React Developer Tools

It is possible to use the [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=de) Chrome extension to inspect React components.

![react-dev-tools](preview.gif)
