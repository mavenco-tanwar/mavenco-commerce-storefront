import { NextRequest, NextResponse } from 'next/server';
import { GlobalCommerceService } from '@/server/global/global-commerce.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const convertAmount = searchParams.get('convertAmount');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const rounding = (searchParams.get('rounding') as any) || 'none';

    if (convertAmount && from && to) {
      const minorUnits = parseInt(convertAmount, 10);
      const conversion = GlobalCommerceService.convertMoney({
        minorUnits,
        fromCurrency: from,
        toCurrency: to,
        roundingRule: rounding,
      });
      return NextResponse.json({ success: true, data: conversion });
    }

    const currencies = GlobalCommerceService.listCurrencies();
    return NextResponse.json({
      success: true,
      data: currencies,
      meta: {
        baseCurrency: 'USD',
        count: currencies.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
