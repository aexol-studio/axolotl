import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface AuthSetupUser {
  email: string;
  password: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STARTER_APP_ROOT = path.resolve(__dirname, '..', '..');

const AUTH_SETUP_USER_FILE = path.join(STARTER_APP_ROOT, '.playwright', 'auth-setup-user.json');

export const saveAuthSetupUser = (user: AuthSetupUser): void => {
  fs.mkdirSync(path.dirname(AUTH_SETUP_USER_FILE), { recursive: true });
  fs.writeFileSync(AUTH_SETUP_USER_FILE, JSON.stringify(user), 'utf-8');
};

export const readAuthSetupUser = (): AuthSetupUser => {
  const fileContents = fs.readFileSync(AUTH_SETUP_USER_FILE, 'utf-8');
  const parsed = JSON.parse(fileContents) as Partial<AuthSetupUser>;

  if (!parsed.email || !parsed.password) {
    throw new Error('Invalid auth setup user file: missing email or password');
  }

  return {
    email: parsed.email,
    password: parsed.password,
  };
};
