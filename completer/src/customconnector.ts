// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Modified from jupyterlab/packages/completer/src/contextconnector.ts

import { CodeEditor } from '@jupyterlab/codeeditor';
import {
  CompletionHandler,
  ICompletionContext,
  ICompletionProvider
} from '@jupyterlab/completer';

/**
 * A custom connector for completion handlers.
 */
export class CustomCompleterProvider implements ICompletionProvider {
  /**
   * The context completion provider is applicable on all cases.
   * @param context - additional information about context of completion request
   */
  async isApplicable(context: ICompletionContext): Promise<boolean> {
    return true;
  }

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

  readonly identifier = 'CompletionProvider:custom';
  readonly renderer = null;
}

/**
 * A namespace for custom connector statics.
 */
export namespace CustomConnector {
  /**
   * The instantiation options for cell completion handlers.
   */
  export interface IOptions {
    /**
     * The session used by the custom connector.
     */
    editor: CodeEditor.IEditor | null;
  }
}

/**
 * A namespace for Private functionality.
 */
namespace Private {
  /**
   * Get a list of mocked completion hints.
   *
   * @param editor Editor
   * @returns Completion reply
   */
  export function completionHint(
    editor: CodeEditor.IEditor
  ): CompletionHandler.ICompletionItemsReply {
    // Find the token at the cursor
    const token = editor.getTokenAtCursor();

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
  }
}
