import { JupyterFrontEndPlugin } from '@jupyterlab/application';

/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/toolbar-button:plugin',
  description:
    'A JupyterLab extension adding a button to the Notebook toolbar.',
  autoStart: true,
  activate: () => {
    // Nothing is needed
  }
};

/**
 * Export the plugin as default.
 */
export default plugin;
