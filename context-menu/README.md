# Context Menu

> Create a new button in a context menu.

This is a basic example to show how to add a new entry to an existent context menu.

![context menu example](preview.gif)

In JupyterLab plugins can expose context menus to offer an easy way to execute commands and perform actions. In this example, you will learn how to add a new entry to the file browser context menu to be displayed on files with extension `.example`.

> It is strongly recommended to read [commands](https://github.com/jupyterlab/extension-examples/tree/master/commands) example before diving into this one.

To implement this example you need to install the `@jupyterlab/filebrowser`, where you can find the interface `IFileBrowserFactory` necessary to require the file browser instance of JupyterLab.

> This is not necessary to create a context menu. But it is a common case to be extended.

First of all, you will start looking into the declaration of the extension:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L9-L13

const extension: JupyterFrontEndPlugin<void> = {
  id: 'context-menu',
  autoStart: true,
  requires: [IFileBrowserFactory],
  activate: (app: JupyterFrontEnd, factory: IFileBrowserFactory) => {
```
<!-- prettier-ignore-end -->

For this extension, you need to require `IFileBrowserFactory` to track the file browser item clicked by the user.

The first step is to define the command that will be executed when clicking on the context menu entry. If you want to access the item information, you need to use the `IFileBrowserFactory` object to obtain the file browser selected item.

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L14-L27

app.commands.addCommand('jlab-examples/context-menu:open', {
  label: 'Example',
  caption: "Example context menu button for file browser's items.",
  icon: buildIcon,
  execute: () => {
    const file = factory.tracker.currentWidget.selectedItems().next();

    showDialog({
      title: file.name,
      body: 'Path: ' + file.path,
      buttons: [Dialog.okButton()],
    }).catch((e) => console.log(e));
  },
});
```
<!-- prettier-ignore-end -->

Then, you can add the command to a context menu using the settings file.
You will need to define a context menu item under the property `context` of the special key
`jupyter.lab.menus`. And the properties of the context menu item are:

- `command`: the command to execute.
- `selector`: the CSS classes of the element on which you want to add the entry.
- `rank`: (optional) number to order the context menu entries

<!-- prettier-ignore-start -->
```json5
// schema/plugin.json#L4-L12

"jupyter.lab.menus": {
  "context": [
    {
      "command": "jlab-examples/context-menu:open",
      "selector": ".jp-DirListing-item[data-file-type=\"text\"]",
      "rank": 0
    }
  ]
},
```
<!-- prettier-ignore-end -->

The `selector` can be any valid [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors). In this case, the first part is the CSS class that identifies the file browser items `.jp-DirListing-item` and the second part `[data-file-type="text"]` is a attribute value to be found on the item; the `data-file-type` attribute is set with the file type name or `text` for generic files. You can omit the second part to add the command to every file type.

You can find some of the CSS classes that identify different widgets in JupyterLab in the [developer documentation](https://jupyterlab.readthedocs.io/en/stable/developer/css.html#commonly-used-css-selectors).

> See also the [documentation](https://jupyterlab.readthedocs.io/en/stable/extension/extension_points.html#context-menu).
