import React from 'react';

import { EntryState, EventTypes } from '@enums/index';
import {
  BaseButtonProps,
  ButtonLabels,
  DocumentShareParams,
  InternalDimoActionParams,
  LoginButtonProps,
} from '@dimo-types/index';
import { getCloudEventAgreements, getPermissionsBinary } from '@utils/index';
import { useResolvedBrand, formatBrandedLabel } from '@utils/brand';
import { BaseDimoButton } from './BaseDimoButton';

type ShareVehiclesWithDimoProps = BaseButtonProps &
  LoginButtonProps &
  DocumentShareParams &
  ButtonLabels;

const ShareVehiclesWithDimo: React.FC<ShareVehiclesWithDimoProps> = ({
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
  powertrainTypes,
  brandOverride,
}) => {
  const brand = useResolvedBrand(brandOverride);

  const resolvedAuthLabel =
    authenticatedLabel ??
    formatBrandedLabel('Share Vehicles with {name}', brand.name, 'Share Vehicles with DIMO');
  const resolvedUnAuthLabel =
    unAuthenticatedLabel ??
    formatBrandedLabel('Sign in to Share Vehicles with {name}', brand.name, 'Sign in to Share Vehicles with DIMO');

  const payload: InternalDimoActionParams & { eventType: EventTypes } = {
    permissionTemplateId,
    vehicles,
    vehicleMakes,
    onboarding,
    expirationDate,
    eventType: EventTypes.SHARE_VEHICLES_DATA,
    utm,
    powertrainTypes,
    ...getPermissionsBinary(permissions, permissionTemplateId),
    ...getCloudEventAgreements(
      documents,
      cloudEvents,
      !!(permissions?.length || permissionTemplateId)
    ),
  };

  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.VEHICLE_MANAGER}
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

export default ShareVehiclesWithDimo;
