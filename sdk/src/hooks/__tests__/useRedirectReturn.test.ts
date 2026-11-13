import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { consumeRedirectReturn } from '../useRedirectReturn';
import { clearSessionData, getJWTFromCookies, startRedirectState } from '@storage/storageManager';

const b64 = (o: object) =>
  Buffer.from(JSON.stringify(o)).toString('base64url');
const jwt = (exp: number) => `${b64({ alg: 'none' })}.${b64({ exp })}.sig`;
const TOKEN = jwt(Math.floor(Date.now() / 1000) + 3600);
const OTHER_TOKEN = jwt(Math.floor(Date.now() / 1000) + 7200);

let result: { tokenStored: boolean; logout: boolean };

const landOn = (search: string, hash: string) => {
  window.history.replaceState(null, '', `/app${search}${hash}`);
};

const mount = () => {
  result = consumeRedirectReturn();
};

describe('consumeRedirectReturn', () => {
  let state: string;

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    document.cookie.split(';').forEach((c) => {
      document.cookie = `${c.split('=')[0]}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
    state = startRedirectState()!;
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, '', '/');
  });

  it('reads the session from the fragment', () => {
    landOn('?keep=1', `#token=${TOKEN}&walletAddress=0xabc&dimoState=${state}`);
    mount();
    expect(result.tokenStored).toBe(true);
    expect(getJWTFromCookies()).toBe(TOKEN);
    expect(localStorage.getItem('dimo_wallet_address')).toBe('0xabc');
    expect(window.location.hash).toBe('');
    expect(window.location.search).toBe('?keep=1');
  });

  it('reads the session from the query, as before', () => {
    landOn(`?token=${TOKEN}&dimoState=${state}&keep=1`, '');
    mount();
    expect(result.tokenStored).toBe(true);
    expect(getJWTFromCookies()).toBe(TOKEN);
    expect(window.location.search).toBe('?keep=1');
  });

  it('prefers the fragment when both are valid, and cleans both', () => {
    landOn(
      `?token=${OTHER_TOKEN}&dimoState=${state}&error=x`,
      `#token=${TOKEN}&dimoState=${state}`
    );
    mount();
    expect(getJWTFromCookies()).toBe(TOKEN);
    expect(window.location.search).toBe('?error=x');
    expect(window.location.hash).toBe('');
  });

  it('ignores a fragment whose dimoState does not match', () => {
    landOn('', `#token=${TOKEN}&dimoState=forged`);
    mount();
    expect(result.tokenStored).toBe(false);
    expect(getJWTFromCookies()).toBeNull();
    expect(window.location.hash).toBe(`#token=${TOKEN}&dimoState=forged`);
  });

  it('uses a valid query over a forged fragment', () => {
    landOn(
      `?token=${TOKEN}&dimoState=${state}`,
      `#token=${OTHER_TOKEN}&dimoState=forged`
    );
    mount();
    expect(getJWTFromCookies()).toBe(TOKEN);
    expect(window.location.hash).not.toContain(OTHER_TOKEN);
  });

  it('keeps unrelated hash content and query params', () => {
    landOn(
      '?a=1&token=' + TOKEN + `&dimoState=${state}`,
      `#section=pricing&token=${TOKEN}&dimoState=${state}&tab=2`
    );
    mount();
    expect(window.location.search).toBe('?a=1');
    expect(window.location.hash).toBe('#section=pricing&tab=2');
  });

  it('handles a logout in the fragment', () => {
    landOn('', `#logout=true&dimoState=${state}`);
    mount();
    expect(result.logout).toBe(true);
    expect(window.location.hash).toBe('');
  });

  it("never parses or alters an app's own hash route", () => {
    landOn(`?token=${TOKEN}&dimoState=${state}`, '#/settings?token=mine&x=1');
    mount();
    expect(getJWTFromCookies()).toBe(TOKEN);
    expect(window.location.hash).toBe('#/settings?token=mine&x=1');
  });

  it('leaves a plain hash route alone when there is nothing to read', () => {
    landOn('?q=1', '#/settings');
    mount();
    expect(result.tokenStored).toBe(false);
    expect(window.location.hash).toBe('#/settings');
    expect(window.location.search).toBe('?q=1');
  });

  it('removes the keys from both places when the token is expired', () => {
    const expired = jwt(Math.floor(Date.now() / 1000) - 10);
    landOn(
      `?token=${expired}&dimoState=${state}&keep=1`,
      `#token=${expired}&dimoState=${state}&tab=2`
    );
    mount();
    expect(result.tokenStored).toBe(false);
    expect(getJWTFromCookies()).toBeNull();
    expect(window.location.search).toBe('?keep=1');
    expect(window.location.hash).toBe('#tab=2');
  });

  it('removes the keys when no token came back, storing nothing', () => {
    landOn(
      `?email=a%40x.co&dimoState=${state}`,
      `#walletAddress=0xabc&dimoState=${state}`
    );
    mount();
    expect(result.tokenStored).toBe(false);
    expect(localStorage.getItem('dimo_wallet_address')).toBeNull();
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe('');
  });

  it('ignores a replay of the same URL and leaves it alone', () => {
    const hash = `#token=${TOKEN}&dimoState=${state}`;
    landOn('', hash);
    mount();
    expect(result.tokenStored).toBe(true);
    clearSessionData();
    landOn('', hash);
    mount();
    expect(result.tokenStored).toBe(false);
    expect(getJWTFromCookies()).toBeNull();
    expect(window.location.hash).toBe(hash);
  });

  it('keeps history.state when it cleans the address bar', () => {
    window.history.replaceState({ page: 7 }, '', `/app#token=${TOKEN}&dimoState=${state}`);
    mount();
    expect(window.history.state).toEqual({ page: 7 });
    expect(window.location.hash).toBe('');
  });

  it('warns when session keys came back without a matching dimoState', () => {
    landOn('', `#token=${TOKEN}&dimoState=forged`);
    mount();
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('does not warn when there is nothing to read', () => {
    landOn('?q=1', '#/settings');
    mount();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
