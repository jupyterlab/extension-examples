import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { Token } from '@lumino/coreutils';

interface StepCounterItem {
  // registerStatusItem(id: string, statusItem: IStatusBar.IItem): IDisposable;
  getStepCount(): number;
  incrementStepCount(count: number): void;
}

// TODO define an interface for type checking the associated service
const StepCounter = new Token<StepCounterItem>(
  'step_counter:StepCounter',
  'A service for counting steps.'
);

class Counter implements StepCounterItem {

  _stepCount: number;

  constructor() {
    this._stepCount = 0;
  }

  incrementStepCount(count: number) {
    this._stepCount += count;
  }

  getStepCount() {
    return this._stepCount;
  }
}

const plugin: JupyterFrontEndPlugin<StepCounterItem> = {
  id: 'step_counter:provider_plugin',
  description: 'Provider plugin for the step_counter\'s "counter" service object.',
  autoStart: true,
  provides: StepCounter,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab X1 extension step_counter\'s provider plugin is activated!');
    const counter = new Counter();

    return counter;
  }
};

export { StepCounter, StepCounterItem };
export default plugin;
