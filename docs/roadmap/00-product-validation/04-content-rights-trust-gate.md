# P0-04 — Content rights, trust, and Phase 0 gate

**Status:** Not started  
**Phase:** 0 — Product proof  
**Size:** L  
**Depends on:** P0-01, P0-02, P0-03

## Objective

Define the minimum trust, content-rights, privacy, and consent contract for
external use, then issue the Phase 0 proceed/repeat/reframe decision. Ensure
that Phase 1 architecture reflects the sensitivity of personal invitations
rather than retrofitting controls after launch.

## Why this packet exists

Invitations can contain names, photographs, event locations, guest details,
children's images, licensed music, and generated artwork. The product also
creates files intended to be forwarded beyond the account owner. Ambiguous
ownership, retention, and publication rules create both user harm and costly
architecture changes.

## Scope

### Included

- Data and asset classification.
- Creator attestations, consent expectations, and prohibited use.
- Artwork, font, music, stock, and AI provenance requirements.
- Rules for images of children and other sensitive personal content.
- Retention, deletion, export, and account-closure expectations.
- Public/share-link privacy principles and abuse reporting.
- Content review and escalation ownership.
- Phase 0 evidence review and roadmap gate.

### Excluded

- Claiming legal compliance without qualified review.
- Building all Phase 1 security or deletion mechanisms.
- Moderating private invitation wording for taste.
- Training models on user content.
- Publishing an open asset marketplace.

## Technical specification

### Data classification

Classify at least:

- account and authentication data;
- project metadata and structured invitation fields;
- uploaded photographs, audio, and other source assets;
- render snapshots and generated outputs;
- share/publish tokens and access events;
- guest/RSVP data planned for Phase 4;
- analytics and support records;
- template source assets and provenance records.

For each class record owner/controller, sensitivity, storage locations,
authorized actors, logging prohibition, retention, export, deletion, and backup
behavior. Default invitation content and uploaded assets to private.

### Creator and subject rights

The product contract must make clear that the creator:

- has permission to use uploaded images, copy, audio, marks, and likenesses;
- controls who receives bearer share links;
- reviews generated or suggested content before publication;
- can revoke links and request deletion subject to documented backup windows.

Define additional consent and support handling for identifiable children.
Avoid using private uploads in demos, fixtures, model training, or template
marketing without separate explicit permission.

### Template and media provenance

Every shipped visual, font, audio track, and generated asset records:

- source and creator/tool;
- license or ownership basis;
- permitted commercial, modification, and distribution uses;
- attribution requirement;
- geographic or time restriction;
- review owner and evidence location;
- replacement/withdrawal procedure.

Generated artwork additionally records a prompt summary, model/tool where
known, human reviewer, and any reference inputs. Provenance is necessary but
does not by itself establish legal clearance.

### Retention and deletion

Set product expectations for:

- abandoned uploads and incomplete projects;
- active project assets;
- render intermediates and completed outputs;
- expired/revoked shared previews;
- closed accounts;
- logs, analytics, support exports, and backups.

P1-04 and P1-08 must translate the policy into lifecycle jobs, deletion
tombstones, verification, and documented backup expiry. The UI should not
promise immediate erasure where backup architecture cannot provide it.

### Sharing and abuse

- Shared or published content is unlisted by default.
- Search indexing requires an explicit later product decision.
- Tokens, signed URLs, event locations, and names must not leak through logs or
  default social metadata.
- Define report, disable, appeal, and evidence-preservation paths for abuse.
- Automatic messaging or contact import requires a separate consent and
  anti-spam review.

### Phase 0 gate

Review P0-01 through P0-04 and choose:

- proceed to Phase 1;
- proceed with named constraints and owners;
- repeat a bounded validation activity;
- reframe the wedge.

The gate must list unresolved risks, their owners, deadlines, and which later
packet blocks on them.

## Expected code and artifacts

- Data/asset classification matrix.
- Creator rights and consent requirements.
- Template/media provenance and rights-record schema.
- Draft retention/deletion schedule.
- Sharing privacy and abuse-response principles.
- Legal-review question list and accountable owner.
- Phase 0 gate report with roadmap amendments.

## Delivery slices

1. Inventory data, assets, actors, and existing handling.
2. Draft rights, consent, provenance, and retention rules.
3. Threat-model sharing, minors' content, and AI-assisted scenarios.
4. Complete appropriate legal/product review and run the Phase 0 gate.

## Acceptance criteria

- [ ] Every current and planned data class has an owner and sensitivity level.
- [ ] Private uploads and outputs are the default.
- [ ] Rights/provenance evidence is required before template publication.
- [ ] Rules explicitly cover children's images and generated assets.
- [ ] Retention and deletion expectations can be implemented by P1-04/P1-08.
- [ ] Share metadata and logging rules prevent accidental event-detail leaks.
- [ ] Abuse reporting and emergency disable ownership are named.
- [ ] Legal uncertainties are recorded as questions, not presented as facts.
- [ ] The Phase 0 gate issues one decision and assigns all exceptions.

## Test plan

### Automated

- No production implementation is required in this packet.
- Validate provenance records against their schema if tooling is introduced.
- Add repository checks preventing unlicensed sample assets or real user data
  from entering fixtures where practical.

### Manual

- Trace one photo from upload through preview, snapshot, output, sharing,
  deletion, logs, and backups.
- Trace one music track and generated artwork item through provenance review.
- Run tabletop scenarios for a leaked link, rights complaint, and deletion
  request involving a minor's image.
- Verify every Phase 0 constraint maps to a later owner/packet.

## Operational expectations

- A named trust owner can disable sharing or a template without deleting
  evidence or breaking pinned private projects.
- Rights records are retained for at least as long as the asset/version is
  supported.
- Support access is auditable and minimized.
- Policy changes are versioned and communicated before materially changing
  creator expectations.

## Rollout and rollback

Apply conservative defaults to the beta. If review remains unresolved for a
capability, keep that capability disabled rather than relying on a disclaimer.
Policy rollback restores the safer prior behavior; it must not silently
republish or lengthen retention for existing private content.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Creator uploads media they do not own | Clear attestation, reporting, takedown, and repeat-abuse process |
| Child's image appears in a forwarded invite | Explicit creator responsibility, private defaults, rapid revoke/delete path |
| License evidence is incomplete | Block template publication until reviewed |
| Product promises deletion faster than backups allow | Publish accurate windows and implement tombstones |
| Phase 0 becomes indefinite policy work | Time-box open questions and gate only capabilities they affect |

## Completion evidence

Attach the classification matrix, rights/provenance schema, retention schedule,
tabletop notes, review question log, signed Phase 0 gate, and the resulting
updates to Phase 1–4 dependencies.
