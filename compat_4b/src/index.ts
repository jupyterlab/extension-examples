import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { Widget } from '@lumino/widgets';

import { StepCounter} from "step_counter";

/**
 * StepCounterWidget holds X
 */
class StepCounterWidget extends Widget {

  stepButton: HTMLElement;
  stepCountLabel: HTMLElement;
  counter: any;

  constructor(counter: any) {
    super();

    this.counter = counter;

    this.node.classList.add('jp-step-container');

    // Create and add a button to this widget's root node
    const stepButton = document.createElement('div');
    stepButton.innerText = 'Take a Step';
    // Add a listener to TODO
    stepButton.addEventListener('click', this.takeStep.bind(this));
    stepButton.classList.add('jp-step-button');
    this.node.appendChild(stepButton);
    this.stepButton = stepButton;

    const stepCountLabel = document.createElement('p');
    stepCountLabel.classList.add('jp-step-label');
    this.node.appendChild(stepCountLabel);
    this.stepCountLabel = stepCountLabel;

    this.updateStepCountDisplay();
  }

  updateStepCountDisplay() {
    this.stepCountLabel.innerText = 'Step Count: ' + this.counter.getStepCount();
  }

  takeStep() {
    this.counter.incrementStepCount(1);
    this.updateStepCountDisplay();
  }
}

/**
 * Initialization data for the step_counter_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'step_counter_extension:plugin',
  description: 'Adds a step counter/button, and a step increment provider (1 of 3 related examples). This extension holds the UI/plugin implementation.',
  autoStart: true,
  requires: [StepCounter],
  activate: (app: JupyterFrontEnd, counter: any) => {
    console.log('JupyterLab extension step_counter_extension is activated!');

    // Create a StepCounterWidget and add it to the interface
    const stepWidget: StepCounterWidget = new StepCounterWidget(counter);
    stepWidget.id = 'JupyterStepWidget';  // Widgets need an id
    app.shell.add(stepWidget, 'top');
  }
};

export default plugin;
