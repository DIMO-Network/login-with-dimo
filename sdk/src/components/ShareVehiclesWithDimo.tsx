import React from 'react';

import { EntryState, EventTypes } from '@enums/index';
import {
  BaseButtonProps,
  ButtonLabels,
  InternalDimoActionParams,
  LoginButtonProps,
} from '@dimo-types/index';
import { getPermissionsBinary } from '@utils/index';
import { BaseDimoButton } from './BaseDimoButton';

type ShareVehiclesWithDimoProps = BaseButtonProps &
  LoginButtonProps &
  ButtonLabels;

const ShareVehiclesWithDimo: React.FC<ShareVehiclesWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  permissionTemplateId,
  configurationId,
  permissions,
  vehicles,
  vehicleMakes,
  onboarding,
  expirationDate,
  authenticatedLabel = 'Share Vehicles with DIMO',
  unAuthenticatedLabel = 'Sign in to Share Vehicles with DIMO',
  utm = null,
  altTitle,
  powertrainTypes,
}) => {
  const payload: InternalDimoActionParams & { eventType: EventTypes } = {
    permissionTemplateId,
    configurationId,
    vehicles,
    vehicleMakes,
    onboarding,
    expirationDate,
    eventType: EventTypes.SHARE_VEHICLES_DATA,
    utm,
    powertrainTypes,
    ...getPermissionsBinary(permissions, permissionTemplateId),
  };

  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.VEHICLE_MANAGER}
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? authenticatedLabel : unAuthenticatedLabel
      }
      altTitle={altTitle}
      payload={payload}
    />
  );
};

export default ShareVehiclesWithDimo;
