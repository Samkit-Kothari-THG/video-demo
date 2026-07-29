# P4-03 — Billing, entitlements, and quotas

**Status:** Parked  
**Phase:** 4 — Publishing and business  
**Size:** XL  
**Depends on:** P0-03, Phase 1 gate, validated willingness-to-pay evidence

## Objective

Implement provider-neutral commercial entitlements that control paid exports
or publishing transparently, survive webhook retries and outages, and preserve
the creator's private work when payment state changes.

## Why this packet exists

Charging for a video render is not just a checkout button. Payments,
entitlements, render reservations, refunds, disputes, taxes, and support need a
consistent ledger. Directly branching UI behavior on a payment-provider
subscription status would create lost credits, duplicate charges, and
provider-locked domain logic.

## Scope

### Included

- Validated packaging choice from P0-03 and product evidence.
- Product/price version and entitlement domain model.
- Checkout/customer portal integration behind an adapter.
- Signed webhook ingestion, deduplication, and reconciliation.
- Usage reservation/finalization/release for metered operations.
- Quota visibility, upgrade path, refund/credit adjustment, and grace policy.
- Billing metrics, support tooling, security, and audit.

### Excluded

- Inventing pricing during implementation.
- Cryptocurrency or stored cash value.
- Multi-vendor marketplace payouts.
- Deleting or holding private projects hostage after cancellation.
- Trusting client-reported payment or usage state.
- Country-by-country tax promises without provider/qualified review.

## Technical specification

### Domain boundary

Model independently of provider objects:

- `CommercialAccount`: billable person or future workspace.
- `Product/PriceVersion`: immutable sold terms and currency.
- `Purchase/Subscription`: commercial agreement and lifecycle projection.
- `Entitlement`: named capability with limit, window, and source.
- `UsageReservation`: temporary hold before expensive work.
- `UsageLedgerEntry`: immutable grant, consume, release, expire, refund, or
  manual adjustment.
- `BillingEvent`: normalized provider event and processing outcome.

Store provider identifiers as adapter references. The product asks an
entitlement service whether an action is allowed; it does not inspect provider
subscription strings.

### Paid operation flow

For render/export or publishing limits:

1. authorize actor and validate requested operation;
2. idempotently reserve required entitlement;
3. create the render/publication job with reservation reference;
4. finalize usage exactly once on the documented success boundary;
5. release on cancellation/permanent failure;
6. reconcile orphaned reservations.

Define whether retry attempts consume cost internally without charging the
creator again. An immutable render request should map to one commercial
operation.

### Webhooks and reconciliation

- Verify provider signature against the raw request body.
- Persist event ID/payload classification and acknowledge safely.
- Process idempotently and out of order using provider timestamps/version
  rules.
- Fetch authoritative provider state when event ordering is ambiguous.
- Run scheduled reconciliation for missed webhooks and stuck projections.
- Never log full payment details, webhook secrets, or customer portal URLs.

### Customer experience

- Show price, currency, renewal/one-time terms, included capability, and limit
  before confirmation.
- Explain exactly when a credit/usage unit is consumed.
- Display current entitlement and pending reservations.
- Provide cancellation/portal access and receipt/invoice route as supported.
- Define grace, failed payment, refund, and dispute behavior.
- Cancellation blocks future paid actions according to terms but preserves
  access to private projects and already purchased outputs under policy.

### Manual adjustments

Support can grant/reverse a non-cash entitlement adjustment only with a reason,
authorized role, idempotency key, and audit. Adjustments never modify ledger
history in place.

## Expected code and artifacts

- Packaging/pricing decision and terms handoff.
- Commercial schema, ledger, entitlement service, and migrations.
- Payment-provider adapter, checkout/portal, webhook inbox, and reconciler.
- Usage reservation integration with render/publication flows.
- Creator billing/usage UI and support adjustment tool.
- Metrics, alerts, refund/dispute and outage runbooks.
- Security, finance, privacy, and tax question review.

## Delivery slices

1. Implement entitlement/ledger domain with a fake provider and contract tests.
2. Integrate checkout/portal and webhook inbox in test mode.
3. Add usage reservation/finalization to one paid operation.
4. Add reconciliation, support adjustments, metrics, and limited live rollout.

## Acceptance criteria

- [ ] Provider events cannot grant the same entitlement twice.
- [ ] Paid operations reserve and finalize/release usage exactly once.
- [ ] Client input cannot create entitlements or mark payment complete.
- [ ] Webhooks are signature-verified, stored, idempotent, and reconcilable.
- [ ] Pricing/limits are versioned; existing purchases retain their terms.
- [ ] Creators can see entitlement, reservations, consumption rule, and
      cancellation path.
- [ ] Refunds, failures, disputes, and manual adjustments preserve ledger
      history.
- [ ] Losing a paid entitlement does not delete projects or private assets.
- [ ] Financial and invitation-sensitive data do not mix in logs/analytics.

## Test plan

### Automated

- Ledger invariant, double-entry-like balance, and property tests as
  appropriate.
- Duplicate, delayed, missing, invalid-signature, and out-of-order webhook
  tests.
- Reservation success/failure/cancel/retry/reconciliation tests.
- Cross-account and support-role authorization tests.
- Price-version, upgrade/downgrade, grace, refund, and dispute tests.
- Provider-adapter contract tests using official sandbox fixtures.

### Manual

- Complete test purchase, failed payment, cancellation, refund, and dispute
  scenarios.
- Interrupt checkout and render flows at each boundary.
- Compare provider dashboard, internal purchase projection, ledger, and usage.
- Review mobile currency/terms presentation and accessibility.
- Run provider-outage and webhook-backlog tabletop.

## Operational expectations

- Alert on webhook age, processing failures, reconciliation drift, stuck
  reservations, negative/invalid balances, and abnormal adjustment volume.
- Financial events have longer, policy-approved audit retention.
- Support sees enough identifiers to reconcile without accessing invitation
  content.
- Cost and margin reporting consumes P0-03 units and actual P1-07 data.

## Rollout and rollback

Use provider test mode, then internal purchases, then an allow-listed paid
cohort. Feature flags separate checkout, enforcement, and display. During a
provider outage, fail safely according to a documented grace policy rather
than guessing payment state. Rollback stops new purchases/enforcement changes
while preserving ledger and existing entitlements.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Credit consumed for a platform failure | Reservation/finalization boundary and automatic release |
| Duplicate/out-of-order webhook corrupts access | Durable inbox, idempotency, version rules, reconciliation |
| Pricing changes rewrite old promises | Immutable price/entitlement versions |
| Payment outage blocks urgent invitation | Explicit bounded grace policy based on risk |
| Support adjustment hides revenue issue | Append-only adjustment with role, reason, and audit |

## Completion evidence

Attach packaging decision, domain/ledger review, provider contract tests,
webhook/reconciliation results, end-to-end sandbox journeys, support runbook,
monitoring dashboard, and limited-rollout reconciliation report.
