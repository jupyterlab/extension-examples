import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

/**
 * Activate the widgets example extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/widgets:plugin',
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
}
