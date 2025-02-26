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
  altTitle,
  authenticatedLabel = 'Share Vehicles with DIMO',
  expirationDate,
  mode,
  onError,
  onSuccess,
  permissionTemplateId,
  unAuthenticatedLabel = 'Sign in to Share Vehicles with DIMO',
  vehicleMakes,
  vehicles,
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
      altTitle={altTitle}
      payload={{
        permissionTemplateId,
        vehicles,
        vehicleMakes,
        expirationDate,
        eventType: EventTypes.SHARE_VEHICLES_DATA,
      }}
    />
  );
};

export default ShareVehiclesWithDimo;
