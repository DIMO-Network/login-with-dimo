import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { popupAuth } from '../popupAuth';
import { EntryState } from '@enums/index';
import type { AuthPayload } from '@dimo-types/index';

const payload = (): AuthPayload => ({
  entryState: EntryState.EMAIL_INPUT,
  dimoLogin: 'https://login.dimo.org',
  forceEmail: false,
  onSuccess: vi.fn(),
  onError: vi.fn(),
  setAuthenticated: vi.fn(),
});

const fakePopup = () => ({ closed: false, focus: vi.fn(), postMessage: vi.fn() });

describe('popupAuth', () => {
  let open: ReturnType<typeof vi.fn>;
  let popups: Array<ReturnType<typeof fakePopup>>;

  beforeEach(() => {
    vi.useFakeTimers();
    popups = [];
    open = vi.fn(() => {
      const p = fakePopup();
      popups.push(p);
      return p;
    });
    vi.stubGlobal('open', open);
  });

  afterEach(() => {
    // Close whatever is open so the module handle resets between tests.
    popups.forEach((p) => (p.closed = true));
    vi.advanceTimersByTime(10_000);
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('focuses the open popup instead of opening a second one', () => {
    popupAuth(payload());
    popupAuth(payload());
    expect(open).toHaveBeenCalledTimes(1);
    expect(popups[0].focus).toHaveBeenCalledTimes(1);
  });

  it('opens a new popup once the first is closed', () => {
    popupAuth(payload());
    popups[0].closed = true;
    popupAuth(payload());
    expect(open).toHaveBeenCalledTimes(2);
  });
});
