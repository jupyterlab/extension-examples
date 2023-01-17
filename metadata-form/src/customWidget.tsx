import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { checkIcon, closeIcon } from '@jupyterlab/ui-components';

export const CustomCheckbox = function (props: WidgetProps) {
  return (
    <span
      id="metadataform-example-custom-widget"
      style={{ display: 'flex', fontSize: '16px' }}
      className={props.value ? 'checked' : 'unchecked'}
      onClick={() => props.onChange(!props.value)}
    >
      {props.value && <checkIcon.react />}
      {!props.value && <closeIcon.react />}
      {String(props.value)}
    </span>
  );
};
