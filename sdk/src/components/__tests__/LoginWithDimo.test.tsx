/**
 * Type-level check for the `prompt` and `loginHint` props of LoginWithDimo.
 * Like ShareAccountWithDimo.test.tsx, this file is only type-checked by
 * `npm test` (`tsc --noEmit`).
 */
import React from 'react';
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

void [withPromptAndHint, withLoginPrompt, withBadPrompt];

export {};
