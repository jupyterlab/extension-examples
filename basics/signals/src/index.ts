import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { IMainMenu } from '@jupyterlab/mainmenu';

import { Menu } from '@lumino/widgets';

import { ExamplePanel } from './panel';

/**
 * The command IDs used by the console plugin.
 */
namespace CommandIDs {
  export const create = 'examples-signals:create';
}

/**
 * Initialization data for the extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'signals',
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette, IMainMenu],
  activate: activate
};

function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  mainMenu: IMainMenu,
  launcher: ILauncher | null
) {
  const manager = app.serviceManager;
  const { commands, shell } = app;
  const category = 'Extension Examples';

  // Add launcher
  if (launcher) {
    launcher.add({
      command: CommandIDs.create,
      category: category
    });
  }

  function createPanel() {
    let panel: ExamplePanel;
    return manager.ready.then(() => {
      panel = new ExamplePanel();
      shell.add(panel, 'main');
      return panel;
    });
  }

  // Add menu tab
  const exampleMenu = new Menu({ commands });
  exampleMenu.title.label = 'Signal Example';
  mainMenu.addMenu(exampleMenu);

  // Add commands to registry
  commands.addCommand(CommandIDs.create, {
    label: 'Open the Signal Example Panel',
    caption: 'Open the Signal Example Panel',
    execute: createPanel
  });

  // Add items in command palette and menu
  palette.addItem({ command: CommandIDs.create, category });
  exampleMenu.addItem({ command: CommandIDs.create });
}

export default extension;
