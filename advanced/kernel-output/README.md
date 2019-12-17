# Kernel Output - Simple Notebook-style Rendering

- [Code structure](#code-structure)
- [Initializing a Kernel Session](#initializing-a-kernel-session)
- [OutputArea and Model](#outputarea-and-model)
- [Asynchronous Extension Initialization](#asynchronous-extension-initialization)
- [Make it Run](#make-it-run)

![OutputArea class](preview.gif)

In this example, you will see how initialize a kernel, how to execute code
and how to display the rendered output. The `OutputArea` class used by Jupyterlab
to render an output area under a notebook cell or in the console will be reused.

Essentially, `OutputArea` will render the data that comes as a reply to an
execute message sent to an underlying kernel. Under the hood, the
`OutputArea` and the `OutputAreaModel` classes act similarly to the `KernelView`
and `KernelModel` classes defined in the [Kernel Messaging](../kernel-messaging/README.md)
example.

## Code structure

The code is separated into two parts:

1.  the JupyterLab plugin that activates all the extension components and connects
    them to the main `Jupyterlab` application via commands, launcher and menu
    items,
2.  a panel that contains the extension logic and UI elements to interact with it.

The first part is contained in the `index.ts` file and the second in `panel.ts`.

In the following sections, the logic will be first described. It is
followed by the visual element creation.

## Initializing a Kernel Session

To interact with a kernel, you first need to create a `ClientSession`
object ([see the documentation](https://jupyterlab.github.io/jupyterlab/apputils/classes/clientsession.html)).
Here it is stored in the private `_session` variable:

```ts
// src/panel.ts#L71-L71

private _session: ClientSession;
```

A `ClientSession` handles a single kernel session. The session itself (not yet
the kernel) is started with these lines:

```ts
// src/panel.ts#L32-L35

this._session = new ClientSession({
  manager: manager.sessions,
  name: 'Example'
});
```

The private session variable is exposed as read-only for other users
through a getter method:

```ts
// src/panel.ts#L49-L51

get session(): IClientSession {
  return this._session;
}
```

Once you have created a session, the associated kernel can be initialized
with this line:

```ts
// src/panel.ts#L44-L46

this._session.initialize().catch(reason => {
  console.error(`Fail to initialize session in ExamplePanel.\n${reason}`);
});
```

When a session has no predefined favourite kernel, a dialog will request the user to choose a kernel to start. Conveniently, this can
also be an already existing kernel, as you will see later.

The following two methods unsure the clean disposal of the session
when you close the panel.

```ts
// src/panel.ts#L53-L56

dispose(): void {
  this._session.dispose();
  super.dispose();
}
```

```ts
// src/panel.ts#L66-L69

protected onCloseRequest(msg: Message): void {
  super.onCloseRequest(msg);
  this.dispose();
}
```

## OutputArea and Model

The `SimplifiedOutputArea` class is a `Widget`, as described in the [widget example](../../widget-tracker/jupyter-widgets/README.md). You
can instantiate it with a new `OutputAreaModel`; this is class containing
the data to show:

```ts
// src/panel.ts#L37-L41

this._outputareamodel = new OutputAreaModel();
this._outputarea = new SimplifiedOutputArea({
  model: this._outputareamodel,
  rendermime: rendermime
});
```

`SimplifiedOutputArea` provides a static method `execute` that sends
some code to a kernel through a `ClientSession` ([see documentation](https://jupyterlab.github.io/jupyterlab/outputarea/classes/simplifiedoutputarea.html#execute)). And then it displays the result
in the specific `SimplifiedOutputArea` object you created:

```ts
// src/panel.ts#L58-L64

execute(code: string): void {
  SimplifiedOutputArea.execute(code, this._outputarea, this._session)
    .then((msg: KernelMessage.IExecuteReplyMsg) => {
      console.log(msg);
    })
    .catch(reason => console.error(reason));
}
```

The `SimplifiedOutputArea.execute` function receives at some point a response
message from the kernel which says that the code was executed (this message
does not contain the data that is displayed). When this message is received,
`.then` is executed and prints this message to the console.

To display the `SimplifiedOutputArea` Widget you need to add it to your
panel with:

```ts
// src/panel.ts#L43-L43

this.addWidget(this._outputarea);
```

The last step is to add the panel into JupyterLab.

## Asynchronous Extension Initialization

`index.ts` contains the code to initialize the extension.

First, it is a good practice to unify the extension commands into one namespace at the top of the file:

```ts
// src/index.ts#L21-L25

namespace CommandIDs {
  export const create = 'kernel-output:create';

  export const execute = 'kernel-output:execute';
}
```

You can then add the commands to the palette and the menu by iterating
on a list:

```ts
// src/index.ts#L86-L90

// add items in command palette and menu
[CommandIDs.create, CommandIDs.execute].forEach(command => {
  palette.addItem({ command, category });
  exampleMenu.addItem({ command });
});
```

To create new client session, the service manager must be obtained from
the JupyterLab application:

```ts
// src/index.ts#L45-L45

const manager = app.serviceManager;
```

To launch the panel, you need to wait for the service manager to be
ready. Then once the panel is created and its session is ready. It
can be inserted in the JupyterLab main area:

```ts
// src/index.ts#L49-L61

let panel: ExamplePanel;

function createPanel() {
  return manager.ready
    .then(() => {
      panel = new ExamplePanel(manager, rendermime);
      return panel.session.ready;
    })
    .then(() => {
      shell.add(panel, 'main');
      return panel;
    });
}
```

## Make it Run

This example assumes you have a variable, named `df`, in your python kernel that could
contain a [pandas](https://pandas.pydata.org/) dataframe. You can display it in your panel by adding the following command:

```ts
// src/index.ts#L75-L84

commands.addCommand(CommandIDs.execute, {
  label: 'kernel-output: Show Dataframe',
  caption: 'Show Dataframe',
  execute: async () => {
    if (!panel) {
      await createPanel();
    }
    panel.execute('df');
  }
});
```
