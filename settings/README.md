# Using Settings in an Extension

This example shows how to create and use settings
in a JupyterLab extension.

The core token required for handling the settings is
`ISettingRegistry` ([documentation](https://jupyterlab.github.io/jupyterlab/coreutils/modules/isettingregistry.html)). To use it,
you first need to install its npm package:

```bash
jlpm add @jupyterlab/coreutils
```

Once this is done. You can import the interface in your code.

```ts
// src/index.ts#L6-L6

import { ISettingRegistry } from '@jupyterlab/coreutils';
```

To see how we can access the settings, let's have a look at
`src/index.ts`.

```ts
// src/index.ts#L13-L17

const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settings: ISettingRegistry) => {
```

The `ISettingRegistry` is passed to the `activate` function as an
argument (variable `settings`) in addition to the JupyterLab application
(variable `app`). You request that dependency with the property
`requires: [ISettingRegistry],`. It lists the additional arguments
you want to inject into the `activate` function in the `JupyterFontEndPlugin`.

But before going further, you need to define the settings of your
extension. This is done through a [JSON Schema](https://json-schema.org/understanding-json-schema/).
In the example it is called `schema/plugin.json`.

<!-- prettier-ignore-start -->
```json5
// schema/plugin.json

{
  "title": "My settings",
  "description": "Settings of the settings example.",
  "type": "object",
  "properties": {
    "limit": {
      "type": "integer",
      "title": "Limit",
      "description": "This is an example of an integer setting.",
      "default": 25
    },
    "flag": {
      "type": "boolean",
      "title": "Simple flag",
      "description": "This is an example of a boolean setting.",
      "default": false
    }
  }
}

```
<!-- prettier-ignore-end -->

The _title_ is the entry shown in the JupyterLab Advanced Settings. The
_description_ entry is a more detail explanation of the extension using
those settings. The _type_ is a mandatory key require by [JSON Schema](https://json-schema.org/understanding-json-schema/reference/type.html).
For all extensions, this will be an `object` as the settings are defined
by a _dictionary_. Then the most important entry is `properties` describing a mapping of _setting id_ and the associated properties.

The naming of the file needs to follow a strict convention. When using
settings, your extension name must be structured as _package name_**:**_settings name_. The settings file must be named _settings name_. In the example, the extension name is:

```ts
// src/index.ts#L8-L8

const PLUGIN_ID = 'settings:plugin';
```

Therefore the settings file is named `plugin.json`.

The folder containing the settings definition needs to be specified in
the `package.json` file in the `jupyterlab` section (here `schema`):

<!-- prettier-ignore-start -->
```json5
// package.json#L45-L48

"jupyterlab": {
  "extension": true,
  "schemaDir": "schema"
}
```
<!-- prettier-ignore-end -->

And you should not forget to add it to the files of the package:

```json5
// package.json#L16-L20

"files": [
  "lib/**/*.{d.ts,eot,gif,html,jpg,js,js.map,json,png,svg,woff2,ttf}",
  "schema/**/*.json",
  "style/**/*.{css,eot,gif,html,jpg,json,png,svg,woff2,ttf}"
],
```

Now that the settings are defined and included in the package, you can
use it inside your extension. Let's look at this example:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L17-L48

activate: (app: JupyterFrontEnd, settings: ISettingRegistry) => {
  let limit = 25;
  let flag = false;

  function loadSetting(setting: ISettingRegistry.ISettings) {
    // Read the settings and convert to the correct type
    limit = setting.get('limit').composite as number;
    flag = setting.get('flag').composite as boolean;

    console.log(`Limit is set to ${limit} and flag to ${flag}`);
  }

  // Wait for the application to be restored
  app.restored
    // Load the settings for this plugin
    .then(() => settings.load(PLUGIN_ID))
    .then(setting => {
      // Read the settings
      loadSetting(setting);

      // Listen for settings changes using Signal
      setting.changed.connect(loadSetting);

      // Programmatically change a setting
      return setting.set('limit', 20);
    })
    .catch(reason => {
      console.error(
        `Something went wrong when reading the settings.\n${reason}`
      );
    });
}
```
<!-- prettier-ignore-end -->

First, the extension waits for the application to be restored before
loading the settings for your plugin:

```ts
// src/index.ts#L32-L32

.then(() => settings.load(PLUGIN_ID))
```

Then once the settings are loaded, each setting can be read using
the `get` method and the _setting id_ (the key defined in the settings
JSON file). After getting the setting, you need to require the
`composite` attribute to get its value and specify the type explicitly.

```ts
// src/index.ts#L21-L27

function loadSetting(setting: ISettingRegistry.ISettings) {
  // Read the settings and convert to the correct type
  limit = setting.get('limit').composite as number;
  flag = setting.get('flag').composite as boolean;

  console.log(`Limit is set to ${limit} and flag to ${flag}`);
}
```

To react at a setting change by the user, you should use the signal
`changed`. In this case, when that signal is emitted the function
`loadSetting` is called with the new settings.

```ts
// src/index.ts#L37-L38

// Listen for settings changes using Signal
setting.changed.connect(loadSetting);
```

Finally, in this example, a setting is changed programmatically. This
use case can be interesting for example if some dialogs ask new values.

```ts
// src/index.ts#L40-L41

// Programmatically change a setting
return setting.set('limit', 20);
```

Note

> This example uses [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
> This is a technology to handle asynchronous action like reading
> the settings in this example. So have a look at that [tutorial](https://scotch.io/tutorials/javascript-promises-for-dummies)
> if you want to know more about the `then`/`catch` used here.

## Where to Go Next

This example makes use of the _Signal_ concept used in JupyterLab. To
get more information about the signals, you can look at the [signal
example](../basics/signals/README.md).
