interface ITokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface ITokenData extends ITokenResponse {
  get_date: Date;
  exp_date: Date;
}

interface IConfig {
  client_id: string;
  scope: string;
}

export type { IConfig, ITokenData, ITokenResponse };
