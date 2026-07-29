# P3-07 — Collection expansion and phase gate

**Status:** Not started  
**Phase:** 3 — Template platform  
**Size:** XL  
**Depends on:** P3-01 through P3-06

## Objective

Expand the current ten editions to a curated collection of 25–30 maintainable,
rights-cleared editions across existing and new invitation categories, using
the platform workflow rather than one-off code.

## Why this packet exists

Catalogue depth improves the product only when users perceive meaningful
choice and every design remains editable, renderable, and supportable. Rapidly
adding decorative backgrounds without capability and regression coverage would
create false variety and maintenance debt.

## Scope

### Included

- Portfolio plan and visual-gap analysis.
- Three controlled production waves.
- New categories and schema/content labels.
- Art direction, assets, runtime implementation, fixtures, and rights records.
- Merchandising metadata and quality/performance review.
- Template-platform Phase 3 gate.

### Excluded

- Public creator marketplace.
- User-generated templates.
- AI-generated templates published without human design/rights review.
- Unlimited category expansion.

## Target portfolio

Start: ten editions across engagement, wedding, birthday, baby shower, and
housewarming.

### Wave A — deepen current categories (+5)

Add one clearly differentiated edition per current category:

- editorial/minimal engagement;
- vibrant daytime wedding;
- playful children's birthday;
- contemporary gender-neutral baby shower;
- urban/minimal housewarming.

Target after Wave A: 15.

### Wave B — add cultural/style breadth (+5)

Add another reviewed edition per current category, selected from measured
catalogue gaps rather than cosmetic recolours.

Target after Wave B: 20.

### Wave C — new occasion collections (+8)

- Mehendi/Sangeet: two editions.
- Reception: two editions.
- Anniversary: two editions.
- Naming ceremony: two editions.

Target after Wave C: 28.

Graduation, festive greetings, dinner parties, and corporate events remain the
next evidence-driven backlog.

## Technical specification

### Definition of meaningful edition

An edition needs a distinct combination of:

- visual concept and artwork;
- typography/layout system;
- scene treatment and transition rhythm;
- palette/token variants;
- photo/fallback behavior;
- category copy/defaults.

A recolour alone is a style variant, not a new edition.

### Minimum capability

Every newly published edition:

- supports 9:16 video and a reviewed portrait static output;
- declares 30-second preset and no-audio behavior;
- has photo and/or intentional no-photo fallback;
- supports required fixtures and maximum content lengths;
- has provenance/rights evidence;
- passes publication-tier visual CI.

At least two editions per category should support 4:5 and 1:1 by the phase gate.
The gallery shows format/duration capabilities truthfully.

### Category introduction

New categories require:

- field labels, optional/required rules, defaults, and copy guidance;
- guided-brief mapping/recommendation rules;
- filters/merchandising metadata;
- analytics category;
- representative user/content review;
- translation/non-Latin claim only when tested.

### Production workflow

Each edition follows P3-05:

1. approved brief and portfolio role;
2. assets/provenance;
3. manifest and capability plan;
4. implementation with primitives/bespoke rationale;
5. fixture, accessibility, performance, and rights review;
6. internal publication and feedback;
7. explicit registry/publication review.

## Expected code and artifacts

- Portfolio gap analysis and art-direction briefs.
- 18 new manifest/runtime packages with fixtures.
- Optimized assets and provenance/rights records.
- New category schemas, recommendation rules, and gallery metadata.
- Publication CI evidence and collection review.
- Phase 3 gate report.

## Delivery slices

1. Establish portfolio rubric, score current ten, and approve Wave A briefs.
2. Deliver/review/publish Wave A; use findings to adjust authoring primitives.
3. Deliver Wave B based on usage and visual gaps.
4. Introduce/test new category schemas, then deliver Wave C.
5. Run complete gate, performance, rights, and catalogue usability review.

## Acceptance criteria

- [ ] Catalogue contains 25–30 published editions; target is 28.
- [ ] Every edition has unique purpose and is not merely a recolour.
- [ ] All new editions use valid manifests, fixtures, provenance, and rights
      records.
- [ ] Every new edition supports 9:16 video and portrait static.
- [ ] At least two editions per category support 4:5 and 1:1.
- [ ] Existing V1/V2 projects continue to preview/render.
- [ ] Gallery filters/recommendations include new categories accurately.
- [ ] Publication visual CI and performance budgets pass.
- [ ] User testing demonstrates understandable, non-overwhelming choice.
- [ ] Gate owner approves collection quality and accepted follow-ups.

## Test plan

### Automated

- Manifest/registry/category/recommendation exhaustiveness.
- Full fixture and publication visual matrix.
- Historical V1/V2 compatibility renders.
- Asset/provenance/rights completeness.
- Gallery capability/filter tests.
- Render performance thresholds.

### Manual

- Design critique for each wave.
- Category-content review with representative users.
- Mobile/desktop gallery usability and recommendation testing.
- Final output review across formats, light/dark, photo/no-photo.
- Rights/license sign-off.

## Operational expectations

- Measure selection, preview, edit completion, render success, and conversion by
  edition/category/version.
- Review low-use or high-failure editions without rewriting pinned versions.
- Template asset size and render time are visible before publication.
- Named design/content/engineering owners maintain the collection.

## Rollout and rollback

Publish waves gradually using internal then allow-listed visibility. A faulty
edition can be hidden/deprecated for new creation while pinned projects remain
supported. Do not delete runtime/assets as an emergency merchandising action.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| More cards reduce decision confidence | Guided recommendations, filters, and curated waves |
| AI artwork creates generic/repetitive output | Strong art briefs and human visual review |
| New cultural category is inaccurate | Representative content/design review before publication |
| Format matrix delays volume | Minimum capability plus two multi-format editions per category |

## Completion evidence

Attach portfolio scorecard, briefs, 28-edition inventory, rights matrix,
publication CI report, performance summary, user-testing findings, and signed
Phase 3 gate.
