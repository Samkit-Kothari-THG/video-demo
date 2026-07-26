import React from 'react';
import {Composition, getInputProps} from 'remotion';
import {
  FirstTimeSpeakers,
  HelloWorld,
  IntroSequence,
  LaunchDay,
} from './videos';
import {EngagementInvite, type EngagementInviteProps} from './engagementInvite';
import {WebSlingerIntro} from './webSlinger';

export const Root: React.FC = () => {
  const inputProps = getInputProps<{musicSrc?: string} & EngagementInviteProps>();

  return (
    <>
      <Composition id="WebSlingerIntro" component={WebSlingerIntro} durationInFrames={288} fps={24} width={1920} height={1080}/>
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
    </>
  );
};
