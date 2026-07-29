import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  getInvitationTemplate,
  getInvitationTemplateKey,
  resolveTemplateAssetSrc,
  resolveTemplateCopy,
  type InvitationTemplateId,
  type InvitationTemplateKey,
  type InvitationTemplateVersion,
} from './catalog';
import {EngagementInvite} from './engagement/EngagementInvite';
import type {InvitationContentProps} from './engagement/model';

export type CatalogInvitationProps = InvitationContentProps & {
  templateId?: InvitationTemplateId;
  templateVersion?: InvitationTemplateVersion;
  assetBaseUrl?: string | null;
};

type Theme = {
  background: string;
  foreground: string;
  muted: string;
  accent: string;
  accentSoft: string;
  overlay: string;
  photoBorder: string;
  photoRadius: number;
  photoRotate: number;
  marker: string;
  serif: string;
  sans: string;
  frameRadius: number;
  boldType: boolean;
  dark: boolean;
  confetti: boolean;
};

const motionCopy: Record<
  InvitationTemplateKey,
  {moment: string; details: string; finale: string}
> = {
  'engagement-invite@1': {
    moment: 'A promise in bloom',
    details: 'Meet us there',
    finale: 'The next chapter starts here',
  },
  'engagement-invite@2': {
    moment: 'Promises in the rain',
    details: 'Meet us there',
    finale: 'The next chapter starts here',
  },
  'wedding-noor@1': {
    moment: 'A promise beneath the stars',
    details: 'The celebration',
    finale: 'Two stories, one forever',
  },
  'wedding-noor@2': {
    moment: 'A garden made for forever',
    details: 'The ceremony',
    finale: 'A lifetime, beginning softly',
  },
  'birthday-confetti@1': {
    moment: 'Your brightest year yet',
    details: 'Party coordinates',
    finale: 'Another trip around the sun',
  },
  'birthday-confetti@2': {
    moment: 'Dress bright. Stay late.',
    details: 'After-dark coordinates',
    finale: 'One luminous year ahead',
  },
  'baby-shower-moon@1': {
    moment: 'A little love, already immense',
    details: 'Gather with us',
    finale: 'The sweetest chapter begins',
  },
  'baby-shower-moon@2': {
    moment: 'A tiny story, already loved',
    details: 'Join our meadow',
    finale: 'A beautiful chapter begins',
  },
  'housewarming-aangan@1': {
    moment: 'New walls, familiar warmth',
    details: 'Find your way home',
    finale: 'Our door is open. Come home to us.',
  },
  'housewarming-aangan@2': {
    moment: 'Made slowly. Filled with love.',
    details: 'Find our new door',
    finale: 'Come in. Stay awhile.',
  },
};

const themes: Record<InvitationTemplateKey, Theme> = {
  'engagement-invite@1': {
    background: '#f6ead2',
    foreground: '#5d3427',
    muted: '#7c6557',
    accent: '#7d364a',
    accentSoft: 'rgba(125,54,74,0.13)',
    overlay:
      'linear-gradient(180deg, rgba(255,248,237,0.04), rgba(255,248,237,0.2))',
    photoBorder: '#b87951',
    photoRadius: 240,
    photoRotate: 0,
    marker: '✦',
    serif: 'Iowan Old Style, Baskerville, Georgia, serif',
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    frameRadius: 520,
    boldType: false,
    dark: false,
    confetti: false,
  },
  'engagement-invite@2': {
    background: '#e9f0eb',
    foreground: '#24443d',
    muted: '#668077',
    accent: '#557f72',
    accentSoft: 'rgba(85,127,114,0.14)',
    overlay:
      'linear-gradient(180deg, rgba(235,244,239,0.06), rgba(235,244,239,0.22))',
    photoBorder: '#8fac9e',
    photoRadius: 240,
    photoRotate: 0,
    marker: '◇',
    serif: 'Iowan Old Style, Baskerville, Georgia, serif',
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    frameRadius: 520,
    boldType: false,
    dark: false,
    confetti: false,
  },
  'wedding-noor@1': {
    background: '#08152c',
    foreground: '#f7ead2',
    muted: '#c8b695',
    accent: '#d4a85e',
    accentSoft: 'rgba(212,168,94,0.18)',
    overlay:
      'linear-gradient(180deg, rgba(3,10,25,0.1), rgba(3,10,25,0.3) 44%, rgba(3,10,25,0.2))',
    photoBorder: '#d8b36f',
    photoRadius: 270,
    photoRotate: 0,
    marker: '✦',
    serif: 'Iowan Old Style, Baskerville, Georgia, serif',
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    frameRadius: 520,
    boldType: false,
    dark: true,
    confetti: false,
  },
  'wedding-noor@2': {
    background: '#fbf5e8',
    foreground: '#596042',
    muted: '#85785d',
    accent: '#a07d3e',
    accentSoft: 'rgba(160,125,62,0.14)',
    overlay:
      'linear-gradient(180deg, rgba(255,250,239,0.04), rgba(255,250,239,0.18))',
    photoBorder: '#b99450',
    photoRadius: 240,
    photoRotate: 0,
    marker: '✧',
    serif: 'Iowan Old Style, Baskerville, Georgia, serif',
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    frameRadius: 520,
    boldType: false,
    dark: false,
    confetti: false,
  },
  'birthday-confetti@1': {
    background: '#fff8ee',
    foreground: '#211e20',
    muted: '#655d60',
    accent: '#1748d5',
    accentSoft: 'rgba(23,72,213,0.12)',
    overlay:
      'linear-gradient(180deg, rgba(255,248,238,0.02), rgba(255,248,238,0.16))',
    photoBorder: '#1748d5',
    photoRadius: 44,
    photoRotate: -3,
    marker: '✺',
    serif: 'Arial Black, Arial, sans-serif',
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    frameRadius: 32,
    boldType: true,
    dark: false,
    confetti: true,
  },
  'birthday-confetti@2': {
    background: '#130d1a',
    foreground: '#f9f3ff',
    muted: '#c2accb',
    accent: '#ff55d8',
    accentSoft: 'rgba(255,85,216,0.16)',
    overlay:
      'linear-gradient(180deg, rgba(8,5,14,0.05), rgba(8,5,14,0.2))',
    photoBorder: '#7ce9ff',
    photoRadius: 42,
    photoRotate: 3,
    marker: '✦',
    serif: 'Arial Black, Arial, sans-serif',
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    frameRadius: 32,
    boldType: true,
    dark: true,
    confetti: true,
  },
  'baby-shower-moon@1': {
    background: '#fbf4e6',
    foreground: '#4d5b52',
    muted: '#7b7b70',
    accent: '#867896',
    accentSoft: 'rgba(134,120,150,0.14)',
    overlay:
      'linear-gradient(180deg, rgba(255,250,242,0.05), rgba(255,250,242,0.18))',
    photoBorder: '#d2b978',
    photoRadius: 240,
    photoRotate: 0,
    marker: '☾',
    serif: 'Iowan Old Style, Baskerville, Georgia, serif',
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    frameRadius: 520,
    boldType: false,
    dark: false,
    confetti: false,
  },
  'baby-shower-moon@2': {
    background: '#f6f0df',
    foreground: '#4d6147',
    muted: '#78806d',
    accent: '#799164',
    accentSoft: 'rgba(121,145,100,0.14)',
    overlay:
      'linear-gradient(180deg, rgba(255,251,239,0.04), rgba(255,251,239,0.18))',
    photoBorder: '#d6a982',
    photoRadius: 240,
    photoRotate: 0,
    marker: '❧',
    serif: 'Iowan Old Style, Baskerville, Georgia, serif',
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    frameRadius: 520,
    boldType: false,
    dark: false,
    confetti: false,
  },
  'housewarming-aangan@1': {
    background: '#f1d4b5',
    foreground: '#355344',
    muted: '#725f4c',
    accent: '#a64e2d',
    accentSoft: 'rgba(166,78,45,0.13)',
    overlay:
      'linear-gradient(180deg, rgba(252,236,214,0.03), rgba(252,236,214,0.16))',
    photoBorder: '#a64e2d',
    photoRadius: 26,
    photoRotate: 0,
    marker: '⌂',
    serif: 'Iowan Old Style, Baskerville, Georgia, serif',
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    frameRadius: 18,
    boldType: false,
    dark: false,
    confetti: false,
  },
  'housewarming-aangan@2': {
    background: '#eee4d4',
    foreground: '#38483c',
    muted: '#756957',
    accent: '#8c6542',
    accentSoft: 'rgba(140,101,66,0.14)',
    overlay:
      'linear-gradient(180deg, rgba(250,244,232,0.03), rgba(250,244,232,0.18))',
    photoBorder: '#9a744d',
    photoRadius: 26,
    photoRotate: 0,
    marker: '⌂',
    serif: 'Iowan Old Style, Baskerville, Georgia, serif',
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    frameRadius: 18,
    boldType: false,
    dark: false,
    confetti: false,
  },
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const fadeIn = (frame: number, start: number, duration = 28) =>
  clamp((frame - start) / duration);
const fadeOut = (frame: number, end: number, duration = 28) =>
  clamp((end - frame) / duration);
const sceneOpacity = (frame: number, start: number, end: number) =>
  fadeIn(frame, start) * fadeOut(frame, end);

const mediaSource = (source: string | null) => {
  if (!source) {
    return null;
  }

  return /^(data:|blob:|https?:\/\/)/.test(source)
    ? source
    : staticFile(source.replace(/^\//, ''));
};

const Scene: React.FC<{
  opacity: number;
  children: React.ReactNode;
}> = ({opacity, children}) => (
  <AbsoluteFill
    style={{
      opacity,
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    }}
  >
    {children}
  </AbsoluteFill>
);

const AmbientDetails: React.FC<{
  theme: Theme;
}> = ({theme}) => {
  const frame = useCurrentFrame();

  return (
    <>
      {Array.from({length: 16}).map((_, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const y = ((frame * (0.22 + (index % 4) * 0.04) + index * 137) % 2080) - 80;
        const x = 65 + ((index * 193) % 940);
        const size = 5 + (index % 4) * 3;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: theme.confetti ? size * 1.8 : size,
              borderRadius: theme.confetti ? 2 : Math.ceil(size / 2),
              opacity: 0.18 + (index % 3) * 0.08,
              background: index % 3 === 0 ? theme.accent : theme.foreground,
              transform: `translateX(${Math.sin((frame + index * 19) / 24) * 18 * direction}px) rotate(${frame * direction + index * 31}deg)`,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          inset: 34,
          border: `1px solid ${theme.accent}`,
          borderRadius: theme.frameRadius,
          opacity: theme.frameRadius < 20 ? 0.22 : 0.3,
        }}
      />
    </>
  );
};

const CategoryInvitation: React.FC<
  InvitationContentProps & {
    templateId: InvitationTemplateId;
    templateVersion: InvitationTemplateVersion;
    assetBaseUrl?: string | null;
  }
> = ({templateId, templateVersion, assetBaseUrl, ...props}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const template = getInvitationTemplate(templateId, templateVersion);
  const templateKey = getInvitationTemplateKey(
    template.id,
    template.version,
  );
  const copy = resolveTemplateCopy(template.id, props, template.version);
  const sceneCopy = motionCopy[templateKey];
  const theme = themes[templateKey];
  const photoSrc = mediaSource(copy.photoSrc);
  const musicSrc = mediaSource(copy.musicSrc);
  const coverSrc = mediaSource(
    resolveTemplateAssetSrc(template.coverSrc, assetBaseUrl),
  );
  const backgroundScale = interpolate(
    frame,
    [0, durationInFrames],
    [1.025, 1.075],
  );
  const reveal = spring({
    frame: frame - 356,
    fps,
    config: {damping: 18, stiffness: 88, mass: 0.9},
  });
  const titleRise = interpolate(fadeIn(frame, 20, 38), [0, 1], [46, 0]);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        color: theme.foreground,
        background: theme.background,
        fontFamily: theme.sans,
      }}
    >
      {musicSrc ? (
        <Audio
          src={musicSrc}
          volume={(audioFrame) => {
            const intro = fadeIn(audioFrame, 0, 28);
            const outro = fadeOut(audioFrame, durationInFrames - 8, 52);
            return 0.28 * intro * outro;
          }}
        />
      ) : null}
      <Img
        src={coverSrc!}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${backgroundScale})`,
          filter:
            theme.dark
              ? 'saturate(0.92) brightness(0.88)'
              : 'saturate(0.94) contrast(0.98)',
        }}
      />
      <AbsoluteFill style={{background: theme.overlay}} />
      <AmbientDetails theme={theme} />

      <Scene opacity={sceneOpacity(frame, 0, 205)}>
        <div
          style={{
            display: 'grid',
            width: 820,
            justifyItems: 'center',
            textAlign: 'center',
            transform: `translateY(${titleRise}px)`,
          }}
        >
          <div
            style={{
              display: 'grid',
              width: 82,
              height: 82,
              placeItems: 'center',
              marginBottom: 38,
              border: `1px solid ${theme.accent}`,
              borderRadius: '50%',
              color: theme.accent,
              background: theme.accentSoft,
              fontFamily: theme.serif,
              fontSize: 38,
            }}
          >
            {theme.marker}
          </div>
          <div
            style={{
              maxWidth: 780,
              color: theme.accent,
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: '0.22em',
              lineHeight: 1.5,
              textTransform: 'uppercase',
            }}
          >
            {copy.openingLine}
          </div>
          <div
            style={{
              width: 900,
              marginTop: 38,
              fontFamily: theme.serif,
              fontSize:
                copy.eventLine.length > 32
                  ? 64
                  : copy.eventLine.length > 22
                    ? 70
                    : copy.eventLine.length > 16
                      ? 76
                      : theme.boldType
                        ? 88
                        : 84,
              fontWeight: theme.boldType ? 900 : 500,
              letterSpacing: theme.boldType ? '-0.07em' : '-0.035em',
              lineHeight: 0.96,
              textAlign: 'center',
              textTransform: theme.boldType ? 'uppercase' : 'none',
              textWrap: 'balance',
              textShadow:
                theme.dark
                  ? '0 15px 40px rgba(0,0,0,0.5)'
                  : '0 4px 22px rgba(255,255,255,0.45)',
            }}
          >
            {copy.eventLine}
          </div>
          <div
            style={{
              marginTop: 35,
              color: theme.muted,
              fontSize: 25,
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            {copy.date}
          </div>
        </div>
      </Scene>

      <Scene opacity={sceneOpacity(frame, 170, 395)}>
        <div
          style={{
            display: 'grid',
            width: 880,
            justifyItems: 'center',
            textAlign: 'center',
            transform: `translateY(${interpolate(fadeIn(frame, 194, 34), [0, 1], [52, 0])}px)`,
          }}
        >
          <div
            style={{
              color: theme.accent,
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {template.categoryLabel}
          </div>
          <div
            style={{
              maxWidth: 900,
              marginTop: 38,
              fontFamily: theme.serif,
              fontSize:
                theme.boldType
                  ? 150
                  : copy.nameLine.length > 24
                    ? 94
                    : 126,
              fontWeight: theme.boldType ? 900 : 500,
              letterSpacing: theme.boldType ? '-0.08em' : '-0.05em',
              lineHeight: 0.94,
              textShadow:
                theme.dark
                  ? '0 16px 44px rgba(0,0,0,0.52)'
                  : '0 5px 28px rgba(255,255,255,0.5)',
            }}
          >
            {copy.nameLine}
          </div>
          <div
            style={{
              width: 150,
              height: 2,
              marginTop: 46,
              background: theme.accent,
            }}
          />
        </div>
      </Scene>

      <Scene opacity={sceneOpacity(frame, 340, 625)}>
        <div
          style={{
            position: 'relative',
            display: 'grid',
            width: 760,
            justifyItems: 'center',
            transform: `scale(${0.82 + reveal * 0.18}) rotate(${theme.photoRotate}deg)`,
          }}
        >
          {copy.showPhoto && photoSrc ? (
            <div
              style={{
                width: 670,
                height: 770,
                overflow: 'hidden',
                border: `7px solid ${theme.photoBorder}`,
                borderRadius: theme.photoRadius,
                padding: 12,
                background: theme.background,
                boxShadow: '0 34px 80px rgba(24,18,15,0.3)',
              }}
            >
              <Img
                src={photoSrc}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: Math.max(18, theme.photoRadius - 18),
                  objectFit: 'cover',
                  objectPosition: `50% ${copy.photoFocalPoint}%`,
                }}
              />
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                width: 610,
                height: 610,
                placeItems: 'center',
                border: `2px solid ${theme.accent}`,
                borderRadius:
                  theme.photoRadius < 100 ? theme.photoRadius + 8 : '50%',
                color: theme.accent,
                background: theme.accentSoft,
                boxShadow: '0 30px 70px rgba(24,18,15,0.14)',
                fontFamily: theme.serif,
                fontSize: 180,
                fontWeight: 700,
              }}
            >
              {copy.primaryName.charAt(0)}
            </div>
          )}
          <div
            style={{
              marginTop: 35,
              padding: '15px 24px',
              borderRadius: 999,
              color: theme.foreground,
              background: theme.accentSoft,
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            {sceneCopy.moment}
          </div>
        </div>
      </Scene>

      <Scene opacity={sceneOpacity(frame, 590, 800)}>
        <div
          style={{
            display: 'grid',
            width: 850,
            justifyItems: 'center',
            textAlign: 'center',
            transform: `translateY(${interpolate(fadeIn(frame, 616, 32), [0, 1], [46, 0])}px)`,
          }}
        >
          <div
            style={{
              color: theme.accent,
              fontSize: 21,
              fontWeight: 900,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {sceneCopy.details}
          </div>
          <div
            style={{
              width: 900,
              marginTop: 34,
              fontFamily: theme.serif,
              fontSize:
                copy.date.length > 30
                  ? 48
                  : copy.date.length > 24
                    ? 52
                    : copy.date.length > 20
                      ? 56
                      : 62,
              fontWeight: 600,
              lineHeight: 1.15,
              textAlign: 'center',
              textWrap: 'balance',
            }}
          >
            {copy.date}
          </div>
          <div
            style={{
              width: 95,
              height: 2,
              margin: '38px 0',
              background: theme.accent,
            }}
          />
          <div
            style={{
              maxWidth: 760,
              color: theme.foreground,
              fontSize: 38,
              fontWeight: 700,
              lineHeight: 1.25,
            }}
          >
            {copy.venueName}
          </div>
        </div>
      </Scene>

      <Scene opacity={sceneOpacity(frame, 760, 900)}>
        <div
          style={{
            display: 'grid',
            width: 820,
            justifyItems: 'center',
            textAlign: 'center',
            transform: `scale(${0.96 + fadeIn(frame, 778, 36) * 0.04})`,
          }}
        >
          <div
            style={{
              color: theme.accent,
              fontFamily: theme.serif,
              fontSize: sceneCopy.finale.length > 30 ? 64 : 74,
              lineHeight: 1.05,
            }}
          >
            {sceneCopy.finale}
          </div>
          <div
            style={{
              width: 110,
              height: 1,
              margin: '45px 0 34px',
              background: theme.accent,
            }}
          />
          <div
            style={{
              color: theme.muted,
              fontSize: 27,
              fontWeight: 800,
              letterSpacing: '0.06em',
              lineHeight: 1.4,
            }}
          >
            {copy.hostLine}
          </div>
        </div>
      </Scene>
    </AbsoluteFill>
  );
};

export const CatalogInvitation: React.FC<CatalogInvitationProps> = ({
  templateId = 'engagement-invite',
  templateVersion,
  assetBaseUrl,
  ...props
}) => {
  const template = getInvitationTemplate(templateId, templateVersion);

  if (template.id === 'engagement-invite' && template.version === 1) {
    return <EngagementInvite {...props} />;
  }

  return (
    <CategoryInvitation
      {...props}
      assetBaseUrl={assetBaseUrl}
      templateId={template.id}
      templateVersion={template.version}
    />
  );
};

export const WeddingNoor: React.FC<InvitationContentProps> = (props) => (
  <CategoryInvitation
    {...props}
    templateId="wedding-noor"
    templateVersion={1}
  />
);

export const BirthdayConfetti: React.FC<InvitationContentProps> = (props) => (
  <CategoryInvitation
    {...props}
    templateId="birthday-confetti"
    templateVersion={1}
  />
);

export const BabyShowerMoon: React.FC<InvitationContentProps> = (props) => (
  <CategoryInvitation
    {...props}
    templateId="baby-shower-moon"
    templateVersion={1}
  />
);

export const HousewarmingAangan: React.FC<InvitationContentProps> = (props) => (
  <CategoryInvitation
    {...props}
    templateId="housewarming-aangan"
    templateVersion={1}
  />
);
