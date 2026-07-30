export type InvitationMusicTrack = {
  id: string;
  name: string;
  description: string;
  style: string;
  bpm: number;
  energy: 'gentle' | 'balanced' | 'bright';
  moods: readonly InvitationMusicMood[];
  recommendedFor: readonly InvitationMusicOccasion[];
  src: string;
  durationSeconds: 30;
  rights: InvitationMusicRights;
};

export type InvitationMusicMood =
  | 'romantic'
  | 'warm'
  | 'festive'
  | 'elegant'
  | 'dreamy'
  | 'playful'
  | 'modern'
  | 'organic'
  | 'minimal';

export type InvitationMusicOccasion =
  | 'engagement'
  | 'wedding'
  | 'birthday'
  | 'baby-shower'
  | 'housewarming';

export type InvitationMusicRights = {
  basis: 'project-original';
  attributionRequired: false;
  containsThirdPartySamples: false;
  commercialInvitationUse: true;
  evidence: string;
};

// The masters sit near -14.5 LUFS. A -6 dB render mix keeps music present
// without turning the soundtrack into the only thing the invitation conveys.
export const invitationMusicMixGain = 0.5;

const projectOriginalRights = {
  basis: 'project-original',
  attributionRequired: false,
  containsThirdPartySamples: false,
  commercialInvitationUse: true,
  evidence: 'docs/MUSIC_PROVENANCE.md',
} as const satisfies InvitationMusicRights;

export const invitationMusic = {
  goldenHour: {
    id: 'golden-hour',
    name: 'Marigold Air',
    description:
      'Warm santoor-like plucks, an airy original hook, and soft hand percussion.',
    style: 'Indian indie-folk',
    bpm: 96,
    energy: 'balanced',
    moods: ['romantic', 'warm', 'festive'],
    recommendedFor: ['engagement', 'wedding', 'housewarming'],
    src: 'music/marigold-air.mp3',
    durationSeconds: 30,
    rights: projectOriginalRights,
  },
  moonlitVows: {
    id: 'moonlit-vows',
    name: 'Moonlit Vows',
    description:
      'Wide harp-like arpeggios, velvet harmony, and a restrained cinematic lead.',
    style: 'Cinematic neo-classical',
    bpm: 72,
    energy: 'gentle',
    moods: ['romantic', 'elegant', 'dreamy'],
    recommendedFor: ['engagement', 'wedding'],
    src: 'music/moonlit-vows.mp3',
    durationSeconds: 30,
    rights: projectOriginalRights,
  },
  celebrationAfterglow: {
    id: 'celebration-afterglow',
    name: 'Celebration Afterglow',
    description:
      'A clean four-on-the-floor pulse, syncopated bass, and a bright original hook.',
    style: 'Nu-disco pop',
    bpm: 120,
    energy: 'bright',
    moods: ['playful', 'modern', 'festive'],
    recommendedFor: ['birthday'],
    src: 'music/celebration-afterglow.mp3',
    durationSeconds: 30,
    rights: projectOriginalRights,
  },
  littleWonder: {
    id: 'little-wonder',
    name: 'Little Wonder',
    description:
      'A gentle music-box figure, floating harmonies, and a soft half-time pulse.',
    style: 'Modern lullaby',
    bpm: 80,
    energy: 'gentle',
    moods: ['warm', 'dreamy', 'playful'],
    recommendedFor: ['baby-shower'],
    src: 'music/little-wonder.mp3',
    durationSeconds: 30,
    rights: projectOriginalRights,
  },
  morningCourtyard: {
    id: 'morning-courtyard',
    name: 'Morning Courtyard',
    description:
      'Optimistic acoustic plucks, hand-played-style rhythm, and a sunlit lead.',
    style: 'Acoustic Indian folk',
    bpm: 100,
    energy: 'balanced',
    moods: ['warm', 'organic', 'festive'],
    recommendedFor: ['housewarming', 'engagement'],
    src: 'music/morning-courtyard.mp3',
    durationSeconds: 30,
    rights: projectOriginalRights,
  },
  monsoonLetters: {
    id: 'monsoon-letters',
    name: 'Monsoon Letters',
    description:
      'Dreamy electric keys, a soft rain texture, and an intimate indie hook.',
    style: 'Indian indie / lo-fi',
    bpm: 84,
    energy: 'balanced',
    moods: ['romantic', 'modern', 'dreamy'],
    recommendedFor: ['engagement', 'wedding'],
    src: 'music/monsoon-letters.mp3',
    durationSeconds: 30,
    rights: projectOriginalRights,
  },
  saffronSkyline: {
    id: 'saffron-skyline',
    name: 'Saffron Skyline',
    description:
      'Organic dance drums, bright Indian plucks, and a confident festive lift.',
    style: 'Organic Indian house',
    bpm: 112,
    energy: 'bright',
    moods: ['festive', 'modern', 'organic'],
    recommendedFor: ['birthday', 'engagement', 'housewarming'],
    src: 'music/saffron-skyline.mp3',
    durationSeconds: 30,
    rights: projectOriginalRights,
  },
  firstLight: {
    id: 'first-light',
    name: 'First Light, Slowly',
    description:
      'Felt-piano-like notes, warm ambient space, and a minimal romantic theme.',
    style: 'Ambient piano',
    bpm: 80,
    energy: 'gentle',
    moods: ['minimal', 'elegant', 'romantic'],
    recommendedFor: ['wedding', 'baby-shower', 'housewarming'],
    src: 'music/first-light.mp3',
    durationSeconds: 30,
    rights: projectOriginalRights,
  },
} as const satisfies Record<string, InvitationMusicTrack>;

export const invitationMusicTracks: readonly InvitationMusicTrack[] =
  Object.values(invitationMusic);

const legacyInvitationMusicSources: Readonly<Record<string, string>> = {
  'engagement/indian-instrumental.wav': invitationMusic.goldenHour.src,
  'music/moonlit-vows.wav': invitationMusic.moonlitVows.src,
  'music/celebration-afterglow.wav':
    invitationMusic.celebrationAfterglow.src,
  'music/little-wonder.wav': invitationMusic.littleWonder.src,
  'music/morning-courtyard.wav': invitationMusic.morningCourtyard.src,
  'music/monsoon-letters.wav': invitationMusic.monsoonLetters.src,
  'music/saffron-skyline.wav': invitationMusic.saffronSkyline.src,
  'music/first-light.wav': invitationMusic.firstLight.src,
};

export const resolveInvitationMusicSource = (
  source: string | null | undefined,
): string | null | undefined =>
  source ? (legacyInvitationMusicSources[source] ?? source) : source;

export const getInvitationMusicTrack = (
  source: string | null | undefined,
): InvitationMusicTrack | null =>
  invitationMusicTracks.find(
    (track) => track.src === resolveInvitationMusicSource(source),
  ) ?? null;
