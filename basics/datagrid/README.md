# Datagrid: a Fancy Phosphor Widget

![Datagrid](preview.png)

Jupyterlab is built on top of
[PhosphorJS](https://phosphorjs.github.io/). That library defines `Widget` as the primary interface brick. In this example [the datagrid phosphor example](http://phosphorjs.github.io/examples/datagrid/)
is integrated into JupyterLab.

First you need to import `StackedPanel`, `DataGrid`
and `DataModel` classes from phosphor:

```ts
// src/index.ts#L8-L10

import { DataGrid, DataModel } from '@phosphor/datagrid';

import { Menu, StackedPanel } from '@phosphor/widgets';
```

The `StackedPanel` widget can hold several sub-widgets that are added with its
`.addWidget` method. _Stacked_ means that the panel can be stacked in
the main area of JupyterLab as seen in the above screenshot. `DataModel`
is a class that provides the data that is displayed by the `DataGrid` widget.

> Note: to be able to import those classes, you will need to add their
> package as dependencies

```bash
jlpm add @phosphor/datagrid @phosphor/widgets
```

With these three classes, you can create your own widget, called `ExampleView` :

```ts
// src/index.ts#L47-L61

class ExampleView extends StackedPanel {
  constructor() {
    super();
    this.addClass('jp-example-view');
    this.id = 'example';
    this.title.label = 'Example View';
    this.title.closable = true;

    let model = new LargeDataModel();
    let grid = new DataGrid();
    grid.dataModel = model;

    this.addWidget(grid);
  }
}
```

Your widget is derived from `StackedPanel` to inherit its behavior. Then
some properties for the panel. Then the `DataGrid` widget and its associated model are created.
Finally the grid is inserted inside the panel.

The `DataModel` class is not used directly as its an abstract class.
Therefore in this example a class `LargeDataModel` is derived from it
to implement its abstract methods:

```ts
// src/index.ts#L63-L72

class LargeDataModel extends DataModel {
  rowCount(region: DataModel.RowRegion): number {
    return region === 'body' ? 1000000000000 : 2;
  }

  columnCount(region: DataModel.ColumnRegion): number {
    return region === 'body' ? 1000000000000 : 3;
  }

  data(region: DataModel.CellRegion, row: number, column: number): any {
```

The three abstract methods are `rowCount`, `columnCount` and `data`. The
first two must return a number from a region argument. To know the possible
values of `RowRegion` and the `ColumnRegion`, you can look at the [PhosphorJS
code](https://github.com/phosphorjs/phosphor/blob/9f5e11025b62d2c4a6fb59e2681ae1ed323dcde4/packages/datagrid/src/datamodel.ts#L112-L129):

```ts
/**
 * A type alias for the data model row regions.
 */
type RowRegion = 'body' | 'column-header';
/**
 * A type alias for the data model column regions.
 */
type ColumnRegion = 'body' | 'row-header';
/**
 * A type alias for the data model cell regions.
 */
type CellRegion = 'body' | 'row-header' | 'column-header' | 'corner-header';
```

The `|` can be read as or. This means that the `RowRegion` type is
either `body` or `column-header`.

So the `rowCount` and `columnCount` functions define a table with `2` header rows, with 3 index columns, with `1000000000000` rows and `1000000000000` columns.

Finally the `data` method of `LargeDataModel` class defines the data
values of the datagrid. In this case it simply displays the row and
column index in each cell, and adds a letter prefix in the header regions:

```ts
// src/index.ts#L72-L83

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
```
