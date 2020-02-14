import { ReactWidget } from '@jupyterlab/apputils';

import React, { useState } from 'react';

/**
 * React component for a counter.
 */
const CounterComponent = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <p>You clicked {counter} times!</p>
      <button
        onClick={() => {
          setCounter(counter + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
};

/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class CounterWidget extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
  constructor() {
    super();
    this.addClass('jp-ReactWidget');
  }

  render() {
    return <CounterComponent />;
  }
}
