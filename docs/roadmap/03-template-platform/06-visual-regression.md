# P3-06 — Visual regression and template CI

**Status:** Not started  
**Phase:** 3 — Template platform  
**Size:** XL  
**Depends on:** P3-03, P3-05

## Objective

Automatically detect layout, asset, timing, and compatibility regressions
across template versions, fixtures, formats, and duration presets before they
reach production.

## Why this packet exists

Type checking cannot detect cropped dates, font changes, missing artwork,
incorrect scene timing, or preview/render divergence. The expanding capability
matrix makes manual-only verification unreliable.

## Scope

### Included

- Manifest-driven visual test matrix.
- Deterministic still baselines at representative frames.
- Low-resolution full-timeline smoke renders.
- Player/render content and geometry parity checks where practical.
- Baseline review/update workflow.
- CI sharding, artifacts, and performance budgets.

### Excluded

- Treating pixel differences as automatic design approval.
- Full-resolution video render for every fixture on every pull request.
- Browser support testing unrelated to template output.

## Technical specification

### Matrix generation

Generate cases from published/internal manifests:

- each template identity/version;
- required fixture set;
- each supported format;
- each duration preset and allowed scene variant;
- representative style/media/audio states.

Use tiering:

- Tier 1 per pull request: critical stills, schema/invariants, selected full
  timeline smoke.
- Tier 2 nightly/release: expanded fixture/format matrix.
- Tier 3 publication: full required matrix and final-size representative
  outputs.

### Still baselines

- Templates declare meaningful frame/scene checkpoints.
- Renderer, browser version, fonts, and seed inputs are pinned.
- Compare images with documented tolerance and emit diff artifacts.
- Mask only proven nondeterministic infrastructure regions; template output
  should be deterministic.
- A changed baseline requires before/diff/after review and reason.

### Timeline smoke

- Render every frame at reduced scale for required preset variants.
- Fail on asset/font load errors, runtime exceptions, invalid duration, missing
  frames, or encoder failure.
- Sample frames verify required scenes appear and final information is present.
- Publication/release adds selected production-size encodes.

### Compatibility

- Historical fixture projects remain in the suite.
- Old template/version baselines are not rewritten when a new version is added.
- Runtime removal fails when active supported versions lose coverage.
- Template performance metrics compare render time/memory against budget.

## Expected code and artifacts

- Manifest-to-test-matrix generator.
- Deterministic still renderer and comparison tooling.
- Low-resolution full render smoke command.
- Baseline/diff artifact storage policy.
- CI jobs with sharding/cache and publication gate.
- Baseline review documentation and ownership.

## Delivery slices

1. Add deterministic still baselines for current ten editions.
2. Generate fixture/format matrix and diff artifacts.
3. Add full-timeline smoke and performance tracking.
4. Add nightly/release tiers and publication enforcement.

## Acceptance criteria

- [ ] Every supported template version has required still coverage.
- [ ] Every supported format/preset has at least one full-timeline smoke.
- [ ] Missing assets/fonts and render exceptions fail CI.
- [ ] Baseline updates require visible diff and reviewer reason.
- [ ] Historical baselines remain unchanged when publishing a new version.
- [ ] CI artifacts identify template/version/fixture/format/frame.
- [ ] Pull-request runtime stays within an agreed budget through sharding.
- [ ] Performance regression threshold is measured and enforced.

## Test plan

### Automated

- Matrix completeness and stable case-ID tests.
- Comparator behavior using known identical/changed images.
- Seed determinism and pinned-font tests.
- Intentional missing-asset/runtime-error failures.
- Historical-version removal guard.
- CI shard completeness.

### Manual

- Review deliberate typography, crop, timing, and colour changes.
- Run publication tier for a new internal edition.
- Restore baselines/artifacts from storage.
- Compare Player and render at selected frames.

## Operational expectations

- Baseline/artifact storage retention and access are documented.
- Nightly failures have an owner and do not remain ignored.
- Render-time trends can be grouped by primitive/template/release.
- Publication is blocked by missing required evidence.

## Rollout and rollback

Begin informationally, establish stable baselines, then make invariant/runtime
failures blocking before pixel diffs. Promote reliable diff cases to blocking
gradually. Rollback may make flaky comparisons informational, but manifest,
asset, and historical compatibility checks remain required.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Pixel tests are flaky | Pin environment/assets/fonts/seeds and fix nondeterminism |
| Matrix becomes too expensive | Tier, shard, cache, and prioritize without losing publication coverage |
| Team approves baselines blindly | Require named reviewer and visual artifacts |
| Test baseline stores copyrighted/private assets | Use approved fixtures and controlled artifact access |

## Completion evidence

Attach matrix coverage report, CI timings, intentional-failure examples,
diff-review record, full smoke outputs, and performance baseline.
