import {
  invitationTemplates,
  type InvitationCategory,
  type InvitationTemplateDefinition,
  type InvitationTone,
} from './catalog';
import type {InvitationFormat} from './formats';

export const invitationToneOptions: ReadonlyArray<{
  id: InvitationTone;
  label: string;
  description: string;
}> = [
  {
    id: 'classic',
    label: 'Timeless',
    description: 'Elegant type, graceful details, and an heirloom mood.',
  },
  {
    id: 'modern',
    label: 'Modern',
    description: 'Editorial composition, clean contrast, and fresh energy.',
  },
  {
    id: 'playful',
    label: 'Playful',
    description: 'Expressive colour, lively movement, and joyful character.',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Quiet space, restrained detail, and a calm visual rhythm.',
  },
  {
    id: 'festive',
    label: 'Festive',
    description: 'Rich colour, celebratory motifs, and a spirited finish.',
  },
];

export type InvitationPhotoPreference = 'portrait' | 'designed' | 'flexible';

export type InvitationRecommendation = {
  template: InvitationTemplateDefinition;
  reason: string;
  toneMatch: boolean;
};

const toneLabel = (tone: InvitationTone) =>
  invitationToneOptions.find((option) => option.id === tone)?.label ?? tone;

const photoReason = (preference: InvitationPhotoPreference) => {
  if (preference === 'portrait') {
    return 'Its portrait reveal gives your people a memorable centre stage.';
  }

  if (preference === 'designed') {
    return 'Its designed reveal stays polished without requiring a portrait.';
  }

  return 'You can keep its designed moment or add a portrait later.';
};

const formatReason = (format: InvitationFormat) => {
  if (format === 'animated') {
    return 'Its artwork adapts into a seamless six-second loop with every event detail kept on screen.';
  }

  if (format === 'photo') {
    return 'Its artwork becomes a high-resolution shareable card with the full invitation visible at once.';
  }

  return 'Its artwork unfolds across a complete cinematic scene sequence.';
};

export const recommendInvitationTemplates = ({
  category,
  format,
  tone,
  photoPreference,
}: {
  category: InvitationCategory;
  format: InvitationFormat;
  tone: InvitationTone;
  photoPreference: InvitationPhotoPreference;
}): readonly InvitationRecommendation[] => {
  const candidates = invitationTemplates
    .filter((template) => template.category === category)
    .map((template) => {
      const toneMatch = template.tones.includes(tone);
      const prefersPhoto = photoPreference === 'portrait';
      const prefersDesigned = photoPreference === 'designed';
      const photoMatch =
        (prefersPhoto && template.defaults.showPhoto) ||
        (prefersDesigned && !template.defaults.showPhoto);
      const score =
        (toneMatch ? 4 : 0) +
        (photoMatch ? 2 : 0) +
        template.version / 100;

      return {template, toneMatch, score};
    })
    .sort((left, right) => right.score - left.score);

  return candidates.map(({template, toneMatch}) => ({
    template,
    toneMatch,
    reason: `${
      toneMatch
        ? `${toneLabel(tone)} styling makes this a natural match.`
        : `A complementary take on your ${toneLabel(tone).toLowerCase()} direction.`
    } ${photoReason(photoPreference)} ${formatReason(format)}`,
  }));
};
