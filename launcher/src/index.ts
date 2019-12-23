import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

import { ILauncher } from '@jupyterlab/launcher';

import { IMainMenu } from '@jupyterlab/mainmenu';

const FACTORY = 'Editor';
const ICON_CLASS = 'jp-example-PythonIcon';
const PALETTE_CATEGORY = 'Text Editor';

namespace CommandIDs {
  export const createNew = 'launcher:create-new-python-file';
}

const extension: JupyterFrontEndPlugin<void> = {
  id: 'launcher',
  autoStart: true,
  requires: [IFileBrowserFactory],
  optional: [ILauncher, IMainMenu, ICommandPalette],
  activate: (
    app: JupyterFrontEnd,
    browserFactory: IFileBrowserFactory,
    launcher: ILauncher | null,
    menu: IMainMenu | null,
    palette: ICommandPalette | null
  ) => {
    const { commands } = app;
    const command = CommandIDs.createNew;

    commands.addCommand(command, {
      label: args => (args['isPalette'] ? 'New Python File' : 'Python File'),
      caption: 'Create a new Python file',
      iconClass: args => (args['isPalette'] ? '' : ICON_CLASS),
      execute: async args => {
        // Get the directory in which the Python file must be created;
        // otherwise take the current filebrowser directory
        const cwd = args['cwd'] || browserFactory.defaultBrowser.model.path;

        // Create a new untitled python file
        const model = await commands.execute('docmanager:new-untitled', {
          path: cwd,
          type: 'file',
          ext: 'py'
        });

        // Open the newly created file with the 'Editor'
        return commands.execute('docmanager:open', {
          path: model.path,
          factory: FACTORY
        });
      }
    });

    // Add the command to the launcher
    if (launcher) {
      launcher.add({
        command,
        category: 'Other',
        rank: 1
      });
    }

    // Add the command to the palette
    if (palette) {
      palette.addItem({
        command,
        args: { isPalette: true },
        category: PALETTE_CATEGORY
      });
    }

    // Add the command to the menu
    if (menu) {
      menu.fileMenu.newMenu.addGroup([{ command }], 30);
    }
  }
};

export default extension;
