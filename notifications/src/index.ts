import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { Notification } from '@jupyterlab/apputils';

import { PromiseDelegate, ReadonlyJSONValue } from '@lumino/coreutils';

/**
 * Initialization data for the @jupyterlab-examples/notifications extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/notifications:plugin',
  description: 'A JupyterLab extension example creating notifications.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    app.commands.addCommand('examples-notifications:notify', {
      label: 'Display notifications',
      execute: () => {
        // Create a success notification
        Notification.success('Congratulations, you created a notifications.');

        // Create an error notification with an action button
        Notification.error('Watch out something went wrong.', {
          actions: [
            { label: 'Help', callback: () => alert('This was a fake error.') }
          ],
          autoClose: 3000
        });

        // Create a notification waiting for an asynchronous task
        const delegate = new PromiseDelegate<ReadonlyJSONValue>();
        const delay = 2000;
        // The fake task is to wait for `delay`
        setTimeout(() => {
          // When resolving and rejecting the task promise, you
          // can provide a object that will be available to construct
          // the success and error message.
          delegate.resolve({ delay });
        }, delay);
        Notification.promise(delegate.promise, {
          // Message when the task is pending
          pending: { message: 'Waiting...', options: { autoClose: false } },
          // Message when the task finished successfully
          success: {
            message: (result: any) =>
              `Action successful after ${result.delay}ms.`
          },
          // Message when the task finished with errors
          error: { message: () => 'Action failed.' }
        });
      }
    });
  }
};

export default plugin;
