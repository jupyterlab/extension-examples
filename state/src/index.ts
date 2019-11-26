import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { InputDialog } from '@jupyterlab/apputils';

import { IStateDB } from '@jupyterlab/coreutils';

import { ReadonlyJSONObject } from '@phosphor/coreutils';

const PLUGIN_ID = 'state';

/**
 * Initialization data for the state extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [IStateDB],
  activate: (app: JupyterFrontEnd, state: IStateDB) => {
    const choices = ['one', 'two', 'three'];
    let choice = choices[0];

    app.restored
      // Get the state object
      .then(() => state.fetch(PLUGIN_ID))
      .then(value => {
        // Get the choice attribute
        if (value) {
          choice = (value as ReadonlyJSONObject)['choice'] as string;
        }

        // Ask the user to pick a choice with `choice` as default
        return InputDialog.getItem({
          title: 'Pick a choice',
          items: choices,
          current: Math.max(0, choices.indexOf(choice))
        });
      })
      .then(result => {
        // If the user click on the accept button of the dialog
        if (result.button.accept) {
          // Get the user choice
          choice = result.value;
          // Save the choice in the state database
          return state.save(PLUGIN_ID, { choice });
        }
      })
      .catch(reason => {
        console.error(
          `Something went wrong when reading the state for ${PLUGIN_ID}.\n${reason}`
        );
      });
  }
};

export default extension;
