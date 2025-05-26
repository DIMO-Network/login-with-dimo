export interface LogEntry {
  address: string;
  topics: string[];
  data: string;
  blockNumber: number | null;
  transactionHash: string | null;
  transactionIndex: number | null;
  blockHash: string | null;
  logIndex: number | null;
  removed: boolean;
  id?: string;
}

export interface TransactionReceipt {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  from: string;
  to: string | null;
  contractAddress: string | null;
  cumulativeGasUsed: number;
  gasUsed: number;
  effectiveGasPrice: string;
  status?: boolean;
  logs: LogEntry[];
  logsBloom: string;
  type: string;
  confirmations?: number;
}

export interface TransactionData {
  address: string;
  value: string;
  abi: AbiItem[];
  functionName: string;
  args: string[];
}

export interface AbiItem {
  inputs?: Array<{ name: string; type: string; indexed?: boolean }>;
  outputs?: Array<{ name: string; type: string }>;
  name?: string;
  type: string;
  stateMutability?: string;
  anonymous?: boolean;
}

export interface TransactionParams {
  address: string;
  value?: string;
  abi: AbiItem[];
  functionName: string;
  args: string[];
}

export type ExecuteAdvancedTransactionButtonProps = TransactionParams;

