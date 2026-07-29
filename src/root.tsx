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
  BabyShowerMoon,
  BirthdayConfetti,
  createTemplateDraft,
  EngagementInvite,
  HousewarmingAangan,
  WeddingNoor,
  type InvitationContentProps,
  type InvitationTemplateId,
} from './templates';

export const Root: React.FC = () => {
  const inputProps = getInputProps<InvitationContentProps>();
  const templateProps = (templateId: InvitationTemplateId) => ({
    ...createTemplateDraft(templateId),
    ...inputProps,
  });

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
        defaultProps={templateProps('engagement-invite')}
      />
      <Composition
        id="WeddingNoor"
        component={WeddingNoor}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={templateProps('wedding-noor')}
      />
      <Composition
        id="BirthdayConfetti"
        component={BirthdayConfetti}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={templateProps('birthday-confetti')}
      />
      <Composition
        id="BabyShowerMoon"
        component={BabyShowerMoon}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={templateProps('baby-shower-moon')}
      />
      <Composition
        id="HousewarmingAangan"
        component={HousewarmingAangan}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={templateProps('housewarming-aangan')}
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
