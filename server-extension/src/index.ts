import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ICommandPalette, IFrame } from '@jupyterlab/apputils';

import { PageConfig } from '@jupyterlab/coreutils';

import { ILauncher } from '@jupyterlab/launcher';

import { requestAPI } from './handler';

/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = 'server:get-file';
}

/**
 * Initialization data for the server-extension-example extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'server-extension-example',
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette],
  activate: async (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher | null
  ) => {
    console.log('JupyterLab extension server-extension-example is activated!');

    // GET request
    try {
      const data = await requestAPI<any>('hello');
      console.log(data);
    } catch (reason) {
      console.error(`Error on GET /jlab-ext-example/hello.\n${reason}`);
    }

    // POST request
    const dataToSend = { name: 'George' };
    try {
      const reply = await requestAPI<any>('hello', {
        body: JSON.stringify(dataToSend),
        method: 'POST',
      });
      console.log(reply);
    } catch (reason) {
      console.error(
        `Error on POST /jlab-ext-example/hello ${dataToSend}.\n${reason}`
      );
    }

    const { commands, shell } = app;
    const command = CommandIDs.get;
    const category = 'Extension Examples';

    commands.addCommand(command, {
      label: 'Get Server Content in a IFrame Widget',
      caption: 'Get Server Content in a IFrame Widget',
      execute: () => {
        const widget = new IFrameWidget();
        shell.add(widget, 'main');
      },
    });

    palette.addItem({ command, category: category });

    if (launcher) {
      // Add launcher
      launcher.add({
        command: command,
        category: category,
      });
    }
  },
};

export default extension;

class IFrameWidget extends IFrame {
  constructor() {
    super();
    const baseUrl = PageConfig.getBaseUrl();
    this.url = baseUrl + 'jlab-ext-example/public/index.html';
    this.id = 'doc-example';
    this.title.label = 'Server Doc';
    this.title.closable = true;
    this.node.style.overflowY = 'auto';
  }
}
