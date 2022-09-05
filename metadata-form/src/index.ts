import { JupyterFrontEndPlugin } from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { IFormWidgetRegistry } from '@jupyterlab/ui-components';

import { CustomCheckbox } from './customWidgets';

/**
 * Initialization data for the metadata_form extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'metadata_form:plugin',
  autoStart: true,
  requires: [ISettingRegistry, ICommandPalette],
  optional: [IFormWidgetRegistry],
  activate: (editorRegistry: IFormWidgetRegistry | null) => {
    // Register the custom plugin
    if (editorRegistry) {
      editorRegistry.addRenderer('custom-checkbox', (props: any) => {
        return CustomCheckbox(props);
      });
    }

    console.log('Metadata form example activated');
  },
};

export default plugin;
