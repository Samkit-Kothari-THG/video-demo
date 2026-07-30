import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {
  renderMedia,
  renderStill,
  selectComposition,
} from '@remotion/renderer';
import {getInvitationTemplate} from '../templates/catalog';
import {updateRenderJob} from './store';
import type {RenderJob} from './types';

let serveUrlPromise: ReturnType<typeof bundle> | null = null;
const progressPersistenceIntervalMs = 500;

const getServeUrl = () => {
  if (!serveUrlPromise) {
    serveUrlPromise = bundle({
      entryPoint: path.join(process.cwd(), 'src/index.ts'),
      publicDir: path.join(process.cwd(), 'public'),
      enableCaching: true,
      // Rendering happens on the same worker and filesystem as this temporary
      // bundle. A symlink keeps uploads available without copying the complete
      // public directory (including previous render outputs) on every restart.
      symlinkPublicDir: true,
    }).catch((error) => {
      serveUrlPromise = null;
      throw error;
    });
  }

  return serveUrlPromise;
};

export const renderInvitation = async (job: RenderJob) => {
  let progressWriteChain: Promise<void> = Promise.resolve();

  try {
    await updateRenderJob(job.id, {status: 'rendering', progress: 1, error: null});
    const serveUrl = await getServeUrl();
    const template = getInvitationTemplate(
      job.templateId,
      job.templateVersion,
    );
    const compositionId =
      job.format === 'video'
        ? template.compositionId
        : 'ShareableInvitation';
    const inputProps = {
      ...job.propsSnapshot,
      templateId: template.id,
      templateVersion: template.version,
      format: job.format,
      musicSrc:
        job.format === 'video' ? job.propsSnapshot.musicSrc : null,
      assetBaseUrl:
        process.env.TEMPLATE_ASSET_BASE_URL ??
        process.env.NEXT_PUBLIC_TEMPLATE_ASSET_BASE_URL ??
        null,
    };
    const composition = await selectComposition({
      serveUrl,
      id: compositionId,
      inputProps,
    });
    const rendersDirectory = path.join(process.cwd(), 'public', 'renders');
    await mkdir(rendersDirectory, {recursive: true});
    const fileName = `${job.id}.${job.exportType}`;
    const outputLocation = path.join(rendersDirectory, fileName);
    let lastQueuedProgress = 1;
    let lastProgressWriteAt = 0;
    const onProgress = (progress: number) => {
      const nextProgress = Math.min(
        99,
        Math.max(1, Math.round(progress * 100)),
      );
      const timestamp = Date.now();
      const shouldPersist =
        nextProgress > lastQueuedProgress &&
        (nextProgress === 99 ||
          timestamp - lastProgressWriteAt >= progressPersistenceIntervalMs);

      if (!shouldPersist) {
        return;
      }

      lastQueuedProgress = nextProgress;
      lastProgressWriteAt = timestamp;
      progressWriteChain = progressWriteChain
        .then(async () => {
          await updateRenderJob(job.id, {
            status: 'rendering',
            progress: nextProgress,
          });
        })
        .catch(() => {
          // A transient progress-write failure must not abort a valid render.
          // The terminal status update below remains authoritative.
        });
    };

    if (job.exportType === 'png') {
      onProgress(50);
      await renderStill({
        composition,
        frame: 45,
        inputProps,
        output: outputLocation,
        overwrite: true,
        serveUrl,
      });
    } else {
      const isGif = job.exportType === 'gif';
      await renderMedia({
        codec: isGif ? 'gif' : 'h264',
        composition,
        everyNthFrame: isGif ? 2 : 1,
        inputProps,
        muted: job.format !== 'video',
        numberOfGifLoops: isGif ? null : undefined,
        outputLocation,
        overwrite: true,
        scale: isGif ? 0.5 : 1,
        serveUrl,
        onProgress: ({progress}) => onProgress(progress),
      });
    }

    await progressWriteChain;
    await updateRenderJob(job.id, {
      status: 'completed',
      progress: 100,
      outputUrl: `/renders/${fileName}`,
      error: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The render failed unexpectedly.';
    await progressWriteChain;
    await updateRenderJob(job.id, {status: 'failed', error: message, progress: 0});
  }
};
