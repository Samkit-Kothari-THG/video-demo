# P0-03 — Unit economics and capacity envelope

**Status:** Not started  
**Phase:** 0 — Product proof  
**Size:** M  
**Depends on:** P0-01, P0-02

## Objective

Create a decision-grade cost and capacity model for preview, rendering,
storage, delivery, and optional AI operations. Set the budgets and quota
assumptions that production architecture, pricing, and abuse controls must
satisfy.

## Why this packet exists

Video products can appear inexpensive during local development while render
compute, retries, egress, retained assets, and support compound in production.
Choosing infrastructure before defining an acceptable cost per completed
invitation risks either an unprofitable product or limits that undermine the
product promise.

## Scope

### Included

- Workload units and low/base/high demand scenarios.
- Direct and allocated cost categories.
- Render throughput, queue, storage, and egress estimates.
- Sensitivity analysis for duration, resolution, retries, and retention.
- Suggested free/paid quotas and protection limits.
- Capacity and cost budgets handed to Phase 1.
- Measurement plan to replace estimates with observed data.

### Excluded

- Final public pricing.
- Provider contracts or procurement.
- Counting sunk product-development cost as per-render infrastructure cost.
- Assuming future volume discounts in the base case.
- AI functionality as a required part of the core product.

## Technical specification

### Canonical workload units

Model costs per:

- active creator-month;
- saved project-month;
- uploaded asset-GB-month;
- preview session;
- render attempt by format, resolution, and output minute;
- successful downloadable output;
- shared publication view when available;
- AI request by use-case class when explored.

Separate marginal cost from fixed minimum platform cost. Model failed attempts,
retries, abandoned outputs, and duplicated projects explicitly.

### Cost inventory

Include at minimum:

- web/API runtime;
- PostgreSQL and backups;
- object storage, requests, lifecycle transitions, and restore;
- queue and render-worker compute;
- browser/runtime dependencies required by rendering;
- output and asset egress/CDN;
- authentication, analytics, logging, tracing, and alerting;
- email or messaging only where planned;
- payment fees for later pricing scenarios;
- third-party AI inference as an optional line;
- reasonable support and incident allowance as a separate operational metric.

Every input records source date, currency, tax assumption, free-tier treatment,
and whether it is list price or measured cost.

### Scenario model

At minimum evaluate:

- local/beta cohort with bursty manual testing;
- early paid usage with predictable daily peaks;
- a launch/event spike with concentrated render requests;
- abuse case with repeated large uploads or render retries;
- provider outage that increases retries or stored intermediate data.

For each scenario calculate concurrency, queue delay, daily jobs, retained
bytes, egress, direct cost, and cost per successful output.

### Budgets and constraints

Define targets before P1 implementation for:

- maximum accepted upload bytes and total project assets;
- supported output duration, formats, and resolution;
- render concurrency and per-user outstanding jobs;
- retry and cancellation policy;
- output and source-asset retention;
- acceptable p50/p95 queue and render latency;
- infrastructure cost per successful output;
- beta monthly spend and alert thresholds.

These are configuration inputs, not magic constants in UI or worker code.

### Pricing and entitlements hypothesis

Compare at least:

- free preview with paid export;
- project/event purchase;
- render-credit bundle;
- subscription for frequent planners.

Do not select packaging from margin alone. Score alignment with the P0-01 job,
clarity, refund/support burden, and abuse surface. P4-03 owns implementation.

## Expected code and artifacts

- Versioned cost model with input/source notes.
- Low/base/high usage scenarios and sensitivity table.
- Render benchmark plan and measured local baseline.
- Capacity and quota configuration requirements.
- Initial pricing/entitlement hypothesis.
- Cost dashboard requirements for P1-07.
- Architecture constraints for P1-01, P1-05, P1-06, and P1-08.

## Delivery slices

1. Define workload units, cost inventory, and provider-neutral assumptions.
2. Benchmark representative templates and fill the base scenario.
3. Run sensitivity and abuse scenarios.
4. Set budgets, quotas, alerts, and measurement handoff.

## Acceptance criteria

- [ ] The model separates fixed, marginal, retry, storage, and egress costs.
- [ ] Inputs are dated, sourced, and easy to replace.
- [ ] Representative V1/V2 templates and target formats have measured render
      baselines.
- [ ] Low/base/high and abuse scenarios expose queue and spend impact.
- [ ] Phase 1 receives explicit latency, concurrency, retention, and cost
      budgets.
- [ ] Pricing hypotheses show margin sensitivity without claiming final price.
- [ ] AI cost remains separable from the non-AI core journey.
- [ ] One owner is responsible for replacing estimates with production data.

## Test plan

### Automated

- Cost-model formula and unit checks.
- Scenario snapshots that detect accidental unit/currency changes.
- Render benchmark script using pinned inputs and versions where implemented.
- Configuration-boundary tests in later Phase 1 packets.

### Manual

- Recalculate one scenario independently.
- Review provider assumptions against current price sheets before approval.
- Stress the model with doubled duration, retries, and storage retention.
- Confirm product and infrastructure owners agree on what constitutes a
  successful billable or quota-consuming output.

## Operational expectations

- Production cost metrics eventually use template, format, duration, attempt,
  and outcome dimensions without invitation content.
- Alert before the beta budget is exhausted, not after billing closes.
- Review estimated versus actual cost after each major template/render change.
- Render performance regressions block publication through P3-06.

## Rollout and rollback

The initial model is a planning baseline. Store revisions rather than
overwriting assumptions. If measured production cost violates the envelope,
reduce allow-listed concurrency or output options using configuration while
investigating; do not corrupt or delete existing projects.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Free tiers hide steady-state cost | Model list-price steady state separately |
| Average render time hides expensive templates | Benchmark by template/version/format |
| Quotas conflict with product promise | Test constraints in P0-02 and explain them before export |
| AI inference dominates cost | Keep it optional, metered, and independently gated |

## Completion evidence

Attach the cost model, source log, representative benchmarks, sensitivity
results, agreed budgets/quotas, pricing hypothesis, and owner/date for the first
actual-versus-estimate review.
