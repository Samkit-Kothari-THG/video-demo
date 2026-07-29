# P1-08 — Security, privacy, deployment, and beta gate

**Status:** Not started  
**Phase:** 1 — Production foundation  
**Size:** XL  
**Depends on:** P0-04 and P1-01 through P1-07

## Objective

Harden, deploy, and exercise the complete production foundation so a controlled
external beta can operate without local disk, developer intervention for normal
failures, or undocumented data handling.

## Why this packet exists

Individually functional database, auth, storage, and worker components do not
constitute a production system. The integration needs threat modeling,
retention rules, backup/restore proof, capacity tests, deployment controls, and
an explicit go/no-go gate.

## Scope

### Included

- Threat model and security review.
- Rate limits, quotas, headers, dependency/license review, and secret handling.
- Privacy notice inputs, asset retention, deletion, and data export behavior.
- Verified implementation of the P0-04 data classification, consent,
  provenance, sharing, and trust constraints applicable to beta.
- CI/CD for web, migrations, dispatcher, and worker.
- Staging environment, production canary, rollback, backup, and restore.
- Load/failure testing and ten-user beta readiness exercise.
- Phase 1 gate review.

### Excluded

- Formal compliance certification.
- Payments, watermarking, and commercial entitlements.
- Multi-region active-active deployment.
- Full collaboration or guest data.

## Technical specification

### Threat model

Review at minimum:

- account/session takeover and callback abuse;
- cross-tenant ID substitution;
- upload bombs, malformed media, and metadata leakage;
- signed URL leakage/replay;
- queue flooding and render resource exhaustion;
- template/input injection into logs, filenames, or shell commands;
- support-role misuse;
- secret exposure in builds, logs, or diagnostics;
- dependency and renderer/browser vulnerabilities.

Mitigations become tracked requirements with an owner and verification.

### Abuse and limits

- Rate limit authentication, upload intents, project mutations, preview-link
  access, render creation, and polling appropriately.
- Enforce per-user active jobs, queued jobs, storage bytes, upload size/pixels,
  and render duration.
- Limits are checked server-side and return stable retry/upgrade messaging.
- Internal services authenticate and accept only expected queue/task origins.

### Data lifecycle

- Translate the P0-04 classification/retention matrix into implemented
  lifecycle policy; record any infrastructure exception accurately.
- Publish/document purposes and retention for account, project, source asset,
  output, logs, analytics, and audit data.
- Account deletion revokes sessions, hides data immediately, and schedules
  durable deletion.
- Legal/operational exceptions are explicit.
- User data export has a defined format even if initially performed by support.

### Deployment

- CI runs typecheck, unit/integration tests, migration checks, template smoke
  renders, and security/dependency checks.
- Build artifacts are immutable and carry a release identifier.
- Migrations are applied once with locking before dependent code.
- Web and worker deploy separately with compatibility windows.
- Secrets come from managed runtime configuration, never repository files.
- Staging mirrors production boundaries with lower capacity.

### Resilience exercises

- Restore the database and verify assets/records.
- Terminate web and worker instances during active use.
- Make queue, database, and storage dependencies unavailable.
- Fill queue to expected beta burst and measure age.
- Verify reconciliation, alerts, safe user messaging, and runbooks.

## Expected code and artifacts

- Threat model and mitigation register.
- Rate-limit/quota policies and tests.
- Security headers and dependency/license reports.
- Data-retention and deletion implementation/runbook.
- CI/CD workflows and environment promotion checklist.
- Backup/restore, rollback, incident, and support runbooks.
- Load/failure test report and beta gate checklist.

## Delivery slices

1. Threat model, privacy lifecycle, quotas, and remaining hardening.
2. CI/CD, staging parity, migration/deployment/rollback automation.
3. Backup restore, failure injection, and capacity exercise.
4. Ten-user rehearsal, issue closure, and formal gate review.

## Acceptance criteria

- [ ] Production uses PostgreSQL, private object storage, and durable workers;
      `.data/`, `public/uploads`, and `public/renders` are not authoritative.
- [ ] Cross-tenant and abuse suites pass.
- [ ] No critical/high unresolved threat lacks an approved mitigation.
- [ ] Secrets and private URLs are absent from client bundles and logs.
- [ ] Backup restore and account/asset deletion are exercised successfully.
- [ ] P0-04 private defaults, provenance, retention, deletion, and sharing
      constraints are implemented or explicitly block the affected capability.
- [ ] Every accepted render terminates or reconciles within policy.
- [ ] Staging-to-production and rollback procedures are demonstrated.
- [ ] Alerts and support runbooks work during failure exercises.
- [ ] Ten external testers complete creation, render, and download without
      developer database or shell intervention.
- [ ] Gate owner records go/no-go, accepted risks, and follow-up deadlines.

## Test plan

### Automated

- Full API authorization and rate-limit suite.
- Migration compatibility and rollback checks.
- Dependency/security scanning.
- Template smoke render per production family.
- Deletion/retention and quota integration tests.
- Infrastructure/deployment validation where available.

### Manual

- Mobile/desktop tester journey.
- Restore production-like backup into isolated environment.
- Worker/web/dependency failure game day.
- Review WhatsApp and Instagram compatibility for representative outputs.
- Verify music, font, artwork, Remotion, and third-party license obligations.

## Operational expectations

- Named on-call/support owner during beta.
- Daily review of queue age, failure rate, storage growth, and tester feedback.
- Documented beta caps for users, uploads, concurrent renders, and retention.
- Incident severity and communication expectations are explicit.
- Release rollback decision can be made from dashboards within minutes.

## Rollout and rollback

Use an allow-listed beta, low render concurrency, and progressive production
traffic. Canary web and worker releases independently. Stop admission before
rolling back worker incompatibilities, drain or reconcile accepted jobs, and
preserve database/object records. Rollback must not re-enable public-disk
storage or bypass authorization.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Beta demand exceeds render capacity | Admission quotas and queue-age communication |
| Migration cannot be rolled back cleanly | Additive schema and compatible prior release |
| Data deletion conflicts with active job | Revoke access, cancel/protect references, then durable cleanup |
| Third-party license blocks launch | Resolve or replace asset/dependency before gate |
| Policy promise exceeds implemented lifecycle | Gate on verified behavior and publish accurate windows |

## Completion evidence

Attach the signed gate checklist, threat register, restore report, game-day
timeline, capacity results, tester completion data, license review, and
accepted-risk log.
