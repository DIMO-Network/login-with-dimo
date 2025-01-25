import {
  BasePayload,
  BasePayloadParams,
  TransactionData,
  RedirectAuth,
} from "../types";

type RedirectAuthData = BasePayloadParams & RedirectAuth;

const appendParams = (
  params: URLSearchParams,
  key: string,
  value: RedirectAuthData[keyof RedirectAuthData]
) => {
  if (value) {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else {
      params.append(key, String(value));
    }
  }
};

const addParams = (
  data: RedirectAuthData,
  params: URLSearchParams,
  paramsToAdd: Array<keyof RedirectAuthData>
) => {
  paramsToAdd.forEach((param) => {
    appendParams(params, param, data[param]);
  });
};

const transformTransactionData = (
  transactionData: TransactionData | undefined
) => {
  if (!transactionData) return undefined;

  const serializedTransactionData = encodeURIComponent(
    JSON.stringify(transactionData)
  );

  if (serializedTransactionData.length > 1000) {
    console.warn(
      "Serialized transactionData is too large for a URL parameter."
    );
    return undefined;
  }

  return serializedTransactionData;
};

export const redirectAuth = (payload: BasePayload, data: RedirectAuth = {}) => {
  const { dimoLogin } = payload;

  const baseData = {
    ...payload,
    ...data,
    transactionData: transformTransactionData(data.transactionData),
  } as RedirectAuthData;

  const params = new URLSearchParams();

  addParams(baseData, params, [
    "clientId",
    "entryState",
    "expirationDate",
    "forceEmail",
    "permissionTemplateId",
    "redirectUri",
    "transactionData",
    "vehicleMakes",
    "vehicles",
  ]);

  // Construct the full URL
  window.location.href = `${dimoLogin}?${params.toString()}`;
};
