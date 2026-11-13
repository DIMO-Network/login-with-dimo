import { EntryState } from '@enums/index';
import type { LoginPrompt } from '@dimo-types/index';

/**
 * The prompt a button click sends: its own, else the account chooser while the
 * app is logged out (see logout()). The logout button never asks for it.
 */
export const resolvePrompt = (
  explicit: LoginPrompt | undefined,
  entryState: EntryState,
  loggedOut: boolean
): LoginPrompt | undefined => {
  if (explicit) return explicit;
  return loggedOut && entryState !== EntryState.LOGOUT ? 'select_account' : undefined;
};

const MAX_LOGIN_HINT_LENGTH = 254;

/** The login hint worth sending: a non-empty string of at most 254 characters, trimmed. */
export const cleanLoginHint = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const hint = value.trim();
  return hint && hint.length <= MAX_LOGIN_HINT_LENGTH ? hint : undefined;
};
