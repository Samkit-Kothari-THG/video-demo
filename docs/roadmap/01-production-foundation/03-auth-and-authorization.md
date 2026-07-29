# P1-03 — Authentication and authorization

**Status:** Not started  
**Phase:** 1 — Production foundation  
**Size:** L  
**Depends on:** P1-02

## Objective

Introduce production authentication and enforce ownership for every project,
asset, and render operation. A signed-in user must never be able to discover or
modify another user's records.

## Why this packet exists

The current local application assumes one trusted user. Adding hosted storage
or share links before ownership is enforced would make opaque IDs the only
security boundary.

## Scope

### Included

- One initial login method: email magic link or one social identity provider.
- Secure server session lifecycle and logout.
- User provisioning/linking in PostgreSQL.
- Central authorization helpers and repository ownership filters.
- Protection for all current project, upload, and render routes.
- Cross-tenant tests, session audit events, and basic account deletion entry
  point.

### Excluded

- Team workspaces and roles beyond user and internal support administrator.
- Public preview links, which receive a separate scoped-token model in P2-07.
- Billing entitlements.
- Guest lists or RSVP identity.

## Technical specification

### Session requirements

- Use server-validated sessions stored in secure, HTTP-only cookies.
- Cookies use `Secure` in hosted environments, `SameSite=Lax` or stricter, a
  narrow path, and explicit expiry.
- Rotate or invalidate sessions after authentication-sensitive changes.
- Login redirects are allow-listed; arbitrary return URLs are rejected.
- Authentication callbacks are idempotent.
- Normalize email addresses for lookup while retaining display form.

### Authorization model

- Domain operations receive an authenticated actor, never a raw user ID from
  request JSON.
- Project queries include `user_id` in the database predicate.
- Render jobs are authorized through both job ownership and project ownership.
- Asset signing requires a user-owned asset record or an authorized creation
  intent.
- Unknown and foreign-owned identifiers return the same not-found response to
  limit enumeration.
- Internal support access is explicit, audited, read-only by default, and not
  inferred from email domains in application code.

### API behavior

- Unauthenticated browser requests receive a stable unauthorized response or
  login redirect appropriate to the route.
- Mutations include CSRF protection appropriate to the chosen session model.
- API responses never expose identity-provider tokens.
- Project creation derives `user_id` from the authenticated actor.
- List APIs are paginated and tenant-filtered.

### Existing local data

- Provide an explicit command to assign imported bootstrap projects to a real
  authenticated account after email verification.
- Do not auto-claim projects based only on matching invitation content.

## Expected code and artifacts

- Authentication adapter and route handlers.
- Server actor/session resolver.
- Central authorization policy functions.
- Updated repositories and API routes using actor-scoped operations.
- Login, callback/error, and logout UI.
- Account/session security documentation.
- Audit event definitions for login, logout, ownership denial, and support
  access.

## Delivery slices

1. Integrate authentication in staging and provision user records.
2. Add actor-scoped repositories and authorization tests.
3. Protect all application routes and add login/logout experience.
4. Add support-role audit boundary and local-data account assignment.

## Acceptance criteria

- [ ] A new user can sign in, sign out, and resume their own projects.
- [ ] All state-changing APIs reject unauthenticated requests.
- [ ] User A cannot list, read, update, render, sign, or infer User B's data.
- [ ] Browser-supplied `userId` values are ignored or rejected.
- [ ] Session cookies meet the documented security attributes.
- [ ] Redirect and CSRF attacks covered by the test plan are rejected.
- [ ] Support access produces an immutable audit record.
- [ ] Authentication provider failure has a comprehensible recovery screen.

## Test plan

### Automated

- Session validation and expiry tests.
- Route tests for anonymous, owner, foreign owner, and support actor.
- Cross-tenant integration suite for every resource endpoint.
- CSRF, redirect allow-list, callback replay, and logout invalidation tests.
- Database tests proving ownership is part of update/delete predicates.

### Manual

- Complete login on mobile and desktop.
- Use two accounts to attempt identifier substitution.
- Revoke a provider session and confirm local-session behavior.
- Exercise support access and inspect its audit trail.

## Operational expectations

- Authentication failures are measured by stable category, not raw provider
  payload.
- Alert on callback failure spikes and repeated authorization denials.
- Do not log magic links, OAuth codes, access tokens, cookies, or full email
  addresses.
- Session signing/encryption keys have a documented rotation procedure.

## Rollout and rollback

Deploy behind a staging-only enforcement flag, then require authentication for
new production projects before migrating existing owners. Once user-owned
records exist, rollback may change the login provider adapter but must not
disable authorization checks.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Magic link versus social login | Choose one based on target-user friction and email deliverability |
| Provider account linking | Require verified identifiers and explicit conflict handling |
| Support impersonation | Prefer read-only support views; any impersonation requires extra approval and audit |
| Middleware treated as sole security | Enforce ownership again in server domain/repository operations |

## Completion evidence

Include cross-tenant test results, cookie inspection, provider failure
screenshots, audit events, key-rotation runbook, and the protected-route matrix.
