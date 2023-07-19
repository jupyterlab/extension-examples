import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { DOMUtils } from "@jupyterlab/apputils";

import { Widget } from '@lumino/widgets';

const TOP_AREA_CSS_CLASS = 'jp-TopAreaText';

/**
 * Initialization data for the jupyterlab-toparea-text extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-toparea-text:plugin',
  description: 'A JupyterLab extension to add text in the top area.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-toparea-text is activated!');

    const node = document.createElement('div');
    node.textContent = 'Hello World';

    const widget = new Widget({ node });
    widget.id = DOMUtils.createDomID();
    widget.addClass(TOP_AREA_CSS_CLASS);
    app.shell.add(widget, 'top', { rank: 1000 })
  }
};

export default plugin;
