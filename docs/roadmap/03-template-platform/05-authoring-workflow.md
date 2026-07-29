# P3-05 — Template authoring workflow and fixtures

**Status:** Not started  
**Phase:** 3 — Template platform  
**Size:** L  
**Depends on:** P3-02, P3-04

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
- Explicit manual runtime/catalogue registration checklist.
- Publication handoff and author documentation.

### Excluded

- Automatically modifying the production registry.
- Automatically publishing generated artwork.
- Visual drag-and-drop authoring application.
- Public template marketplace.

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
6. Content, accessibility, rights, and performance review.
7. Explicit registry entry pull request.
8. Internal state, then publication through P3-04.

## Expected code and artifacts

- Safe scaffold script/template.
- Authoring guide and checklist.
- Fixture schema/helpers and sample package.
- Asset optimization/inspection command.
- Local gallery/Studio review surface.
- Rights/provenance template.
- Manual registration and publication instructions.

## Delivery slices

1. Document current successful template workflow and required evidence.
2. Add scaffold and fixture helpers without registry mutation.
3. Add asset checks and review surface.
4. Author one new internal edition end to end and refine documentation.

## Acceptance criteria

- [ ] A contributor can create a valid draft package from documentation.
- [ ] Scaffold never overwrites files or changes central registry.
- [ ] Missing fixtures, rights data, assets, or capabilities fail validation.
- [ ] Optimized runtime assets meet documented size/format expectations.
- [ ] Preview surface covers every declared format/preset/fixture.
- [ ] Registration and publication require explicit review.
- [ ] No fixture contains real private user data.
- [ ] One new edition completes the workflow without undocumented steps.

## Test plan

### Automated

- Scaffold safe-input, collision, deterministic-output, and no-registry-change
  tests.
- Fixture completeness validator tests.
- Asset dimensions/type/size and baked-text checklist hooks.
- Manifest/runtime/rights validation.
- End-to-end test package build.

### Manual

- A contributor unfamiliar with the implementation follows the guide.
- Review all fixtures in local gallery/Studio.
- Inspect generated and sourced asset provenance.
- Run publication handoff in staging.

## Operational expectations

- Authoring tool version is recorded with the template package.
- Runtime assets remain traceable to provenance/rights records.
- Template production time and review failures are measured.
- Source art storage and runtime delivery are intentionally separate.

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

## Completion evidence

Attach scaffold tests, author guide, contributor trial notes, complete internal
template package, provenance record, and manual registration review.
