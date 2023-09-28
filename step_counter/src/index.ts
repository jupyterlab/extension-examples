// This is one of three related extension examples that demonstrate
// JupyterLab's provider-consumer pattern, where plugins can depend
// on and reuse features from one another. The three packages that
// make up the complete example are:
//
//   1. (*) The step_counter package (this one). This holds a token, a
//      class + an interface that make up a stock implementation of
//      the "step_counter" service, and a provider plugin that
//      makes an instance of the Counter available to JupyterLab
//      as a service object.
//   2. The step_counter_extension package, that holds a UI/interface
//      in JupyterLab for users to count their steps that connects
//      with/consumes the step_counter service object via a consumer plugin.
//   3. The leap_counter_extension package, that holds an alternate
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

import { Token } from '@lumino/coreutils';
import { Signal } from '@lumino/signaling';

// The StepCounterItem interface is used as part of JupyterLab's
// provider-consumer pattern. This interface is supplied to the
// token instance (the StepCounter token), and JupyterLab will
// use it to type-check any service-object associated with the
// token that a provider plugin supplies to check that it conforms
// to the interface.
interface StepCounterItem {
  // registerStatusItem(id: string, statusItem: IStatusBar.IItem): IDisposable;
  getStepCount(): number;
  incrementStepCount(count: number): void;
  countChanged: Signal<any, number>;
}

// The token is used to identify a particular "service" in
// JupyterLab's extension system (here the StepCounter token
// identifies the example "Step Counter Service", which is used
// to store and increment step count data in JupyterLab). Any
// plugin can use this token in their "requires" or "activates"
// list to request the service object associated with this token!
const StepCounter = new Token<StepCounterItem>(
  'step_counter:StepCounter',
  'A service for counting steps.'
);

// This class holds step count data/utilities. An instance of
// this class will serve as the service object associated with
// the StepCounter token (Other developers can substitute their
// own implementation of a StepCounterItem instead of using this
// one, by becoming a provider of the StepCounter token).
class Counter implements StepCounterItem {

  _stepCount: number;
  countChanged: Signal<any, number>;

  constructor() {
    this._stepCount = 0;
    this.countChanged = new Signal<this, number>(this);
  }

  incrementStepCount(count: number) {
    this._stepCount += count;
    this.countChanged.emit(this._stepCount);
  }

  getStepCount() {
    return this._stepCount;
  }
}

// This plugin is a "provider" in JupyterLab's provider-consumer pattern.
// For a plugin to become a provider, it must list the token it wants to
// provide a service object for in its "provides" list, and then it has
// to return that object (in this case, an instance of the example Counter
// class defined above) from the function supplied as its activate property.
// It also needs to supply the interface (the one the service object
// implements) to JupyterFrontEndPlugin when it's defined.
const plugin: JupyterFrontEndPlugin<StepCounterItem> = {
  id: 'step_counter:provider_plugin',
  description: 'Provider plugin for the step_counter\'s "counter" service object.',
  autoStart: true,
  provides: StepCounter,
  // The activate function here will be called by JupyterLab when the plugin loads
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension (step_counter/provider plugin) is activated!');
    const counter = new Counter();

    // Since this plugin "provides" the "StepCounter" service, make sure to
    // return the object you want to use as the "service object" here (when
    // other plugins request the StepCounter service, it is this object
    // that will be supplied)
    return counter;
  }
};

// The Counter class here should be marked as a singleton in this project's
// package.json according to the Jupyter extension documentation, both in
// this provider extension and in the consumer extensions. Under the
// "Jupyterlab" key you should have a "singleton" key set to true.
// 
// "jupyterlab": {
//   "extension": true,
//   "outputDir": "step_counter/labextension",
//   "sharedPackages": {
//       "step_counter": {
//           "bundled": false,
//           "singleton": true
//       }
//   }
// },
//
// Read more about that here:
// https://jupyterlab.readthedocs.io/en/latest/extension/extension_dev.html#providing-a-service
// https://jupyterlab.readthedocs.io/en/latest/extension/extension_dev.html#requiring-a-service
// https://jupyterlab.readthedocs.io/en/latest/extension/extension_dev.html#optionally-using-a-service

export { StepCounter, StepCounterItem };
export default plugin;
