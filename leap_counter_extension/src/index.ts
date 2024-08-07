// This is one of three related extension examples that demonstrate
// JupyterLab's provider-consumer pattern, where plugins can depend
// on and reuse features from one another. The three packages that
// make up the complete example are:
//
//   1. The step_counter package. This package holds a token, a
//      class + an interface that make up a stock implementation of
//      the "step_counter" service, and a provider plugin that
//      makes an instance of the Counter available to JupyterLab
//      as a service object.
//   2. The step_counter_extension package, that holds a
//      UI/interface in JupyterLab for users to count their steps that
//      connects with/consumes the step_counter service object via a
//      consumer plugin.
//   3. (*) The leap_counter_extension package (this one), that holds an alternate
//      way for users to count steps (a leap is 5 steps). Like the step_counter_extension
//      package, this holds a UI/interface in JupyterLab, and a consumer
//      plugin that also requests/consumes the step_counter service
//      object. The leap_counter_extension package demonstrates how
//      an unrelated plugin can depend on and reuse features from
//      an existing plugin. Users can install either the
//      step_counter_extension, the leap_counter_extension or both
//      to get whichever features they prefer (with both reusing
//      the step_counter service object).

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { Widget } from '@lumino/widgets';

import { StepCounter} from "step_counter";

// This widget holds the JupyterLab UI/interface that users will
// see and interact with to count and view their steps.
class LeapCounterWidget extends Widget {

  leapButton: HTMLElement;
  combinedStepCountLabel: HTMLElement;
  counter: any;

  // Notice that the constructor for this object takes a "counter"
  // argument, which is the service object associated with the StepCounter
  // token (which is passed in by the consumer plugin).
  constructor(counter: any) {
    super();

    this.counter = counter;
    this.counter.countChanged.connect(this.updateStepCountDisplay, this);

    // Add styling by using a CSS class
    this.node.classList.add('jp-leap-container');

    // Create and add a button to this widget's root node
    const leapButton = document.createElement('div');
    leapButton.innerText = 'Take a Leap';
    // Add a listener to handle button clicks
    leapButton.addEventListener('click', this.takeLeap.bind(this));
    leapButton.classList.add('jp-leap-button');
    this.node.appendChild(leapButton);
    this.leapButton = leapButton;

    // Add a label to display the step count
    const combinedStepCountLabel = document.createElement('p');
    combinedStepCountLabel.classList.add('jp-combined-step-count-label');
    this.node.appendChild(combinedStepCountLabel);
    this.combinedStepCountLabel = combinedStepCountLabel;

    this.updateStepCountDisplay();
  }

  // Refresh the displayed step count
  updateStepCountDisplay() {
    this.combinedStepCountLabel.innerText = 'Combined Step Count: ' + this.counter.getStepCount();
  }

  // Increment the step count, a leap is 5 steps
  takeLeap() {
    this.counter.incrementStepCount(5);
    this.updateStepCountDisplay();
  }
}

// This plugin is a "consumer" in JupyterLab's provider-consumer pattern.
// The "requires" property of this plugin lists the StepCounter token, which
// requests the service-object associated with that token from JupyterLab,
// and this plugin "consumes" the service object by using it in its own code.
// Whenever you add a "requires" or "optional" service, you need to manually
// add an argument to your plugin's "activate" function.
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'leap_counter_extension:plugin',
  description: 'Adds a leap counter/button (1 of 3 related examples). This extension holds the UI/interface',
  autoStart: true,
  requires: [StepCounter],
  // The activate function here will be called by JupyterLab when the plugin loads.
  // When JupyterLab calls your plugin's activate function, it will always pass
  // an application as the first argument, then any required arguments, then any optional
  // arguments, so make sure you add arguments for those here when your plugin requests
  // any required or optional services. If a required service is missing, your plugin
  // won't load. If an optional service is missing, the supplied argument will be null.
  activate: (app: JupyterFrontEnd, counter: any) => {
    console.log('JupyterLab extension leap_counter_extension is activated!');

    // Create a LeapCounterWidget and add it to the interface
    const leapWidget: LeapCounterWidget = new LeapCounterWidget(counter);
    leapWidget.id = 'JupyterLeapWidget';  // Widgets need an id
    app.shell.add(leapWidget, 'top');
  }
};

export default plugin;
