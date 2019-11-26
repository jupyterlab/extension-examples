# Using State Persistence in an Extension

This example shows how to save and restore data save in persistent state database
in a JupyterLab extension.

The core token required for handling the state database (DB) is
`IStateDB` ([documentation](https://jupyterlab.github.io/jupyterlab/coreutils/modules/istatedb.html)). To use it,
you first need to install its npm package:

```bash
jlpm add @jupyterlab/coreutils
```

Once this is done. You can import the interface in your code.

```ts
// src/index.ts#L8-L8

import { IStateDB } from '@jupyterlab/coreutils';
```

To see how we can access the state, let's have a look at
`src/index.ts`.

```ts
// src/index.ts#L17-L56

const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [IStateDB],
  activate: (app: JupyterFrontEnd, state: IStateDB) => {
    const choices = ['one', 'two', 'three'];
    let choice = choices[0];

    app.restored
      // Get the state object
      .then(() => state.fetch(PLUGIN_ID))
      .then(value => {
        // Get the choice attribute
        if (value) {
          choice = (value as ReadonlyJSONObject)['choice'] as string;
        }

        // Ask the user to pick a choice with `choice` as default
        return InputDialog.getItem({
          title: 'Pick a choice',
          items: choices,
          current: Math.max(0, choices.indexOf(choice))
        });
      })
      .then(result => {
        // If the user click on the accept button of the dialog
        if (result.button.accept) {
          // Get the user choice
          choice = result.value;
          // Save the choice in the state database
          return state.save(PLUGIN_ID, { choice });
        }
      })
      .catch(reason => {
        console.error(
          `Something went wrong when reading the state for ${PLUGIN_ID}.\n${reason}`
        );
      });
  }
};
```

The `IStateDB` is passed to the `activate` function as an
argument (variable `state`) in addition to the JupyterLab application
(variable `app`). You request that dependency with the property
`requires: [IStateDB],`. It lists the additional arguments
you want to inject into the `activate` function in the `JupyterFontEndPlugin`.

First, the extension waits for the application to be restored before
loading the state data for your plugin:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L25-L27

app.restored
  // Get the state object
  .then(() => state.fetch(PLUGIN_ID))
```
<!-- prettier-ignore-end -->

The data are loaded as a `ReadonlyJSONValue` object. So all stored data must be
JSON-able and its type value should be specifically set when accessing the value.
For instance, in this example the variable `choice` is of type `string`:

```ts
// src/index.ts#L30-L32

if (value) {
  choice = (value as ReadonlyJSONObject)['choice'] as string;
}
```

The `if` test ensure some value has been read. It is important to set a default value.
Indeed the first time an user will installed your extension, the state won't contain
any value for your plugin.

In the example, once the state is read, the user is prompted to choose a choice from
an item list with the default choice being stored as state variable.

```ts
// src/index.ts#L35-L39

return InputDialog.getItem({
  title: 'Pick a choice',
  items: choices,
  current: Math.max(0, choices.indexOf(choice))
});
```

This implies to store the new choice done by the user in the state. This is done
using the `save` methode of `IStateDB`:

```ts
// src/index.ts#L47-L47

return state.save(PLUGIN_ID, { choice });
```

To see it action,

1. Install the example within JupyterLab
2. Pick a different choice that _one_
3. Refresh your browser
4. The input dialog should have your choice as default value

Note

> This example uses [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
> This is a technology to handle asynchronous action like reading
> the settings in this example. So have a look at that [tutorial](https://scotch.io/tutorials/javascript-promises-for-dummies)
> if you want to know more about the `then`/`catch` used here.

## Where to Go Next

You may be interested to save settings instead of state; i.e. save variables that the
user knows and changes explicitly (e.g. which JupyterLab theme to use). For that, you
will need another core token `ISettingRegistry` (see [that example](../settings/README.md)
for more information).
