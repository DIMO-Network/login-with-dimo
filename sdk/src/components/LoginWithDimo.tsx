import React from 'react';

import BaseDimoButton from './BaseDimoButton';
import { EntryState, EventTypes } from '@enums/index';
import {
  ButtonLabels,
  BaseButtonProps,
  LoginButtonProps,
} from '@dimo-types/index';

type LoginWithDimoProps = BaseButtonProps & LoginButtonProps & ButtonLabels;

const LoginWithDimo: React.FC<LoginWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  permissionTemplateId,
  vehicles,
  vehicleMakes,
  onboarding,
  expirationDate,
  authenticatedLabel = 'Manage DIMO Account',
  unAuthenticatedLabel = 'Continue with DIMO',
  utm = null,
  altTitle,
}) => {
  return (
    <BaseDimoButton
      mode={mode}
      entryState={
        permissionTemplateId
          ? EntryState.VEHICLE_MANAGER
          : EntryState.EMAIL_INPUT
      }
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? authenticatedLabel : unAuthenticatedLabel
      }
      disableIfAuthenticated={false}
      altTitle={altTitle}
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

export default LoginWithDimo;
