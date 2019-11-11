import {
    JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the hello_world extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
    id: 'hello_world',
    autoStart: true,
    activate: (app: JupyterFrontEnd) => {
        console.log('the JupyterLab main application:');
        console.log(app);
    }
};

export default extension;
