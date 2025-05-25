import { DimoSDKModes } from '@enums/index';
import type { TransactionReceipt } from './transaction.types';
import { EventHandlers } from './auth.types';

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

export type EventHandler = (
  data: MessageData,
  handlers: EventHandlers,
  extraData: Record<string, unknown>
) => void;
