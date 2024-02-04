import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { showDialog, Dialog } from '@jupyterlab/apputils';
import { buildIcon } from '@jupyterlab/ui-components';

const extension: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/context-menu:plugin',
  description: 'A minimal JupyterLab example to develop a context-menu.',
  autoStart: true,
  requires: [IFileBrowserFactory],
  activate: (app: JupyterFrontEnd, factory: IFileBrowserFactory) => {
    app.commands.addCommand('jlab-examples/context-menu:open', {
      label: 'Example',
      caption: "Example context menu button for file browser's items.",
      icon: buildIcon,
      execute: () => {
        const file = factory.tracker.currentWidget
          ?.selectedItems()
          .next().value;

        if (file) {
          showDialog({
            title: file.name,
            body: 'Path: ' + file.path,
            buttons: [Dialog.okButton()]
          }).catch(e => console.log(e));
        }
      }
    });
  }
};

export default extension;
