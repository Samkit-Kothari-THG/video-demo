# Rendering decision

Date: 29 July 2026

## Decision

Keep Remotion as the render engine for the MVP, but treat it as an
implementation detail behind the template catalogue.

The product needs two outputs from the same React template:

1. A responsive, parameterized preview inside the Next.js editor.
2. A deterministic portrait MP4 created on the server from an immutable props
   snapshot.

Remotion already provides both through
[the Player](https://www.remotion.dev/docs/player),
[parameterized compositions](https://www.remotion.dev/docs/parameterized-rendering),
and [`renderMedia()`](https://www.remotion.dev/docs/renderer/render-media).
The composition root receives input through `getInputProps()`, while an
embedded Player receives values through the component's React props. The
architecture keeps those two paths separate.

## Alternatives considered

| Option | Strength | Why it is not the MVP renderer |
| --- | --- | --- |
| [Motion Canvas](https://motioncanvas.io/docs/) | Excellent TypeScript workflow for explanatory, vector-heavy animation | Its generator model and image-sequence/FFmpeg workflow are better suited to authored motion pieces than this form-driven React product. |
| [Theatre.js](https://www.theatrejs.com/docs/latest/manual/sequences) | Strong visual keyframe and sequence authoring | It is an animation authoring layer, not a complete preview-to-MP4 server pipeline. It could complement a future template studio. |
| [Rive](https://rive.app/docs/editor/exporting/exporting-for-video-and-static-design) | Excellent small, interactive runtime animations | Best for interactive vector assets. Full invitation video export introduces a separate authoring/runtime workflow and does not replace the current server pipeline. |

## Architecture boundary

The catalogue in `src/templates/catalog.ts` owns template IDs, composition IDs,
defaults, fields, covers, validation, and metadata. UI and API code consume the
catalogue instead of branching on Remotion components.

Only two modules know about the render engine:

- `src/root.tsx` registers renderable compositions.
- `src/server/render.ts` selects a composition and creates the MP4.

This makes a future renderer migration incremental. A new engine can implement
preview and export adapters while project records and template schemas remain
stable.

## Hosted production changes

The local renderer is appropriate for the working MVP. A hosted release should
move render execution to durable workers, limit concurrency, persist jobs in a
database, put uploads and outputs in object storage, and add retry/idempotency
rules. Those are deployment concerns rather than reasons to replace the
template renderer.
