# P2-05 — Media editing experience

**Status:** Not started  
**Phase:** 2 — Better creation experience  
**Size:** L  
**Depends on:** P1-04, P2-02

## Objective

Provide a reliable, touch-friendly media workflow for selecting, uploading,
cropping, zooming, replacing, and removing photos while guaranteeing equivalent
Player and rendered framing.

## Why this packet exists

The current vertical focal-point slider proves the workflow but cannot express
common crop decisions or upload-processing states. Media is also the most
likely source of slow, failed, or privacy-sensitive interactions.

## Scope

### Included

- Template-declared media slots.
- Upload/progress/verification/processing UI.
- Pan, zoom, focal point, and constrained rotation if supported.
- Replace/remove/no-photo and sample-photo behavior.
- Deterministic normalized transform stored in project data.
- Thumbnail/preview derivatives and error recovery.

### Excluded

- Arbitrary image layers.
- Photo filters beyond template-owned treatments.
- Background removal, face retouching, or generative fill.
- User video upload.

## Technical specification

### Media-slot contract

Each slot declares:

- stable slot ID and scene;
- required/optional;
- accepted media kind;
- target aspect/safe zone;
- minimum useful dimensions;
- allowed transform capabilities;
- fallback behavior: sample, monogram, illustration, or hidden.

Projects store an asset reference plus normalized transform:

```ts
type MediaPlacement = {
  assetId: string;
  slotId: string;
  positionX: number; // 0..1
  positionY: number; // 0..1
  zoom: number;      // bounded by slot
  rotation: number;  // normally 0, tightly bounded if enabled
};
```

The same pure transform resolver drives the browser preview and Remotion style.

### Editing

- Crop viewport displays the actual slot mask/aspect.
- Drag/pinch/slider controls update local preview without network writes on
  every pointer move.
- Commit one command when the gesture finishes; undo restores prior placement.
- Clamp transforms so required slot coverage never exposes empty canvas.
- Reset returns to deterministic center/focal default.
- Orientation is already normalized by P1-04.

### Upload states

Represent intent-created, uploading, verifying, processing, ready, rejected,
failed, cancelled, and expired. A project may reference only ready assets.
Closing/reloading can resume or safely abandon supported uploads.

### Performance and privacy

- Use small derivatives for gallery/editor thumbnails.
- Do not load original full-resolution files into catalogue views.
- Revoke blob URLs after use.
- Avoid canvas export of cross-origin assets unless configured and required.
- Communicate retention and removal behavior.

## Expected code and artifacts

- Media-slot and placement schema.
- Upload state machine integrated with object storage.
- Crop/zoom editor and gesture command.
- Shared placement resolver for Player/renderer.
- Derivative selection and fallback UI.
- Representative media fixtures and parity tests.

## Delivery slices

1. Define slots/placements and migrate current focal point.
2. Build upload state UI and ready-asset selection.
3. Add crop/pan/zoom gestures and undo.
4. Apply across templates and verify final renders.

## Acceptance criteria

- [ ] Upload state is truthful and recoverable.
- [ ] Only verified assets can enter a render snapshot.
- [ ] Crop/zoom behaves on touch, mouse, and keyboard-accessible controls.
- [ ] A committed gesture creates one undo entry.
- [ ] Player and MP4 show equivalent placement within visual tolerance.
- [ ] Replacing/removing media releases unneeded references per retention.
- [ ] No-photo fallback respects each template's declaration.
- [ ] Large originals do not block the editor unnecessarily.

## Test plan

### Automated

- Placement clamp/transform property tests.
- Upload state and interruption tests.
- Command/undo tests for gesture commits.
- Slot capability and minimum-dimension validation.
- Player/still crop comparison fixtures at transform extremes.

### Manual

- Touch pinch/pan on iPhone/Android-sized viewports.
- Upload rotated portrait, landscape, WebP, and near-limit files.
- Interrupt upload/processing and resume or retry.
- Render each slot's center and extreme allowed crops.

## Operational expectations

- Measure upload/processing duration, rejection reason, ready-to-use time, and
  crop completion.
- Derivative generation has queue/backlog visibility.
- Media errors show stable user actions.
- Original/derivative retention is documented.

## Rollout and rollback

Read legacy `photoSrc` and `photoFocalPoint` through a migration adapter while
new edits write placements. Enable per template slot. Rollback retains asset
records and can derive the old focal point where representable.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| CSS and Remotion transforms differ | One normalized resolver and visual fixtures |
| Gesture floods autosave | Update local state during gesture; commit on end |
| Cross-origin template/user images taint canvas | Avoid unnecessary canvas export and configure CORS deliberately |
| Asset removed while revision uses it | Reference protection and explicit lifecycle |

## Completion evidence

Attach transform tests, touch recordings, upload interruption cases, parity
stills, performance measurements, and legacy migration results.
