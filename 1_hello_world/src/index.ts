import {
    JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the 1_hello_world extension.
 */
const extension: JupyterLabPlugin<void> = {
    id: '1_hello_world',
    autoStart: true,
    activate: (app: JupyterLab) => {
        console.log('the JupyterLab main application:');
        console.log(app);
    }
};

export default extension;
