import React from 'react';

import BaseDimoButton from './BaseDimoButton';
import { EntryState, EventTypes } from '@enums/index';
import {
  TransactionData,
  BaseButtonProps,
  ExecuteAdvancedTransactionButtonProps,
  ButtonLabels,
} from '@dimo-types/index';
import { useResolvedBrand, formatBrandedLabel } from '@utils/brand';

type ExecuteAdvancedTransactionProps = BaseButtonProps &
  ExecuteAdvancedTransactionButtonProps &
  ButtonLabels;

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
  authenticatedLabel,
  unAuthenticatedLabel,
  altTitle,
  brandOverride,
}) => {
  if (!address || !abi || !functionName || !args) {
    throw new Error('Missing required transaction parameters.');
  }
  const transactionData: TransactionData = {
    address,
    value: value ? value : '',
    abi,
    functionName,
    args,
  };

  const brand = useResolvedBrand(brandOverride);

  const resolvedAuthLabel =
    authenticatedLabel ??
    formatBrandedLabel('Execute Transaction with {name}', brand.name, 'Execute Advanced Transaction with Dimo');
  const resolvedUnAuthLabel =
    unAuthenticatedLabel ??
    formatBrandedLabel('Sign in to Execute Transaction', brand.name, 'Sign in to Execute Transaction');

  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.ADVANCED_TRANSACTION}
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? resolvedAuthLabel : resolvedUnAuthLabel
      }
      altTitle={altTitle}
      payload={{
        transactionData,
        eventType: EventTypes.EXECUTE_ADVANCED_TRANSACTION,
      }}
      brand={brand}
    />
  );
};

export default ExecuteAdvancedTransactionWithDimo;
