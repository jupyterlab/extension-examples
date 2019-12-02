# Widgets - Adding new Elements to the Main Window

We are going to do some real stuff and add a new tab to JupyterLab.
Visible elements such as tabs and notebooks are represented by widgets in the Phosphor library
that is the basis of the JupyterLab application.

![Custom Tab](preview.png)

#### A basic tab

The base widget class can be imported with:

```ts
// src/index.ts#L12-L12

import { Widget } from '@phosphor/widgets';
```

A Widget can be added to the main area through the main JupyterLab
application`app.shell`. Inside of our previous `activate` function, this looks
like this:

<!-- prettier-ignore-start -->
```ts
// src/index.ts#L21-L44

activate: (
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  mainMenu: IMainMenu
) => {
  const { commands, shell } = app;
  let command = 'ex3:labtutorial';
  let category = 'Tutorial';
  commands.addCommand(command, {
    label: 'Ex3 command',
    caption: 'Open the Labtutorial',
    execute: (args: any) => {
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
```
<!-- prettier-ignore-end -->

The custom widget `TutorialView` is straight-forward as well:

```ts
// src/index.ts#L49-L57

class TutorialView extends Widget {
  constructor() {
    super();
    this.addClass('jp-tutorial-view');
    this.id = 'tutorial';
    this.title.label = 'Tutorial View';
    this.title.closable = true;
  }
}
```

Note that we have used a custom css class that is defined in the file
`style/index.css` as:

<!-- embedme style/index.css -->

```css
.jp-tutorial-view {
  background-color: AliceBlue;
}
```

Our custom tab can be started in JupyterLab from the command palette.
