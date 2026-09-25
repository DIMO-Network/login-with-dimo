/**
 * Document access a vehicle share can include, as cloudevent type patterns.
 * The DIMO app grants a grantee a vehicle's glovebox when the grant carries one
 * of these for that vehicle. The trailing `*` is a prefix match.
 */
export enum DocumentAccess {
  /** Parsed vehicle documents: registration, insurance, service records, … */
  VehicleDocuments = 'dimo.document.vehicle.*',
  /** Parsed driver documents: license, … */
  DriverDocuments = 'dimo.document.driver.*',
  /** The original uploaded files behind vehicle documents. */
  RawVehicleDocuments = 'dimo.raw.vehicle.*',
  /** The original uploaded files behind driver documents. */
  RawDriverDocuments = 'dimo.raw.driver.*',
}
