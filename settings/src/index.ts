import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/coreutils';

const PLUGIN_ID = 'settings:plugin';

/**
 * Initialization data for the settings extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settings: ISettingRegistry) => {
    let limit = 25;
    let flag = false;

    function loadSetting(setting: ISettingRegistry.ISettings) {
      // Read the settings and convert to the correct type
      limit = setting.get('limit').composite as number;
      flag = setting.get('flag').composite as boolean;

      console.log(`Limit is set to ${limit} and flag to ${flag}`);
    }

    // Wait for the application to be restored
    app.restored
      // Load the settings for this plugin
      .then(() => settings.load(PLUGIN_ID))
      .then(setting => {
        // Read the settings
        loadSetting(setting);

        // Listen for settings changes using Signal
        setting.changed.connect(loadSetting);

        // Programmatically change a setting
        return setting.set('limit', 20);
      })
      .catch(reason => {
        console.error(
          `Something went wrong when reading the settings.\n${reason}`
        );
      });
  }
};

export default extension;
