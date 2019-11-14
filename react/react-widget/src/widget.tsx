import { ReactWidget } from "@jupyterlab/apputils";

import React, { useState }  from 'react';

const REACT_WIDGET_CLASS = 'jp-ReactWidget';

const CounterComponent = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <p>You clicked {counter} times!</p>
      <button onClick={() => { setCounter(counter + 1) }}>
        Increment
      </button>
    </div>
  )
}

export class CounterWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass(REACT_WIDGET_CLASS);
  }

  render() {
    return <CounterComponent />;
  }
}