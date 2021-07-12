import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

/**
 * Initialization data for the hello-world extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'hello-world:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('the JupyterLab main application:', app);
  },
};

export default plugin;
