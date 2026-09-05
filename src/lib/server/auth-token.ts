import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'mavenco_commerce_auth_secret_2026';

export interface CustomerTokenPayload {
  id: string;
  email: string;
  tenantSlug: string;
  iat?: number;
  exp?: number;
}

export function generateCustomerToken(customer: { id: string; email: string; tenantSlug?: string }): string {
  const payload: CustomerTokenPayload = {
    id: customer.id,
    email: customer.email.toLowerCase().trim(),
    tenantSlug: (customer.tenantSlug || 'demo').toLowerCase().trim(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(str).digest('base64url');
  return `${str}.${signature}`;
}

export function verifyCustomerToken(token: string): CustomerTokenPayload | null {
  try {
    const clean = token.replace(/^Bearer\s+/i, '').trim();
    const parts = clean.split('.');
    if (parts.length !== 2) return null;
    const [payloadStr, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payloadStr).digest('base64url');
    if (expectedSig !== signature) return null;
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
