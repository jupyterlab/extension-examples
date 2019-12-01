# Datagrid: a Fancy Phosphor Widget

Now let's do something a little more advanced. Jupyterlab is build on top of
Phosphor.js. Let's see if we can plug [this phosphor example](http://phosphorjs.github.io/examples/datagrid/)
into JupyterLab.

We start by importing the `Panel` widget and the `DataGrid` and `DataModel`
classes from phosphor:

```ts
// src/index.ts#L12-L14

import { StackedPanel } from '@phosphor/widgets';

import { DataGrid, DataModel } from '@phosphor/datagrid';
```

The Panel widget can hold several sub-widgets that are added with its
`.addWidget` method. `DataModel` is a class that provides the data that is
displayed by the `DataGrid` widget.

With these three classes, we adapt the `TutorialView` as follows:

```ts
// src/index.ts#L51-L65

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
```

That's rather easy. Let's now dive into the `DataModel` class that is taken
from the official phosphor.js example. The first few lines look like this:

```ts
// src/index.ts#L67-L74

class LargeDataModel extends DataModel {
  rowCount(region: DataModel.RowRegion): number {
    return region === 'body' ? 1000000000000 : 2;
  }

  columnCount(region: DataModel.ColumnRegion): number {
    return region === 'body' ? 1000000000000 : 3;
  }
```

While it is fairly obvious that `rowCount` and `columnCount` are supposed
to return some number of rows and columns, it is a little more cryptic what
the `RowRegion` and the `ColumnRegion` input arguments are. Let's have a
look at their definition in the phosphor.js source code:

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

The meaning of these lines might be obvious for experienced users of typescript
or Haskell. The `|` can be read as or. This means that the `RowRegion` type is
either `body` or `column-header`, explaining what the `rowCount` and
`columnCount` functions do: They define a table with `2` header rows, with 3
index columns, with `1000000000000` rows and `1000000000000` columns.

The remaining part of the LargeDataModel class defines the data values of the
datagrid. In this case it simply displays the row and column index in each
cell, and adds a letter prefix in case that we are in any of the header
regions:

```ts
// src/index.ts#L76-L87

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

Let's see how this looks like in Jupyterlab:

![Datagrid](preview.png)

[Click here for the final extension: datagrid](datagrid)
