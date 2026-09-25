import { DocumentAccess } from '../enums/documents.enum';
import { CloudEventAgreement } from '../types/common.types';

/**
 * Builds the `cloudEvent` agreements DIMO login signs into each vehicle's grant.
 * `documents` covers the common case; `cloudEvents` passes custom agreements
 * through as-is. `source` is left unset: DIMO login fills in the signed-in
 * user's address, which an app can't know before login.
 */
export const getCloudEventAgreements = (
  documents?: DocumentAccess[],
  cloudEvents?: CloudEventAgreement[]
): { cloudEvent?: CloudEventAgreement[] } => {
  const agreements: CloudEventAgreement[] = [
    ...(documents ?? []).map((eventType) => ({
      eventType,
      ids: [],
      tags: ['documents'],
    })),
    ...(cloudEvents ?? []),
  ];

  return agreements.length ? { cloudEvent: agreements } : {};
};
