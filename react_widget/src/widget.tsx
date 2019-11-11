import { ReactWidget } from "@jupyterlab/apputils";

import * as React from 'react';

const CounterComponent = () => {
  return (
    <div>
      TODO
    </div>
  )
}

export class CounterWidget extends ReactWidget {
  render() {
    return <CounterComponent />;
  }
}