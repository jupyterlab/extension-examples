import {
  ITranslator,
  nullTranslator,
  TranslationBundle,
} from '@jupyterlab/translation';

import { Panel } from '@lumino/widgets';

import { ButtonWidget, ICount } from './button';

const PANEL_CLASS = 'jp-SignalExamplePanel';

/**
 * A panel which contains a ButtonWidget and the ability to add other children.
 */
export class SignalExamplePanel extends Panel {
  static _id = 0;

  constructor(translator?: ITranslator) {
    super();
    this._translator = translator || nullTranslator;
    this._trans = this._translator.load('jupyterlab');
    this.addClass(PANEL_CLASS);

    //  This ensures the id of the DOM node is unique for each Panel instance.
    this.id = 'SignalExamplePanel_' + SignalExamplePanel._id++;

    this.title.label = this._trans.__('Signal Example View');
    this.title.closable = true;

    this._widget = new ButtonWidget();
    this.addWidget(this._widget);
    this._widget.stateChanged.connect(this._logMessage, this);
  }

  private _logMessage(emitter: ButtonWidget, count: ICount): void {
    console.log('Hey, a Signal has been received from', emitter);
    console.log(
      `The big red button has been clicked ${count.clickCount} times.`
    );
    window.alert(
      `The big red button has been clicked ${count.clickCount} times.`
    );
  }

  private _widget: ButtonWidget;
  private _translator: ITranslator;
  private _trans: TranslationBundle;
}
