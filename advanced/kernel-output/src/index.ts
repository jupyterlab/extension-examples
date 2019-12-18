import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { IMainMenu } from '@jupyterlab/mainmenu';

import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { Menu } from '@phosphor/widgets';

import { ExamplePanel } from './panel';

/**
 * The command IDs used by the console plugin.
 */
namespace CommandIDs {
  export const create = 'kernel-output:create';

  export const execute = 'kernel-output:execute';
}

/**
 * Initialization data for the extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'kernel-output',
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette, IMainMenu, IRenderMimeRegistry],
  activate: activate
};

function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  mainMenu: IMainMenu,
  rendermime: IRenderMimeRegistry,
  launcher: ILauncher | null
) {
  const manager = app.serviceManager;
  const { commands, shell } = app;
  const category = 'Example';

  let panel: ExamplePanel;

  async function createPanel(): Promise<ExamplePanel> {
    await manager.ready;
    panel = new ExamplePanel(manager, rendermime);

    await panel.session.ready;
    shell.add(panel, 'main');

    return panel;
  }

  // add menu tab
  const exampleMenu = new Menu({ commands });
  exampleMenu.title.label = 'Example';
  mainMenu.addMenu(exampleMenu);

  // add commands to registry
  commands.addCommand(CommandIDs.create, {
    label: 'kernel-output: Open Panel',
    caption: 'Open the Kernel Output Panel',
    execute: createPanel
  });

  commands.addCommand(CommandIDs.execute, {
    label: 'kernel-output: Show Dataframe',
    caption: 'Show Dataframe',
    execute: async () => {
      if (!panel) {
        await createPanel();
      }
      panel.execute('df');
    }
  });

  // add items in command palette and menu
  [CommandIDs.create, CommandIDs.execute].forEach(command => {
    palette.addItem({ command, category });
    exampleMenu.addItem({ command });
  });

  // Add launcher
  if (launcher) {
    launcher.add({
      command: CommandIDs.create,
      category: category
    });
  }
}

export default extension;
