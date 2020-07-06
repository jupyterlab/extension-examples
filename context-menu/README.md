# Context Menu

> Create a new button in a context menu.

This is a basic example to show how to add a new button to an existent context menu.

![context menu example](preview.gif)

In JupyterLab there are some widgets using context menus and they offer an easy way to access and add new elements using CSS classes. In this example, you will learn how to add a new button to the file browser's items and at the same time how to register a new type of files.

> Note:
> It is strongly recommended to read [commands](https://github.com/jupyterlab/extension-examples/tree/master/commands) example before diving into this one.

To implement this example you need to install the `@jupyterlab/filebrowser`, where you can find the interface `IFileBrowserFactory` necessary to require the file browser instance of JupyterLab.

To make this example a functional exercise you will use some other packages that you can find in the code, but the strictly necessary to add a new button in a context menu is the described above.

First of all, you will start looking into the declaration of the extension:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L6-L11

const extension: JupyterFrontEndPlugin<void> = {
  id: 'context-menu',
  autoStart: true,
  requires: [IFileBrowserFactory],
  optional: [],
  activate: (app: JupyterFrontEnd, factory: IFileBrowserFactory) => {
```
<!-- prettier-ignore-end -->

For this extension, you need to require `IFileBrowserFactory` to track the file browser's item clicked by the user and obtain his information.

In this case, the first step is optional. The example shows you how to create a new file type and add the context menu only to this file type but, you also can jump this step and add your button to an existent file type or all of them.

To register a new file type, you need to call the `addFileType()` method of `docRegistry` property present in `JupyterFrontEnd` object, this method receive as a parameter an `IFileType` object with some properties to define your file type, the most important are:

- `name`: Which identifies the new file's type.
- `extension`: Which can be multiple extensions.
- `fileFormat`: Indicates file's content format (base64, json or text).
- `contentType`: Indicates file's type (directory, notebook or file).
- `mimeType`: Indicates the content's mime type.

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L13-L21

app.docRegistry.addFileType({
  name: 'example',
  icon: runIcon,
  displayName: 'Example File',
  extensions: ['.example'],
  fileFormat: 'text',
  contentType: 'file',
  mimeTypes: ['text/plain']
});
```
<!-- prettier-ignore-end -->

The next step consists of defining the command that will be executed when clicking the button. If you want to access the item information, you need to use the `IFileBrowserFactory` object to obtain the file browser's selected item.

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L23-L36

app.commands.addCommand('jlab-examples/context-menu:open', {
  label: 'Example',
  caption: "Example context menu button for file browser's items.",
  icon: buildIcon,
  execute: () => {
    const file = factory.tracker.currentWidget.selectedItems().next();

    showDialog({
      title: file.name,
      body: "Path: " + file.path,
      buttons: [ Dialog.okButton() ]
    }).catch( e => console.log(e) );
  }
});
```
<!-- prettier-ignore-end -->

Finally, you can add the command to a context menu using the `addItem()` method present in the `contextMenu` property, this method receives as a parameter an `IItemOptions` object with the following properties:

- `command`: Identifies the command to execute.
- `selector`: CSS classes of the widget where you want to add the button.
- `rank`: Position in the context menu for your button.

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L38-L42

app.contextMenu.addItem({
  command: 'jlab-examples/context-menu:open',
  selector: '.jp-DirListing-item[data-file-type="example"]',
  rank: 0
});
```
<!-- prettier-ignore-end -->

It is worth noting that the `selector` has different options, the first part is the CSS class that identifies the file browser `.jp-DirListing-item` and the second part `[data-file-type="example"]` is the parameter for the CSS class. You can omit the second part to add the button to every file type.

You can find some of the CSS classes that identify different widgets in JupyterLab [here](https://jupyterlab.readthedocs.io/en/stable/developer/css.html#commonly-used-css-selectors) with some of his parameters.
