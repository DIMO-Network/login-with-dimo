import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { redirectAuth } from '../redirectAuth';
import { EntryState, EventTypes } from '@enums/index';
import type { AuthPayload } from '@dimo-types/index';

const BASE: AuthPayload = {
  entryState: EntryState.EMAIL_INPUT,
  dimoLogin: 'https://login.dimo.org',
  forceEmail: false,
  clientId: 'client',
  redirectUri: 'https://app.example',
  onSuccess: vi.fn(),
  onError: vi.fn(),
  setAuthenticated: vi.fn(),
};

// Replaces window.location with an object whose href setter records the value.
const stubLocation = () => {
  const assign = vi.fn();
  vi.stubGlobal('location', {
    set href(value: string) {
      assign(value);
    },
  });
  return assign;
};

describe('redirectAuth', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('puts prompt and loginHint in the redirect query', () => {
    const assign = stubLocation();
    redirectAuth(
      { ...BASE, prompt: 'login', loginHint: 'a@x.co' },
      { eventType: EventTypes.SHARE_VEHICLES_DATA }
    );
    const url = new URL(assign.mock.calls[0][0]);
    expect(url.searchParams.get('prompt')).toBe('login');
    expect(url.searchParams.get('loginHint')).toBe('a@x.co');
  });

  it('leaves them out when the app set neither', () => {
    const assign = stubLocation();
    redirectAuth(BASE, { eventType: EventTypes.SHARE_VEHICLES_DATA });
    const url = new URL(assign.mock.calls[0][0]);
    expect(url.searchParams.has('prompt')).toBe(false);
    expect(url.searchParams.has('loginHint')).toBe(false);
  });
});
