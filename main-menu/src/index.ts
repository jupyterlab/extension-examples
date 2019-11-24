import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IMainMenu } from '@jupyterlab/mainmenu';

import { Menu } from '@phosphor/widgets';

import { ICommandPalette } from '@jupyterlab/apputils';

/**
 * Initialization data for the extension1 extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'main-menu',
  autoStart: true,
  requires: [ICommandPalette, IMainMenu],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    mainMenu: IMainMenu
  ) => {
    const { commands } = app;

    // Add a command
    let command = 'tutorial:main-menu';
    commands.addCommand(command, {
      label: 'tutorial:main-menu',
      caption: 'Execute tutorial:main-menu',
      execute: (args: any) => {
        console.log(`tutorial:main-menu has been called ${args['origin']}.`);
      }
    });

    // Add the command to the command palette
    let category = 'Tutorial';
    palette.addItem({
      command,
      category,
      args: { origin: 'from the palette' }
    });

    // Create a menu
    let tutorialMenu: Menu = new Menu({ commands });
    tutorialMenu.title.label = 'Tutorial';
    mainMenu.addMenu(tutorialMenu, { rank: 80 });

    // Add the command to the menu
    tutorialMenu.addItem({ command, args: { origin: 'from the menu' } });
  }
};

export default extension;
