# P1-07 — Observability, analytics, and support

**Status:** Not started  
**Phase:** 1 — Production foundation  
**Size:** L  
**Depends on:** P1-02, P1-05

## Objective

Make production behavior measurable and supportable without exposing private
invitation content. Operators must be able to trace a user-visible failure from
API request through queue, worker attempt, storage output, and final response.

## Why this packet exists

Render failures are asynchronous and span multiple services. Console logs from
one web process cannot establish service health, product conversion, or the
state of a specific job.

## Scope

### Included

- Structured logs, traces/correlation, metrics, dashboards, and alerts.
- Privacy-safe product analytics.
- Audit events for sensitive operations.
- Read-only internal support view for project/render diagnosis.
- Initial service-level indicators and incident runbooks.

### Excluded

- Full customer-service ticketing integration.
- Marketing attribution platform.
- Session replay containing user input or preview media.
- Billing analytics.

## Technical specification

### Correlation and logs

- Generate or accept a validated request ID at the web boundary.
- Carry trace/request, user surrogate, project, job, attempt, worker release,
  and template/version identifiers across services.
- Use structured fields and stable event names.
- Do not log invitation copy, email addresses, asset URLs/keys, cookies, props
  snapshots, or uploaded bytes.
- Raw renderer diagnostics are restricted, time-limited, and referenced by an
  opaque diagnostic ID.

### Metrics

Application:

- request count/latency/error by stable route name;
- project create/update/conflict;
- upload intent/success/rejection and processing latency;
- render request and status polling.

Worker:

- queue depth and oldest age;
- claim latency, active concurrency, heartbeat;
- render duration, frames per second, memory/CPU;
- attempt count and terminal outcome by error category/template/release;
- output upload and cleanup results.

Product analytics:

- gallery viewed;
- template selected with version;
- project created;
- preview first played;
- meaningful edit completed;
- render requested/completed/failed;
- output downloaded and preview link opened.

Events use anonymous/user surrogate IDs and avoid raw invitation values.

### Support view

An authenticated internal role can:

- locate by safe user identifier, project ID, or job ID;
- see state history, attempts, stable errors, release, and asset processing
  status;
- access sanitized diagnostics and relevant runbook;
- request an approved retry through the same domain operation as users.

It cannot display uploaded media or invitation copy by default. All support
access and mutations are audited.

### Initial service objectives

Establish measured beta targets:

- API availability and p95 latency;
- render acceptance-to-start latency;
- successful renders / requested renders;
- terminal-state completion window;
- upload processing success and latency.

Targets become enforceable only after baseline measurement is available.

## Expected code and artifacts

- Structured logger and trace propagation.
- Metrics instrumentation and dashboard definitions.
- Product event schema and analytics adapter.
- Audit-event persistence.
- Internal support routes/UI with role policy.
- Alert definitions and render/upload incident runbooks.

## Delivery slices

1. Instrument request, database, queue, worker, and storage boundaries.
2. Build operational dashboards and alerts.
3. Add product event schema and validate privacy.
4. Add audited support view and runbook links.

## Acceptance criteria

- [ ] One correlation path connects an export click to its worker attempt and
      output.
- [ ] Logs and analytics contain no prohibited invitation or credential data.
- [ ] Dashboards show queue, render, upload, and API health by environment.
- [ ] Alerts fire in controlled dependency/worker failure exercises.
- [ ] Product funnel events are deduplicated and versioned.
- [ ] Support can explain a failed job using stable information and a runbook.
- [ ] Support access is least privilege and audited.
- [ ] Release and template regressions can be compared from metrics.

## Test plan

### Automated

- Logger redaction tests using representative sensitive props and URLs.
- Trace-context propagation integration test.
- Analytics schema/required-field and deduplication tests.
- Support-role authorization and audit tests.
- Alert-query unit checks where supported.

### Manual

- Trace one successful and one injected failed render.
- Inspect logs/events for private data.
- Trigger queue-age, worker-down, and storage-failure alerts.
- Diagnose a seeded failure only through the support view.

## Operational expectations

- Log retention and access roles are documented.
- Metric labels avoid unbounded user/project identifiers.
- Alerts are actionable, routed, and linked to runbooks.
- Dashboard ownership and review cadence are named.
- Analytics loss must not fail creation or rendering.

## Rollout and rollback

Instrumentation is additive and ships disabled or sampled where volume is
unknown. Run privacy review before enabling hosted log/analytics export.
Rollback disables exporters while retaining local safe logs; it must not break
business operations.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| High-cardinality metrics | IDs belong in traces/logs, never metric labels |
| Analytics duplicates due retries | Stable event IDs and server-side deduplication |
| Support view expands into admin backdoor | Read-only default, explicit actions, audit, separate role |
| Renderer stack contains user data | Redact before export and restrict diagnostic access |

## Completion evidence

Provide trace examples, privacy/redaction test output, dashboard and alert
screenshots, funnel event samples, support diagnosis exercise, and runbook
links.
