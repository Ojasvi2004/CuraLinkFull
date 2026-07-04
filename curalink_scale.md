# CuraLink Production-Grade Modernization and Deployment Guide

Author: Codex  
Generated from repo scan on: 2026-04-18  
Repository scanned: `d:\WEB_DEV\Projects\CuraLink`

---

## 1. Executive Summary

CuraLink already has a solid product foundation:

- `client/` = patient-facing React app
- `doctors/` = doctor-facing React app
- `server/` = Express + MongoDB backend
- a separate AI backend for OCR and chat assistance

The project is working, which is a very strong place to start. The right next move is not "rewrite everything". The right move is:

1. stabilize the current behavior
2. convert the backend into a modular monolith
3. standardize both frontends around shared packages and a common API layer
4. move slow AI/OCR work into async background processing
5. add testing, observability, CI/CD, and deployment automation
6. only split services further when traffic or team size truly justifies it

For this codebase, the best industry-style path is:

- Phase 1: modular monolith
- Phase 2: shared frontend packages
- Phase 3: production containerization
- Phase 4: Kubernetes deployment
- Phase 5: scale bottlenecks selectively

Do not start with microservices. Start with a modular monolith plus background jobs.

---

## 2. What The Scan Found In This Repo

### 2.1 Current architecture

- Backend entrypoint is centralized in `server/server.js`
- Business logic is concentrated inside controller files such as:
  - `server/controllers/UserController.js`
  - `server/controllers/DoctorController.js`
  - `server/controllers/PrescriptionController.js`
  - `server/controllers/FetchAppointments.js`
- Data access is performed directly inside controllers
- The patient and doctor apps are two separate Vite apps with duplicated patterns
- The AI flow is coupled to hardcoded local endpoints from both backend and frontend

### 2.2 Current strengths

- Clear product split between patient and doctor journeys
- Core health workflows already exist
- MongoDB models are already present
- Cloudinary integration exists
- JWT auth exists
- OCR and AI-assisted record analysis are already conceptually wired

### 2.3 Current risks and technical debt

These are the most important production-readiness gaps observed during the scan:

1. Hardcoded local URLs across the codebase.
   Examples:
   - `client/src/Context/AuthContext.jsx`
   - `client/src/pages/AI_analyzerPage.jsx`
   - `client/src/pages/DoctorProfile.jsx`
   - `client/src/pages/MyHealthRecordPage.jsx`
   - `client/src/pages/MyPrescriptions.jsx`
   - `doctors/src/pages/DoctorLoginPage.jsx`
   - `doctors/src/pages/DoctorSetAvailabilityPage.jsx`
   - `doctors/src/pages/DoctorLiveQueuePage.jsx`
   - backend OCR call in `server/controllers/UserController.js`

2. Backend logic is not layered.
   Controllers currently mix:
   - HTTP handling
   - validation
   - database queries
   - Cloudinary integration
   - OCR calls
   - business rules

3. Security posture is not production-safe yet.
   Observed risks:
   - permissive CORS in `server/server.js` with `origin: true`
   - several doctor routes are not auth-protected even though they mutate state
   - no request validation layer
   - no rate limiting
   - no security headers
   - no audit logging

4. OCR processing is currently in-process.
   In `server/controllers/UserController.js`, OCR is triggered after upload and depends on another service directly. In production this should be queue-based, retriable, and isolated from the API response cycle.

5. No production ops foundation.
   Missing or not present in the repo scan:
   - Dockerfiles
   - docker-compose for full stack
   - Kubernetes manifests
   - CI/CD pipelines
   - health/readiness endpoints
   - structured logging
   - metrics and tracing
   - test suites

6. Frontend architecture is page-heavy and duplicated.
   Common issues:
   - inline styles at page level
   - duplicated auth handling
   - duplicated route protection
   - no shared API client package
   - no shared UI/package system between `client` and `doctors`

7. Token handling is inconsistent.
   Example inconsistencies observed:
   - `localStorage.setItem("token", ...)`
   - `localStorage.removeItem("Token")`
   - `localStorage.removeItem("doctorToken")`

8. AI backend endpoint references are inconsistent across repo docs/code.
   The README references a different AI port than some source files. That must be normalized before production deployment.

9. No explicit production data strategy.
   Missing pieces:
   - indexes plan
   - retention policy
   - migration scripts
   - backup/restore playbook
   - PHI-sensitive audit and access policy

---

## 3. Recommended End-State Architecture

### 3.1 Architecture principle

Use a modular monolith for the API first, backed by Redis and a job queue, with separate deployable frontend apps.

### 3.2 Recommended high-level topology

```text
Users
  |
  v
CDN / Edge Cache
  |
  v
Ingress / Load Balancer
  |
  +----------------------+----------------------+
  |                      |                      |
  v                      v                      v
Patient Web         Doctor Web             API Service
static app          static app             modular monolith
  |                      |                      |
  |                      +----------+-----------+
  |                                 |
  v                                 v
                           Redis / Job Queue
                                 |
                                 v
                              OCR Worker
                                 |
                                 v
                              AI Service
                                 |
                 +---------------+----------------+
                 |                                |
                 v                                v
          MongoDB / Atlas                  Cloudinary / Object Storage
```

### 3.3 Why this is the right target for CuraLink

- You already have one backend. It should become well-structured before it becomes distributed.
- OCR and AI calls are slow and failure-prone; those are ideal to isolate as async jobs.
- The patient and doctor frontends should stay separate apps, but share code via packages.
- MongoDB remains a good fit if you add indexes, validation, and stricter module boundaries.

---

## 4. Recommended Target Repository Structure

This is the industry-style structure I recommend for the next version of this repo:

```text
CuraLink/
  apps/
    patient-web/
    doctor-web/
    api/
    worker-ocr/
  packages/
    ui/
    api-client/
    config/
    types/
    eslint-config/
    tsconfig/
  infra/
    docker/
      nginx/
    k8s/
      base/
      overlays/
        dev/
        staging/
        prod/
    scripts/
  docs/
    architecture/
    runbooks/
    adr/
  .github/
    workflows/
  package.json
  pnpm-workspace.yaml
  turbo.json
```

If you do not want a workspace migration immediately, use this transitional structure first:

```text
CuraLink/
  client/
  doctors/
  server/
    src/
      app.js
      server.js
      config/
      common/
      modules/
      jobs/
      database/
    tests/
  infra/
  docs/
```

### 4.1 Recommended backend module structure

```text
server/src/
  app.js
  server.js
  config/
    env.js
    database.js
    cloudinary.js
    cors.js
  common/
    errors/
    logger/
    middleware/
    utils/
    validation/
  modules/
    auth/
      auth.controller.js
      auth.service.js
      auth.repository.js
      auth.routes.js
      auth.schema.js
    users/
    doctors/
    appointments/
    prescriptions/
    records/
    ai/
  jobs/
    ocr/
      ocr.producer.js
      ocr.worker.js
  database/
    indexes.js
    migrations/
```

### 4.2 Recommended frontend app structure

```text
apps/patient-web/src/
  app/
    router.jsx
    providers.jsx
    store/
  features/
    auth/
    doctors/
    appointments/
    records/
    prescriptions/
    ai-assistant/
  pages/
  shared/
    components/
    hooks/
    lib/
    styles/

apps/doctor-web/src/
  app/
  features/
    auth/
    dashboard/
    patients/
    queue/
    availability/
  pages/
  shared/
```

### 4.3 Shared package structure

```text
packages/api-client/
  src/
    http.ts
    auth.ts
    doctors.ts
    appointments.ts
    records.ts
    prescriptions.ts
    ai.ts

packages/ui/
  src/
    button/
    modal/
    form/
    layout/
    feedback/
```

---

## 5. Step-By-Step Migration Plan

## Phase 0: Freeze Behavior And Create Baseline

Goal: make sure refactoring does not change working behavior.

Actions:

1. Create a `docs/current-system.md` describing:
   - patient flows
   - doctor flows
   - AI/OCR flows
   - existing API endpoints

2. Add smoke tests for the highest-value user flows:
   - patient login
   - doctor login
   - fetch doctor list
   - book slot
   - upload health record
   - fetch today's doctor queue
   - upload prescription

3. Add seed data for local development.

4. Record current API payload shapes before refactoring.

Done criteria:

- current flows are documented
- at least smoke coverage exists for critical journeys
- you can compare old vs new behavior during refactor

---

## Phase 1: Standardize Tooling

Goal: make the repo easier to scale with more contributors.

Recommended changes:

1. Move to a workspace tool:
   - `pnpm workspaces` + `turbo` is a strong fit

2. Standardize on:
   - Node LTS
   - ESLint
   - Prettier
   - TypeScript for all new files

3. Add root scripts:

```json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck"
  }
}
```

4. Keep old JSX files working during migration, but write all new modules in TS/TSX.

Done criteria:

- one-command local startup
- one-command build/test/lint
- consistent Node and package management across apps

---

## Phase 2: Centralize Configuration And Secrets

Goal: remove hardcoded runtime values and make environments predictable.

### 5.2.1 Replace all hardcoded URLs

Current code has local URLs like:

- `http://localhost:8000`
- `http://127.0.0.1:5000`

Replace them with environment-driven config:

Patient web:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_AI_BASE_URL=https://ai.example.com
```

Doctor web:

```env
VITE_API_BASE_URL=https://api.example.com
```

API:

```env
NODE_ENV=production
PORT=8000
MONGO_URI=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
REDIS_URL=...
OCR_QUEUE_NAME=ocr-records
AI_SERVICE_BASE_URL=http://ai-service:8001
ALLOWED_ORIGINS=https://app.example.com,https://doctor.example.com
```

### 5.2.2 Validate config on startup

Use a schema validator like `zod`:

```ts
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]),
  PORT: z.coerce.number().default(8000),
  MONGO_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  REDIS_URL: z.string().url(),
  AI_SERVICE_BASE_URL: z.string().url(),
  ALLOWED_ORIGINS: z.string().min(1)
});
```

Done criteria:

- no hardcoded service URLs remain
- no app starts with invalid config
- every environment is reproducible

---

## Phase 3: Refactor Backend Into A Modular Monolith

Goal: separate transport, business logic, integrations, and persistence.

### 5.3.1 Target layering

Use this structure inside each module:

- `routes` or router: HTTP routing only
- `controller`: request/response mapping only
- `service`: business logic
- `repository`: database access
- `schema`: request validation
- `mapper/dto`: response shaping

### 5.3.2 Example flow

Current:

```text
Route -> Controller -> Mongoose + Cloudinary + OCR call + response
```

Target:

```text
Route
  -> validation middleware
  -> controller
  -> service
  -> repository / integration client
  -> domain result
  -> response mapper
```

### 5.3.3 Recommended domain modules

- `auth`
- `users`
- `doctors`
- `appointments`
- `availability`
- `patient-records`
- `prescriptions`
- `ai`
- `notifications` later

### 5.3.4 Example backend bootstrap structure

```ts
// src/app.ts
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { requestIdMiddleware } from "./common/middleware/requestId";
import { errorHandler } from "./common/errors/errorHandler";
import { healthRouter } from "./common/health/health.routes";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") ?? [], credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(requestIdMiddleware);

  app.use("/health", healthRouter);
  app.use("/api", apiRouter);

  app.use(errorHandler);

  return app;
}
```

### 5.3.5 Immediate backend fixes to prioritize

1. Add auth to mutating doctor routes
   - `createSlots`
   - `deleteAllSlots`
   - `deleteSingleSlot`
   - `handleAppointment`

2. Move token generation and verification into a single auth module

3. Stop calling OCR from the request lifecycle

4. Replace permissive CORS

5. Add request validation for every input payload

6. Standardize response format

Recommended response envelope:

```json
{
  "success": true,
  "data": {},
  "meta": {},
  "error": null
}
```

Done criteria:

- all modules are separated by responsibility
- controllers are thin
- integrations are testable
- routes are consistently protected and validated

---

## Phase 4: Fix Frontend Architecture

Goal: make both web apps maintainable and reusable.

### 5.4.1 Replace direct API calls with one shared client

Create a shared API package:

```ts
// packages/api-client/src/http.ts
import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 5.4.2 Move page-level business logic into feature folders

Example:

```text
features/ai-assistant/
  api/
  hooks/
  components/
  types/
  utils/
```

Apply the same for:

- `records`
- `prescriptions`
- `appointments`
- `doctors`
- `queue`

### 5.4.3 Reduce inline styling

Right now many pages are large single files with UI + logic + styles mixed together.

Target approach:

- keep page shell small
- move reusable blocks into feature components
- use shared design tokens
- use a single theming system

### 5.4.4 Shared auth strategy

Unify:

- token storage key
- logout behavior
- auth provider shape
- route guards
- refresh/session invalidation

### 5.4.5 Shared routing strategy

Keep separate apps, but standardize route composition:

```ts
const routes = [
  publicRoutes,
  authenticatedRoutes,
  featureRoutes
];
```

Done criteria:

- no component directly hardcodes backend URLs
- patient and doctor apps share API and UI foundations
- big page files are broken into smaller feature modules

---

## Phase 5: Make OCR And AI Processing Production-Safe

Goal: slow AI work must become asynchronous, retriable, and observable.

### 5.5.1 Current problem

Today the upload flow:

1. uploads the file
2. stores DB record
3. triggers OCR in-process

That creates these problems:

- API pod memory spikes
- OCR failures are hard to retry
- restarts can drop work
- scaling API and OCR together is inefficient

### 5.5.2 Target pattern

```text
Patient uploads record
  -> API stores metadata
  -> API publishes OCR job to Redis queue
  -> API responds immediately
  -> OCR worker consumes job
  -> AI service performs OCR/extraction
  -> worker updates record status and summary
```

### 5.5.3 Recommended record processing states

```ts
type RecordProcessingStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";
```

Add fields like:

- `processingStatus`
- `processingAttempts`
- `lastProcessedAt`
- `processingError`

### 5.5.4 Queue example

```ts
import { Queue } from "bullmq";

export const ocrQueue = new Queue("ocr-records", {
  connection: { url: process.env.REDIS_URL }
});

await ocrQueue.add("process-record", {
  recordId,
  fileUrl
}, {
  attempts: 5,
  backoff: { type: "exponential", delay: 5000 },
  removeOnComplete: 1000,
  removeOnFail: 1000
});
```

### 5.5.5 Worker example

```ts
import { Worker } from "bullmq";

new Worker("ocr-records", async (job) => {
  const { recordId, fileUrl } = job.data;

  await markRecordProcessing(recordId);
  const extracted = await aiClient.extractRecord(fileUrl);
  await saveRecordSummary(recordId, extracted);
}, {
  connection: { url: process.env.REDIS_URL }
});
```

Done criteria:

- upload API is fast
- OCR retries safely
- failures are visible
- workers scale independently from API pods

---

## Phase 6: Data Modeling, Query Design, And Indexing

Goal: keep MongoDB fast as data grows.

### 5.6.1 Add indexes intentionally

Recommended index examples:

```js
AppointmentSchema.index({ doctorId: 1, date: 1, status: 1 });
AppointmentSchema.index({ patientId: 1, date: -1 });
PatientRecordSchema.index({ patientId: 1, recordDate: -1 });
PatientRecordSchema.index({ patientId: 1, processingStatus: 1 });
PrescriptionSchema.index({ patientId: 1, prescriptionDate: -1 });
AvailabilitySlotSchema.index({ doctorId: 1, Date: 1, "Time.Start": 1 }, { unique: true });
DoctorSchema.index({ Email: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
```

### 5.6.2 Add repository-level query patterns

Avoid:

- fetching whole collections then filtering in memory

Example improvement:

Current pattern exists in appointment fetching for patients.
Instead of:

```js
const allSchedule = await Appointment.find({});
const mine = allSchedule.filter(...);
```

Use:

```js
await Appointment.find({ patientId }).sort({ date: -1 }).lean();
```

### 5.6.3 Add migrations and seed strategy

You need:

- seed data for dev/demo
- schema migration scripts for prod
- index sync job

### 5.6.4 Keep PHI-sensitive data minimal

Store:

- what is necessary
- encrypted secrets separately
- audit trails for access/mutation

Done criteria:

- collection scans are minimized
- high-traffic queries are indexed
- migrations are repeatable

---

## Phase 7: Security And Compliance Hardening

Goal: make the platform safer before real user growth.

### 5.7.1 Minimum backend security stack

Add:

- `helmet`
- strict `cors`
- `express-rate-limit`
- payload validation
- centralized auth middleware
- role-aware authorization
- request IDs
- audit logging

### 5.7.2 File upload security

Validate:

- mime type
- max size
- file extension
- virus scanning in enterprise setup

Do not trust only frontend validation.

### 5.7.3 Auth improvements

Current JWT auth works as a start, but production should add:

- consistent payload structure
- token expiry policy
- refresh token strategy or secure re-auth flow
- logout invalidation if required by compliance needs

### 5.7.4 Secrets management

Do not keep production secrets in plain `.env` files on servers.

Use:

- Kubernetes Secrets
- cloud secret manager
- CI secret store

### 5.7.5 API rate limiting example

```ts
import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});
```

### 5.7.6 Healthcare-specific production note

If real medical data will be handled, plan for:

- access audits
- least privilege
- encrypted storage and backups
- signed BAAs or healthcare-ready vendors where required
- privacy/legal review before launch

Done criteria:

- all inputs validated
- all sensitive routes protected
- logs support auditability

---

## Phase 8: Testing Strategy

Goal: make refactoring and deployment safe.

### 5.8.1 Recommended test layers

1. Unit tests
   - services
   - helpers
   - validators

2. Integration tests
   - route + controller + DB
   - queue producer/worker behavior

3. E2E tests
   - patient login
   - doctor login
   - book appointment
   - upload record
   - AI record selection flow
   - doctor queue status update

### 5.8.2 Suggested tooling

- backend: `vitest` or `jest` + `supertest`
- frontend: `vitest` + `react-testing-library`
- e2e: `playwright`

### 5.8.3 Minimum critical test list

- user registration/login
- doctor registration/login
- protected route access control
- slot creation and collision prevention
- booking flow
- OCR queue publish on record upload
- prescription CRUD
- doctor live queue state transitions

Done criteria:

- refactors are test-backed
- deploys can block on failing critical flows

---

## Phase 9: Observability, Monitoring, And Reliability

Goal: know when something is slow, broken, or degrading.

### 5.9.1 Add structured logging

Use a JSON logger such as `pino`.

Example:

```ts
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: ["req.headers.authorization", "password", "token"]
});
```

### 5.9.2 Add health endpoints

Use separate endpoints:

- `/health/live` = process is alive
- `/health/ready` = dependencies are available

Example:

```ts
router.get("/live", (_req, res) => res.status(200).json({ ok: true }));

router.get("/ready", async (_req, res) => {
  await mongoose.connection.db.admin().ping();
  res.status(200).json({ ok: true });
});
```

### 5.9.3 Add metrics

Track:

- request rate
- latency
- error rate
- queue depth
- OCR job duration
- DB query duration
- upload success/fail counts

### 5.9.4 Add tracing

Use OpenTelemetry between:

- frontend request
- API
- Redis queue
- OCR worker
- AI service

### 5.9.5 Add error monitoring

Use an error monitoring platform for:

- frontend crashes
- backend exceptions
- worker failures

Done criteria:

- every request has traceability
- every failure is observable
- latency bottlenecks are measurable

---

## Phase 10: CI/CD And Release Process

Goal: deploy safely and repeatedly.

### 5.10.1 Recommended pipeline stages

1. install
2. lint
3. typecheck
4. unit/integration tests
5. build images
6. vulnerability scan
7. deploy to staging
8. smoke test staging
9. manual approval
10. deploy to production

### 5.10.2 Example GitHub Actions pipeline

```yaml
name: ci-cd

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build

  docker:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - run: docker build -t ghcr.io/org/curalink-api:${{ github.sha }} -f apps/api/Dockerfile .
      - run: docker push ghcr.io/org/curalink-api:${{ github.sha }}
```

### 5.10.3 Release strategy

Use:

- staging environment
- blue/green or rolling deploys
- DB-safe migrations
- feature flags for risky changes

Done criteria:

- every release is reproducible
- rollback is simple
- production deploy does not depend on manual shell work

---

## 6. Deployment Strategy

## 6.1 Environment model

Use at least:

- `dev`
- `staging`
- `prod`

Staging should be production-like:

- same container images
- same ingress behavior
- same env strategy
- same queue and worker topology

## 6.2 Recommended production services

Minimum production stack:

- patient web static container
- doctor web static container
- API container
- OCR worker container
- AI service container or managed AI backend
- managed MongoDB
- Redis
- object storage / Cloudinary
- ingress/load balancer
- monitoring stack

## 6.3 Domain strategy

Recommended domains:

- `app.example.com` -> patient web
- `doctor.example.com` -> doctor web
- `api.example.com` -> API
- `ai.internal.svc.cluster.local` -> AI service internal only

Keep the AI service private if possible.

---

## 7. Docker Setup

Below are production-style examples you can adapt.

## 7.1 API Dockerfile

Suggested file: `apps/api/Dockerfile`

```dockerfile
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages packages
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:lts-alpine AS build
WORKDIR /app
COPY --from=deps /app /app
COPY . .
RUN corepack enable && pnpm --filter api build

FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 8000
CMD ["node", "dist/server.js"]
```

## 7.2 OCR worker Dockerfile

Suggested file: `apps/worker-ocr/Dockerfile`

```dockerfile
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/worker-ocr/package.json apps/worker-ocr/package.json
COPY packages packages
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:lts-alpine AS build
WORKDIR /app
COPY --from=deps /app /app
COPY . .
RUN corepack enable && pnpm --filter worker-ocr build

FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/worker-ocr/dist ./dist
COPY --from=build /app/apps/worker-ocr/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
CMD ["node", "dist/worker.js"]
```

## 7.3 Frontend Dockerfile

Suggested file: `apps/patient-web/Dockerfile`

```dockerfile
FROM node:lts-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/patient-web/package.json apps/patient-web/package.json
COPY packages packages
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter patient-web build

FROM nginx:stable-alpine
COPY infra/docker/nginx/patient.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/patient-web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Use the same pattern for `doctor-web`.

## 7.4 Nginx SPA config

Suggested file: `infra/docker/nginx/patient.conf`

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  gzip on;
  gzip_types text/plain text/css application/json application/javascript application/xml+rss image/svg+xml;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

---

## 8. Local Full-Stack Compose Setup

Suggested file: `docker-compose.yml`

```yaml
version: "3.9"

services:
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    env_file:
      - .env.api
    ports:
      - "8000:8000"
    depends_on:
      - mongo
      - redis

  worker-ocr:
    build:
      context: .
      dockerfile: apps/worker-ocr/Dockerfile
    env_file:
      - .env.api
    depends_on:
      - redis
      - api

  patient-web:
    build:
      context: .
      dockerfile: apps/patient-web/Dockerfile
    ports:
      - "5173:80"
    depends_on:
      - api

  doctor-web:
    build:
      context: .
      dockerfile: apps/doctor-web/Dockerfile
    ports:
      - "5174:80"
    depends_on:
      - api

  ai-service:
    image: your-ai-service-image:latest
    ports:
      - "8001:8001"

volumes:
  mongo-data:
```

---

## 9. Kubernetes Reference Setup

Use Kustomize or Helm. Kustomize is enough to start.

## 9.1 Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: curalink
```

## 9.2 ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: curalink-api-config
  namespace: curalink
data:
  NODE_ENV: "production"
  PORT: "8000"
  AI_SERVICE_BASE_URL: "http://ai-service:8001"
```

## 9.3 Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: curalink-api-secret
  namespace: curalink
type: Opaque
stringData:
  MONGO_URI: "replace-me"
  JWT_SECRET: "replace-me"
  REDIS_URL: "redis://redis:6379"
  CLOUDINARY_CLOUD_NAME: "replace-me"
  CLOUDINARY_API_KEY: "replace-me"
  CLOUDINARY_API_SECRET: "replace-me"
```

## 9.4 API Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: curalink
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: ghcr.io/org/curalink-api:latest
          ports:
            - containerPort: 8000
          envFrom:
            - configMapRef:
                name: curalink-api-config
            - secretRef:
                name: curalink-api-secret
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 8000
            initialDelaySeconds: 10
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health/live
              port: 8000
            initialDelaySeconds: 20
            periodSeconds: 20
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "1000m"
              memory: "1Gi"
```

## 9.5 API Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api
  namespace: curalink
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 8000
```

## 9.6 OCR Worker Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker-ocr
  namespace: curalink
spec:
  replicas: 2
  selector:
    matchLabels:
      app: worker-ocr
  template:
    metadata:
      labels:
        app: worker-ocr
    spec:
      containers:
        - name: worker-ocr
          image: ghcr.io/org/curalink-worker-ocr:latest
          envFrom:
            - configMapRef:
                name: curalink-api-config
            - secretRef:
                name: curalink-api-secret
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "1000m"
              memory: "1Gi"
```

## 9.7 Frontend Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: patient-web
  namespace: curalink
spec:
  replicas: 2
  selector:
    matchLabels:
      app: patient-web
  template:
    metadata:
      labels:
        app: patient-web
    spec:
      containers:
        - name: patient-web
          image: ghcr.io/org/curalink-patient-web:latest
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "256Mi"
```

Create the same for `doctor-web`.

## 9.8 Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: curalink-ingress
  namespace: curalink
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "20m"
spec:
  ingressClassName: nginx
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: patient-web
                port:
                  number: 80
    - host: doctor.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: doctor-web
                port:
                  number: 80
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 80
```

## 9.9 Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: curalink
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

## 9.10 Pod Disruption Budget

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
  namespace: curalink
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api
```

---

## 10. Latency And Performance Handling

This is especially important for CuraLink because:

- medical record uploads can be heavy
- AI/OCR requests are slow
- doctor queue screens need near-real-time updates

## 10.1 API latency strategy

Do:

- keep synchronous request handlers fast
- move OCR/AI work to queue workers
- use `.lean()` for read-heavy Mongoose queries
- paginate list endpoints
- add indexes before growth
- compress responses
- enforce request timeouts

## 10.2 Frontend latency strategy

Do:

- code split route-heavy pages
- lazy load large features like AI assistant and records
- use skeleton loaders
- prefetch common routes after login
- cache API responses with a query library
- retry idempotent reads only

Recommended frontend query stack:

- TanStack Query for caching, retries, stale-while-revalidate patterns

## 10.3 Queue and worker latency strategy

Do:

- separate queue workers from API
- autoscale workers based on queue depth
- set concurrency limits
- add DLQ or failed-job inspection

## 10.4 Doctor queue real-time strategy

Current doctor queue appears polling-style. Production options:

1. Start with short polling
   - simplest
   - acceptable for smaller traffic

2. Upgrade to SSE
   - great for live queue updates
   - simpler than WebSocket for one-way status updates

3. Use WebSockets only if two-way live interactions grow

For CuraLink, SSE is likely the best medium-term choice for live queue updates.

## 10.5 Media and upload performance

Do:

- upload directly to object storage/Cloudinary when mature enough
- resize/compress images
- use CDN for public assets
- avoid passing large files through too many services

## 10.6 Database performance checklist

- add indexes
- avoid in-memory filtering after broad queries
- use projections
- archive old records where appropriate
- monitor slow query logs

---

## 11. Reliability And Failure Handling

## 11.1 Timeouts

Add explicit timeouts for:

- API outbound calls
- AI service calls
- DB queries where relevant
- frontend API requests

## 11.2 Retries

Retry only:

- queue jobs
- idempotent GET requests
- transient network errors

Do not blindly retry state-changing API calls without idempotency design.

## 11.3 Circuit breaking

For AI/OCR dependencies:

- if AI service is unhealthy, uploads should still succeed
- record status should remain `pending` or `failed`
- patient UI should show processing state, not crash

## 11.4 Graceful shutdown

API and workers should handle:

- SIGTERM
- connection draining
- job shutdown completion

---

## 12. Recommended Development Standards

Use these standards going forward:

### Backend

- controllers under 100 lines when possible
- business logic in services
- no direct database calls from route files
- input validation required for every write endpoint
- one logger
- one error format

### Frontend

- no hardcoded API URLs
- no giant page files for logic-heavy features
- shared hooks and components
- feature-based directories
- async state handled through a query/mutation library

### Git workflow

- feature branches
- PR reviews
- required CI checks
- squash merge or clean merge policy
- release tagging

---

## 13. Suggested 12-Week Practical Execution Plan

## Weeks 1-2

- baseline tests
- env/config centralization
- health endpoints
- logging
- strict CORS
- auth route audit

## Weeks 3-4

- backend modular monolith skeleton
- shared error handling
- validation layer
- shared API client package

## Weeks 5-6

- refactor auth/users/doctors/appointments modules
- replace hardcoded frontend URLs
- unify token strategy

## Weeks 7-8

- refactor records/prescriptions/AI modules
- introduce Redis queue
- move OCR to worker

## Weeks 9-10

- Dockerfiles
- docker-compose
- CI/CD
- staging environment

## Weeks 11-12

- Kubernetes manifests
- HPA/PDB/Ingress
- monitoring
- performance tuning
- production cutover checklist

---

## 14. Production Readiness Checklist

Use this before launch:

- environment variables validated at startup
- no hardcoded localhost URLs
- structured logs enabled
- health endpoints enabled
- all mutating routes authenticated and authorized
- request validation on every write API
- tests passing in CI
- Docker images built reproducibly
- staging environment healthy
- DB backups verified
- rollback plan documented
- OCR jobs asynchronous
- metrics/dashboard alerts configured
- error monitoring configured
- CDN enabled for frontend assets
- TLS enabled on all public endpoints

---

## 15. Recommended First Refactors In This Exact Repo

If you want the highest ROI sequence for this specific codebase, do these first:

1. Replace all hardcoded frontend/backend URLs with env config.

2. Create a shared API client and remove direct scattered `axios`/`fetch` usage.

3. Add backend `src/` structure and move `server.js` logic into:
   - `src/app`
   - `src/server`
   - `src/config`

4. Split these controller files into modules:
   - `UserController.js`
   - `DoctorController.js`
   - `PrescriptionController.js`
   - `FetchAppointments.js`

5. Lock down doctor mutation routes with auth and validation.

6. Move OCR to Redis/BullMQ worker flow.

7. Add:
   - health endpoints
   - logger
   - helmet
   - rate limiting
   - tests

8. Containerize:
   - API
   - both frontends
   - OCR worker

9. Deploy staging first.

10. Only then do UI/package consolidation and deeper architecture cleanup.

---

## 16. What Not To Do

Avoid these common mistakes:

1. Do not rewrite all three apps at once.
2. Do not split into microservices before modularizing the monolith.
3. Do not keep OCR work inside API request handling.
4. Do not deploy without health checks, logs, and staging.
5. Do not introduce TypeScript by rewriting everything in one pass.
6. Do not hardcode domains or ports anywhere.
7. Do not let frontend auth/storage behavior diverge between patient and doctor apps.

---

## 17. Final Recommendation

For CuraLink, the industry-grade path is:

- keep the product split
- modularize the backend
- centralize config
- share frontend foundations
- move AI/OCR to workers
- ship with Docker, CI/CD, observability, and Kubernetes

That gives you:

- safer refactors
- faster onboarding
- better reliability
- easier scaling
- a codebase that feels like a real production platform, not a demo

---

## 18. Optional Next Deliverables

After this guide, the next useful artifacts would be:

1. a repo-specific target folder restructure map
2. actual Dockerfiles added to the repo
3. actual Kubernetes manifests added to the repo
4. a migration checklist issue board
5. a phased implementation branch starting with config + backend modularization

If you want, the next step can be turning this guide into actual code changes incrementally without breaking the current working system.
