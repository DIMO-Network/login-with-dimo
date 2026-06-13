import React from 'react';

import { EntryState, EventTypes } from '@enums/index';
import {
  BaseButtonProps,
  ButtonLabels,
  InternalDimoActionParams,
  LoginButtonProps,
} from '@dimo-types/index';
import { getPermissionsBinary } from '@utils/index';
import { useResolvedBrand, formatBrandedLabel } from '@utils/brand';
import { BaseDimoButton } from './BaseDimoButton';

type ShareAccountWithDimoProps = BaseButtonProps &
  LoginButtonProps &
  ButtonLabels;

const ShareAccountWithDimo: React.FC<ShareAccountWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  permissionTemplateId,
  permissions,
  expirationDate,
  authenticatedLabel,
  unAuthenticatedLabel,
  utm = null,
  altTitle,
  brandOverride,
}) => {
  const brand = useResolvedBrand(brandOverride);

  const resolvedAuthLabel =
    authenticatedLabel ??
    formatBrandedLabel(
      'Share Documents with {name}',
      brand.name,
      'Share Documents with DIMO'
    );
  const resolvedUnAuthLabel =
    unAuthenticatedLabel ??
    formatBrandedLabel(
      'Sign in to Share Documents with {name}',
      brand.name,
      'Sign in to Share Documents with DIMO'
    );

  const payload: InternalDimoActionParams & { eventType: EventTypes } = {
    permissionTemplateId,
    expirationDate,
    eventType: EventTypes.SHARE_ACCOUNT_DATA,
    utm,
    ...getPermissionsBinary(permissions, permissionTemplateId),
  };

  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.ACCOUNT_MANAGER}
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? resolvedAuthLabel : resolvedUnAuthLabel
      }
      altTitle={altTitle}
      payload={payload}
      brand={brand}
    />
  );
};

export default ShareAccountWithDimo;
