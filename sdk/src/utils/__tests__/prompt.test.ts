import { describe, expect, it } from 'vitest';
import { resolvePrompt } from '../prompt';
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
