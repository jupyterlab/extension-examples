import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';
import { IMainMenu } from '@jupyterlab/mainmenu';

import { DataGrid, DataModel } from '@phosphor/datagrid';

import { Menu, StackedPanel } from '@phosphor/widgets';

/**
 * Initialization data for the extension1 extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'datagrid',
  autoStart: true,
  requires: [ICommandPalette, IMainMenu],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    mainMenu: IMainMenu
  ) => {
    const { commands, shell } = app;
    let command = 'examples:datagrid';
    let category = 'Tutorial';
    commands.addCommand(command, {
      label: 'Datagrid example',
      caption: 'Open a datagrid panel',
      execute: () => {
        const widget = new TutorialView();
        shell.add(widget, 'main');
      }
    });
    palette.addItem({ command, category });

    let tutorialMenu: Menu = new Menu({ commands });

    tutorialMenu.title.label = 'Tutorial';
    mainMenu.addMenu(tutorialMenu, { rank: 80 });
    tutorialMenu.addItem({ command });
  }
};

export default extension;

class TutorialView extends StackedPanel {
  constructor() {
    super();
    this.addClass('jp-tutorial-view');
    this.id = 'tutorial';
    this.title.label = 'Tutorial View';
    this.title.closable = true;

    let model = new LargeDataModel();
    let grid = new DataGrid();
    grid.dataModel = model;

    this.addWidget(grid);
  }
}

class LargeDataModel extends DataModel {
  rowCount(region: DataModel.RowRegion): number {
    return region === 'body' ? 1000000000000 : 2;
  }

  columnCount(region: DataModel.ColumnRegion): number {
    return region === 'body' ? 1000000000000 : 3;
  }

  data(region: DataModel.CellRegion, row: number, column: number): any {
    if (region === 'row-header') {
      return `R: ${row}, ${column}`;
    }
    if (region === 'column-header') {
      return `C: ${row}, ${column}`;
    }
    if (region === 'corner-header') {
      return `N: ${row}, ${column}`;
    }
    return `(${row}, ${column})`;
  }
}
