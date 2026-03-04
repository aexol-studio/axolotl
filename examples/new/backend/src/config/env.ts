import 'dotenv/config';

export type NodeEnv = 'development' | 'test' | 'production';
export type EmailMode = 'local' | 'mailgun';

const readString = (name: string, fallback = ''): string => {
  const value = process.env[name];
  if (typeof value !== 'string') return fallback;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
};

const parseBoolean = (name: string, fallback: boolean): boolean => {
  const value = readString(name);
  if (!value) return fallback;

  const normalized = value.toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;

  return fallback;
};

const parseNodeEnv = (value: string): NodeEnv => {
  if (value === 'production' || value === 'test') return value;
  return 'development';
};

const parseEmailMode = (value: string): EmailMode => {
  return value.toLowerCase() === 'mailgun' ? 'mailgun' : 'local';
};

const parsePort = (value: string, fallback: number): number => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildDatabaseUrlFromPgVars = (): string => {
  const user = readString('PGUSER');
  const password = readString('PGPASSWORD');
  const database = readString('PGDATABASE');
  const host = readString('PGHOST');

  if (!user || !password || !database || !host) {
    return '';
  }

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:5432/${database}`;
};

export const NODE_ENV = parseNodeEnv(readString('NODE_ENV', 'development'));
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_TEST = NODE_ENV === 'test';

export const PORT = parsePort(readString('PORT', '8080'), 8080);
export const APP_URL = readString('APP_URL', `http://localhost:${PORT}`);

export const DATABASE_URL = buildDatabaseUrlFromPgVars() || readString('DATABASE_URL');

export const JWT_SECRET = readString('JWT_SECRET');

export const EMAIL_MODE = parseEmailMode(readString('EMAIL_MODE', 'local'));
export const DISABLE_EMAIL_VERIFICATION = parseBoolean('DISABLE_EMAIL_VERIFICATION', true);

export const MAILGUN_URL = readString('MAILGUN_URL', 'https://api.eu.mailgun.net');
export const MAILGUN_DOMAIN = readString('MAILGUN_DOMAIN');
export const MAILGUN_SENDER = readString('MAILGUN_SENDER');
export const MAILGUN_API_KEY = readString('MAILGUN_API_KEY');

export const OPENAI_API_KEY = readString('OPENAI_API_KEY');
export const OPENAI_BASE_URL = readString('OPENAI_BASE_URL');

const envErrors: string[] = [];

if (!DATABASE_URL) {
  envErrors.push('DATABASE_URL is required (or provide PGUSER, PGPASSWORD, PGDATABASE, PGHOST).');
}

if (!JWT_SECRET) {
  envErrors.push('JWT_SECRET is required.');
}

if (EMAIL_MODE === 'mailgun') {
  if (!MAILGUN_API_KEY) envErrors.push('MAILGUN_API_KEY is required when EMAIL_MODE=mailgun.');
  if (!MAILGUN_DOMAIN) envErrors.push('MAILGUN_DOMAIN is required when EMAIL_MODE=mailgun.');
  if (!MAILGUN_SENDER) envErrors.push('MAILGUN_SENDER is required when EMAIL_MODE=mailgun.');
}

if (envErrors.length > 0) {
  throw new Error(`[ENV] Invalid configuration:\n- ${envErrors.join('\n- ')}`);
}

export const env = {
  NODE_ENV,
  IS_PRODUCTION,
  IS_TEST,
  PORT,
  APP_URL,
  DATABASE_URL,
  JWT_SECRET,
  EMAIL_MODE,
  DISABLE_EMAIL_VERIFICATION,
  MAILGUN_URL,
  MAILGUN_DOMAIN,
  MAILGUN_SENDER,
  MAILGUN_API_KEY,
  OPENAI_API_KEY,
  OPENAI_BASE_URL,
} as const;

export const getDatabaseUrl = (): string => env.DATABASE_URL;
