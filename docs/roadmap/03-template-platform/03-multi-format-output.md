# P3-03 — Multi-format output model

**Status:** Not started  
**Phase:** 3 — Template platform  
**Size:** XL  
**Depends on:** P3-01, P3-02

## Objective

Support reviewed 9:16 video, 4:5 feed, 1:1 square, and static invitation outputs
from one project revision without treating alternate formats as naive crops.

## Why this packet exists

Invitation content is shared across WhatsApp status, Instagram stories/feed,
square previews, and static messages. Reauthoring projects wastes user effort,
but simply cropping portrait compositions breaks safe areas and typography.

## Scope

### Included

- Formal format IDs and layout capabilities.
- Format-aware scene primitives, safe areas, and text fitting.
- Multiple outputs from one immutable project revision.
- Per-format still/video support declared by template.
- Editor format preview and render selection.
- Cost/capacity instrumentation.

### Excluded

- Arbitrary custom dimensions.
- Landscape 16:9 in the initial packet.
- Automatic content rewriting per format.
- Platform publishing APIs.

## Technical specification

### Initial formats

- `story-9x16-video`: 1080×1920, template duration presets.
- `feed-4x5-video`: 1080×1350, supported presets.
- `square-1x1-video`: 1080×1080, supported presets.
- `portrait-static`: reviewed portrait poster dimensions.
- Optional 4:5/1:1 static variants when declared.

Dimensions and codec/image defaults are server policy referenced by stable
format ID; clients cannot submit arbitrary width/height/fps.

### Layout behavior

- Each scene primitive receives a format/layout mode and declared safe area.
- Templates map formats to reviewed layout variants.
- Decorative backgrounds may use per-format assets or focal positioning.
- Text sizes/line breaks are resolved independently per format within common
  content limits.
- Scene inclusion/timing may differ only through declared presets.
- Unsupported formats are absent from capability UI and rejected by API.

### Project and job model

- Project content remains format independent where possible.
- Optional format-specific placement/token overrides are namespaced by format.
- A render job snapshots one explicit format/preset.
- Multiple jobs may share a project revision but have separate idempotency
  keys, costs, states, and outputs.
- Output filenames/metadata contain safe format labels.

### Editor

- Format switch preserves edits and clearly indicates format-specific
  adjustments.
- Preview canvas uses exact composition dimensions/aspect.
- Warnings identify content/placement that requires per-format review.
- “Apply to all formats” is available only for compatible commands.

## Expected code and artifacts

- Format policy and manifest capability schema.
- Format-aware composition metadata/timeline registration.
- Responsive primitive/layout variants.
- Editor format switch and override model.
- Worker/static/video render option validation.
- Multi-format visual fixtures and cost metrics.

## Delivery slices

1. Add format model and static/9:16 behavior without UI change.
2. Implement 4:5 on one representative light and dark edition.
3. Add editor switching/overrides and 1:1.
4. Roll supported formats across flagship templates and benchmark.

## Acceptance criteria

- [ ] Render dimensions/fps come from server-declared format policy.
- [ ] Unsupported or arbitrary formats are rejected.
- [ ] One revision can produce multiple independently tracked outputs.
- [ ] 4:5 and 1:1 layouts are reviewed recompositions, not clipped 9:16 frames.
- [ ] Required invitation information remains readable in every supported
      format.
- [ ] Format-specific adjustments do not unexpectedly alter other formats.
- [ ] Player and rendered dimensions/layout agree.
- [ ] Render metrics and estimated cost can be grouped by format/preset.

## Test plan

### Automated

- Format/preset allow-list tests.
- Composition metadata tests for exact dimensions/duration.
- Layout safe-area and long-copy snapshots per format.
- Override isolation and “apply all” tests.
- Worker render integration for each media kind.
- Full low-resolution video and final-size still smoke tests.

### Manual

- Review representative outputs in WhatsApp/Instagram-like safe areas.
- Switch formats after extreme crop/text edits.
- Compare light/dark and photo/no-photo templates.
- Validate download file metadata.

## Operational expectations

- Track requests, duration, success, bytes, and compute time by format.
- Apply format-specific concurrency/cost limits if measurement requires.
- Static and video outputs follow the same private-storage retention policy.
- A new format requires manifest, editor, worker, test, and rights review.

## Rollout and rollback

Capabilities are per template/version. Start with internal/flagship editions and
hide unsupported choices. Rollback removes a format from new requests while
preserving access to completed outputs and pinned manifests.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Combinatorial format × preset × scene growth | Capability matrix and flagship rollout before broad support |
| Users assume edits apply everywhere | Visible format scope and explicit apply-all command |
| Background lacks alternate composition | Per-format asset/focal declaration |
| Render costs grow | Measure and enforce format/preset policy |

## Completion evidence

Attach capability matrix, per-format output samples, safe-area review,
override-isolation tests, worker metrics, and cost benchmark.
