'use client';

import {Player} from '@remotion/player';
import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {
  createEngagementInviteDraft,
  defaultEngagementInviteProps,
  EngagementInvite,
  engagementInviteTextFields,
  resolveEngagementInviteProps,
  type EngagementInviteProps,
  type EngagementTextFieldKey,
  validateEngagementInviteProps,
} from '../templates/engagement';

type InviteProject = {
  id: string;
  createdAt: string;
  updatedAt: string;
  props: EngagementInviteProps;
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

const STORAGE_KEY = 'video-invite-studio:workspace:v1';
const MAX_LOCAL_IMAGE_SIZE = 2_500_000;

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ?? `invite-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createProject = (): InviteProject => {
  const now = new Date().toISOString();
  return {
    id: makeId(),
    createdAt: now,
    updatedAt: now,
    props: createEngagementInviteDraft(),
  };
};

const isWorkspace = (value: unknown): value is EditorWorkspace => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const workspace = value as Partial<EditorWorkspace>;
  return Array.isArray(workspace.projects);
};

const loadWorkspace = (): EditorWorkspace => {
  if (typeof window === 'undefined') {
    return {activeProjectId: null, projects: []};
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return isWorkspace(parsed) ? parsed : {activeProjectId: null, projects: []};
  } catch {
    return {activeProjectId: null, projects: []};
  }
};

const projectLabel = (project: InviteProject) => {
  const details = resolveEngagementInviteProps(project.props);
  return `${details.brideName} & ${details.groomName}`;
};

const renderCommand = (props: EngagementInviteProps) => {
  const renderableProps = {
    ...props,
    photoSrc: props.photoSrc?.startsWith('data:')
      ? 'engagement/couple-photo.jpg'
      : props.photoSrc,
  };

  return `npm run render:engagement -- --props='${JSON.stringify(renderableProps)}'`;
};

const previewMediaSource = (source: string) =>
  source.startsWith('data:') || source.startsWith('blob:') || source.startsWith('/')
    ? source
    : staticFile(source);

const css = `
  * { box-sizing: border-box; }
  .invite-editor { min-height: 100%; color: #30241d; background: #f8f1e5; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
  .editor-shell { min-height: 100%; padding: 30px; background: radial-gradient(circle at 14% 4%, rgba(201, 144, 49, .18), transparent 28%), linear-gradient(135deg, #f8f1e5, #f0dfc1); }
  .editor-topbar { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-bottom: 28px; }
  .editor-brand { display: flex; align-items: center; gap: 14px; }
  .editor-brand-mark { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 14px; color: #fff9ed; font: 700 24px Georgia, serif; background: linear-gradient(135deg, #82283a, #c89031); box-shadow: 0 12px 28px rgba(116, 31, 47, .22); }
  .editor-brand h1 { margin: 0; font-family: Georgia, serif; font-size: 24px; letter-spacing: -.03em; }
  .editor-brand p { margin: 3px 0 0; color: #766453; font-size: 12px; }
  .editor-actions { display: flex; align-items: center; gap: 10px; }
  .editor-button { appearance: none; border: 1px solid rgba(116, 31, 47, .18); border-radius: 10px; padding: 10px 14px; background: rgba(255, 250, 240, .72); color: #572133; font: 700 12px Inter, sans-serif; cursor: pointer; transition: transform .15s ease, box-shadow .15s ease; }
  .editor-button:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(86, 42, 27, .12); }
  .editor-button.primary { color: #fffaf0; border-color: #741f2f; background: linear-gradient(135deg, #741f2f, #9d3e45); }
  .editor-button:disabled { cursor: wait; opacity: .62; transform: none; box-shadow: none; }
  .editor-button.text { border-color: transparent; background: transparent; }
  .gallery { max-width: 1140px; margin: 70px auto 0; }
  .gallery-kicker { color: #8d5a1d; font-weight: 800; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; }
  .gallery h2 { max-width: 620px; margin: 14px 0 10px; font: 700 52px/1 Georgia, serif; letter-spacing: -.045em; color: #402b21; }
  .gallery-copy { max-width: 570px; margin: 0 0 32px; color: #6f5a48; font-size: 16px; line-height: 1.6; }
  .template-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(260px, .65fr); gap: 22px; }
  .template-card, .draft-card { overflow: hidden; border: 1px solid rgba(132, 86, 39, .14); border-radius: 20px; background: rgba(255, 252, 246, .76); box-shadow: 0 24px 60px rgba(95, 55, 26, .12); }
  .template-card { display: grid; grid-template-columns: 230px 1fr; min-height: 275px; }
  .template-cover { position: relative; overflow: hidden; background: #ead8bc; }
  .template-cover img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 20%; transform: scale(1.06); }
  .template-cover::after { position: absolute; inset: 0; content: ''; background: linear-gradient(180deg, transparent, rgba(73, 32, 20, .2)); }
  .template-content { padding: 30px; }
  .template-badge { display: inline-flex; padding: 6px 9px; border-radius: 999px; background: #f6e8cd; color: #8d5a1d; font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
  .template-content h3 { margin: 18px 0 8px; font: 700 31px Georgia, serif; color: #402b21; }
  .template-content p { margin: 0 0 24px; color: #735e4b; font-size: 14px; line-height: 1.55; }
  .template-meta { display: flex; gap: 14px; margin-bottom: 24px; color: #7c624b; font-size: 12px; }
  .draft-panel { padding: 25px; }
  .draft-panel h3 { margin: 0 0 16px; font: 700 22px Georgia, serif; }
  .draft-list { display: grid; gap: 10px; max-height: 240px; overflow: auto; }
  .draft-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px; border-radius: 12px; background: #fbf5e9; }
  .draft-row strong { display: block; font-size: 13px; }
  .draft-row span { display: block; margin-top: 3px; color: #816b57; font-size: 11px; }
  .editor-layout { display: grid; grid-template-columns: minmax(350px, .9fr) minmax(420px, 1.1fr); gap: 26px; max-width: 1400px; height: calc(100% - 70px); margin: 0 auto; }
  .editor-controls, .editor-preview { min-height: 0; overflow: hidden; border: 1px solid rgba(132, 86, 39, .14); border-radius: 20px; background: rgba(255, 252, 246, .78); box-shadow: 0 24px 60px rgba(95, 55, 26, .12); }
  .editor-controls { display: flex; flex-direction: column; }
  .controls-header { padding: 24px 24px 16px; border-bottom: 1px solid rgba(132, 86, 39, .12); }
  .controls-header h2 { margin: 0; font: 700 25px Georgia, serif; color: #402b21; }
  .controls-header p { margin: 7px 0 0; color: #796450; font-size: 12px; line-height: 1.5; }
  .save-state { display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; color: #68745d; font-size: 11px; font-weight: 700; }
  .save-state::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #74915f; }
  .form-scroll { flex: 1; overflow: auto; padding: 22px 24px 32px; }
  .form-section { margin: 0 0 26px; }
  .form-section h3 { margin: 0 0 14px; color: #4e3629; font: 700 17px Georgia, serif; }
  .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
  .field { display: grid; gap: 6px; }
  .field.wide { grid-column: 1 / -1; }
  .field label { color: #604534; font-size: 11px; font-weight: 800; }
  .field input[type='text'] { width: 100%; min-height: 40px; border: 1px solid #dcc9ab; border-radius: 9px; padding: 10px 11px; color: #3f2d23; background: #fffdf8; outline: none; font: 500 13px Inter, sans-serif; }
  .field input[type='text']:focus { border-color: #a87336; box-shadow: 0 0 0 3px rgba(200, 144, 49, .12); }
  .field input.error { border-color: #b44a55; }
  .field small { color: #8b7561; font-size: 10px; line-height: 1.35; }
  .field-error { color: #a43846 !important; font-weight: 700; }
  .photo-card { padding: 14px; border: 1px dashed #c9af8c; border-radius: 12px; background: #fffaf1; }
  .photo-card-top { display: flex; align-items: center; gap: 13px; }
  .photo-thumb { width: 48px; height: 48px; flex: 0 0 auto; overflow: hidden; border-radius: 10px; background: #ead7bb; }
  .photo-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .photo-copy { min-width: 0; flex: 1; }
  .photo-copy strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
  .photo-copy span { display: block; margin-top: 3px; color: #806955; font-size: 10px; }
  .file-input { display: none; }
  .upload-label { display: inline-flex; align-items: center; justify-content: center; min-height: 34px; padding: 8px 10px; border-radius: 8px; color: #6d3b24; background: #f6e5c7; font-size: 11px; font-weight: 800; cursor: pointer; }
  .range-row { display: flex; align-items: center; gap: 12px; margin-top: 14px; }
  .range-row input { flex: 1; accent-color: #8d5a1d; }
  .range-row span { width: 34px; color: #765740; font-size: 11px; font-weight: 700; text-align: right; }
  .switch-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; }
  .switch-copy strong { display: block; font-size: 12px; }
  .switch-copy span { display: block; margin-top: 3px; color: #826d59; font-size: 10px; }
  .switch { position: relative; width: 42px; height: 24px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .switch span { position: absolute; inset: 0; border-radius: 20px; background: #cbbda9; cursor: pointer; transition: .2s; }
  .switch span::after { position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; content: ''; border-radius: 50%; background: white; transition: .2s; }
  .switch input:checked + span { background: #8d5a1d; }
  .switch input:checked + span::after { transform: translateX(18px); }
  .music-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .music-option { display: flex; gap: 9px; align-items: center; min-height: 45px; padding: 10px; border: 1px solid #dfcdb2; border-radius: 10px; background: #fffdf8; color: #654b39; cursor: pointer; font-size: 11px; font-weight: 700; }
  .music-option.active { border-color: #9a6424; background: #fbefd9; }
  .music-option input { accent-color: #8d5a1d; }
  .preview-shell { display: flex; flex-direction: column; height: 100%; padding: 20px; background: linear-gradient(145deg, #5c3f31, #2b2220); }
  .preview-topline { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; color: rgba(255, 249, 238, .9); }
  .preview-topline strong { font: 700 15px Georgia, serif; }
  .preview-topline span { color: rgba(255, 249, 238, .62); font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  .preview-canvas { display: grid; flex: 1; min-height: 0; place-items: center; }
  .preview-player { height: min(100%, 690px); max-width: 100%; aspect-ratio: 9 / 16; overflow: hidden; border: 6px solid rgba(255, 249, 238, .9); border-radius: 18px; box-shadow: 0 26px 70px rgba(0, 0, 0, .38); }
  .preview-note { margin: 14px 0 0; color: rgba(255, 249, 238, .62); font-size: 10px; line-height: 1.45; text-align: center; }
  .toast { position: absolute; right: 30px; bottom: 28px; max-width: 360px; padding: 12px 14px; border-radius: 11px; color: #fffaf0; background: #4d382c; box-shadow: 0 18px 38px rgba(46, 28, 18, .24); font-size: 12px; }
  @media (max-width: 960px) { .editor-shell { padding: 18px; } .editor-layout { grid-template-columns: 1fr; height: auto; } .editor-controls { min-height: 680px; } .editor-preview { min-height: 720px; } .gallery { margin-top: 32px; } .template-grid { grid-template-columns: 1fr; } }
`;

const EditorStyles: React.FC = () => <style>{css}</style>;

const TextField: React.FC<{
  field: (typeof engagementInviteTextFields)[number];
  value: string;
  error?: string;
  onChange: (key: EngagementTextFieldKey, value: string) => void;
}> = ({field, value, error, onChange}) => (
  <div className={`field ${field.key === 'coupleLine' || field.key === 'venueName' || field.key === 'familyName' ? 'wide' : ''}`}>
    <label htmlFor={field.key}>{field.label}</label>
    <input
      className={error ? 'error' : undefined}
      id={field.key}
      maxLength={field.maxLength}
      onChange={(event) => onChange(field.key, event.target.value)}
      placeholder={field.optional ? 'Use the names above automatically' : undefined}
      type="text"
      value={value}
    />
    <small className={error ? 'field-error' : undefined}>{error ?? field.description}</small>
  </div>
);

export const InviteEditor: React.FC = () => {
  const [workspace, setWorkspace] = useState<EditorWorkspace>(loadWorkspace);
  const [screen, setScreen] = useState<'gallery' | 'editor'>(
    workspace.activeProjectId ? 'editor' : 'gallery',
  );
  const [storageError, setStorageError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [renderJob, setRenderJob] = useState<RenderJob | null>(null);

  const activeProject = workspace.projects.find(
    (project) => project.id === workspace.activeProjectId,
  );
  const props = activeProject?.props ?? createEngagementInviteDraft();
  const details = useMemo(() => resolveEngagementInviteProps(props), [props]);
  const errors = useMemo(() => validateEngagementInviteProps(props), [props]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
      setStorageError(null);
    } catch {
      setStorageError('Your photo is too large to save in this browser. Choose a smaller image.');
    }
  }, [workspace]);

  useEffect(() => {
    let cancelled = false;

    const loadServerProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          return;
        }
        const body = (await response.json()) as {projects: InviteProject[]};
        if (!cancelled && body.projects.length > 0) {
          setWorkspace((current) => ({
            activeProjectId: current.activeProjectId ?? body.projects[0].id,
            projects: body.projects,
          }));
        }
      } catch {
        // Remotion Studio can run without the Next.js API routes. Local browser
        // drafts remain available as a useful fallback in that environment.
      }
    };

    void loadServerProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!renderJob || renderJob.status === 'completed' || renderJob.status === 'failed') {
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
        // Keep the last known status visible until the next polling attempt.
      }
    }, 1_200);
    return () => window.clearInterval(interval);
  }, [renderJob]);

  const openProject = (projectId: string) => {
    setWorkspace((current) => ({...current, activeProjectId: projectId}));
    setScreen('editor');
  };

  const useTemplate = async () => {
    const localProject = createProject();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({props: localProject.props}),
      });
      if (!response.ok) {
        throw new Error('Project API unavailable');
      }
      const body = (await response.json()) as {project: InviteProject};
      setWorkspace((current) => ({
        activeProjectId: body.project.id,
        projects: [body.project, ...current.projects],
      }));
    } catch {
      setWorkspace((current) => ({
        activeProjectId: localProject.id,
        projects: [localProject, ...current.projects],
      }));
      setToast('Saved in this browser. Start the Next.js app to enable server projects.');
    }
    setScreen('editor');
  };

  const updateProps = (updates: Partial<EngagementInviteProps>) => {
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

    void fetch(`/api/projects/${activeProject.id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({props: updates}),
    }).catch(() => {
      // The optimistic local draft remains intact if the server is unavailable.
    });
  };

  const duplicateProject = async () => {
    if (!activeProject) {
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({props: activeProject.props}),
      });
      if (!response.ok) {
        throw new Error('Project API unavailable');
      }
      const body = (await response.json()) as {project: InviteProject};
      setWorkspace((current) => ({
        activeProjectId: body.project.id,
        projects: [body.project, ...current.projects],
      }));
      setToast('A new server-backed copy has been created.');
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
      setToast('A local copy has been created.');
    }
  };

  const handleImage = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setToast('Please choose a JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > 5_000_000) {
      setToast('Choose an image smaller than 5 MB.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/uploads', {method: 'POST', body: formData});
      if (!response.ok) {
        throw new Error('Upload API unavailable');
      }
      const body = (await response.json()) as {assetPath: string};
      updateProps({photoSrc: body.assetPath, showPhoto: true});
      setToast('Photo uploaded and saved with your project.');
      return;
    } catch {
      // Fall back to a browser-only draft when the editor runs in Studio.
    }

    if (file.size > MAX_LOCAL_IMAGE_SIZE) {
      setToast('This image is too large for a browser-only draft. Use the Next.js app to upload it.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateProps({photoSrc: reader.result, showPhoto: true});
        setToast('Photo updated. Adjust the focal point if needed.');
      }
    };
    reader.readAsDataURL(file);
  };

  const copyRenderCommand = async () => {
    const command = renderCommand(props);
    try {
      await navigator.clipboard.writeText(command);
      setToast('Render command copied. Save a custom photo under public/ before using it.');
    } catch {
      setToast(command);
    }
  };

  const requestRender = async () => {
    if (!activeProject || Object.keys(errors).length > 0) {
      setToast('Complete the highlighted fields before rendering.');
      return;
    }

    try {
      const response = await fetch('/api/renders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({projectId: activeProject.id}),
      });
      const body = (await response.json()) as {job?: RenderJob; error?: string};
      if (!response.ok || !body.job) {
        throw new Error(body.error ?? 'The render could not be started.');
      }
      setRenderJob(body.job);
      setToast('Render queued. You can keep editing while it is processed.');
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'The render could not be started.');
    }
  };

  return (
    <AbsoluteFill className="invite-editor">
      <EditorStyles />
      <div className="editor-shell">
        <header className="editor-topbar">
          <div className="editor-brand">
            <div className="editor-brand-mark">V</div>
            <div>
              <h1>Vowframe</h1>
              <p>Personal video invitations</p>
            </div>
          </div>
          <div className="editor-actions">
            {screen === 'editor' ? (
              <button className="editor-button text" onClick={() => setScreen('gallery')} type="button">
                Templates
              </button>
            ) : null}
            {activeProject ? (
              <button className="editor-button" onClick={duplicateProject} type="button">
                Duplicate
              </button>
            ) : null}
            {screen === 'editor' ? (
              <>
                <button className="editor-button" onClick={copyRenderCommand} type="button">
                  Copy CLI command
                </button>
                {renderJob?.status === 'completed' && renderJob.outputUrl ? (
                  <a className="editor-button primary" href={renderJob.outputUrl} download>
                    Download MP4
                  </a>
                ) : (
                  <button className="editor-button primary" disabled={Boolean(renderJob && renderJob.status !== 'failed')} onClick={requestRender} type="button">
                    {renderJob ? `Rendering ${renderJob.progress}%` : 'Render video'}
                  </button>
                )}
              </>
            ) : null}
          </div>
        </header>

        {screen === 'gallery' ? (
          <main className="gallery">
            <div className="gallery-kicker">Video invite studio</div>
            <h2>Make the invitation feel like an occasion.</h2>
            <p className="gallery-copy">
              Start from a finished visual story, add your details, and preview it before you render.
            </p>
            <div className="template-grid">
              <article className="template-card">
                <div className="template-cover">
                  <img alt="Classic gold engagement invitation" src={staticFile('engagement/luxury-invite-bg.png')} />
                </div>
                <div className="template-content">
                  <span className="template-badge">Launch template</span>
                  <h3>Classic Celebration</h3>
                  <p>Warm ivory, marigolds, gold details, a photo moment, and a share-ready vertical story.</p>
                  <div className="template-meta"><span>30 seconds</span><span>9:16 portrait</span><span>Photo + music</span></div>
                  <button className="editor-button primary" onClick={useTemplate} type="button">Customize this invite</button>
                </div>
              </article>
              <aside className="draft-panel draft-card">
                <h3>Your drafts</h3>
                {workspace.projects.length === 0 ? (
                  <p className="gallery-copy" style={{fontSize: 13, marginBottom: 0}}>Your server-backed invitations will appear here.</p>
                ) : (
                  <div className="draft-list">
                    {workspace.projects.map((project) => (
                      <div className="draft-row" key={project.id}>
                        <div><strong>{projectLabel(project)}</strong><span>Edited {new Date(project.updatedAt).toLocaleDateString()}</span></div>
                        <button className="editor-button" onClick={() => openProject(project.id)} type="button">Open</button>
                      </div>
                    ))}
                  </div>
                )}
              </aside>
            </div>
          </main>
        ) : (
          <main className="editor-layout">
            <section className="editor-controls">
              <div className="controls-header">
                <h2>{projectLabel(activeProject ?? createProject())}</h2>
                <p>Classic Celebration · 30 seconds · portrait video</p>
                <span className="save-state">{storageError ?? 'Saved to this project'}</span>
              </div>
              <div className="form-scroll">
                <section className="form-section">
                  <h3>Invitation details</h3>
                  <div className="field-grid">
                    {engagementInviteTextFields.map((field) => (
                      <TextField
                        error={errors[field.key]}
                        field={field}
                        key={field.key}
                        onChange={(key, value) => updateProps({[key]: value})}
                        value={props[field.key] ?? ''}
                      />
                    ))}
                  </div>
                </section>

                <section className="form-section">
                  <h3>Photo moment</h3>
                  <div className="photo-card">
                    <div className="photo-card-top">
                      <div className="photo-thumb">
                        {details.photoSrc ? <img alt="Selected couple" src={previewMediaSource(details.photoSrc)} /> : null}
                      </div>
                      <div className="photo-copy">
                        <strong>{details.photoSrc?.startsWith('uploads/') || details.photoSrc?.startsWith('data:') ? 'Your uploaded photo' : 'Sample couple photo'}</strong>
                        <span>JPG, PNG, or WebP · up to 5 MB</span>
                      </div>
                      <label className="upload-label" htmlFor="invite-photo">Replace</label>
                      <input className="file-input" id="invite-photo" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleImage(event.target.files?.[0])} type="file" />
                    </div>
                    <div className="range-row">
                      <label htmlFor="focal-point">Focal point</label>
                      <input id="focal-point" max="100" min="0" onChange={(event) => updateProps({photoFocalPoint: Number(event.target.value)})} type="range" value={details.photoFocalPoint} />
                      <span>{details.photoFocalPoint}%</span>
                    </div>
                    {errors.photoSrc ? <small className="field-error">{errors.photoSrc}</small> : null}
                    <div className="switch-row">
                      <div className="switch-copy"><strong>Show couple photo</strong><span>Hide it to use an illustrated mandala instead.</span></div>
                      <label className="switch"><input checked={details.showPhoto} onChange={(event) => updateProps({showPhoto: event.target.checked})} type="checkbox" /><span /></label>
                    </div>
                  </div>
                </section>

                <section className="form-section">
                  <h3>Music</h3>
                  <div className="music-options">
                    <label className={`music-option ${details.musicSrc ? 'active' : ''}`}><input checked={Boolean(details.musicSrc)} name="music" onChange={() => updateProps({musicSrc: defaultEngagementInviteProps.musicSrc})} type="radio" />Indian instrumental</label>
                    <label className={`music-option ${!details.musicSrc ? 'active' : ''}`}><input checked={!details.musicSrc} name="music" onChange={() => updateProps({musicSrc: null})} type="radio" />No music</label>
                  </div>
                </section>
              </div>
            </section>

            <section className="editor-preview">
              <div className="preview-shell">
                <div className="preview-topline"><strong>Live preview</strong><span>{renderJob ? `${renderJob.status} · ${renderJob.progress}%` : 'Changes save automatically'}</span></div>
                <div className="preview-canvas">
                  <Player
                    acknowledgeRemotionLicense
                    className="preview-player"
                    component={EngagementInvite}
                    compositionHeight={1920}
                    compositionWidth={1080}
                    controls
                    durationInFrames={900}
                    fps={30}
                    inputProps={props}
                    loop
                    style={{width: 'auto'}}
                  />
                </div>
                <p className="preview-note">The preview and the server renderer use the same invitation component. Renders are saved as MP4 files when the local worker completes.</p>
              </div>
            </section>
          </main>
        )}
      </div>
      {toast ? <div className="toast">{toast}</div> : null}
    </AbsoluteFill>
  );
};
