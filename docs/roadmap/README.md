# Vowframe expansion roadmap

This directory turns the Vowframe product roadmap into sequential,
implementation-ready work packets. It covers product proof through the
template platform, keeps publishing/business work parked behind evidence
gates, and isolates optional AI assistance in a separate exploration track. A
packet is intended to be small enough to assign to one owner, pause, review,
and resume without reinterpreting the full roadmap.

The roadmap begins from the current local MVP:

- Next.js owns the product UI and application API.
- The versioned catalogue owns template metadata and validation.
- Remotion is isolated behind the preview and render boundaries.
- JSON files, public-disk uploads, and the in-process renderer are local MVP
  implementations that must not be treated as production infrastructure.

## How to use these packets

1. Pick the earliest unblocked packet from the sequence table.
2. Confirm its prerequisites and any recorded decision points.
3. Create a focused branch and implementation plan for that packet only.
4. Implement the listed scope and tests.
5. Record material architecture decisions in `docs/decisions/`.
6. Update the packet status and evidence before moving to the next packet.

Packet status values:

- `Not started`
- `Parked` — specified but deliberately ineligible until its entry gate passes
- `In progress`
- `Blocked`
- `In review`
- `Complete`

Completion means every acceptance criterion is met or an explicitly documented
exception has been approved. Merging code without operational evidence does
not complete a production-foundation packet.

## Sequence

### Phase 0 — Product proof

| Sequence | Packet | Outcome | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| P0-01 | [Product wedge and target user](00-product-validation/01-product-wedge.md) | Testable primary user, job, promise, and non-goals | Current MVP | M | Not started |
| P0-02 | [Validation plan and success metrics](00-product-validation/02-validation-metrics.md) | Evidence-based activation and usability gate | P0-01 | L | Not started |
| P0-03 | [Unit economics and capacity envelope](00-product-validation/03-unit-economics-capacity.md) | Cost, quota, latency, and capacity budgets | P0-01, P0-02 | M | Not started |
| P0-04 | [Content rights, trust, and Phase 0 gate](00-product-validation/04-content-rights-trust-gate.md) | Privacy/rights contract and proceed decision | P0-01 through P0-03 | L | Not started |

### Phase 1 — Production foundation

| Sequence | Packet | Outcome | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| P1-01 | [Architecture baseline and configuration](01-production-foundation/01-architecture-baseline.md) | Production boundaries and configuration contract | Phase 0 gate, current MVP | M | Not started |
| P1-02 | [PostgreSQL persistence and migrations](01-production-foundation/02-postgres-persistence.md) | Durable projects and render records | P1-01 | L | Not started |
| P1-03 | [Authentication and authorization](01-production-foundation/03-auth-and-authorization.md) | Tenant-safe project access | P1-02 | L | Not started |
| P1-04 | [Object storage and asset lifecycle](01-production-foundation/04-object-storage.md) | Private, render-safe uploads and outputs | P1-01, P1-03 | L | Not started |
| P1-05 | [Durable render queue and worker](01-production-foundation/05-render-queue-worker.md) | Rendering survives web-process restarts | P1-02, P1-04 | XL | Not started |
| P1-06 | [Render reliability and idempotency](01-production-foundation/06-render-reliability.md) | Safe retry, cancellation, and reconciliation | P1-05 | L | Not started |
| P1-07 | [Observability, analytics, and support](01-production-foundation/07-observability-support.md) | Actionable product, cost, and production signals | P0-02, P0-03, P1-02, P1-05 | L | Not started |
| P1-08 | [Security, privacy, deployment, and beta gate](01-production-foundation/08-production-gate.md) | Production beta readiness | P0-04, P1-01 through P1-07 | XL | Not started |

### Phase 2 — Better creation experience

| Sequence | Packet | Outcome | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| P2-01 | [Guided creation brief](02-creation-experience/01-guided-creation.md) | Faster path from occasion to populated draft | Phase 1 gate, P0-01, P0-02 | L | Not started |
| P2-02 | [Editor command model and undo/redo](02-creation-experience/02-editor-command-model.md) | Predictable, reversible client editing | P2-01 | L | Not started |
| P2-03 | [Project revisions and recovery](02-creation-experience/03-project-revisions.md) | Durable history and crash recovery | P1-02, P2-02 | L | Not started |
| P2-04 | [Inline preview editing and style controls](02-creation-experience/04-inline-editing.md) | Direct manipulation without becoming free-form | P2-02 | XL | Not started |
| P2-05 | [Media editing experience](02-creation-experience/05-media-editing.md) | Reliable upload, crop, zoom, and focal point | P1-04, P2-02 | L | Not started |
| P2-06 | [Audio, duration, and scene controls](02-creation-experience/06-audio-duration-scenes.md) | Controlled personalization of pacing | P2-02, P3-01 recommended | XL | Not started |
| P2-07 | [Shareable previews and static export](02-creation-experience/07-sharing-static-export.md) | Review and share before or without MP4 | P1-04, P1-03 | L | Not started |
| P2-08 | [Accessibility, mobile, performance, and phase gate](02-creation-experience/08-experience-gate.md) | Creation flow ready for external users | P0-02, P2-01 through P2-07 | XL | Not started |

### Phase 3 — Template platform

| Sequence | Packet | Outcome | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| P3-01 | [Template manifest v2](03-template-platform/01-template-manifest-v2.md) | Formal render and capability contract | Phase 1 gate | L | Not started |
| P3-02 | [Design tokens and scene primitives](03-template-platform/02-tokens-scene-primitives.md) | Reusable visual and motion building blocks | P3-01 | XL | Not started |
| P3-03 | [Multi-format output model](03-template-platform/03-multi-format-output.md) | 9:16, 4:5, 1:1, and static variants | P3-01, P3-02 | XL | Not started |
| P3-04 | [Versioning, migration, and deprecation](03-template-platform/04-versioning-deprecation.md) | Long-term template compatibility | P3-01 | L | Not started |
| P3-05 | [Template authoring workflow, localization, and fixtures](03-template-platform/05-authoring-workflow.md) | Repeatable, rights- and locale-aware path to catalogue | P3-02, P3-04, P0-04 | XL | Not started |
| P3-06 | [Visual regression and template CI](03-template-platform/06-visual-regression.md) | Automated protection against visual breakage | P3-03, P3-05 | XL | Not started |
| P3-07 | [Collection expansion and phase gate](03-template-platform/07-collection-expansion.md) | 25–30 maintainable invitation editions | P3-01 through P3-06 | XL | Not started |

### Phase 4 — Publishing and business

Phase 4 is deliberately parked. Do not start it merely because a packet is
detailed; its Phase 0, external-use, and willingness-to-pay entry evidence must
exist.

| Sequence | Packet | Outcome | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| P4-01 | [Publishing lifecycle and delivery channels](04-publishing-and-business/01-publishing-lifecycle.md) | Stable, versioned, private-by-default hosted invitation | Phase 2 gate, P2-07, P3-03 | XL | Parked |
| P4-02 | [RSVP and guest lifecycle](04-publishing-and-business/02-rsvp-guest-lifecycle.md) | Privacy-safe guest responses and host operations | P4-01, P1-03, P0-04 | XL | Parked |
| P4-03 | [Billing, entitlements, and quotas](04-publishing-and-business/03-billing-entitlements.md) | Reconciled commercial access and usage accounting | P0-03, Phase 1 gate, pricing evidence | XL | Parked |
| P4-04 | [Administration and support operations](04-publishing-and-business/04-admin-support-operations.md) | Narrow, audited production support tools | P1-07, P1-08, P4-01 | L | Parked |
| P4-05 | [Collaboration decision and Phase 4 gate](04-publishing-and-business/05-collaboration-decision-gate.md) | Evidence-based workspace choice and operating gate | P4-01 through P4-04 | XL/M | Parked |

### Exploration — AI-assisted creation

This is not a numbered product phase or a dependency of the non-AI core.
Packets graduate only after meeting their evaluation gate.

| Sequence | Packet | Outcome | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| AI-01 | [AI value, evaluation, and governance baseline](exploration-ai-assistance/01-evaluation-governance.md) | Task, evaluation, privacy, cost, and gateway contract | Phase 0 gate, named friction | L | Parked |
| AI-02 | [Copy and template recommendation assistance](exploration-ai-assistance/02-copy-template-assistance.md) | Fact-preserving, optional structured suggestions | AI-01, P2-01, P3-01 | L | Parked |
| AI-03 | [Media assistance and generated artwork](exploration-ai-assistance/03-media-assistance.md) | Tiered crop/art assistance with provenance | AI-01, P0-04, P1-04, P2-05, P3-05 | XL | Parked |
| AI-04 | [Structured concept storyboard and graduation gate](exploration-ai-assistance/04-concept-storyboard-gate.md) | Constrained input-to-concept experiment and decision | AI-01, AI-02, P3-01, P3-02 | XL | Parked |

Sizes are relative:

- `M`: normally one focused implementation slice.
- `L`: several connected slices with migration or integration work.
- `XL`: must be subdivided into pull requests while retaining one packet owner.

## Dependency policy

- Complete Phase 0 before provisioning the production path. A `proceed with
  constraints` decision is valid only when each constraint has an owner and
  destination packet.
- Phase 1 is the production-critical path and should normally be completed in
  sequence.
- P1-03 and P1-04 can overlap after the database ownership model is stable.
- Phase 2 may begin after the Phase 1 gate. Do not build revision history on
  the local JSON store.
- P3-01 can run alongside early Phase 2 work after Phase 1. P2-06 should consume
  the capability contract from P3-01 instead of adding template-specific
  branches.
- Phase 4 remains parked until external usage supports publishing/RSVP and
  P0-03 supports the commercial envelope. Collaboration has an additional
  evidence gate in P4-05.
- AI work never blocks the deterministic core. AI-01 can begin only for a
  named P0-02 friction point; each later task remains independently removable.
- A later packet may be pulled forward only when it does not create a second
  source of truth or bypass a prerequisite security boundary.

## Phase gates

### Phase 0 gate

- One primary user, core job, first-value moment, and product non-goals are
  explicit.
- Usability thresholds and observed evidence support proceeding or name a
  bounded repeat.
- Render/storage/delivery budgets and quota assumptions are recorded.
- Data, asset, rights, consent, retention, and sharing expectations have named
  owners.
- Every unresolved constraint maps to a later packet and deadline.

### Phase 1 gate

- Authenticated users can access only their own projects and assets.
- Production does not depend on `.data/`, `public/uploads`, or
  `public/renders`.
- Every render reaches a terminal state or is reconciled automatically.
- Uploads and downloads use private object storage with scoped access.
- Operators can find a failed render by user, project, or job identifier.
- Restore, rollback, retention, and incident procedures have been exercised.

### Phase 2 gate

- A first-time user can create a satisfactory draft without documentation.
- Undo/redo and revision recovery do not lose server-confirmed changes.
- All supported controls produce equivalent Player and final-render output.
- The editor is keyboard accessible and usable at a 360 px viewport.
- Core editor interactions meet the budgets in P2-08.

### Phase 3 gate

- Templates declare capabilities rather than requiring editor conditionals.
- Every supported format has visual-regression coverage.
- Existing projects continue to render against their pinned version.
- A new template can be added through the documented authoring workflow.
- The catalogue contains 25–30 reviewed editions across the target categories.

### Phase 4 gate

- Published invitations pin immutable versions and can be paused or rolled
  back without exposing the creator project.
- Enabled RSVP, billing, and support capabilities pass their authorization,
  reconciliation, retention, and incident exercises.
- Channel behavior and metadata are private by default and truthfully describe
  what was shared or sent.
- Collaboration has an evidence-backed implement/defer decision.
- Enabled commercial features operate inside the P0-03 cost envelope.

### AI graduation gate

- The task improves a named creator outcome over the deterministic baseline.
- Structured output passes factual, schema, safety, cultural, latency, and cost
  thresholds set before the experiment.
- Creator review, undo, fallback, traceability, and a tested kill switch exist.
- No model call is required for previewing or rendering saved project state.
- A graduate/revise/stop decision assigns graduated work to a normal product
  owner and packet.

## Cross-cutting rules

- Preserve the immutable render snapshot: a running job must never read mutable
  project state.
- Treat `templateId + templateVersion` as a permanent content address.
- Keep renderer-specific code behind the current catalogue/render boundary.
- Do not expose raw object-storage keys or credentials to the client.
- Store dates in UTC and present them in the event's chosen time zone.
- Avoid logging invitation copy, guest information, signed URLs, or uploaded
  asset contents.
- Every state-changing endpoint requires authorization, validation, and an
  idempotency strategy where retries are possible.
- Prefer additive migrations and reversible deployments.
- Keep mutable projects, immutable revisions/renders, review links, published
  invitation versions, and guest records as distinct lifecycle concepts.
- Treat AI as optional task assistance: validate structured output, require
  creator confirmation, and preserve the deterministic journey.
- Do not promote a parked packet by removing the status alone; attach the
  required entry evidence and owner.

## Definition of a ready packet

A packet is ready to start when:

- its dependencies are complete;
- it is not `Parked`, or its documented entry gate has been passed and recorded;
- unresolved decision points have an owner and deadline;
- acceptance criteria can be tested in the intended environment;
- required infrastructure accounts and secrets are available;
- data migrations and rollback expectations are understood.

Use [the work-packet template](WORK_PACKET_TEMPLATE.md) when adding future
packets.
