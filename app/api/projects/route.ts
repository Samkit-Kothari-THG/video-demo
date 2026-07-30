import {NextRequest, NextResponse} from 'next/server';
import {
  createTemplateDraft,
  getInvitationTemplate,
  isInvitationTemplateId,
  validateTemplateProps,
} from '../../../src/templates/catalog';
import type {InvitationContentProps} from '../../../src/templates/engagement/model';
import {isInvitationFormat} from '../../../src/templates/formats';
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
    const template = getInvitationTemplate(
      templateId,
      body?.templateVersion,
    );
    const format = isInvitationFormat(body?.format) ? body.format : 'video';
    const incoming = asProps(body?.props);
    if (!incoming) {
      return NextResponse.json({error: 'A valid invitation payload is required.'}, {status: 400});
    }

    const draft = createTemplateDraft(template.id, template.version);
    const props = {
      ...draft,
      ...incoming,
      musicSrc:
        format === 'video'
          ? incoming.musicSrc === undefined
            ? draft.musicSrc
            : incoming.musicSrc
          : null,
      ...(format === 'video'
        ? {}
        : {
            musicUploadName: null,
            musicDurationSeconds: null,
            musicTrimStartSeconds: 0,
            musicVolume: 1,
            musicRightsConfirmed: false,
          }),
    };
    const errors = validateTemplateProps(
      template.id,
      props,
      {},
      template.version,
    );
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({error: 'Please correct the invitation fields.', errors}, {status: 422});
    }

    const project = await createProject(
      template.id,
      template.version,
      format,
      props,
    );
    return NextResponse.json({project}, {status: 201});
  } catch {
    return NextResponse.json({error: 'The project could not be created.'}, {status: 500});
  }
}
