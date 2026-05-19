import React from 'react';

import BaseDimoButton from './BaseDimoButton';
import { EntryState, EventTypes } from '@enums/index';
import {
  BaseButtonProps,
  ButtonLabels,
  SignMessageButtonProps,
  SignMessageData,
} from '@dimo-types/index';
import { useResolvedBrand, formatBrandedLabel } from '@utils/brand';

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
  authenticatedLabel,
  unAuthenticatedLabel,
  altTitle,
  brandOverride,
}) => {
  const messageData = normalizeMessage(message);
  const brand = useResolvedBrand(brandOverride);

  const resolvedAuthLabel =
    authenticatedLabel ??
    formatBrandedLabel('Sign Message with {name}', brand.name, 'Sign Message with Dimo');
  const resolvedUnAuthLabel =
    unAuthenticatedLabel ??
    formatBrandedLabel('Sign in to Sign Message', brand.name, 'Sign in to Sign Message');

  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.SIGN_MESSAGE}
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? resolvedAuthLabel : resolvedUnAuthLabel
      }
      altTitle={altTitle}
      payload={{
        messageData,
        eventType: EventTypes.SIGN_MESSAGE,
      }}
      brand={brand}
    />
  );
};

export default SignMessageWithDimo;
