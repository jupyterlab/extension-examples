import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the hello-world extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'hello-world',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('the JupyterLab main application:', app);
  }
};

export default extension;
