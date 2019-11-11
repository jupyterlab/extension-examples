'use strict'

import {
    JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  IFrame
} from '@jupyterlab/apputils';

import {
  ILauncher
} from '@jupyterlab/launcher';

import {
  PageConfig
} from '@jupyterlab/coreutils';


const extension: JupyterLabPlugin<void> = {
    id: 'jupyter_widgets',
    autoStart: true,
    requires: [ILauncher],
    activate: activate
};


function activate(
    app: JupyterLab,
    launcher: ILauncher)
{
    // Add launcher
    launcher.add({
        displayName: 'launch',
        category: 'Documentation',
        callback: createDocumentation});

    // build panel
    function createDocumentation(): IFrame {
      let baseUrl = PageConfig.getBaseUrl();
      let iframe = new IFrame();
      iframe.url = baseUrl + 'my_doc/index.html';
      iframe.id = 'Mydoc';
      iframe.title.label = 'My documentation';
      iframe.title.closable = true;
      iframe.node.style.overflowY = 'auto';
      app.shell.addToMainArea(iframe);
      return iframe
    }
}

export default extension;
