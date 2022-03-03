// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { CodeEditor } from '@jupyterlab/codeeditor';
import {
  Completer,
  CompletionHandler,
  ICompletionContext,
  ICompletionProvider,
} from '@jupyterlab/completer';

export class CompletionProvider implements ICompletionProvider {
  /**
   * The custom completion provider is applicable only if the editor is available.
   * @param context - additional information about context of completion request
   */
  async isApplicable(context: ICompletionContext): Promise<boolean> {
    if (!context.editor) {
      return false;
    }
    return true;
  }
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

  /**
   * The completer manager will use this method to lazy-load missing contents.
   * In this example we will provide the content for the documentation panel.
   */
  async resolve(
    item: CompletionHandler.ICompletionItem,
    context: ICompletionContext,
    patch?: Completer.IPatch | null
  ): Promise<CompletionHandler.ICompletionItem> {
    item.documentation = `This is the documentation for ${item.label}`;
    return item;
  }

  readonly identifier = 'completerProviderExampler';
  readonly renderer: Completer.IRenderer | null | undefined = null;
}

/**
 * A namespace for Private functionality.
 */
namespace Private {
  /**
   * Get a list of mocked completion hints.
   *
   * @param editor Editor
   * @returns completion reply
   */
  export function completionHint(
    editor: CodeEditor.IEditor
  ): CompletionHandler.ICompletionItemsReply {
    // Find the token at the cursor
    const cursor = editor.getCursorPosition();
    const token = editor.getTokenForPosition(cursor);

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
}
