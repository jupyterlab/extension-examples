import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the state extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'state',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension state is activated!');
  }
};

export default extension;
