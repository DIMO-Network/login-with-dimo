/**
 * Smoke test for ShareAccountWithDimo.
 *
 * `npm test` runs `tsc --noEmit` (which checks the props below), then
 * `vitest run` (which runs the assertions). It asserts that:
 *   1. the component is exported from the package root,
 *   2. it can be instantiated as a React element with its public props,
 *   3. the SHARE_ACCOUNT_DATA event type / ACCOUNT_MANAGER entry state exist.
 */
import React from 'react';
import { describe, expect, it } from 'vitest';
import { DimoSDKModes, EntryState, EventTypes } from '@enums/index';
import ShareAccountWithDimo from '../ShareAccountWithDimo';
import { ShareAccountWithDimo as ShareAccountWithDimoFromRoot } from '../../index';

// 2. Renders / mounts as a valid React element with its public props.
const element = (
  <ShareAccountWithDimo
    mode={DimoSDKModes.POPUP}
    permissions={[]}
    permissionTemplateId="1"
    expirationDate="2027-01-01T00:00:00Z"
    onSuccess={(authData) => {
      // accountGranted + transactionHash are surfaced on success.
      void authData.accountGranted;
      void authData.transactionHash;
      void authData.token;
    }}
    onError={(e) => console.error(e)}
    brandOverride={{ name: 'Acme' }}
  />
);

describe('ShareAccountWithDimo', () => {
  it('is exported from the package root', () => {
    expect(ShareAccountWithDimoFromRoot).toBe(ShareAccountWithDimo);
  });

  it('produces a valid React element', () => {
    expect(React.isValidElement(element)).toBe(true);
  });

  it('relies on enum members that exist', () => {
    expect(EventTypes.SHARE_ACCOUNT_DATA).toBe('SHARE_ACCOUNT_DATA');
    expect(EntryState.ACCOUNT_MANAGER).toBe('ACCOUNT_MANAGER');
  });
});

export {};
