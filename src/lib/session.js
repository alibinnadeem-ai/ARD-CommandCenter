import crypto from 'crypto';

const TOKEN_TTL_SECONDS = 60 * 60 * 12;

function base64urlEncode(value) {
  const source = typeof value === 'string' ? value : JSON.stringify(value);
  return Buffer.from(source)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecode(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function getTokenSecret() {
  const secret = process.env.AUTH_TOKEN_SECRET || process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('AUTH_TOKEN_SECRET is not configured');
  }
  return secret;
}

function signPayload(payload) {
  const secret = getTokenSecret();
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function createAuthToken({ userId, role }) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    userId,
    role,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
    v: 1,
  };

  const payloadEncoded = base64urlEncode(payload);
  const signature = signPayload(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export function verifyAuthToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadEncoded, signature] = parts;
  const expectedSig = signPayload(payloadEncoded);

  // timingSafeEqual requires equal-length buffers
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64urlDecode(payloadEncoded));
    const now = Math.floor(Date.now() / 1000);

    if (!payload?.userId || typeof payload.exp !== 'number' || payload.exp <= now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getBearerToken(request) {
  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return null;
  }
  return authHeader.slice(7).trim();
}
