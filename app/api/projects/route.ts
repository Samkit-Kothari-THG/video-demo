import {NextRequest, NextResponse} from 'next/server';
import {
  createTemplateDraft,
  isInvitationTemplateId,
  validateTemplateProps,
} from '../../../src/templates/catalog';
import type {InvitationContentProps} from '../../../src/templates/engagement/model';
import {createProject, listProjects} from '../../../src/server/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const asProps = (value: unknown): InvitationContentProps | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as InvitationContentProps)
    : null;

export async function GET() {
  return NextResponse.json({projects: await listProjects()});
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const templateId = isInvitationTemplateId(body?.templateId)
      ? body.templateId
      : 'engagement-invite';
    const incoming = asProps(body?.props);
    if (!incoming) {
      return NextResponse.json({error: 'A valid invitation payload is required.'}, {status: 400});
    }

    const props = {...createTemplateDraft(templateId), ...incoming};
    const errors = validateTemplateProps(templateId, props);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({error: 'Please correct the invitation fields.', errors}, {status: 422});
    }

    const project = await createProject(templateId, props);
    return NextResponse.json({project}, {status: 201});
  } catch {
    return NextResponse.json({error: 'The project could not be created.'}, {status: 500});
  }
}
