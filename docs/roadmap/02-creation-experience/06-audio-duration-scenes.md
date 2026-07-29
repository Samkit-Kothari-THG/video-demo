# P2-06 — Audio, duration, and scene controls

**Status:** Not started  
**Phase:** 2 — Better creation experience  
**Size:** XL  
**Depends on:** P2-02; P3-01 is strongly recommended first

## Objective

Allow controlled personalization of soundtrack, pacing, scene visibility, and
supported ordering without exposing arbitrary timeline/keyframe editing.

## Why this packet exists

Users need short social cuts, silent exports, and occasion-specific emphasis.
Implementing these as template-ID branches would make duration math and
preview/render parity increasingly fragile.

## Scope

### Included

- Licensed curated soundtrack catalogue.
- Track preview, no-audio option, volume, and template-owned fade policy.
- Template-declared duration presets.
- Optional-scene visibility and constrained scene ordering.
- Timeline UI driven by stable scene IDs and capability rules.
- Duration/audio data in immutable render snapshots.

### Excluded

- User-uploaded copyrighted audio in the initial release.
- Waveform cutting, arbitrary trim, keyframes, or frame-level timing.
- Arbitrary scene creation.
- Multi-track mixing and voiceover.

## Technical specification

### Audio catalogue

Each track declares:

- stable ID, display name, duration, preview asset and render asset;
- rights/source and allowed product/geography/use;
- loudness/normalization metadata;
- active/deprecated status.

Projects store track ID, normalized volume within allowed bounds, and an
explicit silent choice. Raw URLs are resolved server-side.

### Duration presets

Templates declare named presets such as 15s, 30s, and 45s with:

- fps and total frames;
- included/default scene order;
- per-scene frame allocation or timing strategy;
- supported transitions;
- audio fit/fade behavior.

Client values outside the declaration are rejected. Existing V1/V2 projects
default to the current 30-second preset.

### Scene model

Stable scene definitions include:

- scene ID, label, required/optional;
- supported presets;
- dependencies (for example, photo scene requires a ready placement or
  declared fallback);
- allowed predecessors/successors or reviewed order variants;
- editable fields/regions and focus frame;
- minimum/maximum frame allocation where applicable.

Users can hide only optional scenes and choose only valid orders. Required
opening/details/finale constraints remain template-owned.

### Timeline derivation

A pure resolver converts template version, preset, scene selections, and
project document into a concrete frame timeline. Player, composition metadata,
still selection, and worker rendering use the same resolver.

## Expected code and artifacts

- Audio, duration-preset, and scene capability schemas.
- Shared timeline resolver with exhaustive tests.
- Soundtrack browser/player and volume/no-audio commands.
- Constrained scene controls and timeline.
- Renderer input/output-duration integration.
- Rights metadata and content operations process.

## Delivery slices

1. Formalize current five scenes and 30-second preset in one template.
2. Add soundtrack catalogue and audio controls.
3. Add 15-second preset and optional visibility.
4. Add reviewed order variants/45-second preset where designs support them.
5. Roll across catalogue with regression renders.

## Acceptance criteria

- [ ] Player duration and server composition duration match the selected preset.
- [ ] Scene controls expose only template-supported choices.
- [ ] Invalid order, hidden required scene, and unknown audio IDs are rejected.
- [ ] Silent, volume, and fades match between preview and output.
- [ ] A 15-second export contains required event information.
- [ ] Existing projects retain current 30-second behavior.
- [ ] Every track has recorded usage rights.
- [ ] Timeline changes support undo, autosave, revisions, and snapshots.

## Test plan

### Automated

- Timeline resolver tests for every preset/allowed order.
- Invariant/property tests: contiguous frames, no overlap/gap, exact duration.
- Audio allow-list, volume clamp, and deprecated-track tests.
- Scene dependency/required validation.
- Composition metadata and full low-resolution render smoke tests.

### Manual

- Preview and render silent/low/full volume.
- Verify meaningful 15/30/45-second outputs.
- Test scene controls on mobile and keyboard.
- Review transition rhythm and required information with design/content owner.

## Operational expectations

- Track preset/scene/audio selection without logging invitation content.
- Render metrics include preset and total frames.
- Track deprecation never breaks pinned projects; retained render asset or
  explicit migration is required.
- Audio preview failure does not invalidate a silent export.

## Rollout and rollback

Capabilities are opt-in per template/version. Begin with one V2 edition and
retain the implicit 30-second fallback. Rollback hides controls while preserving
stored values and deterministic rendering.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Scene combinations multiply regression surface | Allow reviewed variants, not arbitrary permutations |
| Preview audio blocked by browser policy | User-initiated playback and explicit silent state |
| Track rights change | Deprecation policy and retained rights evidence |
| Duration diverges between Player and render | Shared timeline and composition metadata resolver |

## Completion evidence

Provide capability matrices, rights records, timeline invariant tests, full
smoke renders for each preset, and mobile timeline QA.
