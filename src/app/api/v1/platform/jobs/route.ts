import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

let JOBS = [
  {
    id: 'job_prov_9981',
    jobType: 'TenantProvisioningJob',
    tenantId: 'aurora',
    tenantName: 'Aurora Botanical Cosmetics',
    status: 'completed',
    attempt: 1,
    maxAttempts: 3,
    queuedAt: new Date(Date.now() - 3600000).toISOString(),
    startedAt: new Date(Date.now() - 3590000).toISOString(),
    completedAt: new Date(Date.now() - 3560000).toISOString(),
  },
  {
    id: 'job_rec_8812',
    jobType: 'FinancialReconciliationJob',
    tenantId: 'lumina',
    tenantName: 'Lumina Luxury Group',
    status: 'completed',
    attempt: 1,
    maxAttempts: 3,
    queuedAt: new Date(Date.now() - 7200000).toISOString(),
    startedAt: new Date(Date.now() - 7190000).toISOString(),
    completedAt: new Date(Date.now() - 7100000).toISOString(),
  },
  {
    id: 'job_usage_7719',
    jobType: 'UsageAggregationJob',
    tenantId: 'elysium',
    tenantName: 'Elysium Haute Horlogerie',
    status: 'running',
    attempt: 1,
    maxAttempts: 3,
    queuedAt: new Date(Date.now() - 120000).toISOString(),
    startedAt: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: 'job_cert_5510',
    jobType: 'CertificateRenewalJob',
    tenantId: 'vanguard',
    tenantName: 'Vanguard Audio Atelier',
    status: 'failed',
    attempt: 3,
    maxAttempts: 3,
    queuedAt: new Date(Date.now() - 18000000).toISOString(),
    failedAt: new Date(Date.now() - 17900000).toISOString(),
    errorMessage: 'ACME challenge HTTP 403: Domain DNS propagation timeout on custom CNAME.',
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: JOBS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId } = body;

    JOBS = JOBS.map((j) => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'running',
          attempt: 1,
          startedAt: new Date().toISOString(),
          failedAt: undefined,
          errorMessage: undefined,
        };
      }
      return j;
    });

    return NextResponse.json({
      success: true,
      message: `Job ${jobId} requeued and dispatched to worker pool!`,
      data: JOBS.find((j) => j.id === jobId),
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
