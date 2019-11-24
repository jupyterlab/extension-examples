import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the commands example.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'commands',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    const { commands } = app;

    let command = 'tutorial:command';

    // Add a command
    commands.addCommand(command, {
      label: 'tutorial:command',
      caption: 'Execute tutorial:command',
      execute: (args: any) => {
        console.log(`tutorial:command has been called ${args['origin']}.`);
      }
    });

    // Call the command execution
    commands.execute(command, { origin: 'from init' }).catch(reason => {
      console.error(
        `An error occurs during the execution of tutorial:command.\n${reason}`
      );
    });
  }
};

export default extension;
