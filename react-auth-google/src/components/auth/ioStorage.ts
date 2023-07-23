import Dexie, { Table } from 'dexie';
import { IConfig, ITokenData } from './interface';

const writeLocalStorage = (key: string, val: string) => {
  console.log(`write to localStorage: ${key}=${val}`);
  localStorage.setItem(key, val);
};

const readLocalStorage = (key: string): string => {
  const val = localStorage.getItem(key) as string;
  console.log(`read from localStorage[${key}]`, val);
  return val;
};

class GISDatabase extends Dexie {
  public auth!: Table<ITokenData, number>;
  public config!: Table<IConfig, number>;

  public constructor() {
    super('GIS');
    this.version(1).stores({
      auth: '',
      //   auth: "++id",
      //   auth: "++id,access_token,expires_in,scope,token_type,get_date,ext_date",
      config: ''
      // ref https://dexie.org/docs/API-Reference#quick-reference
    });
  }
}

const db = new GISDatabase();

const readTokenDataFromIndexedDB = async () => {
  const res = await db.auth.toArray();
  return res[0];
};

const readConfigFromIndexedDB = async () => {
  const res = await db.config.toArray();
  return res[0];
};

const writeTokenDataToIndexedDB = async (data: ITokenData) => {
  db.transaction('rw', db.auth, async () => {
    db.auth.clear();
    const id = await db.auth.put(data, 0);
    console.log(`Write token data do IDB GIS/auth with id ${id}`);
  }).catch(e => {
    console.log(e.stack || e);
  });
};

const writeConfigToIndexedDB = async (data: IConfig) => {
  db.transaction('rw', db.config, async () => {
    db.config.clear();
    const id = await db.config.put(data, 0);
    console.log(`Write config data to IDB/config with id ${id}`);
  }).catch(e => {
    console.log(e.stack || e);
  });
};

export {
  readConfigFromIndexedDB,
  readLocalStorage,
  readTokenDataFromIndexedDB,
  writeConfigToIndexedDB,
  writeLocalStorage,
  writeTokenDataToIndexedDB
};
