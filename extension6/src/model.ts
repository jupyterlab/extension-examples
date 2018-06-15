'use strict'

import {
  VDomModel
} from '@jupyterlab/apputils';

import {
  Kernel, KernelMessage
} from '@jupyterlab/services';

import {
  nbformat
} from '@jupyterlab/coreutils';

import {
  IClientSession
} from '@jupyterlab/apputils';


export
class TutorialModel extends VDomModel {
    constructor(session: IClientSession) {
        super();
        this._session = session;
    }

    public execute(code: string) {
        let content: KernelMessage.IExecuteRequest = { code };
        this.future = this._session.kernel.requestExecute(content, false);
    }

    private _onIOPub = (msg: KernelMessage.IIOPubMessage) => {
        let msgType = msg.header.msg_type;
        switch (msgType) {
            case 'execute_result':
            case 'display_data':
            case 'update_display_data':
                this._output = msg.content as nbformat.IOutput;
                console.log(this._output);
                this.stateChanged.emit(undefined);
            default:
                break;
        }
        return true
    }

    get output(): nbformat.IOutput {
        return this._output;
    }

    get future(): Kernel.IFuture {
        return this._future;
    }

    set future(value: Kernel.IFuture) {
        this._future = value;
        value.onIOPub = this._onIOPub;
    }

    private _output: nbformat.IOutput = null;
    private _future: Kernel.IFuture = null;
    private _session: IClientSession;
}
