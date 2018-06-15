import {
    JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';

import {
  ILauncher
} from '@jupyterlab/launcher';

import {
  IMainMenu
} from '@jupyterlab/mainmenu';

import {
  Menu
} from '@phosphor/widgets';

import {
  ICommandPalette
} from '@jupyterlab/apputils';

import {
  IRenderMimeRegistry
} from '@jupyterlab/rendermime';

import {
    TutorialPanel
} from './panel'


/**
 * The command IDs used by the console plugin.
 */
namespace CommandIDs {
    export
    const create = 'Ex7:create';

    export
    const execute = 'Ex7:execute';
}


/**
 * Initialization data for the extension.
 */
const extension: JupyterLabPlugin<void> = {
    id: 'extension7',
    autoStart: true,
    requires: [ICommandPalette, ILauncher, IMainMenu, IRenderMimeRegistry],
    activate: activate
};


function activate(
    app: JupyterLab,
    palette: ICommandPalette,
    launcher: ILauncher,
    mainMenu: IMainMenu,
    rendermime: IRenderMimeRegistry)
{
    const manager = app.serviceManager;
    const { commands, shell } = app;
    let category = 'Tutorial';

    // Add launcher
    launcher.add({
        displayName: 'launch',
        category: category,
        callback: createPanel});

    let panel: TutorialPanel;

    function createPanel() {
        return manager.ready
            .then(() => {
                panel = new TutorialPanel(manager, rendermime);
                return panel.session.ready})
            .then(() => {
                shell.addToMainArea(panel);
                return panel});
    }

    // add menu tab
    let tutorialMenu: Menu = new Menu({commands});
    tutorialMenu.title.label = 'Tutorial';
    mainMenu.addMenu(tutorialMenu);

    // add commands to registry
    let command = CommandIDs.create 
    commands.addCommand(command, {
        label: 'Ex7: open Panel',
        caption: 'Open the Labtutorial Extension',
        execute: createPanel});

    command = CommandIDs.execute
    commands.addCommand(command, {
        label: 'Ex7: execute code',
        caption: 'execute simple code on the kernel',
        execute: (args) => {panel.execute('3+5')}});

    // add items in command palette and menu
    [
        CommandIDs.create,
        CommandIDs.execute
    ].forEach(command => {
        palette.addItem({ command, category });
        tutorialMenu.addItem({ command });
    });
}

export default extension;
