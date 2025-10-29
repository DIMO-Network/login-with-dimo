import React from 'react';
import {
  DimoSDKModes,
  ExecuteAdvancedTransactionWithDimo,
} from '@dimo-network/login-with-dimo';
import { sampleAbi } from '../../abi/sample-abi';

interface AdvancedTransactionButtonProps {
  loginType: DimoSDKModes;
}

export const AdvancedTransactionButton: React.FC<
  AdvancedTransactionButtonProps
> = ({ loginType }) => {
  const onSuccess = (data: unknown) => {
    console.log(data);
    console.log(
      'Transaction Hash:',
      (data as { transactionHash: string }).transactionHash
    );
  };

  const onError = (error: unknown) => console.error('Error:', error);

  return (
    <ExecuteAdvancedTransactionWithDimo
      mode={loginType}
      onSuccess={onSuccess}
      onError={onError}
      address="0x21cFE003997fB7c2B3cfe5cf71e7833B7B2eCe10"
      abi={sampleAbi}
      functionName="transfer"
      args={['0x62b98e019e0d3e4A1Ad8C786202e09017Bd995e1', '0']}
    />
  );
};
