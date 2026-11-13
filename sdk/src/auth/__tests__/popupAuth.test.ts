import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POPUP_DOUBLE_CLICK_MS, popupAuth } from '../popupAuth';
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

const fakePopup = () => {
  const popup = {
    closed: false,
    focus: vi.fn(),
    postMessage: vi.fn(),
    close: vi.fn(() => {
      popup.closed = true;
    }),
  };
  return popup;
};

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

  it('focuses the open popup on a double click instead of opening a second one', () => {
    popupAuth(payload());
    vi.advanceTimersByTime(POPUP_DOUBLE_CLICK_MS - 1);
    popupAuth(payload());
    expect(open).toHaveBeenCalledTimes(1);
    expect(popups[0].focus).toHaveBeenCalledTimes(1);
  });

  // As 0.0.35 did, a later click opens a fresh login. Only focusing the old
  // one would leave the button dead where focus() can't reach it (a phone,
  // where the popup is a tab left open behind the app).
  it('replaces a popup still open from an earlier click, without an error', () => {
    const first = payload();
    const second = payload();
    popupAuth(first);
    vi.advanceTimersByTime(POPUP_DOUBLE_CLICK_MS);
    popupAuth(second);

    expect(open).toHaveBeenCalledTimes(2);
    expect(popups[0].focus).not.toHaveBeenCalled();
    expect(popups[0].close).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(5_000);
    expect(first.onError).not.toHaveBeenCalled();
    expect(second.onError).not.toHaveBeenCalled();
  });

  it('answers only the new popup once an old one is replaced', () => {
    const first = payload();
    const second = payload();
    popupAuth(first);
    vi.advanceTimersByTime(POPUP_DOUBLE_CLICK_MS);
    popupAuth(second);

    for (const source of popups) {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: 'https://login.dimo.org',
          source: source as unknown as Window,
          data: { mode: 'popup', eventType: 'authResponse', token: 'tok' },
        })
      );
    }
    expect(first.onSuccess).not.toHaveBeenCalled();
    expect(second.onSuccess).toHaveBeenCalledTimes(1);
  });

  it('opens a new popup once the first is closed', () => {
    popupAuth(payload());
    popups[0].closed = true;
    popupAuth(payload());
    expect(open).toHaveBeenCalledTimes(2);
  });
});
