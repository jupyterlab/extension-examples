import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { IMainMenu } from '@jupyterlab/mainmenu';

import {
  ITranslator,
  nullTranslator,
  TranslationBundle,
} from '@jupyterlab/translation';

import { DataGrid, DataModel } from '@lumino/datagrid';

import { Menu, StackedPanel } from '@lumino/widgets';

/**
 * Initialization data for the extension1 extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'datagrid',
  autoStart: true,
  requires: [ICommandPalette, IMainMenu, ITranslator],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    mainMenu: IMainMenu,
    translator: ITranslator
  ) => {
    const { commands, shell } = app;
    const trans = translator.load('jupyterlab');

    const command = 'examples:datagrid';
    commands.addCommand(command, {
      label: trans.__('Open a Datagrid'),
      caption: trans.__('Open a Datagrid Panel'),
      execute: () => {
        const widget = new DataGridPanel();
        shell.add(widget, 'main');
      },
    });
    palette.addItem({ command, category: 'Extension Examples' });

    const exampleMenu = new Menu({ commands });

    exampleMenu.title.label = trans.__('DataGrid Example');
    mainMenu.addMenu(exampleMenu, { rank: 80 });
    exampleMenu.addItem({ command });
  },
};

export default extension;

class DataGridPanel extends StackedPanel {
  constructor(translator?: ITranslator) {
    super();
    this._translator = translator || nullTranslator;
    this._trans = this._translator.load('jupyterlab');

    this.addClass('jp-example-view');
    this.id = 'datagrid-example';
    this.title.label = this._trans.__('Datagrid Example View');
    this.title.closable = true;

    const model = new LargeDataModel();
    const grid = new DataGrid();
    grid.dataModel = model;

    this.addWidget(grid);
  }

  private _translator: ITranslator;
  private _trans: TranslationBundle;
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
