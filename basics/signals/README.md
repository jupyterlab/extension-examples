# Signals

> Use Signals to allow Widgets communicate with each others.

- [Lumino Signaling 101](#lumino-signaling-101)
- [A simple React Button](#a-simple-react-button)
- [Subscribing to a Signal](#subscribing-to-a-signal)

![Button with Signal](preview.png)

## Lumino Signaling 101

In this extension, a simple button will be added to print something to the console.
Communication between different components of JupyterLab is a key ingredient in building an
extension.

JupyterLab's Lumino engine uses the `ISignal` interface and the
`Signal` class that implements this interface for communication
([documentation](https://jupyterlab.github.io/lumino/api/signaling/globals.html)).

The basic concept is the following.

First, a widget (`button.ts`), in this case the one that contains
some visual elements such as a button, defines a signal and exposes it to other
widgets, as this `_stateChanged` signal:

```ts
// src/button.tsx#L24-L24

private _stateChanged = new Signal<ButtonWidget, void>(this);
```

```ts
// src/button.tsx#L6-L8

get stateChanged(): ISignal<ButtonWidget, void> {
  return this._stateChanged;
}
```

Another widget, in this case the panel (`panel.ts`)that boxes several different widgets,
subscribes to the `stateChanged` signal and links some function to it:

```ts
// src/panel.ts#L22-L24

this._widget.stateChanged.connect(() => {
  console.log('Button is clicked.');
  window.alert('Button is clicked.');
```

The function is executed when the signal is triggered from the first widget with:

```ts
// src/button.tsx#L16-L16

this._stateChanged.emit(void 0);
```

Let's see how you can implement this...

## A simple React Button

Start with a file called `src/button.tsx`. The `tsx` extension allows to use
HTML-like syntax with the tag notation `<>`to represent some visual elements
(note that you have to add a line: `"jsx": "react",` to the
`tsconfig.json` file). This is a special syntax used by [React](https://reactjs.org/tutorial/tutorial.html).

`button.tsx` contains one major class `ButtonWidget` that extends the
`ReactWidget` class provided by JupyterLab. `ReactWidget` defines a
`render()` method that defines some React elements such as a button. This
is the recommended way to include React component inside the JupyterLab widget
based UI.

`ButtonWidget` further contains a private variable `_stateChanged` of type
`Signal`. A signal object can be triggered and then emits an actual message.
Other Widgets can subscribe to such a signal and react when a message is
emitted. The button `onClick` event is configured to trigger the
`stateChanged` signal with `_stateChanged.emit(void 0)`:

```ts
// src/button.tsx#L5-L25

export class ButtonWidget extends ReactWidget {
  get stateChanged(): ISignal<ButtonWidget, void> {
    return this._stateChanged;
  }

  protected render(): React.ReactElement<any> {
    return (
      <button
        key="header-thread"
        className="jp-example-button"
        onClick={() => {
          this._stateChanged.emit(void 0);
        }}
      >
        Clickme
      </button>
    );
  }

  private _stateChanged = new Signal<ButtonWidget, void>(this);
}
```

## Subscribing to a Signal

The `panel.ts` class defines an extension panel that displays the
`ButtonWidget` widget and that subscribes to its `stateChanged` signal.

Subscription to a signal is done using the `connect` method of the
`stateChanged` attribute. It registers a function (in this case
`() => { console.log('Button is clicked.'); }` that is triggered when the signal is
emitted:

```ts
// src/panel.ts#L12-L29

export class SignalExamplePanel extends StackedPanel {
  constructor() {
    super();
    this.addClass(PANEL_CLASS);
    this.id = 'SignalExamplePanel';
    this.title.label = 'Signal Example View';
    this.title.closable = true;

    this._widget = new ButtonWidget();
    this.addWidget(this._widget);
    this._widget.stateChanged.connect(() => {
      console.log('Button is clicked.');
      window.alert('Button is clicked.');
    });
  }

  private _widget: ButtonWidget;
}
```

The final extension writes a little `Button is clicked.` text to the browser console and on an alter when
a big red button is clicked.

It is not very spectacular but the signaling is conceptually important for building extensions.
