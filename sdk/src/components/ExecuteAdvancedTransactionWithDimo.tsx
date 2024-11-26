import React from "react";
import BaseDimoButton from "./BaseDimoButton";
import { EntryState } from "../enums/globalEnums";
import { TransactionData } from "../types/TransactionData";
import { Abi } from "viem"; // Assuming `Abi` is imported from viem types

interface ExecuteAdvancedTransactionProps {
  mode: "popup" | "embed" | "redirect";
  onSuccess: (data: {
    token: string;
    transactionHash?: string;
    transactionReceipt?: any;
  }) => void; // Success callback
  onError: (error: Error) => void; // Error callback
  address: string;
  value: string;
  abi: Abi;
  functionName: string;
  args: string[];
}

const ExecuteAdvancedTransactionWithDimo: React.FC<
  ExecuteAdvancedTransactionProps
> = ({ mode, onSuccess, onError, address, value, abi, functionName, args }) => {
  if (!address || !value || !abi || !functionName || !args) {
    throw new Error("Missing required transaction parameters.");
  }
  const transactionData: TransactionData = {
    address,
    value, // BigInt to string
    abi,
    functionName,
    args,
  };

  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.ADVANCED_TRANSACTION} // Set entry state for permissions flow
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={() => "Execute Advanced Transaction with Dimo"}
      transactionData={transactionData}
    />
  );
};

export default ExecuteAdvancedTransactionWithDimo;
