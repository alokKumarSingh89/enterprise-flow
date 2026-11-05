export const PERMISSIONS = {
  project: ["create", "read", "update", "delete"],
  task: ["create", "read", "update", "delete"],
  organization: ["read", "update"],
} as const;

export type Resource = keyof typeof PERMISSIONS;

export type Action<R extends Resource> = (typeof PERMISSIONS)[R][number];

export type Role = "OWNER" | "ADMIN" | "VIEWER";

type PermissionPolicy = {
  [R in Resource]: readonly Action<R>[];
};

export type RolePermissions = {
  [RoleName in Role]: PermissionPolicy;
};

export const ROLE_PERMISSIONS = {
  OWNER: {
    project: ["create", "read", "update", "delete"],
    task: ["create", "read", "update", "delete"],
    organization: ["read", "update"],
  },
  ADMIN: {
    project: ["create", "read", "update"],
    task: ["create", "read", "update"],
    organization: ["read"],
  },
  VIEWER: {
    project: ["read"],
    task: ["read"],
    organization: ["read"],
  },
} as const satisfies RolePermissions;

export function canAccess<R extends Resource>(
  role: Role,
  resource: R,
  action: Action<R>,
): boolean {
  const allowed: readonly string[] = ROLE_PERMISSIONS[role][resource];
  return allowed.includes(action);
}
