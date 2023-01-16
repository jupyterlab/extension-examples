import type { WidgetProps } from '@rjsf/core';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { IFormComponentRegistry, IFormComponent } from '@jupyterlab/ui-components';

import { CustomCheckbox } from './customWidgets';

/**
 * Initialization data for the metadata_form extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'metadataform-example:plugin',
  autoStart: true,
  requires: [IFormComponentRegistry],
  activate: (
    app: JupyterFrontEnd,
    formRegistry: IFormComponentRegistry | null
  ) => {
    // Register the custom widget
    if (formRegistry) {
      const component: IFormComponent = {
        widgetRenderer: (props: WidgetProps) => {
          return CustomCheckbox(props as WidgetProps);
        }
      }
      formRegistry.addComponent('custom-checkbox', component);
    }
    console.log('Metadata form example activated');
  },
};

export default plugin;
