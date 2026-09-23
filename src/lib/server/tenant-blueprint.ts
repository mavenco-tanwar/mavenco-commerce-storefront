import { getDatabase, getTenantDatabase } from '@/lib/mongodb';
import { DEMO_PRESETS } from '@/app/api/v1/platform/tenants/publish-demo-presets/presets-data';

export function resolveBlueprintPreset(presetKey: string) {
  const key = (presetKey || 'apparel').toLowerCase().trim();
  const slugMap: Record<string, string> = {
    jewelry: 'demo-jewelry',
    'demo-jewelry': 'demo-jewelry',
    jewels: 'demo-jewelry',
    watches: 'demo-jewelry',
    diamonds: 'demo-jewelry',
    fashion: 'demo-fashion',
    'demo-fashion': 'demo-fashion',
    apparel: 'demo-fashion',
    clothing: 'demo-fashion',
    pret: 'demo-fashion',
    electronics: 'demo-electronics',
    'demo-electronics': 'demo-electronics',
    tech: 'demo-electronics',
    gadgets: 'demo-electronics',
    audio: 'demo-electronics',
    home: 'demo-home',
    'demo-home': 'demo-home',
    decor: 'demo-home',
    furniture: 'demo-home',
    living: 'demo-home',
    nordic: 'demo-home',
    beauty: 'demo-beauty',
    'demo-beauty': 'demo-beauty',
    cosmetics: 'demo-beauty',
    skincare: 'demo-beauty',
    botanicals: 'demo-beauty',
    activewear: 'demo-fitness',
    'demo-fitness': 'demo-fitness',
    fitness: 'demo-fitness',
    sports: 'demo-fitness',
    athletics: 'demo-fitness',
    gym: 'demo-fitness',
    grocery: 'demo-grocery',
    'demo-grocery': 'demo-grocery',
    organics: 'demo-grocery',
    food: 'demo-grocery',
    footwear: 'demo-footwear',
    'demo-footwear': 'demo-footwear',
    shoes: 'demo-footwear',
    sneakers: 'demo-footwear',
    eyewear: 'demo-eyewear',
    'demo-eyewear': 'demo-eyewear',
    glasses: 'demo-eyewear',
    optics: 'demo-eyewear',
    multipurpose: 'demo',
    universal: 'demo',
    megastore: 'demo',
    demo: 'demo',
  };

  const targetSlug = slugMap[key] || (key.startsWith('demo-') ? key : 'demo-fashion');
  return DEMO_PRESETS.find((p) => p.slug === targetSlug) || DEMO_PRESETS[0];
}

export function inferTenantPreset(tenantDoc: any, tenantSlug?: string): string {
  if (tenantDoc?.preset && typeof tenantDoc.preset === 'string') return tenantDoc.preset;
  if (tenantDoc?.category && typeof tenantDoc.category === 'string') return tenantDoc.category;

  const textToScan = [
    tenantSlug || '',
    tenantDoc?.slug || '',
    tenantDoc?.name || '',
    tenantDoc?.tagline || '',
    tenantDoc?.description || '',
    tenantDoc?.categoryLabel || '',
  ]
    .join(' ')
    .toLowerCase();

  if (textToScan.includes('veg') || textToScan.includes('grocery') || textToScan.includes('coffee') || textToScan.includes('superfood') || textToScan.includes('organic')) {
    return 'grocery';
  }
  if (textToScan.includes('jewel') || textToScan.includes('silvora') || textToScan.includes('gold') || textToScan.includes('diamond') || textToScan.includes('watch')) {
    return 'jewelry';
  }
  if (textToScan.includes('volt') || textToScan.includes('electronic') || textToScan.includes('gadget') || textToScan.includes('audio') || textToScan.includes('headphone')) {
    return 'electronics';
  }
  if (textToScan.includes('glow') || textToScan.includes('beauty') || textToScan.includes('cosmetic') || textToScan.includes('skincare') || textToScan.includes('botanica')) {
    return 'beauty';
  }
  if (textToScan.includes('apex') || textToScan.includes('fit') || textToScan.includes('activewear') || textToScan.includes('athletic') || textToScan.includes('gym')) {
    return 'fitness';
  }
  if (textToScan.includes('aura') || textToScan.includes('furniture') || textToScan.includes('decor') || textToScan.includes('living') || textToScan.includes('nordic')) {
    return 'home';
  }
  if (textToScan.includes('kick') || textToScan.includes('shoe') || textToScan.includes('sneaker') || textToScan.includes('footwear') || textToScan.includes('boot')) {
    return 'footwear';
  }
  if (textToScan.includes('universal') || textToScan.includes('megastore') || textToScan.includes('multi')) {
    return 'multipurpose';
  }

  return 'fashion';
}

/**
 * Ensures a tenant gets their industry blueprint sections if no custom homepage has been designed yet.
 */
export async function getOrSeedTenantHomepageSections(tenantSlug: string): Promise<any[] | null> {
  const cleanSlug = (tenantSlug || 'demo').toLowerCase().trim();

  // 1. Direct fetch from isolated tenant database (e.g. tenant_veg_garden)
  try {
    const tenantDb = await getTenantDatabase(cleanSlug);
    if (tenantDb) {
      const doc = await tenantDb.collection('cms_pages').findOne(
        {
          $or: [
            { tenantSlug: cleanSlug, type: 'homepage' },
            { type: 'homepage' },
          ],
        },
        { sort: { publishedAt: -1, updatedAt: -1 } }
      );
      const dbSections = doc?.sections || doc?.config?.sections;
      if (Array.isArray(dbSections) && dbSections.length > 0) {
        return dbSections;
      }
    }
  } catch (err) {
    console.warn(`[getOrSeedTenantHomepageSections] tenantDb fetch warning for ${cleanSlug}:`, err);
  }

  // 2. Direct fetch from platform database matching tenantSlug explicitly
  const platformDb = await getDatabase();
  if (platformDb) {
    try {
      const doc = await platformDb.collection('cms_pages').findOne(
        { tenantSlug: cleanSlug, type: 'homepage' },
        { sort: { publishedAt: -1, updatedAt: -1 } }
      );
      const dbSections = doc?.sections || doc?.config?.sections;
      if (Array.isArray(dbSections) && dbSections.length > 0) {
        return dbSections;
      }
    } catch (err) {
      console.warn(`[getOrSeedTenantHomepageSections] platformDb fetch warning for ${cleanSlug}:`, err);
    }
  }

  // 3. Fallback: Lookup tenant record to resolve their true industry blueprint
  if (platformDb && cleanSlug !== 'all') {
    try {
      const tenantDoc = await platformDb.collection('tenants').findOne({
        $or: [{ slug: cleanSlug }, { id: cleanSlug }, { id: `store_${cleanSlug}` }],
      });

      const preset = inferTenantPreset(tenantDoc, cleanSlug);
      const blueprint = resolveBlueprintPreset(preset);

      if (blueprint && Array.isArray(blueprint.sections) && blueprint.sections.length > 0) {
        // Self-heal / seed into database asynchronously so subsequent requests are lightning fast
        (async () => {
          try {
            const now = new Date().toISOString();
            const cmsDoc = {
              tenantSlug: cleanSlug,
              type: 'homepage',
              version: Date.now(),
              status: 'published',
              sections: blueprint.sections,
              config: { sections: blueprint.sections },
              styles: blueprint.themeStyles || {},
              themeStyles: blueprint.themeStyles || {},
              updatedAt: now,
              publishedAt: now,
            };

            const tDb = await getTenantDatabase(cleanSlug);
            if (tDb) {
              await tDb.collection('cms_pages').updateOne(
                { $or: [{ tenantSlug: cleanSlug, type: 'homepage' }, { type: 'homepage' }] },
                { $set: cmsDoc },
                { upsert: true }
              );
            }

            await platformDb.collection('cms_pages').updateOne(
              { tenantSlug: cleanSlug, type: 'homepage' },
              { $set: cmsDoc },
              { upsert: true }
            );

            // Update category and preset on tenant doc if missing
            if (!tenantDoc?.category || !tenantDoc?.preset) {
              await Promise.allSettled([
                platformDb.collection('tenants').updateOne(
                  { $or: [{ slug: cleanSlug }, { id: cleanSlug }, { id: `store_${cleanSlug}` }] },
                  { $set: { category: preset, preset, updatedAt: now } }
                ),
                platformDb.collection('platform_tenants_registry').updateOne(
                  { $or: [{ slug: cleanSlug }, { id: cleanSlug }, { id: `store_${cleanSlug}` }] },
                  { $set: { category: preset, preset, updatedAt: now } }
                ),
              ]);
            }
          } catch (healErr) {
            console.warn(`[getOrSeedTenantHomepageSections] Self-heal error for ${cleanSlug}:`, healErr);
          }
        })();

        return blueprint.sections;
      }
    } catch (lookupErr) {
      console.warn(`[getOrSeedTenantHomepageSections] Tenant lookup warning for ${cleanSlug}:`, lookupErr);
    }
  }

  return null;
}
