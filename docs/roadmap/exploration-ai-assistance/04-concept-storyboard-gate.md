# AI-04 — Structured concept storyboard and graduation gate

**Status:** Parked  
**Track:** AI-assisted creation exploration  
**Size:** XL  
**Depends on:** AI-01, AI-02 evidence, P3-01, P3-02

## Objective

Test whether structured event inputs can produce a useful, editable concept
video plan using only approved template capabilities and scene primitives, then
decide whether AI assistance graduates into the product roadmap.

## Why this packet exists

Prompt-to-video is compelling in a demo but unrestricted generation conflicts
with deterministic rendering, template quality, safe text fitting, asset
rights, and creator control. A constrained storyboard can test the core promise
without generating executable code or abandoning the versioned template
platform.

## Scope

### Included

- Structured concept brief derived from guided creation inputs.
- Bounded scene-plan schema mapped to template capabilities/primitives.
- Template, scene-order, copy-slot, pacing, palette, and asset-role proposals.
- Feasibility validator and normal Player preview.
- Field/scene-level creator review, apply, edit, undo, and regenerate.
- Offline/human evaluation and controlled product experiment.
- Graduation, revise, or stop decision for the AI track.

### Excluded

- Arbitrary React/Remotion/HTML/CSS/JavaScript generation.
- Uploading or executing model-generated packages.
- Novel transitions/effects outside an approved primitive set.
- Automatically publishing or rendering paid output.
- Generating unreviewed music, celebrity likenesses, or copyrighted characters.
- Replacing the template catalogue with a prompt.

## Technical specification

### Concept brief

Normalize guided inputs into:

- occasion/category and event facts;
- audience and creator-selected tone;
- required/optional content roles;
- available approved assets and consent state;
- output format/duration target;
- locale/script claim;
- accessibility, cultural, and capability constraints.

Facts remain protected and distinct from generated display copy. Do not send
unneeded private assets, guest information, or owner identity.

### Storyboard schema

A proposal contains:

- eligible `templateId + templateVersion` or compatible template family;
- supported format and duration preset;
- ordered scene roles from an allow-list;
- scene primitive IDs and supported variants;
- references to approved input fields/assets by role, not arbitrary URLs;
- proposed editable display-copy values;
- token/palette choices from declared options;
- pacing values within manifest bounds;
- task/prompt/model version and validation result.

No field accepts executable code, raw markup, CSS, asset paths, or unknown
component names.

### Feasibility validator

Before preview or save:

- resolve all IDs against the pinned catalogue/primitive registry;
- verify template capability, format, duration, scene count, and required
  roles;
- preserve protected facts and schema length constraints;
- verify asset ownership/availability and locale/script claims;
- clamp or reject out-of-range pacing/token choices;
- produce actionable field-level errors.

The validated proposal converts to ordinary versioned project commands and
props. Final rendering receives no model call and no unvalidated storyboard.

### Creator experience

- Show a concept summary and normal live preview.
- Highlight proposed scene/copy/style changes.
- Allow apply-all or safe grouped choices without requiring JSON knowledge.
- Undo returns to the exact prior project revision.
- Regeneration starts from current confirmed choices only with clear scope.
- Always provide the standard template-first guided flow as fallback.

### Evaluation and graduation

Compare against deterministic guided creation on:

- time to a valid personalized preview;
- factual/schema validity;
- creator-rated direction quality;
- amount and type of correction;
- template/scene diversity without capability errors;
- render success and visual-regression compliance;
- safety/cultural review;
- latency, cost, abandonment, and support.

Precommit thresholds and a holdout. Graduation requires a meaningful outcome
improvement, acceptable failure/cost, and no new critical safety/privacy issue.
Graduation assigns each capability to a normal Phase 2 or Phase 3 packet; it
does not make the exploration track permanent infrastructure by default.

## Expected code and artifacts

- Concept-brief and storyboard schemas.
- Allow-listed scene/primitive/capability mapping.
- Feasibility/fact/asset validator and deterministic fixture generator.
- Structured proposal/review/apply UI using editor commands.
- Offline evaluation suite and visual render matrix.
- Controlled experiment, cost/support analysis, and graduation report.
- Removal/fallback plan.

## Delivery slices

1. Build deterministic storyboard fixtures and feasibility validator.
2. Evaluate structured generation offline against guided baseline.
3. Add internal proposal/review/apply flow with no publishing.
4. Run opt-in controlled experiment and issue graduate/revise/stop decision.

## Acceptance criteria

- [ ] Model output cannot introduce code, markup, unknown IDs, or external asset
      URLs.
- [ ] Every proposal validates against pinned template/primitive capabilities.
- [ ] Protected event facts cannot change through storyboard generation.
- [ ] Creator previews and confirms all generated project changes.
- [ ] Applied output becomes normal valid project state and renders without AI.
- [ ] Undo and deterministic guided fallback remain complete.
- [ ] Evaluation includes maximum text, missing assets, mixed scripts, and
      culturally sensitive fixtures.
- [ ] Experiment compares completion/correction/render outcomes and cost.
- [ ] A documented graduate/revise/stop decision closes the exploration.

## Test plan

### Automated

- Schema fuzzing and unknown/code/markup/URL rejection tests.
- Capability, fact, asset ownership, locale, pacing, and scene-bound tests.
- Prompt-injection fixtures in every user-controlled text field.
- Command apply/undo/concurrent revision tests.
- Player/final-render parity and visual-regression matrix.
- Timeout, quota, fallback, version trace, and experiment-allocation tests.

### Manual

- Blind compare generated and deterministic concepts with representative
  creators/design reviewers.
- Attempt to force unsupported scenes, assets, formats, facts, and cultural
  assumptions.
- Edit, partially apply, undo, regenerate, switch template, and render.
- Complete the same task with the AI track disabled.
- Review cost, support, privacy, safety, and design-quality findings together.

## Operational expectations

- Track proposal validity, failure category, preview, partial/full apply,
  correction, undo, render result, latency, and cost without content.
- Per-task and global kill switches remain tested.
- No model call occurs in Player or final render.
- New template/primitive versions join evaluation before recommendation.
- Human review and incident findings feed the fixture regression set.

## Rollout and rollback

Internal-only first, then explicit opt-in with a deterministic holdout. Do not
offer the feature near a deadline without clear fallback. Rollback stops new
proposals; previously applied concepts remain ordinary project revisions and
continue to preview/render.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| “AI-generated” output is only random template selection | Compare usefulness and correction against deterministic baseline |
| Model invents unsupported scene/effect | Strict allow-list and feasibility validation |
| Generated plan works in preview but not render | Same catalogue/primitives and visual render matrix |
| User assumes generated facts are verified | Protected facts and explicit review |
| Exploration never reaches a decision | Precommitted thresholds and mandatory graduate/revise/stop gate |

## Completion evidence

Attach schemas/validators, adversarial and render tests, offline evaluation,
creator/design review, controlled experiment, cost/support report, kill-switch
proof, and signed graduation decision with destination packets or removal plan.
