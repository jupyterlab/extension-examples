import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette, InputDialog } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { IMainMenu } from '@jupyterlab/mainmenu';

import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { Menu } from '@lumino/widgets';

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

/**
 * Activate the JupyterLab extension.
 *
 * @param app Jupyter Font End
 * @param palette Jupyter Commands Palette
 * @param mainMenu Jupyter Menu
 * @param rendermime Jupyter Render Mime Registry
 * @param launcher [optional] Jupyter Launcher
 */
function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  mainMenu: IMainMenu,
  rendermime: IRenderMimeRegistry,
  launcher: ILauncher | null
): void {
  const manager = app.serviceManager;
  const { commands, shell } = app;
  const category = 'Extension Examples';

  let panel: ExamplePanel;

  /**
   * Creates a example panel.
   *
   * @returns The panel
   */
  async function createPanel(): Promise<ExamplePanel> {
    panel = new ExamplePanel(manager, rendermime);
    shell.add(panel, 'main');
    return panel;
  }

  // add menu tab
  const exampleMenu = new Menu({ commands });
  exampleMenu.title.label = 'Kernel Output';
  mainMenu.addMenu(exampleMenu);

  // add commands to registry
  commands.addCommand(CommandIDs.create, {
    label: 'Open the Kernel Output Panel',
    caption: 'Open the Kernel Output Panel',
    execute: createPanel
  });

  commands.addCommand(CommandIDs.execute, {
    label: 'Contact Kernel and Execute Code',
    caption: 'Contact Kernel and Execute Code',
    execute: async () => {
      // Create the panel if it does not exist
      if (!panel) {
        await createPanel();
      }
      // Prompt the user about the statement to be executed
      const input = await InputDialog.getText({
        title: 'Code to execute',
        okLabel: 'Execute',
        placeholder: 'Statement to execute'
      });
      // Execute the statement
      if (input.button.accept) {
        const code = input.value;
        panel.execute(code);
      }
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
