import { StackedPanel } from '@lumino/widgets';

import { ExampleView } from './widget';
/**
 * The class name added to console panels.
 */
const PANEL_CLASS = 'jp-RovaPanel';

/**
 * A panel which contains a console and the ability to add other children.
 */
export class ExamplePanel extends StackedPanel {
  constructor() {
    super();
    this.addClass(PANEL_CLASS);
    this.id = 'ExamplePanel';
    this.title.label = 'Example View';
    this.title.closable = true;

    this._widget = new ExampleView();
    this.addWidget(this._widget);
    this._widget.stateChanged.connect(() => {
      console.log('changed');
    });
  }

  private _widget: ExampleView;
}
