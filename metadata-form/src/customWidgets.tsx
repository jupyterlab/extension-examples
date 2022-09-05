import React from 'react';
import { WidgetProps } from '@rjsf/core';

export const CustomCheckbox = function (props: WidgetProps) {
  return (
    <button
      id="custom"
      className={props.value ? 'checked' : 'unchecked'}
      onClick={() => props.onChange(!props.value)}
    >
      {String(props.value)}
    </button>
  );
};
