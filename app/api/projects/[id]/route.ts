import {NextRequest, NextResponse} from 'next/server';
import {
  validateEngagementInviteProps,
  type EngagementInviteProps,
} from '../../../../src/templates/engagement/model';
import {getProject, updateProject} from '../../../../src/server/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {params: Promise<{id: string}>};

const asProps = (value: unknown): Partial<EngagementInviteProps> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Partial<EngagementInviteProps>)
    : null;

export async function GET(_: NextRequest, {params}: RouteContext) {
  const {id} = await params;
  const project = await getProject(id);
  return project
    ? NextResponse.json({project})
    : NextResponse.json({error: 'Project not found.'}, {status: 404});
}

export async function PATCH(request: NextRequest, {params}: RouteContext) {
  try {
    const {id} = await params;
    const existing = await getProject(id);
    if (!existing) {
      return NextResponse.json({error: 'Project not found.'}, {status: 404});
    }

    const body = await request.json();
    const updates = asProps(body?.props);
    if (!updates) {
      return NextResponse.json({error: 'A valid invitation payload is required.'}, {status: 400});
    }

    const errors = validateEngagementInviteProps({...existing.props, ...updates});
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({error: 'Please correct the invitation fields.', errors}, {status: 422});
    }

    const project = await updateProject(id, updates);
    return NextResponse.json({project});
  } catch {
    return NextResponse.json({error: 'The project could not be saved.'}, {status: 500});
  }
}
