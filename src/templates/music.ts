export type InvitationMusicTrack = {
  id: string;
  name: string;
  description: string;
  src: string;
  durationSeconds: 30;
};

export const invitationMusic = {
  goldenHour: {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm plucked strings, an airy melody, and soft hand percussion.',
    src: 'engagement/indian-instrumental.wav',
    durationSeconds: 30,
  },
  moonlitVows: {
    id: 'moonlit-vows',
    name: 'Moonlit Vows',
    description: 'Romantic harp-like arpeggios with a slow, cinematic lead.',
    src: 'music/moonlit-vows.wav',
    durationSeconds: 30,
  },
  celebrationAfterglow: {
    id: 'celebration-afterglow',
    name: 'Celebration Afterglow',
    description: 'Bright rhythmic plucks, an upbeat pulse, and a playful hook.',
    src: 'music/celebration-afterglow.wav',
    durationSeconds: 30,
  },
  littleWonder: {
    id: 'little-wonder',
    name: 'Little Wonder',
    description: 'A gentle music-box lullaby with soft floating harmonies.',
    src: 'music/little-wonder.wav',
    durationSeconds: 30,
  },
  morningCourtyard: {
    id: 'morning-courtyard',
    name: 'Morning Courtyard',
    description: 'Optimistic acoustic plucks with a calm morning rhythm.',
    src: 'music/morning-courtyard.wav',
    durationSeconds: 30,
  },
} as const satisfies Record<string, InvitationMusicTrack>;

export const invitationMusicTracks: readonly InvitationMusicTrack[] =
  Object.values(invitationMusic);

export const getInvitationMusicTrack = (
  source: string | null | undefined,
): InvitationMusicTrack | null =>
  invitationMusicTracks.find((track) => track.src === source) ?? null;
