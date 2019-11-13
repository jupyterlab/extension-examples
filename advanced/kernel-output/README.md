## Kernel Output - Simple Notebook-style Rendering

* [Reorganizing the extension code](#reorganizing-the-extension-code)
* [Initializing a Kernel Session](#initializing-a-kernel-session)
* [OutputArea and Model](#outputarea-and-model)
* [asynchronous extension initialization](#asynchronous-extension-initialization)
* [Make it Run](#make-it-run)
* [Jupyter-Widgets: Adding Interactive Elements](#jupyter-widgets-adding-interactive-elements)

In this extension we will see how initialize a kernel, and how to execute code
and how to display the rendered output. We use the `OutputArea` class for this
purpose that Jupyterlab uses internally to render the output area under a
notebook cell or the output area in the console.

Essentially, `OutputArea` will renders the data that comes as a reply to an
execute message that was sent to an underlying kernel. Under the hood, the
`OutputArea` and the `OutputAreaModel` classes act similar to the `KernelView`
and `KernelModel` classes that we have defined ourselves before.  We therefore
get rid of the `model.ts` and `widget.tsx` files and change the panel class to:

## Reorganizing the extension code

Since our extension is growing bigger, we begin by splitting our code into more
managable units. Roughly we can see three larger components of our application:

1.  the `JupyterLabPlugin` that activates all extension components and connects
    them to the main `Jupyterlab` application via commands, launcher, or menu
    items.
2.  a Panel that combines different widgets into a single application

We split these components in the two files:

```
src/
├── index.ts
└── panel.ts
```

Let's go first through `panel.ts`. This is the full Panel class that displays
starts a kernel, then sends code to it end displays the returned data with the
jupyter renderers:

```
export
class TutorialPanel extends StackedPanel {
    constructor(manager: ServiceManager.IManager, rendermime: RenderMimeRegistry) {
        super();
        this.addClass(PANEL_CLASS);
        this.id = 'TutorialPanel';
        this.title.label = 'Tutorial View'
        this.title.closable = true;

        let path = './console';

        this._session = new ClientSession({
            manager: manager.sessions,
            path,
            name: 'Tutorial',
        });

        this._outputareamodel = new OutputAreaModel();
        this._outputarea = new SimplifiedOutputArea({ model: this._outputareamodel, rendermime: rendermime });

        this.addWidget(this._outputarea);
        this._session.initialize();
    }

    dispose(): void {
        this._session.dispose();
        super.dispose();
    }

    public execute(code: string) {
        SimplifiedOutputArea.execute(code, this._outputarea, this._session)
            .then((msg: KernelMessage.IExecuteReplyMsg) => {console.log(msg); })
    }

    protected onCloseRequest(msg: Message): void {
        super.onCloseRequest(msg);
        this.dispose();
    }

    get session(): IClientSession {
        return this._session;
    }

    private _session: ClientSession;
    private _outputarea: SimplifiedOutputArea;
    private _outputareamodel: OutputAreaModel;
}
```

## Initializing a Kernel Session

The first thing that we want to focus on is the `ClientSession` that is 
stored in the private `_session` variable:

```
private _session: ClientSession;
```

A ClientSession handles a single kernel session. The session itself (not yet
the kernel) is started with these lines:

```
        let path = './console';

        this._session = new ClientSession({
            manager: manager.sessions,
            path,
            name: 'Tutorial',
        });
```

A kernel is initialized with this line:
```
        this._session.initialize();
```
In case that a session has no predefined favourite kernel, a popup will be
started that asks the user which kernel should be used. Conveniently, this can
also be an already existing kernel, as we will see later.

The following three methods add functionality to cleanly dispose of the session
when we close the panel, and to expose the private session variable such that
other users can access it.
```
    dispose(): void {
        this._session.dispose();
        super.dispose();
    }

    protected onCloseRequest(msg: Message): void {
        super.onCloseRequest(msg);
        this.dispose();
    }

    get session(): IClientSession {
        return this._session;
    }
```

## OutputArea and Model

The `SimplifiedOutputArea` class is a Widget, as we have seen them before. We
can instantiate it with a new `OutputAreaModel` (this is class that contains
the data that will be shown):

```
        this._outputareamodel = new OutputAreaModel();
        this._outputarea = new SimplifiedOutputArea({ model: this._outputareamodel, rendermime: rendermime });
```

`SimplifiedOutputArea` provides the classmethod `execute` that basically sends
some code to a kernel through a ClientSession and that then displays the result
in a specific `SimplifiedOutputArea` instance:

```
    public execute(code: string) {
        SimplifiedOutputArea.execute(code, this._outputarea, this._session)
            .then((msg: KernelMessage.IExecuteReplyMsg) => {console.log(msg); })
    }
```

The `SimplifiedOutputArea.execute` function receives at some point a response
message from the kernel which says that the code was executed (this message
does not contain the data that is displayed). When this message is received,
`.then` is executed and prints this message to the console.

We just have to add the `SimplifiedOutputArea` Widget to our Panel with:
```
        this.addWidget(this._outputarea);
```
and we are ready to add the whole Panel to Jupyterlab.

## Asynchronous extension initialization

`index.ts` is responsible to initialize the extension. We only go through
the changes with respect to the last sections.

First we reorganize the extension commands into one unified namespace:

```typescript
namespace CommandIDs {
    export
    const create = 'Ex7:create';

    export
    const execute = 'Ex7:execute';
}
```

This allows us to add commands from the command registry to the pallette and
menu tab in a single call:

```typescript
    // add items in command palette and menu
    [
        CommandIDs.create,
        CommandIDs.execute
    ].forEach(command => {
        palette.addItem({ command, category });
        tutorialMenu.addItem({ command });
    });
```

Another change is that we now use the `manager` to add our extension after the
other jupyter services are ready. The serviceManager can be obtained from the
main application as:

```typescript
    const manager = app.serviceManager;
```

to launch our application, we can then use:

```typescript
    let panel: TutorialPanel;

    function createPanel() {
        return manager.ready
            .then(() => {
                panel = new TutorialPanel(manager, rendermime);
                return panel.session.ready})
            .then(() => {
                shell.addToMainArea(panel);
                return panel});
    }
```

## Make it Run

Let's for example display the variable `df` from a python kernel that could
contain a pandas dataframe. To do this, we just need to add a command to the
command registry in `index.ts`

```
    command = CommandIDs.execute
    commands.addCommand(command, {
        label: 'Ex7: show dataframe',
        caption: 'show dataframe',
        execute: (args) => {panel.execute('df')}});
```

and we are ready to see it. The final extension looks like this:

![OutputArea class](_images/outputarea.gif)

[Click here for the final extension: 4a_outputareas](4a_outputareas)
