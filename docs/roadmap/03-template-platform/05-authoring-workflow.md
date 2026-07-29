# P3-05 — Template authoring workflow and fixtures

**Status:** Not started  
**Phase:** 3 — Template platform  
**Size:** XL  
**Depends on:** P3-02, P3-04, P0-04

## Objective

Create a repeatable, documented path from an approved art direction to a
validated, reviewable template edition with fixtures, optimized assets, rights
evidence, and explicit catalogue registration.

## Why this packet exists

Template quality currently depends on knowing several code paths and manual
checks. Expansion will stall or regress if every author reconstructs the
workflow. Automation should remove mechanical work without silently publishing
or editing the registry.

## Scope

### Included

- Template directory/manifest scaffold command or copyable starter.
- Required fixture matrix.
- Asset optimization and metadata checks.
- Local preview/review route or Studio workflow.
- Rights/provenance checklist.
- Localization, font-coverage, and cultural-review checklist.
- Explicit manual runtime/catalogue registration checklist.
- Publication handoff and author documentation.

### Excluded

- Automatically modifying the production registry.
- Automatically publishing generated artwork.
- Visual drag-and-drop authoring application.
- Public template marketplace.
- Claiming support for every language or culture from a single sample render.
- Automatic translation or transliteration of creator content.

## Technical specification

### Scaffold

Given a safe template ID/category/version, create:

- draft manifest with required sections;
- runtime component/scene entry points as needed;
- token file;
- fixture file;
- empty rights/provenance record;
- test placeholders and author checklist.

The command validates inputs, refuses existing targets, and prints the manual
registration steps. It does not edit the central registry automatically.

### Required fixtures

Every edition includes:

- defaults/catalogue sample;
- shortest valid names/copy;
- maximum allowed text lengths;
- one/zero secondary name where category allows;
- photo center and crop extremes;
- no-photo fallback;
- audio and silent;
- each supported duration/format;
- style-token extremes;
- non-Latin/translation fixture when claimed as supported.

Fixtures contain licensed/internal test assets and no private user content.

### Localization and cultural review

Each template version declares the locale and script combinations it has
actually been reviewed to support. A broad category label such as “Indian
wedding” is not a language-support claim.

- Preserve Unicode end to end and use BCP 47 locale identifiers where locale
  behavior is declared.
- Count, truncate, and fit user-visible text by grapheme-aware behavior rather
  than UTF-16 code units.
- Avoid forced uppercase, letter spacing, or word-breaking rules for scripts
  where the treatment is invalid.
- Isolate user content correctly in bidirectional layouts and test mixed
  left-to-right/right-to-left strings.
- Load render-deterministic fonts with documented glyph coverage, license, and
  fallback order; Player and final render must resolve the same files.
- Keep stored event times canonical and format dates/times using the chosen
  locale and event time zone.
- Treat translation and transliteration as explicit creator-reviewed content,
  never an invisible template transform.

Required fixtures for every claimed locale/script include representative short
and long names, combining marks, numerals, date/time, venue text, and fallback
glyph detection. Templates claiming RTL support also include mirrored-layout
review where direction affects composition.

Occasion-specific copy, symbols, colors, rituals, family roles, and sequencing
require a named reviewer familiar with the represented context. Record what
was reviewed, by whom, and which variations remain outside the claim. One
reviewer does not certify an entire country, religion, or diaspora.

### Artwork and assets

- Record source, creator/tool, prompt summary where applicable, license, and
  reviewer.
- Optimize final assets to reviewed formats/dimensions.
- Retain editable/source material according to design operations policy,
  outside the runtime bundle where appropriate.
- No text/logos/watermarks baked into backgrounds unless explicitly designed
  and rights-cleared.
- Check focal/safe regions for every supported format.

### Review workflow

1. Art-direction brief and target audience.
2. Manifest/capability draft.
3. Runtime implementation using primitives/bespoke rationale.
4. Fixture and local preview review.
5. Full format/preset regression.
6. Content, localization, cultural, accessibility, rights, and performance
   review.
7. Explicit registry entry pull request.
8. Internal state, then publication through P3-04.

## Expected code and artifacts

- Safe scaffold script/template.
- Authoring guide and checklist.
- Fixture schema/helpers and sample package.
- Asset optimization/inspection command.
- Local gallery/Studio review surface.
- Rights/provenance template.
- Locale/script capability fields, fixture guidance, and glyph-coverage check.
- Cultural-review record and supported-claim checklist.
- Manual registration and publication instructions.

## Delivery slices

1. Document current successful template workflow and required evidence.
2. Add scaffold and fixture helpers without registry mutation.
3. Add asset, font/glyph, locale, and review-surface checks.
4. Author one new internal edition end to end, including a declared
   locale/script claim, and refine documentation.

## Acceptance criteria

- [ ] A contributor can create a valid draft package from documentation.
- [ ] Scaffold never overwrites files or changes central registry.
- [ ] Missing fixtures, rights data, assets, or capabilities fail validation.
- [ ] Optimized runtime assets meet documented size/format expectations.
- [ ] Preview surface covers every declared format/preset/fixture.
- [ ] Registration and publication require explicit review.
- [ ] No fixture contains real private user data.
- [ ] Locale/script claims are explicit, versioned, and backed by fixtures.
- [ ] Player and final render use the same licensed font files and fallbacks.
- [ ] Grapheme, bidirectional, long-copy, and missing-glyph cases fail visibly
      in validation rather than shipping silently.
- [ ] Cultural review records a named reviewer, scope, and known limitations.
- [ ] Templates do not silently translate or transliterate creator input.
- [ ] One new edition completes the workflow without undocumented steps.

## Test plan

### Automated

- Scaffold safe-input, collision, deterministic-output, and no-registry-change
  tests.
- Fixture completeness validator tests.
- Asset dimensions/type/size and baked-text checklist hooks.
- Font license, glyph-coverage, deterministic-load, and fallback tests.
- Locale/date/time-zone, grapheme, bidirectional, and mixed-script fixture
  tests for every declared claim.
- Manifest/runtime/rights validation.
- End-to-end test package build.

### Manual

- A contributor unfamiliar with the implementation follows the guide.
- Review all fixtures in local gallery/Studio.
- Inspect generated and sourced asset provenance.
- Review claimed scripts on real devices and final renders with a qualified
  language/cultural reviewer.
- Check date, time, family-role, symbol, ritual, and copy assumptions for each
  claimed occasion context.
- Run publication handoff in staging.

## Operational expectations

- Authoring tool version is recorded with the template package.
- Runtime assets remain traceable to provenance/rights records.
- Template production time and review failures are measured.
- Source art storage and runtime delivery are intentionally separate.
- Locale/script/cultural claims are searchable by template version and can be
  withdrawn for new selection without breaking pinned projects.

## Rollout and rollback

Use the workflow first for internal templates. Existing editions need not be
re-scaffolded, but must gain fixture/rights records before major updates.
Rollback removes tooling commands, not already published packages or evidence.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Scaffold creates generic-looking designs | It scaffolds contracts/tests, not art direction |
| Automatic registry introduces unwanted templates | Registry remains explicit/manual by design |
| AI artwork lacks rights/provenance | Required tool/prompt/reviewer record before publication |
| Fixture matrix becomes burdensome | Generate mechanical cases from schemas, retain human visual review |
| One localized sample is treated as broad support | Versioned locale/script claims with explicit limits |
| Font fallback changes layout between Player/render | Ship licensed deterministic fonts and test glyph coverage |
| Cultural review becomes token approval | Record reviewer scope, dissent, and unsupported variations |

## Completion evidence

Attach scaffold tests, author guide, contributor trial notes, complete internal
template package, provenance record, locale/glyph evidence, cultural-review
record, and manual registration review.
