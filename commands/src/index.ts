import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

/**
 * Initialization data for the commands example.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'commands',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    const { commands } = app;

    const command = 'jlab-examples:command';

    // Add a command
    commands.addCommand(command, {
      label: 'Execute jlab-examples:command Command',
      caption: 'Execute jlab-examples:command Command',
      execute: (args: any) => {
        const orig = args['origin'];
        console.log(`jlab-examples:command has been called from ${orig}.`);
        if (orig !== 'init') {
          window.alert(`jlab-examples:command has been called from ${orig}.`);
        }
      },
    });

    // Call the command execution
    commands.execute(command, { origin: 'init' }).catch((reason) => {
      console.error(
        `An error occurred during the execution of jlab-examples:command.\n${reason}`
      );
    });
  },
};

export default extension;
