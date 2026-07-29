# P2-04 — Inline preview editing and style controls

**Status:** Not started  
**Phase:** 2 — Better creation experience  
**Size:** XL  
**Depends on:** P2-02

## Objective

Let users select supported content directly from the invitation preview and
adjust curated visual tokens without introducing arbitrary layers or breaking
template quality.

## Why this packet exists

The inspector is predictable but forces users to map form labels to scenes.
Direct selection makes the product feel more like a design tool, while
template-defined edit regions preserve safe layouts.

## Scope

### Included

- Template-declared editable regions linked to schema fields.
- Selection/focus synchronization between Player and inspector.
- Inline text editing where technically safe.
- Curated palette, typography, alignment, and motion-intensity tokens.
- Keyboard navigation and visible selection state.
- Render-parity and safe-area enforcement.

### Excluded

- Arbitrary text boxes, layer tree, drag positioning, rotation, or free resize.
- Editing decorative artwork pixels.
- Custom font upload.
- Per-keyframe animation editing.

## Technical specification

### Editable-region contract

Templates declare stable regions:

- region ID and scene ID;
- linked field/command target;
- role and accessible label;
- whether selection, inline text, or token controls are allowed;
- safe character/layout constraints;
- optional focus frame/time for Player navigation.

The editor must not infer regions from rendered DOM text. Region metadata is
part of the template capability contract and covered by tests.

### Selection

- Clicking/tapping an enabled region selects it without altering playback.
- Selection opens/focuses the relevant inspector control.
- Selecting a form control highlights the corresponding preview region.
- Selection overlays are editor-only and never enter render output.
- Regions remain operable when the Player is paused or at a different scene;
  the editor may seek to a declared focus frame with user-visible behavior.

### Inline text

- Use an editor overlay/control, not `contentEditable` inside render
  compositions.
- Dispatch the same typed text command as the inspector.
- Preserve validation, max length, undo grouping, and IME input.
- Enter confirms where appropriate; Escape cancels the current uncommitted
  overlay.
- Long content displays safe feedback rather than shrinking beyond template
  minimums.

### Style tokens

Initial curated controls:

- palette variant from a template-owned list;
- type pairing from licensed/preloaded choices;
- text alignment only for regions declaring alternatives;
- motion intensity: reduced, standard, expressive;
- decorative density if supported.

Values are stable IDs stored in the project document. Templates resolve IDs to
actual styles. The server rejects unsupported tokens.

## Expected code and artifacts

- Editable-region and style-token schema.
- Editor selection overlay and focus synchronization.
- Inline text overlay with command integration.
- Token-control components generated from template capabilities.
- Safe-area/fit feedback.
- Player/render parity fixtures and accessibility documentation.

## Delivery slices

1. Add region metadata to one V2 template and build selection synchronization.
2. Add inline text overlay and keyboard/IME behavior.
3. Add palette/type/motion token controls.
4. Roll contract across templates and remove template-specific editor branches.

## Acceptance criteria

- [ ] Every interactive overlay maps to a declared stable region.
- [ ] Preview and inspector selection remain synchronized.
- [ ] Inline edits use existing commands, validation, autosave, and undo.
- [ ] Editor overlays never appear in still or video renders.
- [ ] Unsupported token values are rejected by client and server.
- [ ] Token changes render identically in Player and exported output.
- [ ] All selection/editing is keyboard accessible.
- [ ] No supported control can move text outside declared safe areas.

## Test plan

### Automated

- Region-schema and template-capability tests.
- Selection/inspector synchronization component tests.
- Inline editing, IME, undo, validation, and cancel/confirm tests.
- Token allow-list API tests.
- Representative Player/still visual parity snapshots.

### Manual

- Touch selection on 360 px viewport.
- Keyboard-only navigation through regions and controls.
- Edit long names, date, and venue in every template family.
- Verify reduced-motion behavior and focus announcements.

## Operational expectations

- Selection/edit interaction remains responsive without restarting Player.
- Track region selection and token category, never entered text.
- Fonts and token assets are preloaded or show deterministic loading state.
- Invalid/stale template capability data fails safely to inspector-only editing.

## Rollout and rollback

Enable per template/version capability. Templates without regions continue
using the inspector. Rollback disables overlay rendering; stored token IDs
remain supported or migrate through P3-04.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Player DOM changes break overlays | Use explicit region API/geometry, not text scraping |
| Inline editor differs from render typography | Overlay edits value only; Player remains visual source |
| Too many tokens reduce quality | Template authors provide reviewed allow-lists |
| Seeking disrupts user playback | Clear seek behavior and return-to-play choice |

## Completion evidence

Provide region contract, keyboard/touch recordings, parity snapshots, long-copy
fixtures, token validation tests, and rollout coverage matrix.
