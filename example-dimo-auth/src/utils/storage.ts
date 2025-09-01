import { DimoConfig } from '../types';
import { STORAGE_KEY } from '../constants';

export const loadConfigFromStorage = (): DimoConfig | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const saveConfigToStorage = (config: DimoConfig): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};
