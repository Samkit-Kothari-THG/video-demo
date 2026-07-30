import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  getInvitationTemplate,
  resolveTemplateAssetSrc,
  resolveTemplateCopy,
  type InvitationTemplateId,
  type InvitationTemplateVersion,
} from './catalog';
import type {InvitationContentProps} from './engagement/model';
import type {InvitationFormat} from './formats';

export type ShareableInvitationProps = InvitationContentProps & {
  templateId?: InvitationTemplateId;
  templateVersion?: InvitationTemplateVersion;
  format?: Exclude<InvitationFormat, 'video'>;
  assetBaseUrl?: string | null;
};

const mediaSource = (source: string | null) => {
  if (!source) {
    return null;
  }

  return /^(data:|blob:|https?:\/\/)/.test(source)
    ? source
    : staticFile(source.replace(/^\//, ''));
};

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((character) => `${character}${character}`)
          .join('')
      : normalized;
  const value = Number.parseInt(expanded, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const fitNameSize = (value: string, bold: boolean) => {
  if (value.length > 28) {
    return bold ? 72 : 78;
  }
  if (value.length > 20) {
    return bold ? 86 : 92;
  }
  return bold ? 102 : 112;
};

export const ShareableInvitation: React.FC<ShareableInvitationProps> = ({
  templateId = 'engagement-invite',
  templateVersion,
  format = 'animated',
  assetBaseUrl,
  ...props
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const template = getInvitationTemplate(templateId, templateVersion);
  const copy = resolveTemplateCopy(
    template.id,
    props,
    template.version,
  );
  const isAnimated = format === 'animated';
  const progress = isAnimated
    ? frame / Math.max(1, durationInFrames)
    : 0.25;
  const loop = Math.sin(progress * Math.PI * 2);
  const loopCos = Math.cos(progress * Math.PI * 2);
  const bold = template.tones.includes('playful');
  const minimal = template.tones.includes('minimal');
  const photoSrc = mediaSource(copy.photoSrc);
  const coverSrc = mediaSource(
    resolveTemplateAssetSrc(template.coverSrc, assetBaseUrl),
  );
  const imageScale = isAnimated ? 1.045 + loopCos * 0.012 : 1.05;
  const cardLift = isAnimated ? loop * 8 : 0;
  const portraitScale = isAnimated ? 1.01 + loopCos * 0.008 : 1.015;
  const softSurface = hexToRgba(template.surface, minimal ? 0.88 : 0.92);
  const accentSurface = hexToRgba(template.accent, 0.16);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        color: template.textColor,
        background: template.surface,
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      {coverSrc ? (
        <Img
          src={coverSrc}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imageScale}) translateY(${loop * 4}px)`,
            filter: bold
              ? 'saturate(1.06) contrast(1.03)'
              : 'saturate(0.88) contrast(0.96)',
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(
            template.surface,
            0.18,
          )} 0%, ${hexToRgba(template.surface, 0.68)} 48%, ${hexToRgba(
            template.surface,
            0.92,
          )} 100%)`,
        }}
      />

      {Array.from({length: bold ? 18 : 10}).map((_, index) => {
        const size = 7 + (index % 4) * 5;
        const x = 42 + ((index * 173) % 996);
        const y = 54 + ((index * 241) % 1810);
        const driftX = isAnimated
          ? Math.cos(progress * Math.PI * 2 + index * 0.7) * 13
          : 0;
        const driftY = isAnimated
          ? Math.sin(progress * Math.PI * 2 + index * 0.54) * 24
          : 0;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: bold ? size * 1.6 : size,
              borderRadius: bold ? 3 : 999,
              opacity: 0.2 + (index % 3) * 0.08,
              background:
                index % 3 === 0 ? template.accent : template.textColor,
              transform: `translate(${driftX}px, ${driftY}px) rotate(${
                index * 31 + loop * 18
              }deg)`,
            }}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          inset: 44,
          border: `2px solid ${hexToRgba(template.accent, 0.52)}`,
          borderRadius: bold ? 38 : 520,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: '96px 78px',
          display: 'grid',
          gridTemplateRows: copy.showPhoto && photoSrc ? '760px 1fr' : '500px 1fr',
          overflow: 'hidden',
          border: `1px solid ${hexToRgba(template.accent, 0.44)}`,
          borderRadius: bold ? 44 : minimal ? 58 : 84,
          background: softSurface,
          boxShadow: `0 40px 120px ${hexToRgba(template.textColor, 0.2)}`,
          backdropFilter: 'blur(18px)',
          transform: `translateY(${cardLift}px)`,
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            background: accentSurface,
          }}
        >
          {copy.showPhoto && photoSrc ? (
            <>
              <Img
                src={photoSrc}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: `50% ${copy.photoFocalPoint}%`,
                  transform: `scale(${portraitScale})`,
                }}
              />
              <AbsoluteFill
                style={{
                  background:
                    'linear-gradient(180deg, transparent 52%, rgba(0,0,0,0.42) 100%)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: 42,
                  bottom: 34,
                  padding: '12px 18px',
                  borderRadius: 999,
                  color: '#fff',
                  background: 'rgba(0,0,0,0.26)',
                  fontSize: 19,
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                {template.categoryLabel}
              </span>
            </>
          ) : (
            <div
              style={{
                display: 'grid',
                width: 310,
                height: 310,
                placeItems: 'center',
                border: `2px solid ${template.accent}`,
                borderRadius: bold ? 44 : '50%',
                color: template.accent,
                background: hexToRgba(template.surface, 0.62),
                boxShadow: `0 28px 70px ${hexToRgba(
                  template.textColor,
                  0.16,
                )}`,
                fontFamily: bold
                  ? 'Arial Black, Arial, sans-serif'
                  : 'Iowan Old Style, Baskerville, Georgia, serif',
                fontSize: 122,
                fontWeight: 700,
                transform: `rotate(${bold ? loop * 2 : 0}deg) scale(${
                  1 + loopCos * 0.012
                })`,
              }}
            >
              {copy.primaryName.charAt(0)}
              {copy.secondaryName.charAt(0)}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            alignContent: 'center',
            justifyItems: 'center',
            padding: copy.showPhoto && photoSrc ? '54px 66px 62px' : '58px 66px 70px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: template.accent,
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {copy.openingLine}
          </div>
          <div
            style={{
              maxWidth: 820,
              marginTop: 24,
              fontFamily: bold
                ? 'Arial Black, Arial, sans-serif'
                : 'Iowan Old Style, Baskerville, Georgia, serif',
              fontSize: fitNameSize(copy.nameLine, bold),
              fontWeight: bold ? 900 : 500,
              letterSpacing: bold ? '-0.075em' : '-0.045em',
              lineHeight: 0.94,
              textTransform: bold ? 'uppercase' : 'none',
              textWrap: 'balance',
            }}
          >
            {copy.nameLine}
          </div>
          <div
            style={{
              marginTop: 32,
              padding: '13px 22px',
              borderRadius: 999,
              color: template.textColor,
              background: accentSurface,
              fontSize: 21,
              fontWeight: 850,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {copy.eventLine}
          </div>
          <div
            style={{
              width: 92,
              height: 2,
              margin: '34px 0 28px',
              background: template.accent,
            }}
          />
          <div
            style={{
              maxWidth: 790,
              fontSize: copy.date.length > 30 ? 27 : 30,
              fontWeight: 850,
              letterSpacing: '0.025em',
              lineHeight: 1.25,
            }}
          >
            {copy.date}
          </div>
          <div
            style={{
              maxWidth: 760,
              marginTop: 16,
              fontSize: copy.venueName.length > 48 ? 24 : 28,
              fontWeight: 700,
              lineHeight: 1.28,
            }}
          >
            {copy.venueName}
          </div>
          <div
            style={{
              maxWidth: 740,
              marginTop: 30,
              color: hexToRgba(template.textColor, 0.72),
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            {copy.hostLine}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 92,
          bottom: 54,
          color: hexToRgba(template.textColor, 0.62),
          fontSize: 16,
          fontWeight: 850,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        {format === 'animated' ? 'Looping invite' : 'Shareable invite'}
      </div>
    </AbsoluteFill>
  );
};
