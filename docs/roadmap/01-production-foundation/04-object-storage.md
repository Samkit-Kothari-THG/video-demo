# P1-04 — Object storage and asset lifecycle

**Status:** Not started  
**Phase:** 1 — Production foundation  
**Size:** L  
**Depends on:** P1-01, P1-03

## Objective

Move user uploads and rendered outputs from public application disk to private
object storage with validated, tenant-scoped access and an explicit retention
lifecycle.

## Why this packet exists

Files written under `public/` are visible by URL, tied to one application
instance, and lost or inconsistent across deployments. Render workers also need
stable access to immutable inputs without making user assets permanently
public.

## Scope

### Included

- Private source-upload and render-output storage.
- Asset metadata and ownership records.
- Direct signed browser upload flow.
- Post-upload verification and normalized image derivatives.
- Worker-safe asset resolution.
- Signed, expiring download URLs.
- Deletion, orphan cleanup, and retention policies.
- Compatibility path for existing string-based local asset props.

### Excluded

- Template artwork CDN migration, which can continue using the existing base
  URL contract.
- Arbitrary user video uploads.
- Advanced AI image processing.
- Guest-facing permanent share pages.

## Technical specification

### Asset record

Add an `assets` table with:

- opaque `id`, `owner_user_id`;
- `kind`: source-image, normalized-image, audio, render-output, or temporary;
- provider bucket/key stored server-side;
- detected MIME type, byte size, width, height, checksum;
- processing state and stable rejection code;
- parent/source asset ID for derivatives;
- creation, verification, expiry, and deletion timestamps.

Client and project APIs exchange asset IDs or typed asset references, not raw
bucket keys. Legacy props containing local paths remain readable through a
compatibility resolver until migrated.

### Upload protocol

1. Authenticated client requests an upload intent with filename, declared MIME,
   and size.
2. Server validates quota and returns a narrowly scoped, short-lived upload.
3. Browser uploads directly to private storage.
4. Client completes the intent.
5. Server verifies object existence, bytes, checksum, and detected media type.
6. An image-processing job decodes the image, normalizes orientation, strips
   unnecessary metadata, and creates a render-safe derivative.
7. Only a verified derivative becomes selectable in a project.

The server must inspect actual bytes; filename extensions and browser MIME
values are advisory.

### Image policy

- Support JPEG, PNG, and WebP initially.
- Enforce byte, pixel-count, and dimension limits before expensive processing.
- Reject malformed, polyglot, animated, or unsupported files with stable codes.
- Normalize orientation and color handling.
- Strip location and unnecessary EXIF metadata.
- Preserve the original privately only when the retention policy requires it.

### Worker and download access

- Workers resolve authorized asset IDs using server credentials or
  worker-scoped signed URLs.
- Signed URLs outlive the maximum render attempt but remain short-lived.
- Completed output downloads are signed per authorized request.
- API responses expose an application URL or signed URL, never the storage key.
- Output objects include content type and safe download filename metadata.

### Retention

- Abandoned upload intents expire quickly.
- Unattached verified uploads expire after a documented grace period.
- Failed/partial render objects are removed automatically.
- Completed outputs have a beta retention period communicated to users.
- Account/project deletion creates asynchronous deletion work with audit state.

## Expected code and artifacts

- Asset schema migration and repository.
- Object-storage adapter implementing P1-01 contracts.
- Upload-intent, completion, and authorized-download endpoints.
- Image verification/normalization worker or job.
- Asset resolver used by Player props and render snapshots.
- Retention cleanup task and operational dashboard.
- Migration/compatibility resolver for local asset paths.

## Delivery slices

1. Add asset metadata and private storage adapter.
2. Implement signed upload and verification without changing project props.
3. Introduce typed asset references and render-safe derivatives.
4. Move render outputs and downloads, then enable lifecycle cleanup.

## Acceptance criteria

- [ ] Production uploads and outputs survive application redeployment.
- [ ] Users cannot sign, read, or delete another user's assets.
- [ ] Invalid bytes are rejected even with an allowed extension.
- [ ] Uploaded images have orientation normalized and sensitive metadata
      removed.
- [ ] A render job can access its immutable inputs without public URLs.
- [ ] Output download access expires and requires ownership.
- [ ] Partial, expired, and deleted assets are reconciled automatically.
- [ ] Legacy local-path fixtures still render during migration.

## Test plan

### Automated

- Storage-adapter contract tests.
- Cross-tenant signing and access tests.
- Upload verification tests for wrong MIME, oversize dimensions, truncation,
  EXIF orientation, and unsupported animation.
- Retention and orphan reconciliation tests with a fake clock.
- Render integration using a private normalized asset.

### Manual

- Upload from current mobile browsers on slow and interrupted connections.
- Verify normalized crops in Player and final MP4.
- Attempt expired and foreign signed URLs.
- Delete a test account and verify object/metadata cleanup.

## Operational expectations

- Track upload intent, success, rejection, normalization time, storage bytes,
  orphan count, and deletion backlog.
- Alert on verification backlog and repeated storage authorization failures.
- Object keys are random and still treated as sensitive.
- Storage credentials are worker/server only and rotated through the platform.

## Rollout and rollback

Dual-read legacy local paths and asset references during migration. New
production uploads write only to object storage. Do not dual-write user bytes to
public disk. Rollback keeps object storage authoritative and reverts the
application adapter; it must not expose objects publicly.

## Risks and decisions

| Risk or decision | Expected resolution |
| --- | --- |
| Signed URL expires during long render | Duration exceeds maximum attempt plus queue margin |
| Malicious image exhausts decoder | Enforce bytes and pixels before/while decoding in isolated worker |
| Project props mix IDs and paths forever | Track migration metric and remove legacy writes by deadline |
| User deletes an asset used by a job | Snapshot retains a protected reference until all attempts terminate |

## Completion evidence

Include access-control tests, representative normalized files, metadata
inspection, private render output, retention-job results, and storage metrics.
