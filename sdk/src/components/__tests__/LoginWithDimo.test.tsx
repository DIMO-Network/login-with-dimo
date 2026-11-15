/**
 * The `prompt` and `loginHint` props of LoginWithDimo: `tsc --noEmit` (the
 * first step of `npm test`) checks the types, including the
 * `@ts-expect-error`; vitest checks that the elements build.
 */
import React from 'react';
import { describe, expect, it } from 'vitest';
import { DimoSDKModes } from '@enums/index';
import LoginWithDimo from '../LoginWithDimo';

const withPromptAndHint = (
  <LoginWithDimo
    mode={DimoSDKModes.POPUP}
    prompt="select_account"
    loginHint="a@x.co"
    onSuccess={() => {}}
    onError={() => {}}
  />
);

const withLoginPrompt = (
  <LoginWithDimo
    mode={DimoSDKModes.POPUP}
    prompt="login"
    onSuccess={() => {}}
    onError={() => {}}
  />
);

const withBadPrompt = (
  <LoginWithDimo
    mode={DimoSDKModes.POPUP}
    // @ts-expect-error only 'select_account' and 'login' are accepted
    prompt="nope"
    onSuccess={() => {}}
    onError={() => {}}
  />
);

describe('LoginWithDimo props', () => {
  it('builds elements for the prompt and loginHint props', () => {
    [withPromptAndHint, withLoginPrompt, withBadPrompt].forEach((el) =>
      expect(React.isValidElement(el)).toBe(true)
    );
    expect(withPromptAndHint.props).toMatchObject({
      prompt: 'select_account',
      loginHint: 'a@x.co',
    });
  });
});

export {};
