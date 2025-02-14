import { EntryState } from "../enums/globalEnums";
import { BasePayload } from "../types/BasePayload";
import { TransactionData } from "../types/TransactionData";

export const redirectAuth = (payload: BasePayload, data?: any) => {
  //TODO: Can probably be cleaned up to prevent having to manually parse out everything

  const { clientId, redirectUri, entryState, dimoLogin, forceEmail } = payload;

  const {
    permissionTemplateId,
    vehicles,
    vehicleMakes,
    expirationDate,
    transactionData,
  } = data;

  const params = new URLSearchParams();

  if (clientId) params.append("clientId", clientId);
  if (redirectUri) params.append("redirectUri", redirectUri);
  if (permissionTemplateId)
    params.append("permissionTemplateId", permissionTemplateId);
  if (entryState) params.append("entryState", entryState);
  if (vehicles && vehicles.length > 0) {
    vehicles.forEach((vehicle: string) => params.append("vehicles", vehicle));
  }

  if (vehicleMakes && vehicleMakes.length > 0) {
    vehicleMakes.forEach((vehicleMake: string) =>
      params.append("vehicleMakes", vehicleMake),
    );
  }

  if (expirationDate) {
    params.append("expirationDate", expirationDate);
  }

  // Serialize and encode transactionData
  if (transactionData) {
    const serializedTransactionData = encodeURIComponent(
      JSON.stringify(transactionData),
    );

    if (serializedTransactionData.length > 1000) {
      console.warn(
        "Serialized transactionData is too large for a URL parameter.",
      );
    } else {
      params.append("transactionData", serializedTransactionData);
    }
  }

  // Use forceEmail from payload
  if (forceEmail) {
    params.append("forceEmail", "true");
  }

  // Construct the full URL
  window.location.href = `${dimoLogin}?${params.toString()}`;
};
