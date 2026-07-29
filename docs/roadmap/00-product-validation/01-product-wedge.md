# P0-01 — Product wedge and target user

**Status:** Not started  
**Phase:** 0 — Product proof  
**Size:** M  
**Depends on:** Current local MVP

## Objective

Choose the first customer segment, core job, product promise, and explicit
non-goals that will guide Phases 1–3. The result must be specific enough to
decide which requests belong in the product and which should remain outside
the roadmap.

## Why this packet exists

“Canva for invitations” describes a large solution space, not a focused
customer problem. Production infrastructure, template breadth, editing depth,
and distribution features will be prioritized differently for a couple,
family organizer, event planner, or invitation business. Building for all of
them at once would recreate a general design tool before Vowframe proves its
advantage.

## Scope

### Included

- Inventory of the assumptions already embedded in the MVP.
- Research across plausible creator segments and real invitation occasions.
- Selection of one primary segment and a deliberately secondary segment.
- Jobs-to-be-done, current alternatives, constraints, and purchase trigger.
- A concise product promise and definition of a satisfactory first outcome.
- Core journey from event details to a share-ready invitation.
- Product principles, non-goals, and evidence-based revisit conditions.

### Excluded

- Final pricing or packaging.
- General market-size forecasting.
- A complete brand-positioning exercise.
- Building requested features during interviews.
- Choosing a segment solely because it is easiest to recruit.

## Technical specification

### Candidate segments

Research should distinguish at least:

- a host or couple making one important invitation;
- a family member coordinating on behalf of a host;
- an independent event planner managing several events;
- a designer or invitation business producing work for clients.

Record frequency, urgency, willingness to learn, approval needs, formats,
languages, channels, and current spend. Do not combine segments whose workflow
or ownership model differs materially.

### Research method

- Recruit participants who created or commissioned an invitation recently or
  expect to do so soon.
- Use the working MVP to test behavior after understanding the participant's
  existing process.
- Ask for concrete past behavior, artifacts, time spent, and paid alternatives
  before asking for opinions about proposed features.
- Include at least two different occasion categories and both mobile-first and
  desktop-capable creators.
- Store consent and research notes without copying private guest lists or
  personal photographs into the product repository.

### Product contract

The decision record must define:

- **Primary user:** the person whose success drives near-term choices.
- **Core job:** the situation, motivation, and desired outcome.
- **Trigger:** why the user starts now.
- **First value:** the earliest moment the product proves useful.
- **Share-ready:** the quality and output conditions that make the invitation
  usable outside the editor.
- **Product promise:** one sentence that can be tested with users.
- **Non-goals:** at minimum free-form design, public marketplace, native
  mobile, and real-time collaboration unless research overturns them.

A useful starting hypothesis is “turn structured event details into a polished,
personalized, share-ready invitation in minutes.” Research may refine or reject
it, but must not broaden it without evidence.

### Decision rubric

Score candidate segments on:

- pain and urgency;
- frequency or referral potential;
- fit with structured editing;
- value of video and multi-format output;
- ability to reach and support the user;
- willingness to pay;
- operational, privacy, and cultural complexity;
- differentiation from general design tools.

Document weights before scoring. Record contrary evidence and why the selected
segment wins despite it.

## Expected code and artifacts

- Product hypothesis and assumptions inventory.
- Research plan, screener, consent text, and discussion guide.
- Anonymized interview/observation summaries.
- Segment scorecard and decision record.
- Primary job statement, core journey, and share-ready definition.
- Product principles and explicit non-goals.
- Prioritized problem list for P0-02 validation.

No production code is required unless a small, disposable prototype is needed
to test a specific uncertainty.

## Delivery slices

1. Extract assumptions from the MVP and define candidate segments.
2. Run discovery interviews and observe current invitation workflows.
3. Test the MVP against the strongest segment/job hypotheses.
4. Select the wedge and publish the product contract with dissenting evidence.

## Acceptance criteria

- [ ] One primary segment is selected and described behaviorally.
- [ ] A secondary segment is named without making it an equal design target.
- [ ] Research includes recent real behavior, not only stated preference.
- [ ] Core job, trigger, first value, and share-ready outcome are unambiguous.
- [ ] The product promise can be tested in a timed usability session.
- [ ] Product principles and non-goals resolve common scope disputes.
- [ ] Segment choice includes evidence, rejected alternatives, and revisit
      conditions.
- [ ] No private participant assets or guest data are committed to the repo.

## Test plan

### Automated

- No product automation is required.
- If analytics or research prototypes are added, verify that payloads contain
  only approved event names and no free-form invitation content.

### Manual

- Review the product contract with design, engineering, and business owners.
- Ask a person outside the project to describe the primary user and outcome
  after reading the one-page contract.
- Apply the principles to at least five plausible feature requests and confirm
  that they produce a clear include/defer decision.

## Operational expectations

- Assign one decision owner and one research owner.
- Keep an anonymized evidence index that later roadmap decisions can cite.
- Date assumptions and schedule a revisit after the first external beta cohort.
- Treat disagreement as a recorded product risk, not an undocumented
  compromise.

## Rollout and rollback

This packet changes prioritization, not user data. Adopt the selected wedge for
P0-02 and roadmap reviews. If later behavioral evidence contradicts it, create
a new dated decision record; do not silently rewrite the original research.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Most available interviewees are friends/family | Recruit against behavioral criteria and label convenience samples |
| Planner requests dominate the scope | Keep planners secondary until frequency and willingness-to-pay evidence exists |
| “Share-ready” remains subjective | Define observable output and approval criteria |
| Product promise becomes a feature list | Express a user outcome with a time/value expectation |

## Completion evidence

Attach the anonymized research index, segment scorecard, product contract,
primary journey, feature-triage exercise, decision owner approval, and the date
of the next evidence review.
