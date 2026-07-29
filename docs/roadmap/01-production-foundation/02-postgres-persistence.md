# P1-02 — PostgreSQL persistence and migrations

**Status:** Not started  
**Phase:** 1 — Production foundation  
**Size:** L  
**Depends on:** P1-01

## Objective

Replace JSON-file project and render-job persistence with transactional
PostgreSQL storage while preserving current API behavior and V1/V2 project
compatibility.

## Why this packet exists

The local write lock protects one process only. It cannot support multiple web
instances, durable queues, tenant ownership, optimistic editing, reliable
render transitions, backups, or auditable migrations.

## Scope

### Included

- Database schema, migrations, constraints, and indexes.
- PostgreSQL implementations of project and render-job repositories.
- Optimistic concurrency for project updates.
- Local fixture/seed workflow.
- One-time migration path for existing `.data/projects.json` records.
- Backup, restore, and migration runbooks.

### Excluded

- User login UI and session handling.
- Object bytes or signed URLs.
- Revision history beyond the current project row.
- Queue dispatch and worker execution.

## Technical specification

### Initial tables

`users`

- `id`: opaque stable identifier.
- `email_normalized`: unique when present.
- `display_name`.
- `created_at`, `updated_at`, `deleted_at`.
- Authentication-provider details must not be embedded in project rows.

`projects`

- `id`, `user_id`.
- `template_id`, `template_version`.
- `props`: JSONB containing validated invitation input.
- `revision`: monotonically increasing bigint for optimistic concurrency.
- `status`: active or archived.
- `created_at`, `updated_at`, `deleted_at`.

`render_jobs`

- `id`, `user_id`, `project_id`.
- `template_id`, `template_version`.
- immutable `props_snapshot` JSONB.
- `status`, `progress`, `attempt_count`.
- `idempotency_key`.
- `output_asset_id` nullable until completion.
- stable `error_code` plus sanitized `error_message`.
- queue, start, finish, heartbeat, create, and update timestamps.

`render_attempts`

- attempt number, worker/release identifier, start/end time.
- outcome, stable error code, and sanitized diagnostic reference.

`outbox_events`

- event id/type, aggregate id, payload, creation and dispatch timestamps.
- Used by P1-05 to atomically create a job and request queue dispatch.

### Constraints and indexes

- Foreign keys prevent orphaned projects/jobs.
- Unique `(user_id, idempotency_key)` for render creation.
- Check constraints protect known job states and `progress` range.
- Unique `(id, revision)` semantics are enforced by conditional updates.
- Index project listing by `(user_id, updated_at desc)`.
- Index render polling by `(user_id, id)` and reconciliation by
  `(status, heartbeat_at)`.
- Template version must be a positive integer even though the current
  application uses versions 1 and 2.

### Repository behavior

- All records are returned as domain types with ISO timestamps.
- Project update requires the last observed revision and returns a conflict
  response when stale.
- Props are validated before persistence and after database read.
- Soft-deleted records are excluded by default.
- A job is created in the same transaction as its outbox event.
- Database transactions must not include network calls.

### Existing project migration

- Import is explicit and idempotent.
- Records without a template version become V1.
- Invalid template IDs are quarantined, not silently reassigned.
- Existing identifiers and timestamps are retained where valid.
- Imported local projects are assigned to a named bootstrap user selected by
  command argument.
- The importer produces counts for imported, skipped, and quarantined records.

## Expected code and artifacts

- Versioned SQL migrations and schema definitions.
- PostgreSQL repository adapters.
- Repository contract tests shared with local adapters.
- Seed command for template fixture projects.
- Local-data import command with dry-run mode.
- Database migration, backup, restore, and rollback runbooks.

## Delivery slices

1. Add schema, migration runner, fixtures, and repository tests.
2. Implement project reads/writes with optimistic concurrency behind a feature
   flag.
3. Implement render-job persistence and outbox records.
4. Run import rehearsal, switch staging, then remove production access to JSON
   storage.

## Acceptance criteria

- [ ] Project and render APIs pass against PostgreSQL without behavior loss.
- [ ] Concurrent updates cannot silently overwrite one another.
- [ ] A render job and its outbox request are atomic.
- [ ] Old records missing `templateVersion` import as V1.
- [ ] Invalid records are reported with no partial silent conversion.
- [ ] Migrations work on an empty database and a copy of the prior schema.
- [ ] A backup is restored into a clean environment and verified.
- [ ] Production configuration cannot select the JSON repository.

## Test plan

### Automated

- Repository contract tests.
- Migration up/compatibility tests in an ephemeral database.
- Concurrent-update integration tests.
- Transaction rollback and constraint tests.
- Importer fixture tests including missing versions and invalid JSON.

### Manual

- Dry-run and execute import against a copy of local data.
- Simulate two browser sessions editing the same project.
- Restore a backup and compare row counts and sample project renders.

## Operational expectations

- Common project list/read/update queries have measured indexes and no
  sequential scans at expected beta volume.
- Connection pools are bounded per deployment.
- Migration execution is a deliberate deployment step with an advisory lock.
- Database errors are translated into stable API errors without exposing SQL.

## Rollout and rollback

Use a repository feature flag in local/staging only. In staging, optionally
dual-write for a short verification window and compare normalized records.
Production cutover requires a final import, row-count check, and write freeze
for the local store. Rollback restores the pre-cutover database snapshot or
rolls the application back while keeping PostgreSQL authoritative; do not
resume divergent JSON writes.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| ORM/migration tool choice | ADR must guarantee inspectable SQL and repeatable migrations |
| JSONB schema drift | Validate on both write and read; version schemas when shape changes |
| Lost update during autosave | Revision precondition and explicit conflict response |
| Import assigns data to wrong owner | Required bootstrap-user argument and dry-run report |

## Completion evidence

Provide migration logs, repository contract output, concurrency test results,
import dry-run report, restored-backup verification, and query plans for core
operations.
