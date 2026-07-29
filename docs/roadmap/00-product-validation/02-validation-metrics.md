# P0-02 — Validation plan and success metrics

**Status:** Not started  
**Phase:** 0 — Product proof  
**Size:** L  
**Depends on:** P0-01

## Objective

Define and run a measurable validation loop for the selected product wedge.
Establish the activation funnel, usability protocol, event taxonomy, and
go/no-go thresholds that determine whether production and experience
investment is justified.

## Why this packet exists

Positive reactions to attractive templates do not prove that users can finish
an invitation or prefer the product to their existing process. Without shared
definitions, each team can interpret gallery clicks, previews, renders, and
downloads as success. Phase 1 needs an evidence target, not only a technical
destination.

## Scope

### Included

- Primary activation and retention hypotheses.
- End-to-end funnel and canonical metric definitions.
- Privacy-safe product event taxonomy.
- Moderated task-based usability testing with the current MVP.
- Baseline measurements for time, completion, error, and output confidence.
- A validation decision with follow-up experiments.
- Instrumentation requirements carried into P1-07 and P2-08.

### Excluded

- Optimizing acquisition channels.
- Treating page views as product-market fit.
- Collecting invitation copy, names, addresses, or photos in analytics.
- Large statistically powered experiments before usable traffic exists.
- Manipulating thresholds after results are known.

## Technical specification

### Core funnel

Define stable events and transitions for:

1. collection viewed;
2. template or recommended direction selected;
3. project created;
4. required event details completed;
5. valid personalized preview reached;
6. project saved successfully;
7. export requested;
8. export completed and downloaded;
9. preview or output shared when sharing exists.

Each event uses surrogate user, session, project, template, version, category,
format, and experiment identifiers where allowed. Never include names, event
copy, venue, free-form text, asset URLs, signed tokens, or raw errors.

### Metric definitions

Choose one primary activation definition. The recommended starting candidate
is “a creator reaches a valid personalized preview and signals that the result
is usable or continues to export.” Define:

- denominator and eligibility;
- deduplication rules;
- test/internal traffic exclusions;
- event-time window;
- failure and retry treatment;
- category, device, and template-version breakdowns.

Supporting metrics include:

- time to first value;
- required-field and upload abandonment;
- save and render success;
- revision count before confidence;
- share-ready confidence score;
- creator return to the same project;
- support/error rate.

### Validation study

Use representative tasks with participants from P0-01. A participant should
start from event information and their own normal device, select a direction,
personalize it, review it, and obtain the most appropriate output without
coaching.

Set numerical thresholds before sessions. Suggested first gate:

- at least 8 representative participants across relevant occasions;
- at least 80% reach a valid personalized preview without intervention;
- median time to that preview at or below 10 minutes, with a 5-minute product
  ambition recorded separately;
- no repeated severity-one usability failure;
- at least 70% would share the result after realistic final adjustments;
- every abandonment has a classified reason rather than “user error.”

The owner may choose different thresholds, but must record why before testing.

### Event contract

For each analytics event specify:

- stable name and version;
- trigger and prohibited duplicate triggers;
- allowed properties and data classification;
- actor/context identifiers;
- owner and intended decision;
- retention and deletion behavior;
- validation query or test.

Maintain one canonical event dictionary. Client events are treated as hints;
save, render, payment, and publication outcomes should ultimately come from the
authoritative server event.

### Decision outcomes

The validation report must choose one:

- **Proceed:** evidence supports the wedge and Phase 1 assumptions.
- **Proceed with constraints:** keep the wedge but amend named packets.
- **Repeat:** uncertainty is addressable with a bounded experiment.
- **Reframe:** core job or segment is unsupported; revisit P0-01.

## Expected code and artifacts

- Funnel and metric dictionary.
- Versioned analytics event specification.
- Minimal privacy-safe instrumentation or a documented implementation handoff.
- Usability protocol, scenario fixtures, observer sheet, and severity rubric.
- Anonymized session findings and task metrics.
- Validation decision and roadmap amendments.
- P1-07/P2-08 measurement requirements.

## Delivery slices

1. Define activation, funnel, event contract, and thresholds.
2. Add only the instrumentation required to observe the current MVP safely.
3. Run a pilot session and correct the protocol without changing thresholds.
4. Complete the study, synthesize failure patterns, and issue the decision.

## Acceptance criteria

- [ ] Every core metric has one owner, formula, denominator, and data source.
- [ ] Thresholds and decision rules are dated before the main study.
- [ ] At least the agreed minimum representative sessions are completed.
- [ ] Observed behavior and task completion are separated from satisfaction.
- [ ] Analytics schemas prohibit invitation content and sensitive asset data.
- [ ] Client and server outcomes are not double counted.
- [ ] Findings identify device/category/template context without exposing
      participant identity.
- [ ] The final decision names exact roadmap changes or confirms none.

## Test plan

### Automated

- Analytics schema allow-list and prohibited-property tests.
- Event deduplication and identity-reset tests.
- Server event tests for save/render terminal outcomes when instrumented.
- Development-mode event inspector or fixture validation.

### Manual

- Run one instrumented journey and reconcile it against the event dictionary.
- Review analytics payloads in browser and server logs for prohibited content.
- Conduct the pilot and main usability sessions using the same task language.
- Have a second reviewer independently score major failures.

## Operational expectations

- Instrumentation failure must never block editing or rendering.
- Development, test, and internal traffic are distinguishable.
- Analytics retention follows P0-04 and later P1-08 policy.
- Findings remain traceable to a decision rather than becoming an unranked
  request list.

## Rollout and rollback

Keep Phase 0 instrumentation minimal and feature-flagged where practical. If a
payload is found to contain prohibited data, disable the affected event,
delete it according to provider capability, document the incident, and add a
regression test before restoring collection.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Small sample is treated as statistical proof | Use it for failure discovery and directional gating |
| Team changes thresholds after weak results | Timestamp thresholds and require an amendment |
| Attractive defaults mask editor problems | Test with realistic participant-specific content |
| Analytics captures private invitation data | Property allow-list, payload inspection, and short retention |

## Completion evidence

Attach the metric dictionary, event contract, threshold record, instrumentation
inspection, anonymized study results, severity-ranked findings, and signed
proceed/repeat/reframe decision.
