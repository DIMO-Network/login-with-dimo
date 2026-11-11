import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleMessageForPopup } from '../eventHandler';
import { MessageEventType } from '@enums/index';
import type { AuthPayload } from '@dimo-types/index';

const LOGIN_ORIGIN = 'https://login.dimo.org';
const JWT = 'x.eyJleHAiOjk5OTk5OTk5OTl9.y';

describe('popup lifecycle', () => {
  const onSuccess = vi.fn();
  const onError = vi.fn();
  const setAuthenticated = vi.fn();
  let popup: { closed: boolean; postMessage: ReturnType<typeof vi.fn> };
  let stops: Array<() => void>;

  // Opens a popup listener; overrides are merged into the base payload.
  const start = (overrides: Partial<AuthPayload> = {}, data?: Parameters<typeof handleMessageForPopup>[1]) => {
    const basePayload = {
      clientId: 'client',
      redirectUri: 'https://app.example',
      onSuccess,
      onError,
      setAuthenticated,
      ...overrides,
    } as AuthPayload;
    const stop = handleMessageForPopup(basePayload, data, LOGIN_ORIGIN, popup as unknown as Window);
    stops.push(stop);
    return stop;
  };

  // Delivers a message from the popup, as the login page would.
  const answer = (data: Record<string, unknown>) => {
    const event = new Event('message');
    Object.defineProperties(event, {
      data: { value: data },
      origin: { value: LOGIN_ORIGIN },
      source: { value: popup },
    });
    window.dispatchEvent(event);
  };

  beforeEach(() => {
    vi.useFakeTimers();
    popup = { closed: false, postMessage: vi.fn() };
    stops = [];
    onSuccess.mockReset();
    onError.mockReset();
    setAuthenticated.mockReset();
  });

  afterEach(() => {
    stops.forEach((stop) => stop());
    vi.useRealTimers();
  });

  it('tells the app when the user closes the popup', () => {
    start();
    popup.closed = true;
    vi.advanceTimersByTime(1000 + 500);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0].message).toBe('User closed the login window');
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('lets an answer that arrives as the popup closes win', () => {
    start();
    popup.closed = true;
    vi.advanceTimersByTime(1000); // poll sees it closed; grace starts
    answer({ eventType: 'authResponse', token: JWT, mode: 'popup' });
    vi.advanceTimersByTime(500);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
  });

  it('says nothing after an answer, however long the popup stays closed', () => {
    start();
    answer({ eventType: 'authResponse', token: JWT, mode: 'popup' });
    popup.closed = true;
    vi.advanceTimersByTime(10_000);
    expect(onError).not.toHaveBeenCalled();
  });

  it('reports the close once', () => {
    start();
    popup.closed = true;
    vi.advanceTimersByTime(10_000);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('says nothing when the caller stops the listener', () => {
    const stop = start();
    popup.closed = true;
    vi.advanceTimersByTime(1000);
    stop();
    vi.advanceTimersByTime(10_000);
    expect(onError).not.toHaveBeenCalled();
  });

  it('sends prompt and loginHint with AUTH_INIT', () => {
    start({ prompt: 'select_account', loginHint: 'a@x.co' });
    answer({ eventType: MessageEventType.READY, mode: 'popup' });
    expect(popup.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: MessageEventType.AUTH_INIT,
        prompt: 'select_account',
        loginHint: 'a@x.co',
      }),
      LOGIN_ORIGIN
    );
  });
});
