import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
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
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

// Known tenant display names and configurations
const KNOWN_TENANTS: Record<string, { name: string; email?: string; planId?: string; planName?: string }> = {
  'apexathletics': { name: 'Apex Athletics', email: 'marcus@apexathletics.com', planId: 'plan_growth', planName: 'Professional Scale' },
  'auraliving': { name: 'Aura Living', email: 'elena@auraliving.com', planId: 'plan_growth', planName: 'Professional Scale' },
  'demo': { name: 'Demo Store', email: 'demo@mavenco.com', planId: 'plan_starter', planName: 'Starter Boutique' },
  'ever_6477': { name: 'Ever Store', email: 'admin@ever.com', planId: 'plan_growth', planName: 'Professional Scale' },
  'gever': { name: 'Gever', email: 'admin@gever.com', planId: 'plan_growth', planName: 'Professional Scale' },
  'jq-trends': { name: 'JQ Trends', email: 'aanya.kapoor@example.com', planId: 'plan_enterprise', planName: 'Enterprise SaaS Tier' },
  'lumina': { name: 'Lumina Luxury', email: 'admin@lumina.com', planId: 'plan_enterprise', planName: 'Enterprise SaaS Tier' },
  'muskan-clothing': { name: 'Muskan Clothing', email: 'muskan@clothing.com', planId: 'plan_starter', planName: 'Starter Boutique' },
  'muskan-clothing-store': { name: 'Lumina Luxury Flagship', email: 'admin@muskan.com', planId: 'plan_growth', planName: 'Professional Scale' },
  'wqa': { name: 'WQA Store', email: 'admin@wqa.com', planId: 'plan_growth', planName: 'Professional Scale' },
  'yashar-bhai': { name: 'Yashar Bhai', email: 'yashar@bhai.com', planId: 'plan_growth', planName: 'Professional Scale' },
  'yashar-clothing-store': { name: 'Yashar Clothing Store', email: 'yashar@clothing.com', planId: 'plan_growth', planName: 'Professional Scale' },
};

async function syncTenants() {
  console.log('🔄 Connecting to MongoDB Cluster...');
  const client = new MongoClient(uri);
  await client.connect();

  const adminDb = client.db().admin();
  const dbsList = await adminDb.listDatabases();
  const tenantDbs = dbsList.databases.filter((d) => d.name.startsWith('tenant_'));

  console.log(`\n📦 Found ${tenantDbs.length} tenant databases in MongoDB Cluster:`);
  for (const d of tenantDbs) {
    console.log(` - ${d.name}`);
  }

  const platformDb = client.db('mavenco_platform');
  const now = new Date().toISOString();
  let synced = 0;

  for (const d of tenantDbs) {
    const rawSlug = d.name.replace(/^tenant_/, '').trim().toLowerCase();
    const known = KNOWN_TENANTS[rawSlug] || {};
    const autoName = known.name || rawSlug
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const ownerEmail = known.email || `admin@${rawSlug}.com`;
    const planId = known.planId || 'plan_growth';
    const planName = known.planName || 'Professional Scale';

    const tenantRecord = {
      id: `store_${rawSlug}`,
      tenantId: rawSlug,
      slug: rawSlug,
      name: autoName,
      status: 'active',
      databaseIdentifier: d.name,
      databaseName: d.name,
      planId,
      planName,
      storesCount: 1,
      customDomainsCount: 1,
      currency: 'USD',
      ownerName: 'Store Administrator',
      ownerEmail,
      contact: {
        email: ownerEmail,
      },
      primaryDomain: `${rawSlug}.com`,
      updatedAt: now,
    };

    await Promise.all([
      platformDb.collection('platform_tenants_registry').updateOne(
        { $or: [{ slug: rawSlug }, { tenantId: rawSlug }, { id: `store_${rawSlug}` }] },
        { $set: tenantRecord, $setOnInsert: { createdAt: now } },
        { upsert: true }
      ),
      platformDb.collection('tenants').updateOne(
        { $or: [{ slug: rawSlug }, { tenantId: rawSlug }, { id: `store_${rawSlug}` }] },
        { $set: tenantRecord, $setOnInsert: { createdAt: now } },
        { upsert: true }
      ),
    ]);

    synced++;
    console.log(`✅ Synced tenant: ${autoName} (${rawSlug}) -> ${d.name}`);
  }

  console.log(`\n🎉 Synchronized all ${synced} tenants into platform_tenants_registry & tenants!`);
  await client.close();
}

syncTenants().catch((err) => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});
