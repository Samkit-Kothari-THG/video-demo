import {
  defaultEngagementInviteProps,
  engagementInviteTextFields,
  type EngagementInviteProps,
  type EngagementTextFieldKey,
  type InvitationContentProps,
} from './engagement/model';
import {getInvitationMusicTrack, invitationMusic} from './music';

export const invitationTemplateIds = [
  'engagement-invite',
  'wedding-noor',
  'birthday-confetti',
  'baby-shower-moon',
  'housewarming-aangan',
] as const;

export type InvitationTemplateId = (typeof invitationTemplateIds)[number];
export const invitationTemplateVersions = [1, 2] as const;
export type InvitationTemplateVersion =
  (typeof invitationTemplateVersions)[number];
export type InvitationTemplateKey =
  `${InvitationTemplateId}@${InvitationTemplateVersion}`;
export type InvitationCategory =
  | 'engagement'
  | 'wedding'
  | 'birthday'
  | 'baby-shower'
  | 'housewarming';
export type InvitationTone =
  | 'classic'
  | 'modern'
  | 'playful'
  | 'minimal'
  | 'festive';

export type InvitationValidationField =
  | EngagementTextFieldKey
  | 'photoSrc'
  | 'musicSrc'
  | 'musicDurationSeconds'
  | 'musicTrimStartSeconds'
  | 'musicVolume'
  | 'musicRightsConfirmed';

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
  version: InvitationTemplateVersion;
  compositionId:
    | 'EngagementInvite'
    | 'WeddingNoor'
    | 'BirthdayConfetti'
    | 'BabyShowerMoon'
    | 'HousewarmingAangan';
  name: string;
  category: InvitationCategory;
  categoryLabel: string;
  tones: readonly InvitationTone[];
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
    tones: ['classic', 'festive'],
    description:
      'Warm ivory, marigolds, gilded details, and a cinematic portrait reveal.',
    coverSrc: '/engagement/luxury-invite-bg.png',
    accent: '#7d364a',
    surface: '#f6ead2',
    textColor: '#5d3427',
    musicName: invitationMusic.goldenHour.name,
    nameConnector: ' with ',
    defaults: defaultEngagementInviteProps,
    fields: engagementFields,
  },
  {
    id: 'engagement-invite',
    version: 2,
    compositionId: 'EngagementInvite',
    name: 'Monsoon Glass',
    category: 'engagement',
    categoryLabel: 'Engagement',
    tones: ['modern', 'minimal'],
    description:
      'Rain-softened glass, white roses, silver light, and a modern editorial reveal.',
    coverSrc: '/templates/engagement-monsoon-v2.webp',
    accent: '#426c62',
    surface: '#e9f0eb',
    textColor: '#24443d',
    musicName: invitationMusic.monsoonLetters.name,
    nameConnector: ' with ',
    defaults: {
      brideName: 'Tara',
      groomName: 'Dev',
      coupleLine: undefined,
      saveDateTitle: 'The next chapter',
      eventLine: 'Engagement Evening',
      date: '18 July 2027 · 6:30 PM',
      venueName: 'The Glasshouse, Alibaug',
      familyName: 'The Iyer & Khanna Families',
      photoSrc: 'engagement/couple-photo.jpg',
      musicSrc: invitationMusic.monsoonLetters.src,
      showPhoto: true,
      photoFocalPoint: 30,
    },
    fields: engagementFields,
  },
  {
    id: 'wedding-noor',
    version: 1,
    compositionId: 'WeddingNoor',
    name: 'Noor at Midnight',
    category: 'wedding',
    categoryLabel: 'Wedding',
    tones: ['classic', 'festive'],
    description:
      'Moonlit palace arches, jasmine, antique gold, and a candlelit portrait moment.',
    coverSrc: '/templates/wedding-noor.webp',
    accent: '#c89b51',
    surface: '#111d38',
    textColor: '#f5e6ca',
    musicName: invitationMusic.moonlitVows.name,
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
      musicSrc: invitationMusic.moonlitVows.src,
      showPhoto: true,
      photoFocalPoint: 28,
    },
    fields: weddingFields,
  },
  {
    id: 'wedding-noor',
    version: 2,
    compositionId: 'WeddingNoor',
    name: 'Ivory Garden',
    category: 'wedding',
    categoryLabel: 'Wedding',
    tones: ['classic', 'modern', 'minimal'],
    description:
      'Sunlit ivory stone, jasmine, champagne silk, and a serene garden ceremony.',
    coverSrc: '/templates/wedding-ivory-v2.webp',
    accent: '#9b7c3d',
    surface: '#fbf5e8',
    textColor: '#4e5b3d',
    musicName: invitationMusic.firstLight.name,
    nameConnector: ' & ',
    defaults: {
      brideName: 'Meera',
      groomName: 'Kabir',
      coupleLine: undefined,
      saveDateTitle: 'With all our hearts',
      eventLine: 'Wedding Celebration',
      date: '21 February 2027 · 4 PM',
      venueName: 'The Courtyard, Udaipur',
      familyName: 'The Rao & Malhotra Families',
      photoSrc: 'engagement/couple-photo.jpg',
      musicSrc: invitationMusic.firstLight.src,
      showPhoto: true,
      photoFocalPoint: 30,
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
    tones: ['playful', 'festive'],
    description:
      'Bold paper craft, sculptural balloons, kinetic type, and unapologetic colour.',
    coverSrc: '/templates/birthday-confetti.webp',
    accent: '#1748d5',
    surface: '#fff8ee',
    textColor: '#201d1f',
    musicName: invitationMusic.saffronSkyline.name,
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
      musicSrc: invitationMusic.saffronSkyline.src,
      showPhoto: false,
      photoFocalPoint: 36,
    },
    fields: birthdayFields,
  },
  {
    id: 'birthday-confetti',
    version: 2,
    compositionId: 'BirthdayConfetti',
    name: 'Disco After Dark',
    category: 'birthday',
    categoryLabel: 'Birthday',
    tones: ['modern', 'playful', 'festive'],
    description:
      'Chrome, midnight plum, iridescent ribbons, and electric after-dark energy.',
    coverSrc: '/templates/birthday-disco-v2.webp',
    accent: '#e64fd0',
    surface: '#17121f',
    textColor: '#f4eef9',
    musicName: invitationMusic.celebrationAfterglow.name,
    nameConnector: '',
    defaults: {
      brideName: 'Zoya',
      groomName: '',
      coupleLine: undefined,
      saveDateTitle: 'Meet me after dark',
      eventLine: 'Zoya turns twenty-five',
      date: '19 September 2026 · 9 PM',
      venueName: 'Studio 19, New Delhi',
      familyName: 'Hosted by the birthday crew',
      photoSrc: 'engagement/celebration.jpg',
      musicSrc: invitationMusic.celebrationAfterglow.src,
      showPhoto: true,
      photoFocalPoint: 34,
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
    tones: ['classic', 'minimal'],
    description:
      'Watercolour clouds, a champagne moon, soft botanicals, and an heirloom finish.',
    coverSrc: '/templates/baby-shower-moon.webp',
    accent: '#7b718f',
    surface: '#fbf4e6',
    textColor: '#536055',
    musicName: invitationMusic.littleWonder.name,
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
      musicSrc: invitationMusic.littleWonder.src,
      showPhoto: true,
      photoFocalPoint: 26,
    },
    fields: babyShowerFields,
  },
  {
    id: 'baby-shower-moon',
    version: 2,
    compositionId: 'BabyShowerMoon',
    name: 'Storybook Meadow',
    category: 'baby-shower',
    categoryLabel: 'Baby shower',
    tones: ['modern', 'playful', 'minimal'],
    description:
      'Painterly meadow layers, woodland details, and a soft gender-neutral palette.',
    coverSrc: '/templates/baby-meadow-v2.webp',
    accent: '#788d66',
    surface: '#f6f0df',
    textColor: '#4d6147',
    musicName: invitationMusic.littleWonder.name,
    nameConnector: ' & ',
    defaults: {
      brideName: 'Naina',
      groomName: 'Rohit',
      coupleLine: undefined,
      saveDateTitle: 'Our sweetest story begins',
      eventLine: 'Baby Shower',
      date: '07 March 2027 · 11 AM',
      venueName: 'The Orchard Room, Hyderabad',
      familyName: 'Hosted by the Suri Family',
      photoSrc: 'engagement/couple-photo.jpg',
      musicSrc: invitationMusic.littleWonder.src,
      showPhoto: false,
      photoFocalPoint: 30,
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
    tones: ['classic', 'festive'],
    description:
      'Terracotta architecture, morning light, hand-painted craft, and a warm welcome.',
    coverSrc: '/templates/housewarming-aangan.webp',
    accent: '#a64e2d',
    surface: '#f4dfc8',
    textColor: '#355243',
    musicName: invitationMusic.morningCourtyard.name,
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
      musicSrc: invitationMusic.morningCourtyard.src,
      showPhoto: false,
      photoFocalPoint: 42,
    },
    fields: housewarmingFields,
  },
  {
    id: 'housewarming-aangan',
    version: 2,
    compositionId: 'HousewarmingAangan',
    name: 'Modern Threshold',
    category: 'housewarming',
    categoryLabel: 'Housewarming',
    tones: ['modern', 'minimal'],
    description:
      'Sandstone, geometric jaali, olive foliage, and architectural late-afternoon light.',
    coverSrc: '/templates/house-modern-v2.webp',
    accent: '#8c6542',
    surface: '#eee4d4',
    textColor: '#38483c',
    musicName: invitationMusic.morningCourtyard.name,
    nameConnector: ' & ',
    defaults: {
      brideName: 'Aditi',
      groomName: 'Rohan',
      coupleLine: undefined,
      saveDateTitle: 'A place of our own',
      eventLine: 'Housewarming Evening',
      date: '12 December 2026 · 5 PM',
      venueName: '18 Banyan Court, Gurugram',
      familyName: 'With warmth, Aditi & Rohan',
      photoSrc: 'engagement/venue-photo.jpg',
      musicSrc: invitationMusic.morningCourtyard.src,
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

export const isInvitationTemplateVersion = (
  value: unknown,
): value is InvitationTemplateVersion =>
  typeof value === 'number' &&
  invitationTemplateVersions.includes(value as InvitationTemplateVersion);

export const getInvitationTemplate = (
  value: unknown,
  version?: unknown,
): InvitationTemplateDefinition => {
  const matches = invitationTemplates.filter(
    (template) => template.id === value,
  );
  if (matches.length === 0) {
    return invitationTemplates[0];
  }

  if (isInvitationTemplateVersion(version)) {
    return (
      matches.find((template) => template.version === version) ?? matches[0]
    );
  }

  return matches.reduce((latest, template) =>
    template.version > latest.version ? template : latest,
  );
};

export const getInvitationTemplateKey = (
  templateId: InvitationTemplateId,
  templateVersion: InvitationTemplateVersion,
): InvitationTemplateKey => `${templateId}@${templateVersion}`;

export const resolveTemplateAssetSrc = (
  source: string,
  assetBaseUrl?: string | null,
) => {
  if (/^(data:|blob:|https?:\/\/)/.test(source)) {
    return source;
  }

  const baseUrl = assetBaseUrl?.trim().replace(/\/+$/, '');
  return baseUrl
    ? `${baseUrl}/${source.replace(/^\/+/, '')}`
    : source;
};

export const isUploadedMusicSource = (
  source: string | null | undefined,
): boolean => Boolean(source?.startsWith('uploads/audio/'));

export const createTemplateDraft = (
  templateId: InvitationTemplateId,
  templateVersion?: InvitationTemplateVersion,
): InvitationContentProps => ({
  ...getInvitationTemplate(templateId, templateVersion).defaults,
  coupleLine: undefined,
});

export const validateTemplateProps = (
  templateId: InvitationTemplateId,
  props: EngagementInviteProps,
  options: {requireRequiredFields?: boolean} = {},
  templateVersion?: InvitationTemplateVersion,
): Partial<Record<InvitationValidationField, string>> => {
  const template = getInvitationTemplate(templateId, templateVersion);
  const errors: Partial<Record<InvitationValidationField, string>> = {};
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

  const isUploadedMusic = isUploadedMusicSource(props.musicSrc);
  if (
    props.musicSrc &&
    !isUploadedMusic &&
    !getInvitationMusicTrack(props.musicSrc)
  ) {
    errors.musicSrc = 'Choose music from the library or upload a supported file.';
  }

  if (isUploadedMusic) {
    if (!props.musicRightsConfirmed) {
      errors.musicRightsConfirmed =
        'Confirm that you have permission to use this music.';
    }
    if (
      typeof props.musicDurationSeconds !== 'number' ||
      !Number.isFinite(props.musicDurationSeconds) ||
      props.musicDurationSeconds <= 0 ||
      props.musicDurationSeconds > 600
    ) {
      errors.musicDurationSeconds =
        'The uploaded track must be no longer than 10 minutes.';
    }
  }

  if (
    props.musicTrimStartSeconds !== undefined &&
    (!Number.isFinite(props.musicTrimStartSeconds) ||
      props.musicTrimStartSeconds < 0)
  ) {
    errors.musicTrimStartSeconds = 'Choose a valid soundtrack start time.';
  } else if (
    isUploadedMusic &&
    typeof props.musicDurationSeconds === 'number' &&
    typeof props.musicTrimStartSeconds === 'number' &&
    props.musicTrimStartSeconds >
      Math.max(0, props.musicDurationSeconds - 30)
  ) {
    errors.musicTrimStartSeconds =
      'The 30-second selection must stay inside the uploaded track.';
  }

  if (
    props.musicVolume !== undefined &&
    (!Number.isFinite(props.musicVolume) ||
      props.musicVolume < 0 ||
      props.musicVolume > 1)
  ) {
    errors.musicVolume = 'Choose a volume between 0% and 100%.';
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
  templateVersion?: InvitationTemplateVersion,
) => {
  const template = getInvitationTemplate(templateId, templateVersion);
  const primaryName = valueOrDefault(
    props.brideName,
    template.defaults.brideName,
  );
  const secondaryNameIsOptional = template.fields.some(
    (templateField) =>
      templateField.key === 'groomName' && templateField.optional,
  );
  const secondaryName =
    secondaryNameIsOptional && props.groomName !== undefined
      ? props.groomName.trim()
      : valueOrDefault(props.groomName, template.defaults.groomName);
  const automaticNameLine = [primaryName, secondaryName]
    .filter(Boolean)
    .join(template.nameConnector);
  const musicSrc =
    props.musicSrc === undefined
      ? (template.defaults.musicSrc ?? null)
      : props.musicSrc;
  const musicTrack = getInvitationMusicTrack(musicSrc);
  const defaultMusicDuration =
    template.defaults.musicDurationSeconds ?? null;
  const requestedMusicDuration =
    musicTrack?.durationSeconds ??
    (props.musicDurationSeconds === undefined
      ? defaultMusicDuration
      : props.musicDurationSeconds);
  const musicDurationSeconds =
    typeof requestedMusicDuration === 'number' &&
    Number.isFinite(requestedMusicDuration) &&
    requestedMusicDuration > 0
      ? requestedMusicDuration
      : null;
  const maximumTrimStart = Math.max(0, (musicDurationSeconds ?? 30) - 30);
  const requestedTrimStart = musicTrack
    ? 0
    : (props.musicTrimStartSeconds ??
        template.defaults.musicTrimStartSeconds ??
        0);
  const musicTrimStartSeconds = Math.min(
    maximumTrimStart,
    Math.max(0, Number.isFinite(requestedTrimStart) ? requestedTrimStart : 0),
  );
  const requestedMusicVolume =
    props.musicVolume ?? template.defaults.musicVolume ?? 1;
  const musicVolume = Math.min(
    1,
    Math.max(0, Number.isFinite(requestedMusicVolume) ? requestedMusicVolume : 1),
  );

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
    musicSrc,
    musicUploadName: isUploadedMusicSource(musicSrc)
      ? (props.musicUploadName?.trim() || 'Uploaded soundtrack')
      : null,
    musicDurationSeconds,
    musicTrimStartSeconds,
    musicVolume,
    musicRightsConfirmed:
      isUploadedMusicSource(musicSrc) && Boolean(props.musicRightsConfirmed),
    showPhoto: props.showPhoto ?? template.defaults.showPhoto ?? true,
    photoFocalPoint:
      props.photoFocalPoint ?? template.defaults.photoFocalPoint ?? 50,
  };
};

export const templateProjectLabel = (
  templateId: InvitationTemplateId,
  props: InvitationContentProps,
  templateVersion?: InvitationTemplateVersion,
) => {
  const copy = resolveTemplateCopy(templateId, props, templateVersion);
  return copy.nameLine || copy.eventLine;
};

export const templateProjectInitials = (
  templateId: InvitationTemplateId,
  props: InvitationContentProps,
  templateVersion?: InvitationTemplateVersion,
) => {
  const copy = resolveTemplateCopy(templateId, props, templateVersion);
  return `${copy.primaryName.charAt(0)}${copy.secondaryName.charAt(0) || ''}`.toUpperCase();
};
