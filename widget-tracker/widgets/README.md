# Widgets

- [A basic tab](#a-basic-tab)

## Widgets: Adding new Elements to the Main Window

Finally we are going to do some real stuff and add a new tab to JupyterLab.
Visible elements such as a tab are represented by widgets in the phosphor
library that is the basis of the JupyterLab application.

#### A basic tab

The base widget class can be imported with:

```typescript
import { Widget } from '@phosphor/widgets';
```

A Widget can be added to the main area through the main JupyterLab
application`app.shell`. Inside of our previous `activate` function, this looks
like this:

```
    activate: (
        app: JupyterLab,
        palette: ICommandPalette,
        mainMenu: IMainMenu) =>
    {
        const { commands, shell } = app;
        let command = 'ex3:labtutorial';
        let category = 'Tutorial';
        commands.addCommand(command, {
            label: 'Ex3 command',
            caption: 'Open the Labtutorial',
            execute: (args) => {
                const widget = new TutorialView();
                shell.addToMainArea(widget);}});
        palette.addItem({command, category});

        let tutorialMenu: Menu = new Menu({commands});

        tutorialMenu.title.label = 'Tutorial';
        mainMenu.addMenu(tutorialMenu, {rank: 80});
        tutorialMenu.addItem({ command });
    }
```

The custom widget `TutorialView` is straight-forward as well:

```typescript
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

```
.jp-tutorial-view {
    background-color: AliceBlue;
}
```

Our custom tab can be started in JupyterLab from the command palette and looks
like this:

![Custom Tab](_images/custom_tab.png)

[Click here for the final extension: 3_widgets](widgets)
