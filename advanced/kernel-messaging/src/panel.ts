import { SessionContext, ISessionContext } from '@jupyterlab/apputils';

import { ServiceManager } from '@jupyterlab/services';

import { UUID } from '@lumino/coreutils';

import { Message } from '@lumino/messaging';

import { StackedPanel } from '@lumino/widgets';

import { KernelView } from './widget';

import { KernelModel } from './model';

/**
 * The class name added to the panels.
 */
const PANEL_CLASS = 'jp-RovaPanel';

/**
 * A panel which has the ability to add other children.
 */
export class ExamplePanel extends StackedPanel {
  constructor(manager: ServiceManager.IManager) {
    super();
    this.addClass(PANEL_CLASS);
    this.id = 'kernel-messaging-panel';
    this.title.label = 'Example View';
    this.title.closable = true;

    this._session = new SessionContext({
      sessionManager: manager.sessions,
      specsManager: manager.kernelspecs,
      name: 'Example',
      path: UUID.uuid4()
    });

    this._model = new KernelModel(this._session);
    this._example = new KernelView(this._model);

    this.addWidget(this._example);
  }

  get session(): ISessionContext {
    return this._session;
  }

  dispose(): void {
    this._session.dispose();
    super.dispose();
  }

  protected onCloseRequest(msg: Message): void {
    super.onCloseRequest(msg);
    this.dispose();
  }

  private _model: KernelModel;
  private _session: SessionContext;
  private _example: KernelView;
}
