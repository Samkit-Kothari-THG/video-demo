export type EngagementInviteProps = {
  brideName?: string;
  groomName?: string;
  saveDateTitle?: string;
  eventLine?: string;
  coupleLine?: string;
  date?: string;
  venueName?: string;
  familyName?: string;
  photoSrc?: string | null;
  musicSrc?: string | null;
  showPhoto?: boolean;
  photoFocalPoint?: number;
};

export type ResolvedEngagementInviteProps = {
  brideName: string;
  groomName: string;
  saveDateTitle: string;
  eventLine: string;
  coupleLine: string;
  date: string;
  venueName: string;
  familyName: string;
  photoSrc: string | null;
  musicSrc: string | null;
  showPhoto: boolean;
  photoFocalPoint: number;
};

export type EngagementTextFieldKey =
  | 'brideName'
  | 'groomName'
  | 'coupleLine'
  | 'saveDateTitle'
  | 'eventLine'
  | 'date'
  | 'venueName'
  | 'familyName';

export type EngagementTextField = {
  key: EngagementTextFieldKey;
  label: string;
  description: string;
  maxLength: number;
  optional?: boolean;
};

export const engagementInviteTextFields: readonly EngagementTextField[] = [
  {
    key: 'brideName',
    label: 'First name',
    description: 'Shown in the couple line unless you customize it.',
    maxLength: 28,
  },
  {
    key: 'groomName',
    label: 'Second name',
    description: 'Shown in the couple line unless you customize it.',
    maxLength: 28,
  },
  {
    key: 'coupleLine',
    label: 'Couple line',
    description: 'Optional. Leave blank to use the two names automatically.',
    maxLength: 62,
    optional: true,
  },
  {
    key: 'saveDateTitle',
    label: 'Heading',
    description: 'The small heading shown across the invitation.',
    maxLength: 32,
  },
  {
    key: 'eventLine',
    label: 'Event',
    description: 'For example: Engagement, Wedding celebration, or Reception.',
    maxLength: 42,
  },
  {
    key: 'date',
    label: 'Date',
    description: 'Use the exact format you want guests to see.',
    maxLength: 32,
  },
  {
    key: 'venueName',
    label: 'Venue',
    description: 'Keep this concise for the invitation layout.',
    maxLength: 64,
  },
  {
    key: 'familyName',
    label: 'Hosting family',
    description: 'Shown in the final two scenes.',
    maxLength: 64,
  },
];

export const defaultEngagementInviteProps: ResolvedEngagementInviteProps = {
  brideName: 'Anusha',
  groomName: 'Akshat',
  saveDateTitle: 'Save the Date',
  eventLine: 'Engagement',
  coupleLine: 'Anusha with Akshat',
  date: '20.07.2026',
  venueName: 'The Legacy Nasik',
  familyName: 'Bhalgat Family',
  photoSrc: 'engagement/couple-photo.jpg',
  musicSrc: 'engagement/indian-instrumental.wav',
  showPhoto: true,
  photoFocalPoint: 18,
};

const textOrDefault = (value: string | undefined, fallback: string) => {
  const cleanValue = value?.trim();
  return cleanValue ? cleanValue : fallback;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const createEngagementInviteDraft = (): EngagementInviteProps => ({
  brideName: defaultEngagementInviteProps.brideName,
  groomName: defaultEngagementInviteProps.groomName,
  coupleLine: undefined,
  saveDateTitle: defaultEngagementInviteProps.saveDateTitle,
  eventLine: defaultEngagementInviteProps.eventLine,
  date: defaultEngagementInviteProps.date,
  venueName: defaultEngagementInviteProps.venueName,
  familyName: defaultEngagementInviteProps.familyName,
  photoSrc: defaultEngagementInviteProps.photoSrc,
  musicSrc: defaultEngagementInviteProps.musicSrc,
  showPhoto: defaultEngagementInviteProps.showPhoto,
  photoFocalPoint: defaultEngagementInviteProps.photoFocalPoint,
});

export const validateEngagementInviteProps = (
  props: EngagementInviteProps,
): Partial<Record<EngagementTextFieldKey | 'photoSrc', string>> => {
  const errors: Partial<Record<EngagementTextFieldKey | 'photoSrc', string>> = {};

  for (const field of engagementInviteTextFields) {
    const value = props[field.key]?.trim() ?? '';
    if (!field.optional && value.length === 0) {
      errors[field.key] = `${field.label} is required.`;
    } else if (value.length > field.maxLength) {
      errors[field.key] = `Keep this to ${field.maxLength} characters or fewer.`;
    }
  }

  if (props.photoSrc?.startsWith('data:') && props.photoSrc.length > 3_500_000) {
    errors.photoSrc = 'Choose an image smaller than 2.5 MB for local drafts.';
  }

  return errors;
};

/**
 * Resolves user input once so the editor preview and final renderer can share
 * identical derived values.
 */
export const resolveEngagementInviteProps = (
  props: EngagementInviteProps,
): ResolvedEngagementInviteProps => {
  const brideName = textOrDefault(
    props.brideName,
    defaultEngagementInviteProps.brideName,
  );
  const groomName = textOrDefault(
    props.groomName,
    defaultEngagementInviteProps.groomName,
  );

  return {
    brideName,
    groomName,
    saveDateTitle: textOrDefault(
      props.saveDateTitle,
      defaultEngagementInviteProps.saveDateTitle,
    ),
    eventLine: textOrDefault(
      props.eventLine,
      defaultEngagementInviteProps.eventLine,
    ),
    coupleLine: textOrDefault(props.coupleLine, `${brideName} with ${groomName}`),
    date: textOrDefault(props.date, defaultEngagementInviteProps.date),
    venueName: textOrDefault(
      props.venueName,
      defaultEngagementInviteProps.venueName,
    ),
    familyName: textOrDefault(
      props.familyName,
      defaultEngagementInviteProps.familyName,
    ),
    photoSrc:
      props.photoSrc === undefined
        ? defaultEngagementInviteProps.photoSrc
        : props.photoSrc,
    musicSrc:
      props.musicSrc === undefined
        ? defaultEngagementInviteProps.musicSrc
        : props.musicSrc,
    showPhoto: props.showPhoto ?? defaultEngagementInviteProps.showPhoto,
    photoFocalPoint: clamp(
      props.photoFocalPoint ?? defaultEngagementInviteProps.photoFocalPoint,
      0,
      100,
    ),
  };
};
