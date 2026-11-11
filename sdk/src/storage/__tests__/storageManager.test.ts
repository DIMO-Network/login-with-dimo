import { beforeEach, describe, expect, it } from 'vitest';
import { markLoggedOut, takeLoggedOut } from '../storageManager';

describe('logged-out marker', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('remembers a logout once', () => {
    expect(takeLoggedOut()).toBe(false);
    markLoggedOut();
    expect(takeLoggedOut()).toBe(true);
    expect(takeLoggedOut()).toBe(false);
  });

  it('is shared across tabs (localStorage, not sessionStorage)', () => {
    markLoggedOut();
    expect(localStorage.getItem('dimo_logged_out')).toBe('1');
    expect(sessionStorage.length).toBe(0);
  });
});
