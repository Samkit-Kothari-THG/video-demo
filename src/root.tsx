import React from 'react';
import {Composition, getInputProps} from 'remotion';
import {
  CatalogInvitation,
  createTemplateDraft,
  getInvitationTemplate,
  type CatalogInvitationProps,
  type InvitationTemplateId,
} from './templates';

export const Root: React.FC = () => {
  const inputProps = getInputProps<CatalogInvitationProps>();
  const templateProps = (templateId: InvitationTemplateId) => {
    const requestedVersion =
      inputProps.templateId === templateId
        ? inputProps.templateVersion
        : undefined;
    const template = getInvitationTemplate(templateId, requestedVersion);

    return {
      ...createTemplateDraft(template.id, template.version),
      ...inputProps,
      templateId: template.id,
      templateVersion: template.version,
    };
  };

  return (
    <>
      {/* Production template */}
      <Composition
        id="EngagementInvite"
        component={CatalogInvitation}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={templateProps('engagement-invite')}
      />
      <Composition
        id="WeddingNoor"
        component={CatalogInvitation}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={templateProps('wedding-noor')}
      />
      <Composition
        id="BirthdayConfetti"
        component={CatalogInvitation}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={templateProps('birthday-confetti')}
      />
      <Composition
        id="BabyShowerMoon"
        component={CatalogInvitation}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={templateProps('baby-shower-moon')}
      />
      <Composition
        id="HousewarmingAangan"
        component={CatalogInvitation}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={templateProps('housewarming-aangan')}
      />
    </>
  );
};
