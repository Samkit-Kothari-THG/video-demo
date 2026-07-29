# Vowframe

A full-stack Next.js and Remotion product concept for creating personalized,
cinematic video invitations from structured user input.

The current experience includes a filterable template collection, project
library, guided Story/Photo/Sound editor, live video preview, scene timeline,
truthful autosave states, and server-rendered MP4 exports. Earlier animation
experiments remain available under `src/demos` as references for future
templates.

See [the MVP plan](docs/MVP_PLAN.md) for the proposed product scope,
architecture, milestones, and launch criteria. See
[the renderer decision](docs/RENDERER_DECISION.md) for why the app retains
Remotion behind a template catalogue.

## Invitation collection

| Category | Template | Composition |
| --- | --- | --- |
| Engagement | Marigold Reverie | `EngagementInvite` |
| Wedding | Noor at Midnight | `WeddingNoor` |
| Birthday | Electric Confetti | `BirthdayConfetti` |
| Baby shower | Moonlit Bloom | `BabyShowerMoon` |
| Housewarming | The New Aangan | `HousewarmingAangan` |

Every design has original portrait artwork, category-specific field labels,
motion copy, colour, typography, photo treatment, defaults, and validation.
The same template definition drives the library, editor, Player preview,
project record, and server render.

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
    CategoryInvitation.tsx         Wedding, birthday, baby, and home films
    engagement/
      EngagementInvite.tsx        Production invitation template
      model.ts                     Props, defaults, and input resolution
      index.ts                     Template exports
  demos/
    legacyCompositions.tsx         Early Remotion experiments
    webSlinger.tsx                 Procedural animation experiment
    index.ts                       Demo exports
public/
  engagement/                      Invitation images and audio
  templates/                       Original category artwork
docs/
  MVP_PLAN.md                      Product and delivery plan
  RENDERER_DECISION.md             Rendering stack evaluation
```

## Run the Next.js app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Next.js application
includes the template gallery, guided editor, live Remotion preview,
server-backed projects, image uploads, render-job status, and MP4 downloads.

## Local server implementation

For this prototype, the server uses local disk so the whole MVP can run without
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
template work, and inspecting the retained experiments. Product editing lives
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

Pass personalized content to any script:

```bash
npm run render:wedding -- --props='{
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

## Legacy demo renders

The legacy scripts remain available while their useful animation techniques are
gradually extracted into reusable template components:

```bash
npm run render:hello
npm run render:launch
npm run render:intro
npm run render:fts
npm run render:webslinger
```

## Verification

```bash
npm run typecheck
npm run build
npx remotion compositions src/index.ts
```
