# P4-02 — RSVP and guest lifecycle

**Status:** Parked  
**Phase:** 4 — Publishing and business  
**Size:** XL  
**Depends on:** P4-01, P1-03, P0-04

## Objective

Let hosts collect and manage intentional guest responses for a published
invitation while minimizing contact data, preventing cross-event disclosure,
and keeping guest operations independent from invitation design.

## Why this packet exists

Once an invitation is shared, hosts often need to know who is attending.
Guest names, contact details, dietary/accessibility notes, and response history
are materially more sensitive than template inputs. Adding an RSVP form
directly to project props would create unclear ownership, weak authorization,
and no reliable audit or deletion model.

## Scope

### Included

- Event, party/guest, invitation access, questionnaire, and response model.
- Host-configured RSVP open/close and allowed response fields.
- Public-link or guest-specific response modes selected intentionally.
- Guest response, correction, confirmation, and host dashboard.
- Export with safe field selection and formula-injection protection.
- Optional host-authored reminders after separate channel/consent approval.
- Privacy, abuse, retention, and support controls.

### Excluded

- Ticketing, assigned seating, payments, or venue check-in.
- Importing address books without explicit later approval.
- Marketing to guests.
- Inferring attendance from publication views.
- Requiring guests to create Vowframe accounts in the initial flow.
- Messaging channels before consent, sender, and anti-spam review.

## Technical specification

### Domain model

- `Event`: host-owned operational record associated with one publication;
  date/time zone and RSVP policy are copied intentionally, not read from
  mutable project props.
- `Party`: an invitation unit that may contain one or more guests.
- `Guest`: optional named person within a party.
- `GuestAccess`: hashed high-entropy token or other approved access method.
- `Question`: host-enabled, typed, versioned RSVP field.
- `Response`: append-only answer revision with current status projection.
- `GuestAuditEvent`: invitation, view-sensitive action, response, correction,
  export, and support access as policy permits.

Keep design snapshots, publication versions, and guest data in separate tables
and authorization paths.

### Response modes

Support a deliberate mode per event:

- open link with host-approved minimal fields and abuse protection; or
- guest/party-specific capability links for stronger matching.

Do not pretend a forwarded bearer link proves identity. Guest-specific tokens
are stored hashed, can be rotated/revoked, and never appear in analytics or
logs. Hosts must understand the tradeoff before enabling open responses.

### RSVP state and concurrency

Suggested response status:

- awaiting response;
- attending;
- not attending;
- tentative if the host enables it.

Validate party-size limits and required questions server-side. A guest
correction creates a new response version and updates the current projection.
Use idempotency and optimistic concurrency so double-submit/back-button
behavior does not create contradictory counts.

### Questions and sensitive fields

Start with attendance, party size, and an optional host-defined short note.
Dietary, accessibility, travel, or children's details receive a higher
sensitivity classification and shorter, explicit retention. Do not allow
arbitrary executable markup or unlimited forms.

### Host dashboard and export

- Show current totals, awaiting responses, conflicts, and last-updated time.
- Separate publication views from actual responses.
- Limit host/team access by event role.
- Exports require reauthentication or equivalent recent-session policy where
  appropriate and create an audit event.
- CSV cells beginning with formula characters are escaped safely.
- Exports are short-lived, private, and excluded from routine logs/backups
  according to policy.

### Reminders and messaging

Reminder capability remains disabled until the sending identity, consent,
regional anti-spam obligations, rate limits, opt-out behavior, deliverability,
and incident ownership are approved. A draft/copy reminder can ship earlier
because the host performs the actual send.

## Expected code and artifacts

- Guest/event schema, classification update, and migrations.
- Host and guest authorization/capability model.
- RSVP configuration, response page, correction flow, and host dashboard.
- Safe export service and audit trail.
- Rate limits, fraud/abuse controls, retention/deletion jobs.
- Guest privacy text, host guidance, support and incident runbooks.
- Messaging decision record; no live sender until approved.

## Delivery slices

1. Add event/guest boundary and host-configured open-link RSVP for beta.
2. Add guest-specific party links, correction history, and dashboard.
3. Add safe export, retention/deletion, and support workflows.
4. Evaluate reminder drafting, then separately gate any automated sending.

## Acceptance criteria

- [ ] Guest data is not stored in project props or template/render snapshots.
- [ ] Hosts can access only events they own or are explicitly assigned.
- [ ] Guest tokens are high entropy, hashed, revocable, and absent from logs.
- [ ] Double submission and concurrent correction produce one coherent current
      response with history.
- [ ] Hosts can distinguish no response from a publication view.
- [ ] Sensitive optional questions are classified and can be disabled.
- [ ] CSV/export handling prevents formula injection and uses expiring access.
- [ ] Deletion/retention behavior covers guest records, exports, logs, and
      backups accurately.
- [ ] No automated message sends without a separately approved channel gate.

## Test plan

### Automated

- Cross-host/cross-event authorization and token-isolation tests.
- Token hash, rotation, expiry, revocation, and probing-rate tests.
- Response validation, idempotency, concurrency, and revision tests.
- Party-size and questionnaire-version compatibility tests.
- CSV formula-injection and short-lived export tests.
- Retention, deletion tombstone, audit, and aggregate-count tests.

### Manual

- Respond/correct from forwarded and guest-specific links on common devices.
- Attempt to enumerate guests, parties, events, and response endpoints.
- Test open-link spam and host resolution workflow.
- Review screen-reader, keyboard, and low-connectivity behavior.
- Run tabletop exercises for leaked guest export and mistaken deletion.

## Operational expectations

- Monitor response success, validation failure, token probing, export creation,
  deletion lag, and optional messaging health without guest content.
- Support access is least-privilege, time-bounded where possible, and audited.
- Guest data retention is shorter than project retention unless the host has a
  documented reason and user-facing expectation.
- Aggregate dashboards reconcile against authoritative response revisions.

## Rollout and rollback

Start with allow-listed hosts and minimal response fields. Keep automated
messaging disabled. Rollback closes new responses while preserving host access
to already collected data and communicating retention/export options. A
publication can remain available even when RSVP is closed.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Forwarded link changes another guest's response | Explain bearer behavior or use guest-specific party links |
| Host collects excessive sensitive data | Small typed question set and classification-based limits |
| Reminder feature becomes spam tooling | Separate consent/channel gate and conservative quotas |
| Export leaks through spreadsheet behavior | Formula escaping, expiring file, audit, and reauthentication |
| Guest deletion breaks attendance totals | Tombstone/anonymize according to policy with reconciled aggregates |

## Completion evidence

Attach data model/threat review, authorization and concurrency tests, guest and
host usability results, export inspection, deletion tabletop, operational
dashboard, and any approved messaging-channel decision.
