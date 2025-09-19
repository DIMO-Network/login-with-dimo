import React, { useState, useEffect } from 'react';
import { DimoSDKModes, initializeDimoSDK } from '@dimo-network/login-with-dimo';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

import { ConfigForm, Examples, UserData } from './components';
import { STORAGE_KEY } from './constants';
import { DimoConfig } from './types';

import './App.css';

const App = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [config, setConfig] = useState<DimoConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const envConfig = {
      environment:
        (process.env.REACT_APP_DIMO_ENV as 'production' | 'development') ||
        'development',
      apiKey: process.env.REACT_APP_DIMO_API_KEY || '',
      enableVehicleManager: false,
      forceEmail: false,
    };

    if (saved) {
      const savedConfig = JSON.parse(saved);
      return {
        ...savedConfig,
        ...envConfig, // Always use env values for these fields
        enableVehicleManager: savedConfig.enableVehicleManager || false,
        forceEmail: savedConfig.forceEmail || false,
      };
    }

    return {
      clientId: process.env.REACT_APP_DIMO_CLIENT_ID || '',
      redirectUri: process.env.REACT_APP_DIMO_REDIRECT_URI || '',
      ...envConfig,
    };
  });
  const [isConfigOpen, setConfigOpen] = useState(false);

  useEffect(() => {
    const { clientId, redirectUri, environment, apiKey, forceEmail } = config;
    if (clientId && redirectUri) {
      initializeDimoSDK({
        clientId,
        redirectUri,
        environment,
        apiKey,
        options: {
          forceEmail,
        },
      });
      setIsConfigured(true);
    }
  }, [config]);

  const handleConfigSave = (newConfig: DimoConfig) => {
    setConfig(newConfig);
    window.location.reload();
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>DIMO Login Example</h1>
        </div>

        <button
          onClick={() => setConfigOpen(!isConfigOpen)}
          className="settings-button"
          title="Settings"
        >
          <Cog6ToothIcon className="settings-icon" />
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
        {isConfigured ? (
          <>
            <UserData />
            <Examples
              loginType={DimoSDKModes.POPUP}
              permissionsEnabled={!!config.enableVehicleManager}
            />
            <Examples
              loginType={DimoSDKModes.REDIRECT}
              permissionsEnabled={!!config.enableVehicleManager}
            />
          </>
        ) : (
          <p>Please configure your DIMO credentials to continue</p>
        )}
      </header>
    </div>
  );
};

export default App;
