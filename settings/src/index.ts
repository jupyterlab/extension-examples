import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { IMainMenu } from '@jupyterlab/mainmenu';

import { Menu } from '@lumino/widgets';

const PLUGIN_ID = '@jupyterlab-examples/settings:my-settings-example';

const COMMAND_ID = '@jupyterlab-examples/settings:toggle-flag';

/**
 * Initialization data for the settings extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [IMainMenu, ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    mainMenu: IMainMenu,
    settings: ISettingRegistry
  ) => {
    const { commands } = app;
    let limit = 25;
    let flag = false;

    function loadSetting(setting: ISettingRegistry.ISettings) {
      // Read the settings and convert to the correct type
      limit = setting.get('limit').composite as number;
      flag = setting.get('flag').composite as boolean;

      console.log(`Limit is set to ${limit} and flag to ${flag}`);
    }

    // Wait for the application to be restored and
    // for the settings for this plugin to be loaded
    Promise.all([app.restored, settings.load(PLUGIN_ID)])
      .then(([, setting]) => {
        // Read the settings
        loadSetting(setting);

        // Listen for your plugin setting changes using Signal
        setting.changed.connect(loadSetting);

        commands.addCommand(COMMAND_ID, {
          label: 'Toggle Flag Setting',
          isToggled: () => flag,
          execute: () => {
            // Programmatically change a setting
            setting.set('flag', !flag).catch(reason => {
              console.error(
                `Something went wrong when setting flag.\n${reason}`
              );
            });
          }
        });

        // Create a menu
        const tutorialMenu = new Menu({ commands });
        tutorialMenu.title.label = 'Settings Example';
        mainMenu.addMenu(tutorialMenu, { rank: 80 });

        // Add the command to the menu
        tutorialMenu.addItem({
          command: COMMAND_ID
        });
      })
      .catch(reason => {
        console.error(
          `Something went wrong when reading the settings.\n${reason}`
        );
      });
  }
};

export default extension;
