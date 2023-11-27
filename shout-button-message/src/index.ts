import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IStatusBar } from '@jupyterlab/statusbar';

import { Message } from '@lumino/messaging';

import { ISignal, Signal } from '@lumino/signaling';

import { Widget } from '@lumino/widgets';

/**
 * Widget to display text it JupyterLab status bar.
 */
class ShoutStatusBarSummary extends Widget {
  private _statusBarSummary: HTMLElement;

  constructor() {
    super();

    // Display the last shout time in the status bar
    this._statusBarSummary = document.createElement('p');
    this._statusBarSummary.classList.add('jp-shout-summary');
    this._statusBarSummary.innerText = 'Last Shout: (None)';
    this.node.appendChild(this._statusBarSummary);
  }

  /**
   * Set the widget text content
   *
   * @param summary The text to display
   */
  setSummary(summary: string) {
    this._statusBarSummary.innerText = summary;
  }
}

/**
 * ShoutWidget holds all the plugin's primary functionality.
 * It also creates a widget for JupyterLab's status bar if the
 * status bar is available.
 */
class ShoutWidget extends Widget {
  // The last shout time for use in the status bar
  private _lastShoutTime: Date | null;
  // Signal triggered when a message is shouted
  private _messageShouted = new Signal<ShoutWidget, Date>(this);
  // Link to the shout button
  private _shoutButton: HTMLElement;

  constructor() {
    super();

    // Create and add a button to this widget's root node
    const shoutButton = document.createElement('div');
    shoutButton.innerText = 'Press to Shout';
    shoutButton.classList.add('jp-shout-button');
    this.node.appendChild(shoutButton);
    this._shoutButton = shoutButton;

    this._lastShoutTime = null;
  }

  /**
   * The last shout time for use in the status bar
   */
  get lastShoutTime(): Date | null {
    return this._lastShoutTime;
  }

  /**
   * Signal emitted when a message is shouted
   */
  get messageShouted(): ISignal<ShoutWidget, Date> {
    return this._messageShouted;
  }

  /**
   * Callback when the widget is added to the DOM
   */
  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    // Add a listener to "shout" when the button is clicked
    this._shoutButton.addEventListener('click', this.shout.bind(this));
  }

  /**
   * Callback when the widget is removed from the DOM
   */
  protected onBeforeDetach(msg: Message): void {
    this._shoutButton.removeEventListener('click', this.shout.bind(this));
    super.onBeforeDetach(msg);
  }

  /**
   * Make an alert popup that shouts upon user click
   * And signal that a message is emitted.
   */
  shout() {
    this._lastShoutTime = new Date();
    this._messageShouted.emit(this._lastShoutTime);
    window.alert('Shouting at ' + this._lastShoutTime);
  }
}

/**
 * JupyterLab extensions are made up of plugin(s). You can specify some
 * information about your plugin with the properties defined here. This
 * extension exports a single plugin, and lists the IStatusBar from
 * JupyterLab as optional.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/shout-button:plugin',
  description:
    'An extension that adds a button and message to the right toolbar, with optional status bar widget in JupyterLab.',
  autoStart: true,
  // The IStatusBar is marked optional here. If it's available, it will
  // be provided to the plugin as an argument to the activate function
  // (shown below), and if not it will be null.
  optional: [IStatusBar],
  // Make sure to list any 'requires' and 'optional' features as arguments
  // to your activate function (activate is always passed an Application,
  // then required arguments, then optional arguments)
  activate: (app: JupyterFrontEnd, statusBar: IStatusBar | null) => {
    console.log('JupyterLab extension shout_button_message is activated!');

    // Create a ShoutWidget and add it to the interface in the right sidebar
    const shoutWidget: ShoutWidget = new ShoutWidget();
    shoutWidget.id = 'JupyterShoutWidget'; // Widgets need an id

    app.shell.add(shoutWidget, 'right');

    // Check if the status bar is available, and if so, make
    // a status bar widget to hold some information
    if (statusBar) {
      const statusBarWidget = new ShoutStatusBarSummary();

      statusBar.registerStatusItem('shoutStatusBarSummary', {
        item: statusBarWidget
      });

      // Connect to the messageShouted to be notified when a new message
      // is published and react to it by updating the status bar widget.
      shoutWidget.messageShouted.connect((widget: ShoutWidget, time: Date) => {
        statusBarWidget.setSummary(
          'Last Shout: ' + widget.lastShoutTime?.toString() ?? '(None)'
        );
      });
    }
  }
};

export default plugin;
