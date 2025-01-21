# Step Counter (Reusability 1A) (step_counter)

This multi-part example comes from the [Jupyter Plugin System guide](https://jupyterlab.readthedocs.io/en/latest/extension/plugin_system.html),
and demonstrates Jupyter's provider/consumer pattern. You can find
details about this example on that page.

This is one of three related extension examples that demonstrate
JupyterLab's provider-consumer pattern, where plugins can depend
on and reuse features from one another. The three packages that
make up the complete example are:

  1. (*) The step_counter package (this one). This holds a token, a
     class + an interface that make up a stock implementation of
     the "step_counter" service, and a provider plugin that
     makes an instance of the Counter available to JupyterLab
     as a service object.

  2. The step_counter_extension package, that holds a UI/interface
     in JupyterLab for users to count their steps that connects
     with/consumes the step_counter service object via a consumer plugin.

  3. The leap_counter_extension package, that holds an alternate
     way for users to count steps (a leap is 5 steps). Like the step_counter_extension
     package, this holds a UI/interface in JupyterLab, and a consumer
     plugin that also requests/consumes the step_counter service
     object. The leap_counter_extension package demonstrates how
     an unrelated plugin can depend on and reuse features from
     an existing plugin. Users can install either the
     step_counter_extension, the leap_counter_extension or both
     to get whichever features they prefer (with both reusing
     the step_counter service object).
