import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { googleIcon } from './icon';
import { AuthGoogleWidget } from './widget';

/**
 * The command IDs used by the react-auth-google plugin.
 */
namespace CommandIDs {
  export const create = 'create-react-auth-google';
}

/**
 * Initialization data for the react-auth-google extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'react-auth-google',
  description: 'A JupyterLab React extension to Authenticate with Google.',
  autoStart: true,
  optional: [ILauncher],
  activate: (app: JupyterFrontEnd, launcher: ILauncher) => {
    const { commands } = app;

    const command = CommandIDs.create;
    commands.addCommand(command, {
      caption: 'Create a new React Auth Google Widget',
      label: 'Google Auth',
      icon: args => (args['isPalette'] ? undefined : googleIcon),
      execute: () => {
        const content = new AuthGoogleWidget();
        const widget = new MainAreaWidget<AuthGoogleWidget>({ content });
        widget.title.label = 'Google Auth';
        widget.title.icon = googleIcon;
        app.shell.add(widget, 'main');
      }
    });

    if (launcher) {
      launcher.add({
        command
      });
    }
  }
};

export default extension;
