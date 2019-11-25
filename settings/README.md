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
```

To see how we can access the settings, let's have a look at
`src/index.ts`.

```ts
// src/index.ts#L13-L17
```

The `ISettingRegistry` is passed to the `activate` function as an
argument (variable `settings`) in addition to the JupyterLab application
(variable `app`). You request that dependency with the property
`requires: [ISettingRegistry],`. It lists the additional arguments
you want to inject into the `activate` function in the `JupyterFontEndPlugin`.

But before going further, you need to define the settings of your
extension. This is done through a [JSON Schema](https://json-schema.org/understanding-json-schema/).
In the example it is called `schema/plugin.json`.

```json5
// schema/plugin.json
```

The naming of the file needs to follow a strict convention. When using
settings, your extension name must be structured as _package name_**:**_settings name_. The settings file must be named _settings name_. In the example, the extension name is:

```ts
// src/index.ts#L8-L8
```

Therefore the settings file is named `plugin.json`.

The folder containing the settings definition needs to be specified in
the `package.json` file in the `jupyterlab` section:

```json5
// package.json#L45-L48
```

And you should not forget to add it to the files of the package:

```json5
// package.json#L16-L20
```
