import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  INotebookShell
} from '@jupyter-notebook/application';

import { Widget } from '@lumino/widgets';

class ClapWidget extends Widget {

  clapButton: HTMLElement;

  constructor() {
    super();

    // Create and add a button to this widget's root node
    const clapButton = document.createElement('div');
    clapButton.innerText = 'Clap';
    // Add a listener to "clap" when the button is clicked
    clapButton.addEventListener('click', this.clap.bind(this));
    clapButton.classList.add('jp-clap-button');
    this.node.appendChild(clapButton);
    this.clapButton = clapButton;
  }

  clap() {
    window.alert('Clapping now at ' + new Date());
  }
}

/**
 * Initialization data for the clap_button extension.
 */
const pluginJupyterLab: JupyterFrontEndPlugin<void> = {
  id: 'clap_button:pluginLab',
  description: 'Adds a clap button to the top area JupyterLab',
  autoStart: true,
  requires: [ILabShell],
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension clap_button is activated!');

    // Create a ClapWidget and add it to the interface in the top area
    const clapWidget: ClapWidget = new ClapWidget();
    clapWidget.id = 'JupyterLabClapWidget';  // Widgets need an id
    app.shell.add(clapWidget, 'top');
  }
};

/**
 * Initialization data for the clap_button extension.
 */
const pluginJupyterNotebook: JupyterFrontEndPlugin<void> = {
  id: 'clap_button:pluginNotebook',
  description: 'Adds a clap button to the right sidebar of Jupyter Notebook 7',
  autoStart: true,
  requires: [INotebookShell],
  activate: (app: JupyterFrontEnd) => {
    console.log('Jupyter Notebook extension clap_button is activated!');

    // Create a ClapWidget and add it to the interface in the right area
    const clapWidget: ClapWidget = new ClapWidget();
    clapWidget.id = 'JupyterNotebookClapWidget';  // Widgets need an id
    app.shell.add(clapWidget, 'right');
  }
};

const plugins: JupyterFrontEndPlugin<void>[] = [pluginJupyterLab, pluginJupyterNotebook];

export default plugins;
