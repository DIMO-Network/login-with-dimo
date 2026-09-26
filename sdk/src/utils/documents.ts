import { DocumentAccess } from '../enums/documents.enum';
import { CloudEventAgreement } from '../types/common.types';

// Only exact duplicates share a key, so dedupe never lets one request
// replace a different one.
const agreementKey = ({ eventType, ids, tags }: CloudEventAgreement) =>
  JSON.stringify([
    eventType,
    [...(ids ?? [])].sort(),
    [...(tags ?? [])].sort(),
  ]);

/**
 * Builds the `cloudEvent` agreements DIMO login signs into each vehicle's grant.
 * `documents` covers the common case; `cloudEvents` passes custom agreements
 * through. Access is always to the signed-in user's own files: DIMO login sets
 * the source, and drops entries that name one.
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
      if (!agreement?.eventType) {
        console.warn(
          'login-with-dimo: ignoring a cloudEvents entry without an eventType.'
        );
        return false;
      }
      // JS callers can still pass a source; DIMO login would drop the entry.
      if ('source' in agreement) {
        console.warn(
          "login-with-dimo: ignoring a cloudEvents entry with a source; access is always to the user's own files."
        );
        return false;
      }
      return true;
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
