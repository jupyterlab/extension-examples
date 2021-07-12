import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
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

    const command = 'jlab-examples:command-palette';

    // Add a command
    commands.addCommand(command, {
      label: 'Execute jlab-examples:command-palette Command',
      caption: 'Execute jlab-examples:command-palette Command',
      execute: (args: any) => {
        console.log(
          `jlab-examples:command-palette has been called ${args['origin']}.`
        );
      },
    });

    // Add the command to the command palette
    const category = 'Extension Examples';
    palette.addItem({ command, category, args: { origin: 'from palette' } });
  },
};

export default extension;
