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
  Kernel, KernelMessage
} from '@jupyterlab/services';

import {
  Message
} from '@phosphor/messaging';

import {
  nbformat
} from '@jupyterlab/coreutils';

import {
    TutorialView
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
        
        this.tutorial = new TutorialView();
        this.addWidget(this.tutorial);
        this.tutorial.stateChanged.connect(this._onExecute, this);
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

    private _onExecute(sender: TutorialView, code: string) {
        // Override the default for `stop_on_error`.
        let content: KernelMessage.IExecuteRequest = {
          code,
          stop_on_error: true
        };

        if (!this.session.kernel) {
          return Promise.reject('Session has no kernel.');
        }
        this.future = this.session.kernel.requestExecute(content, false);
    }

    private _onIOPub = (msg: KernelMessage.IIOPubMessage) => {
        let output: nbformat.IOutput;
        let msgType = msg.header.msg_type;
        switch (msgType) {
            case 'execute_result':
            case 'display_data':
            case 'update_display_data':
                output = msg.content as nbformat.IOutput;
                console.log(output);
            default:
                break;
        }
        return true
    }

    get future(): Kernel.IFuture {
        return this._future;
    }

    set future(value: Kernel.IFuture) {
        this._future = value;
        value.onIOPub = this._onIOPub;
    }

    get session(): IClientSession {
        return this._session;
    }

    private _future: Kernel.IFuture = null;
    private _session: ClientSession;
    private tutorial: TutorialView;
}
