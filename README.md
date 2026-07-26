# Video Invite Studio

A Remotion prototype for generating personalized video invitations from
structured user input.

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

## Setup

```bash
npm install
npm run dev
```

Remotion Studio will show the production invitation and retained demos.

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
```
