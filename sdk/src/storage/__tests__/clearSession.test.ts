import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearSessionData } from '../storageManager';

describe('clearSessionData', () => {
  afterEach(() => vi.restoreAllMocks());

  it('does not throw when localStorage is blocked', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => clearSessionData()).not.toThrow();
  });
});
