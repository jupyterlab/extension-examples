import { IClientSession } from '@jupyterlab/apputils';

import { nbformat } from '@jupyterlab/coreutils';

import { Kernel, KernelMessage } from '@jupyterlab/services';

import { ISignal, Signal } from '@phosphor/signaling';

export class KernelModel {
  constructor(session: IClientSession) {
    this._session = session;
  }

  get future(): Kernel.IFuture<
    KernelMessage.IExecuteRequestMsg,
    KernelMessage.IExecuteReplyMsg
  > | null {
    return this._future;
  }

  set future(
    value: Kernel.IFuture<
      KernelMessage.IExecuteRequestMsg,
      KernelMessage.IExecuteReplyMsg
    > | null
  ) {
    this._future = value;
    if (!value) {
      return;
    }
    value.onIOPub = this._onIOPub;
  }

  get output(): nbformat.IOutput | null {
    return this._output;
  }

  get stateChanged(): ISignal<KernelModel, void> {
    return this._stateChanged;
  }

  execute(code: string) {
    if (!this._session || !this._session.kernel) {
      return;
    }
    this.future = this._session.kernel.requestExecute({ code });
  }

  private _onIOPub = (msg: KernelMessage.IIOPubMessage) => {
    let msgType = msg.header.msg_type;
    switch (msgType) {
      case 'execute_result':
      case 'display_data':
      case 'update_display_data':
        this._output = msg.content as nbformat.IOutput;
        console.log(this._output);
        this._stateChanged.emit();
        break;
      default:
        break;
    }
    return;
  };

  private _future: Kernel.IFuture<
    KernelMessage.IExecuteRequestMsg,
    KernelMessage.IExecuteReplyMsg
  > | null = null;
  private _output: nbformat.IOutput | null = null;
  private _session: IClientSession;
  private _stateChanged = new Signal<KernelModel, void>(this);
}
