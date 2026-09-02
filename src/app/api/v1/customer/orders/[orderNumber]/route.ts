import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';

    const db = await getDatabase();
    if (db) {
      const order = await db.collection('orders').findOne({
        tenantId: tenant,
        $or: [{ orderNumber }, { id: orderNumber }, { _id: orderNumber }],
      });

      if (order) {
        return NextResponse.json({
          success: true,
          data: order,
        });
      }
    }

    return NextResponse.json(
      { success: false, error: 'Order not found' },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve order' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';

    const db = await getDatabase();
    if (db) {
      const order = await db.collection('orders').findOne({
        tenantId: tenant,
        $or: [{ orderNumber }, { id: orderNumber }],
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }

      if (order.orderStatus !== 'PENDING' && order.orderStatus !== 'CONFIRMED') {
        return NextResponse.json(
          { success: false, error: 'Order is already being processed or shipped and cannot be cancelled automatically.' },
          { status: 400 }
        );
      }

      await db.collection('orders').updateOne(
        { _id: order._id },
        {
          $set: {
            orderStatus: 'CANCELLED',
            updatedAt: new Date().toISOString(),
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Order cancelled successfully',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Database unavailable' },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
