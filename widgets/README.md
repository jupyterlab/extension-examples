# Widgets

> Add a new Widget element to the main window.

In this example you will learn how to add a new tab to JupyterLab.

Visible elements such as tabs and notebooks are represented by widgets in the [Lumino](https://lumino.readthedocs.io/en/stable/api/modules/widgets.html)
library that is the basis of the JupyterLab application.

It is the fundamental brick of any visual component in the JupyterLab interface.

![New Tab with a Custom Widget](preview.png)

## A Basic Tab

The base widget class can be imported with:

```ts
// src/index.ts#L8-L8

import { Message } from '@lumino/messaging';
```

It requires to add the library as package dependency:

```bash
jlpm add @lumino/widgets
```

A Widget can be added to the main area through the
[JupyterLab Shell](https://jupyterlab.readthedocs.io/en/latest/api/classes/application.LabShell.html).

Inside of the `activate` function, you can obtain it through the `shell` attribute
of the `app` object:

```ts
// src/index.ts#L19-L19

requires: [ICommandPalette],
```

Then the widget can be inserted by calling the `add` method, like in the command defined
in this example:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L25-L28

label: 'Open a Tab Widget',
caption: 'Open the Widgets Example Tab',
execute: () => {
  const widget = new ExampleWidget();
```
<!-- prettier-ignore-end -->

The custom widget `ExampleWidget` is inherited from the base class `Widget`.

In this case, no specific behavior is defined for the widget. Only some properties are set:

- `addClass`: Add a CSS class to allow widget styling
- `id`: id of the widget's DOM node - it is mandatory to be set to be included in JupyterLab
- `title.label`: The widget tab title
- `title.closable`: Allow the widget tab to be closed

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L36-L43

export default extension;

class ExampleWidget extends Widget {
  constructor() {
    super();
    this.addClass('jp-example-view');
    this.id = 'simple-widget-example';
    this.title.label = 'Widget Example View';
```
<!-- prettier-ignore-end -->

You can associate style properties to the custom CSS class in the file
`style/base.css`:

<!-- prettier-ignore-start -->
<!-- embedme style/base.css#L7-L10 -->

```css
.jp-example-view {
  background-color: aliceblue;
  cursor: pointer;
}
```
<!-- prettier-ignore-end -->

## Adding event listeners

A very often required need for widgets is the ability to react to user events.
As widget is a wrapper around a HTML element accessible through the attribute
`this.node`, you can add event listeners using the standard API:

```ts
// src/index.ts#L69-L75

// The first two events are not linked to a specific callback but
// to this object. In that case, the object method `handleEvent`
// is the function called when an event occurs.
this.node.addEventListener('pointerenter', this);
this.node.addEventListener('pointerleave', this);
// This event will call a specific function when occuring
this.node.addEventListener('click', this._onEventClick.bind(this));
```

The listeners can either be directly a function as for the _click_ event in this
example or the widget (as for _pointerenter_ and _pointerleave_ here). In the
second case, you will need to defined a `handleEvent` method in the widget that will
be called when an event is triggered:

```ts
// src/index.ts#L52-L61

handleEvent(event: Event): void {
  switch (event.type) {
    case 'pointerenter':
      this._onMouseEnter(event);
      break;
    case 'pointerleave':
      this._onMouseLeave(event);
      break;
  }
}
```

The best place for adding listeners is the method `onAfterAttach` that is inherited
by the `Widget` class and is called when the widget is attached to the DOM. And you
should remove the listeners in `onBeforeDetach` when the widget is about to be detached
from the DOM.

```ts
// src/index.ts#L83-L87

protected onBeforeDetach(msg: Message): void {
  this.node.removeEventListener('pointerenter', this);
  this.node.removeEventListener('pointerleave', this);
  this.node.removeEventListener('click', this._onEventClick.bind(this));
}
```

## Where to Go Next

This example uses a command to display the widget. Have a look a the
[commands example](../commands/README.md) for more information about it.

The widget created in this example is simple. You will find more advanced
widgets in the following examples:

- Widget showing a [Datagrid](../datagrid/README.md)
- Widget integrating [React components](../react-widget/README.md)
- Widget interacting with a [Kernel](../kernel-messaging/README.md)
- Extending document widget (like the notebook panel) with a new [Toolbar Button](../toolbar-button/README.md)
