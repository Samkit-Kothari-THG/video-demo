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
};

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
};

const textOrDefault = (value: string | undefined, fallback: string) => {
  const cleanValue = value?.trim();
  return cleanValue ? cleanValue : fallback;
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
  };
};
