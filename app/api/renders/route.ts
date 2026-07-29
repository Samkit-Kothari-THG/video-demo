import {NextRequest, NextResponse} from 'next/server';
import {renderInvitation} from '../../../src/server/render';
import {createRenderJob, getProject} from '../../../src/server/store';
import {validateTemplateProps} from '../../../src/templates/catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body?.projectId !== 'string') {
      return NextResponse.json({error: 'A project ID is required.'}, {status: 400});
    }

    const project = await getProject(body.projectId);
    if (!project) {
      return NextResponse.json({error: 'Project not found.'}, {status: 404});
    }

    const errors = validateTemplateProps(project.templateId, project.props);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {error: 'Complete the required invitation details before rendering.', errors},
        {status: 422},
      );
    }

    const job = await createRenderJob(project);
    void renderInvitation(job);
    return NextResponse.json({job}, {status: 202});
  } catch {
    return NextResponse.json({error: 'The render could not be requested.'}, {status: 500});
  }
}
