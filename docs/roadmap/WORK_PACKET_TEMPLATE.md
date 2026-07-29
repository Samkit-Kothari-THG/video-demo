# PX-00 — Work packet title

- **Status:** Not started / Parked
- **Phase:** Phase name
- **Size:** M / L / XL
- **Depends on:** Packet IDs or current system capability

## Objective

State the user or operational outcome. Describe the capability that will exist
after completion, not the implementation activity.

## Why this packet exists

Explain the current limitation, risk, or product opportunity.

## Scope

### Included

- Explicitly included behavior.

### Excluded

- Adjacent work that must not silently expand this packet.

## Technical specification

Describe:

- data and ownership boundaries;
- APIs, events, and state transitions;
- application and worker responsibilities;
- security and privacy behavior;
- migration and compatibility requirements;
- failure and recovery behavior.

## Expected code and artifacts

- Likely modules, migrations, configuration, runbooks, or dashboards.
- Avoid prescribing filenames when the implementation has not established the
  relevant convention.

## Delivery slices

1. A reviewable, independently verifiable slice.
2. The next slice.
3. Migration, rollout, or cleanup.

## Acceptance criteria

- [ ] A criterion observable by a user, test, or operator.
- [ ] Failure behavior is explicit.
- [ ] Existing projects remain compatible.

## Test plan

### Automated

- Unit, integration, contract, migration, and visual tests.

### Manual

- Environment-specific or usability verification.

## Operational expectations

- Metrics, alerts, logs, capacity, retention, and support requirements.

## Rollout and rollback

- Feature flags, backfill, dual-read/write, canary, or rollback sequence.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Example | Owner records the decision before implementation |

## Completion evidence

Record links to the merged changes, test output, dashboard, runbook, migration
result, and any accepted exceptions.
