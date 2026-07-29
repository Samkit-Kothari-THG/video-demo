# P3-01 — Template manifest v2

**Status:** Not started  
**Phase:** 3 — Template platform  
**Size:** L  
**Depends on:** Phase 1 gate

## Objective

Replace the growing implicit template contract with a serializable,
schema-validated manifest that declares identity, inputs, render formats,
scenes, edit capabilities, assets, and compatibility.

## Why this packet exists

The current catalogue is a strong MVP boundary, but future duration presets,
editable regions, media slots, formats, tokens, and deprecation rules cannot be
represented safely through template-ID conditionals.

## Scope

### Included

- Versioned manifest schema and validation.
- Separation of serializable metadata from runtime component registration.
- Capability declarations for scenes, fields, media, styles, audio, and
  formats.
- Manifest checksum/compatibility metadata.
- Migration of current ten editions without visual changes.
- Client-safe catalogue projection and server/runtime registry checks.

### Excluded

- New visual templates.
- Automatic registry editing; catalogue/runtime registration remains an
  explicit reviewed step.
- Scene primitive refactor, delivered in P3-02.
- Actual additional formats, delivered in P3-03.

## Technical specification

### Manifest shape

The schema must cover:

```ts
type TemplateManifest = {
  identity: {
    id: string;
    version: number;
    name: string;
    category: string;
    status: "draft" | "internal" | "published" | "deprecated";
  };
  content: {
    schemaVersion: number;
    defaults: Record<string, unknown>;
    fields: TemplateField[];
  };
  render: {
    compositionId: string;
    formats: FormatCapability[];
    presets: DurationPreset[];
  };
  scenes: SceneCapability[];
  mediaSlots: MediaSlotCapability[];
  editableRegions: EditableRegionCapability[];
  styleTokens: StyleTokenCapability[];
  audio: AudioCapability;
  assets: TemplateAssetReference[];
  compatibility: {
    minimumAppSchema: number;
    snapshotSchema: number;
  };
};
```

Exact types are refined during implementation, but identity/version and
published compatibility semantics are mandatory.

### Serializable/runtime split

- Manifest data must be serializable and safe to validate without importing
  React or renderer code.
- A runtime registry explicitly maps composition/runtime IDs to components.
- Build validation fails when a published manifest lacks a runtime entry or
  when a runtime entry is unreferenced.
- Client catalogue receives a safe projection with no server paths, secrets,
  rights documents, or provider keys.

### Capabilities

- Absence means unsupported; the editor never guesses.
- Capability IDs are stable within a template version.
- Fields link to editable regions and scenes by ID.
- Media slots declare transforms/fallbacks.
- Formats and duration presets declare exact renderer behavior.
- Style/audio options use stable IDs, not arbitrary CSS or URLs.
- Manifest validation detects dangling IDs and contradictory requirements.

### Defaults and validation

- Default documents validate against the declared content schema.
- Existing `createTemplateDraft`, copy resolution, and validation become
  manifest-aware domain functions.
- Published manifests are treated as immutable; correction requires a new
  version under P3-04.
- Unknown client capability values are rejected server-side.

## Expected code and artifacts

- Manifest types/schema and invariant validator.
- Runtime registry and client-safe projection.
- Build-time manifest validation command.
- Migrations for all ten existing editions.
- Contract documentation and manifest examples.
- Tests preventing dangling scene/field/format/asset references.

## Delivery slices

1. Define schema/invariants and represent one V2 edition.
2. Split runtime registry from metadata and add build validation.
3. Migrate remaining editions with compatibility adapters.
4. Switch gallery/editor/server to manifest projection and remove old
   conditionals where covered.

## Acceptance criteria

- [ ] All ten editions pass manifest schema and invariant validation.
- [ ] Published identity is unique by `(id, version)`.
- [ ] Runtime components and composition IDs are exhaustively registered.
- [ ] Client projection contains only approved serializable fields.
- [ ] Existing projects and renders show no intended visual/content change.
- [ ] Editor controls derive support from capabilities, not template IDs.
- [ ] Invalid/dangling capabilities fail CI with actionable messages.
- [ ] Defaults and fixtures validate through the same content contract.

## Test plan

### Automated

- Schema tests for valid and malformed manifests.
- Cross-reference invariant tests.
- Runtime/manifest exhaustiveness test.
- Client-projection secret/server-field test.
- Existing project fixture and render still regression.
- Unknown capability rejection at API boundaries.

### Manual

- Compare gallery/editor for all ten editions.
- Render V1 and V2 representative projects.
- Inspect client-delivered manifest projection.
- Author one deliberately invalid manifest and confirm diagnostics.

## Operational expectations

- Published manifests/checksums are included in release diagnostics.
- Render jobs record template identity, snapshot schema, and relevant manifest
  checksum/release.
- Manifest validation runs before production build/deploy.
- Template catalogue failure cannot silently substitute another edition.

## Rollout and rollback

Read current catalogue definitions through an adapter while manifests are
migrated. Switch one family at a time. Rollback restores the adapter, but
published manifest IDs/versions already referenced by projects must remain
available.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Manifest becomes a programming language | Keep behavior in reviewed primitives/runtime; manifest selects capabilities |
| Client bundle grows with internal metadata | Explicit client projection and size check |
| Runtime registry and manifest drift | Build-time exhaustive validation |
| Migration changes existing visuals | Still baselines and full smoke render before/after |

## Completion evidence

Attach schema documentation, validation output, projection inspection,
ten-edition migration matrix, and no-change regression renders.
