import React, { type FC, useMemo } from 'react';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

import BaseDimoButton from './BaseDimoButton';
import { EntryState, EventTypes } from '@enums/index';
import type { AuthData } from '@dimo-types/index';
import type { ProvisionDeveloperLicenseProps, ProvisionResult } from '@dimo-types/provision.types';

const ProvisionDeveloperLicenseWithDimo: FC<ProvisionDeveloperLicenseProps> = ({
  mode,
  domain,
  appName,
  onSuccess,
  onError,
  existingTokenId,
  existingClientId,
}) => {
  const { privateKey, address } = useMemo(() => {
    const pk = generatePrivateKey();
    return { privateKey: pk, address: privateKeyToAccount(pk).address };
  }, []);

  // privateKey lives only in this closure — never sent to the popup
  const handleSuccess = (data: AuthData) => {
    const provisionData = data as unknown as { clientId: string; tokenId: number };
    if (!provisionData.clientId || provisionData.tokenId == null) {
      onError(new Error('Incomplete provision response'));
      return;
    }
    const result: ProvisionResult = {
      clientId: provisionData.clientId,
      privateKey,
      domain,
      tokenId: provisionData.tokenId,
    };
    onSuccess(result);
  };

  const fallbackAlias = `${appName ?? 'DIMO App'} - ${new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`;

  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.PROVISION_DEVELOPER_LICENSE}
      onSuccess={handleSuccess}
      onError={onError}
      buttonLabel={() => 'Set up developer access'}
      payload={{
        eventType: EventTypes.PROVISION_DEVELOPER_LICENSE,
        provisionData: {
          alias: fallbackAlias,
          domain,
          signerAddress: address,
          ...(existingTokenId != null && { existingTokenId }),
          ...(existingClientId != null && { existingClientId }),
        },
      }}
    />
  );
};

export default ProvisionDeveloperLicenseWithDimo;
