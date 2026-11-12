import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRedirectReturn } from '../useRedirectReturn';
import { getJWTFromCookies, startRedirectState } from '@storage/storageManager';

// The hook is one effect plus two flags; run the effect inline and keep the
// flags, so the test needs no renderer.
const flags = vi.hoisted(() => ({ values: {} as Record<number, unknown>, n: 0 }));
vi.mock('react', () => ({
  useState: (initial: unknown) => {
    const i = flags.n++;
    flags.values[i] = initial;
    return [initial, (v: unknown) => { flags.values[i] = v; }];
  },
  useEffect: (fn: () => void) => fn(),
}));

const b64 = (o: object) =>
  Buffer.from(JSON.stringify(o)).toString('base64url');
const jwt = (exp: number) => `${b64({ alg: 'none' })}.${b64({ exp })}.sig`;
const TOKEN = jwt(Math.floor(Date.now() / 1000) + 3600);
const OTHER_TOKEN = jwt(Math.floor(Date.now() / 1000) + 7200);

let result: { isTokenStored: boolean; hasLogoutParam: boolean };

const landOn = (search: string, hash: string) => {
  window.history.replaceState(null, '', `/app${search}${hash}`);
};

const mount = () => {
  flags.n = 0;
  flags.values = {};
  useRedirectReturn();
  result = {
    isTokenStored: flags.values[0] as boolean,
    hasLogoutParam: flags.values[1] as boolean,
  };
};

describe('useRedirectReturn', () => {
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
    expect(result.isTokenStored).toBe(true);
    expect(getJWTFromCookies()).toBe(TOKEN);
    expect(localStorage.getItem('dimo_wallet_address')).toBe('0xabc');
    expect(window.location.hash).toBe('');
    expect(window.location.search).toBe('?keep=1');
  });

  it('reads the session from the query, as before', () => {
    landOn(`?token=${TOKEN}&dimoState=${state}&keep=1`, '');
    mount();
    expect(result.isTokenStored).toBe(true);
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
    expect(result.isTokenStored).toBe(false);
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
    expect(result.hasLogoutParam).toBe(true);
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
    expect(result.isTokenStored).toBe(false);
    expect(window.location.hash).toBe('#/settings');
    expect(window.location.search).toBe('?q=1');
  });
});
