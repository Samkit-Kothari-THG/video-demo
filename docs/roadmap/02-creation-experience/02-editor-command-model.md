# P2-02 — Editor command model and undo/redo

**Status:** Not started  
**Phase:** 2 — Better creation experience  
**Size:** L  
**Depends on:** P2-01

## Objective

Replace ad hoc project-state mutations with a typed command model that makes
every supported edit predictable, undoable, autosavable, and identical in
Player and final render inputs.

## Why this packet exists

Adding inline editing, crop transforms, scene visibility, style tokens, and
revision recovery directly to the current `updateProps()` pattern would make
undo grouping, validation, and persistence inconsistent.

## Scope

### Included

- Canonical editor state and typed edit commands.
- Local undo/redo history with sensible coalescing.
- Derived render props and validation.
- Debounced, revision-aware autosave queue.
- Save-state/error UI and keyboard shortcuts.
- Command instrumentation without user content.

### Excluded

- Persistent server revision browsing, delivered in P2-03.
- Multi-user collaboration or operational transforms.
- Free-form canvas layers.

## Technical specification

### State separation

Maintain:

- `confirmedProject`: latest server-confirmed project and revision;
- `workingDocument`: local command result shown by controls and Player;
- `pendingCommands`: ordered edits not yet confirmed;
- `historyPast` and `historyFuture`;
- derived validation, dirty state, and save status.

Do not maintain a separate preview-only copy. The Player receives the same
derived document that is serialized for render snapshots.

### Commands

Initial command categories:

- set text field;
- set photo asset;
- set crop/focal transform;
- toggle photo;
- set soundtrack/volume;
- set allowed style token;
- set scene visibility/order/duration preset when supported;
- apply a guided-brief patch;
- restore a server revision.

Each command defines:

- stable type and schema version;
- payload validation;
- reducer/apply behavior;
- inverse or prior-value data for undo;
- human-readable history label;
- persistence patch;
- analytics category without content.

### Undo/redo behavior

- Consecutive keystrokes in one field coalesce within a short window.
- Discrete choices, uploads, crop completion, and scene changes are separate
  history entries.
- Undo affects pending/local changes immediately and schedules autosave.
- A new edit after undo clears redo history.
- Successful autosave does not clear local history.
- Changing project or template clears/reinitializes history deliberately.
- Browser shortcuts work without intercepting native text undo inside an active
  input unless behavior is explicitly coordinated.

### Autosave

- Queue commands/patches against a base project revision.
- Coalesce safe field updates and preserve command ordering where material.
- Only one save request per project is active at a time.
- On success, update confirmed state and remove acknowledged commands.
- On network failure, retain commands and retry with bounded backoff.
- On revision conflict, stop blind retry and invoke P2-03 conflict/recovery UI.
- Navigation warns only when changes are not safely persisted locally/server.

## Expected code and artifacts

- Editor document/command schemas and pure reducers.
- History manager and autosave coordinator.
- Integration replacing direct `updateProps()` mutations.
- Save/conflict/offline status UI.
- Keyboard shortcut and analytics definitions.
- Developer documentation for adding a new command.

## Delivery slices

1. Define canonical document, commands, reducer, and history tests.
2. Migrate text/style toggles and current autosave.
3. Migrate media/audio operations and add keyboard behavior.
4. Remove old mutation path and document extension rules.

## Acceptance criteria

- [ ] Every supported editor mutation is represented by a typed command.
- [ ] Undo/redo produces the expected Player state without reload.
- [ ] Text typing is coalesced rather than creating one history entry per key.
- [ ] Autosave never sends out-of-order project revisions.
- [ ] Network failure retains edits and visibly recovers.
- [ ] Player props and saved render input derive from one working document.
- [ ] Changing projects cannot apply pending commands to the wrong project.
- [ ] Command analytics contain types/locations, not values.

## Test plan

### Automated

- Reducer and inverse-property tests for each command.
- History coalescing and redo invalidation tests.
- Autosave ordering, retry, acknowledgment, and project-switch tests.
- Validation/derived-props equivalence tests.
- Shortcut behavior in and outside text inputs.

### Manual

- Rapid typing under slow/offline network.
- Undo/redo across text, toggle, upload, and crop.
- Switch projects while saves are pending.
- Compare Player and rendered fixture after a complex command sequence.

## Operational expectations

- Normal text edits update local preview in the next animation frame.
- Autosave requests are bounded and observable by outcome/conflict.
- Persisted command payloads never include blob URLs.
- Errors identify whether work is safe locally, pending, or needs action.

## Rollout and rollback

Migrate one command category at a time behind an editor feature flag. During
transition, a field must use exactly one mutation path. Rollback loads the last
server-confirmed project; do not discard queued changes without warning.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Command system becomes event sourcing | Commands are an editor mechanism; PostgreSQL project remains current state |
| Undo conflicts with native input undo | Define focus-aware shortcut ownership and test it |
| Autosave acknowledgment drops newer edit | Tag requests with base revision and acknowledged command IDs |
| Derived preview differs from persistence | One canonical reducer/serializer used by both |

## Completion evidence

Provide reducer/history tests, offline autosave recording, complex-sequence
render comparison, shortcut QA, and removal of direct mutation call sites.
