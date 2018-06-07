import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the extension1 extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'extension1',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension extension1 is activated!');
  }
};

export default extension;
