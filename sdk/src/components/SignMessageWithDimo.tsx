import React from 'react';

import BaseDimoButton from './BaseDimoButton';
import { EntryState, EventTypes } from '@enums/index';
import {
  BaseButtonProps,
  ButtonLabels,
  SignMessageButtonProps,
  SignMessageData,
} from '@dimo-types/index';

type SignMessageProps = BaseButtonProps & SignMessageButtonProps & ButtonLabels;

const HEX_HASH_RE = /^0x[0-9a-fA-F]{64}$/;

const normalizeMessage = (
  input: SignMessageButtonProps['message']
): SignMessageData => {
  if (typeof input === 'string') {
    if (input.length === 0) {
      throw new Error('SignMessageWithDimo: message must be non-empty.');
    }
    return { message: input, isHex: false };
  }

  if (input && typeof input === 'object' && 'raw' in input) {
    const raw = input.raw;
    if (!HEX_HASH_RE.test(raw)) {
      throw new Error(
        'SignMessageWithDimo: { raw } must be a 0x-prefixed 32-byte hash.'
      );
    }
    return { message: raw, isHex: true };
  }

  throw new Error(
    'SignMessageWithDimo: message must be a string or { raw: 0x... }.'
  );
};

const SignMessageWithDimo: React.FC<SignMessageProps> = ({
  mode,
  onSuccess,
  onError,
  message,
  authenticatedLabel = 'Sign Message with Dimo',
  unAuthenticatedLabel = 'Sign in to Sign Message',
  altTitle,
}) => {
  const messageData = normalizeMessage(message);

  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.SIGN_MESSAGE}
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? authenticatedLabel : unAuthenticatedLabel
      }
      altTitle={altTitle}
      payload={{
        messageData,
        eventType: EventTypes.SIGN_MESSAGE,
      }}
    />
  );
};

export default SignMessageWithDimo;
