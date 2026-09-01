import 'server-only';
import { getDatabase } from '@/lib/mongodb';
import { TenantBrandConfig, getTenantConfig } from '@/lib/tenant-config';

export async function checkTenantValidityDb(slug?: string): Promise<{
  isValid: boolean;
  isSuspended: boolean;
  config: TenantBrandConfig | null;
}> {
  if (!slug) return { isValid: false, isSuspended: false, config: null };
  const clean = slug.toLowerCase().trim();

  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('tenants').findOne({
        $or: [
          { slug: clean },
          { primaryDomain: clean },
          { 'domains.domain': clean },
        ],
      });
      if (doc) {
        if (doc.status === 'deleted') {
          return { isValid: false, isSuspended: false, config: null };
        }
        const isSuspended = doc.status === 'suspended';
        const { _id, ...cleanConfig } = doc;
        return {
          isValid: true,
          isSuspended,
          config: cleanConfig as TenantBrandConfig,
        };
      }
    }
  } catch (err) {
    console.warn('MongoDB tenant check warning:', err);
  }

  // Graceful fallback for standard tenants
  const fallback = getTenantConfig(clean);
  return { isValid: true, isSuspended: false, config: fallback };
}
