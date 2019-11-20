# Signals and Buttons - Interactions Between Different Widgets

- [Phosphor Signaling 101](#phosphor-signaling-101)
- [A simple react button](#a-simple-react-button)
- [subscribing to a signal](#subscribing-to-a-signal)

## Phosphor Signaling 101

In this extension, we are going to add some simple buttons to the widget that
trigger the panel to print something to the console. Communication between
different components of JupyterLab are a key ingredient in building an
extension. Jupyterlab's phosphor engine uses the `ISignal` interface and the
`Signal` class that implements this interface for communication
([documentation](http://phosphorjs.github.io/phosphor/api/signaling/globals.html)).

The basic concept is the following: A widget, in our case the one that contains
some visual elements such as a button, defines a signal and exposes it to other
widgets, as this `_stateChanged` signal:

```ts
// src/widget.tsx#L31-L35

get stateChanged(): ISignal<TutorialView, void> {
  return this._stateChanged;
}

private _stateChanged = new Signal<TutorialView, void>(this);
```

Another widget, in our case the panel that boxes several different widgets,
subscribes to the `stateChanged` signal and links some function to it:

```ts
// src/panel.ts#L22-L24

this.tutorial.stateChanged.connect(() => {
  console.log('changed');
});
```

The function is executed when the signal is triggered with

```ts
// src/widget.tsx#L22-L22

this._stateChanged.emit(void 0);
```

Let's see how we can implement this ...

## A simple React button

We start with a file called `src/widget.tsx`. The `tsx` extension allows to use
XML-like syntax with the tag notation `<>`to represent some visual elements
(note that you might have to add a line: `"jsx": "react",` to the
`tsconfig.json` file).

`widget.tsx` contains one major class `TutorialView` that extends the
`VDomRendered` class that is provided by Jupyterlab. `VDomRenderer` defines a
`render()` method that defines some html elements (react) such as a button.

`TutorialView` further contains a private variable `stateChanged` of type
`Signal`. A signal object can be triggered and then emits an actual message.
Other Widgets can subscribe to such a signal and react when a message is
emitted. We configure one of the buttons `onClick` event to trigger the
stateChanged`signal with`\_stateChanged.emit(void 0)`:

```ts
// src/widget.tsx#L9-L36

export class TutorialView extends VDomRenderer<any> {
  constructor() {
    super();
    this.id = `TutorialVDOM`;
  }

  protected render(): React.ReactElement<any>[] {
    const elements: React.ReactElement<any>[] = [];
    elements.push(
      <button
        key="header-thread"
        className="jp-tutorial-button"
        onClick={() => {
          this._stateChanged.emit(void 0);
        }}
      >
        Clickme
      </button>
    );
    return elements;
  }

  get stateChanged(): ISignal<TutorialView, void> {
    return this._stateChanged;
  }

  private _stateChanged = new Signal<TutorialView, void>(this);
}
```

## Subscribing to a Signal

The `panel.ts` class defines an extension panel that displays the
`TutorialView` widget and that subscribes to its `stateChanged` signal.
Subscription to a signal is done using the `connect` method of the
`stateChanged` attribute. It registers a function (in this case
`() => { console.log('changed'); }` that is triggered when the signal is
emitted:

```ts
// src/panel.ts#L12-L28

export class TutorialPanel extends StackedPanel {
  constructor() {
    super();
    this.addClass(PANEL_CLASS);
    this.id = 'TutorialPanel';
    this.title.label = 'Tutorial View';
    this.title.closable = true;

    this.tutorial = new TutorialView();
    this.addWidget(this.tutorial);
    this.tutorial.stateChanged.connect(() => {
      console.log('changed');
    });
  }

  private tutorial: TutorialView;
}
```

The final extension writes a little `changed` text to the browser console when
a big red button is clicked. It is not very spectacular but the signaling is
conceptualy important for building extensions. It looks like this:

![Button with Signal](_images/button_with_signal.png)

[Click here for the final extension: signals](signals)
