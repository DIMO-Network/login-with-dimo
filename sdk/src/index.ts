// Export components
export { default as LoginWithDimo } from './components/LoginWithDimo';
export { default as ShareVehiclesWithDimo } from './components/ShareVehiclesWithDimo';
export { default as ShareAccountWithDimo } from './components/ShareAccountWithDimo';
export { default as ExecuteAdvancedTransactionWithDimo } from './components/ExecuteAdvancedTransactionWithDimo';
export { default as SignMessageWithDimo } from './components/SignMessageWithDimo';
export { default as LogoutWithDimo } from './components/LogoutWithDimo';

// Export config initialization
export { initializeDimoSDK, getDimoConfig, getBrand } from './config/sdkConfig';

export {
  useDimoAuthState,
  DimoAuthProvider,
} from './auth/context/DimoAuthContext';

// Brand hook + types — auto-themes the button from dev-console-api at init.
export { useDimoAuthBrand } from './hooks/useDimoAuthBrand';
export type { OemBrand } from './utils/devConsoleApi';
export type { BrandOverride } from './types/ui.types';

// Export enums
export { EntryState, DimoSDKModes, Permissions } from '@enums/index';
