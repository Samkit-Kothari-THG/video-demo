import {
  defaultEngagementInviteProps,
  engagementInviteTextFields,
  type EngagementInviteProps,
  type EngagementTextFieldKey,
  type InvitationContentProps,
} from './engagement/model';

export const invitationTemplateIds = [
  'engagement-invite',
  'wedding-noor',
  'birthday-confetti',
  'baby-shower-moon',
  'housewarming-aangan',
] as const;

export type InvitationTemplateId = (typeof invitationTemplateIds)[number];
export type InvitationCategory =
  | 'engagement'
  | 'wedding'
  | 'birthday'
  | 'baby-shower'
  | 'housewarming';

export type InvitationTemplateField = {
  key: EngagementTextFieldKey;
  label: string;
  description: string;
  maxLength: number;
  optional?: boolean;
  group: 'people' | 'occasion';
};

export type InvitationTemplateDefinition = {
  id: InvitationTemplateId;
  version: 1;
  compositionId:
    | 'EngagementInvite'
    | 'WeddingNoor'
    | 'BirthdayConfetti'
    | 'BabyShowerMoon'
    | 'HousewarmingAangan';
  name: string;
  category: InvitationCategory;
  categoryLabel: string;
  description: string;
  coverSrc: string;
  accent: string;
  surface: string;
  textColor: string;
  musicName: string | null;
  nameConnector: string;
  defaults: InvitationContentProps;
  fields: readonly InvitationTemplateField[];
};

const field = (
  key: EngagementTextFieldKey,
  label: string,
  description: string,
  maxLength: number,
  group: InvitationTemplateField['group'],
  optional = false,
): InvitationTemplateField => ({
  key,
  label,
  description,
  maxLength,
  group,
  optional,
});

const engagementFields: readonly InvitationTemplateField[] =
  engagementInviteTextFields.map((item, index) => ({
    ...item,
    group: index < 3 ? 'people' : 'occasion',
  }));

const weddingFields: readonly InvitationTemplateField[] = [
  field('brideName', 'Partner one', 'The first name in the couple reveal.', 28, 'people'),
  field('groomName', 'Partner two', 'The second name in the couple reveal.', 28, 'people'),
  field(
    'coupleLine',
    'Couple line',
    'Optional. Leave blank to join both names automatically.',
    62,
    'people',
    true,
  ),
  field('saveDateTitle', 'Opening line', 'A short invitation or save-the-date line.', 36, 'occasion'),
  field('eventLine', 'Celebration', 'For example: Wedding ceremony or Reception.', 42, 'occasion'),
  field('date', 'Date and time', 'Use the exact format guests should see.', 36, 'occasion'),
  field('venueName', 'Venue', 'Venue name and city.', 64, 'occasion'),
  field('familyName', 'Hosted by', 'Families or hosts shown in the closing scene.', 68, 'occasion'),
];

const birthdayFields: readonly InvitationTemplateField[] = [
  field('brideName', 'Guest of honour', 'The name featured throughout the invitation.', 30, 'people'),
  field('saveDateTitle', 'Opening line', 'A short celebratory invitation.', 36, 'occasion'),
  field('eventLine', 'Milestone or theme', 'For example: Mira turns thirty.', 44, 'occasion'),
  field('date', 'Date and time', 'Use the exact format guests should see.', 38, 'occasion'),
  field('venueName', 'Venue', 'Venue name and city.', 64, 'occasion'),
  field('familyName', 'Hosted by', 'Friends, family, or host name.', 68, 'occasion'),
];

const babyShowerFields: readonly InvitationTemplateField[] = [
  field('brideName', 'Parent-to-be', 'The first parent or family name.', 30, 'people'),
  field('groomName', 'Co-parent', 'Optional second parent name.', 30, 'people', true),
  field(
    'coupleLine',
    'Family line',
    'Optional. Leave blank to combine both names.',
    64,
    'people',
    true,
  ),
  field('saveDateTitle', 'Opening line', 'A warm line for the first scene.', 42, 'occasion'),
  field('eventLine', 'Occasion', 'For example: Baby shower or Sip & see.', 42, 'occasion'),
  field('date', 'Date and time', 'Use the exact format guests should see.', 38, 'occasion'),
  field('venueName', 'Venue', 'Venue name and city.', 64, 'occasion'),
  field('familyName', 'Hosted by', 'Host or family line for the finale.', 68, 'occasion'),
];

const housewarmingFields: readonly InvitationTemplateField[] = [
  field('brideName', 'Host name', 'The first host name.', 30, 'people'),
  field('groomName', 'Co-host', 'Optional second host name.', 30, 'people', true),
  field(
    'coupleLine',
    'Host line',
    'Optional. Leave blank to combine the host names.',
    64,
    'people',
    true,
  ),
  field('saveDateTitle', 'Welcome line', 'A short invitation for the opening scene.', 42, 'occasion'),
  field('eventLine', 'Occasion', 'For example: Griha Pravesh or Housewarming.', 42, 'occasion'),
  field('date', 'Date and time', 'Use the exact format guests should see.', 38, 'occasion'),
  field('venueName', 'New address', 'House name, locality, and city.', 72, 'occasion'),
  field('familyName', 'Closing line', 'A warm sign-off from the hosts.', 68, 'occasion'),
];

export const invitationTemplates: readonly InvitationTemplateDefinition[] = [
  {
    id: 'engagement-invite',
    version: 1,
    compositionId: 'EngagementInvite',
    name: 'Marigold Reverie',
    category: 'engagement',
    categoryLabel: 'Engagement',
    description:
      'Warm ivory, marigolds, gilded details, and a cinematic portrait reveal.',
    coverSrc: '/engagement/luxury-invite-bg.png',
    accent: '#7d364a',
    surface: '#f6ead2',
    textColor: '#5d3427',
    musicName: 'Indian instrumental',
    nameConnector: ' with ',
    defaults: defaultEngagementInviteProps,
    fields: engagementFields,
  },
  {
    id: 'wedding-noor',
    version: 1,
    compositionId: 'WeddingNoor',
    name: 'Noor at Midnight',
    category: 'wedding',
    categoryLabel: 'Wedding',
    description:
      'Moonlit palace arches, jasmine, antique gold, and a candlelit portrait moment.',
    coverSrc: '/templates/wedding-noor.webp',
    accent: '#c89b51',
    surface: '#111d38',
    textColor: '#f5e6ca',
    musicName: 'Indian instrumental',
    nameConnector: ' & ',
    defaults: {
      brideName: 'Aanya',
      groomName: 'Vihaan',
      coupleLine: undefined,
      saveDateTitle: 'Together, forever',
      eventLine: 'Wedding Ceremony',
      date: '14 February 2027 · 6 PM',
      venueName: 'The Leela Palace, Jaipur',
      familyName: 'The Mehta & Kapoor Families',
      photoSrc: 'engagement/couple-photo.jpg',
      musicSrc: 'engagement/indian-instrumental.wav',
      showPhoto: true,
      photoFocalPoint: 28,
    },
    fields: weddingFields,
  },
  {
    id: 'birthday-confetti',
    version: 1,
    compositionId: 'BirthdayConfetti',
    name: 'Electric Confetti',
    category: 'birthday',
    categoryLabel: 'Birthday',
    description:
      'Bold paper craft, sculptural balloons, kinetic type, and unapologetic colour.',
    coverSrc: '/templates/birthday-confetti.webp',
    accent: '#1748d5',
    surface: '#fff8ee',
    textColor: '#201d1f',
    musicName: null,
    nameConnector: '',
    defaults: {
      brideName: 'Mira',
      groomName: '',
      coupleLine: undefined,
      saveDateTitle: 'Come celebrate',
      eventLine: 'Mira turns thirty',
      date: '08 August 2026 · 7 PM',
      venueName: 'The Terrace House, Mumbai',
      familyName: 'Hosted with love by friends & family',
      photoSrc: 'engagement/celebration.jpg',
      musicSrc: null,
      showPhoto: false,
      photoFocalPoint: 36,
    },
    fields: birthdayFields,
  },
  {
    id: 'baby-shower-moon',
    version: 1,
    compositionId: 'BabyShowerMoon',
    name: 'Moonlit Bloom',
    category: 'baby-shower',
    categoryLabel: 'Baby shower',
    description:
      'Watercolour clouds, a champagne moon, soft botanicals, and an heirloom finish.',
    coverSrc: '/templates/baby-shower-moon.webp',
    accent: '#7b718f',
    surface: '#fbf4e6',
    textColor: '#536055',
    musicName: 'Indian instrumental',
    nameConnector: ' & ',
    defaults: {
      brideName: 'Rhea',
      groomName: 'Arjun',
      coupleLine: undefined,
      saveDateTitle: 'A little wonder is on the way',
      eventLine: 'Baby Shower',
      date: '22 November 2026 · 11 AM',
      venueName: 'The Glasshouse, Bengaluru',
      familyName: 'Hosted by the Mehra Family',
      photoSrc: 'engagement/couple-photo.jpg',
      musicSrc: 'engagement/indian-instrumental.wav',
      showPhoto: true,
      photoFocalPoint: 26,
    },
    fields: babyShowerFields,
  },
  {
    id: 'housewarming-aangan',
    version: 1,
    compositionId: 'HousewarmingAangan',
    name: 'The New Aangan',
    category: 'housewarming',
    categoryLabel: 'Housewarming',
    description:
      'Terracotta architecture, morning light, hand-painted craft, and a warm welcome.',
    coverSrc: '/templates/housewarming-aangan.webp',
    accent: '#a64e2d',
    surface: '#f4dfc8',
    textColor: '#355243',
    musicName: 'Indian instrumental',
    nameConnector: ' & ',
    defaults: {
      brideName: 'Neha',
      groomName: 'Karan',
      coupleLine: undefined,
      saveDateTitle: 'A new door opens',
      eventLine: 'Griha Pravesh',
      date: '05 October 2026 · 9 AM',
      venueName: '24 Gulmohar Lane, Pune',
      familyName: 'With love, the Shah Family',
      photoSrc: 'engagement/venue-photo.jpg',
      musicSrc: 'engagement/indian-instrumental.wav',
      showPhoto: false,
      photoFocalPoint: 42,
    },
    fields: housewarmingFields,
  },
];

export const invitationCategories: ReadonlyArray<{
  id: 'all' | InvitationCategory;
  label: string;
}> = [
  {id: 'all', label: 'All templates'},
  {id: 'wedding', label: 'Wedding'},
  {id: 'engagement', label: 'Engagement'},
  {id: 'birthday', label: 'Birthday'},
  {id: 'baby-shower', label: 'Baby shower'},
  {id: 'housewarming', label: 'Housewarming'},
];

export const isInvitationTemplateId = (
  value: unknown,
): value is InvitationTemplateId =>
  typeof value === 'string' &&
  invitationTemplateIds.includes(value as InvitationTemplateId);

export const getInvitationTemplate = (
  value: unknown,
): InvitationTemplateDefinition =>
  invitationTemplates.find((template) => template.id === value) ??
  invitationTemplates[0];

export const createTemplateDraft = (
  templateId: InvitationTemplateId,
): InvitationContentProps => ({
  ...getInvitationTemplate(templateId).defaults,
  coupleLine: undefined,
});

export const validateTemplateProps = (
  templateId: InvitationTemplateId,
  props: EngagementInviteProps,
  options: {requireRequiredFields?: boolean} = {},
): Partial<Record<EngagementTextFieldKey | 'photoSrc', string>> => {
  const template = getInvitationTemplate(templateId);
  const errors: Partial<
    Record<EngagementTextFieldKey | 'photoSrc', string>
  > = {};
  const requireRequiredFields = options.requireRequiredFields ?? true;

  for (const templateField of template.fields) {
    const value = props[templateField.key]?.trim() ?? '';
    if (
      requireRequiredFields &&
      !templateField.optional &&
      value.length === 0
    ) {
      errors[templateField.key] = `${templateField.label} is required.`;
    } else if (value.length > templateField.maxLength) {
      errors[templateField.key] =
        `Keep this to ${templateField.maxLength} characters or fewer.`;
    }
  }

  if (props.photoSrc?.startsWith('data:') && props.photoSrc.length > 3_500_000) {
    errors.photoSrc = 'Choose an image smaller than 2.5 MB for local drafts.';
  }

  return errors;
};

const valueOrDefault = (
  value: string | undefined,
  fallback: string | undefined,
) => value?.trim() || fallback?.trim() || '';

export const resolveTemplateCopy = (
  templateId: InvitationTemplateId,
  props: InvitationContentProps,
) => {
  const template = getInvitationTemplate(templateId);
  const primaryName = valueOrDefault(
    props.brideName,
    template.defaults.brideName,
  );
  const secondaryName = valueOrDefault(
    props.groomName,
    template.defaults.groomName,
  );
  const automaticNameLine = [primaryName, secondaryName]
    .filter(Boolean)
    .join(template.nameConnector);

  return {
    primaryName,
    secondaryName,
    nameLine:
      props.coupleLine?.trim() ||
      template.defaults.coupleLine?.trim() ||
      automaticNameLine,
    openingLine: valueOrDefault(
      props.saveDateTitle,
      template.defaults.saveDateTitle,
    ),
    eventLine: valueOrDefault(props.eventLine, template.defaults.eventLine),
    date: valueOrDefault(props.date, template.defaults.date),
    venueName: valueOrDefault(
      props.venueName,
      template.defaults.venueName,
    ),
    hostLine: valueOrDefault(
      props.familyName,
      template.defaults.familyName,
    ),
    photoSrc:
      props.photoSrc === undefined
        ? (template.defaults.photoSrc ?? null)
        : props.photoSrc,
    musicSrc:
      props.musicSrc === undefined
        ? (template.defaults.musicSrc ?? null)
        : props.musicSrc,
    showPhoto: props.showPhoto ?? template.defaults.showPhoto ?? true,
    photoFocalPoint:
      props.photoFocalPoint ?? template.defaults.photoFocalPoint ?? 50,
  };
};

export const templateProjectLabel = (
  templateId: InvitationTemplateId,
  props: InvitationContentProps,
) => {
  const copy = resolveTemplateCopy(templateId, props);
  return copy.nameLine || copy.eventLine;
};

export const templateProjectInitials = (
  templateId: InvitationTemplateId,
  props: InvitationContentProps,
) => {
  const copy = resolveTemplateCopy(templateId, props);
  return `${copy.primaryName.charAt(0)}${copy.secondaryName.charAt(0) || ''}`.toUpperCase();
};
