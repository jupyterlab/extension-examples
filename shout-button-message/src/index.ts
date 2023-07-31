import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  IStatusBar
} from '@jupyterlab/statusbar';

import { Widget } from '@lumino/widgets';

/**
 * This is an optional widget that will be used
 * when the JupyterLab status bar is available.
 */
class ShoutStatusBarSummary extends Widget {

  statusBarSummary: HTMLElement;

  constructor() {
    super();

    // Display the last shout time in the status bar
    this.statusBarSummary = document.createElement('p');
    this.statusBarSummary.classList.add('jp-shout-summary');
    this.statusBarSummary.innerText = 'Last Shout: (None)';
    this.node.appendChild(this.statusBarSummary);
  }

  setSummary(summary: string) {
    this.statusBarSummary.innerText = summary;
  }
}

/**
 * ShoutWidget holds all the plugin's primary functionality.
 * It also creates a widget for JupyterLab's status bar if the
 * status bar is available.
 */
class ShoutWidget extends Widget {

  shoutButton: HTMLElement;
  lastShoutTime: Date | null;
  statusBarWidget: ShoutStatusBarSummary | null;

  constructor(statusBar: any) {
    super();

    // Create and add a button to this widget's root node
    const shoutButton = document.createElement('div');
    shoutButton.innerText = 'Press to Shout';
    // Add a listener to "shout" when the button is clicked
    shoutButton.addEventListener('click', this.shout.bind(this));
    shoutButton.classList.add('jp-shout-button');
    this.node.appendChild(shoutButton);
    this.shoutButton = shoutButton;

    // Store the last shout time for use in the status bar
    this.lastShoutTime = null;

    // Check if the status bar is available, and if so, make
    // a status bar widget to hold some information
    this.statusBarWidget = null;
    if (statusBar) {
      this.statusBarWidget = new ShoutStatusBarSummary();
      statusBar.registerStatusItem('shoutStatusBarSummary', {item: this.statusBarWidget});
    }
  }

  // Make an alert popup that shouts upon user click
  shout() {
    this.lastShoutTime = new Date();
    window.alert('Shouting at ' + this.lastShoutTime);

    // Update the status bar widget if available
    if (this.statusBarWidget) {
      this.statusBarWidget.setSummary('Last Shout: ' + this.lastShoutTime.toString());
    }
  }
}

/**
 * JupyterLab extensions are made up of plugin(s). You can specify some
 * information about your plugin with the properties defined here. This
 * extension exports a single plugin, and lists the IStatusBar from
 * JupyterLab as optional.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'shout_button_message:plugin',
  description: 'An extension that adds a button and message to the right toolbar, with optional status bar widget in JupyterLab.',
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
    const shoutWidget: ShoutWidget = new ShoutWidget(statusBar);
    shoutWidget.id = 'JupyterShoutWidget';  // Widgets need an id
    app.shell.add(shoutWidget, 'right');
  }
};

export default plugin;
