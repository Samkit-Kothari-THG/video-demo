# P1-01 — Architecture baseline and configuration

**Status:** Not started  
**Phase:** 1 — Production foundation  
**Size:** M  
**Depends on:** Current local MVP

## Objective

Establish the production service boundaries and configuration contract before
introducing hosted dependencies. After this packet, the web application can be
configured for local, test, staging, and production environments without
provider-specific logic leaking into editor or template code.

## Why this packet exists

The current application correctly demonstrates the complete workflow, but
server modules directly assume local JSON files, public-disk assets, and an
in-process renderer. Replacing those pieces independently without explicit
interfaces would create mixed storage modes and difficult rollbacks.

## Scope

### Included

- Document the web, database, object-storage, queue, and render-worker
  boundaries.
- Define provider-neutral interfaces for project persistence, assets, render
  dispatch, and job status.
- Add validated server configuration and a deliberately small public client
  configuration.
- Define local, test, staging, and production environment expectations.
- Add liveness and dependency-aware readiness checks.
- Establish request/correlation identifiers and UTC timestamp conventions.
- Record architecture decisions for database access, authentication category,
  storage protocol, queue category, and deployment topology.

### Excluded

- Provisioning a database, identity provider, bucket, or queue.
- Migrating local projects.
- Implementing the production worker.
- Selecting payment or email vendors.

## Technical specification

### Runtime boundaries

The target topology is:

```text
Browser
  -> Next.js web/API (stateless)
       -> PostgreSQL
       -> private object storage
       -> render queue/outbox
  -> render worker
       -> PostgreSQL
       -> private object storage
       -> Remotion renderer
```

The editor and catalogue must not import provider SDKs. Provider adapters live
behind server-only interfaces. Renderer-specific code remains limited to the
composition root and render adapter described in `docs/RENDERER_DECISION.md`.

### Required server interfaces

- `ProjectRepository`: list, get, create, update with revision precondition,
  soft delete.
- `RenderJobRepository`: create from snapshot, transition state, read status,
  record attempt.
- `AssetStore`: create upload authorization, verify object, open worker input,
  create output authorization, delete object.
- `RenderDispatcher`: publish or persist a render request.
- `Clock` and `IdGenerator`: injectable in tests.

The interfaces should describe domain values, not database rows or provider
responses.

### Configuration

- Parse environment variables once in a server-only module.
- Fail startup in staging/production when required values are missing or
  malformed.
- Expose only explicitly prefixed, non-secret values to client code.
- Never read environment variables throughout component or domain modules.
- Redact secrets and signed URLs from configuration diagnostics.
- Support a local adapter set for development and production adapters selected
  explicitly by environment.

Expected configuration groups:

- application URL and environment;
- database connection;
- session/authentication secrets;
- object-storage endpoint, bucket, region, and credentials;
- queue/worker connection and concurrency;
- render limits and asset retention;
- observability endpoints and release identifier.

### Health behavior

- Liveness confirms the process event loop can answer.
- Readiness verifies required dependencies with bounded timeouts.
- Readiness failure returns a non-success status without exposing credentials,
  topology, or raw provider errors.
- The render worker has separate liveness and readiness signals.

## Expected code and artifacts

- Server-only typed configuration module.
- Domain interfaces and local adapters wrapping the current store/renderer.
- Health route handlers for web and worker deployment.
- Architecture diagram and initial ADRs under `docs/decisions/`.
- Environment-variable reference with required/optional/default semantics.
- Updated `.env.example` without real credentials.

## Delivery slices

1. Add ADRs, topology, environment matrix, and typed configuration.
2. Extract persistence, asset, and render dispatch interfaces around existing
   local implementations without changing user behavior.
3. Add health checks and verify local/test startup failure behavior.

## Acceptance criteria

- [ ] The current local product still creates, saves, previews, and renders.
- [ ] Editor and template modules import no database, storage, queue, or auth
      SDK.
- [ ] Staging/production startup fails clearly when mandatory configuration is
      absent.
- [ ] Client bundles contain no server secret or unapproved environment value.
- [ ] Liveness works when dependencies are unavailable; readiness does not.
- [ ] Every API request and render dispatch receives a correlation identifier.
- [ ] ADRs record decisions and rejected alternatives.

## Test plan

### Automated

- Configuration parser tests for valid, missing, malformed, and redacted data.
- Contract tests executed against local adapters.
- Health-route tests for healthy, timeout, and dependency-failure cases.
- Bundle or static check preventing server-only imports in client modules.

### Manual

- Start each environment profile with representative configuration.
- Confirm readiness changes when the database/queue/storage adapter is stopped.
- Inspect browser-delivered configuration for secrets.

## Operational expectations

- Health checks complete within one second under normal conditions.
- Dependency probes use short timeouts and do not create data.
- Configuration errors identify the setting name but never its secret value.
- Release identifier and environment appear on server logs and metrics.

## Rollout and rollback

This is an additive refactor. Keep the local adapters as the default until
their production replacements pass the same contract tests. Rollback is
switching the adapter selection back to local in non-production environments;
production must never silently fall back to local disk.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Provider SDKs leak into domain code | Enforce server adapter import boundaries |
| Health endpoints expose topology | Return stable status codes and sanitized dependency names |
| Local and production behavior diverge | Shared adapter contract suite |
| A provider is selected prematurely | ADR chooses a category and required capability before a vendor |

## Completion evidence

Attach ADR links, configuration tests, health-check output, adapter contract
results, and proof that the current local workflow remains functional.
