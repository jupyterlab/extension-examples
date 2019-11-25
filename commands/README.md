# Commands: Extending the main app

One major concept of the phosphorjs library on which JupyterLab is built is
the notion of _Commands_. They are functions stored in a registry (under an unique
specifier) that can be executed from any piece of code having accessed to that
registry. And in particular, they can be attached to a menu item, a launcher
card or the command palette to be easily triggered by the user.

It is quite common for extension to define one or more such a command.

In this extension, we are going to add a command to the application command registry.

The registry has `CommandRegistry` type ([documentation](https://phosphorjs.github.io/phosphor/api/commands/classes/commandregistry.html)).

To see how we access the application command registry, open the file `src/index.ts`.

```ts
// src/index.ts#L9-L33

const extension: JupyterFrontEndPlugin<void> = {
  id: 'commands',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    const { commands } = app;

    let command = 'tutorial:command';

    // Add a command
    commands.addCommand(command, {
      label: 'Call tutorial:command',
      caption: 'Execute tutorial:command',
      execute: (args: any) => {
        console.log(`tutorial:command has been called ${args['origin']}.`);
      }
    });

    // Call the command execution
    commands.execute(command, { origin: 'from init' }).catch(reason => {
      console.error(
        `An error occurs during the execution of tutorial:command.\n${reason}`
      );
    });
  }
};
```

The CommandRegistry is an attribute of the main JupyterLab application
(variable `app` in the previous snippet). It has an `addCommand` method that
adds our own function. That method takes two arguments: the unique command id
and [options](https://phosphorjs.github.io/phosphor/api/commands/interfaces/commandregistry.icommandoptions.html) for the command.

The only mandatory option is `execute`, this takes the function to be called
when the command is executed. It can optionally takes arguments (arbitrarly defined
by the developer).

To execute that command, you only need access to the _Commands Registry_ in any other
parts of application. Then you will need to call the `execute` method of the registry
with the unique command id and optionnally the arguments.

```ts
// src/index.ts#L27-L31

commands.execute(command, { origin: 'from init' }).catch(reason => {
  console.error(
    `An error occurs during the execution of tutorial:command.\n${reason}`
  );
});
```

When running JupyterLab with this extension active, the following message should
appears in the web browser console:

```
tutorial:command has been called from init.
```

## Where to Go Next

- Add the command to the [command palette](../../command-palette/README.md)
- Add the command to a [menu](../../main-menu/README.md)
- Add the command to a [context menu](../../context-menu/README.md)
- Add the command to the [launcher](../../launcher/README.md)
