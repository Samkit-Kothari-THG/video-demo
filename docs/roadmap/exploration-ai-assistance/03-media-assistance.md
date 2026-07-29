# AI-03 — Media assistance and generated artwork

**Status:** Parked  
**Track:** AI-assisted creation exploration  
**Size:** XL  
**Depends on:** AI-01, P0-04, P1-04, P2-05, P3-05

## Objective

Evaluate and, where justified, add privacy-safe assistance for crop/focal
selection and optional decorative artwork generation while preserving the
original upload, human choice, asset provenance, and deterministic rendering.

## Why this packet exists

Media preparation is a real source of friction, but images of couples,
families, and children are among the most sensitive product inputs. Crop
recommendation is not equivalent in risk to sending a face to a generative
service. Generated assets also introduce rights, cultural, moderation, cost,
and reproducibility concerns that cannot be hidden inside the upload flow.

## Scope

### Included

- Separate risk/consent flows for local analysis and external processing.
- Crop, focal-point, and format-safe-region suggestions.
- Optional background cleanup only after quality/privacy evaluation.
- Optional generation of decorative, non-identifying artwork.
- Original/derived asset lineage, provenance, review, and deletion.
- Moderation and P3-05 publication handoff for reusable template artwork.
- Cost/latency limits and non-AI manual fallback.

### Excluded

- Face replacement, identity synthesis, age transformation, or deepfakes.
- Training on user uploads.
- Generating a real person's likeness from text.
- Automatically replacing the original photo.
- Publishing generated template art without human rights/cultural review.
- Claiming an asset is legally safe solely because a provider generated it.

## Technical specification

### Capability tiers

Treat independently:

1. deterministic/manual crop with existing focal controls;
2. local or privacy-approved subject/focal suggestion;
3. background removal/cleanup derivative;
4. decorative artwork generation from structured art direction;
5. user-photo generative transformation, initially unsupported.

Each tier has its own entry evidence, consent, processor, retention, evaluation,
and kill switch.

### Asset lineage

Store:

- original private asset ID/checksum;
- derived asset ID/checksum and operation type;
- source asset reference;
- task/provider/model/configuration version where applicable;
- consent/notice version;
- creator selection status;
- provenance and moderation outcome;
- created/expiry/deletion state.

Never overwrite the original. Template/render props reference the explicitly
selected derivative or original. Deleting an original follows documented
derived-output and publication retention rules.

### Crop/focal suggestion

- Produce normalized focal point and optional crop rectangles per declared
  format.
- Validate coordinates and safe-region compatibility locally.
- Show before/after and allow manual correction.
- Apply through normal media-edit commands and preserve undo.
- Evaluate subject preservation, face/important-content clipping, multi-person
  composition, dark/low-resolution input, and no-subject fallback.

Do not infer who is important from demographics. When confidence is low or
several subjects conflict, retain manual controls and explain the limitation.

### Generated decorative artwork

Use a structured art-direction task with category, palette, texture, format
safe zones, and prohibited elements. Generated backgrounds must avoid baked-in
names, dates, legible text, brands, watermarks, identifiable persons, and
unreviewed cultural/religious symbols.

Before user or catalogue use:

- run provider and product moderation;
- record prompt summary/tool/model and reference inputs;
- inspect similarity/rights concerns under P0-04;
- conduct human visual and cultural review;
- optimize and checksum the approved file;
- declare whether it is project-specific or reusable template art.

Reusable artwork enters the manual P3-05 registry/publication process and P3-06
visual CI. Generation never publishes it directly.

### Processing privacy

- Explain what asset is processed, by whom/category, for what purpose, and
  expected retention before external processing.
- Prefer the minimum-resolution derivative needed for the task.
- Use private signed worker access, not public URLs.
- Do not include account/event/guest metadata in provider requests.
- Respect opt-out and allow deletion requests to traverse derived assets.

## Expected code and artifacts

- Tiered media-assistance decision and processor threat review.
- Asset-lineage/provenance schema and migrations.
- Crop/focal task contract, evaluation set, preview/apply UI, and fallback.
- Optional derivative/generation worker behind separate flags.
- Rights/moderation/cultural review checklist and evidence store.
- Deletion/reconciliation jobs, metrics, budget, and incident runbook.

## Delivery slices

1. Benchmark manual focal controls and implement asset lineage.
2. Evaluate crop/focal suggestions on rights-cleared representative fixtures.
3. Run opt-in focal assistance with original/undo/fallback preserved.
4. Separately prototype decorative generation internally and gate catalogue or
   project use through P0-04/P3-05 evidence.

## Acceptance criteria

- [ ] Original assets are immutable and recoverable while retention allows.
- [ ] Every derivative has source, operation, version, consent, and deletion
      lineage.
- [ ] Suggested crops are previewed and manually adjustable before apply.
- [ ] Low-confidence/multi-subject cases fall back safely.
- [ ] External processing is opt-in where required and uses no public asset URL.
- [ ] Unsupported face/identity transformations are rejected.
- [ ] Generated artwork receives moderation, provenance, rights, and cultural
      review before use.
- [ ] Reusable generated art follows manual P3-05 registration/publication.
- [ ] Non-AI media editing remains complete when all assistance is disabled.

## Test plan

### Automated

- Coordinate/schema/safe-region and multi-format crop tests.
- Asset lineage, authorization, signed-access, retention, and cascading
  deletion/reconciliation tests.
- Timeout, low-confidence, processor failure, and manual-fallback tests.
- Provenance/moderation requirement tests for generated assets.
- Prohibited prompt/output metadata and analytics-redaction tests.

### Manual

- Review diverse single/multi-person, child, low-light, and no-subject fixtures.
- Compare Player and final render for selected derived assets.
- Inspect network/storage/logs for public URLs or unrelated metadata.
- Exercise opt-out, deletion, processor outage, and moderation escalation.
- Conduct human visual/rights/cultural review of generated-art prototypes.

## Operational expectations

- Monitor operation tier, success, latency, cost, confidence bucket, apply,
  manual correction, rejection, moderation, deletion lag, and processor errors.
- Keep image pixels and prompts out of normal logs/analytics.
- A per-tier kill switch stops new processing without breaking existing
  selected assets.
- Rights/provenance evidence remains for the asset support lifetime.

## Rollout and rollback

Crop/focal assistance may graduate independently from generation. Begin with
rights-cleared fixtures, internal users, then explicit opt-in. Rollback disables
new processing and falls back to manual controls; selected derivatives remain
renderable until the creator switches or retention/deletion policy applies.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Sensitive family photo reaches external processor | Separate consent, minimization, private transport, and opt-out |
| Crop algorithm removes an important person | Confidence gate, preview, multi-subject fixtures, manual control |
| Generated art carries rights/cultural issue | Provenance plus human rights/cultural review |
| Derivative survives original deletion unexpectedly | Explicit lineage and tested deletion policy |
| AI media becomes required for quality | Maintain complete manual crop/focal workflow |

## Completion evidence

Attach tier decision, threat/privacy review, lineage tests, crop evaluation and
creator findings, network/log inspection, deletion exercise, generated-art
rights/moderation review if attempted, cost report, and per-tier graduation
decision.
