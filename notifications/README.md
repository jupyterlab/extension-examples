# Notifications

> Send notifications to the users.

![notifications](./preview.gif)

You can send notifications of events to the user through _Notifications_. For that you will need to import the `Notification` namespace from the package `@jupyterlab/apputils`.

```ts
// src/index.ts#L6-L6

import { Notification } from '@jupyterlab/apputils';
```

It does not use the token system (aka the dependency injection system) to avoid to pass the notification object through your components tree.

> Note: The user interface to display the notifications is a specific plugin 
> that can be disable or overridden by extensions.

The [Notification]() namespace provides helpers to quickly display message
of a specific type like success, error, warning,... .

In this example, three notifications are emitted.

The first notification has type success. 

```ts
// src/index.ts#L21-L22

// Create a success notification
Notification.success('Congratulations, you created a notifications.');
```

It won't be displayed to the user
directly but the notification status (bell icon on the bottom right) will
be highlighted to inform the user a new notification is available.

The second notification has a type error.

```ts
// src/index.ts#L24-L30

// Create an error notification with an action button
Notification.error('Watch out something went wrong.', {
  actions: [
    { label: 'Help', callback: () => alert('This was a fake error.') }
  ],
  autoClose: 3000
});
```

It will be displayed but only
for 3000ms. Then it will be automatically hidden. But the user will be able
to display it by opening the notification center.
That notification defines an action. This will create a button
with the `label` that triggers the callback when clicked.

The last notification will displayed a in-progress message that
will be updated to a success or error message depending on the
result of the tracked promise.

```ts
// src/index.ts#L32-L51

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
    message: (result: any) => `Action successful after ${result.delay}ms.`
  },
  // Message when the task finished with errors
  error: { message: () => 'Action failed.' }
});
```

The task promise can return an object that will be passed to the message
function to construct the success and the error message.
