import { DocumentAccess } from '../enums/documents.enum';
import { CloudEventAgreement } from '../types/common.types';

// Agreements that grant the same thing: same event type (the signer defaults a
// missing one to 'dimo.attestation'), source and ids. Differing ids are kept
// apart so a narrower request never replaces a broader one.
const agreementKey = ({ eventType, source, ids }: CloudEventAgreement) =>
  JSON.stringify([
    eventType || 'dimo.attestation',
    source?.toLowerCase() ?? '',
    [...(ids ?? [])].sort(),
  ]);

/**
 * Builds the `cloudEvent` agreements DIMO login signs into each vehicle's grant.
 * `documents` covers the common case; `cloudEvents` passes custom agreements
 * through as-is. `source` is left unset: DIMO login fills in the signed-in
 * user's address, which an app can't know before login.
 */
export const getCloudEventAgreements = (
  documents: DocumentAccess[] | undefined,
  cloudEvents: CloudEventAgreement[] | undefined,
  hasPermissions: boolean
): { cloudEvent?: CloudEventAgreement[] } => {
  const agreements: CloudEventAgreement[] = [
    ...(documents ?? []).map((eventType) => ({
      eventType,
      ids: [],
      tags: ['documents'],
    })),
    ...(cloudEvents ?? []),
  ];
  if (!agreements.length) return {};

  if (!hasPermissions) {
    // Documents ride on a vehicle share, which DIMO login only starts when
    // permissions are requested; otherwise the request would be dropped.
    console.warn(
      'login-with-dimo: `documents`/`cloudEvents` need `permissions` or `permissionTemplateId`; ignoring them.'
    );
    return {};
  }

  // Drop exact duplicates, however they were requested.
  const unique = new Map(agreements.map((a) => [agreementKey(a), a]));
  return { cloudEvent: Array.from(unique.values()) };
};
