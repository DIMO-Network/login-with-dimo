import React from "react";
import BaseDimoButton from "./BaseDimoButton";
import { EntryState } from "../enums/globalEnums";
import { TransactionData } from "../types/TransactionData";

interface ExecuteAdvancedTransactionProps {
  mode: "popup" | "embed" | "redirect";
  onSuccess: (data: {
    token: string;
    transactionHash?: string;
    transactionReceipt?: any;
  }) => void; // Success callback
  onError: (error: Error) => void; // Error callback
  address: string;
  value?: string;
  abi: any;
  functionName: string;
  args: string[];
}

const ExecuteAdvancedTransactionWithDimo: React.FC<
  ExecuteAdvancedTransactionProps
> = ({ mode, onSuccess, onError, address, value, abi, functionName, args }) => {
  if (!address || !abi || !functionName || !args) {
    throw new Error("Missing required transaction parameters.");
  }
  const transactionData: TransactionData = {
    address,
    value: value ? value : "", // BigInt to string
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
      payload={{ transactionData, eventType:"EXECUTE_ADVANCED_TRANSACTION"}}
    />
  );
};

export default ExecuteAdvancedTransactionWithDimo;
