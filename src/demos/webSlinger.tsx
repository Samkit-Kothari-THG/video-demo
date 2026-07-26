/**
 * Procedural animation experiment retained as a reference for future
 * concept-video templates.
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const ease = (
  frame: number,
  start: number,
  end: number,
  from: number,
  to: number,
) =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

const Skyline: React.FC<{depth: number}> = ({depth}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translateX(${Math.sin(frame / 80 + depth) * depth * 9}px) scale(${1 + depth * 0.025})`,
        transformOrigin: '50% 80%',
      }}
    >
      {Array.from({length: 24}).map((_, buildingIndex) => {
        const width = 55 + ((buildingIndex * 31) % 90);
        const height = 150 + ((buildingIndex * 83) % (430 - depth * 55));
        const left = buildingIndex * 86 - 60;

        return (
          <div
            key={buildingIndex}
            style={{
              position: 'absolute',
              left,
              bottom: 100 - depth * 24,
              width,
              height,
              background: `linear-gradient(90deg, #07111d, #${depth ? '102238' : '172b40'}, #050b14)`,
              clipPath:
                buildingIndex % 5 === 0
                  ? 'polygon(0 12%, 40% 12%, 50% 0, 60% 12%, 100% 12%, 100% 100%, 0 100%)'
                  : undefined,
              boxShadow: '0 0 28px #020812',
            }}
          >
            {Array.from({length: Math.floor(height / 30)}).map((__, rowIndex) => (
              <div
                key={rowIndex}
                style={{
                  height: 3,
                  margin: `19px ${9 + (buildingIndex % 3) * 3}px 0`,
                  opacity: ease(
                    frame,
                    95 + buildingIndex,
                    210 + buildingIndex,
                    0.05,
                    0.75,
                  ),
                  background: `repeating-linear-gradient(90deg, transparent 0 7px, ${
                    (rowIndex + buildingIndex) % 3 ? '#f7b75b' : '#fff2b0'
                  } 7px 11px)`,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

const Hero: React.FC<{launch: number}> = ({launch}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const crouch = spring({
    frame: frame - 116,
    fps,
    config: {damping: 13, stiffness: 100},
  });
  const swing = ease(frame, 157, 245, 0, 1);
  const x = swing * 500;
  const y = -Math.sin(swing * Math.PI) * 440 + swing * 90;
  const turn = ease(frame, 75, 112, 0, 1);
  const wind = Math.sin(frame * 0.35) * 3;
  const limbs = [
    {left: -5, top: 94, rotation: -34, height: 136},
    {left: 132, top: 94, rotation: 38, height: 130},
    {left: 48, top: 201, rotation: -15, height: 150},
    {left: 100, top: 201, rotation: 30, height: 150},
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: 1040 + x,
        top: 312 + y,
        width: 170,
        height: 390,
        transformOrigin: '50% 90%',
        transform: `translate(-50%, -50%) rotate(${turn * 18 + swing * 34}deg) scale(${1 - crouch * 0.16}) skewX(${wind}deg)`,
        filter: 'drop-shadow(0 24px 22px #0008)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 54,
          top: 0,
          width: 68,
          height: 82,
          borderRadius: '48% 48% 45% 45%',
          background:
            'radial-gradient(circle at 62% 35%, #fff 0 5%, transparent 6%), linear-gradient(135deg, #d52d38, #690d1b)',
          border: '2px solid #250914',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 38,
          top: 72,
          width: 102,
          height: 145,
          borderRadius: '48% 48% 35% 35%',
          background:
            'linear-gradient(100deg, #102e53 0 30%, #bd1e31 31% 70%, #102e53 71%)',
          border: '2px solid #091426',
        }}
      />
      {limbs.map((limb, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: limb.left,
            top: limb.top,
            width: 35,
            height: limb.height,
            borderRadius: 24,
            background:
              index < 2
                ? 'linear-gradient(#b51b2c, #122d50)'
                : 'linear-gradient(#112d52, #a81a2c)',
            transformOrigin: '50% 0',
            transform: `rotate(${
              limb.rotation +
              (index < 2 ? crouch * 25 : crouch * (index === 2 ? 42 : -42))
            }deg)`,
          }}
        />
      ))}
      {launch > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 140,
            top: 105,
            width: 900,
            height: 3,
            background: '#eaf5ff',
            transformOrigin: '0 50%',
            transform: 'rotate(-31deg)',
            boxShadow: '0 0 8px #fff',
          }}
        />
      ) : null}
    </div>
  );
};

export const WebSlingerIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const push = ease(frame, 0, 115, 1, 1.18);
  const chase = ease(frame, 156, 250, 1, 1.35);
  const freeze = ease(frame, 248, 270, 0, 1);
  const launch = ease(frame, 145, 160, 0, 1);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: '#07111e',
        fontFamily: 'Inter, system-ui',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -80,
          transform: `scale(${push * chase}) translateX(${ease(frame, 155, 250, 0, -170)}px)`,
          transformOrigin: '55% 55%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 73% 30%, #ffd089 0 3%, #da684b 12%, transparent 36%), linear-gradient(#263b60 0%, #b95750 42%, #18263b 72%, #050b12 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.4,
            background:
              'repeating-linear-gradient(116deg, transparent 0 190px, #ffd99218 200px 235px, transparent 245px 390px)',
            filter: 'blur(15px)',
          }}
        />
        <Skyline depth={2} />
        <Skyline depth={1} />
        <Skyline depth={0} />
        <div
          style={{
            position: 'absolute',
            left: 860,
            bottom: 20,
            width: 620,
            height: 190,
            background: 'linear-gradient(#27323c, #070a0e)',
            clipPath: 'polygon(0 35%, 73% 35%, 82% 0, 100% 0, 100% 100%, 0 100%)',
          }}
        />
        <Hero launch={launch} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, transparent 42%, #000b 120%)',
          boxShadow: `inset 0 0 ${80 + freeze * 180}px #050914`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: freeze * 0.36,
          background:
            'linear-gradient(110deg, transparent 45%, #dff6ff 49%, transparent 52%)',
          transform: `translateX(${ease(frame, 248, 270, -900, 900)}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 72,
          bottom: 55,
          color: '#d9e7f3',
          fontSize: 20,
          letterSpacing: 9,
          opacity: ease(frame, 6, 38, 0, 0.65),
        }}
      >
        ABOVE THE CITY
      </div>
      <div
        style={{
          position: 'absolute',
          right: 65,
          bottom: 48,
          color: 'white',
          fontSize: 74,
          fontWeight: 900,
          fontStyle: 'italic',
          letterSpacing: -5,
          opacity: freeze,
          transform: `translateX(${(1 - freeze) * 90}px)`,
          textShadow: '0 5px 35px #b31632',
        }}
      >
        RISE.
      </div>
    </AbsoluteFill>
  );
};
