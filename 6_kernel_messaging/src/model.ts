"use strict";

import { VDomModel } from "@jupyterlab/apputils";

import { Kernel, KernelMessage } from "@jupyterlab/services";

import { nbformat } from "@jupyterlab/coreutils";

import { IClientSession } from "@jupyterlab/apputils";

export class KernelModel extends VDomModel {
  constructor(session: IClientSession) {
    super();
    this._session = session;
  }

  public execute(code: string) {
    if (!this._session || !this._session.kernel) {
      return;
    }
    this.future = this._session.kernel.requestExecute({ code });
  }

  private _onIOPub = (msg: KernelMessage.IIOPubMessage) => {
    let msgType = msg.header.msg_type;
    switch (msgType) {
      case "execute_result":
      case "display_data":
      case "update_display_data":
        this._output = msg.content as nbformat.IOutput;
        console.log(this._output);
        this.stateChanged.emit(undefined);
        break;
      default:
        break;
    }
    return;
  };

  get output(): nbformat.IOutput | null {
    return this._output;
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

  private _output: nbformat.IOutput | null = null;
  private _future: Kernel.IFuture<
    KernelMessage.IExecuteRequestMsg,
    KernelMessage.IExecuteReplyMsg
  > | null = null;
  private _session: IClientSession;
}
