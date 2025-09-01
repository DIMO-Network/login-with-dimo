import React, { useState, useEffect } from 'react';
import { ConfigForm } from './components';

import {
  DimoSDKModes,
  ExecuteAdvancedTransactionWithDimo,
  initializeDimoSDK,
  LoginWithDimo,
  LogoutWithDimo,
  ShareVehiclesWithDimo,
  useDimoAuthState,
} from '@dimo-network/login-with-dimo';

import { sampleAbi } from './abi/sample-abi';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { STORAGE_KEY } from './constants';
import { DimoConfig } from './types';
import './App.css';

const sampleExpirationDate = new Date(Date.UTC(2025, 11, 11, 18, 51)); // Note: Month is zero-based

function App() {
  const [permissionsEnabled, setPermissionsEnabled] = useState(false);
  const [forceEmail, setForceEmail] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [config, setConfig] = useState<DimoConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const envConfig = {
      environment:
        (process.env.REACT_APP_DIMO_ENV as 'production' | 'development') ||
        'development',
      apiKey: process.env.REACT_APP_DIMO_API_KEY || '',
    };

    if (saved) {
      const savedConfig = JSON.parse(saved);
      return { ...savedConfig, ...envConfig }; // Always use env values for these fields
    }

    return {
      clientId: process.env.REACT_APP_DIMO_CLIENT_ID || '',
      redirectUri: process.env.REACT_APP_DIMO_REDIRECT_URI || '',
      ...envConfig,
    };
  });
  const [isConfigOpen, setConfigOpen] = useState(false);

  useEffect(() => {
    if (config.clientId && config.redirectUri) {
      initializeDimoSDK({
        clientId: config.clientId,
        redirectUri: config.redirectUri,
        environment: config.environment,
        apiKey: config.apiKey,
        options: {
          forceEmail,
        },
      });
      setIsConfigured(true);
    }
  }, [config, forceEmail]);

  const handleConfigSave = (newConfig: DimoConfig) => {
    setConfig(newConfig);
    setConfigOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>DIMO Login Example</h1>
        </div>

        <button
          onClick={() => setConfigOpen(!isConfigOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
          }}
          title="Settings"
        >
          <Cog6ToothIcon style={{ width: '24px', height: '24px' }} />
        </button>
        <ConfigForm
          isOpen={isConfigOpen}
          onClose={() => setConfigOpen(false)}
          onConfigSave={handleConfigSave}
          initialConfig={{
            clientId: process.env.REACT_APP_DIMO_CLIENT_ID || '',
            redirectUri: process.env.REACT_APP_DIMO_REDIRECT_URI || '',
            environment:
              (process.env.REACT_APP_DIMO_ENV as
                | 'production'
                | 'development') || 'development',
            apiKey: process.env.REACT_APP_DIMO_API_KEY || '',
          }}
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={permissionsEnabled}
              onChange={() => setPermissionsEnabled(!permissionsEnabled)}
            />
            Enable Vehicle Manager as entry state
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={forceEmail}
              onChange={() => setForceEmail(!forceEmail)}
            />
            Force Email
          </label>
        </div>
        {isConfigured ? (
          <>
            <UserData />
            <Examples
              loginType={DimoSDKModes.POPUP}
              permissionsEnabled={permissionsEnabled}
            />
            <Examples
              loginType={DimoSDKModes.REDIRECT}
              permissionsEnabled={permissionsEnabled}
            />
          </>
        ) : (
          <p>Please configure your DIMO credentials to continue</p>
        )}
      </header>
    </div>
  );
}

interface Props {
  loginType: DimoSDKModes;
  permissionsEnabled?: boolean;
}

const UserData = () => {
  const { isAuthenticated, email, walletAddress } = useDimoAuthState();
  if (!isAuthenticated) return null;
  return (
    <div>
      <p>Connected User</p>
      <p>Wallet Address:{walletAddress}</p>
      {!!email && <p>{email}</p>}
    </div>
  );
};

const Examples = (props: Props) => {
  const { loginType, permissionsEnabled } = props;
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
            // permissions={[
            //   Permissions.GetNonLocationHistory,
            //   Permissions.GetCurrentLocation,
            //   Permissions.GetLocationHistory,
            //   Permissions.GetVINCredential,
            //   Permissions.GetLiveData,
            // ]}
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
            powertrainTypes={['ICE']}
          />
          <ShareVehiclesWithDimo
            mode={loginType}
            onSuccess={onSuccess}
            onError={onError}
            authenticatedLabel={'Share BEV vehicles only'}
            permissionTemplateId={'2'}
            powertrainTypes={['BEV']}
          />
          <AdvancedTransactionButton loginType={loginType} />
          <LogoutWithDimo
            mode={loginType}
            onSuccess={onSuccess}
            onError={onError}
          />
        </>
      )}
    </div>
  );
};

const AdvancedTransactionButton = (props: Pick<Props, 'loginType'>) => {
  const onSuccess = (data: any) => {
    console.log(data);
    console.log('Transaction Hash:', data.transactionHash);
  };
  const onError = (error: unknown) => console.error('Error:', error);
  return (
    <ExecuteAdvancedTransactionWithDimo
      mode={props.loginType}
      onSuccess={onSuccess}
      onError={onError}
      address="0x21cFE003997fB7c2B3cfe5cf71e7833B7B2eCe10"
      abi={sampleAbi}
      functionName="transfer"
      args={['0x62b98e019e0d3e4A1Ad8C786202e09017Bd995e1', '0']}
    />
  );
};

export default App;
