// src/auth/permissions.ts
export type Role = "guest" | "client";

export type Permission =
  | "view:jobs:list"
  | "view:jobs:details"
  | "view:work-contracts:list"
  | "view:work-contracts:details"
  | "view:study-abroad:list"
  | "view:study-abroad:details";

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  guest: ["view:jobs:list", "view:work-contracts:list", "view:study-abroad:list"],
  client: [
    "view:jobs:list",
    "view:jobs:details",
    "view:work-contracts:list",
    "view:work-contracts:details",
    "view:study-abroad:list",
    "view:study-abroad:details",
  ],
};

export function can(role: Role, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}
