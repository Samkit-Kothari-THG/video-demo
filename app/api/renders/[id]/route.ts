import {NextRequest, NextResponse} from 'next/server';
import {getRenderJob} from '../../../../src/server/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {params: Promise<{id: string}>};

export async function GET(_: NextRequest, {params}: RouteContext) {
  const {id} = await params;
  const job = await getRenderJob(id);
  return job
    ? NextResponse.json({job})
    : NextResponse.json({error: 'Render job not found.'}, {status: 404});
}
