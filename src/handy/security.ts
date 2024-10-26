import * as argon2 from '@node-rs/argon2';
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import { ts } from './time';

const passwordSecret = Buffer.from(process.env.PASSWORD_SECRET, 'utf8');

const jwtSecret = Buffer.from(process.env.JWT_SECRET, 'utf8');

const jwtRefreshSecret = Buffer.from(process.env.JWT_REFRESH_SECRET, 'utf8');

export type TokenPayload = {
  userId: string;
  rth?: string; // Refresh token hash
  nonce?: string; // Refresh token nonce
};

export function secureHash(raw: string) {
  return crypto.createHmac('sha256', passwordSecret).update(raw).digest('hex');
}

/**
 * Generates a random secure string of specified length.
 *
 * @param max The maximum length of the generated string (default is 8)
 * @returns A random secure string in hexadecimal format
 */
export function randomSecureString(max: number = 8) {
  return crypto.randomBytes(max).toString('hex');
}

/**
 * Hashes a raw password using argon2 algorithm.
 *
 * @param raw - The raw password to be hashed.
 * @returns A promise that resolves with the hashed password.
 */
export async function hashPassword(raw: string) {
  return argon2.hash(raw, {
    secret: passwordSecret,
  });
}

/**
 * Verifies a password against a hashed value using argon2 algorithm.
 *
 * @param hashed - The hashed password to compare against.
 * @param password - The password to verify.
 * @returns A promise that resolves with a boolean indicating if the password is verified.
 */
export async function verifyPassword(hashed: string, password: string) {
  return argon2.verify(hashed, password, {
    secret: passwordSecret,
  });
}

/**
 * Encodes the access token payload into a string.
 *
 * @param payload - The access token payload containing userId, orgId, and role.
 * @returns The encoded access token payload as a string.
 */
export function encodePayload(payload: TokenPayload): string {
  const { userId, rth, nonce } = payload;
  return JSON.stringify([userId, rth, nonce]);
}

/**
 * Decodes the encoded access token payload from a string.
 * @param str - The encoded string containing user ID, organization ID, and role.
 * @returns The decoded TokenPayload object with user ID, organization ID, and role.
 */
export function decodePayload(str: string): TokenPayload {
  const [userId, rth, nonce] = JSON.parse(str);
  return { userId, rth, nonce };
}

/**
 * Generates an access token using the provided payload.
 *
 * @param payload - The payload containing userId, orgId, and role.
 * @returns The generated access token.
 */
export function generateAccessToken(payload: TokenPayload) {
  const signed = jwt.sign({ sub: encodePayload(payload) }, jwtSecret, {
    expiresIn: '15m',
  });

  const { exp } = verifyAccessToken(signed);
  if (!exp) throw new Error('Fail to decode JWT');

  return {
    accessToken: signed,
    expiresAt: ts(exp).toJSON(),
  };
}

/**
 * Verifies the access token using the JWT library.
 *
 * @param payload - The access token to be verified.
 * @returns {unknown} - The decoded payload if the token is valid.
 */
export function verifyAccessToken(payload: string) {
  return jwt.verify(payload, jwtSecret) as jwt.JwtPayload;
}

/**
 * Generates a refresh token for a specific userId.
 *
 * @param userId - The user ID for whom the refresh token is generated.
 * @returns The generated refresh token.
 */
export function generateRefreshToken(payload: TokenPayload): {
  refreshToken: string;
  refreshTokenHash: string;
  expiresAt: string;
} {
  const signed = jwt.sign(
    {
      sub: encodePayload({
        ...payload,
        nonce: randomSecureString(4),
      })
    },
    jwtRefreshSecret,
    {
      expiresIn: '7d',
    },
  );
  const refreshTokenHash = secureHash(signed);

  const { exp } = verifyRefreshToken(signed);
  if (!exp) throw new Error('Fail to decode JWT');

  return {
    refreshToken: signed,
    refreshTokenHash,
    expiresAt: ts(exp).toJSON(),
  };
}

/**
 * Verifies the refresh token using the JWT library.
 *
 * @param payload - The refresh token to be verified.
 * @returns {unknown} - The decoded payload if the token is valid.
 */
export function verifyRefreshToken(payload: string) {
  return jwt.verify(payload, jwtRefreshSecret);
}

/**
 * Masks sensitive text by replacing characters with '*'.
 *
 * @param text - The text to be masked.
 * @returns The masked text.
 */
export function mask(text: string) {
  return text.substring(0, 3).padEnd(text.length - 3, '*');
}

/**
 * Generates a random pause to prevent brute force attacks.
 *
 * @returns {Promise<void>} A promise that resolves after a random time delay.
 */
export function randomPause() {
  // Random pause to prevent brute force attacks
  const ms = Math.floor(Math.random() * 1.6 * 1000);
  return new Promise((r) => setTimeout(r, ms));
}
