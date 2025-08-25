import React, { useState, useEffect } from 'react';
import { Input, Select } from './components';

import {
  DimoSDKModes,
  ExecuteAdvancedTransactionWithDimo,
  initializeDimoSDK,
  LoginWithDimo,
  LogoutWithDimo,
  Permissions,
  ShareVehiclesWithDimo,
  useDimoAuthState,
} from '@dimo-network/login-with-dimo';

import { sampleAbi } from './abi/sample-abi';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import './App.css';

const sampleExpirationDate = new Date(Date.UTC(2025, 11, 11, 18, 51)); // Note: Month is zero-based

interface DimoConfig {
  clientId: string;
  redirectUri: string;
  environment: 'production' | 'development';
  apiKey: string;
}

const STORAGE_KEY = 'dimoConfig';

const loadConfigFromStorage = (): DimoConfig | null => {
  try {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.error('Failed to load config from localStorage', error);
  }
  return null;
};

const saveConfigToStorage = (config: DimoConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save config to localStorage', error);
  }
};

interface ConfigFormProps {
  onConfigSave: (config: DimoConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ConfigForm = ({ onConfigSave, isOpen, onClose }: ConfigFormProps) => {
  const [config, setConfig] = useState<DimoConfig>(() => {
    const savedConfig = loadConfigFromStorage();
    return (
      savedConfig || {
        clientId: process.env.REACT_APP_DIMO_CLIENT_ID || '',
        redirectUri: process.env.REACT_APP_DIMO_REDIRECT_URI || '',
        environment:
          (process.env.REACT_APP_DIMO_ENV as 'production' | 'development') ||
          'development',
        apiKey: process.env.REACT_APP_DIMO_API_KEY || '',
      }
    );
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfigToStorage(config);
    onConfigSave(config);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        maxWidth: '90%',
        width: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ margin: 0 }}>DIMO Configuration</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            color: '#666',
          }}
        >
          ×
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        <Input
          id="clientId"
          name="clientId"
          label="Client ID"
          type="text"
          value={config.clientId}
          onChange={handleChange}
          required
        />

        <Input
          id="redirectUri"
          name="redirectUri"
          label="Redirect URI"
          type="url"
          value={config.redirectUri}
          onChange={handleChange}
          required
        />

        <Input
          id="apiKey"
          name="apiKey"
          label="API Key"
          type="password"
          value={config.apiKey}
          onChange={handleChange}
          required
        />

        <Select
          id="environment"
          name="environment"
          label="Environment"
          value={config.environment}
          onChange={handleChange}
          options={[
            { value: 'development', label: 'Development' },
            { value: 'production', label: 'Production' },
          ]}
          required
        />

        <button
          type="submit"
          style={{
            padding: '12px',
            marginTop: '10px',
            cursor: 'pointer',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
          }}
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};

function App() {
  const [permissionsEnabled, setPermissionsEnabled] = useState(false);
  const [forceEmail, setForceEmail] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<DimoConfig>(() => {
    const savedConfig = loadConfigFromStorage();
    return (
      savedConfig || {
        clientId: process.env.REACT_APP_DIMO_CLIENT_ID || '',
        redirectUri: process.env.REACT_APP_DIMO_REDIRECT_URI || '',
        environment:
          (process.env.REACT_APP_DIMO_ENV as 'production' | 'development') ||
          'development',
        apiKey: process.env.REACT_APP_DIMO_API_KEY || '',
      }
    );
  });

  useEffect(() => {
    if (config.clientId && config.redirectUri && config.apiKey) {
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
    setShowConfig(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <h1>DIMO Login Example</h1>
          <button
            onClick={() => setShowConfig(!showConfig)}
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
        </div>
        <ConfigForm
          onConfigSave={handleConfigSave}
          isOpen={showConfig}
          onClose={() => setShowConfig(false)}
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
