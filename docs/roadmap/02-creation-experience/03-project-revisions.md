# P2-03 — Project revisions and recovery

**Status:** Not started  
**Phase:** 2 — Better creation experience  
**Size:** L  
**Depends on:** P1-02, P2-02

## Objective

Persist recoverable project history so users can survive device/browser
failure, inspect meaningful checkpoints, and restore an earlier design without
destructively overwriting history.

## Why this packet exists

Client undo is session-local. Autosave can faithfully persist an unwanted
change, and optimistic conflicts need a safe resolution path rather than
last-write-wins.

## Scope

### Included

- Immutable server revision records.
- Automatic checkpoints and user-named versions.
- Revision list, compare summary, and restore.
- Conflict detection and safe resolution.
- Recovery of pending browser edits.
- Retention/compaction policy.

### Excluded

- Real-time collaboration and field-level multi-user presence.
- Arbitrary text diff viewer for invitation content.
- Branching/fork graph beyond duplicate project.

## Technical specification

### Revision record

Add `project_revisions`:

- revision ID and project/user ownership;
- project revision number;
- template ID/version;
- validated document snapshot and schema version;
- change summary containing field identifiers and command categories only;
- source: autosave, named checkpoint, restore, guided creation, migration;
- actor and created timestamp;
- optional user-supplied safe label.

Start with snapshots for correctness and simple restore. Introduce compaction
only after measured storage warrants it.

### Creation policy

- Every accepted project revision has a corresponding immutable revision row,
  preferably in the same transaction.
- High-frequency text autosaves may be checkpointed at a bounded interval while
  current project state still updates normally.
- Discrete uploads, template-affecting changes, named saves, and restores always
  create checkpoints.
- Render jobs reference the exact current revision as well as snapshotting
  props.

### Restore

- Restoring revision N creates revision N+1 (or current+1) containing the old
  document.
- It never deletes intervening history.
- Restore validates that the pinned template version and referenced assets are
  still renderable.
- Missing/expired assets produce an explicit partial-restore path; no silent
  substitution.

### Conflict behavior

- Server rejects a stale base revision.
- Client fetches latest revision and compares changed field IDs with pending
  command targets.
- Non-overlapping simple changes may be replayed automatically and visibly.
- Overlapping or structural changes require choosing latest, keep local as a
  duplicate, or review fields.
- Never silently overwrite the other state.

### Browser recovery

- Pending commands are stored locally per user/project with schema version and
  expiry.
- On reload, compare their base revision with server.
- Replay only validated compatible commands.
- Clear recovery data after server acknowledgment, sign-out, deletion, or
  expiry.

## Expected code and artifacts

- Revision schema/migration and repository.
- Transactional checkpoint creation.
- Revision history and restore UI.
- Conflict/replay coordinator.
- Local pending-command recovery store.
- Retention/compaction task and revision runbook.

## Delivery slices

1. Persist immutable revisions with every meaningful project update.
2. Add history list, named checkpoint, and non-destructive restore.
3. Add optimistic-conflict comparison/replay UI.
4. Add local recovery and retention policy.

## Acceptance criteria

- [ ] Server-confirmed project changes have recoverable checkpoints.
- [ ] A restore creates a new revision and leaves prior history intact.
- [ ] Render jobs identify the project revision they snapshot.
- [ ] Stale writes never silently overwrite current state.
- [ ] Pending edits recover after refresh/network interruption.
- [ ] Pending edits from one user/project cannot appear in another.
- [ ] Missing assets during restore are explicit and actionable.
- [ ] Revision retention is documented and user-named versions are protected.

## Test plan

### Automated

- Transactional project/revision consistency tests.
- Restore and pinned-template compatibility tests.
- Concurrent conflict cases for overlapping/non-overlapping commands.
- Local recovery isolation, expiry, and schema-migration tests.
- Retention tests preserving named/render-linked revisions.

### Manual

- Edit on two browser sessions and resolve conflicts.
- Force close during offline editing, then recover.
- Restore a version before/after media changes.
- Inspect history labels with screen reader and mobile.

## Operational expectations

- Measure revision creation, conflict, replay, restore, and recovery outcomes.
- Revision data follows project/account deletion.
- Avoid logging snapshot contents.
- Monitor snapshot storage growth before adopting deltas.

## Rollout and rollback

Begin creating revisions invisibly before exposing the UI. Verify project and
revision consistency, then enable history/restore. Rollback hides the UI but
retains immutable revision data; do not delete history during rollback.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Snapshot storage grows quickly | Measure, checkpoint high-frequency edits, then compact safely |
| Automatic merge surprises user | Auto-replay only non-overlapping typed commands and disclose it |
| Restored version references deleted asset | Protect referenced assets or require explicit replacement |
| Local recovery leaks across sign-in | Namespace by user/project and purge on logout |

## Completion evidence

Attach consistency tests, restore recording, conflict scenarios, offline
recovery demonstration, retention report, and storage baseline.
