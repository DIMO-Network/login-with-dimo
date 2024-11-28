export interface TransactionData {
  address: string;
  value: string;
  abi: any; // Serialized ABI
  functionName: string;
  args: string[];
}
