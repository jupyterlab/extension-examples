# Documents

> Create new documents and make them collaborative.

![Documents example](./preview.gif)

> ⚠ **This example only works on JupyterLab v3.1 or higher**

> Before starting this guide, it is strongly recommended to look at the documentation, precisely the section of [Documents](https://jupyterlab.readthedocs.io/en/stable/extension/documents.html#documents)

- [Documents](#documents)
  - [Introduction to documents](#introduction-to-documents)
  - [Factories](#factories)
  - [Registering new Documents](#registering-new-documents)
  - [Document Widget](#document-widget)
  - [Document Model](#document-model)
  - [Shared Model](#shared-model)

## Introduction to documents

In JupyterLab, we refer to a document to those widgets backed by a file stored on disk. These files are represented in the frontend by a `Context` which is the bridge between the file and its model, `DocumentModel` representing the data in the file and `DocumentWidget`, which is the view of the model. To make the documents API extensible to enable other developers to write new extensions to support different file types, JupyterLab introduces the `DocumentRegistry` to register new `FileType`s, `DocumentModel`s and `DocumentWidget`s. This way, when opening a new file, the `DocumentManager` will look into the file metadata and create an instance of `Context` with the right `DocumentModel` for this file. To register new documents, you can create factories, either a `ModelFactory` for the model or a `WidgetFactory` for the view.

## Factories

Factories are objects meant to create instances of the suitable widget/model given a file. For example, when the `DocumentManager` detects that the file is a notebook, it uses the notebook widget factory to create a new instance of `NotebookPanel`. On the other hand, if you want to make a new `DocumentModel` or `DocumentWidget` for a specific file type, you have to create a factory and register it to the `DocumentRegister`. When registering a factory, you tell the `DocumentManager` that you added a new model or widget for a specific file. Then, the `DocumentManager` will use those factories to create instances of the new `DocumentModel` or `DocumentWidget`.

The easiest way of creating a new widget factory is extending from the `ABCWidgetFactory<T, U>` and overwrite its method `createNewWidget`. The `DocumentManager` calls `createNewWidget` to create a new widget for a given file. This method receives as an argument the context which includes the model. In this method, you can create and pass as an argument all the objects your `DocumentWidget` needs. Usually, the `DocumentWidget` needs context and the content. The content is the main view of the `DocumentWidget` (you can find more information on the section for the [Document Widget](#document-widget)).

<!-- prettier-ignore-start -->
```ts
// src/factory.ts#L33-L40

protected createNewWidget(
  context: DocumentRegistry.IContext<ExampleDocModel>
): ExampleDocWidget {
  return new ExampleDocWidget({
    context,
    content: new ExamplePanel(context),
  });
}
```
<!-- prettier-ignore-end -->

On the other hand, to create a `ModelFactory`, you need to implement the interface `IModelFactory<T>` specifying the name of your model, which type of files represents and its format.

<!-- prettier-ignore-start -->
```ts
// src/factory.ts#L46-L47

export class ExampleDocModelFactory
  implements DocumentRegistry.IModelFactory<ExampleDocModel>
```
<!-- prettier-ignore-end -->

At the same time, you need to implement the method `createNew`. The `DocumentManager` will call this method when opening a file that uses your custom `DocumentModel`.

<!-- prettier-ignore-start -->
```ts
// src/factory.ts#L109-L111

createNew(languagePreference?: string, modelDB?: IModelDB): ExampleDocModel {
  return new ExampleDocModel(languagePreference, modelDB);
}
```
<!-- prettier-ignore-end -->

## Registering new Documents

When registering a new document, first of all, you need to know for what file type is your new `DocumentModel`. If the file type is already registered, you won't need to register it again. You could register a new `DocumentModel` for an existing file type. If the file type you want to support is not registered, you will need to register it. To do that, you can use the API `addFileType` from the `DocumentRegistry`. The essential arguments are `extensions` to indicate the extension of the file, `fileFormat` that specifies the data format, and `contentType` to determine if it is a notebook, file or directory.

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L73-L81

// register the filetype
app.docRegistry.addFileType({
  name: 'example',
  displayName: 'Example',
  mimeTypes: ['text/json', 'application/json'],
  extensions: ['.example'],
  fileFormat: 'text',
  contentType: 'file',
});
```
<!-- prettier-ignore-end -->

Once the file type is registered, you can register a `DocumentModel` for a specific file type. The `DocumentModel` represents the content of the file. For example, JupyterLab has two models registered for the notebook. When you open a notebook with the Notebook editor, the `DocumentManager` creates an instance of the `NotebookModel` that loads the notebook as a JSON object and offers a complex API to manage cells and metadata independently (treats the content of the notebook as a structured data). When opening a notebook with the plain text editor the `DocumentManager` creates an instance of the base `DocumentModel` class which treats the content of the notebook as a string. Note that you can register multiple models for the same file type. Still, these models are not in sync when the user opens two editors for the same file that use different models (like opening a notebook with the notebook editor and the plain text editor). These editors are not in sync because they use different models. At some point, they will show different content.

To register a new `DocumentModel` we can use the API `addModelFactory` from the `DocumentRegistry`. In this case, we created the model factory without arguments, but you can add the argument that you need.

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L70-L71

const modelFactory = new ExampleDocModelFactory();
app.docRegistry.addModelFactory(modelFactory);
```
<!-- prettier-ignore-end -->

The last step is to register the `DocumentWidget`. As with the `DocumentModel`, you can register a widget for an existing model or a new model if the existing ones fit your needs. In this case, different widgets using the same model will stay in sync. The `DocumentWidget` is the view for the model, and it is only the layer that allows users to interact with the content of the file.

To register a new `DocumentWidget` we can use the API `addWidgetFactory` from the `DocumentRegistry`. The main arguments you need to add to the factory are the widget's name, the name of the model that this widget uses, a list of file types that the widget can open, and the list of file types that the widget is the default view.

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L49-L67

// Creating the widget factory to register it so the document manager knows about
// our new DocumentWidget
const widgetFactory = new ExampleWidgetFactory({
  name: FACTORY,
  modelName: 'example-model',
  fileTypes: ['example'],
  defaultFor: ['example'],
});

// Add the widget to the tracker when it's created
widgetFactory.widgetCreated.connect((sender, widget) => {
  // Notify the instance tracker if restore data needs to update.
  widget.context.pathChanged.connect(() => {
    tracker.save(widget);
  });
  tracker.add(widget);
});
// Registering the widget factory
app.docRegistry.addWidgetFactory(widgetFactory);
```
<!-- prettier-ignore-end -->

## Document Widget

The `DocumentWidget` is the view that will open when opening the file. The `DocumentWidget` contains four main attributes:

- `context`: The context is the bridge between the file on disk and its representation on the frontend. This context includes all the information about the file and some methods to handle the file as its content. Some other attributes you can find in the context are the `DocumentModel` and the `sessionContext`, which handles the communication with the backend.
- `title`: Which handles the content of the tab.
- `toolbar`: The editor's toolbar, where you can add different widgets to trigger actions on the document.
- `contentHeader`: This is a panel between the toolbar and the main content area. You can see this header as a second toolbar or as a notification area.
- `content`: The content is the main area of the `DocumentWidget` when you add the view for your document.

## Document Model

The `DocumentModel` represents the file in the frontend. Through the model, you can listen to changes in the state of the file like its metadata or some other properties like `dirty` that indicates that the content differs from disk, and you can modify and listen to changes on the content. The main methods on the `DocumentModel` are `toString` and `fromString`, every file but the notebook is loaded/saved to disk as a string using these methods.

## Shared Model

In JupyterLab v3.1, we introduced the package `@jupyterlab/shared-models` to swap `ModelDB` as a data storage to make the notebooks collaborative. We implemented these shared models using [Yjs](https://yjs.dev), a high-performance CRDT for building collaborative applications that automatically sync. You can find all the documentation of Yjs [here](https://docs.yjs.dev).

Yjs documents (`Y.Doc`) are the main class on Yjs. They represent a shared document between clients and hold multiple shared objects. Yjs documents enable you to share different [data types like text, Array, Map or set](https://docs.yjs.dev/getting-started/working-with-shared-types), which makes it possible to create not only collaborative text editors but diagrams, drawings and much more applications.

To sync content between clients, Yjs uses providers. Providers abstract Yjs from the network technology your application uses. They sync Yjs documents through a communication protocol or a database. Most providers have in common that they use the concept of room names to connect Yjs documents. In JupyterLab, we created a package called `@jupyterlab/docprovider` with a WebSocket provider that syncs documents through a new end-point (`api/yjs`) in the JupyterLab server.

Another critical component of Yjs is Awareness. Every Yjs document has an `awareness` attribute that enables you to share user's information like its name, cursor, mouse pointer position, etc. The `awareness` attribute doesn't persist across sessions. Instead, Yjs uses a tiny state-based Awareness CRDT that propagates JSON objects to all users. When you go offline, your awareness state is automatically deleted and notifies all users that you went offline.

After a short explanation of Yjs' features, now it's time to start with the implementation. You can create a new shared model by extending from `YDocument<T>`. [YDocument](https://jupyterlab.readthedocs.io/en/stable/api/classes/shared_models.ydocument.html) is a generic implementation of a shared model that handles the initialization of the `YDoc` and already implements some functionalities like the changes history.

To create a new shared object, you have to use the `ydoc`. The new attribute will be linked to the `ydoc` and sync between the different clients automatically. You can also listen to changes on the shared attributes to propagate them to the `DocumentWidget`.

<!-- prettier-ignore-start -->
```ts
// src/model.ts#L340-L341

this._content = this.ydoc.getMap('content');
this._content.observe(this._contentObserver);
```
<!-- prettier-ignore-end -->

To access the information about the different users connected, you can use the `awareness` attribute on the shared model. The `awareness` keeps the state of every user as a map with the user's id as a key and a JSON object as the value for the state. You could add new information to the user's state by using the method `setLocalStateField` and access to the state of all users with `getStates`. To listen for changes on the state of the users, you can use the method `on('change', () => {})`.

<!-- prettier-ignore-start -->
```ts
// src/model.ts#L279-L279

this.sharedModel.awareness.setLocalStateField('mouse', pos);
```
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
```ts
// src/model.ts#L302-L302

const clients = this.sharedModel.awareness.getStates();
```
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
```ts
// src/model.ts#L41-L41

this.sharedModel.awareness.on('change', this._onClientChanged);
```
<!-- prettier-ignore-end -->

Every time you modify a shared property, this property triggers an event in all the clients to notify them. Still, sometimes you will need to apply a series of modifications as a single transaction to trigger the event only when it has applied all the changes. In this case, you can use the `transaction` method to group all the operations.

<!-- prettier-ignore-start -->
```ts
// src/model.ts#L183-L186

this.sharedModel.transact(() => {
  this.sharedModel.setContent('position', { x: obj.x, y: obj.y });
  this.sharedModel.setContent('content', obj.content);
});
```
<!-- prettier-ignore-end -->
