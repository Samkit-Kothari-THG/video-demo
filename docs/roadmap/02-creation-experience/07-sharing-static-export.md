# P2-07 — Shareable previews and static export

**Status:** Not started  
**Phase:** 2 — Better creation experience  
**Size:** L  
**Depends on:** P1-03, P1-04

## Objective

Let creators share a controlled preview for review and download a static
invitation when video is unnecessary, without making projects or assets public.
Establish a domain boundary that prevents a review link from becoming the
mutable foundation for the later published invitation and RSVP lifecycle.

## Why this packet exists

Creators often need family approval before spending time on a final export.
Some channels also work better with a single image. Sending account credentials
or permanent storage URLs is unacceptable. A project, review snapshot, export,
and published invitation also have different ownership and retention behavior;
collapsing them into one record would make later publishing unsafe and
difficult to migrate.

## Scope

### Included

- Revocable, expiring preview links pinned to a project revision.
- Guest preview page with minimal metadata and no editor controls.
- Link-view analytics and abuse limits.
- Server-rendered portrait static export.
- Authorized owner downloads and optional guest download policy.
- Explicit project/revision/share/export domain boundaries that remain
  compatible with P4-01 publishing.

### Excluded

- RSVP, comments, guest lists, and collaboration.
- Permanent or custom published invitation URLs.
- A mutable “always latest” public invitation.
- Search-engine indexing.
- Editable public links.
- Arbitrary export dimensions beyond declared template formats.

## Technical specification

### Lifecycle boundary

Use distinct concepts:

- `Project`: the creator-owned mutable working document.
- `ProjectRevision`: an immutable, validated snapshot of project inputs.
- `ShareLink`: a revocable review capability pointing to exactly one revision
  and a limited permission set.
- `StaticExport`: an immutable generated artifact tied to one revision,
  template version, format, and render attempt.
- `Publication`: a future host-controlled invitation release with its own
  version history, URL, privacy, and guest lifecycle; implemented in P4-01.

P2-07 must not create a generic public flag on `Project`, use a project ID as a
public URL, or make a share link silently follow the latest project revision.
Names and repository interfaces should leave room for `Publication` without
requiring P2-07 to build it.

### Share link

Store:

- opaque link ID and creator/project ownership;
- pinned project revision and template version;
- hashed high-entropy bearer token;
- created, expiry, revoked, and last-view timestamps;
- permissions: view preview, play audio, download static/video as supported;
- optional safe creator label.

The raw token is shown only at creation. Database stores a hash. Revocation and
expiry are checked on every request. Responses prevent indexing and minimize
referrer leakage.

### Guest experience

- Resolve only the pinned revision, never mutable latest state.
- Display loading/error/expired/revoked states without revealing owner data.
- Do not expose asset IDs, storage keys, props JSON, or editing APIs.
- Audio playback remains user initiated.
- Apply rate limits and cache policy compatible with revocation.
- Social metadata uses generic/product-safe content unless the creator
  explicitly approves supported fields.
- Never put event names, venue, date, photograph, bearer token, or owner
  identity in a page title, analytics property, referrer, or social image by
  default.

### Static export

- Add a render kind for still image using a template-declared poster/finale
  frame or static composition.
- Store output in private object storage with format and dimensions.
- Use immutable revision/template/assets, the same as video jobs.
- Initial format: high-quality PNG or JPEG selected by artwork needs.
- File naming is sanitized and independent of user-provided path strings.

### Updating a share

Default behavior is immutable: edits do not change an existing shared link.
The creator may create a new link or explicitly repoint after confirmation,
which records an audit event and invalidates caches.

### Abuse and lifecycle behavior

- Apply creation, token-resolution, and download limits separately.
- Treat repeated invalid tokens as probing without logging the raw token.
- Allow the owner or authorized support process to revoke a link immediately.
- Expiry stops new access but does not delete the underlying owner project.
- Cleanup removes link-scoped cached artifacts only when no owner/export
  retention rule still needs them.
- Reserve hosted-event, guest-contact, RSVP, and reminder behavior for P4-01
  and P4-02; do not attach those fields to `ShareLink`.

## Expected code and artifacts

- Share-link schema, token generation/hash, and authorization.
- Owner create/list/revoke UI and APIs.
- Guest preview route with privacy/security headers.
- Static render job/output support.
- Link analytics and abuse controls.
- Expiry/revocation cleanup task and support documentation.
- Domain/lifecycle decision documenting `Project`, `ProjectRevision`,
  `ShareLink`, `StaticExport`, and the future `Publication` boundary.

## Delivery slices

1. Add pinned, expiring view-only links and guest page.
2. Add owner link management, revocation, and analytics.
3. Add static render job and downloads.
4. Add permission options, abuse controls, and cache/revocation verification.
5. Verify the data/API boundary against the P4-01 publication contract.

## Acceptance criteria

- [ ] Link resolves exactly the pinned revision and template version.
- [ ] Revoked/expired links stop working within the documented cache window.
- [ ] Tokens are high entropy and stored only as hashes.
- [ ] Guest APIs reveal no project/asset internals.
- [ ] Link pages are not indexed.
- [ ] Static output matches the declared frame/layout.
- [ ] Unauthorized users cannot list or revoke another creator's links.
- [ ] Analytics contain link surrogate and outcome, not invitation copy.
- [ ] A project cannot be made public or resolved by its internal identifier.
- [ ] Share links never follow mutable project state unless the owner performs
      an explicit, audited repoint operation.
- [ ] Share-link records contain no guest, RSVP, or publication-lifecycle data.
- [ ] Domain documentation describes a migration-free path to P4-01.

## Test plan

### Automated

- Token entropy/hash, expiry, revocation, and permission tests.
- Cross-tenant owner endpoint tests.
- Pinned-revision immutability tests.
- Cache/security-header tests.
- Static render parity and private download tests.
- Rate-limit tests.
- Domain/API tests proving project identifiers and latest revisions cannot be
  resolved through the guest route.
- Retention tests distinguishing link expiry from project/output deletion.

### Manual

- Open link signed out on mobile and desktop.
- Forward link and verify intended bearer behavior.
- Revoke while open and verify next access.
- Download/check static exports for representative light/dark templates.
- Edit the source project and confirm the shared review remains unchanged.
- Inspect page title, metadata, referrer behavior, logs, and analytics for event
  details and tokens.

## Operational expectations

- Track create, view, unique approximate view, expiry, revoke, and output
  download.
- Alert on token-probing or abnormal link traffic.
- Share-link and guest access logs avoid IP retention beyond policy.
- Expired links and associated unneeded outputs follow retention.

## Rollout and rollback

Start with short-lived preview-only links for allow-listed beta users. Static
export follows after render reliability. Rollback disables new link creation
and revokes or preserves existing links according to the communicated policy.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Bearer link is forwarded | Clearly communicate link access; offer revocation/expiry |
| Cache serves revoked content | Private/no-store initially or bounded cache with purge |
| Metadata leaks names/event | Generic defaults; explicit creator opt-in |
| Static frame is visually weak | Template declares reviewed poster frame/static layout |
| Review link becomes the hosted product by accident | Keep publication as a separate P4-01 aggregate |
| Link expiry deletes owner content | Independent retention and lifecycle rules |

## Completion evidence

Attach token/security tests, guest-page screenshots, revoke timing, static
exports, header inspection, analytics samples, and the approved lifecycle
boundary decision.
