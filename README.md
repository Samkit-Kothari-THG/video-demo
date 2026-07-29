# Vowframe

A full-stack Next.js and Remotion application for creating personalized,
cinematic video invitations from structured user input.

The current experience includes a filterable template collection, project
library, guided Story/Photo/Sound editor, live video preview, scene timeline,
truthful autosave states, and server-rendered MP4 exports.

See [the MVP plan](docs/MVP_PLAN.md) for the proposed product scope,
architecture, milestones, and launch criteria. See
[the renderer decision](docs/RENDERER_DECISION.md) for why the app retains
Remotion behind a template catalogue. See
[the expansion roadmap](docs/roadmap/README.md) for sequential, implementation-
ready work packets from product validation through publishing, plus the
separately gated AI-assistance track.

## Invitation collection

| Category | V1 | V2 | Composition |
| --- | --- | --- | --- |
| Engagement | Marigold Reverie | Monsoon Glass | `EngagementInvite` |
| Wedding | Noor at Midnight | Ivory Garden | `WeddingNoor` |
| Birthday | Electric Confetti | Disco After Dark | `BirthdayConfetti` |
| Baby shower | Moonlit Bloom | Storybook Meadow | `BabyShowerMoon` |
| Housewarming | The New Aangan | Modern Threshold | `HousewarmingAangan` |

All ten editions have original portrait artwork, category-specific field
labels, motion copy, colour, typography, photo treatment, defaults, and
validation. The same versioned template definition drives the library, editor,
Player preview, project record, and server render. Existing projects remain
pinned to V1; a newly selected gallery card records its exact edition.

## Project structure

```text
app/
  api/                              Project, upload, and render routes
  globals.css                       Global product styles
  layout.tsx                        App metadata and root layout
  page.tsx                          Vowframe application entry
src/
  editor/
    InviteEditor.tsx                Project library and guided editor
    InviteEditor.module.css         Responsive product UI system
  index.ts                         Remotion entry point
  root.tsx                         Composition registry
  server/                           Local project store and render worker
  templates/
    catalog.ts                     Server-safe template registry and schemas
    CategoryInvitation.tsx         Versioned category motion system
    engagement/
      EngagementInvite.tsx        Production invitation template
      model.ts                     Props, defaults, and input resolution
      index.ts                     Template exports
public/
  engagement/                      Invitation images and audio
  templates/                       Original category artwork
docs/
  MVP_PLAN.md                      Product and delivery plan
  RENDERER_DECISION.md             Rendering stack evaluation
  roadmap/                          Sequential product and exploration packets
```

## Run the Next.js app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Next.js application
includes the template gallery, guided editor, live Remotion preview,
server-backed projects, image uploads, render-job status, and MP4 downloads.

## Optional Git-hosted template artwork

Files under `public/` are static assets and are not bundled into the client
JavaScript. By default, Vowframe serves the optimized WebP covers locally and
loads only the artwork a page or composition requests.

The same catalogue can instead resolve template artwork from a Git-backed
origin. Copy `.env.example` to `.env.local` and set both variables to the
commit-pinned URL of the repository's `public/` directory:

```bash
NEXT_PUBLIC_TEMPLATE_ASSET_BASE_URL=https://raw.githubusercontent.com/ORG/REPO/COMMIT_SHA/public
TEMPLATE_ASSET_BASE_URL=https://raw.githubusercontent.com/ORG/REPO/COMMIT_SHA/public
```

The public variable is used by gallery cards and the embedded Player. The
server variable is used by deterministic MP4 renders. Leave both blank for the
local fallback. Use a commit SHA rather than a mutable branch name so old
projects always render against the artwork version they selected.

Git hosting is convenient for this MVP catalogue. For a commercial hosted
release, move artwork to object storage behind a CDN while retaining the same
base-URL contract.

## Local server implementation

For local development, the server uses disk so the whole MVP can run without
external accounts:

| Concern | Local implementation | Production replacement |
| --- | --- | --- |
| Projects and render jobs | `.data/*.json` | PostgreSQL |
| Uploaded photos | `public/uploads/` | Private object storage + signed URLs |
| Rendered MP4s | `public/renders/` | Object storage + expiring downloads |
| Background rendering | In-process Remotion worker | Durable queue + dedicated workers |
| Identity | Single local user | Auth provider and user/tenant checks |

The Next API routes are:

- `GET` / `POST /api/projects`
- `GET` / `PATCH /api/projects/:id`
- `POST /api/uploads`
- `POST /api/renders`
- `GET /api/renders/:id`

The render request snapshots the project props before starting the job. Editing
the invitation while a job is running will not alter that output.

## Remotion Studio and CLI

```bash
npm run remotion:studio
```

The Next.js app is the primary editor. Studio remains useful for motion design,
template work, and inspecting production compositions. Product editing lives
only in Next.js so a Remotion Player is never nested inside a Studio
composition.

The package versions are intentionally pinned because Remotion Studio currently
requires the TypeScript 5 runtime API. Avoid upgrading TypeScript independently
without checking that the installed Remotion release supports it.

## Render invitation templates

Render any design with its sample content:

```bash
npm run render:engagement
npm run render:wedding
npm run render:birthday
npm run render:baby-shower
npm run render:housewarming
```

The scripts render the latest edition (currently V2). Pass personalized
content and an explicit version when reproducing a saved project:

```bash
npm run render:wedding -- --props='{
  "templateId": "wedding-noor",
  "templateVersion": 1,
  "brideName": "Priya",
  "groomName": "Rahul",
  "date": "12 December 2026 · 6 PM",
  "venueName": "The Grand Palace",
  "familyName": "Sharma Family"
}'
```

`coupleLine` is derived from the primary and secondary names unless it is
supplied explicitly. The underlying prop keys remain stable across templates;
the catalogue supplies category-appropriate labels such as guest of honour,
parent-to-be, or host.

Supported invitation props:

| Prop | Type | Purpose |
| --- | --- | --- |
| `brideName` | `string` | First displayed name |
| `groomName` | `string` | Second displayed name |
| `coupleLine` | `string` | Optional complete override for the couple line |
| `saveDateTitle` | `string` | Main invitation heading |
| `eventLine` | `string` | Event label |
| `date` | `string` | Displayed event date |
| `venueName` | `string` | Displayed venue |
| `familyName` | `string` | Hosting family |
| `photoSrc` | `string \| null` | File under `public/`, or `null` |
| `musicSrc` | `string \| null` | File under `public/`, or `null` |
| `showPhoto` | `boolean` | Enables or hides the couple photo |

Rendered files are written to `out/`.

## Original music library

The Sound editor offers five original 30-second cues plus a silent option:

| Track | Suggested use |
| --- | --- |
| Golden Hour | Engagement |
| Moonlit Vows | Wedding |
| Celebration Afterglow | Birthday |
| Little Wonder | Baby shower |
| Morning Courtyard | Housewarming |

The cues are procedurally composed for this project and contain no downloaded
recordings or third-party samples. Each template selects a suitable default,
but every track remains available for every invitation.

## Verification

```bash
npm run typecheck
npm run build
npx remotion compositions src/index.ts
```
