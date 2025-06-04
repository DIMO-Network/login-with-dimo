import { PERMISSIONS } from '../enums/permission.enum';
import { Permission } from '../types/common.types';

// Supported base permissions templates
const DEFAULT_PERMISSIONS: Permission[] = [
  PERMISSIONS.NONLOCATION_TELEMETRY,
  PERMISSIONS.CURRENT_LOCATION,
  PERMISSIONS.ALLTIME_LOCATION,
  PERMISSIONS.CREDENTIALS,
  PERMISSIONS.STREAMS,
];

export const mapTemplateToPermissions = (
  permissionTemplateId?: string
): Permission[] => {
  const permissions = [...DEFAULT_PERMISSIONS];

  if (permissionTemplateId === '1') {
    permissions.push(PERMISSIONS.COMMANDS);
  }

  return permissions;
};

export const getPermissionsBinary = (
  permissions?: Permission[],
  permissionTemplateId?: string
): { permissions?: string } => {
  if (!permissions && !permissionTemplateId) {
    return {};
  }

  const permissionsToUse = permissions || mapTemplateToPermissions(permissionTemplateId);
  return {
    permissions: permissionsToBinary(permissionsToUse),
  };
};

export const permissionsToBinary = (permissions: Permission[] = []): string => {
  const permissionKeys = Object.keys(PERMISSIONS) as Permission[];
  const permissionSet = new Set(permissions);

  return permissionKeys
    .map((permission) => (permissionSet.has(permission) ? '1' : '0'))
    .join('');
};
