import React from 'react';

import BaseDimoButton from './BaseDimoButton';
import { EntryState, EventTypes } from '@enums/index';
import {
  TransactionData,
  BaseButtonProps,
  ExecuteAdvancedTransactionButtonProps,
  DynamicButtonLabels,
} from '@dimo-types/index';

type ExecuteAdvancedTransactionProps = BaseButtonProps &
  ExecuteAdvancedTransactionButtonProps &
  DynamicButtonLabels;

const ExecuteAdvancedTransactionWithDimo: React.FC<
  ExecuteAdvancedTransactionProps
> = ({
  mode,
  onSuccess,
  onError,
  address,
  value,
  abi,
  functionName,
  args,
  authenticatedLabel = 'Execute Advanced Transaction with Dimo',
  unAuthenticatedLabel = 'Sign in to Execute Transaction',
  altTitle,
}) => {
  if (!address || !abi || !functionName || !args) {
    throw new Error('Missing required transaction parameters.');
  }
  const transactionData: TransactionData = {
    address,
    value: value ? value : '', // BigInt to string
    abi,
    functionName,
    args,
  };

  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.ADVANCED_TRANSACTION} // Set entry state for permissions flow
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? authenticatedLabel : unAuthenticatedLabel
      }
      altTitle={altTitle}
      payload={{
        transactionData,
        eventType: EventTypes.EXECUTE_ADVANCED_TRANSACTION,
      }}
    />
  );
};

export default ExecuteAdvancedTransactionWithDimo;
