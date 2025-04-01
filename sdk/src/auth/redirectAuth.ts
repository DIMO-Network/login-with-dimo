import {
  BasePayload,
  BasePayloadParams,
  TransactionData,
  DimoActionPayload,
} from '@dimo-types/index';

type RedirectAuthData = BasePayloadParams & DimoActionPayload;

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
  transactionData: TransactionData | string | undefined
) => {
  if (!transactionData) return undefined;
  if (typeof transactionData === 'string') return transactionData;

  const serializedTransactionData = encodeURIComponent(
    JSON.stringify(transactionData)
  );

  if (serializedTransactionData.length > 1000) {
    console.warn(
      'Serialized transactionData is too large for a URL parameter.'
    );
    return undefined;
  }

  return serializedTransactionData;
};

export const redirectAuth = (payload: BasePayload, data: DimoActionPayload) => {
  const { dimoLogin } = payload;

  const baseData: RedirectAuthData = {
    ...payload,
    ...data,
    transactionData: transformTransactionData(data.transactionData),
  };

  const params = new URLSearchParams();

  addParams(baseData, params, [
    'altTitle',
    'clientId',
    'entryState',
    'expirationDate',
    'forceEmail',
    'permissionTemplateId',
    'redirectUri',
    'transactionData',
    'utm',
    'vehicleMakes',
    'onboarding',
    'vehicles',
  ]);

  // Construct the full URL
  window.location.href = `${dimoLogin}?${params.toString()}`;
};
