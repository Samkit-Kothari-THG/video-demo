# P3-04 — Versioning, migration, and deprecation

**Status:** Not started  
**Phase:** 3 — Template platform  
**Size:** L  
**Depends on:** P3-01

## Objective

Define and implement the lifecycle that lets published templates evolve
without changing old projects or making historical renders impossible.

## Why this packet exists

The current V1/V2 model correctly pins projects, but long-term operation also
requires rules for immutable publication, prop-schema migrations, asset/font
retention, deprecation, legal/security retirement, and editor compatibility.

## Scope

### Included

- Template lifecycle states and publication rules.
- Immutable published versions and manifest checksum.
- Input/snapshot schema migrations.
- Deprecation and creation visibility.
- Runtime/asset retention requirements.
- Exceptional retirement process.
- Project upgrade/duplicate-to-new-version workflow.

### Excluded

- Automatic visual migration of all projects.
- Deleting historical versions to reduce ordinary storage cost.
- Marketplace creator versioning.

## Technical specification

### Identity and lifecycle

`templateId + templateVersion` is permanent.

States:

- `draft`: authoring only, mutable.
- `internal`: test users, mutable with controlled reset.
- `published`: immutable manifest, runtime behavior, and required assets.
- `deprecated`: existing projects render; new selection hidden or discouraged.
- `retired`: exceptional state for legal/security impossibility with explicit
  affected-project handling.

Publishing records manifest checksum, release, author/reviewer, date, rights
references, and baseline set.

### Compatibility

- Project stores template identity and document schema version.
- Render snapshot stores identity, snapshot schema, format, preset, and
  protected asset references.
- Runtime registry retains code capable of resolving supported historical
  versions.
- Required fonts, audio, backgrounds, and primitive behavior remain available.
- A release cannot remove compatibility while active projects/jobs require it.

### Migrations

- Migrations are pure, ordered, schema-version-to-schema-version functions.
- They preserve unknown forward-compatible fields where policy allows.
- Read may migrate into an in-memory current editor document; persistent
  migration occurs explicitly with revision/audit.
- Migration never changes `templateVersion`; moving to a new visual version is
  an explicit upgrade/duplicate action.
- Failed migration blocks editing/render with an actionable diagnostic, never a
  default-template substitution.

### Deprecation and upgrade

- Deprecated editions disappear from new-project recommendations but remain
  visible on existing projects.
- Creator can duplicate into a recommended newer version through a previewed
  field/asset mapping.
- Original project stays intact.
- Unsupported token/scene/media mappings require explicit user choices.

### Retirement

Only legal, security, or irrecoverable dependency issues justify retirement.
Document affected projects, communication, replacement/export options,
deadline, and retained completed outputs.

## Expected code and artifacts

- Lifecycle/checksum fields and publication validator.
- Migration registry and fixtures.
- Runtime/asset compatibility report.
- Deprecation catalogue/editor behavior.
- Duplicate/upgrade mapping flow.
- Publish, deprecate, restore, and exceptional-retire runbooks.

## Delivery slices

1. Add lifecycle/checksum and lock published manifest mutation.
2. Add schema migration registry and compatibility tests.
3. Add deprecation/new-selection behavior.
4. Add previewed duplicate-to-new-version path and lifecycle runbooks.

## Acceptance criteria

- [ ] Published manifest mutation fails validation/CI.
- [ ] Existing V1 and V2 projects continue to preview and render.
- [ ] Schema migrations are deterministic and fixture tested.
- [ ] Migration never silently changes visual template version.
- [ ] Deprecated versions cannot be chosen for new projects but remain usable
      where pinned.
- [ ] Upgrade creates a new project/revision with previewed mappings.
- [ ] Compatibility report identifies code/assets required by active versions.
- [ ] Retirement requires documented exceptional approval and user plan.

## Test plan

### Automated

- Published-checksum immutability tests.
- Migration chain, idempotence, malformed document, and fixture tests.
- Deprecation gallery/API tests.
- Upgrade mapping and original-project preservation tests.
- Historical low-resolution renders for every supported version.

### Manual

- Open/edit/render oldest fixture after current release.
- Deprecate a staging edition and verify all surfaces.
- Upgrade projects with photo/no-photo and custom tokens.
- Exercise failed migration/support diagnostics.

## Operational expectations

- Dashboard active projects/jobs by template/version and schema.
- Publication/deprecation actions are audited.
- Compatibility assets are protected from lifecycle deletion.
- Release checklist reports historical smoke-render coverage.

## Rollout and rollback

Add lifecycle metadata with current editions marked published only after
checksums/baselines are recorded. Rollback may relax new tooling but cannot
mutate already recorded published versions or drop their runtime/assets.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Bug fix needed in published version | Publish new version unless proven non-visual operational fix under policy |
| Old runtime increases bundle/maintenance | Server registry/code splitting and measured retention, not silent deletion |
| Upgrade loses custom values | Preview mapping, validation, explicit unresolved choices |
| Asset cleanup deletes historical dependency | Compatibility references protect lifecycle |

## Completion evidence

Attach lifecycle policy, manifest checksums, migration fixtures, oldest-version
renders, deprecation recording, upgrade demonstration, and compatibility
report.
