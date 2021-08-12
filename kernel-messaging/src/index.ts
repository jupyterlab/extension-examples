import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { ITranslator } from '@jupyterlab/translation';

import { ExamplePanel } from './panel';

/**
 * The command IDs used by the console plugin.
 */
namespace CommandIDs {
  export const create = 'kernel-messaging:create';
}

/**
 * Initialization data for the extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'kernel-messaging',
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette, ITranslator],
  activate: activate,
};

/**
 * Activate the JupyterLab extension.
 *
 * @param app Jupyter Front End
 * @param palette Jupyter Commands Palette
 * @param translator Jupyter Translator
 * @param launcher [optional] Jupyter Launcher
 */
function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  translator: ITranslator,
  launcher: ILauncher | null
): void {
  const manager = app.serviceManager;
  const { commands, shell } = app;
  const category = 'Extension Examples';
  const trans = translator.load('jupyterlab');

  // Add launcher
  if (launcher) {
    launcher.add({
      command: CommandIDs.create,
      category: category,
    });
  }

  /**
   * Creates a example panel.
   *
   * @returns The panel
   */
  async function createPanel(): Promise<ExamplePanel> {
    const panel = new ExamplePanel(manager, translator);
    shell.add(panel, 'main');
    return panel;
  }

  // add commands to registry
  commands.addCommand(CommandIDs.create, {
    label: trans.__('Open the Kernel Messaging Panel'),
    caption: trans.__('Open the Kernel Messaging Panel'),
    execute: createPanel,
  });

  // add items in command palette and menu
  palette.addItem({ command: CommandIDs.create, category });
}

export default extension;
