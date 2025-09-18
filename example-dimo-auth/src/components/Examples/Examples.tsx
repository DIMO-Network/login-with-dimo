import React from 'react';
import {
  DimoSDKModes,
  LoginWithDimo,
  ShareVehiclesWithDimo,
  useDimoAuthState,
} from '@dimo-network/login-with-dimo';
import { AdvancedTransactionButton } from '../AdvancedTransactionButton';

interface ExamplesProps {
  loginType: DimoSDKModes;
  permissionsEnabled?: boolean;
}

const sampleExpirationDate = new Date(Date.UTC(2025, 11, 11, 18, 51)); // Note: Month is zero-based

export const Examples: React.FC<ExamplesProps> = ({
  loginType,
  permissionsEnabled = false,
}) => {
  const onSuccess = (data: unknown) => console.log('Success:', data);
  const onError = (error: unknown) => console.log('Error:', error);
  const { isAuthenticated } = useDimoAuthState();

  return (
    <div>
      <h3>
        {loginType === DimoSDKModes.POPUP ? 'Popup' : 'Redirect'} Examples
      </h3>
      <LoginWithDimo
        mode={loginType}
        onSuccess={onSuccess}
        onError={onError}
        permissionTemplateId={permissionsEnabled ? '1' : undefined}
        utm="dimo"
      />
      {isAuthenticated && (
        <>
          <ShareVehiclesWithDimo
            mode={loginType}
            onSuccess={onSuccess}
            onError={onError}
            permissionTemplateId={'1'}
            expirationDate={sampleExpirationDate.toISOString()}
          />
          <ShareVehiclesWithDimo
            mode={loginType}
            onSuccess={onSuccess}
            onError={onError}
            authenticatedLabel={'Connect a Tesla'}
            permissionTemplateId={'2'}
            onboarding={['tesla']}
          />
          <ShareVehiclesWithDimo
            mode={loginType}
            onSuccess={onSuccess}
            onError={onError}
            authenticatedLabel={'Share ICE vehicles only'}
            permissionTemplateId={'2'}
            onboarding={['ice']}
          />
          <AdvancedTransactionButton loginType={loginType} />
        </>
      )}
    </div>
  );
};
