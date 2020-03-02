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

    let command = 'jlab-examples:command';

    // Add a command
    commands.addCommand(command, {
      label: 'Execute jlab-examples:command Command',
      caption: 'Execute jlab-examples:command Command',
      execute: (args: any) => {
        console.log(`jlab-examples:command has been called ${args['origin']}.`);
        window.alert(
          `jlab-examples:command has been called ${args['origin']}.`
        );
      }
    });

    // Call the command execution
    commands.execute(command, { origin: 'from init' }).catch(reason => {
      console.error(
        `An error occurred during the execution of jlab-examples:command.\n${reason}`
      );
    });
  }
};

export default extension;
