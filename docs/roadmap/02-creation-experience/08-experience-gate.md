# P2-08 — Accessibility, mobile, performance, and phase gate

**Status:** Not started  
**Phase:** 2 — Better creation experience  
**Size:** XL  
**Depends on:** P2-01 through P2-07

## Objective

Validate and harden the complete creation journey so first-time external users
can finish it on common mobile and desktop devices without data loss,
accessibility blockers, or unacceptable interaction latency.

## Why this packet exists

Feature completion does not prove usability. Player rendering, large artwork,
complex forms, crop gestures, autosave, and nested controls must be tested as
one journey under realistic devices, networks, and assistive technology.

## Scope

### Included

- Accessibility audit and remediation targeting WCAG 2.2 AA where applicable.
- Mobile/responsive browser matrix.
- Editor performance budgets and profiling.
- Slow/offline/error recovery.
- Cross-browser Player/export parity.
- First-time usability study and Phase 2 gate.

### Excluded

- Native mobile applications.
- Formal accessibility certification.
- Support for obsolete browsers outside the documented matrix.

## Technical specification

### Accessibility

- Complete keyboard operation with logical focus order and visible focus.
- Correct landmarks, labels, headings, descriptions, and live status.
- Errors associate with fields and provide summary/focus recovery.
- Selection overlays, crop controls, timeline, audio, history, and dialogs have
  non-pointer alternatives.
- Colour contrast and non-colour state cues meet target.
- Reduced-motion preference affects editor transitions and offers reduced
  template preview where supported.
- Player controls have accessible naming and do not trap focus.

### Responsive matrix

At minimum:

- 360×800 and 390×844 phone viewports;
- small and large tablet portrait/landscape;
- 1280×720 and 1440×900 desktop;
- current supported Safari/iOS, Chrome/Android, Chrome desktop, Firefox, and
  Edge policies documented at test time.

No horizontal page overflow is permitted at supported widths. Safe areas,
virtual keyboards, file pickers, sticky controls, and orientation changes are
included.

### Performance budgets

Initial budgets measured on a representative mid-range mobile profile:

- text/control response appears locally within 100 ms;
- normal edit reaches Player visual within 300 ms;
- route/flow transitions show feedback within 100 ms;
- gallery loads artwork lazily and avoids loading full originals;
- autosave does not block input;
- Player recreation is avoided for ordinary text/style edits;
- long tasks over 50 ms are identified and reduced on core journeys.

Define page-load budgets after baseline measurement rather than inventing
unsupported numbers.

### Resilience

- Simulate offline during guided flow, autosave, upload, and render request.
- Refresh/close/reopen with pending edits.
- Expire session and signed upload/download while active.
- Reject media, conflict revisions, fail preview audio, and fail render.
- Every failure preserves safe work or clearly states what must be repeated.

### Usability gate

At least ten representative first-time users attempt:

1. start from occasion;
2. create and personalize;
3. upload/crop or choose no photo;
4. preview and correct a detail;
5. recover one induced error;
6. share preview or request output.

No developer may manipulate the database or shell to complete a normal case.

## Expected code and artifacts

- Browser/device support matrix.
- Automated accessibility checks plus manual audit.
- Performance instrumentation/profile report.
- Responsive and error-recovery test suite.
- Content/error-message review.
- Moderated usability script, findings, prioritized fixes, and gate decision.

## Delivery slices

1. Establish accessibility/responsive/performance baselines.
2. Fix systemic issues and add automated protection.
3. Run network/error/device matrix and parity checks.
4. Conduct usability sessions, remediate blockers, and review gate.

## Acceptance criteria

- [ ] No critical accessibility issue remains in the core journey.
- [ ] Core journey is keyboard operable and screen-reader understandable.
- [ ] No supported viewport has horizontal page overflow.
- [ ] Performance budgets are met or exceptions have measured, approved plans.
- [ ] Offline/conflict/session/upload/render failures have verified recovery.
- [ ] Player and representative final outputs contain identical content/layout.
- [ ] At least 8 of 10 first-time testers complete without developer help.
- [ ] No repeated severity-one usability blocker remains.
- [ ] Gate owner records decision, evidence, and follow-ups.

## Test plan

### Automated

- Accessibility scans on library, flow, each editor tab, history, and sharing.
- Keyboard interaction component/e2e tests.
- Responsive screenshot/layout assertions.
- Performance regression measurements for core interactions.
- Offline/conflict/session-expiry recovery tests.
- Representative Player/still comparison.

### Manual

- Screen-reader passes on macOS/iOS and one additional supported platform.
- Real-device touch/crop/timeline tests.
- Browser matrix and virtual-keyboard behavior.
- Ten moderated first-time sessions.

## Operational expectations

- Track performance/error outcomes by release and device class without invasive
  fingerprinting.
- Accessibility regressions block release when they break the core journey.
- Browser support and known limitations are visible to support.
- Usability findings receive owner, severity, and target milestone.

## Rollout and rollback

Run the new flow/editor behind a cohort flag, compare completion and errors with
the prior experience, then expand. Rollback returns users to the stable editor
while retaining projects/revisions; document any new fields the old UI cannot
edit but must preserve.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Automated accessibility gives false confidence | Mandatory manual keyboard/screen-reader audit |
| Player dominates mobile CPU | Profile, pause offscreen, reduce preview quality without changing render |
| Old UI drops new fields on rollback | Forward-compatible serialization and preservation tests |
| Usability sample is unrepresentative | Recruit across occasions, ages, and device familiarity |

## Completion evidence

Attach audit and matrix results, profiles, recovery recordings, parity outputs,
tester completion data, fixed-issue list, and signed Phase 2 gate.
