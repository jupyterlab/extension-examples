import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './myserverextension';

/**
 * Initialization data for the myserverextension extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'myserverextension',
  autoStart: true,
  activate: async (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension myserverextension is activated!');

    // GET request
    try {
      const data = await requestAPI<any>('personal');
      console.log(data);
    } catch (reason) {
      console.error(`Error on GET /hello/personal.\n${reason}`);
    }

    // POST request
    const dataToSend = { name: 'George' };
    try {
      const reply = await requestAPI<any>('personal', {
        body: JSON.stringify(dataToSend),
        method: 'POST'
      });
      console.log(reply);
    } catch (reason) {
      console.error(`Error on POST /hello/personal ${dataToSend}.\n${reason}`);
    }
  }
};

export default extension;
