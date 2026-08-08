import { usePage } from '@inertiajs/react';

export function can(permission, permissions = []) {
  if (!permission) return true;
  const list = Array.isArray(permissions) ? permissions : [];
  if (Array.isArray(permission)) {
    return permission.some((name) => list.includes(name));
  }
  return list.includes(permission);
}

export function hasRole(role, roles = []) {
  if (!role) return true;
  const list = Array.isArray(roles) ? roles : [];
  if (Array.isArray(role)) {
    return role.some((name) => list.includes(name));
  }
  return list.includes(role);
}

export function useCan() {
  const { permissions = [], roles = [] } = usePage().props || {};
  return {
    can: (permission) => can(permission, permissions),
    hasRole: (role) => hasRole(role, roles),
    permissions,
    roles,
  };
}
