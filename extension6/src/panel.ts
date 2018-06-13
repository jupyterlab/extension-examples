import {
  StackedPanel
} from '@phosphor/widgets';

import {
  ClientSession, IClientSession
} from '@jupyterlab/apputils';

import {
  ServiceManager
} from '@jupyterlab/services';

import {
  KernelMessage
} from '@jupyterlab/services';

import {
  Message
} from '@phosphor/messaging';

import {
    TutorialWidget
} from './widget';
/**
 * The class name added to console panels.
 */
const PANEL_CLASS = 'jp-RovaPanel';

/**
 * A panel which contains a console and the ability to add other children.
 */
export
class TutorialPanel extends StackedPanel {
    constructor(manager: ServiceManager.IManager) {
        super();
        this.addClass(PANEL_CLASS);
        this.id = 'TutorialPanel';
        this.title.label = 'Tutorial View'
        this.title.closable = true;

        let path = './console';

        this._session = new ClientSession({
            manager: manager.sessions,
            path,
            name: 'Tutorial',
        });
        
        this.tutorial = new TutorialWidget();
        this.addWidget(this.tutorial);
        this.tutorial.executed.connect(this._onExecute, this);
        this._session.initialize();
    }

    dispose(): void {
        this._session.dispose();
        super.dispose();
    }

    protected onCloseRequest(msg: Message): void {
        super.onCloseRequest(msg);
        this.dispose();
    }

    private _onExecute(sender: TutorialWidget, code: string) {
        let content: KernelMessage.IExecuteRequest = {
            code,
            stop_on_error: true
        };

        if (!this._session.kernel) {
            return Promise.reject('Session has no kernel.');
        }
        let future = this._session.kernel.requestExecute(content, false);
        let returnMessage = future.done as Promise<KernelMessage.IExecuteReplyMsg>;
        returnMessage.then(() => {console.log(returnMessage)});
    }

    get session(): IClientSession {
        return this._session;
    }

    private _session: ClientSession;
    private tutorial: TutorialWidget;
}
