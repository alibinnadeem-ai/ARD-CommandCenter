import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export function isBcryptHash(value) {
  return typeof value === 'string' && value.startsWith('$2');
}

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(plain, stored) {
  if (!plain || !stored) return false;

  if (isBcryptHash(stored)) {
    return bcrypt.compare(plain, stored);
  }

  return plain === stored;
}
