import React from 'react';
import { IConfig } from './interface';

interface FormProps {
  onSubmit: (data: IConfig) => void;
  config: IConfig;
}

// NEW
const test_client_id =
  '1030506324267-limtjs3e3965b9l6545h1p72dhg2ngdc.apps.googleusercontent.com';

const test_scope = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/spreadsheets'
].join(' ');

function AuthConfig({ onSubmit, config }: FormProps) {
  const [formData, setFormData] = React.useState<IConfig>({
    client_id: config.client_id,
    scope: config.scope
  });

  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, client_id: value });
  };

  const handleChange2 = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, scope: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const setSample = () => {
    console.log('onSample');
    setFormData({ client_id: test_client_id, scope: test_scope });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="google-auth-config">
        <div className="google-auth-config-1">
          <div className="google-auth-config-label">Client id:</div>
          <input
            className="config-client-id"
            type="text"
            name="client_id"
            placeholder="your client id"
            defaultValue={config.client_id}
            onChange={handleChange1}
          />
        </div>
        <div className="google-auth-config-1">
          <div className="google-auth-config-label">Scope:</div>
          <textarea
            className="config-scope"
            name="scope"
            placeholder="space separated list of scopes"
            defaultValue={config.scope}
            onChange={handleChange2}
          />
        </div>
      </div>
      <div className="google-auth-config-2">
        <button className="button" type="submit">
          Submit
        </button>
        <button className="button" onClick={setSample}>
          Set Sample
        </button>
      </div>
    </form>
  );
}

export { AuthConfig };
