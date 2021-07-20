# Custom Completer

> Provide a connector to customize tab completion results in a notebook.

- [Code structure](#code-structure)
- [Creating a custom connector](#creating-a-custom-connector)
- [Aggregating connector responses](#aggregating-connector-responses)
- [Disabling a JupyterLab plugin](#disabling-a-jupyterlab-plugin)
- [Asynchronous extension initialization](#asynchronous-extension-initialization)
- [Where to go next](#where-to-go-next)

![Custom completion](preview.png)

In this example, you will learn how to customize the behavior of JupyterLab notebooks' tab completion.

## Code structure

The code is split into three parts:

1.  the JupyterLab plugin that activates all the extension components and connects
    them to the main _JupyterLab_ application via commands,
2.  a custom `CompletionConnector`, adapted from [jupyterlab/packages/completer/src/connector.ts](https://github.com/jupyterlab/jupyterlab/blob/master/packages/completer/src/connector.ts),
    that aggregates completion results from three sources: _JupyterLab_'s existing `KernelConnector` and `ContextConnector`, plus...
3.  `CustomConnector`, a lightweight source of mocked completion results.

The first part is contained in the `index.ts` file, the second is in `connector.ts`, and the third is in `customconnector.ts`.

## Creating a custom DataConnector

`src/customconnector.ts` defines a `CustomConnector` to generate mock autocomplete suggestions. Like the `ContextConnector` it is based on, `CustomConnector` extends _JupyterLab_'s abstract [`DataConnector`](https://jupyterlab.readthedocs.io/en/latest/api/classes/statedb.dataconnector.html) class.

The only abstract method in `DataConnector` is `fetch`, which must be implemented in your `CustomConnector`.

```ts
// src/customconnector.ts#L28-L43

/**
 * Fetch completion requests.
 *
 * @param request - The completion request text and details.
 * @returns Completion reply
 */
fetch(
  request: CompletionHandler.IRequest
): Promise<CompletionHandler.IReply> {
  if (!this._editor) {
    return Promise.reject('No editor');
  }
  return new Promise<CompletionHandler.IReply>((resolve) => {
    resolve(Private.completionHint(this._editor));
  });
}
```

This calls a private `completionHint` function, which, like `ContextConnector`'s `contextHint` function, uses the `CodeEditor.IEditor` widget to determine the token to suggest matches for.

```ts
// src/customconnector.ts#L73-L78

export function completionHint(
  editor: CodeEditor.IEditor
): CompletionHandler.IReply {
  // Find the token at the cursor
  const cursor = editor.getCursorPosition();
  const token = editor.getTokenForPosition(cursor);
```

A list of mock completion tokens is then created to return as `matches` in the `CompletionHandler.IReply` response.

<!-- prettier-ignore-start -->
```ts
// src/customconnector.ts#L80-L97

// Create a list of matching tokens.
const tokenList = [
  { value: token.value + 'Magic', offset: token.offset, type: 'magic' },
  { value: token.value + 'Science', offset: token.offset, type: 'science' },
  { value: token.value + 'Neither', offset: token.offset },
];

// Only choose the ones that have a non-empty type field, which are likely to be of interest.
const completionList = tokenList.filter((t) => t.type).map((t) => t.value);
// Remove duplicate completions from the list
const matches = Array.from(new Set<string>(completionList));

return {
  start: token.offset,
  end: token.offset + token.value.length,
  matches,
  metadata: {},
};
```
<!-- prettier-ignore-end -->

## Aggregating connector responses

[_JupyterLab_'s `CompletionConnector`](https://github.com/jupyterlab/jupyterlab/blob/master/packages/completer/src/connector.ts) fetches and merges completion responses from `KernelConnector` and `ContextConnector`. The modified `CompletionConnector` in `src/connector.ts` is more general; given an array of `DataConnectors`, it can fetch and merge completion matches from every connector provided.

```ts
// src/connector.ts#L33-L50

/**
 * Fetch completion requests.
 *
 * @param request - The completion request text and details.
 * @returns Completion reply
 */
fetch(
  request: CompletionHandler.IRequest
): Promise<CompletionHandler.IReply> {
  return Promise.all(
    this._connectors.map((connector) => connector.fetch(request))
  ).then((replies) => {
    const definedReplies = replies.filter(
      (reply): reply is CompletionHandler.IReply => !!reply
    );
    return Private.mergeReplies(definedReplies);
  });
}
```

## Disabling a JupyterLab plugin

[_JupyterLab_'s completer-extension](https://github.com/jupyterlab/jupyterlab/tree/master/packages/completer-extension) includes a notebooks plugin that registers notebooks for code completion. Your extension will override the notebooks plugin's behavior, so you can [disable notebooks](https://jupyterlab.readthedocs.io/en/stable/extension/extension_dev.html#disabling-other-extensions) in your `.package.json`:

```json
// package.json#L75-L82
  "jupyterlab": {
    "extension": true,
    "schemaDir": "schema",
    "outputDir": "jupyterlab_examples_completer/labextension",
    "disabledExtensions": [
      "@jupyterlab/completer-extension:notebooks"
    ]
  }
```

## Asynchronous extension initialization

`index.ts` contains the code to initialize this extension. Nearly all of the code in `index.ts` is copied directly from the notebooks plugin.

Note that the extension commands you're overriding are unified into one namespace at the top of the file:

```ts
// src/index.ts#L20-L28

namespace CommandIDs {
  export const invoke = 'completer:invoke';

  export const invokeNotebook = 'completer:invoke-notebook';

  export const select = 'completer:select';

  export const selectNotebook = 'completer:select-notebook';
}
```

`index.ts` imports four connector classes, two from `JupyterLab`:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L6-L10

import {
  ContextConnector,
  ICompletionManager,
  KernelConnector,
} from '@jupyterlab/completer';
```
<!-- prettier-ignore-end -->

and two from this extension:

```ts
// src/index.ts#L14-L15

import { CompletionConnector } from './connector';
import { CustomConnector } from './customconnector';
```

Just like the notebooks plugin, when you update the handler for a notebook call `updateConnector`:

```ts
// src/index.ts#L73-L75

// Update the handler whenever the prompt or session changes
panel.content.activeCellChanged.connect(updateConnector);
panel.sessionContext.sessionChanged.connect(updateConnector);
```

which, unlike the notebooks plugin, instantiates `KernelConnector`, `ContextConnector`, and `CustomConnector`, then passes them to your modified `CompletionConnector`:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L57-L71

const updateConnector = () => {
  editor = panel.content.activeCell?.editor ?? null;
  options.session = panel.sessionContext.session;
  options.editor = editor;
  handler.editor = editor;

  const kernel = new KernelConnector(options);
  const context = new ContextConnector(options);
  const custom = new CustomConnector(options);
  handler.connector = new CompletionConnector([
    kernel,
    context,
    custom,
  ]);
};
```
<!-- prettier-ignore-end -->

## Where to go next

Create a [server extension](../server-extension) to serve up custom completion matches.
