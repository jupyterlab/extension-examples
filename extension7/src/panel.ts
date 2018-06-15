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
  Message
} from '@phosphor/messaging';

import {
    KernelView
} from './widget';

import {
    KernelModel
} from './model'

import {
  OutputArea, OutputAreaModel
} from '@jupyterlab/outputarea';


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

        this._model = new KernelModel(this._session);
        this._tutorial = new KernelView(this._model);
        this._outputarea = new OutputArea();

        this.addWidget(this._tutorial);
        this.addWidget(this._outputarea);
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

    get session(): IClientSession {
        return this._session;
    }

    private _model: KernelModel;
    private _session: ClientSession;
    private _outputarea: OutputArea;
    private _tutorial: KernelView;
}
