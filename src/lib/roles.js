export const SUPER_ADMIN_ROLE = 'Super Admin';
export const CEO_ROLE = 'CEO';
export const LEGACY_CHAIRMAN_ROLE = 'Chairman';

export const DEFAULT_ROLE_ORDER = [
  SUPER_ADMIN_ROLE,
  CEO_ROLE,
  'CFO',
  'CSO',
  'CISO',
  'COO',
  'CLO',
  'Director',
  'Team',
];

export const TOP_LEVEL_ROLES = [SUPER_ADMIN_ROLE, CEO_ROLE];
export const PROTECTED_ROLE_NAMES = [...TOP_LEVEL_ROLES];
export const DEPARTMENT_EXECUTIVE_EXCLUDED_ROLES = [...TOP_LEVEL_ROLES, 'Director', 'Team'];

export function isTopLevelRole(role) {
  return TOP_LEVEL_ROLES.includes(role);
}

export function isProtectedRole(role) {
  return PROTECTED_ROLE_NAMES.includes(role);
}
