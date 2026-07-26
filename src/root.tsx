import React from 'react';
import {Composition, getInputProps} from 'remotion';
import {
  FirstTimeSpeakers,
  HelloWorld,
  IntroSequence,
  LaunchDay,
  WebSlingerIntro,
} from './demos';
import {
  EngagementInvite,
  type EngagementInviteProps,
} from './templates/engagement';

export const Root: React.FC = () => {
  const inputProps = getInputProps<EngagementInviteProps>();

  return (
    <>
      {/* Production template */}
      <Composition
        id="EngagementInvite"
        component={EngagementInvite}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          brideName: inputProps.brideName,
          groomName: inputProps.groomName,
          saveDateTitle: inputProps.saveDateTitle,
          eventLine: inputProps.eventLine,
          coupleLine: inputProps.coupleLine,
          date: inputProps.date,
          venueName: inputProps.venueName,
          familyName: inputProps.familyName,
          photoSrc: inputProps.photoSrc,
          musicSrc: inputProps.musicSrc,
          showPhoto: inputProps.showPhoto,
        }}
      />

      {/* Legacy visual experiments */}
      <Composition
        id="WebSlingerIntro"
        component={WebSlingerIntro}
        durationInFrames={288}
        fps={24}
        width={1920}
        height={1080}
      />
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
          musicSrc: inputProps.musicSrc ?? undefined,
        }}
      />
    </>
  );
};
