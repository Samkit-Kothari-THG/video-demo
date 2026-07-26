# Video Invite Studio — MVP Plan

## Product thesis

Build the fastest way for a non-designer to create a polished, mobile-first
video invitation:

1. Choose a template.
2. Enter event details.
3. Upload and crop a photo.
4. Preview the result immediately.
5. Render and download a share-ready MP4.

The MVP is a template-driven generator, not a free-form Canva replacement.
Templates guarantee visual quality while structured inputs keep the editor
simple enough to use comfortably on a phone.

## Target user and first use case

**Primary user:** Someone creating an engagement or wedding invitation for
sharing through WhatsApp, Instagram, or a direct link.

**Initial template:** `EngagementInvite`, 30 seconds, portrait 1080×1920.

**Core job:** Produce a personalized invitation in less than five minutes
without requiring video-editing knowledge.

## MVP scope

### Template gallery

- Show one production-ready template and up to two visual variants.
- Preview each template with sample data.
- Clearly show duration and output aspect ratio.

### Guided editor

- Bride and groom names.
- Event title.
- Date.
- Venue.
- Family name.
- Couple photo upload.
- Photo crop and focal-point selection.
- Show/hide photo option.
- Curated music selection, including a no-music option.
- Live preview using the same Remotion component as the final render.
- Mobile-first form with a persistent preview.
- Validation for missing, overly long, or unsupported values.

### Project persistence

- Save the selected template version and structured input props.
- Autosave changes.
- Resume a draft.
- Duplicate an existing project.

### Export

- Create a render job from a saved project snapshot.
- Show queued, rendering, completed, and failed states.
- Produce a portrait MP4 suitable for WhatsApp and Instagram.
- Provide a time-limited download link.
- Keep the rendered result associated with the project.

### Basic product controls

- Authentication through email magic link or a single social provider.
- One free watermarked preview export.
- One simple paid export option.
- Basic event analytics: project created, preview played, render requested,
  render completed, and download clicked.

## Explicit non-goals

The MVP will not include:

- A free-form drag-and-drop canvas.
- Arbitrary text, image, or timeline layers.
- User-created templates.
- Multi-user collaboration.
- AI-generated storyboards.
- Arbitrary video uploads.
- Scene reordering or per-scene timing controls.
- Landscape and square exports.
- Native mobile applications.
- A public template marketplace.

These can be reconsidered after the structured workflow proves useful.

## User journey

1. The user opens the template gallery.
2. They choose the engagement invitation.
3. A project is created using versioned template defaults.
4. The editor generates fields from the template schema.
5. Changes update the browser preview immediately.
6. Uploaded assets are validated, stored, and converted to safe render inputs.
7. The user requests an export.
8. The server snapshots the template version and props into a render job.
9. A worker renders the video and uploads the MP4.
10. The user downloads or shares the finished invitation.

## Proposed architecture

```text
Web application
  ├── Template gallery
  ├── Schema-driven editor
  ├── Remotion Player preview
  └── Project/render status
          │
          ▼
Application API
  ├── Authentication
  ├── Project persistence
  ├── Asset upload authorization
  └── Render job creation
          │
          ├── PostgreSQL: users, projects, template versions, render jobs
          ├── Object storage: source images, music, rendered MP4s
          └── Queue: pending render jobs
                         │
                         ▼
                  Remotion worker
                    ├── Validate snapshot
                    ├── Render composition
                    ├── Upload result
                    └── Update job status
```

The live preview and final renderer must consume the same resolved props. This
avoids a class of bugs where the editor looks different from the exported
video.

## Core data model

### Template definition

```ts
type TemplateDefinition<Props> = {
  id: string;
  version: number;
  name: string;
  compositionId: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  defaults: Props;
  fields: TemplateField[];
};
```

### Project

```ts
type Project = {
  id: string;
  userId: string;
  templateId: string;
  templateVersion: number;
  props: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
```

### Render job

```ts
type RenderJob = {
  id: string;
  projectId: string;
  templateVersion: number;
  propsSnapshot: Record<string, unknown>;
  status: "queued" | "rendering" | "completed" | "failed";
  progress: number;
  outputUrl?: string;
  errorCode?: string;
};
```

The job stores an immutable props snapshot. Editing a project after requesting
an export must not change a render already in progress.

## Delivery milestones

### Milestone 0 — Template hardening

- Separate production templates from legacy demos.
- Define and validate a formal engagement-invite prop model.
- Make individual names drive the displayed couple line.
- Add text fitting and maximum-length rules.
- Add render-safe asset handling.
- Create representative fixture projects for visual regression checks.

**Exit criterion:** The template renders correctly with short names, long
names, no photo, and each supported music option.

### Milestone 1 — Local editor prototype

- Add the web application shell.
- Add the template gallery and project editor.
- Embed a Remotion Player preview.
- Generate controls from the template definition.
- Implement local draft persistence.
- Add photo upload, crop, and focal-point controls.

**Exit criterion:** A test user can personalize and preview an invitation on
desktop and mobile without touching code.

### Milestone 2 — Rendering pipeline

- Add authentication and persistent projects.
- Add object storage and signed uploads.
- Add the render queue and worker.
- Add render progress, retry behavior, and downloadable outputs.
- Record the exact template version used by each render.

**Exit criterion:** A saved project reliably produces a downloadable MP4, and
failed jobs produce an actionable error rather than becoming stuck.

### Milestone 3 — Launch readiness

- Add the watermark and payment boundary.
- Add product analytics and error monitoring.
- Test common Android and iPhone viewport sizes.
- Test WhatsApp and Instagram output compatibility.
- Review privacy, asset retention, music rights, and Remotion licensing.
- Add a small internal support screen for render failures.

**Exit criterion:** Ten external testers can create, render, and share an
invitation without developer assistance.

## Quality and acceptance criteria

- Editor changes appear in preview within 300 ms for normal text edits.
- Preview and rendered output use identical content and layout.
- No supported name or venue length overflows its safe area.
- Invalid or oversized uploads are rejected before rendering.
- Every render reaches a terminal state.
- Retrying a render does not create duplicate charges.
- A project always retains the template version it was created with.
- Render logs never expose private asset URLs or user-provided secrets.
- The editor is usable at a 360 px CSS viewport width.

## Early product metrics

- Percentage of visitors who start a project.
- Percentage of projects that reach a preview play.
- Percentage of previews that request a render.
- Successful renders divided by requested renders.
- Median time from project creation to first completed render.
- Download/share rate after a completed render.
- Support incidents per 100 completed renders.

The most important early signal is whether users can reach a satisfactory
preview quickly. Template count is secondary.

## Main risks

### Layout variability

Names, venues, and languages vary dramatically. Treat text fitting and safe
limits as template features, not general editor validation.

### Preview/render mismatch

Use one prop resolver and one composition implementation in both environments.
Snapshot template versions and render inputs.

### Render latency and cost

Measure actual render time before choosing worker size or serverless
infrastructure. Do not optimize from theoretical frame counts alone.

### Asset privacy

Use private object storage, signed URLs, deletion policies, and short-lived
download links. Uploaded couple photographs should not be public by default.

### Music rights

Start with licensed tracks owned or explicitly licensed by the product. Do not
ship a public music library without documented usage rights.

### Product scope

Do not add free-form editing until data shows that structured controls prevent
users from completing invitations.

## Suggested next implementation slice

Build Milestone 0 followed by a single-page local editor:

1. Add the versioned `EngagementInvite` template definition.
2. Add runtime input validation and text fitting.
3. Add a browser preview driven by editor state.
4. Add photo upload and focal-point selection.
5. Save project JSON locally.

This creates a complete product-shaped prototype before committing to accounts,
payments, queues, or cloud rendering.
