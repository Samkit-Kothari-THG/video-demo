'use client';

import {Player, type PlayerRef} from '@remotion/player';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  CatalogInvitation,
  createTemplateDraft,
  getInvitationFormat,
  getInvitationMusicTrack,
  getInvitationTemplate,
  invitationCategories,
  invitationExportLabels,
  invitationFormats,
  invitationMusicTracks,
  invitationTemplates,
  invitationToneOptions,
  isUploadedMusicSource,
  recommendInvitationTemplates,
  resolveTemplateAssetSrc,
  resolveTemplateCopy,
  ShareableInvitation,
  templateProjectInitials,
  templateProjectLabel,
  type EngagementTextFieldKey,
  type InvitationCategory,
  type InvitationContentProps,
  type InvitationExportType,
  type InvitationFormat,
  type InvitationPhotoPreference,
  type InvitationTemplateField,
  type InvitationTemplateId,
  type InvitationTemplateVersion,
  type InvitationTone,
  validateTemplateProps,
} from '../templates';
import styles from './InviteEditor.module.css';

type InviteProject = {
  id: string;
  templateId: InvitationTemplateId;
  templateVersion: InvitationTemplateVersion;
  format: InvitationFormat;
  createdAt: string;
  updatedAt: string;
  props: InvitationContentProps;
};

type EditorWorkspace = {
  activeProjectId: string | null;
  projects: InviteProject[];
};

type RenderJob = {
  id: string;
  format: InvitationFormat;
  exportType: InvitationExportType;
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  progress: number;
  outputUrl: string | null;
  error: string | null;
};

type EditorTab = 'story' | 'media' | 'sound' | 'review';
type EditorScreen = 'library' | 'guide' | 'editor';
type GuideStep =
  | 'format'
  | 'occasion'
  | 'details'
  | 'style'
  | 'recommendations';
type GuidedBrief = {
  format: InvitationFormat | null;
  occasion: InvitationCategory | null;
  primaryName: string;
  secondaryName: string;
  date: string;
  venue: string;
  hostLine: string;
  tone: InvitationTone | null;
  photoPreference: InvitationPhotoPreference | null;
};
type GuidedDetailsConfig = {
  primaryLabel: string;
  primaryPlaceholder: string;
  primaryMaxLength: number;
  secondaryLabel?: string;
  secondaryPlaceholder?: string;
  secondaryRequired: boolean;
  secondaryMaxLength: number;
  dateLabel: string;
  datePlaceholder: string;
  dateMaxLength: number;
  venueLabel: string;
  venuePlaceholder: string;
  venueMaxLength: number;
  hostLabel: string;
  hostPlaceholder: string;
  hostMaxLength: number;
};
type SavedGuidedDraft = {
  version: 1;
  step: GuideStep;
  brief: GuidedBrief;
};
type SaveState = 'saved' | 'saving' | 'offline';
type ServerState = 'checking' | 'ready' | 'offline';
type PreviewScene = {
  id: string;
  label: string;
  startFrame: number;
  focusFrame: number;
  editorTab: EditorTab;
};

const STORAGE_KEY = 'video-invite-studio:workspace:v1';
const GUIDE_STORAGE_KEY = 'video-invite-studio:guided-brief:v1';
const MAX_LOCAL_IMAGE_SIZE = 2_500_000;
const MAX_MUSIC_UPLOAD_SIZE = 50_000_000;
const MUSIC_CLIP_DURATION_SECONDS = 30;
const FLAGSHIP_TEMPLATE_ID: InvitationTemplateId = 'engagement-invite';
const FLAGSHIP_TEMPLATE_VERSION: InvitationTemplateVersion = 1;
const TEMPLATE_ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_TEMPLATE_ASSET_BASE_URL ?? null;
const flagshipTemplate = getInvitationTemplate(
  FLAGSHIP_TEMPLATE_ID,
  FLAGSHIP_TEMPLATE_VERSION,
);

const editorTabs: ReadonlyArray<{
  id: EditorTab;
  marker: string;
  label: string;
}> = [
  {id: 'story', marker: 'Aa', label: 'Story'},
  {id: 'media', marker: '▧', label: 'Photo'},
  {id: 'sound', marker: '♪', label: 'Sound'},
  {id: 'review', marker: '✓', label: 'Review'},
];

const guideSteps: ReadonlyArray<{id: GuideStep; label: string}> = [
  {id: 'format', label: 'Format'},
  {id: 'occasion', label: 'Occasion'},
  {id: 'details', label: 'Details'},
  {id: 'style', label: 'Style'},
  {id: 'recommendations', label: 'Designs'},
];

const guidedOccasions: ReadonlyArray<{
  id: InvitationCategory;
  label: string;
  marker: string;
  description: string;
}> = [
  {
    id: 'engagement',
    label: 'Engagement',
    marker: '◇',
    description: 'A warm announcement for the beginning of a new chapter.',
  },
  {
    id: 'wedding',
    label: 'Wedding',
    marker: '∞',
    description: 'A cinematic invitation for the ceremony and celebration.',
  },
  {
    id: 'birthday',
    label: 'Birthday',
    marker: '✦',
    description: 'A joyful film for a milestone, party, or intimate gathering.',
  },
  {
    id: 'baby-shower',
    label: 'Baby shower',
    marker: '☾',
    description: 'A gentle welcome for a little one and the people you love.',
  },
  {
    id: 'housewarming',
    label: 'Housewarming',
    marker: '⌂',
    description: 'A heartfelt invitation to celebrate a new home.',
  },
];

const guidedDetailsByCategory: Readonly<
  Record<InvitationCategory, GuidedDetailsConfig>
> = {
  engagement: {
    primaryLabel: 'Partner one',
    primaryPlaceholder: 'e.g. Anusha',
    primaryMaxLength: 28,
    secondaryLabel: 'Partner two',
    secondaryPlaceholder: 'e.g. Akshat',
    secondaryRequired: true,
    secondaryMaxLength: 28,
    dateLabel: 'Date and time',
    datePlaceholder: 'e.g. 20 July 2026 · 7 PM',
    dateMaxLength: 32,
    venueLabel: 'Venue',
    venuePlaceholder: 'e.g. The Glasshouse, Alibaug',
    venueMaxLength: 64,
    hostLabel: 'Hosted by',
    hostPlaceholder: 'Optional family or host line',
    hostMaxLength: 64,
  },
  wedding: {
    primaryLabel: 'Partner one',
    primaryPlaceholder: 'e.g. Aanya',
    primaryMaxLength: 28,
    secondaryLabel: 'Partner two',
    secondaryPlaceholder: 'e.g. Vihaan',
    secondaryRequired: true,
    secondaryMaxLength: 28,
    dateLabel: 'Date and time',
    datePlaceholder: 'e.g. 18 November 2026 · 6 PM',
    dateMaxLength: 36,
    venueLabel: 'Venue',
    venuePlaceholder: 'e.g. The Leela Palace, Jaipur',
    venueMaxLength: 64,
    hostLabel: 'Hosted by',
    hostPlaceholder: 'Optional family or host line',
    hostMaxLength: 68,
  },
  birthday: {
    primaryLabel: 'Guest of honour',
    primaryPlaceholder: 'e.g. Mira',
    primaryMaxLength: 30,
    secondaryRequired: false,
    secondaryMaxLength: 30,
    dateLabel: 'Date and time',
    datePlaceholder: 'e.g. 4 October 2026 · 8 PM',
    dateMaxLength: 38,
    venueLabel: 'Venue',
    venuePlaceholder: 'e.g. The Terrace House, Mumbai',
    venueMaxLength: 64,
    hostLabel: 'Hosted by',
    hostPlaceholder: 'Optional friend, family, or host line',
    hostMaxLength: 68,
  },
  'baby-shower': {
    primaryLabel: 'Parent-to-be',
    primaryPlaceholder: 'e.g. Rhea',
    primaryMaxLength: 30,
    secondaryLabel: 'Co-parent',
    secondaryPlaceholder: 'Optional',
    secondaryRequired: false,
    secondaryMaxLength: 30,
    dateLabel: 'Date and time',
    datePlaceholder: 'e.g. 22 August 2026 · 11 AM',
    dateMaxLength: 38,
    venueLabel: 'Venue',
    venuePlaceholder: 'e.g. The Glasshouse, Bengaluru',
    venueMaxLength: 64,
    hostLabel: 'Hosted by',
    hostPlaceholder: 'Optional family or host line',
    hostMaxLength: 68,
  },
  housewarming: {
    primaryLabel: 'Host name',
    primaryPlaceholder: 'e.g. Neha',
    primaryMaxLength: 30,
    secondaryLabel: 'Co-host',
    secondaryPlaceholder: 'Optional',
    secondaryRequired: false,
    secondaryMaxLength: 30,
    dateLabel: 'Date and time',
    datePlaceholder: 'e.g. 9 September 2026 · 10 AM',
    dateMaxLength: 38,
    venueLabel: 'New address',
    venuePlaceholder: 'e.g. 24 Gulmohar Lane, Pune',
    venueMaxLength: 72,
    hostLabel: 'Closing line',
    hostPlaceholder: 'Optional warm sign-off',
    hostMaxLength: 68,
  },
};

const photoPreferenceOptions: ReadonlyArray<{
  id: InvitationPhotoPreference;
  label: string;
  description: string;
}> = [
  {
    id: 'portrait',
    label: 'Feature a portrait',
    description: 'Make a personal photo the centre of the reveal.',
  },
  {
    id: 'designed',
    label: 'Keep it designed',
    description: 'Use the template’s monogram or illustrated moment.',
  },
  {
    id: 'flexible',
    label: 'Decide later',
    description: 'Start with the design’s recommended treatment.',
  },
];

const emptyGuidedBrief: GuidedBrief = {
  format: null,
  occasion: null,
  primaryName: '',
  secondaryName: '',
  date: '',
  venue: '',
  hostLine: '',
  tone: null,
  photoPreference: null,
};

const isGuideStep = (value: unknown): value is GuideStep =>
  typeof value === 'string' &&
  guideSteps.some((step) => step.id === value);

const isGuidedBrief = (value: unknown): value is GuidedBrief => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const brief = value as Partial<GuidedBrief>;
  const hasValidFormat =
    brief.format === null ||
    invitationFormats.some((format) => format.id === brief.format);
  const hasValidOccasion =
    brief.occasion === null ||
    guidedOccasions.some((occasion) => occasion.id === brief.occasion);
  const hasValidTone =
    brief.tone === null ||
    invitationToneOptions.some((tone) => tone.id === brief.tone);
  const hasValidPhotoPreference =
    brief.photoPreference === null ||
    photoPreferenceOptions.some(
      (preference) => preference.id === brief.photoPreference,
    );

  return (
    hasValidFormat &&
    hasValidOccasion &&
    hasValidTone &&
    hasValidPhotoPreference &&
    typeof brief.primaryName === 'string' &&
    typeof brief.secondaryName === 'string' &&
    typeof brief.date === 'string' &&
    typeof brief.venue === 'string' &&
    typeof brief.hostLine === 'string'
  );
};

const hasRequiredGuidedDetails = (brief: GuidedBrief) => {
  if (!brief.occasion) {
    return false;
  }

  const config = guidedDetailsByCategory[brief.occasion];
  return Boolean(
    brief.primaryName.trim() &&
      brief.date.trim() &&
      brief.venue.trim() &&
      (!config.secondaryRequired || brief.secondaryName.trim()),
  );
};

const normalizeGuideStep = (step: GuideStep, brief: GuidedBrief): GuideStep => {
  if (!brief.format) {
    return 'format';
  }

  if (step === 'format') {
    return 'format';
  }

  if (!brief.occasion) {
    return 'occasion';
  }

  if (step === 'occasion' || step === 'details') {
    return step;
  }

  if (!hasRequiredGuidedDetails(brief)) {
    return 'details';
  }

  if (step === 'style') {
    return step;
  }

  return brief.tone && brief.photoPreference ? 'recommendations' : 'style';
};

const loadGuidedDraft = (): SavedGuidedDraft | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const saved = window.localStorage.getItem(GUIDE_STORAGE_KEY);
    const parsed = saved ? (JSON.parse(saved) as Partial<SavedGuidedDraft>) : null;
    const hasStartedGuide = Boolean(
      parsed?.brief?.format || parsed?.brief?.occasion,
    );
    const migratedBrief = parsed?.brief
      ? ({
          ...parsed.brief,
          format: parsed.brief.format ?? 'video',
        } as GuidedBrief)
      : null;
    if (
      !parsed ||
      parsed.version !== 1 ||
      !isGuideStep(parsed.step) ||
      !isGuidedBrief(migratedBrief) ||
      !hasStartedGuide
    ) {
      return null;
    }

    return {
      version: 1,
      step: normalizeGuideStep(parsed.step, migratedBrief),
      brief: migratedBrief,
    };
  } catch {
    return null;
  }
};

const clearStoredGuidedDraft = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(GUIDE_STORAGE_KEY);
  } catch {
    // The in-memory guide remains usable when browser storage is unavailable.
  }
};

const guidedEventLine = (
  category: InvitationCategory,
  primaryName: string,
) => {
  switch (category) {
    case 'engagement':
      return 'Engagement Celebration';
    case 'wedding':
      return 'Wedding Celebration';
    case 'birthday':
      return `${primaryName}’s Birthday`;
    case 'baby-shower':
      return 'Baby Shower';
    case 'housewarming':
      return 'Housewarming Celebration';
  }
};

const guidedHostLine = (category: InvitationCategory) => {
  switch (category) {
    case 'engagement':
    case 'wedding':
      return 'Together with their families';
    case 'birthday':
      return 'Hosted with love by friends & family';
    case 'baby-shower':
      return 'Hosted with love by family & friends';
    case 'housewarming':
      return 'With warmth from your hosts';
  }
};

const guidedTemplateProps = (
  brief: GuidedBrief,
  templateId: InvitationTemplateId,
  templateVersion: InvitationTemplateVersion,
): Partial<InvitationContentProps> => {
  if (!brief.occasion) {
    return {};
  }

  const template = getInvitationTemplate(templateId, templateVersion);
  const primaryName = brief.primaryName.trim();
  const secondaryName = brief.secondaryName.trim();
  const nameLine = [primaryName, secondaryName]
    .filter(Boolean)
    .join(template.nameConnector);

  return {
    brideName: primaryName,
    groomName: secondaryName,
    coupleLine: nameLine,
    eventLine: guidedEventLine(brief.occasion, primaryName),
    date: brief.date.trim(),
    venueName: brief.venue.trim(),
    familyName:
      brief.hostLine.trim() || guidedHostLine(brief.occasion),
  };
};

const previewScene = (
  id: PreviewScene['id'],
  label: string,
  startFrame: number,
  focusFrame: number,
  editorTab: EditorTab,
): PreviewScene => ({id, label, startFrame, focusFrame, editorTab});

const flagshipPreviewScenes: readonly PreviewScene[] = [
  previewScene('opening', 'Opening', 0, 32, 'story'),
  previewScene('names', 'Names', 145, 175, 'story'),
  previewScene('photo', 'Photo', 315, 350, 'media'),
  previewScene('details', 'Details', 500, 525, 'story'),
  previewScene('finale', 'Finale', 665, 790, 'review'),
];

const categoryPreviewScenes: readonly PreviewScene[] = [
  previewScene('opening', 'Opening', 0, 34, 'story'),
  previewScene('names', 'Names', 170, 210, 'story'),
  previewScene('photo', 'Photo', 340, 382, 'media'),
  previewScene('details', 'Details', 590, 635, 'story'),
  previewScene('finale', 'Finale', 760, 795, 'review'),
];

const animatedPreviewScenes: readonly PreviewScene[] = [
  previewScene('arrival', 'Arrival', 0, 18, 'story'),
  previewScene('details', 'Details', 60, 78, 'story'),
  previewScene('loop', 'Loop', 120, 138, 'review'),
];

const photoPreviewScenes: readonly PreviewScene[] = [
  previewScene('card', 'Invitation card', 0, 0, 'review'),
];

const PREVIEW_FPS = 30;

const formatPreviewTime = (frame: number) => {
  const totalSeconds = Math.floor(frame / PREVIEW_FPS);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `invite-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createProject = (
  templateId: InvitationTemplateId,
  templateVersion?: InvitationTemplateVersion,
  format: InvitationFormat = 'video',
): InviteProject => {
  const now = new Date().toISOString();
  const template = getInvitationTemplate(templateId, templateVersion);
  const draft = createTemplateDraft(template.id, template.version);
  return {
    id: makeId(),
    templateId: template.id,
    templateVersion: template.version,
    format,
    createdAt: now,
    updatedAt: now,
    props: {
      ...draft,
      musicSrc: format === 'video' ? draft.musicSrc : null,
    },
  };
};

const isWorkspace = (value: unknown): value is EditorWorkspace => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return Array.isArray((value as Partial<EditorWorkspace>).projects);
};

const loadWorkspace = (): EditorWorkspace => {
  if (typeof window === 'undefined') {
    return {activeProjectId: null, projects: []};
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    if (!isWorkspace(parsed)) {
      return {activeProjectId: null, projects: []};
    }

    return {
      activeProjectId: parsed.activeProjectId,
      projects: parsed.projects.map((project) => {
        const savedProject = project as InviteProject;
        const template = getInvitationTemplate(
          savedProject.templateId,
          savedProject.templateVersion ?? 1,
        );
        return {
          ...savedProject,
          templateId: template.id,
          templateVersion: template.version,
          format:
            savedProject.format &&
            invitationFormats.some(
              (format) => format.id === savedProject.format,
            )
              ? savedProject.format
              : 'video',
        };
      }),
    };
  } catch {
    return {activeProjectId: null, projects: []};
  }
};

const projectLabel = (project: InviteProject) => {
  return templateProjectLabel(
    project.templateId,
    project.props,
    project.templateVersion,
  );
};

const projectInitials = (project: InviteProject) => {
  return templateProjectInitials(
    project.templateId,
    project.props,
    project.templateVersion,
  );
};

const formatProjectDate = (date: string) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));

const renderCommand = (
  templateId: InvitationTemplateId,
  templateVersion: InvitationTemplateVersion,
  format: InvitationFormat,
  exportType: InvitationExportType,
  props: InvitationContentProps,
) => {
  const template = getInvitationTemplate(templateId, templateVersion);
  const compositionId =
    format === 'video' ? template.compositionId : 'ShareableInvitation';
  const renderableProps = {
    ...props,
    templateId: template.id,
    templateVersion: template.version,
    format,
    musicSrc: format === 'video' ? props.musicSrc : null,
    photoSrc: props.photoSrc?.startsWith('data:')
      ? 'engagement/couple-photo.jpg'
      : props.photoSrc,
  };

  if (exportType === 'png') {
    return `npx remotion still src/index.ts ${compositionId} out/${template.id}-v${template.version}.png --frame=45 --props='${JSON.stringify(renderableProps)}'`;
  }

  const gifOptions =
    exportType === 'gif'
      ? ' --codec=gif --every-nth-frame=2 --scale=0.5'
      : '';
  return `npx remotion render src/index.ts ${compositionId} out/${template.id}-v${template.version}.${exportType}${gifOptions} --props='${JSON.stringify(renderableProps)}'`;
};

const browserMediaSource = (source: string) => {
  if (/^(data:|blob:|https?:\/\/|\/)/.test(source)) {
    return source;
  }

  return `/${source}`;
};

const formatAudioTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}:${String(safeSeconds % 60).padStart(2, '0')}`;
};

const createWaveform = async (source: string, barCount = 84) => {
  const response = await fetch(source);
  if (!response.ok) {
    throw new Error('Waveform unavailable');
  }

  const audioContext = new AudioContext();
  try {
    const audioBuffer = await audioContext.decodeAudioData(
      await response.arrayBuffer(),
    );
    const values = Array.from({length: barCount}, (_, barIndex) => {
      const start = Math.floor(
        (barIndex / barCount) * audioBuffer.length,
      );
      const end = Math.max(
        start + 1,
        Math.floor(((barIndex + 1) / barCount) * audioBuffer.length),
      );
      const stride = Math.max(1, Math.floor((end - start) / 180));
      let peak = 0;
      for (
        let channelIndex = 0;
        channelIndex < audioBuffer.numberOfChannels;
        channelIndex++
      ) {
        const channel = audioBuffer.getChannelData(channelIndex);
        for (let sampleIndex = start; sampleIndex < end; sampleIndex += stride) {
          peak = Math.max(peak, Math.abs(channel[sampleIndex] ?? 0));
        }
      }
      return peak;
    });
    const maximum = Math.max(...values, 0.01);
    return values.map((value) => Math.max(0.08, value / maximum));
  } finally {
    await audioContext.close();
  }
};

const fallbackWaveform = Array.from(
  {length: 84},
  (_, index) => 0.2 + ((index * 29) % 67) / 100,
);

const TextField: React.FC<{
  field: InvitationTemplateField;
  value: string;
  error?: string;
  onChange: (key: EngagementTextFieldKey, value: string) => void;
}> = ({field, value, error, onChange}) => {
  const isWide = ['coupleLine', 'venueName', 'familyName'].includes(field.key);

  return (
    <div className={`${styles.field} ${isWide ? styles.fieldWide : ''}`}>
      <div className={styles.fieldLabelRow}>
        <label htmlFor={field.key}>{field.label}</label>
        <span>
          {value.length}/{field.maxLength}
        </span>
      </div>
      <input
        aria-describedby={`${field.key}-help`}
        aria-invalid={Boolean(error)}
        className={error ? styles.fieldInputError : undefined}
        id={field.key}
        maxLength={field.maxLength}
        onChange={(event) => onChange(field.key, event.target.value)}
        placeholder={
          field.optional ? 'Use both names automatically' : undefined
        }
        type="text"
        value={value}
      />
      <small
        className={error ? styles.fieldError : undefined}
        id={`${field.key}-help`}
      >
        {error ?? field.description}
      </small>
    </div>
  );
};

export const InviteEditor: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);
  const uploadedAudioRef = useRef<HTMLAudioElement>(null);
  const [workspace, setWorkspace] = useState<EditorWorkspace>({
    activeProjectId: null,
    projects: [],
  });
  const [screen, setScreen] = useState<EditorScreen>('library');
  const [activeTab, setActiveTab] = useState<EditorTab>('story');
  const [guideStep, setGuideStep] = useState<GuideStep>('format');
  const [guidedBrief, setGuidedBrief] =
    useState<GuidedBrief>(emptyGuidedBrief);
  const [hasSavedGuide, setHasSavedGuide] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | InvitationCategory
  >('all');
  const [selectedLibraryFormat, setSelectedLibraryFormat] =
    useState<InvitationFormat>('video');
  const [storageError, setStorageError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [renderJob, setRenderJob] = useState<RenderJob | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [serverState, setServerState] = useState<ServerState>('checking');
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [previewFrame, setPreviewFrame] = useState(0);
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);
  const [musicRightsChecked, setMusicRightsChecked] = useState(false);
  const [musicWaveform, setMusicWaveform] = useState<number[]>([]);
  const [isMusicPreviewPlaying, setIsMusicPreviewPlaying] = useState(false);

  const activeProject = workspace.projects.find(
    (project) => project.id === workspace.activeProjectId,
  );
  const activeTemplate = activeProject
    ? getInvitationTemplate(
        activeProject.templateId,
        activeProject.templateVersion,
      )
    : flagshipTemplate;
  const activeFormat = getInvitationFormat(activeProject?.format);
  const previewDurationInFrames = activeFormat.durationInFrames;
  const previewScenes =
    activeFormat.id === 'animated'
      ? animatedPreviewScenes
      : activeFormat.id === 'photo'
        ? photoPreviewScenes
        : activeTemplate.id === FLAGSHIP_TEMPLATE_ID &&
            activeTemplate.version === FLAGSHIP_TEMPLATE_VERSION
          ? flagshipPreviewScenes
          : categoryPreviewScenes;
  const visibleEditorTabs = editorTabs.filter(
    (tab) => tab.id !== 'sound' || activeFormat.id === 'video',
  );
  const activePreviewSceneIndex = previewScenes.findIndex(
    (scene, index) =>
      previewFrame >= scene.startFrame &&
      previewFrame <
        (previewScenes[index + 1]?.startFrame ?? previewDurationInFrames),
  );
  const props =
    activeProject?.props ??
    createTemplateDraft(activeTemplate.id, activeTemplate.version);
  const details = useMemo(
    () =>
      resolveTemplateCopy(
        activeTemplate.id,
        props,
        activeTemplate.version,
      ),
    [activeTemplate.id, activeTemplate.version, props],
  );
  const selectedMusicTrack = getInvitationMusicTrack(details.musicSrc);
  const hasUploadedMusic = isUploadedMusicSource(details.musicSrc);
  const uploadedMusicDuration =
    details.musicDurationSeconds ?? MUSIC_CLIP_DURATION_SECONDS;
  const uploadedMusicTrimEnd = Math.min(
    uploadedMusicDuration,
    details.musicTrimStartSeconds + MUSIC_CLIP_DURATION_SECONDS,
  );
  const maximumMusicTrimStart = Math.max(
    0,
    uploadedMusicDuration - MUSIC_CLIP_DURATION_SECONDS,
  );
  const visibleMusicWaveform =
    musicWaveform.length > 0 ? musicWaveform : fallbackWaveform;
  const rankedMusicTracks = useMemo(() => {
    const score = (track: (typeof invitationMusicTracks)[number]) =>
      (track.src === activeTemplate.defaults.musicSrc ? 2 : 0) +
      (track.recommendedFor.includes(activeTemplate.category) ? 1 : 0);

    return [...invitationMusicTracks].sort(
      (left, right) => score(right) - score(left),
    );
  }, [
    activeTemplate.category,
    activeTemplate.defaults.musicSrc,
  ]);
  const errors = useMemo(
    () =>
      validateTemplateProps(
        activeTemplate.id,
        props,
        {},
        activeTemplate.version,
      ),
    [activeTemplate.id, activeTemplate.version, props],
  );
  const visibleTemplates =
    selectedCategory === 'all'
      ? invitationTemplates
      : invitationTemplates.filter(
          (template) => template.category === selectedCategory,
        );
  const guideStepIndex = guideSteps.findIndex((step) => step.id === guideStep);
  const guidedOccasion = guidedOccasions.find(
    (occasion) => occasion.id === guidedBrief.occasion,
  );
  const guidedFormat = guidedBrief.format
    ? getInvitationFormat(guidedBrief.format)
    : null;
  const guidedDetails = guidedBrief.occasion
    ? guidedDetailsByCategory[guidedBrief.occasion]
    : null;
  const guidedDetailsComplete = hasRequiredGuidedDetails(guidedBrief);
  const guidedNameLine = [
    guidedBrief.primaryName.trim(),
    guidedBrief.secondaryName.trim(),
  ]
    .filter(Boolean)
    .join(' & ');
  const guidedResumeSummary =
    [guidedNameLine, guidedBrief.date.trim(), guidedBrief.venue.trim()]
      .filter(Boolean)
      .join(' · ') ||
    (guidedOccasion
      ? 'Your occasion is saved and ready to continue.'
      : 'Your chosen format is saved and ready to continue.');
  const recommendations = useMemo(
    () =>
      guidedBrief.occasion &&
      guidedBrief.format &&
      guidedDetailsComplete &&
      guidedBrief.tone &&
      guidedBrief.photoPreference
        ? recommendInvitationTemplates({
            category: guidedBrief.occasion,
            format: guidedBrief.format,
            tone: guidedBrief.tone,
            photoPreference: guidedBrief.photoPreference,
          })
        : [],
    [
      guidedDetailsComplete,
      guidedBrief.format,
      guidedBrief.occasion,
      guidedBrief.photoPreference,
      guidedBrief.tone,
    ],
  );
  const errorCount = Object.keys(errors).length;
  const isRendering =
    renderJob?.status === 'queued' || renderJob?.status === 'rendering';

  useEffect(() => {
    const savedWorkspace = loadWorkspace();
    const savedGuide = loadGuidedDraft();
    setWorkspace(savedWorkspace);
    if (savedGuide) {
      setGuidedBrief(savedGuide.brief);
      setGuideStep(savedGuide.step);
      setHasSavedGuide(true);
    }
    setScreen(savedWorkspace.activeProjectId ? 'editor' : 'library');
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
      setStorageError(null);
    } catch {
      setStorageError(
        'This draft is too large for browser storage. Choose a smaller photo.',
      );
    }
  }, [isHydrated, workspace]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!guidedBrief.format && !guidedBrief.occasion) {
      clearStoredGuidedDraft();
      setHasSavedGuide(false);
      return;
    }

    try {
      const savedDraft: SavedGuidedDraft = {
        version: 1,
        step: guideStep,
        brief: guidedBrief,
      };
      window.localStorage.setItem(
        GUIDE_STORAGE_KEY,
        JSON.stringify(savedDraft),
      );
      setHasSavedGuide(true);
    } catch {
      // Keep the active guide usable even if this browser blocks storage.
    }
  }, [guideStep, guidedBrief, isHydrated]);

  useEffect(() => {
    let cancelled = false;

    const loadServerProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Projects unavailable');
        }

        const body = (await response.json()) as {projects: InviteProject[]};
        if (!cancelled) {
          setServerState('ready');
          setWorkspace((current) => {
            const serverIds = new Set(
              body.projects.map((project) => project.id),
            );
            const localProjects = current.projects.filter(
              (project) => !serverIds.has(project.id),
            );
            const projects = [...body.projects, ...localProjects];
            const currentProjectStillExists = projects.some(
              (project) => project.id === current.activeProjectId,
            );

            return {
              activeProjectId: currentProjectStillExists
                ? current.activeProjectId
                : (projects[0]?.id ?? null),
              projects,
            };
          });
        }
      } catch {
        // Browser drafts remain usable when the local API is offline.
        if (!cancelled) {
          setServerState('offline');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProjects(false);
        }
      }
    };

    void loadServerProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeProject) {
      return;
    }

    setSaveState('saving');
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/projects/${activeProject.id}`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({props: activeProject.props}),
        });

        if (!response.ok) {
          throw new Error('Save unavailable');
        }

        const body = (await response.json()) as {project: InviteProject};
        setWorkspace((current) => ({
          ...current,
          projects: current.projects.map((project) =>
            project.id === body.project.id
              ? {...project, updatedAt: body.project.updatedAt}
              : project,
          ),
        }));
        setSaveState('saved');
        setServerState('ready');
      } catch {
        setSaveState('offline');
        setServerState('offline');
      }
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [activeProject?.id, activeProject?.props]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;
    if (!hasUploadedMusic || !details.musicSrc) {
      setMusicWaveform([]);
      return;
    }

    setMusicWaveform([]);
    void createWaveform(browserMediaSource(details.musicSrc))
      .then((waveform) => {
        if (!cancelled) {
          setMusicWaveform(waveform);
        }
      })
      .catch(() => {
        // The deterministic fallback keeps the trimmer useful if decoding fails.
      });

    return () => {
      cancelled = true;
    };
  }, [details.musicSrc, hasUploadedMusic]);

  useEffect(() => {
    const audio = uploadedAudioRef.current;
    if (!audio) {
      return;
    }

    audio.pause();
    setIsMusicPreviewPlaying(false);
    if (hasUploadedMusic) {
      try {
        audio.currentTime = details.musicTrimStartSeconds;
      } catch {
        // Metadata may still be loading; onLoadedMetadata applies the start.
      }
    }
  }, [
    details.musicSrc,
    details.musicTrimStartSeconds,
    hasUploadedMusic,
  ]);

  useEffect(() => {
    if (uploadedAudioRef.current) {
      uploadedAudioRef.current.volume = details.musicVolume;
    }
  }, [details.musicVolume]);

  useEffect(() => {
    if (screen !== 'editor' || !activeProject) {
      return;
    }

    const player = playerRef.current;
    if (!player) {
      return;
    }

    const handleTimeUpdate = (event: {detail: {frame: number}}) => {
      setPreviewFrame(event.detail.frame);
    };

    player.addEventListener('timeupdate', handleTimeUpdate);
    setPreviewFrame(player.getCurrentFrame());

    return () => {
      player.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [activeProject?.id, screen]);

  useEffect(() => {
    if (!isRendering || !renderJob) {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/renders/${renderJob.id}`);
        if (response.ok) {
          const body = (await response.json()) as {job: RenderJob};
          setRenderJob(body.job);
        }
      } catch {
        // Keep the last known progress visible until polling recovers.
      }
    }, 1_200);

    return () => window.clearInterval(interval);
  }, [isRendering, renderJob]);

  const showLibrary = () => {
    setScreen('library');
    setRenderJob(null);
  };

  const startGuide = () => {
    clearStoredGuidedDraft();
    setGuidedBrief(emptyGuidedBrief);
    setGuideStep('format');
    setHasSavedGuide(false);
    setRenderJob(null);
    setScreen('guide');
  };

  const resumeGuide = () => {
    setRenderJob(null);
    setScreen('guide');
  };

  const clearGuidedDraft = () => {
    clearStoredGuidedDraft();
    setGuidedBrief(emptyGuidedBrief);
    setGuideStep('format');
    setHasSavedGuide(false);
  };

  const goBackInGuide = () => {
    if (guideStep === 'recommendations') {
      setGuideStep('style');
      return;
    }

    if (guideStep === 'style') {
      setGuideStep('details');
      return;
    }

    if (guideStep === 'details') {
      setGuideStep('occasion');
      return;
    }

    if (guideStep === 'occasion') {
      setGuideStep('format');
      return;
    }

    showLibrary();
  };

  const openProject = (projectId: string) => {
    setWorkspace((current) => ({...current, activeProjectId: projectId}));
    setActiveTab('story');
    setPreviewFrame(0);
    setRenderJob(null);
    setScreen('editor');
  };

  const useTemplate = async (
    templateId: InvitationTemplateId = FLAGSHIP_TEMPLATE_ID,
    templateVersion: InvitationTemplateVersion = FLAGSHIP_TEMPLATE_VERSION,
    initialProps: Partial<InvitationContentProps> = {},
    format: InvitationFormat = 'video',
  ) => {
    const project = createProject(templateId, templateVersion, format);
    const localProject: InviteProject = {
      ...project,
      props: {...project.props, ...initialProps},
    };

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          templateId,
          templateVersion,
          format,
          props: localProject.props,
        }),
      });
      if (!response.ok) {
        throw new Error('Project API unavailable');
      }

      const body = (await response.json()) as {project: InviteProject};
      setWorkspace((current) => ({
        activeProjectId: body.project.id,
        projects: [
          body.project,
          ...current.projects.filter(
            (project) => project.id !== body.project.id,
          ),
        ],
      }));
      setSaveState('saved');
      setServerState('ready');
    } catch {
      setWorkspace((current) => ({
        activeProjectId: localProject.id,
        projects: [localProject, ...current.projects],
      }));
      setSaveState('offline');
      setServerState('offline');
      setToast('Created as a browser draft. The local server is offline.');
    }

    setActiveTab('story');
    setPreviewFrame(0);
    setRenderJob(null);
    setScreen('editor');
  };

  const useRecommendedTemplate = (
    templateId: InvitationTemplateId,
    templateVersion: InvitationTemplateVersion,
    defaultShowPhoto: boolean | undefined,
  ) => {
    const showPhoto =
      guidedBrief.photoPreference === 'portrait'
        ? true
        : guidedBrief.photoPreference === 'designed'
          ? false
          : (defaultShowPhoto ?? true);
    const initialProps = guidedTemplateProps(
      guidedBrief,
      templateId,
      templateVersion,
    );

    clearGuidedDraft();
    return useTemplate(
      templateId,
      templateVersion,
      {
        ...initialProps,
        showPhoto,
      },
      guidedBrief.format ?? 'video',
    );
  };

  const browseGuidedCategory = () => {
    setSelectedCategory(guidedBrief.occasion ?? 'all');
    setSelectedLibraryFormat(guidedBrief.format ?? 'video');
    showLibrary();
  };

  const jumpToPreviewScene = (scene: PreviewScene) => {
    playerRef.current?.seekTo(scene.focusFrame);
    setPreviewFrame(scene.focusFrame);
    setActiveTab(scene.editorTab);
  };

  const updateProps = (updates: Partial<InvitationContentProps>) => {
    if (!activeProject) {
      return;
    }

    setWorkspace((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === activeProject.id
          ? {
              ...project,
              props: {...project.props, ...updates},
              updatedAt: new Date().toISOString(),
            }
          : project,
      ),
    }));
    setSaveState('saving');

    if (
      renderJob?.status === 'completed' ||
      renderJob?.status === 'failed'
    ) {
      setRenderJob(null);
    }
  };

  const duplicateProject = async () => {
    if (!activeProject) {
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          templateId: activeProject.templateId,
          templateVersion: activeProject.templateVersion,
          format: activeProject.format,
          props: activeProject.props,
        }),
      });
      if (!response.ok) {
        throw new Error('Project API unavailable');
      }

      const body = (await response.json()) as {project: InviteProject};
      setWorkspace((current) => ({
        activeProjectId: body.project.id,
        projects: [body.project, ...current.projects],
      }));
      setSaveState('saved');
      setServerState('ready');
      setToast('Copy created and ready to edit.');
    } catch {
      const now = new Date().toISOString();
      const duplicate: InviteProject = {
        ...activeProject,
        id: makeId(),
        createdAt: now,
        updatedAt: now,
        props: {...activeProject.props},
      };
      setWorkspace((current) => ({
        activeProjectId: duplicate.id,
        projects: [duplicate, ...current.projects],
      }));
      setSaveState('offline');
      setServerState('offline');
      setToast('A browser-only copy was created.');
    }

    setRenderJob(null);
  };

  const handleMusicUpload = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    if (!musicRightsChecked && !details.musicRightsConfirmed) {
      setToast('Confirm that you have permission to use this music.');
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['mp3', 'm4a', 'wav'].includes(extension)) {
      setToast('Choose an MP3, M4A, or WAV audio file.');
      return;
    }
    if (file.size > MAX_MUSIC_UPLOAD_SIZE) {
      setToast('Choose music smaller than 50 MB.');
      return;
    }

    setIsUploadingMusic(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('kind', 'audio');
      formData.append('rightsConfirmed', 'true');
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });
      const body = (await response.json()) as {
        assetPath?: string;
        durationSeconds?: number;
        originalName?: string;
        error?: string;
      };
      if (
        !response.ok ||
        !body.assetPath ||
        typeof body.durationSeconds !== 'number'
      ) {
        throw new Error(body.error ?? 'The music could not be uploaded.');
      }

      setServerState('ready');
      setMusicRightsChecked(true);
      updateProps({
        musicSrc: body.assetPath,
        musicUploadName: body.originalName ?? file.name,
        musicDurationSeconds: body.durationSeconds,
        musicTrimStartSeconds: 0,
        musicVolume: 1,
        musicRightsConfirmed: true,
      });
      setToast('Music uploaded. Choose the exact 30-second moment.');
    } catch (error) {
      setToast(
        error instanceof Error
          ? error.message
          : 'The music could not be uploaded.',
      );
    } finally {
      setIsUploadingMusic(false);
    }
  };

  const toggleUploadedMusicPreview = async () => {
    const audio = uploadedAudioRef.current;
    if (!audio || !hasUploadedMusic) {
      return;
    }

    if (!audio.paused) {
      audio.pause();
      setIsMusicPreviewPlaying(false);
      return;
    }

    if (
      audio.currentTime < details.musicTrimStartSeconds ||
      audio.currentTime >= uploadedMusicTrimEnd
    ) {
      audio.currentTime = details.musicTrimStartSeconds;
    }
    audio.volume = details.musicVolume;
    try {
      await audio.play();
      setIsMusicPreviewPlaying(true);
    } catch {
      setToast('Your browser could not preview this audio file.');
    }
  };

  const syncUploadedMusicPreview = () => {
    const audio = uploadedAudioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = details.musicVolume;
    if (audio.currentTime >= uploadedMusicTrimEnd) {
      audio.pause();
      audio.currentTime = details.musicTrimStartSeconds;
      setIsMusicPreviewPlaying(false);
    }
  };

  const handleImage = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setToast('Choose a JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > 5_000_000) {
      setToast('Choose an image smaller than 5 MB.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Upload API unavailable');
      }

      const body = (await response.json()) as {assetPath: string};
      setServerState('ready');
      updateProps({photoSrc: body.assetPath, showPhoto: true});
      setToast('Photo uploaded. Use the slider to refine the crop.');
      return;
    } catch {
      // Fall back to an embedded browser image when the API is unavailable.
    }

    if (file.size > MAX_LOCAL_IMAGE_SIZE) {
      setToast(
        'This photo is too large for a browser draft. Start the local server to upload it.',
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateProps({photoSrc: reader.result, showPhoto: true});
        setToast('Photo added to this browser draft.');
      }
    };
    reader.readAsDataURL(file);
  };

  const copyRenderCommand = async () => {
    const exportType =
      renderJob?.exportType ?? activeFormat.primaryExport;
    const command = renderCommand(
      activeTemplate.id,
      activeTemplate.version,
      activeFormat.id,
      exportType,
      props,
    );
    try {
      await navigator.clipboard.writeText(command);
      setToast('Developer render command copied.');
    } catch {
      setToast(command);
    }
  };

  const requestRender = async (
    exportType: InvitationExportType = activeFormat.primaryExport,
  ) => {
    if (!activeProject || errorCount > 0) {
      setActiveTab('review');
      setToast('Review the highlighted details before rendering.');
      return;
    }

    try {
      const response = await fetch('/api/renders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({projectId: activeProject.id, exportType}),
      });
      const body = (await response.json()) as {
        job?: RenderJob;
        error?: string;
      };
      if (!response.ok || !body.job) {
        throw new Error(body.error ?? 'The render could not be started.');
      }

      setRenderJob(body.job);
      setToast(
        `Your ${invitationExportLabels[exportType].label} is now being created.`,
      );
    } catch (error) {
      setToast(
        error instanceof Error
          ? error.message
          : 'The render could not be started.',
      );
    }
  };

  const saveLabel = storageError
    ? storageError
    : saveState === 'saving'
      ? 'Saving changes…'
      : saveState === 'offline'
        ? 'Saved in this browser'
        : 'All changes saved';

  const renderAction =
    renderJob?.status === 'completed' && renderJob.outputUrl ? (
      <a className={styles.primaryButton} download href={renderJob.outputUrl}>
        Download {invitationExportLabels[renderJob.exportType].label}
      </a>
    ) : (
      <button
        className={styles.primaryButton}
        disabled={isRendering}
        onClick={() => void requestRender(activeFormat.primaryExport)}
        type="button"
      >
        {isRendering
          ? `Creating ${renderJob?.progress ?? 0}%`
          : activeFormat.id === 'video'
            ? 'Export video'
            : activeFormat.id === 'animated'
              ? 'Export loop'
              : 'Export photo'}
      </button>
    );

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <button
          aria-label="Open project library"
          className={styles.brand}
          onClick={showLibrary}
          type="button"
        >
          <span className={styles.brandMark}>V</span>
          <span className={styles.brandCopy}>
            <strong>Vowframe</strong>
            <small>Invitation studio</small>
          </span>
        </button>

        {screen === 'editor' && activeProject ? (
          <div className={styles.projectIdentity}>
            <span>
              {activeFormat.shortLabel} · {activeTemplate.name} · V
              {activeTemplate.version}
            </span>
            <strong>{projectLabel(activeProject)}</strong>
          </div>
        ) : screen === 'guide' ? (
          <div className={styles.projectIdentity}>
            <span>New invitation</span>
            <strong>Design finder</strong>
          </div>
        ) : (
          <div
            className={`${styles.libraryStatus} ${
              serverState === 'offline' ? styles.libraryStatusOffline : ''
            }`}
          >
            <span className={styles.statusDot} />
            {serverState === 'checking'
              ? 'Checking local renderer…'
              : serverState === 'ready'
                ? 'Local rendering ready'
                : 'Browser draft mode'}
          </div>
        )}

        <div className={styles.headerActions}>
          {screen === 'editor' ? (
            <>
              <span
                className={`${styles.saveIndicator} ${
                  saveState === 'offline' ? styles.saveIndicatorOffline : ''
                }`}
              >
                <span className={styles.statusDot} />
                {saveLabel}
              </span>
              <button
                className={`${styles.secondaryButton} ${styles.duplicateButton}`}
                onClick={duplicateProject}
                type="button"
              >
                Duplicate
              </button>
              {renderAction}
            </>
          ) : screen === 'guide' ? (
            <button
              className={styles.secondaryButton}
              onClick={showLibrary}
              type="button"
            >
              Exit guide
            </button>
          ) : (
            <button
              className={styles.primaryButton}
              onClick={startGuide}
              type="button"
            >
              New invitation
            </button>
          )}
        </div>
      </header>

      {screen === 'library' ? (
        <main className={styles.library}>
          <section className={styles.libraryHero}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>
                Invitations, made personal
              </span>
              <h1>Make the first moment feel unforgettable.</h1>
              <p>
                Create a cinematic video, a seamless animated card, or a
                polished photo invite—all from the same original designs.
              </p>
              <div className={styles.heroActions}>
                <button
                  className={styles.heroButton}
                  onClick={startGuide}
                  type="button"
                >
                  Create your invitation
                  <span aria-hidden="true">→</span>
                </button>
                <span>Video · Animated · Photo</span>
              </div>
              <div className={styles.workflowStrip}>
                <div>
                  <span>01</span>
                  <strong>Add your story</strong>
                </div>
                <div>
                  <span>02</span>
                  <strong>Preview every scene</strong>
                </div>
                <div>
                  <span>03</span>
                  <strong>Export and share</strong>
                </div>
              </div>
            </div>

            <article className={styles.templateSpotlight}>
              <div className={styles.templateDetails}>
                <span className={styles.templateBadge}>Signature template</span>
                <div>
                  <p>Engagement collection</p>
                  <h2>{flagshipTemplate.name}</h2>
                  <span>{flagshipTemplate.description}</span>
                </div>
                <button
                  className={styles.spotlightButton}
                  onClick={() =>
                    void useTemplate(
                      FLAGSHIP_TEMPLATE_ID,
                      FLAGSHIP_TEMPLATE_VERSION,
                      {},
                      selectedLibraryFormat,
                    )
                  }
                  type="button"
                >
                  Use this design
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
              <div className={styles.templateVisual}>
                <img
                  alt={`${flagshipTemplate.name} engagement invitation`}
                  src={resolveTemplateAssetSrc(
                    flagshipTemplate.coverSrc,
                    TEMPLATE_ASSET_BASE_URL,
                  )}
                />
                <div className={styles.templateVisualCopy}>
                  <span>Save the date</span>
                  <strong>A <i>&</i> A</strong>
                  <small>20 · 07 · 2026</small>
                </div>
              </div>
            </article>
          </section>

          {hasSavedGuide && (guidedOccasion || guidedFormat) ? (
            <section
              aria-label="Resume unfinished invitation"
              className={styles.resumeGuide}
            >
              <span
                aria-hidden="true"
                className={styles.resumeGuideMarker}
              >
                {guidedOccasion?.marker ?? guidedFormat?.marker}
              </span>
              <div className={styles.resumeGuideCopy}>
                <span>
                  Unfinished setup · Step {guideStepIndex + 1} of{' '}
                  {guideSteps.length}
                </span>
                <h2>
                  Continue your{' '}
                  {guidedOccasion
                    ? guidedOccasion.label.toLowerCase()
                    : guidedFormat?.shortLabel.toLowerCase()}{' '}
                  invitation
                </h2>
                <p>{guidedResumeSummary}</p>
              </div>
              <div className={styles.resumeGuideActions}>
                <button
                  className={styles.resumeGuideRestart}
                  onClick={startGuide}
                  type="button"
                >
                  Start over
                </button>
                <button
                  className={styles.resumeGuideButton}
                  onClick={resumeGuide}
                  type="button"
                >
                  Continue setup
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </section>
          ) : null}

          <section className={styles.templateLibrarySection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>Design collection</span>
                <h2>Find a design for the moment</h2>
              </div>
              <span>10 original designs · 3 formats</span>
            </div>

            <div className={styles.libraryFormatPicker}>
              <div>
                <strong>Choose your format</strong>
                <span>
                  Every design below adapts to your selected output.
                </span>
              </div>
              <div
                aria-label="Choose invitation format"
                className={styles.formatTabs}
                role="group"
              >
                {invitationFormats.map((format) => (
                  <button
                    aria-pressed={selectedLibraryFormat === format.id}
                    className={
                      selectedLibraryFormat === format.id
                        ? styles.formatTabActive
                        : styles.formatTab
                    }
                    key={format.id}
                    onClick={() => setSelectedLibraryFormat(format.id)}
                    type="button"
                  >
                    <span aria-hidden="true">{format.marker}</span>
                    {format.shortLabel}
                  </button>
                ))}
              </div>
            </div>

            <div
              aria-label="Filter invitation templates"
              className={styles.templateFilters}
              role="group"
            >
              {invitationCategories.map((category) => (
                <button
                  aria-pressed={selectedCategory === category.id}
                  className={
                    selectedCategory === category.id
                      ? styles.templateFilterActive
                      : styles.templateFilter
                  }
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  type="button"
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className={styles.templateCatalogue}>
              {visibleTemplates.map((template) => {
                const templateCopy = resolveTemplateCopy(
                  template.id,
                  template.defaults,
                  template.version,
                );

                return (
                  <button
                    className={styles.catalogueCard}
                    key={`${template.id}-${template.version}`}
                    onClick={() =>
                      void useTemplate(
                        template.id,
                        template.version,
                        {},
                        selectedLibraryFormat,
                      )
                    }
                    style={
                      {
                        '--card-accent': template.accent,
                        '--card-surface': template.surface,
                        '--card-text': template.textColor,
                      } as React.CSSProperties
                    }
                    type="button"
                  >
                    <div className={styles.catalogueArt}>
                      <img
                        alt={`${template.name} ${template.categoryLabel.toLowerCase()} invitation`}
                        src={resolveTemplateAssetSrc(
                          template.coverSrc,
                          TEMPLATE_ASSET_BASE_URL,
                        )}
                      />
                      <span className={styles.catalogueCategory}>
                        {template.categoryLabel} · V{template.version}
                      </span>
                      <div className={styles.catalogueArtCopy}>
                        <small>{templateCopy.openingLine}</small>
                        <strong>
                          {templateProjectInitials(
                            template.id,
                            template.defaults,
                            template.version,
                          )}
                        </strong>
                        <span>{templateCopy.date}</span>
                      </div>
                    </div>
                    <div className={styles.catalogueBody}>
                      <div>
                        <strong>{template.name}</strong>
                        <p>{template.description}</p>
                      </div>
                      <span>
                        Create {getInvitationFormat(selectedLibraryFormat).shortLabel.toLowerCase()}{' '}
                        invite <i aria-hidden="true">→</i>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className={styles.projectsSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>Your workspace</span>
                <h2>Recent invitations</h2>
              </div>
              <span>
                {workspace.projects.length}{' '}
                {workspace.projects.length === 1 ? 'project' : 'projects'}
              </span>
            </div>

            {isLoadingProjects && workspace.projects.length === 0 ? (
              <div className={styles.emptyProjects}>
                <span className={styles.loadingOrb} />
                Loading your invitations…
              </div>
            ) : workspace.projects.length > 0 ? (
              <div className={styles.projectGrid}>
                {workspace.projects.map((project) => {
                  const projectTemplate = getInvitationTemplate(
                    project.templateId,
                    project.templateVersion,
                  );
                  const projectFormat = getInvitationFormat(project.format);

                  return (
                    <button
                      className={styles.projectCard}
                      key={project.id}
                      onClick={() => openProject(project.id)}
                      type="button"
                    >
                      <div className={styles.projectThumb}>
                        <img
                          alt=""
                          src={resolveTemplateAssetSrc(
                            projectTemplate.coverSrc,
                            TEMPLATE_ASSET_BASE_URL,
                          )}
                        />
                        <div style={{color: projectTemplate.textColor}}>
                          <span>
                            {projectTemplate.categoryLabel} ·{' '}
                            {projectFormat.shortLabel}
                          </span>
                          <strong>{projectInitials(project)}</strong>
                        </div>
                      </div>
                      <div className={styles.projectCardBody}>
                        <div>
                          <strong>{projectLabel(project)}</strong>
                          <span>
                            {projectFormat.shortLabel} · {projectTemplate.name} · V
                            {projectTemplate.version} · Updated{' '}
                            {formatProjectDate(project.updatedAt)}
                          </span>
                        </div>
                        <span className={styles.openProject} aria-hidden="true">
                          →
                        </span>
                      </div>
                    </button>
                  );
                })}
                <button
                  className={styles.newProjectCard}
                  onClick={startGuide}
                  type="button"
                >
                  <span>+</span>
                  <strong>Start another invitation</strong>
                  <small>Choose from ten original designs</small>
                </button>
              </div>
            ) : (
              <button
                className={styles.emptyProjects}
                onClick={startGuide}
                type="button"
              >
                <span className={styles.emptyPlus}>+</span>
                <strong>Create your first invitation</strong>
                <small>
                  Your saved projects and finished renders will appear here.
                </small>
              </button>
            )}
          </section>
        </main>
      ) : screen === 'guide' ? (
        <main className={styles.guide}>
          <div className={styles.guideShell}>
            <div className={styles.guideTopbar}>
              <button
                className={styles.guideBack}
                onClick={goBackInGuide}
                type="button"
              >
                <span aria-hidden="true">←</span>
                {guideStep === 'format' ? 'Gallery' : 'Back'}
              </button>

              <ol
                aria-label="Invitation setup progress"
                className={styles.guideProgress}
              >
                {guideSteps.map((step, index) => {
                  const isCurrent = index === guideStepIndex;
                  const isComplete = index < guideStepIndex;

                  return (
                    <li
                      aria-current={isCurrent ? 'step' : undefined}
                      className={
                        isCurrent
                          ? styles.guideProgressCurrent
                          : isComplete
                            ? styles.guideProgressComplete
                            : styles.guideProgressStep
                      }
                      key={step.id}
                    >
                      <span>{isComplete ? '✓' : index + 1}</span>
                      <strong>{step.label}</strong>
                    </li>
                  );
                })}
              </ol>

              <span className={styles.guideCounter}>
                0{guideStepIndex + 1} / 0{guideSteps.length}
              </span>
            </div>

            <section
              aria-labelledby="guide-title"
              className={styles.guideCard}
            >
              {guideStep === 'format' ? (
                <>
                  <div className={styles.guideIntro}>
                    <span className={styles.guideKicker}>
                      Start with how you’ll share it
                    </span>
                    <h1 id="guide-title">What would you like to create?</h1>
                    <p>
                      Choose the output first. The same design collection adapts
                      to every format, and we’ll only show editing tools that
                      matter for your choice.
                    </p>
                  </div>

                  <div
                    aria-label="Choose an invitation format"
                    className={styles.guideFormatGrid}
                    role="group"
                  >
                    {invitationFormats.map((format) => {
                      const isSelected = guidedBrief.format === format.id;

                      return (
                        <button
                          aria-pressed={isSelected}
                          className={
                            isSelected
                              ? styles.guideFormatSelected
                              : styles.guideFormat
                          }
                          key={format.id}
                          onClick={() =>
                            setGuidedBrief((current) => ({
                              ...current,
                              format: format.id,
                            }))
                          }
                          type="button"
                        >
                          <span
                            aria-hidden="true"
                            className={styles.guideFormatMarker}
                          >
                            {format.marker}
                          </span>
                          <div>
                            <strong>{format.label}</strong>
                            <p>{format.description}</p>
                          </div>
                          <small>
                            {format.durationLabel} · {format.detail}
                          </small>
                          <i aria-hidden="true">
                            {isSelected ? '✓' : '→'}
                          </i>
                        </button>
                      );
                    })}
                  </div>

                  <div className={styles.guideActions}>
                    <span>You can create another format from any design later.</span>
                    <button
                      className={styles.guidePrimary}
                      disabled={!guidedBrief.format}
                      onClick={() => setGuideStep('occasion')}
                      type="button"
                    >
                      Continue
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </>
              ) : null}

              {guideStep === 'occasion' ? (
                <>
                  <div className={styles.guideIntro}>
                    <span className={styles.guideKicker}>
                      Start with the moment
                    </span>
                    <h1 id="guide-title">What are you celebrating?</h1>
                    <p>
                      We’ll narrow the collection to designs that understand
                      the shape and spirit of your occasion.
                    </p>
                  </div>

                  <div
                    aria-label="Choose an occasion"
                    className={styles.guideOccasionGrid}
                    role="group"
                  >
                    {guidedOccasions.map((occasion) => {
                      const isSelected =
                        guidedBrief.occasion === occasion.id;

                      return (
                        <button
                          aria-pressed={isSelected}
                          className={
                            isSelected
                              ? styles.guideChoiceSelected
                              : styles.guideChoice
                          }
                          key={occasion.id}
                          onClick={() =>
                            setGuidedBrief((current) => ({
                              ...current,
                              occasion: occasion.id,
                            }))
                          }
                          type="button"
                        >
                          <span className={styles.guideChoiceMarker}>
                            {occasion.marker}
                          </span>
                          <strong>{occasion.label}</strong>
                          <small>{occasion.description}</small>
                          <i aria-hidden="true">
                            {isSelected ? '✓' : '→'}
                          </i>
                        </button>
                      );
                    })}
                  </div>

                  <div className={styles.guideActions}>
                    <span>
                      You can still browse every design before choosing.
                    </span>
                    <button
                      className={styles.guidePrimary}
                      disabled={!guidedBrief.occasion}
                      onClick={() => setGuideStep('details')}
                      type="button"
                    >
                      Continue
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </>
              ) : null}

              {guideStep === 'details' && guidedDetails ? (
                <>
                  <div className={styles.guideIntro}>
                    <span className={styles.guideContext}>
                      {guidedOccasion?.marker} {guidedOccasion?.label}
                    </span>
                    <h1 id="guide-title">Make it unmistakably yours.</h1>
                    <p>
                      Add the details guests need. We’ll place them into every
                      recommended design, ready for you to refine later.
                    </p>
                  </div>

                  <div className={styles.guideDetailsForm}>
                    <div
                      className={`${styles.guideDetailField} ${
                        guidedDetails.secondaryLabel
                          ? ''
                          : styles.guideDetailFieldWide
                      }`}
                    >
                      <label htmlFor="guide-primary-name">
                        <span>{guidedDetails.primaryLabel}</span>
                        <small>Required</small>
                      </label>
                      <input
                        autoComplete="name"
                        id="guide-primary-name"
                        maxLength={guidedDetails.primaryMaxLength}
                        onChange={(event) =>
                          setGuidedBrief((current) => ({
                            ...current,
                            primaryName: event.target.value,
                          }))
                        }
                        placeholder={guidedDetails.primaryPlaceholder}
                        required
                        type="text"
                        value={guidedBrief.primaryName}
                      />
                    </div>

                    {guidedDetails.secondaryLabel ? (
                      <div className={styles.guideDetailField}>
                        <label htmlFor="guide-secondary-name">
                          <span>{guidedDetails.secondaryLabel}</span>
                          <small>
                            {guidedDetails.secondaryRequired
                              ? 'Required'
                              : 'Optional'}
                          </small>
                        </label>
                        <input
                          autoComplete="name"
                          id="guide-secondary-name"
                          maxLength={guidedDetails.secondaryMaxLength}
                          onChange={(event) =>
                            setGuidedBrief((current) => ({
                              ...current,
                              secondaryName: event.target.value,
                            }))
                          }
                          placeholder={
                            guidedDetails.secondaryPlaceholder
                          }
                          required={guidedDetails.secondaryRequired}
                          type="text"
                          value={guidedBrief.secondaryName}
                        />
                      </div>
                    ) : null}

                    <div className={styles.guideDetailField}>
                      <label htmlFor="guide-date">
                        <span>{guidedDetails.dateLabel}</span>
                        <small>Required</small>
                      </label>
                      <input
                        id="guide-date"
                        maxLength={guidedDetails.dateMaxLength}
                        onChange={(event) =>
                          setGuidedBrief((current) => ({
                            ...current,
                            date: event.target.value,
                          }))
                        }
                        placeholder={guidedDetails.datePlaceholder}
                        required
                        type="text"
                        value={guidedBrief.date}
                      />
                    </div>

                    <div className={styles.guideDetailField}>
                      <label htmlFor="guide-venue">
                        <span>{guidedDetails.venueLabel}</span>
                        <small>Required</small>
                      </label>
                      <input
                        id="guide-venue"
                        maxLength={guidedDetails.venueMaxLength}
                        onChange={(event) =>
                          setGuidedBrief((current) => ({
                            ...current,
                            venue: event.target.value,
                          }))
                        }
                        placeholder={guidedDetails.venuePlaceholder}
                        required
                        type="text"
                        value={guidedBrief.venue}
                      />
                    </div>

                    <div
                      className={`${styles.guideDetailField} ${styles.guideDetailFieldWide}`}
                    >
                      <label htmlFor="guide-host-line">
                        <span>{guidedDetails.hostLabel}</span>
                        <small>Optional</small>
                      </label>
                      <input
                        id="guide-host-line"
                        maxLength={guidedDetails.hostMaxLength}
                        onChange={(event) =>
                          setGuidedBrief((current) => ({
                            ...current,
                            hostLine: event.target.value,
                          }))
                        }
                        placeholder={guidedDetails.hostPlaceholder}
                        type="text"
                        value={guidedBrief.hostLine}
                      />
                    </div>
                  </div>

                  <div className={styles.guideDetailsNote}>
                    <span aria-hidden="true">✓</span>
                    <p>
                      <strong>Prefilled, not permanent.</strong> Every line can
                      still be edited after you choose a design.
                    </p>
                  </div>

                  <div className={styles.guideActions}>
                    <span>Your progress is saved automatically on this device.</span>
                    <button
                      className={styles.guidePrimary}
                      disabled={!guidedDetailsComplete}
                      onClick={() => setGuideStep('style')}
                      type="button"
                    >
                      Choose the style
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </>
              ) : null}

              {guideStep === 'style' ? (
                <>
                  <div className={styles.guideIntro}>
                    <span className={styles.guideContext}>
                      {guidedOccasion?.marker} {guidedOccasion?.label}
                    </span>
                    <h1 id="guide-title">What should it feel like?</h1>
                    <p>
                      Choose a visual direction and how personal you want the
                      reveal to be. Both can be changed later.
                    </p>
                  </div>

                  <div className={styles.guideQuestion}>
                    <div className={styles.guideQuestionHeading}>
                      <span>01</span>
                      <div>
                        <h2>Choose a mood</h2>
                        <p>The feeling you want guests to notice first.</p>
                      </div>
                    </div>
                    <div
                      aria-label="Choose a visual mood"
                      className={styles.guideToneGrid}
                      role="group"
                    >
                      {invitationToneOptions.map((tone) => {
                        const isSelected = guidedBrief.tone === tone.id;

                        return (
                          <button
                            aria-pressed={isSelected}
                            className={
                              isSelected
                                ? styles.guideToneSelected
                                : styles.guideTone
                            }
                            key={tone.id}
                            onClick={() =>
                              setGuidedBrief((current) => ({
                                ...current,
                                tone: tone.id,
                              }))
                            }
                            type="button"
                          >
                            <strong>{tone.label}</strong>
                            <span>{tone.description}</span>
                            {isSelected ? (
                              <i aria-hidden="true">✓</i>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.guideQuestion}>
                    <div className={styles.guideQuestionHeading}>
                      <span>02</span>
                      <div>
                        <h2>Plan the image treatment</h2>
                        <p>
                          Choose whether a portrait or the design takes centre
                          stage.
                        </p>
                      </div>
                    </div>
                    <div
                      aria-label="Choose a photo preference"
                      className={styles.guidePhotoGrid}
                      role="group"
                    >
                      {photoPreferenceOptions.map((preference) => {
                        const isSelected =
                          guidedBrief.photoPreference === preference.id;

                        return (
                          <button
                            aria-pressed={isSelected}
                            className={
                              isSelected
                                ? styles.guidePhotoSelected
                                : styles.guidePhoto
                            }
                            key={preference.id}
                            onClick={() =>
                              setGuidedBrief((current) => ({
                                ...current,
                                photoPreference: preference.id,
                              }))
                            }
                            type="button"
                          >
                            <span aria-hidden="true">
                              {preference.id === 'portrait'
                                ? '▧'
                                : preference.id === 'designed'
                                  ? '◇'
                                  : '◐'}
                            </span>
                            <div>
                              <strong>{preference.label}</strong>
                              <small>{preference.description}</small>
                            </div>
                            {isSelected ? (
                              <i aria-hidden="true">✓</i>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.guideActions}>
                    <span>Recommendations use transparent, fixed rules.</span>
                    <button
                      className={styles.guidePrimary}
                      disabled={
                        !guidedBrief.tone ||
                        !guidedBrief.photoPreference
                      }
                      onClick={() => setGuideStep('recommendations')}
                      type="button"
                    >
                      Find my designs
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </>
              ) : null}

              {guideStep === 'recommendations' ? (
                <>
                  <div className={styles.guideResultsIntro}>
                    <div>
                      <span className={styles.guideKicker}>
                        {getInvitationFormat(guidedBrief.format).shortLabel}{' '}
                        designs for your{' '}
                        {guidedOccasion?.label.toLowerCase()}
                      </span>
                      <h1 id="guide-title">Your strongest matches</h1>
                      <p>
                        Ranked by your format, mood, and image preference.
                        Every recommendation remains fully editable.
                      </p>
                    </div>
                    <span>
                      {recommendations.length}{' '}
                      {recommendations.length === 1 ? 'design' : 'designs'}
                    </span>
                  </div>

                  <div
                    aria-live="polite"
                    className={styles.guideRecommendationGrid}
                  >
                    {recommendations.map((recommendation, index) => {
                      const {template} = recommendation;
                      const personalizedProps = {
                        ...template.defaults,
                        ...guidedTemplateProps(
                          guidedBrief,
                          template.id,
                          template.version,
                        ),
                      };

                      return (
                        <article
                          className={styles.guideRecommendation}
                          key={`${template.id}-${template.version}`}
                          style={
                            {
                              '--recommendation-accent': template.accent,
                              '--recommendation-surface': template.surface,
                              '--recommendation-text': template.textColor,
                            } as React.CSSProperties
                          }
                        >
                          <div className={styles.guideRecommendationArt}>
                            <img
                              alt={`${template.name} ${template.categoryLabel.toLowerCase()} invitation`}
                              src={resolveTemplateAssetSrc(
                                template.coverSrc,
                                TEMPLATE_ASSET_BASE_URL,
                              )}
                            />
                            <span>
                              {index === 0 ? 'Best match' : 'Also selected'}
                            </span>
                            <div>
                              <small>{template.categoryLabel}</small>
                              <strong>
                                {templateProjectInitials(
                                  template.id,
                                  personalizedProps,
                                  template.version,
                                )}
                              </strong>
                            </div>
                          </div>

                          <div className={styles.guideRecommendationBody}>
                            <div className={styles.guideRecommendationMeta}>
                              <span>
                                {
                                  getInvitationFormat(guidedBrief.format)
                                    .durationLabel
                                }{' '}
                                · 9:16
                              </span>
                              <span>
                                {guidedBrief.photoPreference === 'portrait'
                                  ? 'Portrait start'
                                  : guidedBrief.photoPreference === 'designed'
                                    ? 'No-photo start'
                                    : template.defaults.showPhoto
                                      ? 'Portrait-led'
                                      : 'Designed reveal'}
                              </span>
                            </div>
                            <div>
                              <h2>{template.name}</h2>
                              <p>{template.description}</p>
                            </div>
                            <div className={styles.guideMatchReason}>
                              <span>
                                {recommendation.toneMatch
                                  ? 'Tone match'
                                  : 'Curated alternative'}
                              </span>
                              <p>{recommendation.reason}</p>
                            </div>
                            <button
                              className={styles.guideUseDesign}
                              onClick={() =>
                                void useRecommendedTemplate(
                                  template.id,
                                  template.version,
                                  template.defaults.showPhoto,
                                )
                              }
                              type="button"
                            >
                              Start{' '}
                              {getInvitationFormat(
                                guidedBrief.format,
                              ).shortLabel.toLowerCase()}{' '}
                              with {template.name}
                              <span aria-hidden="true">→</span>
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className={styles.guideResultActions}>
                    <button
                      className={styles.guideSecondary}
                      onClick={() => setGuideStep('style')}
                      type="button"
                    >
                      Refine my answers
                    </button>
                    <button
                      className={styles.guideBrowse}
                      onClick={browseGuidedCategory}
                      type="button"
                    >
                      Browse every {guidedOccasion?.label.toLowerCase()} design
                      <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </>
              ) : null}
            </section>
          </div>
        </main>
      ) : (
        <main className={styles.workspace}>
          <nav aria-label="Editor tools" className={styles.toolRail}>
            {visibleEditorTabs.map((tab) => (
              <button
                aria-current={activeTab === tab.id ? 'page' : undefined}
                className={
                  activeTab === tab.id
                    ? styles.toolButtonActive
                    : styles.toolButton
                }
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <span>{tab.marker}</span>
                <small>{tab.label}</small>
                {tab.id === 'review' && errorCount > 0 ? (
                  <i>{errorCount}</i>
                ) : null}
              </button>
            ))}
          </nav>

          <aside className={styles.inspector}>
            <div className={styles.inspectorHeader}>
              <span>
                {activeTab === 'story'
                  ? activeFormat.id === 'video'
                    ? 'Invitation story'
                    : 'Invitation copy'
                  : activeTab === 'media'
                    ? 'Photo moment'
                    : activeTab === 'sound'
                      ? 'Soundtrack'
                      : 'Review & export'}
              </span>
              <p>
                {activeTab === 'story'
                  ? 'Shape the words your guests will see.'
                  : activeTab === 'media'
                    ? 'Choose the portrait and refine its crop.'
                    : activeTab === 'sound'
                      ? 'Set the tone for the full invitation.'
                      : `Check every detail before creating the ${activeFormat.shortLabel.toLowerCase()} invite.`}
              </p>
            </div>

            <div className={styles.inspectorBody}>
              {activeTab === 'story' ? (
                <>
                  <section className={styles.formSection}>
                    <div className={styles.formSectionTitle}>
                      <span>01</span>
                      <div>
                        <strong>People & names</strong>
                        <small>Who this moment belongs to</small>
                      </div>
                    </div>
                    <div className={styles.fieldGrid}>
                      {activeTemplate.fields
                        .filter((field) => field.group === 'people')
                        .map((field) => (
                          <TextField
                            error={errors[field.key]}
                            field={field}
                            key={field.key}
                            onChange={(key, value) =>
                              updateProps({[key]: value})
                            }
                            value={props[field.key] ?? ''}
                          />
                        ))}
                    </div>
                  </section>

                  <section className={styles.formSection}>
                    <div className={styles.formSectionTitle}>
                      <span>02</span>
                      <div>
                        <strong>The occasion</strong>
                        <small>Date, event, venue, and host</small>
                      </div>
                    </div>
                    <div className={styles.fieldGrid}>
                      {activeTemplate.fields
                        .filter((field) => field.group === 'occasion')
                        .map((field) => (
                          <TextField
                            error={errors[field.key]}
                            field={field}
                            key={field.key}
                            onChange={(key, value) =>
                              updateProps({[key]: value})
                            }
                            value={props[field.key] ?? ''}
                          />
                        ))}
                    </div>
                  </section>
                </>
              ) : null}

              {activeTab === 'media' ? (
                <section className={styles.mediaSection}>
                  <div className={styles.photoPreview}>
                    {details.photoSrc ? (
                      <img
                        alt="Selected couple"
                        src={browserMediaSource(details.photoSrc)}
                        style={{
                          objectPosition: `50% ${details.photoFocalPoint}%`,
                        }}
                      />
                    ) : (
                      <span>No photo selected</span>
                    )}
                    <div>
                      <span>
                        {activeFormat.id === 'video'
                          ? 'Scene 03'
                          : 'Image treatment'}
                      </span>
                      <strong>
                        {activeFormat.id === 'video'
                          ? 'Portrait reveal'
                          : 'Featured portrait'}
                      </strong>
                    </div>
                  </div>

                  <div className={styles.uploadRow}>
                    <div>
                      <strong>
                        {details.photoSrc?.startsWith('uploads/') ||
                        details.photoSrc?.startsWith('data:')
                          ? 'Your portrait'
                          : 'Sample portrait'}
                      </strong>
                      <span>JPG, PNG, or WebP · maximum 5 MB</span>
                    </div>
                    <label
                      className={styles.uploadButton}
                      htmlFor="invite-photo"
                    >
                      Replace photo
                    </label>
                    <input
                      accept="image/png,image/jpeg,image/webp"
                      className={styles.fileInput}
                      id="invite-photo"
                      onChange={(event) =>
                        handleImage(event.target.files?.[0])
                      }
                      type="file"
                    />
                  </div>

                  <div className={styles.controlCard}>
                    <div className={styles.controlHeading}>
                      <div>
                        <strong>Vertical focal point</strong>
                        <span>Keep faces centred inside the reveal frame.</span>
                      </div>
                      <b>{details.photoFocalPoint}%</b>
                    </div>
                    <input
                      aria-label="Photo vertical focal point"
                      className={styles.rangeInput}
                      max="100"
                      min="0"
                      onChange={(event) =>
                        updateProps({
                          photoFocalPoint: Number(event.target.value),
                        })
                      }
                      type="range"
                      value={details.photoFocalPoint}
                    />
                  </div>

                  <div className={styles.controlCard}>
                    <div className={styles.toggleRow}>
                      <div>
                        <strong>Show portrait</strong>
                        <span>
                          Turn this off for a designed monogram moment.
                        </span>
                      </div>
                      <label className={styles.switch}>
                        <input
                          checked={details.showPhoto}
                          onChange={(event) =>
                            updateProps({showPhoto: event.target.checked})
                          }
                          type="checkbox"
                        />
                        <span />
                      </label>
                    </div>
                  </div>
                  {errors.photoSrc ? (
                    <p className={styles.inlineError}>{errors.photoSrc}</p>
                  ) : null}
                </section>
              ) : null}

              {activeTab === 'sound' && activeFormat.id === 'video' ? (
                <section className={styles.soundSection}>
                  <div className={styles.nowPlaying}>
                    <div className={styles.albumMark}>♪</div>
                    <div>
                      <span>Selected soundtrack</span>
                      <strong>
                        {hasUploadedMusic
                          ? details.musicUploadName
                          : (selectedMusicTrack?.name ?? 'Silent by design')}
                      </strong>
                      <small>
                        {hasUploadedMusic
                          ? `${formatAudioTime(details.musicTrimStartSeconds)}–${formatAudioTime(uploadedMusicTrimEnd)} · your upload`
                          : (selectedMusicTrack?.description ??
                            'A crisp, editorial film without audio')}
                      </small>
                    </div>
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>

                  {selectedMusicTrack ? (
                    <audio
                      aria-label={`Preview ${selectedMusicTrack.name}`}
                      className={styles.audioPreview}
                      controls
                      key={selectedMusicTrack.src}
                      preload="metadata"
                      src={browserMediaSource(selectedMusicTrack.src)}
                    />
                  ) : null}

                  <div
                    className={
                      hasUploadedMusic
                        ? styles.customMusicCardActive
                        : styles.customMusicCard
                    }
                  >
                    <div className={styles.customMusicHeading}>
                      <div>
                        <span>Your music</span>
                        <strong>Upload and choose the moment</strong>
                        <small>
                          MP3, M4A, or WAV · up to 50 MB and 10 minutes
                        </small>
                      </div>
                      <label className={styles.rightsCheck}>
                        <input
                          checked={
                            musicRightsChecked ||
                            details.musicRightsConfirmed
                          }
                          onChange={(event) =>
                            setMusicRightsChecked(event.target.checked)
                          }
                          type="checkbox"
                        />
                        <span>
                          I own this track or have permission to use it.
                        </span>
                      </label>
                    </div>

                    <div className={styles.customMusicUpload}>
                      <span>
                        {hasUploadedMusic
                          ? details.musicUploadName
                          : 'No personal track uploaded'}
                      </span>
                      <label
                        aria-disabled={
                          isUploadingMusic ||
                          (!musicRightsChecked &&
                            !details.musicRightsConfirmed)
                        }
                        className={styles.uploadButton}
                        htmlFor="invite-music"
                      >
                        {isUploadingMusic
                          ? 'Checking…'
                          : hasUploadedMusic
                            ? 'Replace music'
                            : 'Choose music'}
                      </label>
                      <input
                        accept=".mp3,.m4a,.wav,audio/mpeg,audio/mp4,audio/wav"
                        className={styles.fileInput}
                        disabled={
                          isUploadingMusic ||
                          (!musicRightsChecked &&
                            !details.musicRightsConfirmed)
                        }
                        id="invite-music"
                        onChange={(event) => {
                          const input = event.currentTarget;
                          void handleMusicUpload(input.files?.[0]);
                          input.value = '';
                        }}
                        type="file"
                      />
                    </div>

                    {hasUploadedMusic && details.musicSrc ? (
                      <div className={styles.musicTrimmer}>
                        <audio
                          className={styles.fileInput}
                          key={details.musicSrc}
                          onEnded={() => setIsMusicPreviewPlaying(false)}
                          onLoadedMetadata={() => {
                            if (uploadedAudioRef.current) {
                              uploadedAudioRef.current.currentTime =
                                details.musicTrimStartSeconds;
                              uploadedAudioRef.current.volume =
                                details.musicVolume;
                            }
                          }}
                          onPause={() => setIsMusicPreviewPlaying(false)}
                          onPlay={() => setIsMusicPreviewPlaying(true)}
                          onTimeUpdate={syncUploadedMusicPreview}
                          preload="metadata"
                          ref={uploadedAudioRef}
                          src={browserMediaSource(details.musicSrc)}
                        />

                        <div
                          aria-label={`Waveform for ${details.musicUploadName}`}
                          className={styles.musicWaveform}
                          role="img"
                        >
                          {visibleMusicWaveform.map((height, index) => {
                            const barTime =
                              visibleMusicWaveform.length === 1
                                ? 0
                                : (index /
                                    (visibleMusicWaveform.length - 1)) *
                                  uploadedMusicDuration;
                            const isSelected =
                              barTime >= details.musicTrimStartSeconds &&
                              barTime <= uploadedMusicTrimEnd;
                            return (
                              <i
                                className={
                                  isSelected
                                    ? styles.musicWaveformBarActive
                                    : styles.musicWaveformBar
                                }
                                key={index}
                                style={{height: `${height * 100}%`}}
                              />
                            );
                          })}
                        </div>

                        <div className={styles.trimTimeRow}>
                          <span>
                            Start{' '}
                            <strong>
                              {formatAudioTime(
                                details.musicTrimStartSeconds,
                              )}
                            </strong>
                          </span>
                          <span>
                            End{' '}
                            <strong>
                              {formatAudioTime(uploadedMusicTrimEnd)}
                            </strong>
                          </span>
                        </div>
                        <input
                          aria-label="Soundtrack start time"
                          className={styles.trimRange}
                          disabled={maximumMusicTrimStart === 0}
                          max={maximumMusicTrimStart}
                          min={0}
                          onChange={(event) =>
                            updateProps({
                              musicTrimStartSeconds: Number(
                                event.target.value,
                              ),
                            })
                          }
                          step={0.1}
                          type="range"
                          value={details.musicTrimStartSeconds}
                        />

                        <div className={styles.customMusicControls}>
                          <button
                            onClick={() => {
                              playerRef.current?.pause();
                              void toggleUploadedMusicPreview();
                            }}
                            type="button"
                          >
                            {isMusicPreviewPlaying
                              ? 'Pause selection'
                              : 'Preview selection'}
                          </button>
                          <label>
                            <span>
                              Music level{' '}
                              <strong>
                                {Math.round(details.musicVolume * 100)}%
                              </strong>
                            </span>
                            <input
                              aria-label="Uploaded music volume"
                              max={1}
                              min={0}
                              onChange={(event) =>
                                updateProps({
                                  musicVolume: Number(event.target.value),
                                })
                              }
                              step={0.05}
                              type="range"
                              value={details.musicVolume}
                            />
                          </label>
                        </div>
                        <small className={styles.trimHint}>
                          {uploadedMusicDuration <=
                          MUSIC_CLIP_DURATION_SECONDS
                            ? 'The full track is used; any remaining invitation time stays quiet.'
                            : 'The highlighted 30 seconds are used in preview and export.'}
                        </small>
                      </div>
                    ) : null}
                  </div>

                  <div className={styles.choiceList}>
                    {rankedMusicTracks.map((track) => (
                      <label
                        className={
                          details.musicSrc === track.src
                            ? styles.choiceCardActive
                            : styles.choiceCard
                        }
                        key={track.id}
                      >
                        <input
                          checked={details.musicSrc === track.src}
                          name="music"
                          onChange={() =>
                            updateProps({
                              musicSrc: track.src,
                              musicUploadName: null,
                              musicDurationSeconds: track.durationSeconds,
                              musicTrimStartSeconds: 0,
                              musicVolume: 1,
                              musicRightsConfirmed: false,
                            })
                          }
                          type="radio"
                        />
                        <span className={styles.radioVisual} />
                        <div>
                          <strong>{track.name}</strong>
                          <span>
                            {track.description}
                            {track.src === activeTemplate.defaults.musicSrc
                              ? ' Recommended for this design.'
                              : ''}
                          </span>
                          <small>
                            {track.style} · {track.bpm} BPM · {track.energy}{' '}
                            energy
                          </small>
                        </div>
                        <small>00:30</small>
                      </label>
                    ))}

                    <label
                      className={
                        !details.musicSrc
                          ? styles.choiceCardActive
                          : styles.choiceCard
                      }
                    >
                      <input
                        checked={!details.musicSrc}
                        name="music"
                        onChange={() =>
                          updateProps({
                            musicSrc: null,
                            musicUploadName: null,
                            musicDurationSeconds: null,
                            musicTrimStartSeconds: 0,
                            musicVolume: 1,
                            musicRightsConfirmed: false,
                          })
                        }
                        type="radio"
                      />
                      <span className={styles.radioVisual} />
                      <div>
                        <strong>No soundtrack</strong>
                        <span>Export the invitation without audio.</span>
                      </div>
                      <small>Silent</small>
                    </label>
                  </div>

                  <div className={styles.soundNote}>
                    <span>Mixing</span>
                    <p>
                      Library cues are original, sample-free stereo masters.
                      Uploaded music uses your selected start and level.
                      Every soundtrack fades automatically below the visual
                      story.
                    </p>
                  </div>
                </section>
              ) : null}

              {activeTab === 'review' ? (
                <section className={styles.reviewSection}>
                  <div
                    className={
                      errorCount > 0
                        ? styles.reviewSummaryWarning
                        : styles.reviewSummary
                    }
                  >
                    <span>{errorCount > 0 ? errorCount : '✓'}</span>
                    <div>
                      <strong>
                        {errorCount > 0
                          ? `${errorCount} ${
                              errorCount === 1 ? 'detail needs' : 'details need'
                            } attention`
                          : `Ready to create your ${activeFormat.shortLabel.toLowerCase()} invite`}
                      </strong>
                      <p>
                        {errorCount > 0
                          ? 'Return to Story to complete the highlighted fields.'
                          : activeFormat.id === 'video'
                            ? 'Your invitation is complete and ready for a high-quality MP4 render.'
                            : activeFormat.id === 'animated'
                              ? 'Your invitation is ready as a smooth looping MP4 or a shareable GIF.'
                              : 'Your invitation is ready as a high-resolution PNG.'}
                      </p>
                    </div>
                  </div>

                  <div className={styles.checklist}>
                    <div>
                      <span className={errorCount === 0 ? styles.checkGood : ''}>
                        {errorCount === 0 ? '✓' : '!'}
                      </span>
                      <div>
                        <strong>Invitation details</strong>
                        <small>
                          {errorCount === 0
                            ? 'All required copy is complete'
                            : 'Review missing or invalid copy'}
                        </small>
                      </div>
                    </div>
                    <div>
                      <span className={styles.checkGood}>✓</span>
                      <div>
                        <strong>Photo treatment</strong>
                        <small>
                          {details.showPhoto
                            ? 'Portrait reveal enabled'
                            : 'Illustrated reveal enabled'}
                        </small>
                      </div>
                    </div>
                    {activeFormat.id === 'video' ? (
                      <div>
                        <span className={styles.checkGood}>✓</span>
                        <div>
                          <strong>Soundtrack</strong>
                          <small>
                            {details.musicSrc
                              ? `${
                                  hasUploadedMusic
                                    ? details.musicUploadName
                                    : (selectedMusicTrack?.name ?? 'Soundtrack')
                                } selected`
                              : 'Silent export selected'}
                          </small>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className={styles.checkGood}>✓</span>
                        <div>
                          <strong>Share format</strong>
                          <small>
                            {activeFormat.id === 'animated'
                              ? 'Looping MP4 and GIF available'
                              : 'High-resolution PNG selected'}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.exportCard}>
                    <div className={styles.exportSpec}>
                      <span>Format</span>
                      <strong>
                        {
                          invitationExportLabels[
                            renderJob?.exportType ??
                              activeFormat.primaryExport
                          ].specification
                        }
                      </strong>
                    </div>
                    <div className={styles.exportSpec}>
                      <span>Canvas</span>
                      <strong>
                        {activeFormat.id === 'animated'
                          ? '1080 × 1920 · GIF 540 × 960'
                          : activeFormat.canvasLabel}
                      </strong>
                    </div>
                    <div className={styles.exportSpec}>
                      <span>Duration</span>
                      <strong>{activeFormat.durationLabel}</strong>
                    </div>
                    {renderJob ? (
                      <div className={styles.renderProgress}>
                        <div>
                          <span>
                            {renderJob.status === 'completed'
                              ? 'Export complete'
                              : renderJob.status === 'failed'
                                ? 'Export failed'
                                : 'Creating your invitation'}
                          </span>
                          <strong>{renderJob.progress}%</strong>
                        </div>
                        <span>
                          <i
                            style={{width: `${renderJob.progress}%`}}
                          />
                        </span>
                        {renderJob.error ? <small>{renderJob.error}</small> : null}
                      </div>
                    ) : null}
                    <div className={styles.exportAction}>
                      {renderAction}
                      {activeFormat.id === 'animated' ? (
                        <button
                          className={styles.secondaryButton}
                          disabled={isRendering}
                          onClick={() =>
                            void requestRender(
                              renderJob?.status === 'completed' &&
                                renderJob.exportType === 'gif'
                                ? 'mp4'
                                : 'gif',
                            )
                          }
                          type="button"
                        >
                          {renderJob?.status === 'completed' &&
                          renderJob.exportType === 'gif'
                            ? 'Create MP4 loop'
                            : 'Create GIF'}
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <details className={styles.developerDetails}>
                    <summary>Developer export options</summary>
                    <p>
                      Copy the equivalent Remotion command for a terminal-based
                      render.
                    </p>
                    <button onClick={copyRenderCommand} type="button">
                      Copy render command
                    </button>
                  </details>
                </section>
              ) : null}
            </div>
          </aside>

          <section className={styles.stage}>
            <div className={styles.stageToolbar}>
              <div>
                <strong>Live preview</strong>
                <span>
                  {renderJob
                    ? `${renderJob.status} · ${renderJob.progress}%`
                    : 'Updates as you type'}
                </span>
              </div>
              <div className={styles.previewSpecs}>
                <span>9:16 portrait</span>
                <span>{activeFormat.durationLabel}</span>
              </div>
            </div>

            <div className={styles.canvas}>
              <div className={styles.canvasGlow} />
              <div className={styles.phoneFrame}>
                <span className={styles.phoneNotch} />
                {activeFormat.id === 'video' ? (
                  <Player
                    acknowledgeRemotionLicense
                    className={styles.player}
                    component={CatalogInvitation}
                    compositionHeight={1920}
                    compositionWidth={1080}
                    controls
                    durationInFrames={900}
                    fps={30}
                    inputProps={{
                      ...props,
                      templateId: activeTemplate.id,
                      templateVersion: activeTemplate.version,
                      assetBaseUrl: TEMPLATE_ASSET_BASE_URL,
                    }}
                    loop
                    ref={playerRef}
                    style={{height: '100%', width: '100%'}}
                  />
                ) : (
                  <Player
                    acknowledgeRemotionLicense
                    className={styles.player}
                    component={ShareableInvitation}
                    compositionHeight={1920}
                    compositionWidth={1080}
                    controls={activeFormat.id === 'animated'}
                    durationInFrames={previewDurationInFrames}
                    fps={30}
                    inputProps={{
                      ...props,
                      templateId: activeTemplate.id,
                      templateVersion: activeTemplate.version,
                      format: activeFormat.id,
                      assetBaseUrl: TEMPLATE_ASSET_BASE_URL,
                    }}
                    loop={activeFormat.id === 'animated'}
                    ref={playerRef}
                    style={{height: '100%', width: '100%'}}
                  />
                )}
              </div>
            </div>

            <div className={styles.timeline}>
              <div className={styles.timelineHeader}>
                <div>
                  <strong>
                    {activeFormat.id === 'video'
                      ? 'Scenes'
                      : activeFormat.id === 'animated'
                        ? 'Loop'
                        : 'Static card'}
                  </strong>
                  <span>
                    {activeFormat.id === 'photo'
                      ? 'Every detail stays visible in the final PNG'
                      : `${previewScenes[activePreviewSceneIndex]?.label ?? 'Opening'} · click a section to jump`}
                  </span>
                </div>
                <span>
                  {formatPreviewTime(previewFrame)} /{' '}
                  {formatPreviewTime(previewDurationInFrames)}
                </span>
              </div>
              {activeFormat.id !== 'photo' ? (
                <div className={styles.timelineTrack}>
                {previewScenes.map((scene, index) => {
                  const nextSceneStart =
                    previewScenes[index + 1]?.startFrame ??
                    previewDurationInFrames;
                  const isActive = index === activePreviewSceneIndex;

                  return (
                    <button
                      aria-current={isActive ? 'step' : undefined}
                      aria-label={`${scene.label} scene`}
                      className={
                        isActive ? styles.timelineSceneActive : undefined
                      }
                      key={scene.label}
                      onClick={() => jumpToPreviewScene(scene)}
                      style={{flex: nextSceneStart - scene.startFrame}}
                      title={`Jump to ${scene.label.toLowerCase()} at ${formatPreviewTime(
                        scene.focusFrame,
                      )}`}
                      type="button"
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{scene.label}</strong>
                    </button>
                  );
                })}
                </div>
              ) : (
                <div className={styles.staticTimeline}>
                  <span aria-hidden="true">▧</span>
                  <strong>Ready at full resolution</strong>
                  <small>1080 × 1920 PNG</small>
                </div>
              )}
              {activeFormat.id !== 'photo' ? (
                <div className={styles.timelineTimes}>
                  {(activeFormat.id === 'animated'
                    ? ['00:00', '00:02', '00:04', '00:06']
                    : ['00:00', '00:10', '00:20', '00:30']
                  ).map((time) => (
                    <span key={time}>{time}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        </main>
      )}

      {toast ? (
        <div aria-live="polite" className={styles.toast} role="status">
          <span />
          {toast}
        </div>
      ) : null}
    </div>
  );
};
