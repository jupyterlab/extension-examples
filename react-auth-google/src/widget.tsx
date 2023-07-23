import { ReactWidget } from '@jupyterlab/ui-components';

import React from 'react';
// import React, { useState } from 'react';

import GoogleAuthGIS from './components/auth/GoogleAuthGIS';

export class AuthGoogleWidget extends ReactWidget {
  /**
   * Constructs a new AuthGoogleWidget.
   */
  constructor() {
    super();
    this.addClass('jp-react-auth-google');
  }

  render(): JSX.Element {
    return (
      <>
        <div>
          <GoogleAuthGIS />
        </div>
      </>
    );
  }
}
