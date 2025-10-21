import React from 'react';

import BaseDimoButton from './BaseDimoButton';
import { EntryState, EventTypes } from '@enums/index';
import {
  ButtonLabels,
  BaseButtonProps,
  LoginButtonProps,
  InternalDimoActionParams,
} from '@dimo-types/index';
import { getPermissionsBinary } from '@utils/index';

type LoginWithDimoProps = BaseButtonProps & LoginButtonProps & ButtonLabels;

const LoginWithDimo: React.FC<LoginWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  permissionTemplateId,
  configId,
  permissions,
  vehicles,
  vehicleMakes,
  onboarding,
  expirationDate,
  authenticatedLabel = 'Manage DIMO Account',
  unAuthenticatedLabel = 'Continue with DIMO',
  utm = null,
  altTitle,
}) => {
  const payload: InternalDimoActionParams & { eventType: EventTypes } = {
    ...getPermissionsBinary(permissions, permissionTemplateId),
    configId,
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
        authenticated ? authenticatedLabel : unAuthenticatedLabel
      }
      disableIfAuthenticated={false}
      altTitle={altTitle}
      payload={payload}
    />
  );
};

export default LoginWithDimo;
