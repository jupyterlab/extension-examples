import { ReactWidget } from '@jupyterlab/apputils';
import { ISignal, Signal } from '@phosphor/signaling';
import * as React from 'react';

export class TutorialView extends ReactWidget {
  get stateChanged(): ISignal<TutorialView, void> {
    return this._stateChanged;
  }

  protected render(): React.ReactElement<any> {
    return (
      <button
        key="header-thread"
        className="jp-tutorial-button"
        onClick={() => {
          this._stateChanged.emit(void 0);
        }}
      >
        Clickme
      </button>
    );
  }

  private _stateChanged = new Signal<TutorialView, void>(this);
}
