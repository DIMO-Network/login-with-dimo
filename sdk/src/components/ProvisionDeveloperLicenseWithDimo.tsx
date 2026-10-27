import React, { type FC } from 'react';

import BaseDimoButton from './BaseDimoButton';
import { EntryState, EventTypes } from '@enums/index';
import type { AuthData } from '@dimo-types/index';
import type { ProvisionDeveloperLicenseProps, ProvisionResult } from '@dimo-types/provision.types';

const ProvisionDeveloperLicenseWithDimo: FC<ProvisionDeveloperLicenseProps> = ({
  mode,
  domain,
  onSuccess,
  onError,
  existingTokenId,
  existingClientId,
  label = 'Set up developer access',
  language,
}) => {
  const handleSuccess = (data: AuthData) => {
    const response = data as unknown as { clientId: string; tokenId: number; privateKey: `0x${string}` };
    if (!response.clientId || response.tokenId == null || !response.privateKey) {
      onError(new Error('Incomplete provision response'));
      return;
    }
    const result: ProvisionResult = {
      clientId: response.clientId,
      privateKey: response.privateKey,
      domain,
      tokenId: response.tokenId,
    };
    onSuccess(result);
  };

  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.PROVISION_DEVELOPER_LICENSE}
      onSuccess={handleSuccess}
      onError={onError}
      buttonLabel={() => label}
      language={language}
      payload={{
        eventType: EventTypes.PROVISION_DEVELOPER_LICENSE,
        ...(existingTokenId != null && { existingTokenId }),
        ...(existingClientId != null && { existingClientId }),
      }}
    />
  );
};

export default ProvisionDeveloperLicenseWithDimo;
