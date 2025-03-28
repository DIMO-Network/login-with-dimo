import React from 'react';

import BaseDimoButton from './BaseDimoButton';
import { EntryState, EventTypes } from '@enums/index';
import {
  DynamicButtonLabels,
  BaseButtonProps,
  BaseLoginButtonProps,
} from '@dimo-types/index';

type ShareVehiclesWithDimoProps = BaseButtonProps &
  BaseLoginButtonProps &
  DynamicButtonLabels;

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
}) => {
  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.VEHICLE_MANAGER} // Set entry state for permissions flow
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? authenticatedLabel : unAuthenticatedLabel
      }
      payload={{
        permissionTemplateId,
        vehicles,
        vehicleMakes,
        onboarding,
        expirationDate,
        eventType: EventTypes.SHARE_VEHICLES_DATA,
        utm,
      }}
    />
  );
};

export default ShareVehiclesWithDimo;
