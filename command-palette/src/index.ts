import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

/**
 * Initialization data for the command palette example.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'command-palette',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    const { commands } = app;

    let command = 'tutorial:command-palette';

    // Add a command
    commands.addCommand(command, {
      label: 'tutorial:command',
      caption: 'Execute tutorial:command-palette',
      execute: (args: any) => {
        console.log(
          `tutorial:command-palette has been called ${args['origin']}.`
        );
      }
    });

    // Add the command to the command palette
    let category = 'Tutorial';
    palette.addItem({ command, category, args: { origin: 'from palette' } });
  }
};

export default extension;
