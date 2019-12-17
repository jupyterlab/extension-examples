import { StackedPanel } from '@phosphor/widgets';

import { ClientSession, IClientSession } from '@jupyterlab/apputils';

import { ServiceManager } from '@jupyterlab/services';

import { Message } from '@phosphor/messaging';

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

    this._session = new ClientSession({
      manager: manager.sessions,
      name: 'Example'
    });

    this._model = new KernelModel(this._session);
    this._example = new KernelView(this._model);

    this.addWidget(this._example);
    this._session.initialize().catch(reason => {
      console.error(`Fail to initialize session in ExamplePanel.\n${reason}`);
    });
  }

  get session(): IClientSession {
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
  private _session: ClientSession;
  private _example: KernelView;
}
