import { StackedPanel } from '@phosphor/widgets';

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

    this.widget = new ExampleView();
    this.addWidget(this.widget);
    this.widget.stateChanged.connect(() => {
      console.log('changed');
    });
  }

  private widget: ExampleView;
}
