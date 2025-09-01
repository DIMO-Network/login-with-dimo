import React, { useState } from 'react';

import { Input, Select } from '../';
import {
  DimoConfig,
  loadConfigFromStorage,
  saveConfigToStorage,
} from '../../utils/storage';

import './ConfigForm.css';

interface ConfigFormProps {
  onConfigSave: (config: DimoConfig) => void;
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: DimoConfig;
}

export const ConfigForm: React.FC<ConfigFormProps> = ({
  onConfigSave,
  isOpen,
  onClose,
  initialConfig,
}) => {
  const [config, setConfig] = useState<DimoConfig>(() => {
    const savedConfig = loadConfigFromStorage();
    return (
      savedConfig ||
      initialConfig || {
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
    <div className="config-form-overlay">
      <div className="config-form-container">
        <div className="config-form-header">
          <h3>DIMO Configuration</h3>
          <button type="button" className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="config-form-content">
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

          <button type="submit" className="submit-button">
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
};
