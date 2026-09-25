import { DocumentAccess } from '../enums/documents.enum';
import { CloudEventAgreement } from '../types/common.types';

// Only exact duplicates share a key, so dedupe never lets one request
// replace a different one.
const agreementKey = ({ eventType, source, ids, tags }: CloudEventAgreement) =>
  JSON.stringify([
    eventType,
    source?.toLowerCase() ?? '',
    [...(ids ?? [])].sort(),
    [...(tags ?? [])].sort(),
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
    // DIMO login drops agreements without an eventType (they'd be signed as
    // every attestation), so say so here instead of losing them quietly.
    ...(cloudEvents ?? []).filter((agreement) => {
      if (agreement?.eventType) return true;
      console.warn(
        'login-with-dimo: ignoring a cloudEvents entry without an eventType.'
      );
      return false;
    }),
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
