'use strict'

import * as React from 'react';

import {
  VDomRenderer
} from '@jupyterlab/apputils';

import {
    KernelModel
} from './model'


export
class KernelView extends VDomRenderer<any> {
    constructor(model: KernelModel) {
        super();
        this.id = `TutorialVDOM`
        this.model = model
    }

    protected render(): React.ReactElement<any>[] {
        console.log('render');
        const elements: React.ReactElement<any>[] = [];
        elements.push(
            <button key='header-thread'
            className="jp-tutorial-button"
            onClick={() => {this.model.execute('3+5')}}>
            Compute 3+5</button>,

            <span key='output field'>{JSON.stringify(this.model.output)}</span>
        );
        return elements;
    }
}
