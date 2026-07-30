export const invitationFormats = [
  {
    id: 'video',
    label: 'Video invitation',
    shortLabel: 'Video',
    marker: '▶',
    description:
      'A cinematic 30-second story with scenes, portrait moments, and music.',
    detail: 'Best for immersive announcements',
    durationInFrames: 900,
    durationLabel: '30 seconds',
    canvasLabel: '1080 × 1920',
    primaryExport: 'mp4',
    exportTypes: ['mp4'],
  },
  {
    id: 'animated',
    label: 'Animated invite',
    shortLabel: 'Animated',
    marker: '✦',
    description:
      'A polished six-second card that loops smoothly and keeps every detail visible.',
    detail: 'Share as a looping MP4 or GIF',
    durationInFrames: 180,
    durationLabel: '6-second loop',
    canvasLabel: '1080 × 1920',
    primaryExport: 'mp4',
    exportTypes: ['mp4', 'gif'],
  },
  {
    id: 'photo',
    label: 'Photo invite',
    shortLabel: 'Photo',
    marker: '▧',
    description:
      'A high-resolution static card designed for quick sharing and easy printing.',
    detail: 'Download as a crisp PNG',
    durationInFrames: 1,
    durationLabel: 'Still image',
    canvasLabel: '1080 × 1920',
    primaryExport: 'png',
    exportTypes: ['png'],
  },
] as const;

export type InvitationFormat = (typeof invitationFormats)[number]['id'];
export type InvitationExportType =
  (typeof invitationFormats)[number]['exportTypes'][number];

export const isInvitationFormat = (
  value: unknown,
): value is InvitationFormat =>
  typeof value === 'string' &&
  invitationFormats.some((format) => format.id === value);

export const isInvitationExportType = (
  value: unknown,
): value is InvitationExportType =>
  value === 'mp4' || value === 'gif' || value === 'png';

export const getInvitationFormat = (value: unknown) =>
  invitationFormats.find((format) => format.id === value) ??
  invitationFormats[0];

export const canExportInvitationAs = (
  format: InvitationFormat,
  exportType: InvitationExportType,
) =>
  getInvitationFormat(format).exportTypes.some(
    (candidate) => candidate === exportType,
  );

export const invitationExportLabels: Record<
  InvitationExportType,
  {label: string; specification: string}
> = {
  mp4: {label: 'MP4', specification: 'MP4 · H.264'},
  gif: {label: 'GIF', specification: 'GIF · looping'},
  png: {label: 'PNG', specification: 'PNG · high resolution'},
};
