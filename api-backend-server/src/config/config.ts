import path from 'path';
import dotenv from 'dotenv';

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
  MONGODB_URI: string | undefined;
  JWT_SECRET: string | undefined;
  JWT_EXPIRYIN: string | undefined;
  APP_SALT: string | undefined;
  APP_KEY: string | undefined;
}

interface Config {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRYIN: string;
  APP_SALT: string;
  APP_KEY: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRYIN: process.env.JWT_EXPIRYIN ? String(process.env.JWT_EXPIRYIN) : '12h',
  APP_SALT: process.env.APP_SALT,
  APP_KEY: process.env.APP_KEY
});

const verifiedConfig = (config: any): Config => {
  const emptyENV: string[] = Object.keys(config).filter(key => ((config[key] === undefined || config[key] === '') ? key : ''));
  // eslint-disable-next-line no-console
  if (emptyENV.length === 0) { return config as Config; }
  throw new Error(`Missing following keys ${emptyENV.join('\n')} in .env`);
};

const config = getConfig();

const sanitizedConfig = verifiedConfig(config);

export default sanitizedConfig;
