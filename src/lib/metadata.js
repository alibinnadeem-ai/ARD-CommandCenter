import sql from '@/lib/db';

const DEFAULT_ROLES = ['Chairman', 'CEO', 'CFO', 'CSO', 'CISO', 'COO', 'CLO', 'Director', 'Team'];
const DEFAULT_DEPARTMENTS = ['Executive', 'Finance', 'Strategy', 'Investment', 'Operations', 'Legal'];

const normalizeName = value =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';

async function addRoleInternal(name) {
  const clean = normalizeName(name);
  if (!clean) return;

  const existing = await sql`SELECT 1 FROM roles WHERE LOWER(name) = LOWER(${clean}) LIMIT 1`;
  if (existing.length > 0) return;

  await sql`INSERT INTO roles (name) VALUES (${clean})`;
}

async function addDepartmentInternal(name) {
  const clean = normalizeName(name);
  if (!clean) return;

  const existing = await sql`SELECT 1 FROM departments WHERE LOWER(name) = LOWER(${clean}) LIMIT 1`;
  if (existing.length > 0) return;

  await sql`INSERT INTO departments (name) VALUES (${clean})`;
}

async function getRoleById(id) {
  const rows = await sql`SELECT id, name FROM roles WHERE id = ${id} LIMIT 1`;
  return rows[0] || null;
}

async function getDepartmentById(id) {
  const rows = await sql`SELECT id, name FROM departments WHERE id = ${id} LIMIT 1`;
  return rows[0] || null;
}

function sortByDefaults(items, defaults) {
  const rank = new Map(defaults.map((value, index) => [value.toLowerCase(), index]));
  return [...items].sort((a, b) => {
    const aRank = rank.has(a.toLowerCase()) ? rank.get(a.toLowerCase()) : Number.MAX_SAFE_INTEGER;
    const bRank = rank.has(b.toLowerCase()) ? rank.get(b.toLowerCase()) : Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  });
}

export async function ensureMetadataTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS roles (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(64) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS departments (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(64) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE UNIQUE INDEX IF NOT EXISTS roles_name_ci_uniq ON roles (LOWER(name))`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS departments_name_ci_uniq ON departments (LOWER(name))`;

  for (const role of DEFAULT_ROLES) {
    await addRoleInternal(role);
  }

  for (const dept of DEFAULT_DEPARTMENTS) {
    await addDepartmentInternal(dept);
  }

  const [userRoles, userDepts, directiveDepts] = await Promise.all([
    sql`SELECT DISTINCT role FROM users WHERE role IS NOT NULL AND TRIM(role) <> ''`,
    sql`SELECT DISTINCT dept FROM users WHERE dept IS NOT NULL AND TRIM(dept) <> ''`,
    sql`SELECT DISTINCT dept FROM directives WHERE dept IS NOT NULL AND TRIM(dept) <> ''`,
  ]);

  for (const row of userRoles) {
    await addRoleInternal(row.role);
  }

  for (const row of userDepts) {
    await addDepartmentInternal(row.dept);
  }

  for (const row of directiveDepts) {
    await addDepartmentInternal(row.dept);
  }
}

export async function getRoleNames() {
  const rows = await getRoles();
  return rows.map(row => row.name);
}

export async function getDepartmentNames() {
  const rows = await getDepartments();
  return rows.map(row => row.name);
}

export async function getRoles() {
  await ensureMetadataTables();
  const rows = await sql`SELECT id, name FROM roles`;
  const sorted = sortByDefaults(rows.map(row => row.name), DEFAULT_ROLES);
  const byName = new Map(rows.map(row => [row.name, row]));
  return sorted.map(name => ({ id: byName.get(name).id, name }));
}

export async function getDepartments() {
  await ensureMetadataTables();
  const rows = await sql`SELECT id, name FROM departments`;
  const sorted = sortByDefaults(rows.map(row => row.name), DEFAULT_DEPARTMENTS);
  const byName = new Map(rows.map(row => [row.name, row]));
  return sorted.map(name => ({ id: byName.get(name).id, name }));
}

export async function addRole(name) {
  await ensureMetadataTables();
  await addRoleInternal(name);
  return getRoles();
}

export async function addDepartment(name) {
  await ensureMetadataTables();
  await addDepartmentInternal(name);
  return getDepartments();
}

export async function updateRole(id, name) {
  await ensureMetadataTables();
  const clean = normalizeName(name);
  if (!clean) {
    const err = new Error('Role name is required');
    err.code = 'VALIDATION';
    throw err;
  }

  const role = await getRoleById(id);
  if (!role) {
    const err = new Error('Role not found');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const duplicate = await sql`SELECT 1 FROM roles WHERE LOWER(name) = LOWER(${clean}) AND id <> ${id} LIMIT 1`;
  if (duplicate.length > 0) {
    const err = new Error('Role already exists');
    err.code = 'CONFLICT';
    throw err;
  }

  await sql`UPDATE roles SET name = ${clean} WHERE id = ${id}`;
  await sql`UPDATE users SET role = ${clean}, updated_at = NOW() WHERE role = ${role.name}`;

  return getRoles();
}

export async function deleteRole(id) {
  await ensureMetadataTables();
  const role = await getRoleById(id);
  if (!role) {
    const err = new Error('Role not found');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const usageRows = await sql`SELECT count(*)::int AS count FROM users WHERE role = ${role.name}`;
  const usageCount = usageRows[0]?.count || 0;
  if (usageCount > 0) {
    const err = new Error('Role is in use by existing users');
    err.code = 'IN_USE';
    throw err;
  }

  await sql`DELETE FROM roles WHERE id = ${id}`;
  return getRoles();
}

export async function updateDepartment(id, name) {
  await ensureMetadataTables();
  const clean = normalizeName(name);
  if (!clean) {
    const err = new Error('Department name is required');
    err.code = 'VALIDATION';
    throw err;
  }

  const department = await getDepartmentById(id);
  if (!department) {
    const err = new Error('Department not found');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const duplicate = await sql`SELECT 1 FROM departments WHERE LOWER(name) = LOWER(${clean}) AND id <> ${id} LIMIT 1`;
  if (duplicate.length > 0) {
    const err = new Error('Department already exists');
    err.code = 'CONFLICT';
    throw err;
  }

  await sql`UPDATE departments SET name = ${clean} WHERE id = ${id}`;
  await sql`UPDATE users SET dept = ${clean}, updated_at = NOW() WHERE dept = ${department.name}`;
  await sql`UPDATE directives SET dept = ${clean}, updated_at = NOW() WHERE dept = ${department.name}`;

  return getDepartments();
}

export async function deleteDepartment(id) {
  await ensureMetadataTables();
  const department = await getDepartmentById(id);
  if (!department) {
    const err = new Error('Department not found');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const [usersCountRows, directivesCountRows] = await Promise.all([
    sql`SELECT count(*)::int AS count FROM users WHERE dept = ${department.name}`,
    sql`SELECT count(*)::int AS count FROM directives WHERE dept = ${department.name}`,
  ]);

  const usersCount = usersCountRows[0]?.count || 0;
  const directivesCount = directivesCountRows[0]?.count || 0;

  if (usersCount > 0 || directivesCount > 0) {
    const err = new Error('Department is in use by users or directives');
    err.code = 'IN_USE';
    throw err;
  }

  await sql`DELETE FROM departments WHERE id = ${id}`;
  return getDepartments();
}
