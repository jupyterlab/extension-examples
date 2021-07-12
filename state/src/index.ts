import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { InputDialog } from '@jupyterlab/apputils';

import { IStateDB } from '@jupyterlab/statedb';

import { ReadonlyJSONObject } from '@lumino/coreutils';

const PLUGIN_ID = '@jupyterlab-examples/state:state-example';

/**
 * Initialization data for the state extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [IStateDB],
  activate: (app: JupyterFrontEnd, state: IStateDB) => {
    const options = ['one', 'two', 'three'];
    let option = options[0];

    app.restored
      // Get the state object
      .then(() => state.fetch(PLUGIN_ID))
      .then((value) => {
        // Get the option attribute
        if (value) {
          option = (value as ReadonlyJSONObject)['option'] as string;
          console.log(`Option ${option} read from state.`);
        }

        // Ask the user to pick a option with `option` as default
        return InputDialog.getItem({
          title: 'Pick an option to persist by the State Example extension',
          items: options,
          current: Math.max(0, options.indexOf(option)),
        });
      })
      .then((result) => {
        // If the user click on the accept button of the dialog
        if (result.button.accept) {
          // Get the user option
          option = result.value;
          // Save the option in the state database
          return state.save(PLUGIN_ID, { option });
        }
      })
      .catch((reason) => {
        console.error(
          `Something went wrong when reading the state for ${PLUGIN_ID}.\n${reason}`
        );
      });
  },
};

export default extension;
