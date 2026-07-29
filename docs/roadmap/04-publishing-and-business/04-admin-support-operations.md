# P4-04 — Administration and support operations

**Status:** Parked  
**Phase:** 4 — Publishing and business  
**Size:** L  
**Depends on:** P1-07, P1-08, P4-01; expands with P4-02 and P4-03

## Objective

Give authorized operators narrow, audited tools to diagnose and resolve user,
render, publication, guest, and billing problems without database edits,
credential sharing, or routine access to private invitation content.

## Why this packet exists

A production product needs operational controls before support volume arrives.
Ad hoc database queries or broad impersonation are fast initially but create
privacy, integrity, and accountability failures. The support surface must be
designed from explicit actions and redacted identifiers.

## Scope

### Included

- Staff identity, roles, recent authentication, and access review.
- Search by safe operational identifiers.
- Redacted user/project/render/publication health views.
- Explicit retry, cancel, pause, revoke, restore, and entitlement-adjustment
  actions where their owning packet permits.
- Template publication/deprecation visibility.
- Support case linking, reason capture, and immutable audit trail.
- Break-glass process, dashboards, and operational runbooks.

### Excluded

- Unrestricted SQL console in the product.
- Silent user impersonation.
- Editing invitation copy or guest responses on behalf of users.
- Displaying uploaded photos by default.
- Deleting audit evidence to simplify a case.
- Building a generic CRM.

## Technical specification

### Staff authorization

Use separate staff roles such as:

- support read-only;
- support actions;
- trust/safety;
- billing adjustments;
- template operations;
- platform administrator.

Roles map to named actions, not pages. Sensitive actions require a recent
session, reason, case reference, and optionally second approval. Staff
membership is reviewed periodically and revoked immediately on offboarding.

### Operational lookup

Allow lookup by user ID/email where policy permits, project ID, render job ID,
publication identifier, support case, and provider billing reference. Results
show minimal metadata and status. Searching event copy, guest names, or photo
contents is not supported.

### Action model

Every mutation:

- reuses the owning domain service and invariants;
- checks staff capability and target tenant;
- requires a structured reason and idempotency key;
- records before/after state references, actor, case, and time;
- communicates creator-visible consequences where appropriate;
- supports dry-run for destructive or broad operations where feasible.

No tool writes database rows directly around domain services.

### Private content access

Default support views expose schemas, validation failures, checksums, sizes,
and redacted metadata—not invitation copy or images. Temporary content access
requires a user request or approved break-glass reason, has a short expiry, is
watermarked/logged where practical, and cannot be used for unrelated browsing.

### Template operations

Show current template version, publication tier, rights state, compatibility
health, and affected project counts. Hiding/deprecating a version for new
selection must not delete assets or break pinned projects.

## Expected code and artifacts

- Staff-role/capability model and identity integration.
- Redacted operational search and entity health pages.
- Action endpoints/services using existing domain commands.
- Audit-event store, viewer, retention, and export policy.
- Break-glass and approval workflow.
- Support/trust/billing/template runbooks and case macros.
- Access-review, action-rate, and anomaly dashboards.

## Delivery slices

1. Implement staff identity, read-only search, redaction, and audit viewing.
2. Add render/publication actions with reason and domain-service reuse.
3. Add guest/billing/template actions only after their owning packets ship.
4. Add break-glass, approvals, access review, and incident exercises.

## Acceptance criteria

- [ ] Staff permissions are action-scoped and deny by default.
- [ ] Routine support requires no database or cloud console access.
- [ ] Private content is redacted unless a time-bounded audited exception is
      approved.
- [ ] Every mutation records actor, reason, case, idempotency, and outcome.
- [ ] Admin actions pass through the same domain invariants as user actions.
- [ ] Cross-tenant browsing and mutation attempts are denied and alerted.
- [ ] Template hide/deprecate actions preserve pinned-project support.
- [ ] Offboarding and periodic staff access review are exercised.
- [ ] Break-glass access creates an immediate reviewable signal.

## Test plan

### Automated

- Role/action authorization matrix and cross-tenant tests.
- Redaction snapshot and prohibited-field serialization tests.
- Admin action idempotency/domain-invariant tests.
- Audit append-only and reason/case-required tests.
- Break-glass expiry and alert tests.
- Template compatibility-preservation tests.

### Manual

- Resolve representative render, publication, guest, and billing cases using
  only approved tools.
- Attempt support work with each restricted role.
- Inspect browser, logs, analytics, and exports for private content.
- Run staff offboarding and break-glass incident exercises.
- Have support staff follow runbooks without engineering intervention.

## Operational expectations

- Monitor staff login, searches, content-access grants, mutations, denials,
  adjustments, and break-glass actions.
- Alert on unusual cross-user lookup volume or repeated denied actions.
- Audit retention and access are stricter than general application logs.
- Each support action has an owner and documented creator impact.
- Admin UI is deployed and protected independently where practical.

## Rollout and rollback

Start read-only with internal operators. Introduce one action family at a time
after shadowing the manual runbook. A kill switch disables mutations while
preserving read-only incident visibility and audit access. Rollback never
removes recorded audit events.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Admin panel becomes universal bypass | Named capabilities and domain-service reuse |
| Support sees private photos unnecessarily | Redacted metadata first; time-bounded break glass |
| Manual adjustment is abused | Separate role, reason, case, limits, and anomaly alert |
| Operator action crosses tenants | Target ownership check on every command |
| Audit log itself leaks content | Structured identifiers/outcomes, no props or asset URLs |

## Completion evidence

Attach the permission matrix, redaction tests, representative case walkthroughs,
audit examples, break-glass/offboarding exercise, access-review record,
dashboards, and approved runbooks.
