import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { MainAreaWidget } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { CounterWidget } from './widget';

import '../style/index.css';

const REACT_ICON_CLASS = 'jp-ReactIcon';

/**
 * The command IDs used by the react plugin.
 */
namespace CommandIDs {
  export const create = 'create-react-widget';
}

/**
 * Initialization data for the react extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'react_widget',
  autoStart: true,
  optional: [ILauncher],
  activate: (app: JupyterFrontEnd, launcher: ILauncher) => {
    const { commands } = app;

    const command = CommandIDs.create;
    commands.addCommand(command, {
      caption: 'Create a new React Widget',
      label: args => args['isPalette'] ? 'New React Widget' : 'React Widget',
      execute: () => {
        const content = new CounterWidget();
        const widget = new MainAreaWidget<CounterWidget>({ content });
        widget.title.label = "React Widget";
        app.shell.add(widget, 'main');
      },
      iconClass: args => (args['isPalette'] ? '' : REACT_ICON_CLASS),
    });

    if (launcher) {
      launcher.add({
        command
      })
    }
  }
};

export default extension;
