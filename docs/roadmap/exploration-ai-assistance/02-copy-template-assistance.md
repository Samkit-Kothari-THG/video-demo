# AI-02 — Copy and template recommendation assistance

**Status:** Parked  
**Track:** AI-assisted creation exploration  
**Size:** L  
**Depends on:** AI-01, P2-01, P3-01

## Objective

Help creators choose a suitable design direction and refine invitation wording
from structured event inputs while preserving factual details, creator control,
and a complete deterministic path.

## Why this packet exists

Template choice and wording can delay a first draft, particularly when users
are unsure about tone. This is a relatively low-risk place to test AI value,
but suggestions can still invent dates, venues, cultural details, or
relationships. A generic chat box would also bypass template capabilities and
the guided brief.

## Scope

### Included

- Bounded template/style recommendation from catalogue capabilities.
- Tone-aware invitation wording alternatives for declared editable fields.
- Structured diff, preview, apply, undo, reject, and regenerate behavior.
- Factual-preservation and cultural/tone evaluations.
- Deterministic rules-based recommendation/copy fallback.
- Opt-in experiment and outcome measurement.

### Excluded

- Changing event facts without explicit field editing.
- Open-ended chatbot or advice unrelated to invitation creation.
- Claiming translation for unsupported languages.
- Generating new templates, code, or arbitrary scene structures.
- Automatically applying or publishing a suggestion.

## Technical specification

### Inputs

Pass the minimum normalized structure:

- category and occasion subtype where known;
- creator-selected tone/style goals;
- template capability summaries or eligible IDs;
- event facts separated from editable display-copy fields;
- locale/script claim and optional length limits;
- task-specific safety/context flags.

Avoid asset URLs, guest contacts, account data, and unrelated project history.
Free-form user text remains untrusted and cannot override task rules.

### Template recommendation output

Return a bounded ranked list of existing eligible
`templateId + templateVersion` values with:

- matched declared capabilities;
- one short user-facing reason;
- confidence/insufficient-information state;
- optional follow-up choice from an approved set.

Server code verifies IDs and capabilities against the catalogue. The system
does not recommend hidden, deprecated, incompatible, or unlicensed editions.
Ranking evaluation compares against rules-based recommendations and human
review rather than assuming one correct template.

### Copy suggestion output

Return typed field proposals only for fields marked AI-editable by the schema:

- original field/value hash;
- proposed value;
- tone label from an approved vocabulary;
- preserved fact references;
- task/prompt/model version.

Reject the whole suggestion when a required fact changes, a field is unknown,
length/locale constraints fail, or output contains markup/URLs where forbidden.
Never infer a venue, host, date, ritual, dress code, relationship, or honorific.

### Product interaction

- Present two or three clearly labeled alternatives, not a streaming essay.
- Preview the selected alternative in the normal template before apply.
- Apply through P2-02 editor commands so undo/redo works.
- A later regeneration never overwrites an accepted edit.
- Explain when input is insufficient and fall back to guided choices.
- Measure acceptance, meaningful edits, undo, regeneration, completion, time,
  and support outcome.

### Cultural and language behavior

Only offer locale/script/tone combinations covered by AI-01 evaluation and the
template's P3-05 claims. Preserve names and user-provided phrases exactly
unless that field is explicitly selected for rewriting. Culturally specific
copy requires representative review and must not invent ceremonies.

## Expected code and artifacts

- `recommendTemplates` and `suggestCopy` task contracts.
- Deterministic baselines and AI-gateway adapters.
- Fact-preservation validator and structured diff/apply UI.
- Evaluation fixtures/reports by category, tone, length, and claimed locale.
- Analytics and experiment configuration.
- Creator notice, feedback path, kill switch, and support guidance.

## Delivery slices

1. Ship rules-based recommendation and copy presets as the baseline.
2. Evaluate AI tasks offline against that baseline and fact constraints.
3. Add internal structured suggestion/preview/apply flow.
4. Run opt-in experiment and decide graduate, revise, or remove per task.

## Acceptance criteria

- [ ] Every recommended ID is eligible in the current catalogue.
- [ ] Suggestions cannot alter protected event facts or unknown fields.
- [ ] Creator sees and selects output before it changes the project.
- [ ] Apply and undo use the standard editor command model.
- [ ] Deterministic recommendation/copy options work when AI is unavailable.
- [ ] Unsupported locale/script requests receive a truthful fallback.
- [ ] Offline factual/safety/quality thresholds pass before user exposure.
- [ ] Experiment measures completion and correction, not only button clicks.
- [ ] The feature can be disabled without changing saved project validity.

## Test plan

### Automated

- Catalogue eligibility/deprecation/capability tests.
- Fact mutation, schema, length, markup, URL, and prompt-injection tests.
- Names, dates, venues, mixed scripts, honorifics, and missing-field fixtures.
- Command apply/undo/concurrent-project-change tests.
- Timeout, quota, fallback, version, and analytics-payload tests.

### Manual

- Blind review suggestions versus presets across occasion/tone fixtures.
- Attempt to induce fabricated facts and stereotyped cultural details.
- Test interruption, regeneration, undo, and template switching.
- Observe representative creators deciding whether and how to apply output.
- Complete creation with AI disabled.

## Operational expectations

- Track eligible task version, latency, cost, fallback, view, apply, edit,
  undo, reject, and completion using content-free identifiers.
- Alert on schema/fact validator failures and unusual regeneration.
- Sample outputs only through an approved privacy-reviewed process.
- Model/prompt changes rerun the full evaluation matrix.

## Rollout and rollback

Roll out recommendation and copy tasks independently. Begin internal, then
opt-in allow-list, with a holdout using deterministic behavior. Rollback hides
the AI action and preserves accepted text as creator content; no project should
depend on regenerating an old suggestion.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Polished copy fabricates an event fact | Protected fact model and hard validator |
| Recommendations narrow catalogue unfairly | Eligibility audit, diverse fixtures, and rules baseline |
| User cannot tell what changed | Field-level diff and explicit apply |
| AI improves click rate but slows completion | Measure correction and time-to-share-ready |
| Locale label overstates quality | Only expose evaluated locale/script claims |

## Completion evidence

Attach task schemas, baseline comparison, fact-validator tests, evaluation
report, structured-diff screenshots, opt-in experiment results, cost metrics,
creator findings, and graduate/revise/remove decision.
