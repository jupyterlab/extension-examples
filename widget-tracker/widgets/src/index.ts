import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IMainMenu } from '@jupyterlab/mainmenu';

import { Menu } from '@phosphor/widgets';

import { ICommandPalette } from '@jupyterlab/apputils';

import { Widget } from '@phosphor/widgets';

/**
 * Initialization data for the extension1 extension.
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
    let command = 'ex3:labtutorial';
    let category = 'Tutorial';
    commands.addCommand(command, {
      label: 'Ex3 command',
      caption: 'Open the Labtutorial',
      execute: (args: any) => {
        const widget = new TutorialView();
        shell.add(widget, 'main');
      }
    });
    palette.addItem({ command, category });

    let tutorialMenu: Menu = new Menu({ commands });

    tutorialMenu.title.label = 'Tutorial';
    mainMenu.addMenu(tutorialMenu, { rank: 80 });
    tutorialMenu.addItem({ command });
  }
};

export default extension;

class TutorialView extends Widget {
  constructor() {
    super();
    this.addClass('jp-tutorial-view');
    this.id = 'tutorial';
    this.title.label = 'Tutorial View';
    this.title.closable = true;
  }
}
