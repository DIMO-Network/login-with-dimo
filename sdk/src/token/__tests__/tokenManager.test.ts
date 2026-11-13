import { describe, expect, it } from 'vitest';
import { isTokenExpired } from '@token/tokenManager';

const jwt = (payload: object) => `x.${btoa(JSON.stringify(payload))}.y`;

describe('isTokenExpired', () => {
  it('accepts a token that expires later', () => {
    expect(isTokenExpired(jwt({ exp: Math.floor(Date.now() / 1000) + 60 }))).toBe(false);
  });
  it.each([jwt({ exp: 1 }), jwt({}), 'garbage'])('rejects %s', (token) => {
    expect(isTokenExpired(token)).toBe(true);
  });
});
