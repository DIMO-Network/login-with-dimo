export interface DimoConfig {
  clientId: string;
  redirectUri: string;
  environment: 'production' | 'development';
  apiKey: string;
}

export const STORAGE_KEY = 'dimoConfig';

export const loadConfigFromStorage = (): DimoConfig | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const saveConfigToStorage = (config: DimoConfig): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};
