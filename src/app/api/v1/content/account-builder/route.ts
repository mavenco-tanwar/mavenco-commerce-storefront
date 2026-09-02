import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = {
  dashboard: {
    sidebarPosition: 'left',
    showGreetingAvatar: true,
    showQuickMetrics: true,
    showWishlistQuickLink: true,
  },
  orders: {
    showTimelineOnModal: true,
    allowCustomerCancellation: true,
    cancellationWindowHours: 24,
    allowReorder: true,
    allowDownloadInvoice: true,
  },
  addresses: {
    maxSavedAddresses: 10,
    requirePhone: true,
    allowSeparateBilling: true,
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';

    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('account_builder_settings').findOne({ tenantSlug: tenant });
      if (doc) {
        return NextResponse.json({
          success: true,
          data: doc.published || doc.draft || DEFAULT_SETTINGS,
          draft: doc.draft || DEFAULT_SETTINGS,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_SETTINGS,
      draft: DEFAULT_SETTINGS,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenant = 'lumina', status = 'published', settings } = body;

    const db = await getDatabase();
    if (db) {
      const now = new Date().toISOString();
      const updateDoc: any = {
        tenantSlug: tenant,
        updatedAt: now,
      };

      if (status === 'published') {
        updateDoc.published = settings;
        updateDoc.draft = settings;
      } else {
        updateDoc.draft = settings;
      }

      await db.collection('account_builder_settings').updateOne(
        { tenantSlug: tenant },
        { $set: updateDoc },
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        message: `Account settings saved as ${status}`,
        data: settings,
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
