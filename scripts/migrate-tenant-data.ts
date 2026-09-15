import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local if not already loaded
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.substring(0, eqIdx).trim();
      const val = trimmed.substring(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const uri = process.env.MONGODB_URI || process.env.MONGO_URI || '';
if (!uri) {
  console.error('❌ MONGODB_URI not found in environment or .env.local');
  process.exit(1);
}

// Collections that belong strictly to platform (DO NOT MIGRATE TO TENANT DBs)
const PLATFORM_COLLECTIONS = new Set([
  'platform_tenants_registry',
  'tenants',
  'users',
  'platform_activities',
  'platform_broadcasts',
  'platform_modules',
  'platform_roadmap',
  'platform_telemetry',
  'saas_reviews',
  'store_domains',
  'store_environments',
  'storefronts',
  'storefront_versions',
]);

async function runMigration() {
  console.log('🔄 Connecting to MongoDB Cluster...');
  const client = new MongoClient(uri);
  await client.connect();
  console.log('✅ Connected successfully.');

  const platformDb = client.db('mavenco_platform');

  // 1. Discover all tenants from platform registry and tenants collection
  const tenantsSet = new Set<string>();

  try {
    const platformTenants = await platformDb.collection('platform_tenants_registry').find({}).toArray();
    for (const t of platformTenants) {
      const slug = (t.slug || t.tenantId || '').replace(/^store_/, '').toLowerCase().trim();
      if (slug) tenantsSet.add(slug);
    }
  } catch (err) {
    console.warn('Could not read platform_tenants_registry:', err);
  }

  try {
    const tenantsList = await platformDb.collection('tenants').find({}).toArray();
    for (const t of tenantsList) {
      const slug = (t.slug || t.id || '').replace(/^store_/, '').toLowerCase().trim();
      if (slug) tenantsSet.add(slug);
    }
  } catch (err) {
    console.warn('Could not read tenants collection:', err);
  }

  // Also include default standard tenants
  tenantsSet.add('gever');
  tenantsSet.add('jq-trends');

  // Discover all distinct tenant slugs across collections
  const candidateFields = ['tenantSlug', 'tenantId', 'storeSlug'];
  const allColls = await platformDb.listCollections().toArray();
  for (const c of allColls) {
    if (PLATFORM_COLLECTIONS.has(c.name) || c.name.startsWith('system.')) continue;
    for (const f of candidateFields) {
      try {
        const distinctVals = await platformDb.collection(c.name).distinct(f);
        for (const v of distinctVals) {
          if (typeof v === 'string') {
            const clean = v.replace(/^store_/, '').toLowerCase().trim();
            if (clean && clean !== 'all' && clean !== 'global' && clean !== 'default') {
              tenantsSet.add(clean);
            }
          }
        }
      } catch {}
    }
  }

  console.log(`\n📋 Discovered Tenants:`, Array.from(tenantsSet));

  // 2. Inspect all collections in mavenco_platform
  const collections = await platformDb.listCollections().toArray();
  console.log(`\n📦 Total collections in mavenco_platform: ${collections.length}`);

  let totalMigrated = 0;

  for (const collInfo of collections) {
    const collName = collInfo.name;
    if (collName.startsWith('system.') || PLATFORM_COLLECTIONS.has(collName)) {
      continue;
    }

    const coll = platformDb.collection(collName);
    const count = await coll.countDocuments();
    if (count === 0) continue;

    console.log(`\n🔍 Checking collection '${collName}' (${count} documents)...`);

    // Scan docs in this collection
    const docs = await coll.find({}).toArray();

    for (const tenantSlug of tenantsSet) {
      const safeTenant = tenantSlug.replace(/^store_/, '').toLowerCase().trim();
      const tenantDbName = `tenant_${safeTenant}`;
      const tenantDb = client.db(tenantDbName);
      const targetColl = tenantDb.collection(collName);

      // Find documents matching this tenant
      const matchedDocs = docs.filter((doc) => {
        const docTenant = (doc.tenantSlug || doc.tenantId || doc.storeSlug || doc.storeId || '')
          .toString()
          .replace(/^store_/, '')
          .toLowerCase()
          .trim();
        return docTenant === safeTenant;
      });

      if (matchedDocs.length > 0) {
        console.log(`  -> Migrating ${matchedDocs.length} docs to ${tenantDbName}.${collName}...`);
        for (const doc of matchedDocs) {
          const { _id, ...docData } = doc;
          const query = doc.id ? { id: doc.id } : { _id };
          await targetColl.updateOne(query, { $set: docData }, { upsert: true });
        }
        totalMigrated += matchedDocs.length;
      }
    }
  }

  // 3. Ensure indexes on each tenant database
  console.log('\n⚡ Ensuring indexes on tenant databases...');
  for (const tenantSlug of tenantsSet) {
    const safeTenant = tenantSlug.replace(/^store_/, '').toLowerCase().trim();
    const tenantDbName = `tenant_${safeTenant}`;
    const tenantDb = client.db(tenantDbName);

    try {
      await Promise.allSettled([
        tenantDb.collection('products').createIndex({ id: 1 }, { sparse: true }),
        tenantDb.collection('products').createIndex({ slug: 1 }, { sparse: true }),
        tenantDb.collection('orders').createIndex({ id: 1 }, { sparse: true }),
        tenantDb.collection('orders').createIndex({ orderNumber: 1 }, { sparse: true }),
        tenantDb.collection('customers').createIndex({ email: 1 }, { sparse: true }),
        tenantDb.collection('collections').createIndex({ id: 1 }, { sparse: true }),
        tenantDb.collection('categories').createIndex({ id: 1 }, { sparse: true }),
        tenantDb.collection('cms_pages').createIndex({ slug: 1 }, { sparse: true }),
      ]);
    } catch {}
  }

  console.log(`\n🎉 Migration completed! Total documents migrated into tenant DBs: ${totalMigrated}`);
  await client.close();
}

runMigration().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
