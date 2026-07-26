/**
 * Early Remotion experiments retained as a visual and animation reference.
 *
 * Production-ready, user-configurable compositions belong under `src/templates`.
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const fontFamily =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const fadeIn = (frame: number, start: number, duration: number) =>
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

const textShadow = '0 22px 80px rgba(0,0,0,0.45)';

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, 0, 45);
  const y = interpolate(opacity, [0, 1], [36, 0]);
  const blur = interpolate(opacity, [0, 1], [16, 0]);

  return (
    <AbsoluteFill
      style={{
        background: '#050505',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          filter: `blur(${blur}px)`,
          fontSize: 112,
          fontWeight: 700,
          letterSpacing: 0,
          textShadow,
        }}
      >
        Hello World
      </div>
    </AbsoluteFill>
  );
};

export const LaunchDay: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const settle = spring({
    frame,
    fps,
    config: {
      damping: 11,
      mass: 1.3,
      stiffness: 78,
    },
  });
  const opacity = fadeIn(frame, 0, 22);
  const scale = interpolate(settle, [0, 1], [0.45, 1]);
  const glow = interpolate(settle, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 42%, #1C2B33 0%, #090A0F 42%, #010101 100%)',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 720,
          height: 720,
          borderRadius: 360,
          background: 'rgba(98, 230, 167, 0.12)',
          filter: 'blur(80px)',
          transform: `scale(${0.75 + glow * 0.35})`,
        }}
      />
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontSize: 164,
          fontWeight: 900,
          lineHeight: 0.9,
          letterSpacing: 0,
          textAlign: 'center',
          textShadow,
        }}
      >
        LAUNCH DAY
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 210,
          width: 520,
          height: 2,
          background:
            'linear-gradient(90deg, transparent, rgba(247,244,237,0.75), transparent)',
          opacity,
          transform: `scaleX(${clamp(settle, 0, 1)})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const IntroSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const first = fadeIn(frame, 0, 24) * fadeOut(frame, 75, 18);
  const secondSpring = spring({
    frame: frame - 85,
    fps,
    config: {damping: 10, stiffness: 120, mass: 0.7},
  });
  const second = fadeIn(frame, 85, 12) * fadeOut(frame, 180, 18);
  const third = fadeIn(frame, 188, 24);
  const thirdX = interpolate(third, [0, 1], [-160, 0]);
  const logoScale = interpolate(fadeIn(frame, 0, 35), [0, 1], [0.86, 1]);

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(135deg, #07111F 0%, #121016 42%, #09251B 100%)',
        color: '#F7F4ED',
        fontFamily,
        overflow: 'hidden',
      }}
    >
      <MovingBackdrop />
      <Img
        src={staticFile('logo.svg')}
        style={{
          position: 'absolute',
          top: 88,
          left: '50%',
          width: 150,
          height: 150,
          marginLeft: -75,
          opacity: fadeIn(frame, 0, 35),
          transform: `scale(${logoScale})`,
          filter: 'drop-shadow(0 30px 80px rgba(98,230,167,0.28))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            opacity: first,
            transform: `translateY(${interpolate(first, [0, 1], [22, 0])}px)`,
            fontSize: 70,
            fontWeight: 700,
            letterSpacing: 0,
            position: 'absolute',
          }}
        >
          INTRODUCING
        </div>
        <div
          style={{
            opacity: second,
            transform: `scale(${interpolate(secondSpring, [0, 1], [0.72, 1])})`,
            fontSize: 128,
            fontWeight: 900,
            letterSpacing: 0,
            position: 'absolute',
            textShadow,
          }}
        >
          THE FUTURE
        </div>
        <div
          style={{
            opacity: third,
            transform: `translateX(${thirdX}px)`,
            fontSize: 118,
            fontWeight: 900,
            letterSpacing: 0,
            position: 'absolute',
            color: '#62E6A7',
            textShadow,
          }}
        >
          OF DESIGN
        </div>
      </div>
      <VisualizerBars />
    </AbsoluteFill>
  );
};

const MovingBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 1, 2, 3].map((index) => {
        const size = 340 + index * 90;
        const x = Math.sin(frame / (42 + index * 9) + index) * 90;
        const y = Math.cos(frame / (56 + index * 8) + index) * 70;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              left: 190 + index * 360 + x,
              top: 170 + (index % 2) * 430 + y,
              background:
                index % 2 === 0
                  ? 'rgba(98,230,167,0.14)'
                  : 'rgba(255,116,97,0.12)',
              filter: 'blur(80px)',
            }}
          />
        );
      })}
    </>
  );
};

const VisualizerBars: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: 250,
        right: 250,
        bottom: 88,
        height: 116,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 12,
      }}
    >
      {Array.from({length: 44}).map((_, index) => {
        const pulse =
          0.35 +
          0.65 *
            Math.abs(
              Math.sin(frame / (5 + (index % 6)) + index * 0.56) *
                Math.cos(frame / 17 + index),
            );
        const bass = index > 15 && index < 29 ? 1.35 : 0.8;
        return (
          <div
            key={index}
            style={{
              width: 13,
              height: 18 + pulse * 82 * bass,
              borderRadius: 9,
              background:
                index % 3 === 0
                  ? '#62E6A7'
                  : index % 3 === 1
                    ? '#F7F4ED'
                    : '#FF7461',
              opacity: 0.82,
            }}
          />
        );
      })}
    </div>
  );
};

type FirstTimeSpeakersProps = {
  musicSrc?: string;
};

export const FirstTimeSpeakers: React.FC<FirstTimeSpeakersProps> = ({
  musicSrc,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: '#080B12',
        color: '#F7F4ED',
        fontFamily,
        overflow: 'hidden',
      }}
    >
      {musicSrc ? (
        <Audio src={staticFile(musicSrc)} volume={(f) => (f < 840 ? 0.42 : 0.2)} />
      ) : null}
      <Sequence from={0} durationInFrames={150}>
        <TypingOpening />
      </Sequence>
      <Sequence from={150} durationInFrames={90}>
        <QuestionScene />
      </Sequence>
      <Sequence from={240} durationInFrames={240}>
        <SupportScene />
      </Sequence>
      <Sequence from={480} durationInFrames={210}>
        <PainScene />
      </Sequence>
      <Sequence from={690} durationInFrames={120}>
        <PeakScene />
      </Sequence>
      <Sequence from={810} durationInFrames={90}>
        <CtaScene />
      </Sequence>
      <Caption frame={frame} />
    </AbsoluteFill>
  );
};

const TypingOpening: React.FC = () => {
  const frame = useCurrentFrame();
  const typedOne = revealText('Ever wanted to give a tech talk...', frame, 8, 58);
  const typedTwo = revealText('...but never submitted?', frame, 76, 44);
  const cursorOpacity = Math.floor(frame / 12) % 2 === 0 ? 1 : 0;
  const deleteOpacity = frame > 104 ? fadeIn(frame, 104, 18) : 0;

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 34%, #14202D 0%, #080B12 56%, #030408 100%)',
        padding: 72,
      }}
    >
      <div
        style={{
          marginTop: 180,
          height: 720,
          border: '1px solid rgba(247,244,237,0.14)',
          borderRadius: 28,
          background: 'rgba(2,5,10,0.64)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.42)',
          padding: 54,
        }}
      >
        <div style={{display: 'flex', gap: 14, marginBottom: 64}}>
          <Dot color="#FF7461" />
          <Dot color="#F0C35A" />
          <Dot color="#62E6A7" />
        </div>
        <MonoLine label="conference-cfp.md" value={typedOne} />
        <MonoLine label="draft" value={typedTwo} marginTop={42} />
        <div
          style={{
            marginTop: 64,
            color: '#62E6A7',
            fontSize: 44,
            fontWeight: 700,
            opacity: deleteOpacity,
          }}
        >
          Delete. Delete. Delete.
        </div>
        <div
          style={{
            position: 'absolute',
            width: 20,
            height: 72,
            background: '#F7F4ED',
            left: 586,
            top: 380,
            opacity: cursorOpacity,
          }}
        />
      </div>
      <BigText
        top={1090}
        text="You know something valuable."
        subtext="But hitting submit feels terrifying."
        progress={fadeIn(frame, 106, 18)}
      />
    </AbsoluteFill>
  );
};

const QuestionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = fadeIn(frame, 0, 18);
  const pulse = Math.sin(frame / 4) * 0.5 + 0.5;

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(160deg, #05070C 0%, #161B2B 48%, #0C2B25 100%)',
        padding: 64,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          background:
            'linear-gradient(90deg, rgba(98,230,167,0.22), transparent 42%, rgba(255,116,97,0.2))',
          transform: `translateX(${interpolate(frame, [0, 90], [-160, 160])}px)`,
        }}
      />
      <div
        style={{
          marginTop: 160,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
          opacity: progress,
        }}
      >
        <CutCard title="Stage lights" accent="#62E6A7" index={0} />
        <CutCard title="Audience waiting" accent="#F7F4ED" index={1} />
        <CutCard title="Backstage nerves" accent="#FF7461" index={2} />
        <div
          style={{
            height: 310,
            borderRadius: 26,
            background: 'rgba(247,244,237,0.08)',
            border: '1px solid rgba(247,244,237,0.13)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 176 + pulse * 30,
              height: 176 + pulse * 30,
              borderRadius: 110,
              border: '12px solid #FF7461',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FF7461',
              fontSize: 50,
              fontWeight: 900,
            }}
          >
            {Math.round(91 + pulse * 17)}
          </div>
        </div>
      </div>
      <BigText
        top={1040}
        text="What if your first talk"
        subtext="did not need to be perfect?"
        progress={fadeIn(frame, 18, 18)}
      />
    </AbsoluteFill>
  );
};

const SupportScene: React.FC = () => {
  const frame = useCurrentFrame();
  const headline = fadeIn(frame, 0, 24);

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, #F7F4ED 0%, #EAF3EE 56%, #D8F4E5 100%)',
        color: '#081018',
        padding: 64,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 620,
          height: 620,
          borderRadius: 310,
          right: -160,
          top: -120,
          background: 'rgba(98,230,167,0.45)',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          opacity: headline,
          transform: `translateY(${interpolate(headline, [0, 1], [40, 0])}px)`,
          marginTop: 96,
          fontSize: 70,
          fontWeight: 900,
          lineHeight: 1.02,
          letterSpacing: 0,
        }}
      >
        A room built for your first five minutes.
      </div>
      <div style={{marginTop: 70, display: 'grid', gap: 24}}>
        {[
          ['No experience needed.', '#081018', '#62E6A7'],
          ['Just 5 minutes.', '#081018', '#F0C35A'],
          ['Supportive audience.', '#081018', '#FFFFFF'],
          ['Zero judgment.', '#081018', '#FF7461'],
        ].map(([text, color, bg], index) => {
          const p = fadeIn(frame, 32 + index * 18, 18);
          return (
            <div
              key={text}
              style={{
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [-70, 0])}px)`,
                background: bg,
                color,
                borderRadius: 24,
                padding: '30px 34px',
                fontSize: 48,
                fontWeight: 800,
                boxShadow: '0 24px 70px rgba(8,16,24,0.12)',
              }}
            >
              {text}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          bottom: 120,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 22,
        }}
      >
        <ApplicationCard frame={frame} />
        <ChatCard frame={frame} />
      </div>
    </AbsoluteFill>
  );
};

const PainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = fadeIn(frame, 0, 20);
  const fears = ["I'm not an expert.", 'What if I mess up?', 'Someone else knows more.'];

  return (
    <AbsoluteFill
      style={{
        background: '#081018',
        padding: 54,
        color: '#F7F4ED',
      }}
    >
      <div
        style={{
          opacity: p,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 22,
          height: 1180,
          marginTop: 180,
        }}
      >
        <div
          style={{
            background: 'rgba(255,116,97,0.11)',
            border: '1px solid rgba(255,116,97,0.26)',
            borderRadius: 30,
            padding: 34,
          }}
        >
          <div style={{fontSize: 34, fontWeight: 800, color: '#FF7461'}}>
            The thoughts
          </div>
          {fears.map((fear, index) => {
            const item = fadeIn(frame, 20 + index * 22, 16);
            return (
              <ThoughtBubble key={fear} text={fear} progress={item} index={index} />
            );
          })}
        </div>
        <div
          style={{
            background: 'rgba(98,230,167,0.1)',
            border: '1px solid rgba(98,230,167,0.25)',
            borderRadius: 30,
            padding: 34,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{fontSize: 34, fontWeight: 800, color: '#62E6A7'}}>
            The reality
          </div>
          <AudienceRows frame={frame} />
          <div
            style={{
              position: 'absolute',
              left: 34,
              right: 34,
              bottom: 42,
              fontSize: 42,
              fontWeight: 900,
              lineHeight: 1.05,
            }}
          >
            The tech community needs more voices.
          </div>
        </div>
      </div>
      <BigText
        top={1420}
        text="The best talks are not always from celebrities."
        subtext="They are from people sharing what they learned."
        progress={fadeIn(frame, 96, 18)}
        compact
      />
    </AbsoluteFill>
  );
};

const PeakScene: React.FC = () => {
  const frame = useCurrentFrame();
  const light = fadeIn(frame, 0, 30);

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, #07111F 0%, #0B1525 54%, #030408 100%)',
        overflow: 'hidden',
        color: '#F7F4ED',
      }}
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 170 + index * 250,
            width: 180,
            height: 1500,
            background:
              'linear-gradient(180deg, rgba(247,244,237,0.18), transparent 72%)',
            transform: `rotate(${-18 + index * 18}deg) scaleY(${light})`,
            transformOrigin: 'bottom center',
            filter: 'blur(4px)',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 440,
          background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.84))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 430,
          bottom: 355,
          width: 220,
          height: 420,
          borderRadius: '110px 110px 26px 26px',
          background: '#101722',
          boxShadow: '0 0 120px rgba(98,230,167,0.2)',
          transform: `translateY(${interpolate(light, [0, 1], [90, 0])}px)`,
        }}
      />
      <BigText
        top={250}
        text="Your first talk could inspire someone."
        subtext="One five-minute talk can change your confidence forever."
        progress={fadeIn(frame, 24, 24)}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 150,
          left: 130,
          right: 130,
          height: 110,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        {Array.from({length: 9}).map((_, index) => (
          <div
            key={index}
            style={{
              width: 70,
              height: 45 + Math.sin(frame / 12 + index) * 12,
              borderRadius: '38px 38px 18px 18px',
              background: index % 2 === 0 ? '#F7F4ED' : '#62E6A7',
              opacity: 0.8,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = fadeIn(frame, 0, 20);
  const button = spring({
    frame: frame - 34,
    fps: 30,
    config: {damping: 11, stiffness: 100, mass: 0.8},
  });

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(150deg, #62E6A7 0%, #F7F4ED 52%, #FF7461 100%)',
        color: '#07111F',
        padding: 72,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Img
        src={staticFile('logo.svg')}
        style={{
          width: 180,
          height: 180,
          opacity: p,
          transform: `scale(${interpolate(p, [0, 1], [0.88, 1])})`,
        }}
      />
      <div
        style={{
          marginTop: 34,
          fontSize: 66,
          fontWeight: 950,
          lineHeight: 0.96,
          letterSpacing: 0,
          opacity: p,
        }}
      >
        FIRST TIME
        <br />
        SPEAKERS
      </div>
      <div
        style={{
          marginTop: 34,
          fontSize: 40,
          fontWeight: 700,
          opacity: fadeIn(frame, 20, 18),
        }}
      >
        Give your first tech talk.
      </div>
      <div
        style={{
          marginTop: 52,
          padding: '28px 42px',
          borderRadius: 18,
          background: '#07111F',
          color: '#F7F4ED',
          fontSize: 42,
          fontWeight: 900,
          display: 'inline-flex',
          opacity: fadeIn(frame, 34, 16),
          transform: `scale(${interpolate(button, [0, 1], [0.82, 1])})`,
          boxShadow: '0 28px 80px rgba(7,17,31,0.28)',
        }}
      >
        Apply to Speak -&gt;
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 92,
          left: 0,
          right: 0,
          fontSize: 30,
          fontWeight: 700,
          opacity: fadeIn(frame, 44, 16),
        }}
      >
        firsttimespeakers.com
      </div>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{frame: number}> = ({frame}) => {
  const lines = [
    [0, 150, 'You know something valuable. But hitting submit feels terrifying.'],
    [150, 240, 'What if your first talk did not need to be perfect?'],
    [
      240,
      480,
      'No pressure. No expertise requirements. Just a welcoming community ready to hear your story.',
    ],
    [
      480,
      690,
      'The best talks come from people willing to share what they have learned.',
    ],
    [690, 810, 'One five-minute talk can change your confidence forever.'],
    [810, 900, 'Your voice matters. Apply today.'],
  ] as const;
  const active = lines.find(([start, end]) => frame >= start && frame < end);
  if (!active) {
    return null;
  }
  const [start, end, text] = active;
  const opacity =
    fadeIn(frame, start, 12) *
    interpolate(frame, [end - 15, end], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        bottom: 56,
        padding: '24px 28px',
        borderRadius: 18,
        background: 'rgba(3,4,8,0.72)',
        color: '#F7F4ED',
        fontSize: 29,
        lineHeight: 1.25,
        fontWeight: 750,
        textAlign: 'center',
        opacity,
      }}
    >
      {text}
    </div>
  );
};

const revealText = (
  text: string,
  frame: number,
  start: number,
  duration: number,
) => {
  const count = Math.round(
    interpolate(frame, [start, start + duration], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  return text.slice(0, count);
};

const Dot: React.FC<{color: string}> = ({color}) => (
  <div
    style={{
      width: 26,
      height: 26,
      borderRadius: 13,
      background: color,
    }}
  />
);

const MonoLine: React.FC<{label: string; value: string; marginTop?: number}> = ({
  label,
  value,
  marginTop = 0,
}) => (
  <div style={{marginTop}}>
    <div style={{color: 'rgba(247,244,237,0.42)', fontSize: 26, marginBottom: 14}}>
      {label}
    </div>
    <div
      style={{
        color: '#F7F4ED',
        fontSize: 42,
        lineHeight: 1.25,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        minHeight: 56,
      }}
    >
      {value}
    </div>
  </div>
);

const BigText: React.FC<{
  top: number;
  text: string;
  subtext: string;
  progress: number;
  compact?: boolean;
}> = ({top, text, subtext, progress, compact = false}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: 70,
      right: 70,
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [34, 0])}px)`,
      textAlign: 'center',
    }}
  >
    <div
      style={{
        fontSize: compact ? 48 : 66,
        lineHeight: 1.02,
        fontWeight: 950,
        letterSpacing: 0,
      }}
    >
      {text}
    </div>
    <div
      style={{
        marginTop: 20,
        fontSize: compact ? 30 : 38,
        lineHeight: 1.22,
        fontWeight: 650,
        color: 'rgba(247,244,237,0.78)',
      }}
    >
      {subtext}
    </div>
  </div>
);

const CutCard: React.FC<{title: string; accent: string; index: number}> = ({
  title,
  accent,
  index,
}) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame / 16 + index) * 0.5 + 0.5;
  return (
    <div
      style={{
        height: 310,
        borderRadius: 26,
        background: 'rgba(247,244,237,0.08)',
        border: '1px solid rgba(247,244,237,0.13)',
        padding: 24,
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: 130,
          right: -70,
          top: -60,
          background: accent,
          opacity: 0.18 + pulse * 0.12,
          filter: 'blur(20px)',
        }}
      />
      <div style={{fontSize: 34, fontWeight: 850, lineHeight: 1.08}}>{title}</div>
    </div>
  );
};

const ApplicationCard: React.FC<{frame: number}> = ({frame}) => {
  const p = fadeIn(frame, 118, 22);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [44, 0])}px)`,
        background: '#FFFFFF',
        borderRadius: 26,
        padding: 26,
        boxShadow: '0 24px 70px rgba(8,16,24,0.12)',
      }}
    >
      <div style={{fontSize: 30, fontWeight: 900, marginBottom: 20}}>
        Speaker application
      </div>
      {['Topic idea', 'Five minute outline', 'What you learned'].map((item, index) => (
        <div
          key={item}
          style={{
            marginTop: 14,
            height: 50,
            borderRadius: 14,
            background: index === 0 ? '#D8F4E5' : '#EDF0EC',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 18,
            fontSize: 22,
            fontWeight: 700,
            color: '#244038',
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

const ChatCard: React.FC<{frame: number}> = ({frame}) => {
  const p = fadeIn(frame, 142, 22);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [44, 0])}px)`,
        background: '#081018',
        color: '#F7F4ED',
        borderRadius: 26,
        padding: 26,
        boxShadow: '0 24px 70px rgba(8,16,24,0.14)',
      }}
    >
      <div style={{fontSize: 30, fontWeight: 900, marginBottom: 22}}>
        Community chat
      </div>
      <ChatBubble text="You have got this." />
      <ChatBubble text="I want to hear that story." muted />
      <ChatBubble text="Submitted!" green />
    </div>
  );
};

const ChatBubble: React.FC<{text: string; muted?: boolean; green?: boolean}> = ({
  text,
  muted,
  green,
}) => (
  <div
    style={{
      marginTop: 14,
      borderRadius: 16,
      padding: '14px 16px',
      fontSize: 22,
      fontWeight: 750,
      background: green
        ? 'rgba(98,230,167,0.24)'
        : muted
          ? 'rgba(247,244,237,0.12)'
          : 'rgba(247,244,237,0.2)',
    }}
  >
    {text}
  </div>
);

const ThoughtBubble: React.FC<{
  text: string;
  progress: number;
  index: number;
}> = ({text, progress, index}) => (
  <div
    style={{
      marginTop: 44 + index * 12,
      borderRadius: 24,
      padding: '24px 22px',
      fontSize: 29,
      lineHeight: 1.16,
      fontWeight: 800,
      background: 'rgba(247,244,237,0.1)',
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
    }}
  >
    {text}
  </div>
);

const AudienceRows: React.FC<{frame: number}> = ({frame}) => (
  <div style={{marginTop: 70, display: 'grid', gap: 24}}>
    {Array.from({length: 5}).map((_, row) => (
      <div key={row} style={{display: 'flex', gap: 18}}>
        {Array.from({length: 4}).map((__, col) => {
          const wave = Math.sin(frame / 13 + row + col) * 0.5 + 0.5;
          return (
            <div
              key={`${row}-${col}`}
              style={{
                width: 62,
                height: 62,
                borderRadius: 31,
                background: col % 2 === 0 ? '#62E6A7' : '#F7F4ED',
                opacity: 0.56 + wave * 0.3,
              }}
            />
          );
        })}
      </div>
    ))}
  </div>
);
