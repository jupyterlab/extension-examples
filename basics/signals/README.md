# Signals - Communication between Widgets

- [Phosphor Signaling 101](#phosphor-signaling-101)
- [A simple React Button](#a-simple-react-button)
- [Subscribing to a Signal](#subscribing-to-a-signal)

![Button with Signal](preview.png)

## Phosphor Signaling 101

In this extension, a simple button will be added to print something to the console.
Communication between different components of JupyterLab are a key ingredient in building an
extension. JupyterLab's phosphor engine uses the `ISignal` interface and the
`Signal` class that implements this interface for communication
([documentation](https://phosphorjs.github.io/phosphor/api/signaling/globals.html)).

The basic concept is the following: a widget, in this case the one that contains
some visual elements such as a button, defines a signal and exposes it to other
widgets, as this `_stateChanged` signal:

```ts
// src/widget.tsx#L6-L8

get stateChanged(): ISignal<ExampleView, void> {
  return this._stateChanged;
}
```

```ts
// src/widget.tsx#L24-L24

private _stateChanged = new Signal<ExampleView, void>(this);
```

Another widget, in this case the panel that boxes several different widgets,
subscribes to the `stateChanged` signal and links some function to it:

```ts
// src/panel.ts#L22-L24

this.widget.stateChanged.connect(() => {
  console.log('changed');
});
```

The function is executed when the signal is triggered with

```ts
// src/widget.tsx#L16-L16

this._stateChanged.emit(void 0);
```

Let's see how you can implement this ...

## A Simple React Button

Start with a file called `src/widget.tsx`. The `tsx` extension allows to use
HTML-like syntax with the tag notation `<>`to represent some visual elements
(note that you have to add a line: `"jsx": "react",` to the
`tsconfig.json` file). This is a special syntax used by [React](https://reactjs.org/tutorial/tutorial.html).

`widget.tsx` contains one major class `ExampleView` that extends the
`ReactWidget` class provided by JupyterLab. `ReactWidget` defines a
`render()` method that defines some React elements such as a button. This
is the recommended way to include React component inside the JupyterLab widget
based UI.

`ExampleView` further contains a private variable `_stateChanged` of type
`Signal`. A signal object can be triggered and then emits an actual message.
Other Widgets can subscribe to such a signal and react when a message is
emitted. The button `onClick` event is configured to trigger the
`stateChanged` signal with `_stateChanged.emit(void 0)`:

```ts
// src/widget.tsx#L5-L25

export class ExampleView extends ReactWidget {
  get stateChanged(): ISignal<ExampleView, void> {
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

  private _stateChanged = new Signal<ExampleView, void>(this);
}
```

## Subscribing to a Signal

The `panel.ts` class defines an extension panel that displays the
`ExampleView` widget and that subscribes to its `stateChanged` signal.
Subscription to a signal is done using the `connect` method of the
`stateChanged` attribute. It registers a function (in this case
`() => { console.log('changed'); }` that is triggered when the signal is
emitted:

```ts
// src/panel.ts#L12-L28

export class ExamplePanel extends StackedPanel {
  constructor() {
    super();
    this.addClass(PANEL_CLASS);
    this.id = 'ExamplePanel';
    this.title.label = 'Example View';
    this.title.closable = true;

    this.widget = new ExampleView();
    this.addWidget(this.widget);
    this.widget.stateChanged.connect(() => {
      console.log('changed');
    });
  }

  private widget: ExampleView;
}
```

The final extension writes a little `changed` text to the browser console when
a big red button is clicked. It is not very spectacular but the signaling is
conceptually important for building extensions.
