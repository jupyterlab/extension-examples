import { StackedPanel } from '@lumino/widgets';

import { ButtonWidget } from './button';
/**
 * The class name added to console panels.
 */
const PANEL_CLASS = 'jp-RovaPanel';

/**
 * A panel which contains a console and the ability to add other children.
 */
export class SignalExamplePanel extends StackedPanel {
  constructor() {
    super();
    this.addClass(PANEL_CLASS);
    this.id = 'SignalExamplePanel';
    this.title.label = 'Signal Example View';
    this.title.closable = true;

    this._widget = new ButtonWidget();
    this.addWidget(this._widget);
    this._widget.stateChanged.connect(() => {
      console.log('Button is clicked.');
      window.alert('Button is clicked.');
    });
  }

  private _widget: ButtonWidget;
}
