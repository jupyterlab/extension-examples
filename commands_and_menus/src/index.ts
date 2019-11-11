import {
    JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  IMainMenu
} from '@jupyterlab/mainmenu';

import {
  Menu
} from '@phosphor/widgets';

import {
  ICommandPalette
} from '@jupyterlab/apputils';

import '../style/index.css';

/**
 * Initialization data for the extension1 extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
    id: 'commands_and_menus',
    autoStart: true,
    requires: [ICommandPalette, IMainMenu],
    activate: (
        app: JupyterFrontEnd,
        palette: ICommandPalette,
        mainMenu: IMainMenu) =>
    {
        const { commands } = app;
        let command = 'ex2:tutorial';
        let category = 'Tutorial';
        commands.addCommand(command, {
            label: 'ex2:tutorial',
            caption: 'Open the Labtutorial',
            execute: (args: any) => {console.log('Hey')}});
        palette.addItem({command, category});


        let tutorialMenu: Menu = new Menu({commands});

        tutorialMenu.title.label = 'Tutorial';
        mainMenu.addMenu(tutorialMenu, {rank: 80});
        tutorialMenu.addItem({ command });
    }
};

export default extension;
