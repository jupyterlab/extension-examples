// import logo from './google-logo.png';

import { useEffect, useState } from 'react';
import useExternalScript from '../../generic/useExternalScript';
import CountdownTimer from '../countdown/CountdownTimer';
import * as store from './ioStorage';

import React from 'react';
import { sleep } from '../../generic/util';
import { AuthConfig } from './AuthConfig';
import { IConfig, ITokenData, ITokenResponse } from './interface';

declare global {
  interface Window {
    debug: any;
    tokenData: any;
  }
}

const GoogleGIS = () => {
  const urlGIS = 'https://accounts.google.com/gsi/client';

  let client: google.accounts.oauth2.TokenClient;

  useExternalScript(urlGIS);

  const [tokenData, setTokenData] = useState({} as ITokenData);
  const [config, setConfig] = useState({} as IConfig);
  const [expDatetime, setExpDatetime] = useState(new Date().getTime());
  const [isConfigReady, setIsConfigReady] = useState(false);

  const readTokenDataFromStorage = async (): Promise<ITokenData> => {
    const tokenData: ITokenData = await store.readTokenDataFromIndexedDB();
    return tokenData;
  };

  const writeTokenDataToStorage = async (tokenData: ITokenData) => {
    console.log('write to storage:');
    console.log(tokenData);

    await store.writeTokenDataToIndexedDB(tokenData);
  };

  const fetchToken = (prompt: string = '') => {
    client.requestAccessToken({ prompt });
  };

  const isTokenValid = (tokenData: ITokenData): boolean => {
    const exp_date = tokenData.exp_date;
    const now = new Date();
    const valid = now < exp_date;
    console.log(valid);
    return valid;
  };

  const buildTokenData = (
    tokenResponse: google.accounts.oauth2.TokenResponse
  ): ITokenData => {
    const tokenResp = tokenResponse as unknown as ITokenResponse;
    const tokenData = {
      ...tokenResp,
      get_date: new Date(),
      exp_date: new Date(Date.now() + tokenResp.expires_in * 1000)
    };
    return tokenData;
  };

  const buildGoogleAuthClient = async (
    client_id: string,
    scope: string
  ): Promise<google.accounts.oauth2.TokenClient> => {
    while (!window?.google?.accounts?.oauth2) {
      console.log('waiting');
      await sleep(200);
    }
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id,
      scope,
      callback: async tokenResponse => {
        const _tokenData = buildTokenData(tokenResponse);
        setExpDatetime(_tokenData.exp_date.getTime());
        await writeTokenDataToStorage(_tokenData);
        setTokenData(_tokenData);
      }
    });
    return client;
  };

  const loadConfig = async () => {
    console.log('loadConfig');
    const data = (await store.readConfigFromIndexedDB()) || {
      client_id: null,
      scope: null
    };
    console.log(data);
    setConfig(data);

    let client_id: string;
    let scope: string;

    client_id = data.client_id || '';
    scope = data.scope || '';

    return { client_id, scope };
  };

  const initAuth = async (force: boolean = false) => {
    console.log('start InitAuth');

    const { client_id, scope } = await loadConfig();

    if (client_id === '' || scope === '') {
      console.log('missing config');
      return;
    }
    setIsConfigReady(true);
    client = await buildGoogleAuthClient(client_id, scope);

    window.debug = client;
    window.tokenData = tokenData;

    console.log('client');
    console.log(client);

    const _tokenData = await readTokenDataFromStorage();
    console.log(_tokenData);
    if (_tokenData && !force) {
      if (isTokenValid(_tokenData)) {
        setTokenData(_tokenData);
        setExpDatetime(_tokenData.exp_date.getTime());
      } else {
        fetchToken();
      }
    } else {
      fetchToken();
    }
  };

  const copyToken = async () => {
    const tokenData: ITokenData = await store.readTokenDataFromIndexedDB();
    navigator.clipboard.writeText(tokenData.access_token);
    console.log('copied access_token to clipboard');
  };

  const handleSubmitConfig = async (data: IConfig) => {
    console.log(data);
    await store.writeConfigToIndexedDB(data);
    setIsConfigReady(true);
    setConfig(data);
  };

  useEffect(() => {
    console.log('---- start FIRST');
    initAuth(false);
    console.log('----- end FIRST');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const urlLogo =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/235px-Google_%22G%22_Logo.svg.png';

  return (
    <div className="google-auth-gis">
      <div className="google-auth-gis-head">
        <img src={urlLogo} className="google-auth-gis-logo" alt="logo" />
        <p>
          To setup config see
          <a
            className="google-auth-gis-link"
            href="https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid"
            target="_blank"
            rel="noopener noreferrer"
          >
            official Google Identity Setup page
          </a>
        </p>
      </div>
      <div className="google-auth-gis-box">
        <div>
          <div className="google-auth-config-form">
            <div className="google-auth-block-title">Config Form</div>
            <AuthConfig onSubmit={handleSubmitConfig} config={config} />
          </div>
          <div className="google-auth-state">
            <div className="google-auth-block-title">Config State</div>
            <pre> {JSON.stringify(config, null, 4)}</pre>
          </div>
          <div className="google-auth-state">
            <div className="google-auth-block-title">GIS State</div>
            <pre> {JSON.stringify(tokenData, null, 4)}</pre>
          </div>
          <div className="buttons">
            <button
              className={isConfigReady ? 'button' : 'button disabled'}
              onClick={() => initAuth(false)}
            >
              Get Token
            </button>
            <button
              className={isConfigReady ? 'button' : 'button disabled'}
              onClick={() => initAuth(true)}
            >
              Refresh Token
            </button>
            <button
              className={isConfigReady ? 'button' : 'button disabled'}
              onClick={() => isTokenValid(tokenData)}
            >
              Check Token Valid
            </button>
            <button
              className={isConfigReady ? 'button' : 'button disabled'}
              onClick={() => copyToken()}
            >
              Copy Token
            </button>
          </div>
          <div>
            <CountdownTimer
              targetDate={expDatetime}
              isConfigReady={isConfigReady}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleGIS;
