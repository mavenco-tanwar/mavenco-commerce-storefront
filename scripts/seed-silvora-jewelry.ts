import { MongoClient } from 'mongodb';
import { DEMO_PRESETS } from '../src/app/api/v1/platform/tenants/publish-demo-presets/presets-data';

const uri = process.env.MONGODB_URI || 'mongodb+srv://ammartanwardev_db_user:vBl3raHxONxeDJdr@mavenco-cloud.8gyeugz.mongodb.net/mavenco_platform?retryWrites=true&w=majority';

async function seedSilvora() {
  const client = new MongoClient(uri);
  await client.connect();
  console.log('✅ Connected to MongoDB Atlas');

  const preset = DEMO_PRESETS.find((p) => p.slug === 'demo-jewelry');
  if (!preset) {
    throw new Error('demo-jewelry preset not found in DEMO_PRESETS');
  }

  const slug = 'silvora';
  const storeName = 'Silvora';
  const tagline = 'Certified Solitaire Diamonds, 18K Solid Gold & Swiss Horological Watches';
  const now = new Date().toISOString();

  const tenantDb = client.db(`tenant_${slug}`);
  const platformDb = client.db('mavenco_platform');

  console.log(`Seeding database: tenant_${slug}...`);

  // 1. CMS Pages (Homepage)
  const cmsDoc = {
    tenantSlug: slug,
    type: 'homepage',
    version: Date.now(),
    status: 'published',
    sections: preset.sections,
    config: { sections: preset.sections },
    styles: preset.themeStyles || {},
    themeStyles: preset.themeStyles || {},
    updatedAt: now,
    publishedAt: now,
  };

  await tenantDb.collection('cms_pages').updateOne(
    { $or: [{ tenantSlug: slug, type: 'homepage' }, { type: 'homepage' }] },
    { $set: cmsDoc },
    { upsert: true }
  );
  console.log(`✅ Seeded ${preset.sections.length} homepage sections into tenant_${slug}.cms_pages`);

  // 2. Brand document in tenant DB
  const brandDoc = {
    id: `store_${slug}`,
    tenantId: slug,
    slug: slug,
    name: storeName,
    tagline: tagline,
    description: preset.description,
    status: 'active',
    currency: 'INR',
    currencySymbol: '₹',
    theme: {
      ...preset.theme,
      primaryColor: '#070C18',
      accentColor: '#EAB308',
      secondaryColor: '#FFFFFF',
      headingFont: 'Playfair Display',
      bodyFont: 'Plus Jakarta Sans',
      borderRadius: 'md',
      layoutPreset: 'flagship_luxury',
      headerLayout: 'glassmorphism_mega',
      footerLayout: 'editorial_4_column',
      productCardStyle: 'minimal_hover_zoom',
    },
    contact: {
      phone: '+91 98765 43210',
      email: 'care@silvora.com',
      whatsapp: '+919876543210',
      address: 'Silvora High Jewelry Salon, Connaught Place, New Delhi, India',
    },
    announcements: preset.announcements,
    navLinks: preset.navLinks,
    footerShopLinks: preset.footerShopLinks,
    footerCareLinks: preset.footerCareLinks,
    updatedAt: now,
  };

  await tenantDb.collection('tenants').updateOne(
    { $or: [{ slug }, { id: slug }, { id: `store_${slug}` }] },
    { $set: brandDoc, $setOnInsert: { createdAt: now } },
    { upsert: true }
  );
  console.log(`✅ Seeded brand configuration into tenant_${slug}.tenants`);

  // 3. Products in tenant DB
  const jewelryProducts = [
    {
      name: '18K Yellow Gold Floating Diamond Pendant',
      slug: `18k-gold-floating-diamond-pendant-${slug}`,
      sku: 'SIL-NCK-001',
      department: 'jewelry',
      category: 'necklaces',
      categoryName: 'Fine Necklaces',
      price: 28500,
      compareAtPrice: 38000,
      discountPercent: 25,
      shortDescription: '0.75 Carat VVS1 round brilliant certified lab diamond set in 18K solid yellow gold.',
      description: 'Minimalist illusion setting allows the diamond to float effortlessly along the collarbone. Includes a 45cm adjustable 18K solid gold curb chain with hallmarked authentication.',
      features: ['0.75 ct VVS1 Clarity, E Color Certified Diamond', 'Hallmarked 18K (750) Solid Yellow Gold', 'Laser-inscribed IGI certificate included'],
      fabric: '18K Solid Gold & VVS1 Diamond',
      careInstructions: ['Clean gently with included jewelry polishing cloth'],
      images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop', alt: 'Diamond Pendant', isPrimary: true }],
      colors: [{ name: '18K Yellow Gold', hex: '#FFD700' }, { name: '18K White Gold', hex: '#E5E4E2' }],
      sizes: [{ size: '45cm Chain (0.75ct)', inStock: true, stockCount: 9 }],
      rating: 5.0,
      reviewCount: 38,
      isFeatured: true,
      badge: 'Certified Solitaire',
      tenantSlug: slug,
      storeSlug: slug,
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
    {
      name: 'Baguette & Emerald-Cut Diamond Eternity Band',
      slug: `baguette-emerald-cut-eternity-band-${slug}`,
      sku: 'SIL-RNG-002',
      department: 'jewelry',
      category: 'rings',
      categoryName: 'Diamond Rings',
      price: 42000,
      compareAtPrice: 56000,
      discountPercent: 25,
      shortDescription: 'Alternating emerald and baguette cut diamonds in a continuous channel platinum setting.',
      description: 'Hand-matched DEF color diamonds totaling 2.4 carats. Ergonomically tapered band profile guarantees supreme comfort during daily wear.',
      features: ['2.4 Total Carat Weight DEF/VVS', 'Solid 950 Platinum Channel Setting', 'Micro-beveled comfort interior'],
      fabric: 'Platinum 950 & Natural Diamonds',
      careInstructions: ['Ultrasonic cleaning safe', 'Store in velvet presentation vault'],
      images: [{ url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop', alt: 'Eternity Band', isPrimary: true }],
      colors: [{ name: 'Platinum 950', hex: '#E5E4E2' }, { name: '18K Rose Gold', hex: '#B76E79' }],
      sizes: [{ size: 'Size 6', inStock: true, stockCount: 4 }, { size: 'Size 7', inStock: true, stockCount: 6 }],
      rating: 4.9,
      reviewCount: 29,
      isFeatured: true,
      badge: 'Master Creation',
      tenantSlug: slug,
      storeSlug: slug,
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
    {
      name: 'Swiss Automatic Sapphire Crystal Dress Watch',
      slug: `swiss-automatic-sapphire-crystal-watch-${slug}`,
      sku: 'SIL-WTC-003',
      department: 'jewelry',
      category: 'watches',
      categoryName: 'Luxury Timepieces',
      price: 89000,
      compareAtPrice: 115000,
      discountPercent: 22,
      shortDescription: 'Swiss Calibre 2824-2 automatic movement with exhibition caseback and alligator strap.',
      description: 'Sunburst champagne dial with diamond-cut indices and blued steel hands. 40mm surgical 316L stainless steel case with scratch-proof sapphire crystal.',
      features: ['Swiss ETA 2824-2 28,800 vph Movement', 'Double Anti-Reflective Sapphire Crystal', '50m Water Resistant with Screw-Down Crown'],
      fabric: '316L Steel & Sapphire Crystal',
      careInstructions: ['Service movement every 5 years'],
      images: [{ url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop', alt: 'Luxury Watch', isPrimary: true }],
      colors: [{ name: 'Champagne Dial / Brown Alligator', hex: '#8B4513' }],
      sizes: [{ size: '40mm Case', inStock: true, stockCount: 5 }],
      rating: 5.0,
      reviewCount: 44,
      isFeatured: true,
      badge: 'Swiss Made',
      tenantSlug: slug,
      storeSlug: slug,
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
    {
      name: 'Freshwater Baroque Pearl Choker with 18K Clasp',
      slug: `freshwater-baroque-pearl-choker-${slug}`,
      sku: 'SIL-PRL-004',
      department: 'jewelry',
      category: 'pearls',
      categoryName: 'Baroque Pearls',
      price: 16500,
      compareAtPrice: 22000,
      discountPercent: 25,
      shortDescription: 'Selected AAA organic baroque pearls knotted on pure silk cord with an 18K ball clasp.',
      description: 'Lustrous iridescent overtones make each pearl unique. Hand-knotted in Geneva on reinforced pure silk cord for maximum strength and drape.',
      features: ['12-14mm AAA Grade Organic Baroque Pearls', '18K Solid Gold Magnetic Security Clasp', 'Individual silk cord knots between each pearl'],
      fabric: 'Freshwater Baroque Pearls & 18K Gold',
      careInstructions: ['Put on after perfume and cosmetics', 'Wipe with soft damp cloth'],
      images: [{ url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop', alt: 'Pearl Choker', isPrimary: true }],
      colors: [{ name: 'Natural Iridescent White', hex: '#FAF9F6' }],
      sizes: [{ size: '42cm Choker Length', inStock: true, stockCount: 12 }],
      rating: 4.8,
      reviewCount: 19,
      isFeatured: false,
      badge: 'Hand-Knotted',
      tenantSlug: slug,
      storeSlug: slug,
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
  ];

  await tenantDb.collection('products').deleteMany({
    $or: [{ tenantSlug: slug }, { storeSlug: slug }],
  });
  await tenantDb.collection('products').insertMany(jewelryProducts);
  console.log(`✅ Seeded ${jewelryProducts.length} jewelry products into tenant_${slug}.products`);

  // 4. Categories in tenant DB
  const jewelryCategories = [
    { id: `cat_${slug}_1`, name: 'Diamond Rings', slug: 'rings', description: 'Solitaire engagement rings and emerald cut eternity bands', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop', tenantSlug: slug, count: 24 },
    { id: `cat_${slug}_2`, name: 'Fine Necklaces', slug: 'necklaces', description: '18K solid yellow and white gold floating diamond pendants', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop', tenantSlug: slug, count: 30 },
    { id: `cat_${slug}_3`, name: 'Luxury Timepieces', slug: 'watches', description: 'Swiss mechanical automatics with exhibition casebacks', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop', tenantSlug: slug, count: 12 },
    { id: `cat_${slug}_4`, name: 'Baroque Pearls', slug: 'pearls', description: 'Handcrafted Australian South Sea and freshwater pearl chokers', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop', tenantSlug: slug, count: 16 },
  ];

  await tenantDb.collection('categories').deleteMany({ tenantSlug: slug });
  await tenantDb.collection('categories').insertMany(jewelryCategories);
  console.log(`✅ Seeded ${jewelryCategories.length} categories into tenant_${slug}.categories`);

  // 5. Synchronize with mavenco_platform registry
  const platformUpdate = {
    name: storeName,
    tagline: tagline,
    description: preset.description,
    status: 'active',
    planName: 'Starter Boutique',
    databaseName: `tenant_${slug}`,
    databaseIdentifier: `tenant_${slug}`,
    theme: brandDoc.theme,
    'metrics.products': jewelryProducts.length,
    'metrics.storageUsedMb': 32,
    updatedAt: now,
  };

  await Promise.all([
    platformDb.collection('tenants').updateOne({ $or: [{ slug }, { id: slug }, { id: `store_${slug}` }] }, { $set: platformUpdate }),
    platformDb.collection('platform_tenants_registry').updateOne({ $or: [{ slug }, { id: slug }, { id: `store_${slug}` }] }, { $set: platformUpdate }),
    platformDb.collection('cms_pages').updateOne({ $or: [{ tenantSlug: slug, type: 'homepage' }] }, { $set: cmsDoc }, { upsert: true }),
    platformDb.collection('products').deleteMany({ $or: [{ tenantSlug: slug }, { storeSlug: slug }] }),
    platformDb.collection('categories').deleteMany({ tenantSlug: slug }),
  ]);

  await Promise.all([
    platformDb.collection('products').insertMany(jewelryProducts),
    platformDb.collection('categories').insertMany(jewelryCategories),
  ]);

  console.log(`✅ Synchronized with mavenco_platform registry & fallbacks!`);
  console.log(`🎉 Store '${storeName}' (${slug}) is now fully configured with the Luxury Jewelry Blueprint!`);

  await client.close();
}

seedSilvora().catch(console.error);
