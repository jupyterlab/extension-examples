import type { FieldProps, WidgetProps } from '@rjsf/core';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import {
  IFormRendererRegistry,
  IFormRenderer,
} from '@jupyterlab/ui-components';

import { CustomCheckbox } from './customWidget';
import { CustomField } from './customField';

/**
 * Initialization data for the metadata_form extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'metadataform-example:plugin',
  autoStart: true,
  requires: [IFormRendererRegistry],
  activate: (
    app: JupyterFrontEnd,
    formRegistry: IFormRendererRegistry | null
  ) => {
    console.log(formRegistry);
    // Register the custom widget
    if (formRegistry) {
      const component: IFormRenderer = {
        widgetRenderer: (props: WidgetProps) => {
          return CustomCheckbox(props);
        },
      };
      formRegistry.addRenderer(
        'metadataform-example:plugin.custom-checkbox',
        component
      );

      const customField: IFormRenderer = {
        fieldRenderer: (props: FieldProps) => {
          return new CustomField().render(props);
        },
      };
      formRegistry.addRenderer(
        'metadataform-example:plugin.custom-field',
        customField
      );
    }
    console.log('Metadata form example activated');
  },
};

export default plugin;
