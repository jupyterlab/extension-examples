# Kernel Messaging

* [Component Overview](#component-overview)
* [Initializing and managing a kernel session (panel.ts)](#initializing-and-managing-a-kernel-session-panelts)
* [Executing code and retrieving messages from a kernel (model.ts)](#executing-code-and-retrieving-messages-from-a-kernel-modelts)
* [Connecting a View to the Kernel](#connecting-a-view-to-the-kernel)
* [How does it look like](#how-does-it-look-like)

## Custom Kernel Interactions: Kernel Managment and Messaging

One of the main features of JupyterLab is the possibility to manage and
interact underlying compute kernels. In this section, we explore how to
start a kernel and execute a simple command on it.

## Component Overview

In terms of organization of this app, we want to have these components:

* `index.ts`: a JupyterLabPlugin that initializes the plugin and registers commands, menu tabs and a launcher
* `panel.ts`: a panel class that is responsible to initialize and hold the kernel session, widgets and models 
* `model.ts`: a KernelModel class that is responsible to execute code on the kernel and to store the execution result
* `widget.tsx`: a KernelView class that is responsible to provide visual elements that trigger the kernel model and display its results

The `KernelView` displays the `KernelModel` with some react html elements and
needs to get updated when `KernelModel` changes state, i.e. retrieves a new
execution result. Jupyterlab provides a two class model for such classes,
a `VDomRendered` that has a link to a `VDomModel` and a `render` function.
The `VDomRendered` listens to a `stateChanged` signal that is defined by the
`VDomModel`. Whenever the `stateChanged` signal is emitted, the
`VDomRendered` calls its `render` function again and updates the html elements
according to the new state of the model.

## Initializing and managing a kernel session (`panel.ts`)

Jupyterlab provides a class `ClientSession`
([documentation](http://JupyterLab.github.io/JupyterLab/classes/_apputils_src_clientsession_.clientsession.html))
that manages a single kernel session. Here are the lines that we need to start
a kernel with it:

```
        this._session = new ClientSession({
            manager: manager.sessions,
            path,
            name: 'Tutorial',
        });
        this._session.initialize();
```

well, that's short, isn't it? We have already seen the `manager` class that is
provided directly by the main JupyterLab application. `path` is a link to the
path under which the console is opened (?).

With these lines, we can extend the panel widget from 7_signals_and_buttons to intialize a
kernel. In addition, we will initialize a `KernelModel` class in it and
overwrite the `dispose` and `onCloseRequest` methods of the `StackedPanel`
([documentation](phosphorjs.github.io/phosphor/api/widgets/classes/stackedpanel.html))
to free the kernel session resources if the panel is closed. The whole adapted
panel class looks like this:

```
export
class TutorialPanel extends StackedPanel {
    constructor(manager: ServiceManager.IManager) {
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

        this._model = new KernelModel(this._session);
        this._tutorial = new TutorialView(this._model);

        this.addWidget(this._tutorial);
        this._session.initialize();
    }

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

    private _model: KernelModel;
    private _session: ClientSession;
    private _tutorial: TutorialView;
}
```

## Executing code and retrieving messages from a kernel (`model.ts`)

Once a kernel is initialized and ready, code can be executed on it through
the `ClientSession` class with the following snippet:

```
        this.future = this._session.kernel.requestExecute({ code });
```

Without getting too much into the details of what this `future` is, let's think
about it as an object that can receive some  messages from the kernel as an
answer on our execution request (see [jupyter messaging](http://jupyter-client.readthedocs.io/en/stable/messaging.html)).
One of these messages contains the data of the execution result. It is
published on a channel called `IOPub` and can be identified by the message
types `execute_result`, `display_data` and `update_display_data`.

Once such a message is received by the `future` object, it can trigger an
action.  In our case, we just store this message in `this._output` and then
emit a `stateChanged` signal. As we have explained above, our `KernelModel` is
a `VDomModel` that provides this  `stateChanged` signal that can be used by a
`VDomRendered`.  It is implemented as follows:

```
export
class KernelModel extends VDomModel {
    constructor(session: IClientSession) {
        super();
        this._session = session;
    }

    public execute(code: string) {
        this.future = this._session.kernel.requestExecute({ code });
    }

    private _onIOPub = (msg: KernelMessage.IIOPubMessage) => {
        let msgType = msg.header.msg_type;
        switch (msgType) {
            case 'execute_result':
            case 'display_data':
            case 'update_display_data':
                this._output = msg.content as nbformat.IOutput;
                console.log(this._output);
                this.stateChanged.emit(undefined);
            default:
                break;
        }
        return true
    }

    get output(): nbformat.IOutput {
        return this._output;
    }

    get future(): Kernel.IFuture {
        return this._future;
    }

    set future(value: Kernel.IFuture) {
        this._future = value;
        value.onIOPub = this._onIOPub;
    }

    private _output: nbformat.IOutput = null;
    private _future: Kernel.IFuture = null;
    private _session: IClientSession;
}
```

## Connecting a View to the Kernel

The only remaining thing left is to connect a View to the Model. We have
already seen the `TutorialView` before. To trigger the `render` function of a
`VDomRendered` on a `stateChanged` signal, we just need to add our `VDomModel`
to `this.model` in the constructor.  We can then connect a button to
`this.model.execute` and a text field to `this.model.output` and our extension
is ready:

```
export
class KernelView extends VDomRenderer<any> {
    constructor(model: KernelModel) {
        super();
        this.id = `TutorialVDOM`
        this.model = model
    }

    protected render(): React.ReactElement<any>[] {
        console.log('render');
        const elements: React.ReactElement<any>[] = [];
        elements.push(
            <button key='header-thread'
            className="jp-tutorial-button"
            onClick={() => {this.model.execute('3+5')}}>
            Compute 3+5</button>,

            <span key='output field'>{JSON.stringify(this.model.output)}</span>
        );
        return elements;
    }
}
```

## How does it look like

![Kernel Execution](_images/kernel_extension.gif)

Well that's nice, the basics are clear, but what about this weird output
object? In the next extensions, we will explore how we can reuse some jupyter
components to make things look nicer...

[Click here for the final extension: 6_kernel_messages](6_kernel_messages)
