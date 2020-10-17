/// <reference path="../../../node_modules/@jupyterlab/codemirror/typings/codemirror/codemirror.d.ts" />

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICodeMirror } from '@jupyterlab/codemirror';

import CodeMirror from 'codemirror';

/**
 * CodeMirror mode info
 */
export const modeInfo: typeof CodeMirror.modeInfo[0] = {
  ext: ['jupyterlab-example'],
  mime: 'text/x-jupyterlab-example',
  mode: 'jupyterlab-examples-simple-mode',
  name: 'JupyterLab Example Mode'
};

/**
 * State names used in simple mode. (optional)
 */
export type S = 'start' | 'comment';

/**
 * Tokens used in simple mode. (optional)
 *
 * ### Note
 * Tokens are turned into DOM nodes with classes, e.g. `.cm-comment`.
 * The default theme has a good baseline of tokens with broad support, and
 * start with `.cm-s-default`
 *
 *   https://github.com/codemirror/CodeMirror/blob/master/lib/codemirror.css
 *
 * Some popular themes support a number of additional tokens:
 *
 *   https://github.com/codemirror/CodeMirror/blob/master/theme/darcula.css
 */
export type T = 'tag' | 'comment' | 'atom' | 'meta';

/**
 * Simple mode states from CodeMirror demo:
 *
 *   https://codemirror.net/demo/simplemode.html
 *
 * Uses the optional [S]tates and [T]okens for better completion and linting.
 */
export const STATES: CodeMirror.TSimpleTopState<S, T> = {
  start: [
    { regex: /#(.*)/, token: 'comment' },
    { regex: /Jupyter/i, token: 'tag' },
    { regex: /Lab/i, token: 'atom' },
    { regex: /CodeMirror/i, token: 'meta' }
  ]
};

console.error('woopwooop', STATES);

/**
 * Initialization data for the @jupyterlab-examples/codemirror-simple-mode extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/codemirror-simple-mode',
  autoStart: true,
  requires: [ICodeMirror],
  activate: (app: JupyterFrontEnd, { CodeMirror }: ICodeMirror) => {
    CodeMirror.defineSimpleMode(modeInfo.mode, STATES);
    CodeMirror.defineMIME(modeInfo.mime, modeInfo.mode);
    CodeMirror.modeInfo.push(modeInfo);
  }
};

export default extension;
