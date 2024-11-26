import { Abi } from "viem"; // Assuming `Abi` is imported from viem types


export interface TransactionData {
  address: string;
  value: string;
  abi: Abi; // Serialized ABI
  functionName: string;
  args: string[];
}
