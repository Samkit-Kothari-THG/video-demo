'use client';

import {Player} from '@remotion/player';
import React, {useEffect, useMemo, useState} from 'react';
import {
  CatalogInvitation,
  createTemplateDraft,
  getInvitationMusicTrack,
  getInvitationTemplate,
  invitationCategories,
  invitationMusicTracks,
  invitationTemplates,
  resolveTemplateAssetSrc,
  resolveTemplateCopy,
  templateProjectInitials,
  templateProjectLabel,
  type EngagementTextFieldKey,
  type InvitationCategory,
  type InvitationContentProps,
  type InvitationTemplateField,
  type InvitationTemplateId,
  type InvitationTemplateVersion,
  validateTemplateProps,
} from '../templates';
import styles from './InviteEditor.module.css';

type InviteProject = {
  id: string;
  templateId: InvitationTemplateId;
  templateVersion: InvitationTemplateVersion;
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
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  progress: number;
  outputUrl: string | null;
  error: string | null;
};

type EditorTab = 'story' | 'media' | 'sound' | 'review';
type SaveState = 'saved' | 'saving' | 'offline';
type ServerState = 'checking' | 'ready' | 'offline';

const STORAGE_KEY = 'video-invite-studio:workspace:v1';
const MAX_LOCAL_IMAGE_SIZE = 2_500_000;
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

const timelineScenes = [
  {label: 'Opening', frames: 145},
  {label: 'Names', frames: 170},
  {label: 'Photo', frames: 185},
  {label: 'Details', frames: 165},
  {label: 'Finale', frames: 235},
];

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `invite-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createProject = (
  templateId: InvitationTemplateId,
  templateVersion?: InvitationTemplateVersion,
): InviteProject => {
  const now = new Date().toISOString();
  const template = getInvitationTemplate(templateId, templateVersion);
  return {
    id: makeId(),
    templateId: template.id,
    templateVersion: template.version,
    createdAt: now,
    updatedAt: now,
    props: createTemplateDraft(template.id, template.version),
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
  props: InvitationContentProps,
) => {
  const template = getInvitationTemplate(templateId, templateVersion);
  const renderableProps = {
    ...props,
    templateId: template.id,
    templateVersion: template.version,
    photoSrc: props.photoSrc?.startsWith('data:')
      ? 'engagement/couple-photo.jpg'
      : props.photoSrc,
  };

  return `npx remotion render src/index.ts ${template.compositionId} out/${template.compositionId}-v${template.version}.mp4 --props='${JSON.stringify(renderableProps)}'`;
};

const browserMediaSource = (source: string) => {
  if (/^(data:|blob:|https?:\/\/|\/)/.test(source)) {
    return source;
  }

  return `/${source}`;
};

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
  const [workspace, setWorkspace] = useState<EditorWorkspace>({
    activeProjectId: null,
    projects: [],
  });
  const [screen, setScreen] = useState<'library' | 'editor'>('library');
  const [activeTab, setActiveTab] = useState<EditorTab>('story');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | InvitationCategory
  >('all');
  const [storageError, setStorageError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [renderJob, setRenderJob] = useState<RenderJob | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [serverState, setServerState] = useState<ServerState>('checking');
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  const activeProject = workspace.projects.find(
    (project) => project.id === workspace.activeProjectId,
  );
  const activeTemplate = activeProject
    ? getInvitationTemplate(
        activeProject.templateId,
        activeProject.templateVersion,
      )
    : flagshipTemplate;
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
  const errorCount = Object.keys(errors).length;
  const isRendering =
    renderJob?.status === 'queued' || renderJob?.status === 'rendering';

  useEffect(() => {
    const savedWorkspace = loadWorkspace();
    setWorkspace(savedWorkspace);
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

  const openProject = (projectId: string) => {
    setWorkspace((current) => ({...current, activeProjectId: projectId}));
    setActiveTab('story');
    setRenderJob(null);
    setScreen('editor');
  };

  const useTemplate = async (
    templateId: InvitationTemplateId = FLAGSHIP_TEMPLATE_ID,
    templateVersion: InvitationTemplateVersion = FLAGSHIP_TEMPLATE_VERSION,
  ) => {
    const localProject = createProject(templateId, templateVersion);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          templateId,
          templateVersion,
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
    setRenderJob(null);
    setScreen('editor');
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
    const command = renderCommand(
      activeTemplate.id,
      activeTemplate.version,
      props,
    );
    try {
      await navigator.clipboard.writeText(command);
      setToast('Developer render command copied.');
    } catch {
      setToast(command);
    }
  };

  const requestRender = async () => {
    if (!activeProject || errorCount > 0) {
      setActiveTab('review');
      setToast('Review the highlighted details before rendering.');
      return;
    }

    try {
      const response = await fetch('/api/renders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({projectId: activeProject.id}),
      });
      const body = (await response.json()) as {
        job?: RenderJob;
        error?: string;
      };
      if (!response.ok || !body.job) {
        throw new Error(body.error ?? 'The render could not be started.');
      }

      setRenderJob(body.job);
      setToast('Your MP4 is now rendering in the background.');
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
        Download MP4
      </a>
    ) : (
      <button
        className={styles.primaryButton}
        disabled={isRendering}
        onClick={requestRender}
        type="button"
      >
        {isRendering
          ? `Rendering ${renderJob?.progress ?? 0}%`
          : 'Export video'}
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
            <small>Invitation films</small>
          </span>
        </button>

        {screen === 'editor' && activeProject ? (
          <div className={styles.projectIdentity}>
            <span>
              {activeTemplate.name} · V{activeTemplate.version}
            </span>
            <strong>{projectLabel(activeProject)}</strong>
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
          ) : (
            <button
              className={styles.primaryButton}
              onClick={() => void useTemplate()}
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
                Invitation films, made personal
              </span>
              <h1>Make the first moment feel unforgettable.</h1>
              <p>
                Personalise a cinematic invitation in minutes. Preview every
                scene, then render a polished vertical film ready to share.
              </p>
              <div className={styles.heroActions}>
                <button
                  className={styles.heroButton}
                  onClick={() => void useTemplate()}
                  type="button"
                >
                  Create your invitation
                  <span aria-hidden="true">→</span>
                </button>
                <span>30 seconds · 1080 × 1920 · MP4</span>
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

          <section className={styles.templateLibrarySection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>Design collection</span>
                <h2>Find a film for the moment</h2>
              </div>
              <span>10 original motion templates</span>
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
                      void useTemplate(template.id, template.version)
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
                        Use design <i aria-hidden="true">→</i>
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
                          <span>{projectTemplate.categoryLabel}</span>
                          <strong>{projectInitials(project)}</strong>
                        </div>
                      </div>
                      <div className={styles.projectCardBody}>
                        <div>
                          <strong>{projectLabel(project)}</strong>
                          <span>
                            {projectTemplate.name} · V
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
                  onClick={() => void useTemplate()}
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
                onClick={() => void useTemplate()}
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
      ) : (
        <main className={styles.workspace}>
          <nav aria-label="Editor tools" className={styles.toolRail}>
            {editorTabs.map((tab) => (
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
                  ? 'Invitation story'
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
                      : 'Check every detail before creating the MP4.'}
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
                      <span>Scene 03</span>
                      <strong>Portrait reveal</strong>
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

              {activeTab === 'sound' ? (
                <section className={styles.soundSection}>
                  <div className={styles.nowPlaying}>
                    <div className={styles.albumMark}>♪</div>
                    <div>
                      <span>Selected soundtrack</span>
                      <strong>
                        {selectedMusicTrack?.name ?? 'Silent by design'}
                      </strong>
                      <small>
                        {selectedMusicTrack?.description ??
                          'A crisp, editorial film without audio'}
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

                  <div className={styles.choiceList}>
                    {invitationMusicTracks.map((track) => (
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
                        onChange={() => updateProps({musicSrc: null})}
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
                      Music fades in and out automatically and is mixed below
                      the visual story.
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
                          : 'Ready to create your video'}
                      </strong>
                      <p>
                        {errorCount > 0
                          ? 'Return to Story to complete the highlighted fields.'
                          : 'Your invitation is complete and ready for a high-quality MP4 render.'}
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
                    <div>
                      <span className={styles.checkGood}>✓</span>
                      <div>
                        <strong>Soundtrack</strong>
                        <small>
                          {details.musicSrc
                            ? `${selectedMusicTrack?.name ?? 'Soundtrack'} selected`
                            : 'Silent export selected'}
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className={styles.exportCard}>
                    <div className={styles.exportSpec}>
                      <span>Format</span>
                      <strong>MP4 · H.264</strong>
                    </div>
                    <div className={styles.exportSpec}>
                      <span>Canvas</span>
                      <strong>1080 × 1920</strong>
                    </div>
                    <div className={styles.exportSpec}>
                      <span>Duration</span>
                      <strong>30 seconds</strong>
                    </div>
                    {renderJob ? (
                      <div className={styles.renderProgress}>
                        <div>
                          <span>
                            {renderJob.status === 'completed'
                              ? 'Render complete'
                              : renderJob.status === 'failed'
                                ? 'Render failed'
                                : 'Rendering your invitation'}
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
                    <div className={styles.exportAction}>{renderAction}</div>
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
                <span>30 sec</span>
              </div>
            </div>

            <div className={styles.canvas}>
              <div className={styles.canvasGlow} />
              <div className={styles.phoneFrame}>
                <span className={styles.phoneNotch} />
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
                  style={{height: '100%', width: '100%'}}
                />
              </div>
            </div>

            <div className={styles.timeline}>
              <div className={styles.timelineHeader}>
                <div>
                  <strong>Scenes</strong>
                  <span>6 transitions · soundtrack synced</span>
                </div>
                <span>00:30</span>
              </div>
              <div className={styles.timelineTrack}>
                {timelineScenes.map((scene, index) => (
                  <button
                    aria-label={`${scene.label} scene`}
                    key={scene.label}
                    onClick={() =>
                      setActiveTab(
                        index === 2
                          ? 'media'
                          : index === 4
                            ? 'review'
                            : 'story',
                      )
                    }
                    style={{flex: scene.frames}}
                    type="button"
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{scene.label}</strong>
                  </button>
                ))}
              </div>
              <div className={styles.timelineTimes}>
                <span>00:00</span>
                <span>00:10</span>
                <span>00:20</span>
                <span>00:30</span>
              </div>
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
