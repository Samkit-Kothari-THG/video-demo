import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const serif = 'Georgia, "Times New Roman", serif';
const sans =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const script = '"Brush Script MT", "Snell Roundhand", "Segoe Script", cursive';

const gold = '#d7ad55';
const deepGold = '#8f6424';
const grey = '#aeb2ad';
const ivory = '#fff5d8';
const ink = '#2f2b28';

const assets = {
  saveDate: staticFile('engagement/save-date.jpg'),
  mandalaCouple: staticFile('engagement/couple-mandala.jpg'),
  celebration: staticFile('engagement/celebration.jpg'),
  couplePhoto: staticFile('engagement/couple-photo.jpg'),
  venuePhoto: staticFile('engagement/venue-photo.jpg'),
  ringInvite: staticFile('engagement/ring-invite.jpg'),
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
  fadeDuration = 22,
) => fade(frame, start, fadeDuration) * fadeOut(frame, end - fadeDuration, fadeDuration);

const goldShadow = {
  color: ivory,
  textShadow:
    '0 2px 0 #7a5720, 0 7px 18px rgba(66,43,13,0.45), 0 0 22px rgba(255,230,146,0.35)',
};

export const EngagementInvite: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${grey} 0%, #c6c6bf 46%, #969b96 100%)`,
        overflow: 'hidden',
        color: ivory,
        fontFamily: serif,
      }}
    >
      <BaseTexture />
      <MandalaBackdrop />
      <FloatingPetals />
      <Sparkles />

      <OpeningScene frame={frame} />
      <CoupleRevealScene frame={frame} />
      <SaveDateScene frame={frame} />
      <VenueScene frame={frame} />
      <PhotoMomentScene frame={frame} />
      <FamilyCloseScene frame={frame} />
    </AbsoluteFill>
  );
};

const BaseTexture: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 720], [0, -70]);

  return (
    <AbsoluteFill>
      <Img
        src={assets.ringInvite}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.18,
          filter: 'grayscale(0.2) blur(1px)',
          transform: `scale(1.08) translateY(${drift}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(174,178,173,0.76), rgba(190,190,181,0.82) 42%, rgba(138,142,137,0.9))',
        }}
      />
    </AbsoluteFill>
  );
};

const MandalaBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const spin = interpolate(frame, [0, 720], [0, 18]);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: -110,
          top: 140,
          width: 1300,
          height: 1300,
          borderRadius: 650,
          opacity: 0.38,
          background:
            'repeating-conic-gradient(from 0deg, rgba(215,173,85,0.46) 0deg 2deg, transparent 2deg 7deg), radial-gradient(circle, transparent 0 30%, rgba(215,173,85,0.28) 31%, transparent 32% 52%, rgba(215,173,85,0.22) 53%, transparent 54%)',
          border: '2px solid rgba(215,173,85,0.32)',
          transform: `rotate(${spin}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 92,
          bottom: 92,
          border: '2px solid rgba(215,173,85,0.62)',
          boxShadow: 'inset 0 0 40px rgba(255,245,216,0.18)',
        }}
      />
    </>
  );
};

const OpeningScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = sceneOpacity(frame, 0, 105);
  const title = fade(frame, 22, 36);
  const ringScale = interpolate(title, [0, 1], [0.82, 1]);

  return (
    <Scene opacity={opacity}>
      <CornerFlorals />
      <div
        style={{
          position: 'absolute',
          top: 245,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: sans,
          fontSize: 34,
          letterSpacing: 5,
          color: '#3d372e',
          opacity: fade(frame, 8, 24),
        }}
      >
        YOU ARE INVITED TO
      </div>
      <div
        style={{
          position: 'absolute',
          top: 320,
          left: 70,
          right: 70,
          textAlign: 'center',
          fontFamily: script,
          fontSize: 144,
          lineHeight: 0.9,
          color: '#fff2c7',
          textShadow:
            '0 3px 0 rgba(122,87,32,0.75), 0 20px 42px rgba(111,75,22,0.38), 0 0 34px rgba(255,232,144,0.8)',
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [36, 0])}px)`,
        }}
      >
        Engagement
      </div>
      <Img
        src={assets.ringInvite}
        style={{
          position: 'absolute',
          left: 155,
          right: 155,
          bottom: 250,
          width: 770,
          height: 520,
          objectFit: 'cover',
          objectPosition: '50% 82%',
          borderRadius: 34,
          opacity: fade(frame, 38, 28),
          transform: `scale(${ringScale})`,
          boxShadow: '0 30px 80px rgba(38,29,16,0.28)',
          filter: 'saturate(0.92) contrast(1.04)',
        }}
      />
      <GoldRule top={565} opacity={fade(frame, 54, 24)} />
    </Scene>
  );
};

const CoupleRevealScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = sceneOpacity(frame, 82, 232);
  const p = fade(frame, 95, 34);
  const {fps} = useVideoConfig();
  const settle = spring({
    frame: frame - 105,
    fps,
    config: {damping: 16, stiffness: 82, mass: 0.9},
  });

  return (
    <Scene opacity={opacity}>
      <CornerFlorals />
      <GoldGarland opacity={fade(frame, 90, 25)} />
      <GoldFrame
        opacity={p}
        top={245}
        height={780}
        scale={interpolate(settle, [0, 1], [0.88, 1])}
      >
        <Img
          src={assets.mandalaCouple}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '50% 43%',
            filter: 'saturate(1.02) contrast(1.04)',
          }}
        />
      </GoldFrame>
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          bottom: 355,
          textAlign: 'center',
          fontFamily: script,
          fontSize: 108,
          lineHeight: 1,
          ...goldShadow,
          opacity: fade(frame, 132, 32),
        }}
      >
        Anusha with Akshat
      </div>
      <div
        style={{
          position: 'absolute',
          left: 260,
          right: 260,
          bottom: 286,
          height: 2,
          background:
            'linear-gradient(90deg, transparent, rgba(255,240,190,0.9), transparent)',
          opacity: fade(frame, 154, 26),
        }}
      />
    </Scene>
  );
};

const SaveDateScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = sceneOpacity(frame, 205, 392);
  const p = fade(frame, 218, 28);
  const glow = Math.sin(frame / 8) * 0.5 + 0.5;

  return (
    <Scene opacity={opacity}>
      <Img
        src={assets.saveDate}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 48%',
          opacity: 0.56,
          transform: `scale(${1.08 + fade(frame, 218, 120) * 0.05})`,
          filter: 'saturate(0.96) contrast(0.96)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(70,70,64,0.18), rgba(174,178,173,0.5) 45%, rgba(70,62,44,0.48))',
        }}
      />
      <GoldGarland opacity={p} />
      <Panel top={314} height={730} opacity={fade(frame, 232, 28)}>
        <SmallCaps>Save the Date</SmallCaps>
        <div
          style={{
            marginTop: 36,
            fontFamily: serif,
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: 1,
            ...goldShadow,
          }}
        >
          20.07.2026
        </div>
        <div
          style={{
            margin: '52px auto 0',
            width: 610,
            height: 2,
            background:
              'linear-gradient(90deg, transparent, rgba(255,241,192,0.95), transparent)',
          }}
        />
        <div
          style={{
            marginTop: 48,
            fontFamily: sans,
            fontSize: 34,
            letterSpacing: 4,
            color: '#312b22',
          }}
        >
          VENUE
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: serif,
            fontSize: 56,
            fontWeight: 800,
            color: ivory,
            textShadow:
              '0 2px 0 rgba(86,59,23,0.9), 0 10px 24px rgba(42,30,14,0.36)',
          }}
        >
          The Legacy Nasik
        </div>
      </Panel>
      <div
        style={{
          position: 'absolute',
          left: 226,
          right: 226,
          top: 433,
          height: 114,
          borderRadius: 28,
          border: '2px solid rgba(255,231,154,0.78)',
          boxShadow: `0 0 ${24 + glow * 24}px rgba(255,225,125,0.78)`,
          opacity: fade(frame, 258, 24),
        }}
      />
    </Scene>
  );
};

const VenueScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = sceneOpacity(frame, 365, 535);
  const reveal = fade(frame, 386, 32);

  return (
    <Scene opacity={opacity}>
      <Img
        src={assets.venuePhoto}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '38% 50%',
          transform: `scale(${1.07 + reveal * 0.04})`,
          filter: 'saturate(1.04) contrast(1.05) brightness(0.8)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(28,24,20,0.28), rgba(45,38,30,0.22) 45%, rgba(24,20,16,0.75))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 180,
          padding: '36px 30px',
          textAlign: 'center',
          border: '1px solid rgba(255,234,174,0.65)',
          background: 'rgba(33,28,22,0.38)',
          backdropFilter: 'blur(2px)',
          opacity: reveal,
          transform: `translateY(${interpolate(reveal, [0, 1], [50, 0])}px)`,
        }}
      >
        <SmallCaps light>Celebration Venue</SmallCaps>
        <div
          style={{
            marginTop: 22,
            fontFamily: serif,
            fontSize: 70,
            fontWeight: 800,
            ...goldShadow,
          }}
        >
          The Legacy Nasik
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 74,
          right: 74,
          bottom: 145,
          fontFamily: script,
          fontSize: 92,
          lineHeight: 1,
          textAlign: 'center',
          ...goldShadow,
          opacity: fade(frame, 430, 34),
        }}
      >
        Join our celebration...
      </div>
    </Scene>
  );
};

const PhotoMomentScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = sceneOpacity(frame, 500, 642);
  const p = fade(frame, 514, 32);

  return (
    <Scene opacity={opacity}>
      <CornerFlorals />
      <GoldFrame opacity={p} top={200} height={880} scale={1}>
        <Img
          src={assets.couplePhoto}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '52% 42%',
            transform: `scale(${1.06 + p * 0.04})`,
          }}
        />
      </GoldFrame>
      <Panel top={1185} height={315} opacity={fade(frame, 548, 24)}>
        <div
          style={{
            fontFamily: serif,
            fontSize: 50,
            lineHeight: 1.22,
            color: '#332d25',
            fontWeight: 700,
          }}
        >
          Join us as we celebrate
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: script,
            fontSize: 86,
            lineHeight: 1,
            ...goldShadow,
          }}
        >
          their new beginning
        </div>
      </Panel>
    </Scene>
  );
};

const FamilyCloseScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = sceneOpacity(frame, 612, 720, 20);
  const p = fade(frame, 622, 28);

  return (
    <Scene opacity={opacity}>
      <Img
        src={assets.celebration}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 45%',
          opacity: 0.52,
          filter: 'saturate(0.95) contrast(0.96)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(174,178,173,0.58), rgba(174,178,173,0.72) 47%, rgba(101,96,82,0.64))',
        }}
      />
      <GoldGarland opacity={p} />
      <div
        style={{
          position: 'absolute',
          top: 270,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: script,
          fontSize: 100,
          lineHeight: 1,
          ...goldShadow,
          opacity: p,
        }}
      >
        With love
      </div>
      <div
        style={{
          position: 'absolute',
          left: 112,
          right: 112,
          top: 540,
          height: 500,
          borderRadius: 250,
          border: '2px solid rgba(215,173,85,0.7)',
          background:
            'radial-gradient(circle, rgba(255,247,217,0.32), rgba(215,173,85,0.12) 54%, transparent 70%)',
          opacity: fade(frame, 636, 24),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 50,
          right: 50,
          top: 660,
          textAlign: 'center',
          fontFamily: serif,
          fontSize: 112,
          lineHeight: 0.92,
          fontWeight: 900,
          ...goldShadow,
          opacity: fade(frame, 650, 30),
        }}
      >
        Bhalgat
        <br />
        Family
      </div>
      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          bottom: 220,
          padding: '26px 28px',
          textAlign: 'center',
          fontFamily: sans,
          fontSize: 34,
          lineHeight: 1.35,
          letterSpacing: 1,
          color: '#332d25',
          background: 'rgba(255,247,219,0.58)',
          border: '1px solid rgba(215,173,85,0.64)',
          opacity: fade(frame, 670, 22),
        }}
      >
        Anusha with Akshat
        <br />
        20.07.2026 | The Legacy Nasik
      </div>
    </Scene>
  );
};

const Scene: React.FC<{opacity: number; children: React.ReactNode}> = ({
  opacity,
  children,
}) => (
  <AbsoluteFill
    style={{
      opacity,
      pointerEvents: 'none',
    }}
  >
    {children}
  </AbsoluteFill>
);

const GoldFrame: React.FC<{
  opacity: number;
  top: number;
  height: number;
  scale: number;
  children: React.ReactNode;
}> = ({opacity, top, height, scale, children}) => (
  <div
    style={{
      position: 'absolute',
      left: 92,
      right: 92,
      top,
      height,
      borderRadius: 38,
      overflow: 'hidden',
      border: '3px solid rgba(215,173,85,0.86)',
      boxShadow:
        '0 28px 86px rgba(42,31,16,0.34), inset 0 0 0 10px rgba(255,246,214,0.18)',
      opacity,
      transform: `scale(${scale})`,
    }}
  >
    {children}
  </div>
);

const Panel: React.FC<{
  top: number;
  height: number;
  opacity: number;
  children: React.ReactNode;
}> = ({top, height, opacity, children}) => (
  <div
    style={{
      position: 'absolute',
      left: 80,
      right: 80,
      top,
      height,
      borderRadius: 34,
      padding: '56px 38px',
      textAlign: 'center',
      background: 'rgba(235,234,222,0.58)',
      border: '1px solid rgba(215,173,85,0.72)',
      boxShadow: '0 24px 72px rgba(55,44,24,0.24)',
      opacity,
      transform: `translateY(${interpolate(opacity, [0, 1], [48, 0])}px)`,
    }}
  >
    {children}
  </div>
);

const SmallCaps: React.FC<{children: React.ReactNode; light?: boolean}> = ({
  children,
  light = false,
}) => (
  <div
    style={{
      fontFamily: sans,
      fontSize: 32,
      fontWeight: 800,
      letterSpacing: 5,
      color: light ? ivory : ink,
      textShadow: light ? '0 5px 20px rgba(0,0,0,0.4)' : 'none',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

const GoldRule: React.FC<{top: number; opacity: number}> = ({top, opacity}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: 230,
      right: 230,
      height: 3,
      opacity,
      background:
        'linear-gradient(90deg, transparent, rgba(255,241,192,0.95), transparent)',
    }}
  />
);

const GoldGarland: React.FC<{opacity: number}> = ({opacity}) => (
  <div
    style={{
      position: 'absolute',
      top: 42,
      left: 0,
      right: 0,
      height: 170,
      opacity,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: 14,
      filter: 'drop-shadow(0 10px 18px rgba(69,45,11,0.28))',
    }}
  >
    {Array.from({length: 28}).map((_, index) => (
      <div
        key={index}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          marginTop: Math.sin(index / 2) * 26 + 34,
          background:
            index % 3 === 0
              ? '#f0a219'
              : index % 3 === 1
                ? '#f6c744'
                : '#fff4d4',
          border: '2px solid rgba(141,95,22,0.2)',
        }}
      />
    ))}
  </div>
);

const CornerFlorals: React.FC = () => (
  <>
    <FlowerCluster left={-38} top={20} rotate={-12} />
    <FlowerCluster right={-42} top={28} rotate={14} />
    <FlowerCluster left={-34} bottom={-22} rotate={18} />
    <FlowerCluster right={-28} bottom={-12} rotate={-16} />
  </>
);

const FlowerCluster: React.FC<{
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  rotate: number;
}> = ({left, right, top, bottom, rotate}) => (
  <div
    style={{
      position: 'absolute',
      left,
      right,
      top,
      bottom,
      width: 260,
      height: 260,
      transform: `rotate(${rotate}deg)`,
      opacity: 0.88,
    }}
  >
    {Array.from({length: 8}).map((_, index) => {
      const angle = (Math.PI * 2 * index) / 8;
      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: 100 + Math.cos(angle) * 58,
            top: 100 + Math.sin(angle) * 58,
            width: index % 2 === 0 ? 92 : 70,
            height: index % 2 === 0 ? 62 : 50,
            borderRadius: '50%',
            background:
              index % 3 === 0
                ? '#f1c7bc'
                : index % 3 === 1
                  ? '#fff0dc'
                  : '#c3d1bb',
            transform: `rotate(${index * 28}deg)`,
            boxShadow: '0 8px 18px rgba(63,48,35,0.16)',
          }}
        />
      );
    })}
  </div>
);

const FloatingPetals: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({length: 30}).map((_, index) => {
        const y = (index * 79 + frame * (0.9 + (index % 5) * 0.18)) % 2100;
        const x = (index * 89 + Math.sin(frame / 38 + index) * 38) % 1080;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y - 120,
              width: 22 + (index % 4) * 4,
              height: 13 + (index % 3) * 3,
              borderRadius: '60% 40% 60% 40%',
              background: index % 2 === 0 ? '#eeb7ac' : '#f7e0bf',
              opacity: 0.28 + (index % 4) * 0.08,
              transform: `rotate(${frame * 1.2 + index * 27}deg)`,
              filter: 'blur(0.2px)',
            }}
          />
        );
      })}
    </>
  );
};

const Sparkles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({length: 38}).map((_, index) => {
        const pulse = Math.sin(frame / 9 + index) * 0.5 + 0.5;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: (index * 83) % 1040,
              top: 160 + ((index * 139) % 1530),
              width: 4 + pulse * 8,
              height: 4 + pulse * 8,
              borderRadius: 8,
              background: gold,
              opacity: 0.2 + pulse * 0.45,
              boxShadow: '0 0 18px rgba(255,229,142,0.8)',
            }}
          />
        );
      })}
    </>
  );
};
