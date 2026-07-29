# P2-01 — Guided creation brief

**Status:** Not started  
**Phase:** 2 — Better creation experience  
**Size:** L  
**Depends on:** Phase 1 gate, P0-01, P0-02

## Objective

Give first-time users a short, guided path from occasion selection to a
complete, populated invitation draft without requiring them to understand the
full editor. Optimize for the primary user, core job, and first-value moment
selected in P0-01.

## Why this packet exists

The current gallery starts with visual template choice. Many users know their
occasion, tone, and event details but cannot predict which design fits. Asking
for the minimum useful brief first improves template recommendations and
reduces empty or confusing editor states.

## Scope

### Included

- Multi-step creation flow for occasion, people, event details, tone, and
  optional photo.
- Rule-based template and edition recommendations.
- Save/resume of an incomplete creation session.
- Review step before project creation.
- Populated version-pinned project using existing catalogue defaults and
  validation.
- Funnel analytics and accessible progress/navigation.
- Direct traceability from each question/step to the P0-01 core journey and
  P0-02 metric definition.

### Excluded

- Generative AI copy or artwork.
- Arbitrary design generation.
- Payment or export entitlement.
- Guest lists, RSVP, and collaboration.

## Technical specification

### Brief model

Create a schema-versioned `CreationBrief` separate from project props:

- occasion/category;
- primary and optional secondary name/host;
- event label;
- local event date, time, and IANA time zone;
- venue/address display line;
- host/family line;
- desired tone: classic, modern, playful, minimal, or festive;
- photo preference: upload now, later, or no photo;
- optional selected asset reference;
- current step and completion timestamps.

Store local date/time and time zone explicitly. Do not derive time zone from
server location. Validate each step without requiring future optional fields.

### Flow

1. Occasion.
2. Names/hosts using category-specific labels.
3. Date, time, time zone, and venue.
4. Tone and photo preference.
5. Recommended designs.
6. Review and create project.

Users can move backward without losing data. Leaving the flow preserves a
server draft for authenticated users and a privacy-safe browser draft only
before authentication where required.

The number/order of steps and definition of a valid personalized preview must
start from P0-01/P0-02 evidence. Adding a question requires a named downstream
decision or validation need; do not turn the brief into a generic event form.

### Recommendation behavior

- Recommendations are deterministic rules over category, tone, photo
  preference, and declared template capabilities.
- Return three ranked compatible editions and explain each in plain language.
- Never recommend a template that cannot represent required fields or photo
  preference.
- User may browse the full filtered catalogue.
- The chosen template ID and exact version are recorded at project creation.

### Project creation

- Convert the brief through one tested mapper into template props.
- Apply template defaults only for genuinely absent optional values.
- Preserve user-entered punctuation and display format after validation.
- Creation is idempotent so browser retries do not duplicate projects.
- The brief links to the resulting project for resume and analytics.

## Expected code and artifacts

- `CreationBrief` schema and persistence.
- Guided-flow routes/components and progress indicator.
- Recommendation rules consuming catalogue capabilities.
- Brief-to-template mapping tests.
- Resume/abandon behavior.
- Funnel event definitions and content-design copy.
- Mapping from P0-02 canonical events/activation to guided-flow behavior.

## Delivery slices

1. Define brief schema, persistence, and category-specific question content.
2. Build accessible steps with resume/back behavior.
3. Add deterministic recommendations and project mapper.
4. Instrument funnel and test with first-time users.

## Acceptance criteria

- [ ] A user can create a populated project without visiting the blank editor
      first.
- [ ] Back, refresh, and sign-in return do not lose confirmed answers.
- [ ] Date/time retains the chosen event time zone.
- [ ] Recommendations contain only compatible templates.
- [ ] Project creation records the exact recommended/selected version.
- [ ] Repeated submission creates one project.
- [ ] All steps work with keyboard and screen-reader navigation.
- [ ] Analytics identify step completion/drop-off without recording invitation
      text.
- [ ] The flow reaches the P0-01 first-value outcome and uses the P0-02
      activation definition without a parallel metric.

## Test plan

### Automated

- Brief schema and step-validation tests.
- Recommendation table tests for every category/tone/photo combination.
- Brief-to-props mapping and idempotent creation integration tests.
- Time-zone and daylight-saving fixtures.
- Back/resume state tests.
- Accessibility checks for step titles, errors, and progress.

### Manual

- Complete flows on 360 px mobile and desktop.
- Interrupt at every step and resume.
- Test long names/venues and all no-photo paths.
- Observe five first-time users without coaching.
- Compare time/completion/failure patterns with the Phase 0 baseline.

## Operational expectations

- Measure start, step completion, recommendation view, selection, project
  creation, and abandonment.
- Brief drafts follow a short retention policy when no project is created.
- Recommendation rules are versioned and report their rule version.
- Errors preserve entered values and offer a clear retry.

## Rollout and rollback

Introduce as the default “New invitation” path behind a feature flag while
retaining direct template selection. Rollback returns the button to the gallery;
already created brief/project records remain valid.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Flow becomes too long | Instrument steps and keep optional questions skippable |
| Recommendation feels arbitrary | Show a short reason and full-catalogue escape |
| Date text differs by template | Store structured time plus intentional display string mapping |
| Brief and project become competing truth | Brief becomes immutable/closed after project creation |
| New questions dilute first value | Require evidence and a downstream decision for every step |

## Completion evidence

Attach mapping tests, flow screenshots, accessibility output, analytics sample,
resume tests, and moderated usability findings.
