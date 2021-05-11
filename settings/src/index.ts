import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { IMainMenu } from '@jupyterlab/mainmenu';

import { Menu } from '@lumino/widgets';

const PLUGIN_ID = '@jupyterlab-examples/settings:settings-example';

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

    /**
     * Load the settings for this extension
     *
     * @param setting Extension settings
     */
    function loadSetting(setting: ISettingRegistry.ISettings): void {
      // Read the settings and convert to the correct type
      limit = setting.get('limit').composite as number;
      flag = setting.get('flag').composite as boolean;

      console.log(
        `Settings Example extension: Limit is set to '${limit}' and flag to '${flag}'`
      );
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
          label: 'Toggle Flag and Increment Limit',
          isToggled: () => flag,
          execute: () => {
            // Programmatically change a setting
            Promise.all([
              setting.set('flag', !flag),
              setting.set('limit', limit + 1),
            ])
              .then(() => {
                const newLimit = setting.get('limit').composite as number;
                const newFlag = setting.get('flag').composite as boolean;
                window.alert(
                  `Settings Example extension: Limit is set to '${newLimit}' and flag to '${newFlag}'`
                );
              })
              .catch((reason) => {
                console.error(
                  `Something went wrong when changing the settings.\n${reason}`
                );
              });
          },
        });

        // Create a menu
        const settingsMenu = new Menu({ commands });
        settingsMenu.title.label = 'Settings Example';
        mainMenu.addMenu(settingsMenu, { rank: 80 });

        // Add the command to the menu
        settingsMenu.addItem({
          command: COMMAND_ID,
        });
      })
      .catch((reason) => {
        console.error(
          `Something went wrong when reading the settings.\n${reason}`
        );
      });
  },
};

export default extension;
