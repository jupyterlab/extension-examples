import { ReactWidget } from '@jupyterlab/apputils';
import { ISignal, Signal } from '@lumino/signaling';
import * as React from 'react';

export class StateExampleView extends ReactWidget {
  get stateChanged(): ISignal<StateExampleView, void> {
    return this._stateChanged;
  }

  protected render(): React.ReactElement<any> {
    return (
      <button
        key="header-thread"
        className="jp-example-button"
        onClick={() => {
          this._stateChanged.emit(void 0);
        }}
      >
        Clickme
      </button>
    );
  }

  private _stateChanged = new Signal<StateExampleView, void>(this);
}
