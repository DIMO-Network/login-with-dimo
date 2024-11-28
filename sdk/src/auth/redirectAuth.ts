import { EntryState } from "../enums/globalEnums";
import { TransactionData } from "../types/TransactionData";

export const redirectAuth = (
  entryState: EntryState,
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  dimoLogin: string,
  clientId?: string,
  redirectUri?: string,
  apiKey?: string, //We don't want to send an API key in the url
  permissionTemplateId?: string,
  vehicles?: string[],
  vehicleMakes?: string[],
  transactionData?: TransactionData // Add transactionData as a parameter
) => {
  // Create URLSearchParams instance
  const params = new URLSearchParams();

  if (clientId) params.append("clientId", clientId);
  if (redirectUri) params.append("redirectUri", redirectUri);
  if (permissionTemplateId)
    params.append("permissionTemplateId", permissionTemplateId);
  if (entryState) params.append("entryState", entryState);
  if (vehicles && vehicles.length > 0) {
    vehicles.forEach((vehicle) => params.append("vehicles", vehicle));
  }

  if (vehicleMakes && vehicleMakes.length > 0) {
    vehicleMakes.forEach((vehicleMake) =>
      params.append("vehicleMakes", vehicleMake)
    );
  }

  // Serialize and encode transactionData
  if (transactionData) {
    const serializedTransactionData = encodeURIComponent(
      JSON.stringify(transactionData)
    );

    if (serializedTransactionData.length > 1000) {
      console.warn(
        "Serialized transactionData is too large for a URL parameter."
      );
    } else {
      params.append("transactionData", serializedTransactionData);
    }
  }

  // Construct the full URL
  window.location.href = `${dimoLogin}?${params.toString()}`;
};
