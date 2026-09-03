import { NextRequest, NextResponse } from 'next/server';
import { GlobalCommerceService } from '@/server/global/global-commerce.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || undefined;
    const namespace = (searchParams.get('namespace') as any) || undefined;
    const key = searchParams.get('key');

    if (key && namespace && locale) {
      const result = GlobalCommerceService.translate({
        key,
        namespace,
        locale,
        marketDefaultLocale: searchParams.get('marketDefaultLocale') || undefined,
        fallbackValue: searchParams.get('fallbackValue') || undefined,
      });
      return NextResponse.json({ success: true, data: result });
    }

    const translations = GlobalCommerceService.listTranslations(locale, namespace);
    return NextResponse.json({
      success: true,
      data: translations,
      meta: {
        total: translations.length,
        locale: locale || 'all',
        namespace: namespace || 'all',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.locale || !body.namespace || !body.key || !body.value) {
      return NextResponse.json(
        { success: false, error: 'Missing required translation fields (locale, namespace, key, value)' },
        { status: 400 }
      );
    }

    const upserted = GlobalCommerceService.upsertTranslation({
      tenantId: body.tenantId || 'tenant-demo',
      storeId: body.storeId || 'store-main',
      locale: body.locale,
      namespace: body.namespace,
      key: body.key,
      value: body.value,
      status: body.status || 'published',
    });

    return NextResponse.json({ success: true, data: upserted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
