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
      label: 'Execute tutorial:command Command',
      caption: 'Execute tutorial:command Command',
      execute: (args: any) => {
        console.log(`tutorial:command has been called ${args['origin']}.`);
      }
    });

    // Call the command execution
    commands.execute(command, { origin: 'from init' }).catch(reason => {
      console.error(
        `An error occurred during the execution of tutorial:command.\n${reason}`
      );
    });
  }
};

export default extension;
