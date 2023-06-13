import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ILoggerRegistry, ITextLog } from '@jupyterlab/logconsole';
import { INotebookTracker } from '@jupyterlab/notebook';

const extension: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/log-messages:plugin',
  description: 'A minimal JupyterLab example to develop a custom log-messages.',
  autoStart: true,
  requires: [ILoggerRegistry, INotebookTracker],
  activate: (
    app: JupyterFrontEnd,
    loggerRegistry: ILoggerRegistry,
    nbtracker: INotebookTracker
  ) => {
    const { commands } = app;
    commands.addCommand('jlab-examples/log-messages:logTextMessage', {
      label: 'Text log message',
      caption: 'Custom text log message example.',
      execute: () => {
        const logger = loggerRegistry.getLogger(
          nbtracker.currentWidget?.context.path || ''
        );
        console.log(logger);

        const msg: ITextLog = {
          type: 'text',
          level: 'info',
          data: 'Hello world text!!'
        };

        logger?.log(msg);
      }
    });
  }
};

export default extension;
