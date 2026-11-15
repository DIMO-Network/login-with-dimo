import { describe, expect, it } from 'vitest';
import { cleanLoginHint, resolvePrompt } from '../prompt';
import { EntryState } from '@enums/index';

describe('resolvePrompt', () => {
  it('asks for the account chooser after a logout', () => {
    expect(resolvePrompt(undefined, EntryState.EMAIL_INPUT, true)).toBe('select_account');
  });

  it('lets an explicit prompt win', () => {
    expect(resolvePrompt('login', EntryState.EMAIL_INPUT, true)).toBe('login');
  });

  it('sends nothing without a marker or explicit prompt', () => {
    expect(resolvePrompt(undefined, EntryState.EMAIL_INPUT, false)).toBeUndefined();
  });

  it('never prompts the logout button', () => {
    expect(resolvePrompt(undefined, EntryState.LOGOUT, true)).toBeUndefined();
  });
});

describe('cleanLoginHint', () => {
  it('passes a valid email through, trimmed', () => {
    expect(cleanLoginHint('  a@x.co ')).toBe('a@x.co');
  });

  it('drops anything else', () => {
    expect(cleanLoginHint(undefined)).toBeUndefined();
    expect(cleanLoginHint(42)).toBeUndefined();
    expect(cleanLoginHint('   ')).toBeUndefined();
    expect(cleanLoginHint('a'.repeat(255))).toBeUndefined();
  });

  it('allows 254 characters', () => {
    expect(cleanLoginHint('a'.repeat(254))).toBe('a'.repeat(254));
  });
});
