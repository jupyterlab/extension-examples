import type { FieldProps, WidgetProps } from '@rjsf/utils';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {
  IFormRendererRegistry,
  IFormRenderer
} from '@jupyterlab/ui-components';

import { CustomCheckbox } from './customWidget';
import { CustomField } from './customField';

/**
 * Initialization of a simple metadata form plugin.
 */
const simple: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/metadata-form:simple',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('Simple metadata-form example activated');
  }
};

/**
 * Initialization of an advanced metadata form plugin.
 */
const advanced: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/metadata-form:advanced',
  autoStart: true,
  requires: [IFormRendererRegistry],
  activate: (
    app: JupyterFrontEnd,
    formRegistry: IFormRendererRegistry | null
  ) => {
    // Register the custom widget
    if (formRegistry) {
      const component: IFormRenderer = {
        widgetRenderer: (props: WidgetProps) => {
          return CustomCheckbox(props);
        }
      };
      formRegistry.addRenderer(
        '@jupyterlab-examples/metadata-form:advanced.custom-checkbox',
        component
      );

      const customField: IFormRenderer = {
        fieldRenderer: (props: FieldProps) => {
          return new CustomField().render(props);
        }
      };
      formRegistry.addRenderer(
        '@jupyterlab-examples/metadata-form:advanced.custom-field',
        customField
      );
    }
    console.log('Advanced metadata-form example activated');
  }
};

export default [advanced, simple];
