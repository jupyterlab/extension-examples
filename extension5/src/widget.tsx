import * as React from 'react';

import {
  VDomRenderer
} from '@jupyterlab/apputils';

import {
  Widget, BoxLayout
} from '@phosphor/widgets';


export
class TutorialView extends VDomRenderer<any> {
  constructor() {
    super();
    this.id = `TutorialWidget`
  }

  protected render(): React.ReactElement<any>[] {
    const elements: React.ReactElement<any>[] = [];
    elements.push(<button key='header-thread' className="jp-tutorial-button" onClick={this.execute}>Clickme</button>);
    return elements;
  }

  execute(): void {
      console.log('here');
  }
}

export
class TutorialWidget extends Widget {
    constructor() {
        super();
        this.id = 'TutorialWidget';
        this.title.label = 'TutorialWidget';
        this.title.closable = true;

        let layout = this.layout = new BoxLayout();
        this._vdom = new TutorialView();
        layout.addWidget(this._vdom);
    }
    private _vdom: TutorialView;
}
