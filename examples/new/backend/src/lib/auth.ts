import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { COOKIE_OPTIONS } from './cookies.js';

const BCRYPT_ROUNDS = 12;

/** Derive JWT expiry in seconds from cookie maxAge (single source of truth) */
const JWT_EXPIRY_SECONDS = Math.floor(COOKIE_OPTIONS.maxAge / 1000);

/** Session expiry in days, derived from cookie maxAge */
export const SESSION_EXPIRY_DAYS = Math.round(COOKIE_OPTIONS.maxAge / (24 * 60 * 60 * 1000));

export interface JwtPayload {
  userId: string;
  email: string;
  /** Session UUID — used as the Session primary key in the database */
  jti: string;
}

/**
 * Returns the JWT secret from environment.
 * Throws in production if missing; uses a dev fallback otherwise.
 */
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (secret) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }

  return 'dev-jwt-secret-do-not-use-in-production';
};

/** Hash a plain-text password with bcrypt */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

/** Compare a plain-text password against a bcrypt hash */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/** Sign a JWT with userId, email, and jti (session token) */
export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRY_SECONDS, algorithm: 'HS256' });
};

/** Verify and decode a JWT, returns payload or throws */
export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });

  if (
    typeof decoded === 'object' &&
    decoded !== null &&
    'userId' in decoded &&
    'email' in decoded &&
    'jti' in decoded
  ) {
    return decoded as JwtPayload;
  }

  throw new Error('Invalid token payload structure');
};

/** Generate a unique session token (UUID v4) for use as JTI values */
export const generateSessionToken = (): string => {
  return crypto.randomUUID();
};

/** Returns a Date 30 days from now, matching cookie and JWT expiry */
export const getSessionExpiryDate = (): Date => {
  return new Date(Date.now() + COOKIE_OPTIONS.maxAge);
};
