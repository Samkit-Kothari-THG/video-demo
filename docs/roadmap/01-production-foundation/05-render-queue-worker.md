# P1-05 — Durable render queue and worker

**Status:** Not started  
**Phase:** 1 — Production foundation  
**Size:** XL  
**Depends on:** P1-02, P1-04

## Objective

Move rendering out of the Next.js request process into a durable worker system
that can survive restarts, enforce concurrency, and render from immutable
snapshots.

## Why this packet exists

The current `void renderInvitation(job)` pattern can lose work when a web
process exits and cannot coordinate multiple instances. Video rendering is
CPU/memory intensive and requires deployment, retry, and capacity policies
separate from the application API.

## Scope

### Included

- Transactional job creation plus outbox dispatch.
- Durable queue and independent worker deployment.
- Explicit render-job state machine.
- Worker leases, heartbeats, progress, and attempt records.
- Controlled concurrency and graceful shutdown.
- Private asset download and output upload.
- Versioned worker release identification.

### Excluded

- Advanced retry/cancellation/reconciliation policy beyond the minimum needed
  to run safely; P1-06 completes that behavior.
- Payments and credit reservation.
- Multiple render engines.
- Arbitrary render settings supplied by clients.

## Technical specification

### Job state machine

Initial states:

```text
queued -> claimed -> rendering -> uploading -> completed
   |         |           |            |
   +---------+-----------+------------+-> failed
                                      +-> cancelled
```

Only defined transitions are allowed. Terminal states are completed, failed,
and cancelled. Progress is advisory and monotonic within an attempt.

### Dispatch consistency

- API validates the saved project and creates an immutable job snapshot.
- The job row and outbox event are inserted in one database transaction.
- A dispatcher publishes undispatched outbox events and records delivery.
- Queue delivery is at least once; worker processing must tolerate duplicates.
- Queue payload contains only the job ID and non-sensitive tracing metadata.

### Snapshot requirements

The job stores:

- project and owner IDs;
- exact template ID and version;
- validated resolved props or a schema-versioned input snapshot;
- protected asset references;
- output format, dimensions, fps, and duration selected from server policy;
- catalogue/renderer release identifier where needed for reproducibility.

Workers never re-read mutable project props.

### Worker behavior

1. Claim a queued job using a database transition/lease.
2. Record attempt and release identifiers.
3. Resolve the pinned template and protected assets.
4. Render to isolated temporary storage.
5. Upload output to private object storage.
6. Verify output existence and basic media metadata.
7. Commit output asset and completed state transactionally.
8. Clean temporary files in a finally block.

Workers send bounded progress updates and heartbeats. Shutdown stops claiming
new jobs, allows a configured grace period, then releases or expires leases.

### Capacity and isolation

- Concurrency is configured per worker based on measured CPU and memory.
- Each job has duration, frame, asset-byte, and execution-time limits.
- Temporary paths are unique per attempt.
- Browser/render processes are terminated on timeout or cancellation.
- Worker containers have no inbound public route other than platform health.

## Expected code and artifacts

- Queue adapter and transactional outbox dispatcher.
- Independent worker entry point and deployment definition.
- Database transition functions with attempt/lease checks.
- Renderer adapter updated for object-storage inputs and outputs.
- Worker health checks and graceful-shutdown handling.
- Capacity benchmark and worker operations runbook.

## Delivery slices

1. Add state machine, outbox publisher, and queue adapter with a fake worker.
2. Extract current Remotion render into an independently runnable worker.
3. Add leases, progress, private assets, output upload, and graceful shutdown.
4. Deploy one staging worker, benchmark, then canary production traffic.

## Acceptance criteria

- [ ] API returns after durable job creation and does not render in-process.
- [ ] Restarting the web process does not lose an accepted job.
- [ ] Duplicate queue delivery does not create duplicate completed outputs.
- [ ] Worker restart leaves a recoverable lease/attempt record.
- [ ] A running render uses only its stored snapshot.
- [ ] Concurrency never exceeds the configured worker limit.
- [ ] Completed output is private and associated with one output asset record.
- [ ] Temporary render files are removed after success and failure.
- [ ] Worker release and attempt can be identified from a job.

## Test plan

### Automated

- State-transition and lease tests.
- Transactional outbox integration tests.
- Duplicate-delivery and concurrent-claim tests.
- Worker success/failure tests with fake storage and renderer.
- Full staging render using private input and output assets.
- Graceful and forced shutdown tests.

### Manual

- Restart web, dispatcher, and worker at each job stage.
- Scale workers up/down while jobs are queued.
- Confirm progress polling remains compatible with the editor.
- Inspect a completed output and attempt diagnostics.

## Operational expectations

- Track queue depth/age, claim latency, active concurrency, frames per second,
  render duration, attempt count, worker memory/CPU, and terminal outcome.
- Alert on oldest queued age, no healthy workers, stuck leases, and failure-rate
  spikes.
- Limit progress writes to avoid database pressure.
- Capacity plan states expected jobs per worker-hour and maximum queue wait.

## Rollout and rollback

Use a server-side render-dispatch flag by environment and percentage. During
canary, keep the old in-process path available only for local development—not
as a production retry fallback. Rollback stops new queue dispatch, drains or
cancels queued work deliberately, and deploys the previous worker release for
compatible snapshots.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Queue message and database diverge | Transactional outbox and idempotent delivery |
| Worker update breaks old snapshots | Pin compatible snapshot schema/release and canary |
| Render exhausts host | Hard limits, measured concurrency, isolated processes |
| Progress causes heavy writes | Throttle and update only meaningful increments |

## Completion evidence

Provide restart-test records, duplicate-delivery proof, full staging render,
worker benchmark, queue dashboard, and graceful-shutdown logs.
