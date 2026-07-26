import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {updateRenderJob} from './store';
import type {RenderJob} from './types';

const getServeUrl = () =>
  bundle({
    entryPoint: path.join(process.cwd(), 'src/index.ts'),
    publicDir: path.join(process.cwd(), 'public'),
  });

export const renderInvitation = async (job: RenderJob) => {
  try {
    await updateRenderJob(job.id, {status: 'rendering', progress: 1, error: null});
    const serveUrl = await getServeUrl();
    const composition = await selectComposition({
      serveUrl,
      id: 'EngagementInvite',
      inputProps: job.propsSnapshot,
    });
    const rendersDirectory = path.join(process.cwd(), 'public', 'renders');
    await mkdir(rendersDirectory, {recursive: true});
    const fileName = `${job.id}.mp4`;

    await renderMedia({
      codec: 'h264',
      composition,
      inputProps: job.propsSnapshot,
      outputLocation: path.join(rendersDirectory, fileName),
      overwrite: true,
      serveUrl,
      onProgress: ({progress}) => {
        void updateRenderJob(job.id, {
          status: 'rendering',
          progress: Math.min(99, Math.max(1, Math.round(progress * 100))),
        });
      },
    });

    await updateRenderJob(job.id, {
      status: 'completed',
      progress: 100,
      outputUrl: `/renders/${fileName}`,
      error: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The render failed unexpectedly.';
    await updateRenderJob(job.id, {status: 'failed', error: message, progress: 0});
  }
};
