import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { Message } from '@lumino/messaging';

import { Widget } from '@lumino/widgets';

/**
 * Activate the widgets example extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/widgets:plugin',
  description: 'A minimal JupyterLab extension opening a main area widget.',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    const { commands, shell } = app;
    const command = 'widgets:open-tab';

    commands.addCommand(command, {
      label: 'Open a Tab Widget',
      caption: 'Open the Widgets Example Tab',
      execute: () => {
        const widget = new ExampleWidget();
        shell.add(widget, 'main');
      }
    });
    palette.addItem({ command, category: 'Extension Examples' });
  }
};

export default extension;

class ExampleWidget extends Widget {
  constructor() {
    super();
    this.addClass('jp-example-view');
    this.id = 'simple-widget-example';
    this.title.label = 'Widget Example View';
    this.title.closable = true;
  }

  /**
   * Event generic callback on an object as defined in the specification
   *
   * See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_event_listener_callback
   */
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

  /**
   * Callback when the widget is added to the DOM
   *
   * This is the recommended place to listen for DOM events
   */
  protected onAfterAttach(msg: Message): void {
    // The first two events are not linked to a specific callback but
    // to this object. In that case, the object method `handleEvent`
    // is the function called when an event occurs.
    this.node.addEventListener('pointerenter', this);
    this.node.addEventListener('pointerleave', this);
    // This event will call a specific function when occuring
    this.node.addEventListener('click', this._onEventClick.bind(this));
  }

  /**
   * Callback when the widget is removed from the DOM
   *
   * This is the recommended place to stop listening for DOM events
   */
  protected onBeforeDetach(msg: Message): void {
    this.node.removeEventListener('pointerenter', this);
    this.node.removeEventListener('pointerleave', this);
    this.node.removeEventListener('click', this._onEventClick.bind(this));
  }

  /**
   * Callback on click on the widget
   */
  private _onEventClick(event: Event): void {
    window.alert('You clicked on the widget');
  }

  /**
   * Callback on pointer entering the widget
   */
  private _onMouseEnter(event: Event): void {
    this.node.style['backgroundColor'] = 'orange';
  }

  /**
   * Callback on pointer leaving the widget
   */
  private _onMouseLeave(event: Event): void {
    this.node.style['backgroundColor'] = 'aliceblue';
  }
}
