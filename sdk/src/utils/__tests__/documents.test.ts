/**
 * Smoke test for getCloudEventAgreements.
 *
 * Like ShareAccountWithDimo.test.tsx, this is type-checked by `npm test`
 * (`tsc --noEmit`), since the SDK ships no test runner. The @ts-expect-error
 * line fails that check if CloudEventAgreement accepts an event type DIMO login
 * would drop again. The asserts run under any TS runner, e.g. `npx tsx`.
 */
import { DocumentAccess } from '../../enums/documents.enum';
import { CloudEventAgreement } from '../../types/common.types';
import { getCloudEventAgreements } from '../documents';

// 1. Only the DocumentAccess event types type-check, as enum or string.
const byEnum: CloudEventAgreement = {
  eventType: DocumentAccess.VehicleDocuments,
};
const byValue: CloudEventAgreement = {
  eventType: 'dimo.raw.vehicle.*',
  ids: ['doc-1'],
};
// @ts-expect-error -- DIMO login drops event types the consent screen can't name
const unsupported: CloudEventAgreement = { eventType: 'dimo.attestation' };

// 2. Entries DIMO login would drop are dropped (and warned about) here.
const { cloudEvent = [] } = getCloudEventAgreements(
  [DocumentAccess.VehicleDocuments, 'dimo.document.vehicle' as DocumentAccess],
  [
    byEnum,
    byValue,
    byValue,
    unsupported,
    {
      eventType: DocumentAccess.DriverDocuments,
      ids: 'doc-2' as unknown as string[],
    },
    {
      eventType: DocumentAccess.DriverDocuments,
      source: '0x1111111111111111111111111111111111111111',
    } as CloudEventAgreement,
  ],
  true
);
console.assert(
  JSON.stringify(cloudEvent) ===
    JSON.stringify([
      { eventType: 'dimo.document.vehicle.*', ids: [], tags: ['documents'] },
      { eventType: 'dimo.document.vehicle.*' },
      { eventType: 'dimo.raw.vehicle.*', ids: ['doc-1'] },
    ]),
  'only valid, distinct agreements should be sent'
);

// 3. Without permissions there's no vehicle share to carry them.
console.assert(
  getCloudEventAgreements([DocumentAccess.VehicleDocuments], [], false)
    .cloudEvent === undefined,
  'documents without permissions should be ignored'
);
