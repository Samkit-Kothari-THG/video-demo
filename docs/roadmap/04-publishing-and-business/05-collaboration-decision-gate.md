# P4-05 — Collaboration decision and Phase 4 gate

**Status:** Parked  
**Phase:** 4 — Publishing and business  
**Size:** XL if approved; M if deferred  
**Depends on:** P4-01 through P4-04 and evidence of multi-person ownership

## Objective

Decide from observed use whether workspace/team collaboration is necessary,
implement only the approved minimum if justified, and run the Phase 4 gate for
publishing, guest operations, commerce, and support readiness.

## Why this packet exists

Families and planners may involve several reviewers, but collaboration changes
the ownership model of every project, asset, publication, guest record, and
purchase. Building workspaces and real-time editing from assumed demand would
add significant authorization and conflict complexity. Deferring the decision
without defining the migration path creates a different risk.

## Scope

### Included

- Collaboration evidence and go/defer decision.
- Ownership-migration design from personal account to workspace.
- If approved: workspace membership, invitations, roles, project assignment,
  review comments/approval, notifications, and audit.
- Explicit exclusion or later gate for simultaneous real-time editing.
- Phase 4 privacy, reliability, commercial, and operational gate.

### Excluded

- Collaboration implementation when evidence threshold is not met.
- Google-Docs-style simultaneous editing in the first version.
- Public community commenting.
- Agency client billing or marketplace payouts.
- Sharing account credentials as a workflow.

## Technical specification

### Evidence gate

Before implementation, measure:

- how often creators ask another person to edit versus review;
- number of distinct actors and handoffs per completed invitation;
- planner project frequency and willingness to pay;
- failure modes caused by exported files, screenshots, or shared credentials;
- whether comments/approval solve the need without co-editing;
- support and privacy cost of multiple owners.

Record numerical approval thresholds before analysis. The legitimate outcome
may be “defer collaboration and improve P2-07/P4-01 review.”

### Conditional workspace model

If approved:

- `Workspace` owns projects, assets, publications, events, and commercial
  account according to a documented matrix.
- `Membership` has owner, editor, reviewer, billing, and guest-operations
  capabilities rather than one broad role.
- `WorkspaceInvitation` is expiring, single-purpose, revocable, and cannot
  reveal workspace content before acceptance.
- Moving a personal project is an explicit audited transfer with asset,
  publication, event, and entitlement rules.
- The final owner cannot leave without transferring or closing the workspace.

### Editing and approval

- Start with one active editor plus optimistic project revisions from P2-03.
- Show who last changed a revision and surface conflicts instead of
  last-write-wins.
- Reviewers comment on or approve an immutable revision/publication candidate;
  comments are not template props and never enter renders.
- Approval records actor, revision, time, and optional note.
- Publishing permissions are separate from editing permissions.

### Notifications

In-product notification is the baseline. Email/messaging follows approved
consent and preference rules, includes no invitation content by default, and
does not expose private workspace membership in subject lines.

### Phase 4 gate

The gate covers:

- publication version integrity, privacy, pause/rollback, and channel behavior;
- RSVP authorization, retention, export, and messaging constraints if enabled;
- entitlement/webhook/ledger reconciliation if charging is enabled;
- operational tools, audit, access review, and incident exercises;
- collaboration decision and conditional controls;
- cost, support, accessibility, and user-outcome evidence.

Features that remain intentionally disabled are documented; they do not need
placeholder implementations to pass the gate.

## Expected code and artifacts

- Collaboration evidence report and approve/defer decision.
- Workspace/ownership/role ADR and migration plan if approved.
- Conditional membership, assignment, comments/approval, notification, and
  audit implementation.
- Cross-domain authorization matrix.
- Phase 4 load, privacy, billing, guest, support, and usability gate report.
- Updated product boundaries and next-phase backlog.

## Delivery slices

1. Gather collaboration evidence and precommit to approve/defer thresholds.
2. If approved, add workspace ownership and membership behind an allow-list.
3. Add revision comments/approval and limited notifications; evaluate editing
   conflicts before any real-time design.
4. Run end-to-end Phase 4 gate and resolve or explicitly accept exceptions.

## Acceptance criteria

- [ ] Collaboration receives an evidence-backed approve/defer decision.
- [ ] A defer decision leaves a documented ownership migration path.
- [ ] If enabled, roles are capability-based and cross-workspace access is
      denied across every owned entity.
- [ ] Project transfer handles assets, publications, guests, and entitlements
      atomically or fails safely.
- [ ] Review comments/approvals pin immutable revisions and never alter renders.
- [ ] Simultaneous edit conflicts do not silently overwrite confirmed work.
- [ ] Publishing and billing permissions are independent from content editing.
- [ ] Phase 4 systems pass privacy, reliability, cost, accessibility, and
      incident criteria relevant to enabled features.
- [ ] Disabled capabilities and accepted risks have owners/revisit conditions.

## Test plan

### Automated

- Full workspace/entity authorization matrix if collaboration is approved.
- Membership invite, expiry, revoke, role-change, owner-leave, and transfer
  tests.
- Revision conflict, comment/approval pinning, and notification privacy tests.
- End-to-end publication/RSVP/billing/support journey tests for enabled scope.
- Load, reconciliation, retention, and audit-integrity suites.

### Manual

- Observe real family/planner review workflows before the decision.
- If approved, run invite/edit/review/publish/transfer/remove-member scenarios.
- Attempt cross-workspace access through every public and staff route.
- Conduct publication leak, guest export, payment outage, and staff-access
  tabletop exercises.
- Run the gate with product, design, engineering, operations, and trust owners.

## Operational expectations

- Workspace membership and sensitive actions are queryable by support and
  auditable by owner.
- Authorization metrics avoid high-cardinality private identifiers.
- Invitations and notifications are rate-limited and preference-aware.
- Cross-domain reconciliation detects orphaned workspace-owned records.
- Phase 4 has a named operating owner, budget, SLOs, and incident escalation.

## Rollout and rollback

If collaboration is approved, migrate only allow-listed new workspaces first;
do not bulk-transfer personal projects. Disable new workspace creation before
rolling back membership behavior. Existing workspace data must retain an
authorized owner and remain exportable. A defer outcome requires no rollback.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Planner requests outweigh normal hosts in interviews | Segment and weight evidence using P0-01 |
| Workspace ownership is bolted on too late | Design migration path now; implement only after evidence |
| Real-time editing consumes the roadmap | Start with revision review and explicit conflict handling |
| Removed member retains links/data | Rotate capabilities, revoke sessions, and audit access |
| Phase gate forces unused features live | Gate only enabled capabilities and record intentional deferrals |

## Completion evidence

Attach the evidence thresholds and decision, conditional workspace ADR/tests,
authorization matrix, end-to-end gate results, incident exercises, operational
ownership, accepted exceptions, and next-phase recommendation.
