import React from 'react';
import {Composition, getInputProps} from 'remotion';
import {
  FirstTimeSpeakers,
  HelloWorld,
  IntroSequence,
  LaunchDay,
} from './videos';
import {EngagementInvite} from './engagementInvite';

export const Root: React.FC = () => {
  const inputProps = getInputProps<{musicSrc?: string}>();

  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LaunchDay"
        component={LaunchDay}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IntroSequence"
        component={IntroSequence}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FirstTimeSpeakers"
        component={FirstTimeSpeakers}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          musicSrc: inputProps.musicSrc,
        }}
      />
      <Composition
        id="EngagementInvite"
        component={EngagementInvite}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
