import React from 'react';

import BaseDimoButton from './BaseDimoButton';
import { EntryState, EventTypes } from '@enums/index';
import {
  ButtonLabels,
  BaseButtonProps,
  LoginButtonProps,
  DocumentShareParams,
  InternalDimoActionParams,
} from '@dimo-types/index';
import { getCloudEventAgreements, getPermissionsBinary } from '@utils/index';
import { useResolvedBrand, formatBrandedLabel } from '@utils/brand';

type LoginWithDimoProps = BaseButtonProps &
  LoginButtonProps &
  DocumentShareParams &
  ButtonLabels;

const LoginWithDimo: React.FC<LoginWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  permissionTemplateId,
  permissions,
  documents,
  cloudEvents,
  vehicles,
  vehicleMakes,
  onboarding,
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
    formatBrandedLabel('Manage {name} Account', brand.name, 'Manage DIMO Account');
  const resolvedUnAuthLabel =
    unAuthenticatedLabel ??
    formatBrandedLabel('Sign in with {name}', brand.name, 'Continue with DIMO');

  const payload: InternalDimoActionParams & { eventType: EventTypes } = {
    ...getPermissionsBinary(permissions, permissionTemplateId),
    ...getCloudEventAgreements(
      documents,
      cloudEvents,
      !!(permissions?.length || permissionTemplateId)
    ),
    vehicles,
    vehicleMakes,
    onboarding,
    expirationDate,
    eventType: EventTypes.SHARE_VEHICLES_DATA,
    utm,
  };

  return (
    <BaseDimoButton
      mode={mode}
      entryState={
        permissionTemplateId || permissions
          ? EntryState.VEHICLE_MANAGER
          : EntryState.EMAIL_INPUT
      }
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? resolvedAuthLabel : resolvedUnAuthLabel
      }
      disableIfAuthenticated={false}
      altTitle={altTitle}
      payload={payload}
      brand={brand}
    />
  );
};

export default LoginWithDimo;
