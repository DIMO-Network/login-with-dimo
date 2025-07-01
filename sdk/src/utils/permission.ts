import { Permissions } from '../enums/permission.enum';

// Supported base permissions templates
const DEFAULT_PERMISSIONS: Permissions[] = [
  Permissions.GetNonLocationHistory,
  Permissions.GetCurrentLocation,
  Permissions.GetLocationHistory,
  Permissions.GetVINCredential,
  Permissions.GetLiveData,
];

export const mapTemplateToPermissions = (
  permissionTemplateId?: string
): Permissions[] => {
  const permissions = [...DEFAULT_PERMISSIONS];

  if (permissionTemplateId === '1') {
    permissions.push(Permissions.ExecuteCommands);
  }

  return permissions;
};

export const getPermissionsBinary = (
  permissions?: Permissions[],
  permissionTemplateId?: string
) => {
  if (!permissions && !permissionTemplateId) {
    return {};
  }

  const permissionsToUse =
    Array.isArray(permissions) && permissions.length > 0
      ? permissions
      : mapTemplateToPermissions(permissionTemplateId);

  return {
    permissions: permissionsToBinary(permissionsToUse),
  };
};

export const permissionsToBinary = (permissions: Permissions[] = []): string => {
  const permissionKeys = Object.values(Permissions) as Permissions[];
  const permissionSet = new Set(permissions);

  return permissionKeys
    .map((permission) => (permissionSet.has(permission) ? '1' : '0'))
    .join('');
};
