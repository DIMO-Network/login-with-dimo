/**
 * Smoke test for ShareAccountWithDimo.
 *
 * The SDK ships no test runner (jest is an intentional no-op stub and there are
 * no testing-library deps — see CLAUDE.md "No tests exist for the SDK itself").
 * To stay aligned with the existing toolchain (tsc + webpack path aliases) this
 * smoke test is type-checked via `npm test` (`tsc --noEmit`). It asserts that:
 *   1. the component is exported from the package root,
 *   2. it can be instantiated as a React element with its public props,
 *   3. the SHARE_ACCOUNT_DATA event type / ACCOUNT_MANAGER entry state exist.
 */
import React from 'react';
import { DimoSDKModes, EntryState, EventTypes } from '@enums/index';
import ShareAccountWithDimo from '../ShareAccountWithDimo';
import { ShareAccountWithDimo as ShareAccountWithDimoFromRoot } from '../../index';

// 1. Exported from the package root.
console.assert(
  ShareAccountWithDimoFromRoot === ShareAccountWithDimo,
  'ShareAccountWithDimo should be re-exported from the package root'
);

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

console.assert(
  React.isValidElement(element),
  'ShareAccountWithDimo should produce a valid React element'
);

// 3. The enum members the component relies on exist.
console.assert(
  EventTypes.SHARE_ACCOUNT_DATA === 'SHARE_ACCOUNT_DATA',
  'SHARE_ACCOUNT_DATA event type should exist'
);
console.assert(
  EntryState.ACCOUNT_MANAGER === 'ACCOUNT_MANAGER',
  'ACCOUNT_MANAGER entry state should exist'
);

export {};
