// Export components
export { default as LoginWithDimo } from './components/LoginWithDimo';
export { default as ShareVehiclesWithDimo } from './components/ShareVehiclesWithDimo';
export { default as ExecuteAdvancedTransactionWithDimo } from './components/ExecuteAdvancedTransactionWithDimo';
export { default as SignMessageWithDimo } from './components/SignMessageWithDimo';
export { default as LogoutWithDimo } from './components/LogoutWithDimo';

// Export config initialization
export { initializeDimoSDK, getDimoConfig, getBrand } from './config/sdkConfig';

export {
  useDimoAuthState,
  DimoAuthProvider,
} from './auth/context/DimoAuthContext';

// Brand hook + types (auto-themes the button from identity-api).
export { useDimoAuthBrand } from './hooks/useDimoAuthBrand';
export type { ManufacturerBrand } from './utils/identityApi';
export type { BrandOverride } from './types/ui.types';

// Export enums
export { EntryState, DimoSDKModes, Permissions } from '@enums/index';
