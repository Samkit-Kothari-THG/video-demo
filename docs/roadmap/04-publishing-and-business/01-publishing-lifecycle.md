# P4-01 — Publishing lifecycle and delivery channels

**Status:** Parked  
**Phase:** 4 — Publishing and business  
**Size:** XL  
**Depends on:** Phase 2 gate, P2-07, P3-03, Phase 0 publishing constraints

## Objective

Turn a creator-approved project revision into a stable, controllable published
invitation that can be shared across common channels without exposing the
editable project, storage internals, or future guest records.

## Why this packet exists

A review link answers “is this draft acceptable?” A published invitation
answers “what has the host released to guests?” It needs a durable URL,
version history, privacy policy, delivery formats, and operational controls.
Using a mutable project or P2-07 bearer link as the hosted product would make
edits unpredictable, revocation ambiguous, and RSVP expansion unsafe.

## Scope

### Included

- Publication and immutable publication-version domain model.
- Host-controlled publish, update, pause, restore, expire, and archive actions.
- Stable unlisted URL with optional custom slug where available.
- Privacy modes approved by P0-04.
- Channel-aware share sheet and static/video delivery choices.
- Safe social/preview metadata controls.
- Publication views, health, retention, and abuse limits.
- Compatibility boundary for P4-02 RSVP.

### Excluded

- Guest list, RSVP forms, reminders, and contact import.
- Search-indexed public invitation directory.
- Sending WhatsApp, SMS, or email messages on the user's behalf.
- Custom domains in the first delivery slice.
- Editing project content from the guest route.

## Technical specification

### Domain model

- `Project` remains mutable and creator/workspace owned.
- `ProjectRevision` is an immutable validated editing snapshot.
- `Publication` owns stable URL, host, privacy, state, and current version.
- `PublicationVersion` pins project revision, template/version, resolved
  assets, published metadata, formats, and creation actor/time.
- `PublishedArtifact` identifies immutable static/video/web derivatives.

Publishing creates a new version and atomically points the publication to it.
Editing the source project never changes guest-visible content. Updating a
publication is an explicit action with a review diff and audit event. Previous
versions remain available for rollback under the retention policy.

### State model

Recommended publication states:

```text
draft -> published -> paused -> published
                  -> expired
                  -> archived
```

- `draft` has no guest resolution.
- `published` resolves the active immutable version.
- `paused` shows a neutral unavailable state without deleting history.
- `expired` follows a scheduled event/host policy.
- `archived` is host-closed and excluded from normal management views.

Transitions are authorized, idempotent, audited, and safe under retries.
Deletion is a separate P1-08 data-lifecycle operation, not a publication state.

### URL and privacy

- Use a non-sequential public identifier independent of internal project IDs.
- Normalize and reserve custom slugs; prevent confusing, abusive, or system
  names.
- Initial default is unlisted and no-index.
- If password/PIN access is supported, store a slow hash and rate-limit
  attempts; do not treat a shared PIN as guest identity.
- Allow host revocation/pause without changing the private project.
- Do not expose object keys, revision IDs, props JSON, owner identity, or
  storage URLs.

### Delivery and channel behavior

- Use the platform share sheet or copy-link action; do not claim automatic
  delivery.
- Offer only artifacts declared by the selected template/version.
- Provide WhatsApp-friendly copy/link presentation and reviewed output sizes,
  while leaving the final send action to the creator.
- Respect user-initiated audio playback and data-saving behavior.
- Generate safe default social metadata. Event-specific title, image, or date
  requires explicit preview and creator approval because messaging platforms
  may cache it after revocation.
- Record artifact checksum, dimensions, media type, and publication version.

### Guest resolution and caching

Resolve publication identifier to state and active version server-side. Cache
immutable artifacts aggressively, but keep publication-state/active-version
resolution within a documented pause/rollback window. Never cache bearer
credentials or signed storage URLs in public markup.

### RSVP compatibility

P4-01 reserves publication-scoped extension points for an optional `Event` and
guest experience but stores no guest contacts or responses. P4-02 must attach
RSVP configuration to the publication/event boundary, not project props or
template input.

## Expected code and artifacts

- Publication/version/artifact schema and migrations.
- Authorized repository/service/API layer and state machine.
- Host publish/update/pause/rollback/archive interface.
- Guest publication route with privacy and error states.
- Safe URL/slug and metadata service.
- Channel/output share interface.
- Publication metrics, cleanup jobs, support runbook, and ADR.

## Delivery slices

1. Add publication model and unlisted no-index route behind an allow-list.
2. Add explicit version update, pause, rollback, expiry, and audit history.
3. Add artifact selection, share sheet, safe metadata preview, and slug rules.
4. Add caching, abuse protection, lifecycle jobs, and operational gate.

## Acceptance criteria

- [ ] Publishing always pins one immutable project revision/template version.
- [ ] Editing a project never changes an existing publication.
- [ ] Update and rollback are explicit, audited, and atomic.
- [ ] Paused/expired/archived states expose no private reason or owner data.
- [ ] Internal IDs, storage keys, props, and signed URLs never reach guests.
- [ ] Default publications are unlisted and excluded from indexing.
- [ ] Creator previews exactly which metadata and artifact will be shared.
- [ ] Channel UI never implies a message was sent when it only copied/shared.
- [ ] P4-02 can attach RSVP without migrating invitation design into guest
      records.

## Test plan

### Automated

- State-transition, idempotency, authorization, and concurrency tests.
- Immutable version and atomic pointer-update tests.
- Cross-tenant publication management tests.
- Public identifier/slug normalization, collision, and reserved-name tests.
- No-index, security-header, metadata, caching, and pause-propagation tests.
- Artifact checksum/format and private-storage resolution tests.
- Property tests preventing project/revision IDs in guest payloads.

### Manual

- Publish, edit source, update, pause, restore, rollback, expire, and archive.
- Share on representative mobile/desktop browsers and messaging apps.
- Inspect cached social metadata and document its invalidation limitations.
- Test slow network, audio-disabled, missing artifact, and withdrawn template.
- Review guest page with accessibility and privacy checklists.

## Operational expectations

- Monitor resolve success, latency, state, active version, artifact delivery,
  and abnormal identifier probing.
- A host or authorized support role can pause a publication quickly.
- Publication views do not log invitation copy, tokens, guest identity, or
  precise location.
- Lifecycle jobs are idempotent and expose lag/failure metrics.
- Published versions and rights evidence remain traceable for their support
  lifetime.

## Rollout and rollback

Begin with unlisted, no-index publications for an allow-listed cohort. Keep
P2-07 review links available during rollout. Feature flags can disable new
publishing and channel metadata independently. Rollback points the publication
to a known valid version or pauses it; never repoint it to mutable project
state.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Review and publication concepts drift together | Separate aggregates, routes, permissions, and metrics |
| Messaging app caches sensitive metadata | Generic default plus explicit preview/opt-in |
| Custom slug exposes event details | Warn, validate, reserve, and allow change with redirects policy |
| Host expects edits to update instantly | Explicit publish-update workflow with clear status |
| Cached page survives pause | Short state-resolution TTL and documented purge target |

## Completion evidence

Attach schema/state ADR, authorization and transition tests, guest privacy
inspection, channel screenshots, pause/rollback timing, cache behavior,
operational dashboard, and allow-list findings.
