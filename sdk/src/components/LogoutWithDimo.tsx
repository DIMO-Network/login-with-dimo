import React from 'react';

import { EntryState, EventTypes } from '@enums/index';
import { BaseButtonProps } from '@dimo-types/index';

import BaseDimoButton from './BaseDimoButton';

type LogoutWithDimoProps = BaseButtonProps & {
  /** Button text. Defaults to "Logout". */
  label?: string;
};

const LogoutWithDimo: React.FC<LogoutWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  label = 'Logout',
  language,
}) => {
  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.LOGOUT}
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={() => label}
      disableIfAuthenticated={false}
      language={language}
      payload={{
        eventType: EventTypes.LOGOUT,
      }}
    />
  );
};

export default LogoutWithDimo;
