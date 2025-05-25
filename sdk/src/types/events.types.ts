import { DimoSDKModes } from '@enums/index';
import type { TransactionReceipt } from './transaction.types';

export interface MessageData {
  eventType: string;
  token?: string;
  walletAddress?: string;
  email?: string;
  mode?: DimoSDKModes;
  transactionHash?: string;
  transactionReceipt?: TransactionReceipt;
  sharedVehicles?: string[];
  message?: string;
}

export interface MessageHandlerConfig {
  target: Window | null | undefined;
  origin: string;
  mode: DimoSDKModes;
}
