import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { IMainMenu } from '@jupyterlab/mainmenu';

import { Menu, Widget } from '@phosphor/widgets';

/**
 * Activate the widgets example extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'widgets',
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
      label: 'widgets: Open Tab',
      caption: 'Open the Widgets Example Tab',
      execute: () => {
        const widget = new ExampleView();
        shell.add(widget, 'main');
      }
    });
    palette.addItem({ command, category: 'Example' });

    const exampleMenu = new Menu({ commands });

    exampleMenu.title.label = 'Example';
    mainMenu.addMenu(exampleMenu, { rank: 80 });
    exampleMenu.addItem({ command });
  }
};

export default extension;

class ExampleView extends Widget {
  constructor() {
    super();
    this.addClass('jp-example-view');
    this.id = 'widgets-example';
    this.title.label = 'Example View';
    this.title.closable = true;
  }
}
