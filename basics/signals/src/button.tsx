import { ReactWidget } from '@jupyterlab/apputils';
import { ISignal, Signal } from '@lumino/signaling';
import * as React from 'react';

export class ButtonWidget extends ReactWidget {
  get stateChanged(): ISignal<ButtonWidget, void> {
    return this._stateChanged;
  }

  protected render(): React.ReactElement<any> {
    return (
      <button
        key="header-thread"
        className="jp-example-button"
        onClick={(): void => {
          this._stateChanged.emit(void 0);
        }}
      >
        Clickme
      </button>
    );
  }

  private _stateChanged = new Signal<ButtonWidget, void>(this);
}
