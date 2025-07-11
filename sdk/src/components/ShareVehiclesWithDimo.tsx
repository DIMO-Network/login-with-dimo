import React from 'react';

import BaseDimoButton from './BaseDimoButton';
import { EntryState, EventTypes } from '@enums/index';
import {
  ButtonLabels,
  BaseButtonProps,
  LoginButtonProps,
} from '@dimo-types/index';

type ShareVehiclesWithDimoProps = BaseButtonProps &
  LoginButtonProps &
  ButtonLabels;

const ShareVehiclesWithDimo: React.FC<ShareVehiclesWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  permissionTemplateId,
  vehicles,
  vehicleMakes,
  onboarding,
  expirationDate,
  authenticatedLabel = 'Share Vehicles with DIMO',
  unAuthenticatedLabel = 'Sign in to Share Vehicles with DIMO',
  utm = null,
  altTitle,
  powertrainTypes
}) => {
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
      payload={{
        permissionTemplateId,
        vehicles,
        vehicleMakes,
        onboarding,
        expirationDate,
        eventType: EventTypes.SHARE_VEHICLES_DATA,
        utm,
        powertrainTypes
      }}
    />
  );
};

export default ShareVehiclesWithDimo;
