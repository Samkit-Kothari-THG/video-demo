# P3-02 — Design tokens and scene primitives

**Status:** Not started  
**Phase:** 3 — Template platform  
**Size:** XL  
**Depends on:** P3-01

## Objective

Create reusable visual tokens and deterministic scene primitives that speed
template creation while allowing each collection to retain a distinct art
direction.

## Why this packet exists

Copying full compositions for each edition makes typography fitting, timing,
accessibility, and bug fixes inconsistent. Over-generalizing everything into
one generic template would make the catalogue visually repetitive. The
platform needs a deliberate middle layer.

## Scope

### Included

- Foundation and template-level token contracts.
- Reusable scene shells, text/name, media, details, finale, ambient, and
  transition primitives.
- Deterministic timing and seeded decorative motion.
- Responsive fitting/safe-area utilities.
- Incremental migration of compatible V2 editions.
- Escape-hatch policy for bespoke scenes.

### Excluded

- Drag-and-drop scene authoring.
- Removing the bespoke Engagement V1 component.
- Forcing every design through one layout.
- New catalogue volume before primitives are proven.

## Technical specification

### Token layers

Foundation tokens:

- type roles, minimum/maximum scales, line height, tracking;
- spacing, safe areas, radii, stroke, shadow;
- standard semantic colour roles;
- motion durations/easing/intensity multipliers;
- common output-format breakpoints.

Template tokens:

- palette values;
- licensed type pairing IDs;
- frame/media shapes;
- decorative density and marker;
- background treatment;
- per-scene layout variant;
- reviewed motion overrides.

Projects store only user-selectable stable token variant IDs. Raw design tokens
belong to the published template version.

### Primitive set

Initial primitives:

- `SceneShell`: frame, background, overlay, safe area, enter/exit.
- `OpeningTitle`: marker, opening line, event title, date.
- `NameLockup`: category label, primary/secondary/name line.
- `MediaReveal`: slot mask, fallback monogram/illustration, caption.
- `EventDetails`: date, venue, directions-safe text.
- `Finale`: closing line and host.
- `AmbientLayer`: seeded particles/details.
- transition utilities and deterministic timeline hooks.

Primitives receive resolved domain values and tokens; they do not read project
stores, environment variables, or `getInputProps()`.

### Determinism

- No unseeded randomness, current time, browser measurement race, or network
  fetch outside Remotion-safe asset loading.
- Frame calculations derive from the shared scene timeline.
- Text fitting uses declared bounds and deterministic rules.
- Fonts/assets declare load behavior before rendering.

### Bespoke extension

A template may use a custom scene when:

- the art direction cannot be expressed without harmful primitive complexity;
- it still implements scene/capability contracts;
- it has the same fitting, safe-area, and regression coverage;
- rationale is recorded in the authoring review.

## Expected code and artifacts

- Token schemas/resolvers.
- Scene primitive library and documentation/examples.
- Text fitting and safe-area utilities.
- Seeded ambient-motion utility.
- Primitive fixture compositions.
- Migration of selected V2 templates and a bespoke-extension policy.

## Delivery slices

1. Build foundation tokens, `SceneShell`, fitting, and deterministic motion.
2. Build opening/name/details/finale primitives with fixtures.
3. Build media/ambient primitives.
4. Migrate one light, one dark, one bold, and one no-photo edition.
5. Review duplication and migrate remaining compatible V2 editions.

## Acceptance criteria

- [ ] Primitive fixtures cover short, long, optional, and missing content.
- [ ] Migrated templates preserve approved art direction.
- [ ] All random decorative motion is seeded/deterministic.
- [ ] Text stays within safe bounds for declared maximum lengths.
- [ ] Motion-intensity token affects supported primitives consistently.
- [ ] Primitives contain no editor, database, or environment dependencies.
- [ ] Bespoke scenes can coexist through the same manifest/timeline contract.
- [ ] V1 pinned renders remain unchanged.

## Test plan

### Automated

- Token schema/resolver tests.
- Text-fit boundary fixtures.
- Deterministic frame hash/still comparison.
- Scene primitive visual snapshots across light/dark/bold styles.
- Full low-resolution smoke render for migrated templates.
- Static analysis for forbidden state/environment imports.

### Manual

- Art-direction review before/after migration.
- Inspect transitions at full speed and reduced motion.
- Test maximum allowed names, event lines, dates, and venues.
- Review portrait and no-photo fallbacks.

## Operational expectations

- Primitive version/changes are included in release notes when visuals change.
- Rendering performance is benchmarked before and after migration.
- Common fixes land in primitives with regression coverage.
- A primitive change cannot alter a published template silently; use P3-04
  version policy.

## Rollout and rollback

Migrate only new template versions or prove pixel/behavior compatibility before
changing an unpublished version. Keep old runtime components for pinned
projects. Rollback selects the prior runtime entry without changing project
identity.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Primitive becomes overloaded with branches | Prefer layout variants or bespoke scene over template-ID conditionals |
| Refactor changes published output | New template version unless proven compatible by review |
| Catalogue becomes visually samey | Art-direction review and template-owned tokens/layouts |
| Font metrics vary by environment | Pinned licensed fonts and render-load tests |

## Completion evidence

Provide primitive docs, fixtures, determinism tests, before/after renders,
performance comparison, and art-direction approvals.
