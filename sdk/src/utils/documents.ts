import { DocumentAccess } from '../enums/documents.enum';
import { CloudEventAgreement } from '../types/common.types';

const DOCUMENT_EVENT_TYPES: readonly string[] = Object.values(DocumentAccess);

// Only exact duplicates share a key, so dedupe never lets one request
// replace a different one.
const agreementKey = ({ eventType, ids, tags }: CloudEventAgreement) =>
  JSON.stringify([
    eventType,
    [...(ids ?? [])].sort(),
    [...(tags ?? [])].sort(),
  ]);

// Buttons re-render often; say each thing once.
const warned = new Set<string>();
const warnOnce = (message: string) => {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`login-with-dimo: ${message}`);
};

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === 'string');

const isDocumentEventType = (value: unknown): value is DocumentAccess =>
  typeof value === 'string' && DOCUMENT_EVENT_TYPES.includes(value);

// Why DIMO login would drop this cloudEvents entry, if it would. Same rules as
// its toCloudEventAgreements, which only warns in the popup's console.
const rejectionReason = (entry: unknown): string | undefined => {
  if (!entry || typeof entry !== 'object') return 'it is not an object';
  const { eventType, ids, source } = entry as Record<string, unknown>;
  if (!isDocumentEventType(eventType)) {
    return `eventType ${JSON.stringify(eventType)} is not one of ${DOCUMENT_EVENT_TYPES.join(', ')}`;
  }
  if (ids !== undefined && !isStringList(ids)) {
    return '`ids` is not a list of strings';
  }
  if (source !== undefined) {
    return "it names a source; access is always to the user's own files";
  }
  return undefined;
};

/**
 * Builds the `cloudEvent` agreements DIMO login signs into each vehicle's grant.
 * `documents` covers the common case; `cloudEvents` narrows a request, e.g. to
 * specific document `ids`. Access is always to the signed-in user's own files:
 * DIMO login sets the source. Entries DIMO login would drop are dropped here,
 * with a warning in the app's console.
 */
export const getCloudEventAgreements = (
  documents: DocumentAccess[] | undefined,
  cloudEvents: CloudEventAgreement[] | undefined,
  hasPermissions: boolean
): { cloudEvent?: CloudEventAgreement[] } => {
  const agreements: CloudEventAgreement[] = [
    ...(documents ?? []).flatMap((eventType) => {
      if (isDocumentEventType(eventType)) {
        return [{ eventType, ids: [], tags: ['documents'] }];
      }
      warnOnce(
        `ignoring documents entry ${JSON.stringify(eventType)}; use a DocumentAccess value.`
      );
      return [];
    }),
    ...(cloudEvents ?? []).flatMap((entry) => {
      const reason = rejectionReason(entry);
      if (reason) {
        warnOnce(`ignoring a cloudEvents entry because ${reason}.`);
        return [];
      }
      const { eventType, ids, tags } = entry;
      // DIMO login signs tags that aren't a list of strings as no tags.
      if (tags !== undefined && !isStringList(tags)) {
        warnOnce('ignoring cloudEvents `tags` that are not a list of strings.');
      }
      return [
        { eventType, ...(ids && { ids }), ...(isStringList(tags) && { tags }) },
      ];
    }),
  ];
  if (!agreements.length) return {};

  if (!hasPermissions) {
    // Documents ride on a vehicle share, which DIMO login only starts when
    // permissions are requested; otherwise the request would be dropped.
    warnOnce(
      '`documents`/`cloudEvents` need `permissions` or `permissionTemplateId`; ignoring them.'
    );
    return {};
  }

  // Drop exact duplicates, however they were requested.
  const unique = new Map(agreements.map((a) => [agreementKey(a), a]));
  return { cloudEvent: Array.from(unique.values()) };
};
