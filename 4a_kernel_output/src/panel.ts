import {
  StackedPanel
} from '@phosphor/widgets';

import {
  ClientSession, IClientSession
} from '@jupyterlab/apputils';

import {
  KernelMessage
} from '@jupyterlab/services';

import {
  ServiceManager
} from '@jupyterlab/services';

import {
  Message
} from '@phosphor/messaging';

import {
  SimplifiedOutputArea, OutputAreaModel
} from '@jupyterlab/outputarea';

import {
 IRenderMimeRegistry
} from '@jupyterlab/rendermime';

/**
 * The class name added to console panels.
 */
const PANEL_CLASS = 'jp-RovaPanel';

/**
 * A panel which contains a console and the ability to add other children.
 */
export
class TutorialPanel extends StackedPanel {
    constructor(manager: ServiceManager.IManager, rendermime: IRenderMimeRegistry) {
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

        this._outputareamodel = new OutputAreaModel();
        this._outputarea = new SimplifiedOutputArea({ model: this._outputareamodel, rendermime: rendermime });

        this.addWidget(this._outputarea);
        this._session.initialize();
    }

    dispose(): void {
        this._session.dispose();
        super.dispose();
    }

    public execute(code: string) {
        SimplifiedOutputArea.execute(code, this._outputarea, this._session)
            .then((msg: KernelMessage.IExecuteReplyMsg) => {console.log(msg); })
    }

    protected onCloseRequest(msg: Message): void {
        super.onCloseRequest(msg);
        this.dispose();
    }

    get session(): IClientSession {
        return this._session;
    }

    private _session: ClientSession;
    private _outputarea: SimplifiedOutputArea;
    private _outputareamodel: OutputAreaModel;
}
