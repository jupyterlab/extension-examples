import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookShell } from '@jupyter-notebook/application';

import { Message } from '@lumino/messaging';

import { Widget } from '@lumino/widgets';

/**
 * Widget containing a button that emit an alert when clicked.
 */
class ClapWidget extends Widget {
  private _clapButton: HTMLElement;

  constructor() {
    super();

    // Create and add a button to this widget's root node
    const clapButton = (this._clapButton = document.createElement('button'));
    clapButton.innerText = 'Clap';
    clapButton.classList.add('jp-clap-button');
    this.node.appendChild(clapButton);
  }

  clap() {
    window.alert('Clapping now at ' + new Date());
  }

  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    // Add a listener to "clap" when the button is clicked
    this._clapButton.addEventListener('click', this.clap.bind(this));
  }

  protected onBeforeDetach(msg: Message): void {
    this._clapButton.removeEventListener('click', this.clap.bind(this));
    super.onBeforeDetach(msg);
  }
}

/**
 * Initialization data for the @jupyterlab-examples/clap-button JupyterLab extension.
 */
const pluginJupyterLab: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/clap-button:pluginLab',
  description: 'Adds a clap button to the top area JupyterLab',
  autoStart: true,
  requires: [ILabShell],
  activate: (app: JupyterFrontEnd, labShell: ILabShell) => {
    console.log(
      'JupyterLab extension @jupyterlab-examples/clap-button is activated!'
    );

    // Create a ClapWidget and add it to the interface in the top area
    const clapWidget = new ClapWidget();
    clapWidget.id = 'JupyterLabClapWidgetLab'; // Widgets need an id
    app.shell.add(clapWidget, 'top');
  }
};

/**
 * Initialization data for the @jupyterlab-examples/clap-button Jupyter Notebook extension.
 */
const pluginJupyterNotebook: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/clap-button:pluginNotebook',
  description: 'Adds a clap button to the right sidebar of Jupyter Notebook 7',
  autoStart: true,
  requires: [INotebookShell],
  activate: (app: JupyterFrontEnd, notebookShell: INotebookShell) => {
    console.log(
      'Jupyter Notebook extension @jupyterlab-examples/clap-button is activated!'
    );

    // Create a ClapWidget and add it to the interface in the right area
    const clapWidget = new ClapWidget();
    clapWidget.id = 'JupyterNotebookClapWidgetNotebook'; // Widgets need an id
    app.shell.add(clapWidget, 'right');
  }
};

/**
 * Gather all plugins defined by this extension
 */
const plugins: JupyterFrontEndPlugin<void>[] = [
  pluginJupyterLab,
  pluginJupyterNotebook
];

export default plugins;
