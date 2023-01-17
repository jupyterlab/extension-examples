import type { FieldProps, WidgetProps } from '@rjsf/core';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import {
  IFormComponentRegistry,
  IFormComponent,
} from '@jupyterlab/ui-components';

import { CustomCheckbox } from './customWidget';
import { CustomField } from './customField';

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
          return CustomCheckbox(props);
        },
      };
      formRegistry.addComponent('custom-checkbox', component);

      const customField: IFormComponent = {
        fieldRenderer: (props: FieldProps) => {
          return new CustomField().render(props);
        },
      };
      formRegistry.addComponent('custom-field', customField);
    }
    console.log('Metadata form example activated');
  },
};

export default plugin;
