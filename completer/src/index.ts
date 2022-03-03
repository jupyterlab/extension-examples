import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ICompletionProviderManager } from '@jupyterlab/completer';
import { CompletionProvider } from './provider';

/**
 * Initialization data for the extension.
 */
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

export default extension;
