import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { MainAreaWidget } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

// import { reactIcon } from '@jupyterlab/ui-components';
import { vueIcon } from './icon';

import { CounterWidget } from './widget';

/**
 * Initialization data for the vue-widget extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'vue-widget',
  autoStart: true,
  optional: [ILauncher],
  activate: (app: JupyterFrontEnd, launcher: ILauncher) => {
    const { commands } = app;

    const command = 'create-vue-widget';
    commands.addCommand(command, {
      caption: 'Create a new Vue Widget',
      label: 'Vue Widget',
      icon: (args) => (args['isPalette'] ? null : vueIcon),
      execute: () => {
        const content = new CounterWidget();
        const widget = new MainAreaWidget<CounterWidget>({ content });
        widget.title.label = 'Vue Widget';
        widget.title.icon = vueIcon;
        app.shell.add(widget, 'main');
      },
    });

    if (launcher) {
      launcher.add({
        command,
      });
    }
  },
};

export default extension;
