'use strict'

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
  INotebookTracker
} from '@jupyterlab/notebook';

import {
    TutorialPanel
} from './panel'

/**
 * The command IDs used by the console plugin.
 */
namespace CommandIDs {
    export
    const create = 'Ex8:create';

    export
    const execute = 'Ex8:execute';
}


/**
 * Initialization data for the extension.
 */
const extension: JupyterLabPlugin<void> = {
    id: 'extension8',
    autoStart: true,
    requires: [ICommandPalette, INotebookTracker, ILauncher, IMainMenu],
    activate: activate
};


function activate(
    app: JupyterLab,
    palette: ICommandPalette,
    tracker: INotebookTracker,
    launcher: ILauncher,
    mainMenu: IMainMenu)
{
    const manager = app.serviceManager;
    const { commands, shell } = app;
    let category = 'Tutorial';

    // Add launcher
    launcher.add({
        displayName: 'launch',
        category: category,
        callback: createPanel});

    // build panel
    let panel: TutorialPanel;
    function createPanel() {
        let current = tracker.currentWidget;
        console.log(current.rendermime);

        return manager.ready
            .then(() => {
                panel = new TutorialPanel(manager, current.rendermime);
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
        label: 'Ex8: open Panel',
        caption: 'Open the Labtutorial Extension',
        execute: createPanel});

    let code = 'widget'
    command = CommandIDs.execute
    commands.addCommand(command, {
        label: 'Ex8: show widget',
        caption: 'show ipython widget',
        execute: () => {panel.execute(code)}});

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
