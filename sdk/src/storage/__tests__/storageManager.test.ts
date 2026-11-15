import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearLoggedOut,
  isLoggedOut,
  markLoggedOut,
  storeJWTInCookies,
} from '../storageManager';

const JWT = 'x.eyJleHAiOjk5OTk5OTk5OTl9.y';

describe('logged-out marker', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('stays set until cleared', () => {
    expect(isLoggedOut()).toBe(false);
    markLoggedOut();
    expect(isLoggedOut()).toBe(true);
    expect(isLoggedOut()).toBe(true);
    clearLoggedOut();
    expect(isLoggedOut()).toBe(false);
  });

  it('is shared across tabs (localStorage, not sessionStorage)', () => {
    markLoggedOut();
    expect(localStorage.getItem('dimo_logged_out')).toBe('1');
    expect(sessionStorage.length).toBe(0);
  });

  it('is cleared when a login token is stored', () => {
    markLoggedOut();
    storeJWTInCookies(JWT);
    expect(isLoggedOut()).toBe(false);
  });

  it('is kept when the token is rejected', () => {
    markLoggedOut();
    storeJWTInCookies('not a jwt');
    expect(isLoggedOut()).toBe(true);
  });
});
