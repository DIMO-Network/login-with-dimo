import { AuthParam } from '@enums/index';
import {
  AuthPayload,
  CloudEventAgreement,
  BaseAuthParams,
  DimoActionPayload,
  SignMessageData,
  TransactionData,
} from '@dimo-types/index';

// Every value here goes into the query string, so cloudEvent is pre-encoded.
type RedirectAuthData = BaseAuthParams &
  Omit<DimoActionPayload, 'cloudEvent'> & { cloudEvent?: string };

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

const transformMessageData = (
  messageData: SignMessageData | string | undefined
) => {
  if (!messageData) return undefined;
  if (typeof messageData === 'string') return messageData;

  const serializedMessageData = encodeURIComponent(JSON.stringify(messageData));

  if (serializedMessageData.length > 1000) {
    console.warn(
      'Serialized messageData is too large for a URL parameter. Pass a 32-byte hash via { raw } instead.'
    );
    return undefined;
  }

  return serializedMessageData;
};

const transformCloudEvent = (cloudEvent: CloudEventAgreement[] | undefined) => {
  if (!cloudEvent) return undefined;
  const serializedCloudEvent = encodeURIComponent(JSON.stringify(cloudEvent));
  // Unlike transactionData this is never dropped: sharing without the requested
  // documents would silently grant less than the app asked for.
  if (serializedCloudEvent.length > 2000) {
    console.warn(
      'Serialized cloudEvent is large for a URL parameter; long `ids` lists may exceed server URL limits.'
    );
  }
  return serializedCloudEvent;
};

export const redirectAuth = (payload: AuthPayload, data: DimoActionPayload) => {
  const { dimoLogin } = payload;

  const baseData: RedirectAuthData = {
    ...payload,
    ...data,
    transactionData: transformTransactionData(data.transactionData),
    messageData: transformMessageData(data.messageData),
    cloudEvent: transformCloudEvent(data.cloudEvent),
  };

  const params = new URLSearchParams();

  addParams(baseData, params, [
    AuthParam.AltTitle,
    AuthParam.BrandName,
    AuthParam.ClientId,
    AuthParam.CloudEvent,
    AuthParam.EntryState,
    AuthParam.ExpirationDate,
    AuthParam.ForceEmail,
    AuthParam.MessageData,
    AuthParam.Onboarding,
    AuthParam.PermissionTemplateId,
    AuthParam.Permissions,
    AuthParam.PowertrainTypes,
    AuthParam.RedirectUri,
    AuthParam.PrivacyPolicyUrl,
    AuthParam.TosUrl,
    AuthParam.TransactionData,
    AuthParam.Utm,
    AuthParam.VehicleMakes,
    AuthParam.Vehicles,
  ]);

  // Construct the full URL
  window.location.href = `${dimoLogin}?${params.toString()}`;
};
