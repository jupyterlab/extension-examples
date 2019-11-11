import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from "@jupyterlab/application";

import { ICommandPalette } from "@jupyterlab/apputils";

import { ILauncher } from "@jupyterlab/launcher";

import { IMainMenu } from "@jupyterlab/mainmenu";

import { IRenderMimeRegistry } from "@jupyterlab/rendermime";

import { Menu } from "@phosphor/widgets";

import { TutorialPanel } from "./panel";

import "../style/index.css";

/**
 * The command IDs used by the console plugin.
 */
namespace CommandIDs {
  export const create = "Ex4a:create";

  export const execute = "Ex4a:execute";
}

/**
 * Initialization data for the extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: "kernel_output",
  autoStart: true,
  requires: [ICommandPalette, ILauncher, IMainMenu, IRenderMimeRegistry],
  activate: activate
};

function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  launcher: ILauncher,
  mainMenu: IMainMenu,
  rendermime: IRenderMimeRegistry
) {
  const manager = app.serviceManager;
  const { commands, shell } = app;
  let category = "Tutorial";

  let panel: TutorialPanel;

  function createPanel() {
    return manager.ready
      .then(() => {
        panel = new TutorialPanel(manager, rendermime);
        return panel.session.ready;
      })
      .then(() => {
        shell.add(panel, "main");
        return panel;
      });
  }

  // add menu tab
  let tutorialMenu: Menu = new Menu({ commands });
  tutorialMenu.title.label = "Tutorial";
  mainMenu.addMenu(tutorialMenu);

  // add commands to registry
  let command = CommandIDs.create;
  commands.addCommand(command, {
    label: "Ex7: open Panel",
    caption: "Open the Labtutorial Extension",
    execute: createPanel
  });

  command = CommandIDs.execute;
  commands.addCommand(command, {
    label: "Ex4a: show dataframe",
    caption: "show dataframe",
    execute: async () => {
      await createPanel();
      panel.execute("df");
    }
  });

  // add items in command palette and menu
  [CommandIDs.create, CommandIDs.execute].forEach(command => {
    palette.addItem({ command, category });
    tutorialMenu.addItem({ command });
  });

  // Add launcher
  launcher.add({
    command: CommandIDs.create,
    category: category
  });

}

export default extension;
