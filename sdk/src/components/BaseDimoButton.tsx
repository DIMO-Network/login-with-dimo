import React, { type FC } from 'react';

import { popupAuth } from '@auth/popupAuth';
import { redirectAuth } from '@auth/redirectAuth';
import { getDimoConfig } from '../config/sdkConfig';
import { EntryState, DimoSDKModes } from '@enums/index';
import '../styles/BaseDimoButton.css';
import {
  DimoAuthProvider,
  useDimoAuthState,
  useDimoAuthUpdater,
} from '@auth/context/DimoAuthContext';
import {
  BaseButtonProps,
  LoginButtonProps,
  AuthPayload,
  DimoActionPayload,
} from '@dimo-types/index';
import { getDimoLoginUrl } from '../utils/url';

interface BaseDimoButtonOptions extends BaseButtonProps {
  buttonLabel: (authenticated: boolean) => string;
  entryState: EntryState;
  disableIfAuthenticated?: boolean;
  payload: DimoActionPayload;
}

type BaseDimoButtonProps = BaseDimoButtonOptions & LoginButtonProps;

export const BaseDimoButton: FC<BaseDimoButtonProps> = ({
  mode,
  entryState,
  onSuccess,
  onError,
  buttonLabel,
  disableIfAuthenticated = false,
  altTitle = false,
  payload,
}) => {
  const { clientId, redirectUri, apiKey, environment, options } =
    getDimoConfig();

  const { isAuthenticated } = useDimoAuthState();
  const { setAuthenticated } = useDimoAuthUpdater();

  const dimoLogin = getDimoLoginUrl(environment!);

  const basePayload: AuthPayload = {
    entryState,
    onSuccess,
    onError,
    setAuthenticated,
    altTitle,
    dimoLogin,
    clientId,
    redirectUri,
    apiKey,
    forceEmail: options?.forceEmail ?? false,
  };

  const handleButtonClick = () => {
    switch (mode) {
      case DimoSDKModes.POPUP:
        popupAuth(basePayload, payload);
        break;
      case DimoSDKModes.REDIRECT:
        redirectAuth(basePayload, payload);
        break;
      default:
        console.error('Unsupported mode for button click');
    }
  };

  return (
    <DimoAuthProvider>
      <div>
        <button
          className="custom-button"
          disabled={isAuthenticated && disableIfAuthenticated}
          onClick={handleButtonClick}
        >
          <svg
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 13.0041H11.077C13.4042 13.0041 15.2272 11.2785 15.2272 9.07558C15.2272 6.87266 13.3665 4.99755 11.0787 4.99755H5.4982C4.97342 4.99755 4.54296 5.42387 4.54296 5.9436V11.8169H0V5.75847C0 2.85918 2.3821 0.5 5.30955 0.5H11.3102C16.1019 0.5 20 4.34704 20 9.07388C20 13.8007 16.1825 17.5 11.3102 17.5H0V13.0024V13.0041Z"
              fill="black"
            />
          </svg>
          <span className="button-label">{buttonLabel(isAuthenticated)}</span>
        </button>
      </div>
    </DimoAuthProvider>
  );
};

export default BaseDimoButton;
