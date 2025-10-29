import React, { useState } from 'react';

import { Input } from '../';
import { loadConfigFromStorage, saveConfigToStorage } from '../../utils';
import { DimoConfig } from '../../types';

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

  // Get environment and apiKey from environment variables
  const environment =
    (process.env.REACT_APP_DIMO_ENV as 'production' | 'development') ||
    'development';
  const apiKey = process.env.REACT_APP_DIMO_API_KEY || '';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, checked, value } = e.target as HTMLInputElement;
    setConfig((prev: DimoConfig) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

          <input type="hidden" name="environment" value={environment} />
          <input type="hidden" name="apiKey" value={apiKey} />

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="enableVehicleManager"
                checked={!!config.enableVehicleManager}
                onChange={handleChange}
              />
              Enable Vehicle Manager as entry state
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="forceEmail"
                checked={!!config.forceEmail}
                onChange={handleChange}
              />
              Force Email
            </label>
          </div>

          <button type="submit" className="submit-button">
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
};
