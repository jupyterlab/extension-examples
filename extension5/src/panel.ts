import {
  StackedPanel
} from '@phosphor/widgets';

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
    constructor() {
        super();
        this.addClass(PANEL_CLASS);
        this.id = 'TutorialPanel';
        this.title.label = 'Tutorial View'
        this.title.closable = true;

        this.tutorial = new TutorialWidget();
        this.addWidget(this.tutorial);
    }

    private tutorial: TutorialWidget;
}
