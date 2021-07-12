import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { IMainMenu } from '@jupyterlab/mainmenu';

import { Menu, Widget } from '@lumino/widgets';

/**
 * Activate the widgets example extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'widgets-example',
  autoStart: true,
  requires: [ICommandPalette, IMainMenu],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    mainMenu: IMainMenu
  ) => {
    const { commands, shell } = app;
    const command = 'widgets:open-tab';

    commands.addCommand(command, {
      label: 'Open a Tab Widget',
      caption: 'Open the Widgets Example Tab',
      execute: () => {
        const widget = new ExampleWidget();
        shell.add(widget, 'main');
      },
    });
    palette.addItem({ command, category: 'Extension Examples' });

    const exampleMenu = new Menu({ commands });

    exampleMenu.title.label = 'Widget Example';
    mainMenu.addMenu(exampleMenu, { rank: 80 });
    exampleMenu.addItem({ command });
  },
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
