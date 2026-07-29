# AI-01 — AI value, evaluation, and governance baseline

**Status:** Parked  
**Track:** AI-assisted creation exploration  
**Size:** L  
**Depends on:** Phase 0 gate and a named user problem from P0-02

## Objective

Establish the product, evaluation, privacy, safety, cost, and architecture
contract for optional AI assistance before any generated output becomes part
of the creator workflow.

## Why this packet exists

“Add AI” is not a user outcome. Copy suggestions, template recommendations,
photo assistance, generated artwork, and concept storyboards have different
failure costs and data requirements. Implementing a provider call before
defining a task and evaluation set would make demos easy but quality,
regression, privacy, and cost impossible to manage.

## Scope

### Included

- Ranked AI use cases tied to observed creator friction.
- Risk tier and human-review requirement per use case.
- Offline evaluation fixtures, rubric, and baseline.
- Provider-neutral AI gateway and structured task contract.
- Prompt/model/configuration versioning and traceability.
- User-content handling, consent, retention, and opt-out rules.
- Latency, availability, quota, and unit-cost budgets.
- Experiment and graduation rules.

### Excluded

- Training on private user invitation content.
- Publishing generated output without creator review.
- Arbitrary prompt-to-code or prompt-to-template execution.
- Committing to one provider before capability evaluation.
- Treating subjective “looks good” review as the only metric.

## Technical specification

### Task inventory and risk tier

For every proposed task record:

- user problem and current non-AI fallback;
- exact allowed inputs and structured output;
- whether it can change factual event details;
- harm from an incorrect, biased, culturally inappropriate, or unavailable
  answer;
- required creator review;
- expected frequency, latency, and maximum unit cost;
- measurable quality rubric and owner.

Suggested progression:

1. template/palette recommendations;
2. invitation wording alternatives;
3. focal-point/crop suggestions;
4. generated decorative artwork;
5. structured concept/storyboard proposal.

The order can change from evidence, but higher-risk capability must not inherit
a lower-risk approval automatically.

### Evaluation corpus

Build versioned, rights-cleared fixtures representing:

- every supported occasion category;
- minimal, typical, and maximum-length structured input;
- missing optional fields and conflicting instructions;
- varied tone without demographic stereotypes;
- relevant languages/scripts only where support is claimed;
- attempts to insert secrets, unsafe requests, or instructions into
  user-controlled fields;
- expected refusal/fallback cases.

Do not use real private invitations, guest lists, or uploaded family photos
without separate explicit research consent and controlled storage.

### Evaluation dimensions

Measure per task:

- schema validity;
- factual preservation;
- instruction adherence;
- usefulness and edit distance to creator-approved result;
- tone/cultural review;
- unsafe or disallowed output;
- latency and timeout rate;
- cost per accepted suggestion;
- fallback success.

Set minimums before a user experiment. Record human-review rubric,
inter-reviewer disagreement, and examples of unacceptable output.

### AI gateway

Application code calls named tasks such as `suggestCopy` or
`recommendTemplates`, not provider chat APIs. The gateway owns:

- provider/model routing;
- task-specific system instructions and JSON schema;
- timeouts, bounded retry, circuit breaker, and quota;
- prompt/model/task version;
- approved logging/redaction;
- cost and latency measurement;
- deterministic or non-AI fallback.

Never execute returned code, URLs, HTML, or asset paths. Validate output through
the same domain/template schemas used by normal editing.

### User control and transparency

- AI assistance is optional and labeled.
- Show suggestions before applying them.
- Preserve and restore prior creator content through the command/undo model.
- Distinguish generated/suggested output from confirmed event facts.
- Explain when an upload will be sent to an external processor and apply
  P0-04/P1-08 retention rules.
- Allow the feature to be disabled without blocking the core journey.

## Expected code and artifacts

- AI use-case scorecard and risk tiers.
- Task/evaluation specification and rights-cleared fixture set.
- Baseline non-AI performance and initial model/provider comparison.
- Provider-neutral gateway interface and fake implementation.
- Data-handling/consent decision and threat review.
- Cost, latency, quota, fallback, and experiment plan.
- Graduation checklist reused by AI-02 through AI-04.

## Delivery slices

1. Rank tasks from P0-02 friction and define risk/data contracts.
2. Build evaluation corpus, rubric, and deterministic baselines.
3. Compare candidate implementations offline and record failure examples.
4. Implement gateway/fake adapter only when one task meets experiment entry.

## Acceptance criteria

- [ ] Every AI task maps to an observed user problem and non-AI fallback.
- [ ] Inputs, structured outputs, prohibited behavior, and human review are
      explicit.
- [ ] Evaluation corpus is versioned, representative, rights-cleared, and free
      from unapproved private content.
- [ ] Quality, safety, latency, and cost thresholds predate experiments.
- [ ] Application code is isolated from provider-specific response formats.
- [ ] Prompts/models/configurations are traceable to each suggestion.
- [ ] AI can be disabled without preventing creation, preview, or export.
- [ ] Data handling and user notice satisfy P0-04 constraints.

## Test plan

### Automated

- Task schema, prompt-injection fixture, timeout, retry, and fallback tests.
- Output parser rejects extra fields, executable content, invalid facts, and
  unsupported template IDs.
- Evaluation runner produces repeatable versioned reports.
- Logging/redaction and quota/concurrency tests.
- Fake gateway supports deterministic product integration tests.

### Manual

- Cross-functional review of failure examples and risk tiers.
- Inspect provider data-retention/configuration settings before any user data.
- Compare suggestions against deterministic baseline blind where practical.
- Disable provider access and complete the full core journey.

## Operational expectations

- Monitor task/version/provider success, latency, cost, fallback, apply,
  undo/reject, and safety outcome without invitation content.
- Kill switch operates per task and globally.
- Provider/model changes require evaluation before rollout.
- Evaluation fixtures and production incident examples become regression cases
  after privacy review.

## Rollout and rollback

No user-facing rollout occurs in AI-01. Later tasks begin internal-only, then
opt-in allow-listed cohorts. Rollback disables the named task and uses the
documented fallback; previously applied creator-confirmed content remains
ordinary project content with traceability metadata where required.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Demo quality hides inconsistent behavior | Versioned representative evaluation |
| Provider API leaks into editor | Named task gateway and fake adapter |
| Private content is retained externally | Approved settings, notice, minimization, and opt-out |
| AI becomes required for completion | Test and maintain deterministic fallback |
| Cheap model raises edit/support cost | Measure accepted result and correction, not inference alone |

## Completion evidence

Attach the use-case/risk scorecard, corpus rights record, evaluation report,
failure catalogue, data/threat decision, gateway contract tests, budgets, kill
switch demonstration, and approved first experiment.
