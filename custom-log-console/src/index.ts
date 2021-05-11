import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer,
} from '@jupyterlab/application';
import {
  ICommandPalette,
  MainAreaWidget,
  WidgetTracker,
  CommandToolbarButton,
} from '@jupyterlab/apputils';
import {
  LoggerRegistry,
  LogConsolePanel,
  IHtmlLog,
  ITextLog,
  IOutputLog,
} from '@jupyterlab/logconsole';
import { addIcon, clearIcon, listIcon } from '@jupyterlab/ui-components';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Menu } from '@lumino/widgets';

import * as nbformat from '@jupyterlab/nbformat';

import LogLevelSwitcher from './logLevelSwitcher';

const extension: JupyterFrontEndPlugin<void> = {
  id: 'custom-log-console',
  autoStart: true,
  requires: [ICommandPalette, IRenderMimeRegistry, IMainMenu, ILayoutRestorer],
  optional: [],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    rendermime: IRenderMimeRegistry,
    mainMenu: IMainMenu,
    restorer: ILayoutRestorer
  ) => {
    const { commands } = app;

    let logConsolePanel: LogConsolePanel = null;
    let logConsoleWidget: MainAreaWidget<LogConsolePanel> = null;

    const tracker = new WidgetTracker<MainAreaWidget<LogConsolePanel>>({
      namespace: 'example-custom-log-console',
    });

    restorer.restore(tracker, {
      command: 'jlab-examples/custom-log-console:open',
      name: () => 'example-custom-log-console',
    });

    commands.addCommand('jlab-examples/custom-log-console:checkpoint', {
      execute: () => logConsolePanel?.logger?.checkpoint(),
      icon: addIcon,
      isEnabled: () => !!logConsolePanel && logConsolePanel.source !== null,
      label: 'Add Checkpoint',
    });
    commands.addCommand('jlab-examples/custom-log-console:clear', {
      execute: () => logConsolePanel?.logger?.clear(),
      icon: clearIcon,
      isEnabled: () => !!logConsolePanel && logConsolePanel.source !== null,
      label: 'Clear Log',
    });
    commands.addCommand('jlab-examples/custom-log-console:level', {
      execute: (args: any) => {
        if (logConsolePanel?.logger) {
          logConsolePanel.logger.level = args.level;
        }
      },
      isEnabled: () => !!logConsolePanel && logConsolePanel.source !== null,
      label: (args) => `Set Log Level to ${args.level as string}`,
    });

    const createLogConsoleWidget = (): void => {
      logConsolePanel = new LogConsolePanel(
        new LoggerRegistry({
          defaultRendermime: rendermime,
          maxLength: 1000,
        })
      );

      logConsolePanel.source = 'custom-log-console';

      logConsoleWidget = new MainAreaWidget<LogConsolePanel>({
        content: logConsolePanel,
      });
      logConsoleWidget.addClass('jp-LogConsole');
      logConsoleWidget.title.label = 'Custom Log console';
      logConsoleWidget.title.icon = listIcon;

      logConsoleWidget.toolbar.addItem(
        'checkpoint',
        new CommandToolbarButton({
          commands: app.commands,
          id: 'jlab-examples/custom-log-console:checkpoint',
        })
      );
      logConsoleWidget.toolbar.addItem(
        'clear',
        new CommandToolbarButton({
          commands: app.commands,
          id: 'jlab-examples/custom-log-console:clear',
        })
      );
      logConsoleWidget.toolbar.addItem(
        'level',
        new LogLevelSwitcher(logConsoleWidget.content)
      );

      logConsoleWidget.disposed.connect(() => {
        logConsoleWidget = null;
        logConsolePanel = null;
        commands.notifyCommandChanged();
      });

      app.shell.add(logConsoleWidget, 'main', { mode: 'split-bottom' });
      tracker.add(logConsoleWidget);

      logConsoleWidget.update();
      commands.notifyCommandChanged();
    };

    commands.addCommand('jlab-examples/custom-log-console:open', {
      label: 'Custom Log Console',
      caption: 'Custom log console example.',
      isToggled: () => logConsoleWidget !== null,
      execute: () => {
        if (logConsoleWidget) {
          logConsoleWidget.dispose();
        } else {
          createLogConsoleWidget();
        }
      },
    });

    palette.addItem({
      command: 'jlab-examples/custom-log-console:open',
      category: 'Examples',
    });

    commands.addCommand('jlab-examples/custom-log-console:logHTMLMessage', {
      label: 'HTML log message',
      caption: 'Custom HTML log message example.',
      execute: () => {
        const msg: IHtmlLog = {
          type: 'html',
          level: 'debug',
          data: '<div>Hello world HTML!!</div>',
        };

        logConsolePanel?.logger?.log(msg);
      },
    });

    commands.addCommand('jlab-examples/custom-log-console:logTextMessage', {
      label: 'Text log message',
      caption: 'Custom text log message example.',
      execute: () => {
        const msg: ITextLog = {
          type: 'text',
          level: 'info',
          data: 'Hello world text!!',
        };

        logConsolePanel?.logger?.log(msg);
      },
    });

    commands.addCommand('jlab-examples/custom-log-console:logOutputMessage', {
      label: 'Output log message',
      caption: 'Custom notebook output log message example.',
      execute: () => {
        const data: nbformat.IOutput = {
          output_type: 'display_data',
          data: {
            'text/plain': 'Hello world nbformat!!',
          },
        };

        const msg: IOutputLog = {
          type: 'output',
          level: 'warning',
          data,
        };

        logConsolePanel?.logger?.log(msg);
      },
    });

    // Create a new menu
    const menu: Menu = new Menu({ commands });
    menu.title.label = 'Log Console Example';
    mainMenu.addMenu(menu, { rank: 80 });

    // Button to open custom log console
    menu.addItem({ command: 'jlab-examples/custom-log-console:open' });
    menu.addItem({ type: 'separator' });

    // Buttons for the different examples
    menu.addItem({
      command: 'jlab-examples/custom-log-console:logHTMLMessage',
    });
    menu.addItem({
      command: 'jlab-examples/custom-log-console:logTextMessage',
    });
    menu.addItem({
      command: 'jlab-examples/custom-log-console:logOutputMessage',
    });
  },
};

export default extension;
