import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';
import { ILoggerRegistry, ITextLog } from '@jupyterlab/logconsole';
import { INotebookTracker } from '@jupyterlab/notebook';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Menu } from '@lumino/widgets';

const extension: JupyterFrontEndPlugin<void> = {
  id: 'log-messages',
  autoStart: true,
  requires: [IMainMenu, ILoggerRegistry, INotebookTracker],
  optional: [],
  activate: (
    app: JupyterFrontEnd,
    mainMenu: IMainMenu,
    loggerRegistry: ILoggerRegistry,
    nbtracker: INotebookTracker
  ) => {
    const { commands } = app;

    commands.addCommand('jlab-examples/log-messages:logTextMessage', {
      label: 'Text log message',
      caption: 'Custom text log message example.',
      execute: () => {
        const logger = loggerRegistry.getLogger(
          nbtracker.currentWidget?.context.path
        );
        console.log(logger);

        const msg: ITextLog = {
          type: 'text',
          level: 'info',
          data: 'Hello world text!!',
        };

        logger?.log(msg);
      },
    });

    // Create a new menu
    const menu: Menu = new Menu({ commands });
    menu.title.label = 'Log Messages Example';
    console.log(mainMenu);
    mainMenu.addMenu(menu, { rank: 80 });

    menu.addItem({ command: 'jlab-examples/log-messages:logTextMessage' });
  },
};

export default extension;
