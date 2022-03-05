# Custom Completer

> Provide a connector to customize tab completion results in a notebook.

- [Code structure](#code-structure)
- [ Creating a provider for completer widget](#creating-a-provider-for-completer-widget)
- [Extension initialization](#extension-initialization)
- [Where to go next](#where-to-go-next)

![Custom completion](preview.png)

In this example, you will learn how to customize the behavior of JupyterLab notebooks' tab completion.

## Code structure

The code is split into two parts:

1.  A JupyterLab plugin that instantiates a completer provider and registers it to the completer provider manager of JupyterLab,
2.  A provider that generates the autocomplete suggestions and documentation for the JupyterLab completer widget.

The first part is implemented in the `index.ts` file and the second is in `provider.ts`.

## Creating a provider for completer widget

`src/provider.ts` defines a `CompletionProvider` class to generate mock autocomplete suggestions and documentation. A code completion provider needs to implement [`ICompletionProvider`](https://jupyterlab.readthedocs.io/en/latest/api/interfaces/completer.ICompletionProvider.html) interface.

### The minimum requirement for a provider.

The following methods/properties are required, which must be implemented in your `CompletionProvider`.

- `identifier`: the unique identifier of your provider, if another provider with the same `identifier` is already registered, JupyterLab will ignore your provider.

```ts
// src/provider.ts#L48

   readonly identifier = 'completerProviderExampler';
```

- `renderer`: the custom renderer for provider's completion items. By setting it to `null`, this provider will use the default renderer of JypyterLab.

```ts
// src/provider.ts#L49

   readonly renderer:  Completer.IRenderer  |  null  |  undefined  =  null;
```

- `isApplicable`: this method is used to check if your completion provider applies to the current context. For this example, the current provider is only applicable if the editor is available.

```ts
// src/provider.ts#L13-L22

  /**
   * The custom completion provider is applicable only if the editor is available.
   * @param context - additional information about the context of completion request
   */
  async isApplicable(context: ICompletionContext): Promise<boolean> {
    if (!context.editor) {
      return false;
    }
    return true;
  }
```

- `fetch`: Generate the completion response from the completion request and the current context

```ts
// src/provider.ts#L23-L33

  /**
   * Fetch completion requests.
   *
   * @param request - The completion request text and details.
   */
  async fetch(
    request: CompletionHandler.IRequest,
    context: ICompletionContext
  ): Promise<CompletionHandler.ICompletionItemsReply> {
    return Private.completionHint(context.editor!);
  }
```

This method needs to return the response which matches the [`CompletionHandler.ICompletionItemsReply`](https://jupyterlab.readthedocs.io/en/latest/api/interfaces/completer.CompletionHandler.ICompletionItemsReply.html) interface.
This response can come from any kind of source, in this example, it calls a private `completionHint` function, which uses the `CodeEditor.IEditor` widget to determine the token to suggest matches for.

```ts
// src/customconnector.ts#L62-L67

export function completionHint(
  editor: CodeEditor.IEditor
): CompletionHandler.ICompletionItemsReply {
  // Find the token at the cursor
  const cursor = editor.getCursorPosition();
  const token = editor.getTokenForPosition(cursor);
```

A list of mock completion items is then created to return as `items` in the `CompletionHandler.ICompletionItemsReply` response.

<!-- prettier-ignore-start -->
```ts
// src/customconnector.ts#L80-L97

    // Create a list of matching tokens.
    const items = [
      { label: token.value + 'Magic', type: 'function' },
      { label: token.value + 'Science', type: 'instance' },
      { label: token.value + 'Neither' },
    ];

    return {
      start: token.offset,
      end: token.offset + token.value.length,
      items,
    };
  }
```
<!-- prettier-ignore-end -->

### Lazy load missing contents of completion responses

The optional `resolve` method of a completer provider can be used to lazy-load the missing contents of a completion item. When an item is highlighted for the first time, `resolve` is invoked and users can fetch the missing data for this item. In this example, we will provide the content for the documentation panel by using this method.

```ts
// src/connector.ts#L39-L46

  async resolve(
    item: CompletionHandler.ICompletionItem,
    context: ICompletionContext,
    patch?: Completer.IPatch | null
  ): Promise<CompletionHandler.ICompletionItem> {
    item.documentation = `This is the documentation for ${item.label}`;
    return item;
  }
```

## Extension initialization

`index.ts` contains the code to initialize this extension. We only need to require the `ICompletionProviderManager` token and register our provider `CompletionProvider` with this token.

```ts
// src/index.ts#L12-L23

const extension: JupyterFrontEndPlugin<void> = {
  id: 'extension-example:completer',
  autoStart: true,
  requires: [ICompletionProviderManager],
  activate: (
    app: JupyterFrontEnd,
    completionManager: ICompletionProviderManager
  ) => {
    console.log('JupyterLab custom completer extension is activated!');
    completionManager.registerProvider(new CompletionProvider());
  },
};
```

<!-- prettier-ignore-end -->

## Where to go next

Create a [server extension](../server-extension) to serve up custom completion matches.
