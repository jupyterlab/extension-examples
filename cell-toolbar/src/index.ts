import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';
import { markdownIcon, runIcon } from '@jupyterlab/ui-components';

const CommandIds = {
  /**
   * Command to render a markdown cell.
   */
  renderMarkdownCell: 'toolbar-button:render-markdown-cell',
  /**
   * Command to run a code cell.
   */
  runCodeCell: 'toolbar-button:run-code-cell'
};

/**
 * Initialization data for the @jupyterlab-examples/cell-toolbar extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/cell-toolbar:plugin',
  description: 'A JupyterLab extension to add cell toolbar buttons.',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, tracker: INotebookTracker) => {
    const { commands } = app;

    /* Adds a command enabled only on code cell */
    commands.addCommand(CommandIds.runCodeCell, {
      icon: runIcon,
      caption: 'Run a code cell',
      execute: () => {
        commands.execute('notebook:run-cell');
      },
      isVisible: () => tracker.activeCell?.model.type === 'code'
    });

    /* Adds a command enabled only on markdown cell */
    commands.addCommand(CommandIds.renderMarkdownCell, {
      icon: markdownIcon,
      caption: 'Render a markdown cell',
      execute: () => {
        commands.execute('notebook:run-cell');
      },
      isVisible: () => tracker.activeCell?.model.type === 'markdown'
    });
  }
};

export default plugin;
