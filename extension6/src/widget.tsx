'use strict'

import * as React from 'react';

import {
  VDomRenderer
} from '@jupyterlab/apputils';

import {
  ISignal, Signal
} from '@phosphor/signaling';


export
class TutorialView extends VDomRenderer<any> {
    constructor() {
        super();
        this.id = `TutorialVDOM`
    }

    protected render(): React.ReactElement<any>[] {
        const elements: React.ReactElement<any>[] = [];
        elements.push(
            <button key='header-thread'
            className="jp-tutorial-button"
            onClick={() => {this._stateChanged.emit('3+5')}}>
            Compute 3+5</button>);
        return elements;
    }

    get stateChanged(): ISignal<TutorialView, string> {
        return this._stateChanged;
    }

    private _stateChanged = new Signal<TutorialView, string>(this);
}
