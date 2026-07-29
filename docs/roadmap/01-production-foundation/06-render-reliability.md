# P1-06 — Render reliability and idempotency

**Status:** Not started  
**Phase:** 1 — Production foundation  
**Size:** L  
**Depends on:** P1-05

## Objective

Guarantee that render requests terminate predictably and can be retried or
cancelled without duplicate work, outputs, or future charges.

## Why this packet exists

At-least-once queues, browser crashes, storage timeouts, worker termination,
and user retries are normal production conditions. A queue alone does not
decide which failures are retryable or reconcile jobs whose worker disappears.

## Scope

### Included

- Client/API idempotency contract.
- Error taxonomy and retry policy.
- Attempt limits and backoff.
- User cancellation and retry endpoints.
- Lease expiry, watchdog, and reconciliation.
- Duplicate-output prevention and partial-output cleanup.
- Terminal-state guarantee and user-facing failure categories.

### Excluded

- Payment settlement, though contracts must support later charge idempotency.
- Manual frame-level resume.
- Cross-region failover.

## Technical specification

### Idempotency

- Render creation accepts a client-generated idempotency key.
- Unique `(user_id, idempotency_key)` returns the original job for equivalent
  requests.
- Reuse with a materially different request returns a conflict.
- The server hashes canonical project revision, template version, render
  options, and asset references for comparison.
- Worker output keys are derived from job/attempt identity and committed once.

### Error taxonomy

Stable categories:

- validation/template incompatibility — permanent;
- missing/rejected asset — permanent until user action;
- renderer/content failure — normally permanent for the snapshot;
- storage/queue/network dependency — transient;
- worker/browser crash — transient within attempt limit;
- timeout/resource limit — policy dependent and visible;
- cancellation — terminal, not an error.

Raw stack traces stay in restricted diagnostics. APIs return stable codes and
safe action text.

### Retry policy

- Automatic retries apply only to transient categories.
- Exponential backoff with jitter and a finite maximum attempt count.
- Each attempt acquires a fresh lease and temporary directory.
- Retry does not mutate the immutable snapshot.
- User retry of a permanent failure creates a new job only after project or
  configuration changes, unless support explicitly reclassifies it.

### Cancellation

- Queued jobs cancel immediately.
- Active jobs receive a cancellation request checked by the worker and renderer
  process controller.
- Cancellation is idempotent.
- A race with successful completion resolves to one documented terminal state;
  a valid completed output is not silently deleted.

### Reconciliation

- A scheduled reconciler finds stale claimed/rendering/uploading jobs by lease
  and heartbeat.
- It records the lost attempt, cleans partial artifacts, and retries or fails
  according to policy.
- It verifies completed jobs have a valid output asset.
- It verifies queued database jobs have dispatched outbox events.
- Every non-terminal job has a bounded path to a terminal state.

## Expected code and artifacts

- Idempotency middleware/domain utility and database constraints.
- Error-code catalogue with user messages and support actions.
- Retry/cancel API routes and UI states.
- Worker cancellation checks and process termination.
- Reconciler scheduled task.
- Reliability dashboards and incident runbooks.

## Delivery slices

1. Add idempotent job creation and canonical request comparison.
2. Add error classification, automatic attempt policy, and safe messages.
3. Add cancellation and user retry behavior.
4. Add reconciliation and failure-injection verification.

## Acceptance criteria

- [ ] Repeated identical render requests return one job.
- [ ] Reused keys with different payloads return a conflict.
- [ ] Transient failures retry within policy; permanent failures do not loop.
- [ ] Cancelling queued and active work reaches a documented terminal state.
- [ ] Killing a worker results in automatic attempt recovery or final failure.
- [ ] Completed rows without outputs and outputs without completed rows are
      detected.
- [ ] Partial objects and temporary files are cleaned.
- [ ] No job remains non-terminal beyond the defined reconciliation window.
- [ ] User-facing failures explain whether editing, retrying, or support is
      required.

## Test plan

### Automated

- Idempotency key and canonical-hash tests.
- Failure-classification table tests.
- Backoff/attempt tests with a fake clock.
- Cancellation races at queued, rendering, uploading, and completion stages.
- Reconciler tests for stale leases, missing output, and undispatched outbox.
- Duplicate-worker and duplicate-output integration tests.

### Manual

- Interrupt network/storage and terminate Chromium/worker processes.
- Repeatedly click export under simulated latency.
- Cancel long renders and inspect process/object cleanup.
- Confirm editor messages map to stable error categories.

## Operational expectations

- Dashboard attempt count and error category by template/release.
- Alert when reconciler backlog, stale-job count, or retry exhaustion rises.
- Initial target: 99.9% of accepted beta jobs reach a terminal state within the
  maximum render window plus reconciliation delay.
- Runbook states when support may retry versus require a project edit.

## Rollout and rollback

Enable idempotency before introducing user retry controls. Run the reconciler in
report-only mode, compare findings, then enable mutations. Rollback may disable
automatic retry/cancellation UI, but idempotency constraints and terminal-state
data must remain.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Retry amplifies provider outage | Bounded exponential backoff and circuit/queue controls |
| Cancellation kills a completed result | Conditional transition with output verification |
| Error code leaks invitation data | Stable categories plus restricted diagnostic reference |
| Reconciler races active worker | Lease token checked on every state mutation |

## Completion evidence

Attach failure-injection results, idempotency API examples, cancellation race
tests, reconciler report, terminal-state metric, and error-message review.
