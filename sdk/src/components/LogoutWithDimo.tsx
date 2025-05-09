import React from 'react';

import { EntryState, EventTypes } from '@enums/index';
import { BaseButtonProps } from '@dimo-types/base';

import BaseDimoButton from './BaseDimoButton';

type LogoutWithDimoProps = BaseButtonProps;

const LogoutWithDimo: React.FC<LogoutWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
}) => {
  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.LOGOUT}
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={() => 'Logout'}
      disableIfAuthenticated={false}
      payload={{
        eventType: EventTypes.LOGOUT,
      }}
    />
  );
};

export default LogoutWithDimo;
