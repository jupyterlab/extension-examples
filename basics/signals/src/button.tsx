import { ReactWidget } from '@jupyterlab/apputils';
import { ISignal, Signal } from '@lumino/signaling';

import * as React from 'react';

export interface ICount {
  clickCount: number;
}

export class ButtonWidget extends ReactWidget {
  protected _count: ICount = {
    clickCount: 0
  };

  public get stateChanged(): ISignal<this, ICount> {
    return this._stateChanged;
  }

  protected render(): React.ReactElement<any> {
    return (
      <button
        key="header-thread"
        className="jp-example-button"
        onClick={(): void => {
          this._count = {
            clickCount: this._count.clickCount + 1
          };
          this._stateChanged.emit(this._count);
        }}
      >
        Clickme
      </button>
    );
  }

  private _stateChanged = new Signal<this, ICount>(this);
}
