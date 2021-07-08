# Custom Completer

> Provide a connector to customize tab completion results in a notebook.

- [Code structure](#code-structure)
- [Creating a custom connector](#creating-a-custom-connector)
- [Aggregating connector responses](#aggregating-connector-responses)
- [Asynchronous extension initialization](#asynchronous-extension-initialization)
- [Make it run](#make-it-run)
- [Where to go next](#where-to-go-next)

![Custom completion](preview.png)

In this example, you will learn how to customize the behavior of JupyterLab notebooks' tab completion.

## Code structure

The code is split into three parts:

1.  the JupyterLab plugin that activates all the extension components and connects
    them to the main _JupyterLab_ application via commands,
2.  a custom CompletionConnector, adapted from jupyterlab/packages/completer/src/connector.ts,
    that aggregates completion results from three sources: _JupyterLab_'s existing KernelConnector and ContextConnector, plus...
3.  CustomConnector, a lightweight source of mocked completion results.

The first part is contained in the `index.ts` file, the second is in `connector.ts`, and the third is in `customconnector.ts`.

## Creating a custom DataConnector

- `CustomConnector` extends `DataConnector`
- must implement `fetch` method
- try changing the behavior of `contextHint` function

## Aggregating connector responses

- `CompletionConnector` extends `DataConnector`
- again, must implement `fetch` method
- accepts an array of `DataConnector`s, fetches matches from each connector provided
- try changing the behavior of `mergeReplies` function

## Asynchronous extension initialization

`index.ts` contains the code to initialize the extension.

First, it is a good practice to unify the extension commands into one namespace at the top of the file:

```ts
// src/index.ts#L30-L38

namespace CommandIDs {
  export const invoke = 'completer:invoke';

  export const invokeNotebook = 'completer:invoke-notebook';

  export const select = 'completer:select';

  export const selectNotebook = 'completer:select-notebook';
}
```

// TODO@RE

## Make it run

// TODO@RE

## Where to go next

// TODO@RE
