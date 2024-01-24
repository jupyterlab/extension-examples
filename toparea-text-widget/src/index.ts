import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { DOMUtils } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

const TOP_AREA_CSS_CLASS = 'jp-TopAreaText';

/**
 * Initialization data for the @jupyterlab-examples/toparea extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/toparea:plugin',
  description: 'A JupyterLab extension to add text in the top area.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log(
      'JupyterLab extension @jupyterlab-examples/toparea is activated!'
    );

    // Create the HTML content of the widget
    const node = document.createElement('div');
    node.textContent = 'Hello World';

    // Create the widget
    const widget = new Widget({ node });
    widget.id = DOMUtils.createDomID();
    widget.addClass(TOP_AREA_CSS_CLASS);

    // Add the widget to the top area
    app.shell.add(widget, 'top', { rank: 1000 });
  }
};

export default plugin;
