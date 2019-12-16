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

    const command = 'examples:datagrid';
    commands.addCommand(command, {
      label: 'Datagrid example',
      caption: 'Open a datagrid panel',
      execute: () => {
        const widget = new ExampleView();
        shell.add(widget, 'main');
      }
    });
    palette.addItem({ command, category: 'Example' });

    const exampleMenu = new Menu({ commands });

    exampleMenu.title.label = 'Example';
    mainMenu.addMenu(exampleMenu, { rank: 80 });
    exampleMenu.addItem({ command });
  }
};

export default extension;

class ExampleView extends StackedPanel {
  constructor() {
    super();
    this.addClass('jp-example-view');
    this.id = 'example';
    this.title.label = 'Example View';
    this.title.closable = true;

    const model = new LargeDataModel();
    const grid = new DataGrid();
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
