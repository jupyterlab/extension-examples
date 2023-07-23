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

The code is split into two parts:

1.  the JupyterLab plugin that activates all the extension components and connects
    them to the main _JupyterLab_ application via commands,
2.  `CustomConnector`, a lightweight source of mocked completion results.

The first part is contained in the `index.ts` file, the second is in `customconnector.ts`.

## Creating a custom DataConnector

`src/customconnector.ts` defines a `CustomConnector` to generate mock autocomplete suggestions. It implements _JupyterLab_'s interface [`ICompletionProvider`](https://github.com/jupyterlab/jupyterlab/blob/b279092d88de650ea36460689257e1b8e8a418bf/packages/completer/src/tokens.ts#L44) class.

The two methods which must be implemented in your `CustomConnector` from `ICompletionProvider` are `fetch` and `isApplicable`, which must be implemented in your `CustomConnector`.

```ts
// src/customconnector.ts#L25-L43

/**
 * Fetch completion requests.
 *
 * @param request - The completion request text and details.
 * @returns Completion reply
 */
fetch(
  request: CompletionHandler.IRequest,
  context: ICompletionContext
): Promise<CompletionHandler.ICompletionItemsReply> {
  const editor = context.editor;

  if (!editor) {
    return Promise.reject('No editor');
  }
  return new Promise<CompletionHandler.ICompletionItemsReply>(resolve => {
    resolve(Private.completionHint(editor!));
  });
}
```

This calls a private `completionHint` function, which uses the `CodeEditor.IEditor` widget to determine the token to suggest matches for.

```ts
// src/customconnector.ts#L74-L78

export function completionHint(
  editor: CodeEditor.IEditor
): CompletionHandler.ICompletionItemsReply {
  // Find the token at the cursor
  const token = editor.getTokenAtCursor();
```

A list of mock completion tokens is then created to return as `ICompletionItemsReply` response.

<!-- prettier-ignore-start -->
```ts
// src/customconnector.ts#L80-L99

// Create a list of matching tokens.
const tokenList = [
  { value: token.value + 'Magic', offset: token.offset, type: 'magic' },
  { value: token.value + 'Science', offset: token.offset, type: 'science' },
  { value: token.value + 'Neither', offset: token.offset }
];

// Only choose the ones that have a non-empty type field, which are likely to be of interest.
const completionList = tokenList.filter(t => t.type).map(t => t.value);
// Remove duplicate completions from the list
const matches = Array.from(new Set<string>(completionList));

const items = new Array<CompletionHandler.ICompletionItem>();
matches.forEach(label => items.push({ label }));

return {
  start: token.offset,
  end: token.offset + token.value.length,
  items
};
```
<!-- prettier-ignore-end -->

## Aggregating connector responses

[_JupyterLab_'s `CompletionManager`](https://github.com/jupyterlab/jupyterlab/blob/main/packages/completer/src/manager.ts) fetches and merges completion responses from `KernelConnector` and `ContextConnector` (https://github.com/jupyterlab/jupyterlab/blob/b279092d88de650ea36460689257e1b8e8a418bf/packages/completer-extension/src/index.ts#L29).
We add our new completer provider to it:

```ts
// src/index.ts#L23-L23

completionManager.registerProvider(new CustomCompleterProvider());
```

## Where to go next

Create a [server extension](../server-extension) to serve up custom completion matches.
