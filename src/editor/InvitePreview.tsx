'use client';

import {Player, type PlayerRef} from '@remotion/player';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  CatalogInvitation,
  type CatalogInvitationProps,
} from '../templates/CategoryInvitation';
import {
  ShareableInvitation,
  type ShareableInvitationProps,
} from '../templates/ShareableInvitation';
import type {
  InvitationTemplateId,
  InvitationTemplateVersion,
} from '../templates/catalog';
import type {InvitationContentProps} from '../templates/engagement/model';
import {
  getInvitationFormat,
  type InvitationFormat,
} from '../templates/formats';
import styles from './InviteEditor.module.css';

export type InviteEditorTab = 'story' | 'media' | 'sound' | 'review';

export type InvitePreviewScene = {
  id: string;
  label: string;
  startFrame: number;
  focusFrame: number;
  editorTab: InviteEditorTab;
};

type InvitePreviewProps = {
  assetBaseUrl: string | null;
  format: InvitationFormat;
  invitationProps: InvitationContentProps;
  onSelectTab: (tab: InviteEditorTab) => void;
  pausePlayback: boolean;
  renderStatus: string | null;
  scenes: readonly InvitePreviewScene[];
  templateId: InvitationTemplateId;
  templateVersion: InvitationTemplateVersion;
};

const previewFps = 30;
const timelineUpdateIntervalMs = 125;
const playerStyle = {height: '100%', width: '100%'} as const;

const formatPreviewTime = (frame: number) => {
  const totalSeconds = Math.floor(frame / previewFps);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const getActiveSceneIndex = (
  scenes: readonly InvitePreviewScene[],
  frame: number,
  durationInFrames: number,
) =>
  Math.max(
    0,
    scenes.findIndex(
      (scene, index) =>
        frame >= scene.startFrame &&
        frame < (scenes[index + 1]?.startFrame ?? durationInFrames),
    ),
  );

const PreviewCanvas = React.memo(
  ({
    format,
    playerRef,
    previewDurationInFrames,
    shareableInputProps,
    videoInputProps,
  }: {
    format: InvitationFormat;
    playerRef: React.RefObject<PlayerRef | null>;
    previewDurationInFrames: number;
    shareableInputProps: ShareableInvitationProps;
    videoInputProps: CatalogInvitationProps;
  }) => (
    <div className={styles.canvas}>
      <div className={styles.canvasGlow} />
      <div className={styles.phoneFrame}>
        <span className={styles.phoneNotch} />
        {format === 'video' ? (
          <Player
            acknowledgeRemotionLicense
            className={styles.player}
            component={CatalogInvitation}
            compositionHeight={1920}
            compositionWidth={1080}
            controls
            durationInFrames={900}
            fps={previewFps}
            inputProps={videoInputProps}
            loop
            ref={playerRef}
            style={playerStyle}
          />
        ) : (
          <Player
            acknowledgeRemotionLicense
            className={styles.player}
            component={ShareableInvitation}
            compositionHeight={1920}
            compositionWidth={1080}
            controls={format === 'animated'}
            durationInFrames={previewDurationInFrames}
            fps={previewFps}
            inputProps={shareableInputProps}
            loop={format === 'animated'}
            ref={playerRef}
            style={playerStyle}
          />
        )}
      </div>
    </div>
  ),
);

PreviewCanvas.displayName = 'PreviewCanvas';

export const InvitePreview: React.FC<InvitePreviewProps> = ({
  assetBaseUrl,
  format,
  invitationProps,
  onSelectTab,
  pausePlayback,
  renderStatus,
  scenes,
  templateId,
  templateVersion,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const stageRef = useRef<HTMLElement>(null);
  const [previewFrame, setPreviewFrame] = useState(0);
  const activeFormat = getInvitationFormat(format);
  const previewDurationInFrames = activeFormat.durationInFrames;
  const activePreviewSceneIndex = getActiveSceneIndex(
    scenes,
    previewFrame,
    previewDurationInFrames,
  );
  const videoInputProps = useMemo<CatalogInvitationProps>(
    () => ({
      ...invitationProps,
      templateId,
      templateVersion,
      assetBaseUrl,
    }),
    [assetBaseUrl, invitationProps, templateId, templateVersion],
  );
  const shareableInputProps = useMemo<ShareableInvitationProps>(
    () => ({
      ...invitationProps,
      templateId,
      templateVersion,
      format: format === 'photo' ? 'photo' : 'animated',
      assetBaseUrl,
    }),
    [
      assetBaseUrl,
      format,
      invitationProps,
      templateId,
      templateVersion,
    ],
  );

  useEffect(() => {
    if (pausePlayback) {
      playerRef.current?.pause();
    }
  }, [pausePlayback]);

  useEffect(() => {
    const player = playerRef.current;
    const stage = stageRef.current;
    if (!player || !stage || !('IntersectionObserver' in window)) {
      return;
    }

    let isStageVisible = true;
    let resumeWhenVisible = false;
    const syncPlaybackVisibility = () => {
      const shouldPause = document.hidden || !isStageVisible;
      if (shouldPause) {
        if (player.isPlaying()) {
          resumeWhenVisible = true;
          player.pause();
        }
        return;
      }

      if (resumeWhenVisible) {
        resumeWhenVisible = false;
        player.play();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isStageVisible = Boolean(
          entry?.isIntersecting && entry.intersectionRatio >= 0.05,
        );
        syncPlaybackVisibility();
      },
      {threshold: [0, 0.05]},
    );

    observer.observe(stage);
    document.addEventListener('visibilitychange', syncPlaybackVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener(
        'visibilitychange',
        syncPlaybackVisibility,
      );
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    let lastPublishedAt = 0;
    let lastPublishedFrame = player.getCurrentFrame();
    let lastPublishedScene = getActiveSceneIndex(
      scenes,
      lastPublishedFrame,
      previewDurationInFrames,
    );

    const handleTimeUpdate = (event: {detail: {frame: number}}) => {
      const nextFrame = event.detail.frame;
      const nextScene = getActiveSceneIndex(
        scenes,
        nextFrame,
        previewDurationInFrames,
      );
      const timestamp = performance.now();
      const changedScene = nextScene !== lastPublishedScene;
      const jumped = Math.abs(nextFrame - lastPublishedFrame) > previewFps;

      if (
        !changedScene &&
        !jumped &&
        timestamp - lastPublishedAt < timelineUpdateIntervalMs
      ) {
        return;
      }

      lastPublishedAt = timestamp;
      lastPublishedFrame = nextFrame;
      lastPublishedScene = nextScene;
      setPreviewFrame(nextFrame);
    };

    player.addEventListener('timeupdate', handleTimeUpdate);
    setPreviewFrame(lastPublishedFrame);

    return () => {
      player.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [
    format,
    previewDurationInFrames,
    scenes,
    templateId,
    templateVersion,
  ]);

  const jumpToPreviewScene = (scene: InvitePreviewScene) => {
    playerRef.current?.seekTo(scene.focusFrame);
    setPreviewFrame(scene.focusFrame);
    onSelectTab(scene.editorTab);
  };

  return (
    <section className={styles.stage} ref={stageRef}>
      <div className={styles.stageToolbar}>
        <div>
          <strong>Live preview</strong>
          <span>{renderStatus ?? 'Updates as you type'}</span>
        </div>
        <div className={styles.previewSpecs}>
          <span>9:16 portrait</span>
          <span>{activeFormat.durationLabel}</span>
        </div>
      </div>

      <PreviewCanvas
        format={activeFormat.id}
        playerRef={playerRef}
        previewDurationInFrames={previewDurationInFrames}
        shareableInputProps={shareableInputProps}
        videoInputProps={videoInputProps}
      />

      <div className={styles.timeline}>
        <div className={styles.timelineHeader}>
          <div>
            <strong>
              {activeFormat.id === 'video'
                ? 'Scenes'
                : activeFormat.id === 'animated'
                  ? 'Loop'
                  : 'Static card'}
            </strong>
            <span>
              {activeFormat.id === 'photo'
                ? 'Every detail stays visible in the final PNG'
                : `${scenes[activePreviewSceneIndex]?.label ?? 'Opening'} · click a section to jump`}
            </span>
          </div>
          <span>
            {formatPreviewTime(previewFrame)} /{' '}
            {formatPreviewTime(previewDurationInFrames)}
          </span>
        </div>
        {activeFormat.id !== 'photo' ? (
          <div className={styles.timelineTrack}>
            {scenes.map((scene, index) => {
              const nextSceneStart =
                scenes[index + 1]?.startFrame ?? previewDurationInFrames;
              const isActive = index === activePreviewSceneIndex;

              return (
                <button
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`${scene.label} scene`}
                  className={
                    isActive ? styles.timelineSceneActive : undefined
                  }
                  key={scene.label}
                  onClick={() => jumpToPreviewScene(scene)}
                  style={{flex: nextSceneStart - scene.startFrame}}
                  title={`Jump to ${scene.label.toLowerCase()} at ${formatPreviewTime(
                    scene.focusFrame,
                  )}`}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{scene.label}</strong>
                </button>
              );
            })}
          </div>
        ) : (
          <div className={styles.staticTimeline}>
            <span aria-hidden="true">▧</span>
            <strong>Ready at full resolution</strong>
            <small>1080 × 1920 PNG</small>
          </div>
        )}
        {activeFormat.id !== 'photo' ? (
          <div className={styles.timelineTimes}>
            {(activeFormat.id === 'animated'
              ? ['00:00', '00:02', '00:04', '00:06']
              : ['00:00', '00:10', '00:20', '00:30']
            ).map((time) => (
              <span key={time}>{time}</span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default InvitePreview;
