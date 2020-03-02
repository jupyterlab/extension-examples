import { StackedPanel } from '@lumino/widgets';

import { StateExampleView } from './widget';
/**
 * The class name added to console panels.
 */
const PANEL_CLASS = 'jp-RovaPanel';

/**
 * A panel which contains a console and the ability to add other children.
 */
export class StateExamplePanel extends StackedPanel {
  constructor() {
    super();
    this.addClass(PANEL_CLASS);
    this.id = 'StateExamplePanel';
    this.title.label = 'Signal Example View';
    this.title.closable = true;

    this._widget = new StateExampleView();
    this.addWidget(this._widget);
    this._widget.stateChanged.connect(() => {
      console.log('changed');
      window.alert('changed');
    });
  }

  private _widget: StateExampleView;
}
