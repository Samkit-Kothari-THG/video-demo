import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  resolveEngagementInviteProps,
  type EngagementInviteProps,
  type ResolvedEngagementInviteProps,
} from './model';

const serif = 'Georgia, "Times New Roman", serif';
const sans =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const palette = {
  ivory: '#fff8ea',
  warmIvory: '#f5e5ca',
  beige: '#d8bf99',
  blush: '#e7b5aa',
  gold: '#c89031',
  lightGold: '#efd08a',
  deepGold: '#8d5a1d',
  maroon: '#741f2f',
  ink: '#3b3027',
};

const fade = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

const fadeOut = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

const sceneOpacity = (
  frame: number,
  start: number,
  end: number,
  fadeDuration = 24,
) => fade(frame, start, fadeDuration) * fadeOut(frame, end - fadeDuration, fadeDuration);

const yIn = (frame: number, start: number, distance = 36) =>
  interpolate(fade(frame, start, 28), [0, 1], [distance, 0]);

const goldText = {
  color: '#b87924',
  textShadow:
    '0 1px 0 rgba(255,249,232,0.95), 0 3px 0 rgba(141,90,29,0.18), 0 18px 36px rgba(82,49,16,0.22), 0 0 24px rgba(239,208,138,0.32)',
};

const mediaSource = (source: string | null) => {
  if (!source) {
    return null;
  }

  return /^(data:|blob:|https?:\/\/|\/)/.test(source) ? source : staticFile(source);
};

export const EngagementInvite: React.FC<EngagementInviteProps> = (props) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const details = resolveEngagementInviteProps(props);
  const musicSrc = mediaSource(details.musicSrc);
  const audioVolume = (audioFrame: number) => {
    const intro = fade(audioFrame, 0, 24);
    const outro = fadeOut(audioFrame, durationInFrames - 54, 44);
    return 0.32 * intro * outro;
  };

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        color: palette.ink,
        fontFamily: serif,
        background: palette.ivory,
      }}
    >
      {musicSrc ? <Audio src={musicSrc} volume={audioVolume} /> : null}
      <SilkBackdrop />
      <GeneratedInviteArt />
      <AmbientLight />
      <BackgroundMandala />
      <FloatingPetals />
      <GoldParticles />
      <BeatRings />
      <OuterBorder />

      <OpeningScene frame={frame} details={details} />
      <CoupleRevealScene frame={frame} details={details} />
      <PhotoMomentScene
        frame={frame}
        details={details}
        showPhoto={details.showPhoto}
      />
      <DetailsScene frame={frame} details={details} />
      <FamilyScene frame={frame} details={details} />
      <FinaleScene frame={frame} details={details} />
    </AbsoluteFill>
  );
};

const SilkBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 900], [0, -62]);

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at 50% 12%, rgba(255,255,247,0.92), rgba(255,248,234,0.54) 26%, transparent 52%),
          radial-gradient(circle at 8% 78%, rgba(231,181,170,0.34), transparent 38%),
          radial-gradient(circle at 92% 82%, rgba(200,144,49,0.22), transparent 34%),
          linear-gradient(180deg, #fff8ea 0%, #f5e5ca 54%, #e8cda6 100%)
        `,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -120,
          opacity: 0.25,
          transform: `translateY(${drift}px)`,
          background: `
            repeating-linear-gradient(112deg, transparent 0 34px, rgba(255,255,255,0.42) 35px 36px, transparent 37px 78px),
            repeating-linear-gradient(24deg, rgba(116,31,47,0.04) 0 2px, transparent 3px 36px)
          `,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(255,248,234,0.18), transparent 44%, rgba(94,50,36,0.08))',
        }}
      />
    </AbsoluteFill>
  );
};

const GeneratedInviteArt: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = frame / Math.max(durationInFrames - 1, 1);
  const beatLift = Math.sin((frame / 15) * Math.PI * 2) * 2;

  return (
    <Img
      src={staticFile('engagement/luxury-invite-bg.png')}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: '50% 50%',
        opacity: 0.5,
        mixBlendMode: 'multiply',
        filter: 'saturate(0.9) brightness(1.05) contrast(0.96)',
        transform: `scale(${1.045 + progress * 0.035}) translateY(${beatLift}px)`,
      }}
    />
  );
};

const AmbientLight: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame / 18) * 0.5 + 0.5;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: -210,
          top: 260,
          width: 560,
          height: 560,
          borderRadius: 280,
          background: 'rgba(231,181,170,0.22)',
          filter: 'blur(76px)',
          transform: `scale(${0.95 + pulse * 0.08})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -230,
          bottom: 190,
          width: 660,
          height: 660,
          borderRadius: 330,
          background: 'rgba(200,144,49,0.18)',
          filter: 'blur(86px)',
          transform: `scale(${1.04 - pulse * 0.06})`,
        }}
      />
    </>
  );
};

const BackgroundMandala: React.FC = () => {
  const frame = useCurrentFrame();
  const rotate = interpolate(frame, [0, 900], [0, 18]);
  const scale = interpolate(frame, [0, 900], [1, 1.055]);

  return (
    <>
      <Mandala
        size={1080}
        opacity={0.125}
        style={{
          position: 'absolute',
          left: 0,
          top: 250,
          transform: `rotate(${rotate}deg) scale(${scale})`,
        }}
      />
      <Mandala
        size={660}
        opacity={0.075}
        style={{
          position: 'absolute',
          left: -245,
          top: -115,
          transform: `rotate(${-rotate * 1.2}deg)`,
        }}
      />
      <Mandala
        size={700}
        opacity={0.075}
        style={{
          position: 'absolute',
          right: -280,
          bottom: -150,
          transform: `rotate(${-rotate * 1.35}deg)`,
        }}
      />
    </>
  );
};

const OpeningScene: React.FC<{
  frame: number;
  details: ResolvedEngagementInviteProps;
}> = ({frame, details}) => {
  const opacity = sceneOpacity(frame, 0, 145);
  const title = fade(frame, 20, 34);
  const event = fade(frame, 58, 28);

  return (
    <Scene opacity={opacity}>
      <MarigoldGarland top={74} opacity={fade(frame, 8, 28)} sway />
      <div
        style={{
          position: 'absolute',
          left: 92,
          right: 92,
          top: 430,
          textAlign: 'center',
          opacity: title,
          transform: `translateY(${yIn(frame, 20)}px) scale(${interpolate(title, [0, 1], [0.94, 1])})`,
        }}
      >
        <SmallCaps>{details.saveDateTitle}</SmallCaps>
        <LotusDivider opacity={fade(frame, 36, 24)} style={{margin: '58px auto 0'}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 110,
          right: 110,
          top: 760,
          textAlign: 'center',
          fontSize: 60,
          lineHeight: 1.15,
          fontWeight: 700,
          color: palette.ink,
          opacity: event,
          transform: `translateY(${yIn(frame, 58, 28)}px)`,
        }}
      >
        {details.eventLine}
      </div>
      <DiyasRow opacity={fade(frame, 92, 26)} bottom={270} beatFrame={frame} />
      <PetalBurst frame={frame} start={28} />
    </Scene>
  );
};

const CoupleRevealScene: React.FC<{
  frame: number;
  details: ResolvedEngagementInviteProps;
}> = ({frame, details}) => {
  const opacity = sceneOpacity(frame, 105, 315);
  const {fps} = useVideoConfig();
  const settle = spring({
    frame: frame - 126,
    fps,
    config: {damping: 16, stiffness: 88, mass: 0.82},
  });
  const shimmer = interpolate(Math.sin((frame - 140) / 12), [-1, 1], [-70, 70]);

  return (
    <Scene opacity={opacity}>
      <ArchFrame
        top={245}
        height={1045}
        opacity={fade(frame, 120, 30)}
        scale={interpolate(settle, [0, 1], [0.92, 1])}
        draw={fade(frame, 118, 42)}
      />
      <div
        style={{
          position: 'absolute',
          left: 86,
          right: 86,
          top: 565,
          textAlign: 'center',
          opacity: fade(frame, 152, 32),
          transform: `translateY(${yIn(frame, 152, 32)}px)`,
        }}
      >
        <NameLine shimmer={shimmer} size={92}>
          {details.coupleLine}
        </NameLine>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 150,
          right: 150,
          top: 935,
          textAlign: 'center',
          fontFamily: sans,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 4,
          color: palette.maroon,
          opacity: fade(frame, 190, 26),
        }}
      >
        {details.eventLine}
      </div>
      <RingPair opacity={fade(frame, 215, 24)} top={1060} />
      <PetalBurst frame={frame} start={170} />
    </Scene>
  );
};

const PhotoMomentScene: React.FC<{
  frame: number;
  details: ResolvedEngagementInviteProps;
  showPhoto: boolean;
}> = ({frame, details, showPhoto}) => {
  const opacity = sceneOpacity(frame, 285, 500);
  const reveal = fade(frame, 302, 34);
  const photoSrc = mediaSource(details.photoSrc);

  return (
    <Scene opacity={opacity}>
      {showPhoto && photoSrc ? (
        <>
          <Img
            src={photoSrc}
            style={{
              position: 'absolute',
              inset: -90,
              width: 'calc(100% + 180px)',
              height: 'calc(100% + 180px)',
              objectFit: 'cover',
              objectPosition: `50% ${Math.min(details.photoFocalPoint + 10, 100)}%`,
              opacity: 0.14 * reveal,
              filter: 'blur(14px) saturate(0.78) sepia(0.22) brightness(1.12)',
              transform: `scale(${1.08 + reveal * 0.035})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(255,248,234,0.84), rgba(246,229,202,0.7) 50%, rgba(255,248,234,0.9))',
            }}
          />
        </>
      ) : null}
      <ArchPhoto
        src={photoSrc}
        opacity={reveal}
        showPhoto={showPhoto}
        focalPoint={details.photoFocalPoint}
      />
      <div
        style={{
          position: 'absolute',
          left: 95,
          right: 95,
          bottom: 235,
          textAlign: 'center',
          opacity: fade(frame, 332, 30),
          transform: `translateY(${yIn(frame, 332, 30)}px)`,
        }}
      >
        <NameLine shimmer={interpolate(Math.sin(frame / 11), [-1, 1], [-70, 70])} compact>
          {details.coupleLine}
        </NameLine>
        <GoldRule style={{margin: '38px auto 0', width: 430}} />
      </div>
    </Scene>
  );
};

const DetailsScene: React.FC<{
  frame: number;
  details: ResolvedEngagementInviteProps;
}> = ({frame, details}) => {
  const opacity = sceneOpacity(frame, 465, 665);
  const reveal = fade(frame, 488, 32);

  return (
    <Scene opacity={opacity}>
      <MarigoldGarland top={68} opacity={fade(frame, 482, 26)} compact sway />
      <div
        style={{
          position: 'absolute',
          left: 82,
          right: 82,
          top: 350,
          height: 980,
          opacity: reveal,
          transform: `translateY(${yIn(frame, 488, 32)}px)`,
        }}
      >
        <ThinArch draw={reveal} />
        <div
          style={{
            position: 'absolute',
            left: 52,
            right: 52,
            top: 220,
            textAlign: 'center',
          }}
        >
          <SmallCaps>{details.saveDateTitle}</SmallCaps>
          <DetailLine
            label="Date"
            value={details.date}
            delay={frame}
            start={520}
            accent
          />
          <GoldRule style={{margin: '48px auto 0'}} />
          <DetailLine label="Venue" value={details.venueName} delay={frame} start={572} />
        </div>
      </div>
      <RingPair opacity={fade(frame, 610, 24)} top={1165} />
      <DiyasRow opacity={fade(frame, 620, 24)} bottom={198} beatFrame={frame} />
    </Scene>
  );
};

const FamilyScene: React.FC<{
  frame: number;
  details: ResolvedEngagementInviteProps;
}> = ({frame, details}) => {
  const opacity = sceneOpacity(frame, 625, 790);
  const reveal = fade(frame, 642, 28);
  const pulse = Math.sin(frame / 10) * 0.5 + 0.5;

  return (
    <Scene opacity={opacity}>
      <Mandala
        size={790}
        opacity={0.11 * reveal}
        style={{
          position: 'absolute',
          left: 145,
          top: 315,
          transform: `rotate(${interpolate(frame, [625, 790], [-8, 6])}deg)`,
        }}
      />
      <MarigoldGarland top={82} opacity={reveal} sway />
      <div
        style={{
          position: 'absolute',
          left: 82,
          right: 82,
          top: 520,
          textAlign: 'center',
          opacity: reveal,
          transform: `translateY(${yIn(frame, 642, 28)}px)`,
        }}
      >
        <SmallCaps>With love from</SmallCaps>
        <div
          style={{
            marginTop: 58,
            fontSize: 92,
            lineHeight: 1.05,
            fontStyle: 'italic',
            fontWeight: 700,
            color: palette.maroon,
            textShadow: `0 16px 38px rgba(92,45,36,${0.14 + pulse * 0.08})`,
          }}
        >
          {details.familyName}
        </div>
        <div
          style={{
            margin: '62px auto 0',
            maxWidth: 700,
            fontSize: 48,
            lineHeight: 1.28,
            color: palette.ink,
          }}
        >
          Join us for a joyful celebration
        </div>
      </div>
      <DiyasRow opacity={fade(frame, 710, 22)} bottom={218} beatFrame={frame} />
      <PetalBurst frame={frame} start={655} />
    </Scene>
  );
};

const FinaleScene: React.FC<{
  frame: number;
  details: ResolvedEngagementInviteProps;
}> = ({frame, details}) => {
  const opacity = sceneOpacity(frame, 760, 900, 18);
  const reveal = fade(frame, 774, 30);
  const shimmer = interpolate(Math.sin((frame - 780) / 10), [-1, 1], [-70, 70]);

  return (
    <Scene opacity={opacity}>
      <Mandala
        size={820}
        opacity={0.11 * reveal}
        style={{
          position: 'absolute',
          left: 130,
          top: 280,
          transform: `rotate(${interpolate(frame, [760, 900], [6, 0])}deg)`,
        }}
      />
      <MarigoldGarland top={82} opacity={reveal} compact sway />
      <div
        style={{
          position: 'absolute',
          left: 76,
          right: 76,
          top: 420,
          textAlign: 'center',
          opacity: reveal,
          transform: `translateY(${yIn(frame, 774, 26)}px)`,
        }}
      >
        <SmallCaps>{details.saveDateTitle}</SmallCaps>
        <div style={{marginTop: 40}}>
          <NameLine shimmer={shimmer} compact>
            {details.coupleLine}
          </NameLine>
        </div>
        <div
          style={{
            margin: '70px auto 0',
            maxWidth: 790,
            fontSize: 48,
            lineHeight: 1.35,
            fontWeight: 700,
            color: palette.ink,
          }}
        >
          Venue : {details.venueName}
        </div>
        <div
          style={{
            marginTop: 44,
            fontFamily: sans,
            fontSize: 29,
            lineHeight: 1.55,
            letterSpacing: 3,
            color: palette.maroon,
          }}
        >
          Date : {details.date}
          <br />
          {details.familyName}
        </div>
      </div>
      <DiyasRow opacity={fade(frame, 834, 24)} bottom={198} beatFrame={frame} />
    </Scene>
  );
};

const Scene: React.FC<{opacity: number; children: React.ReactNode}> = ({
  opacity,
  children,
}) => (
  <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>{children}</AbsoluteFill>
);

const SmallCaps: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      fontFamily: sans,
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: 4,
      lineHeight: 1.5,
      color: palette.maroon,
    }}
  >
    {children}
  </div>
);

const NameLine: React.FC<{
  children: React.ReactNode;
  shimmer: number;
  compact?: boolean;
  size?: number;
}> = ({children, shimmer, compact = false, size}) => (
  <div
    style={{
      position: 'relative',
      fontSize: (() => {
        const baseSize = size ?? (compact ? 76 : 112);
        const textLength = typeof children === 'string' ? children.length : 0;
        const scale = textLength > 22 ? Math.max(0.62, 22 / textLength) : 1;
        return baseSize * scale;
      })(),
      lineHeight: compact ? 1.08 : 0.96,
      fontWeight: 700,
      fontStyle: 'italic',
      ...goldText,
      WebkitTextStroke: '1px rgba(141,90,29,0.24)',
    }}
  >
    <span>{children}</span>
    <span
      style={{
        position: 'absolute',
        inset: 0,
        color: 'transparent',
        background: `linear-gradient(100deg, transparent ${31 + shimmer * 0.12}%, rgba(255,255,255,0.86) ${45 + shimmer * 0.12}%, transparent ${59 + shimmer * 0.12}%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        opacity: 0.52,
      }}
    >
      {children}
    </span>
  </div>
);

const DetailLine: React.FC<{
  label: string;
  value: string;
  delay: number;
  start: number;
  accent?: boolean;
}> = ({label, value, delay, start, accent = false}) => {
  const p = fade(delay, start, 26);
  const baseSize = accent ? 76 : 58;
  const valueScale = value.length > 32 ? Math.max(0.66, 32 / value.length) : 1;

  return (
    <div
      style={{
        marginTop: accent ? 52 : 64,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
      }}
    >
      <div
        style={{
          fontSize: baseSize * valueScale,
          lineHeight: 1.08,
          fontWeight: 700,
          color: accent ? palette.maroon : palette.ink,
        }}
      >
        {label} : {value}
      </div>
    </div>
  );
};

const OuterBorder: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 44,
        border: '1px solid rgba(200,144,49,0.58)',
        borderRadius: 32,
        boxShadow: 'inset 0 0 38px rgba(255,255,255,0.34)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 62,
        border: '1px solid rgba(141,90,29,0.24)',
        borderRadius: 24,
      }}
    />
    <CornerLotus left={60} top={60} rotate={-42} />
    <CornerLotus right={60} top={60} rotate={42} />
    <CornerLotus left={60} bottom={60} rotate={-138} />
    <CornerLotus right={60} bottom={60} rotate={138} />
  </>
);

const CornerLotus: React.FC<{
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  rotate: number;
}> = ({left, right, top, bottom, rotate}) => (
  <Lotus
    size={96}
    opacity={0.42}
    style={{
      position: 'absolute',
      left,
      right,
      top,
      bottom,
      transform: `rotate(${rotate}deg)`,
    }}
  />
);

const ArchFrame: React.FC<{
  top: number;
  height: number;
  opacity: number;
  scale: number;
  draw: number;
}> = ({top, height, opacity, scale, draw}) => (
  <div
    style={{
      position: 'absolute',
      left: 102,
      right: 102,
      top,
      height,
      opacity,
      transform: `scale(${scale})`,
      clipPath: `inset(${interpolate(draw, [0, 1], [48, 0])}% 0 0 0)`,
    }}
  >
    <ThinArch draw={draw} />
    <div
      style={{
        position: 'absolute',
        left: 54,
        right: 54,
        top: 86,
        bottom: 72,
        borderTopLeftRadius: 420,
        borderTopRightRadius: 420,
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        border: '1px solid rgba(200,144,49,0.42)',
      }}
    />
    <Mandala
      size={330}
      opacity={0.15}
      style={{
        position: 'absolute',
        left: '50%',
        top: 110,
        marginLeft: -165,
      }}
    />
  </div>
);

const ThinArch: React.FC<{draw?: number}> = ({draw = 1}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      borderTopLeftRadius: 470,
      borderTopRightRadius: 470,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      border: '2px solid rgba(200,144,49,0.78)',
      boxShadow:
        '0 24px 70px rgba(87,42,36,0.09), inset 0 0 0 10px rgba(255,248,234,0.25)',
      background:
        'linear-gradient(180deg, rgba(255,248,234,0.28), rgba(255,248,234,0.08))',
      transform: `scaleY(${interpolate(draw, [0, 1], [0.92, 1])})`,
      transformOrigin: '50% 100%',
    }}
  />
);

const ArchPhoto: React.FC<{
  src: string | null;
  opacity: number;
  showPhoto: boolean;
  focalPoint: number;
}> = ({src, opacity, showPhoto, focalPoint}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [285, 500], [1.12, 1.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 180,
        right: 180,
        top: 245,
        height: 795,
        opacity,
        overflow: 'hidden',
        borderTopLeftRadius: 340,
        borderTopRightRadius: 340,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        border: '2px solid rgba(200,144,49,0.72)',
        boxShadow: '0 24px 72px rgba(87,42,36,0.16)',
        background:
          'linear-gradient(180deg, rgba(255,248,234,0.44), rgba(231,181,170,0.18))',
        transform: `translateY(${interpolate(opacity, [0, 1], [32, 0])}px)`,
      }}
    >
      {showPhoto && src ? (
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `50% ${focalPoint}%`,
            filter: 'sepia(0.16) saturate(0.84) contrast(1.04) brightness(1.08)',
            transform: `scale(${scale})`,
          }}
        />
      ) : (
        <Mandala
          size={520}
          opacity={0.2}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -260,
            marginTop: -260,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, transparent 44%, rgba(255,248,234,0.18) 64%, rgba(116,31,47,0.16))',
        }}
      />
    </div>
  );
};

const GoldRule: React.FC<{style?: React.CSSProperties}> = ({style}) => (
  <div
    style={{
      width: 540,
      height: 2,
      background:
        'linear-gradient(90deg, transparent, rgba(200,144,49,0.92), rgba(239,208,138,0.95), rgba(200,144,49,0.92), transparent)',
      ...style,
    }}
  />
);

const LotusDivider: React.FC<{
  opacity: number;
  style?: React.CSSProperties;
}> = ({opacity, style}) => (
  <div
    style={{
      width: 360,
      height: 96,
      opacity,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
      ...style,
    }}
  >
    <GoldRule style={{width: 95}} />
    <Lotus size={92} opacity={0.86} />
    <GoldRule style={{width: 95}} />
  </div>
);

const RingPair: React.FC<{opacity: number; top: number}> = ({opacity, top}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top,
      opacity,
      display: 'flex',
      justifyContent: 'center',
      filter: 'drop-shadow(0 12px 24px rgba(90,55,18,0.18))',
    }}
  >
    <RingIcon size={150} />
  </div>
);

const MarigoldGarland: React.FC<{
  top: number;
  opacity: number;
  compact?: boolean;
  sway?: boolean;
}> = ({top, opacity, compact = false, sway = false}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 112,
        right: 112,
        height: compact ? 105 : 145,
        opacity,
        display: 'flex',
        justifyContent: 'center',
        gap: compact ? 12 : 13,
        filter: 'drop-shadow(0 10px 14px rgba(96,61,19,0.18))',
      }}
    >
      {Array.from({length: compact ? 17 : 19}).map((_, index) => (
        <div
          key={index}
          style={{
            marginTop:
              Math.sin(index * 0.78 + (sway ? frame / 18 : 0)) * (compact ? 12 : 20) +
              (compact ? 22 : 34),
            transform: `rotate(${sway ? Math.sin(frame / 16 + index) * 5 : 0}deg)`,
          }}
        >
          <Marigold size={compact ? 28 : 33} tone={index % 3} />
        </div>
      ))}
    </div>
  );
};

const Marigold: React.FC<{size: number; tone: number}> = ({size, tone}) => {
  const petal = tone === 0 ? '#dfa348' : tone === 1 ? '#d98732' : '#eccb75';
  const center = tone === 2 ? '#a86c2a' : '#efba46';

  return (
    <div style={{position: 'relative', width: size, height: size}}>
      {Array.from({length: 10}).map((_, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: size * 0.35,
            top: size * 0.08,
            width: size * 0.3,
            height: size * 0.46,
            borderRadius: '50%',
            background: petal,
            transformOrigin: `50% ${size * 0.42}px`,
            transform: `rotate(${index * 36}deg)`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: size * 0.27,
          top: size * 0.27,
          width: size * 0.46,
          height: size * 0.46,
          borderRadius: size,
          background: center,
          boxShadow: 'inset 0 0 8px rgba(110,72,18,0.18)',
        }}
      />
    </div>
  );
};

const DiyasRow: React.FC<{
  opacity: number;
  bottom: number;
  beatFrame: number;
}> = ({opacity, bottom, beatFrame}) => {
  const beat = 1 + (Math.sin((beatFrame / 15) * Math.PI * 2) * 0.5 + 0.5) * 0.06;

  return (
    <div
      style={{
        position: 'absolute',
        left: 200,
        right: 200,
        bottom,
        opacity,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transform: `scale(${beat})`,
      }}
    >
      <Diya size={130} />
      <Lotus size={112} opacity={0.54} />
      <Diya size={130} flip />
    </div>
  );
};

const FloatingPetals: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      {Array.from({length: 54}).map((_, index) => {
        const speed = 0.86 + (index % 7) * 0.18;
        const y = (index * 83 + frame * speed) % 2120;
        const x = (index * 97 + Math.sin(frame / 34 + index * 1.7) * 52) % 1080;
        const rotation = frame * (0.58 + (index % 4) * 0.16) + index * 31;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y - 140,
              width: 20 + (index % 4) * 5,
              height: 12 + (index % 3) * 4,
              borderRadius: '64% 36% 62% 38%',
              background:
                index % 4 === 0
                  ? palette.maroon
                  : index % 2 === 0
                    ? palette.blush
                    : '#f4d9bb',
              opacity: index % 4 === 0 ? 0.15 : 0.22 + (index % 3) * 0.06,
              transform: `rotate(${rotation}deg)`,
              filter: 'blur(0.15px)',
            }}
          />
        );
      })}
    </>
  );
};

const GoldParticles: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      {Array.from({length: 66}).map((_, index) => {
        const pulse = Math.sin(frame / (10 + (index % 6) * 2) + index) * 0.5 + 0.5;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 62 + ((index * 149) % 956),
              top: 165 + ((index * 211) % 1550),
              width: 3 + pulse * 7,
              height: 3 + pulse * 7,
              borderRadius: 10,
              background: palette.lightGold,
              opacity: 0.08 + pulse * 0.28,
              boxShadow: '0 0 20px rgba(239,208,138,0.72)',
            }}
          />
        );
      })}
    </>
  );
};

const BeatRings: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = (frame % 15) / 15;
  const opacity = interpolate(beat, [0, 1], [0.18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(beat, [0, 1], [0.86, 1.08]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 165,
        top: 420,
        width: 750,
        height: 750,
        borderRadius: 375,
        border: '2px solid rgba(200,144,49,0.35)',
        opacity,
        transform: `scale(${scale})`,
      }}
    />
  );
};

const PetalBurst: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const p = fade(frame, start, 34) * fadeOut(frame, start + 74, 30);

  return (
    <>
      {Array.from({length: 20}).map((_, index) => {
        const angle = (Math.PI * 2 * index) / 20;
        const distance = interpolate(fade(frame, start, 60), [0, 1], [0, 230 + (index % 4) * 35]);
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 540 + Math.cos(angle) * distance,
              top: 880 + Math.sin(angle) * distance,
              width: 24 + (index % 3) * 5,
              height: 14 + (index % 2) * 4,
              borderRadius: '64% 36% 62% 38%',
              background: index % 3 === 0 ? palette.blush : '#f1cfad',
              opacity: p * 0.5,
              transform: `rotate(${index * 29 + frame * 1.2}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

const Mandala: React.FC<{
  size: number;
  opacity: number;
  style?: React.CSSProperties;
}> = ({size, opacity, style}) => (
  <svg viewBox="0 0 500 500" width={size} height={size} style={{opacity, ...style}}>
    <g
      fill="none"
      stroke={palette.gold}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="250" cy="250" r="218" />
      <circle cx="250" cy="250" r="176" />
      <circle cx="250" cy="250" r="118" />
      <circle cx="250" cy="250" r="42" />
      {Array.from({length: 24}).map((_, index) => (
        <g key={index} transform={`rotate(${index * 15} 250 250)`}>
          <path d="M250 31 C268 76 268 110 250 148 C232 110 232 76 250 31Z" />
          <path d="M250 84 C278 122 278 156 250 190 C222 156 222 122 250 84Z" />
          <path d="M250 194 C264 218 264 238 250 262 C236 238 236 218 250 194Z" />
          <path d="M250 30 L250 470" opacity="0.38" />
        </g>
      ))}
      {Array.from({length: 12}).map((_, index) => (
        <g key={`arc-${index}`} transform={`rotate(${index * 30} 250 250)`}>
          <path d="M170 118 C203 92 297 92 330 118" />
          <path d="M188 372 C215 392 285 392 312 372" />
        </g>
      ))}
    </g>
  </svg>
);

const Lotus: React.FC<{
  size: number;
  opacity: number;
  style?: React.CSSProperties;
}> = ({size, opacity, style}) => (
  <svg
    viewBox="0 0 160 120"
    width={size}
    height={(size * 120) / 160}
    style={{opacity, ...style}}
  >
    <g
      fill="none"
      stroke={palette.gold}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M80 14 C102 42 102 72 80 101 C58 72 58 42 80 14Z" fill="rgba(200,144,49,0.08)" />
      <path d="M48 37 C72 52 78 76 63 105 C35 88 27 62 48 37Z" />
      <path d="M112 37 C88 52 82 76 97 105 C125 88 133 62 112 37Z" />
      <path d="M24 65 C55 66 72 80 75 111 C42 112 24 95 24 65Z" />
      <path d="M136 65 C105 66 88 80 85 111 C118 112 136 95 136 65Z" />
      <path d="M35 109 H125" />
    </g>
  </svg>
);

const Diya: React.FC<{size: number; flip?: boolean}> = ({size, flip = false}) => (
  <svg
    viewBox="0 0 180 130"
    width={size}
    height={(size * 130) / 180}
    style={{transform: flip ? 'scaleX(-1)' : undefined}}
  >
    <g strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M26 82 C54 118 126 118 154 82 C126 96 54 96 26 82Z"
        fill="#a85c28"
        stroke={palette.deepGold}
        strokeWidth="4"
      />
      <path
        d="M44 79 C66 91 114 91 136 79"
        fill="none"
        stroke={palette.lightGold}
        strokeWidth="4"
      />
      <path
        d="M91 15 C116 48 109 72 90 84 C71 69 70 43 91 15Z"
        fill="#f8c94b"
        stroke="#b75724"
        strokeWidth="4"
      />
      <path d="M91 35 C100 54 98 67 89 75" stroke="#fff6bf" strokeWidth="4" />
    </g>
  </svg>
);

const RingIcon: React.FC<{size: number}> = ({size}) => (
  <svg viewBox="0 0 180 120" width={size} height={(size * 120) / 180}>
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="72" cy="70" r="34" stroke={palette.gold} strokeWidth="8" />
      <circle cx="110" cy="70" r="34" stroke={palette.lightGold} strokeWidth="8" />
      <path d="M92 31 L107 12 L122 31" stroke={palette.deepGold} strokeWidth="6" />
      <path d="M102 31 L112 31" stroke={palette.deepGold} strokeWidth="6" />
      <path d="M101 17 L113 17" stroke={palette.lightGold} strokeWidth="4" />
    </g>
  </svg>
);
