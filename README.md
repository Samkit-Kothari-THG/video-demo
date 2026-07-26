# Video Invite Studio

A full-stack Next.js and Remotion prototype for generating personalized video
invitations from structured user input.

The current production direction is a focused, mobile-first invitation
generator. Earlier animation experiments remain available under `src/demos` as
references for future concept-video templates.

See [the MVP plan](docs/MVP_PLAN.md) for the proposed product scope,
architecture, milestones, and launch criteria.

## Project structure

```text
src/
  index.ts                         Remotion entry point
  root.tsx                         Composition registry
  templates/
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
docs/
  MVP_PLAN.md                      Product and delivery plan
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
template work, and inspecting the retained experiments. `InviteEditor` can
still run in Studio with browser-local fallbacks when the Next API is absent.

The package versions are intentionally pinned because Remotion Studio currently
requires the TypeScript 5 runtime API. Avoid upgrading TypeScript independently
without checking that the installed Remotion release supports it.

## Render the engagement invitation

Render with the sample content:

```bash
npm run render:engagement
```

Render with personalized content:

```bash
npm run render:engagement -- --props='{
  "brideName": "Priya",
  "groomName": "Rahul",
  "date": "12.12.2026",
  "venueName": "The Grand Palace",
  "familyName": "Sharma Family"
}'
```

`coupleLine` is derived from `brideName` and `groomName` unless it is supplied
explicitly.

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
```
