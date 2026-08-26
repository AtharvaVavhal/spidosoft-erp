<div align="center">

# PrintForge

**Custom printing, engineered like infrastructure.**

[![Architecture](https://img.shields.io/badge/architecture-frozen%20v1.2-black)]()
[![Backend](https://img.shields.io/badge/backend-live-brightgreen)]()
[![Frontend](https://img.shields.io/badge/frontend-in%20development-orange)]()
[![License](https://img.shields.io/badge/license-proprietary-black)]()

</div>

---

## Overview

PrintForge is a modular commerce platform for custom printing. It takes a customer from product discovery through file upload, checkout, payment, production, and delivery — with every state transition enforced at the database layer, not assumed by application code.

The system is built as a **modular monolith**: one deployable backend, clean domain boundaries, and PostgreSQL as the single source of truth for correctness. There are no microservices, no message brokers, and no distributed infrastructure that the current scale does not justify. Reliability comes from transactions, constraints, and idempotency — not from additional moving parts.

This README documents the actual system: what exists, what is deliberately deferred, and why.

---

## Contents

- [Product Experience](#product-experience)
- [Architecture](#architecture)
- [Payment Architecture](#payment-architecture)
- [Checkout Consistency](#checkout-consistency)
- [Order Lifecycle](#order-lifecycle)
- [Webhook Reliability](#webhook-reliability)
- [Transactional Outbox](#transactional-outbox)
- [Database Architecture](#database-architecture)
- [Security](#security)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [API Surface](#api-surface)
- [Local Development](#local-development)
- [Development Workflow](#development-workflow)
- [Reliability / Failure Matrix](#reliability--failure-matrix)
- [Tax & GST](#tax--gst)
- [Project Status](#project-status)

---

## Product Experience

```
Discover → Customize → Upload → Cart → Checkout → Payment → Production → Shipping → Delivery
```

**Customer-facing capabilities**

| Area | Capability |
|---|---|
| Catalog | Browse categories, products, and variants |
| Customization | Configure per-product customization fields |
| Uploads | Attach artwork/files to customized items |
| Cart | Manage line items and customizations pre-checkout |
| Checkout | Convert a cart into an immutable order |
| Payment | Pay via Razorpay, retry on failure |
| Orders | Track status from payment through delivery |
| Notifications | Receive transactional emails on key events |

**Admin capabilities**

| Area | Capability |
|---|---|
| Catalog management | Products, categories, variants, customization fields |
| Order management | View orders, transition status, inspect payment history, record refunds |
| Customers | Read-only customer list and detail with order/spend context |
| Dashboard | Order counts, revenue, and recent-order summary |

---

## Architecture

**Status: frozen at Blueprint v1.2.** See [`docs/architecture/BLUEPRINT-v1.2.md`](./docs/architecture/BLUEPRINT-v1.2.md) for the canonical specification. This README is a summary; the blueprint is the source of truth.

### Principles

- **Database-enforced correctness.** Invariants that matter (uniqueness, one-captured-payment-per-order, idempotent writes) are enforced by PostgreSQL constraints, not application-level checks alone.
- **Explicit transaction boundaries.** Multi-step business operations (checkout, webhook processing) execute inside a single transaction or are decomposed into safe, resumable phases.
- **Idempotency by default.** Any operation that can be retried, double-clicked, or redelivered is designed to be safe when it happens twice.
- **Recoverability over cleverness.** Failure states are first-class: `FAILED`, `PROCESSING_FAILED`, `ABANDONED` are real, queryable states — not swallowed exceptions.
- **Simple infrastructure.** PostgreSQL and a scheduled poller replace a queue where a queue is not yet justified.
- **Frozen architecture, evolving code.** Structural decisions are versioned and deliberate; implementation details are not.

### System Diagram

```mermaid
flowchart LR
    subgraph Client
        Web["React SPA<br/>www.printforge.in"]
    end
    subgraph Backend["NestJS Modular Monolith — api.printforge.in"]
        Auth[Auth Module]
        Catalog[Catalog Module]
        Cart[Cart Module]
        Checkout[Checkout Module]
        Payments[Payments Module]
        Orders[Orders Module]
        Admin[Admin Module]
        Outbox[Outbox Poller]
    end
    DB[(PostgreSQL)]
    RZP[Razorpay]
    CLD[Cloudinary]
    RSD[Resend]

    Web -->|REST + JWT| Backend
    Auth --> DB
    Catalog --> DB
    Cart --> DB
    Checkout --> DB
    Payments --> DB
    Orders --> DB
    Admin --> DB
    Outbox --> DB
    Checkout -->|Create Order| RZP
    Payments -->|Verify / Webhook| RZP
    Catalog -->|Public delivery| CLD
    Catalog -->|Signed delivery, customer uploads| CLD
    Outbox -->|Send email| RSD
```

---

## Payment Architecture

An **Order** has one-to-many **PaymentAttempts**. A single Razorpay Order ID is created per application Order and reused across retries — PrintForge never creates a new application Order for a retried payment.

```
Order 1 ──< PaymentAttempt N
             ├─ INITIATED
             ├─ CAPTURED   (at most one per order)
             ├─ FAILED     (any number)
             └─ ABANDONED
```

**Enforced invariants**

| Constraint | Enforced by |
|---|---|
| At most one `CAPTURED` attempt per order | Partial unique index: `orderId WHERE status = 'CAPTURED'` |
| No two attempts share a Razorpay payment | Unique index on `razorpayPaymentId` |
| One Razorpay Order ID per application Order | Set-once column update, `WHERE razorpayOrderId IS NULL` |

Multiple failed or abandoned attempts against the same order are expected and harmless — the partial index only ever gates the state that matters.

---

## Checkout Consistency

Checkout is designed to be safe under double-clicks, duplicate requests, and partial failures.

```mermaid
sequenceDiagram
    participant C as Client
    participant API as Checkout Module
    participant DB as PostgreSQL
    participant RZP as Razorpay

    C->>API: POST /checkout/orders (Idempotency-Key)
    API->>DB: BEGIN
    API->>DB: SELECT cart FOR UPDATE
    API->>DB: INSERT idempotency key ON CONFLICT
    API->>DB: Revalidate products, recompute price
    API->>DB: INSERT order, order_items, snapshots
    API->>DB: Save idempotency → orderId
    API->>DB: Clear cart
    API->>DB: COMMIT
    API->>RZP: Create Razorpay Order
    RZP-->>API: razorpayOrderId
    API->>DB: UPDATE orders SET razorpayOrderId WHERE NULL
    API-->>C: Order created
```

The database transaction commits **before** PrintForge talks to Razorpay. This is deliberate: the order's existence never depends on an external API call succeeding. If Razorpay order creation fails, the order remains valid in `PENDING_PAYMENT`, and `POST /checkout/orders/:id/retry-payment` repeats only the association step — not the entire checkout.

The cart lock (`FOR UPDATE`) and the `INSERT ... ON CONFLICT` idempotency claim together make concurrent duplicate submissions collapse into a single order — including two different tabs racing on the same cart with two different idempotency keys, which the row lock alone resolves.

### Order Shipping Snapshot

Shipping details are copied onto the `orders` row at creation time — there is no separate `order_address_snapshots` table. Once written, these fields are immutable:

```
shippingRecipientName   shippingAddressLine2   shippingPostalCode
shippingPhone           shippingCity           shippingCountry
shippingAddressLine1    shippingState
```

A customer editing their saved address afterward has no effect on historical orders — the order already owns its own copy.

---

## Order Lifecycle

```
PENDING_PAYMENT → PAID → CONFIRMED → IN_PRODUCTION → SHIPPED → DELIVERED
                                    ↘ CANCELLED
                                    ↘ REFUNDED
```

Status changes are applied as conditional, compare-and-set database updates: `UPDATE orders SET status = $next WHERE id = $id AND status = $expectedCurrent`. Re-applying a transition that has already been applied is a no-op, not an error — this makes admin double-clicks safe. A transition attempted from an unexpected state returns:

```
409 INVALID_TRANSITION
```

Business order state (above) is intentionally decoupled from payment-infrastructure state (`PaymentAttempt` status, webhook status) — the two lifecycles are related but not the same state machine.

---

## Webhook Reliability

Webhook handling is split into two phases so that acknowledging Razorpay is never blocked on business logic.

**Phase 1 — Ingest**
1. Capture the raw request body (required for signature verification).
2. Verify the Razorpay webhook signature.
3. Persist the event with a unique `razorpayEventId`.
4. Acknowledge Razorpay immediately.

**Phase 2 — Process**
1. Load the persisted, unprocessed event.
2. Update the relevant `PaymentAttempt`.
3. Update the `Order` if required.
4. Write `order_status_history`.
5. Insert an `outbox_events` row in the same transaction.
6. Mark the webhook `PROCESSED`.

```
RECEIVED → PROCESSED
         ↘ PROCESSING_FAILED  (retried by scheduled poller)
         ↘ IGNORED            (duplicate / not actionable)
```

The unique `razorpayEventId` constraint means a redelivered webhook is detected at ingest and cannot produce duplicate side effects. Processing failures are picked up by the same scheduled polling mechanism used for the outbox — no separate retry infrastructure. Webhook delivery order is **not** guaranteed by Razorpay, and PrintForge does not claim otherwise: payment-state updates are written as idempotent, state-checked writes rather than assumed to arrive in sequence.

---

## Transactional Outbox

Notifications are decoupled from business transactions using a PostgreSQL-native outbox — no Redis, Kafka, or RabbitMQ.

The event row is inserted in the **same transaction** as the state change it describes, so a committed business event and its notification record can never disagree.

```
PENDING → PROCESSING → SENT
                      ↘ FAILED   (after 5 attempts, terminal)
```

A scheduled NestJS poller claims work with `SELECT ... FOR UPDATE SKIP LOCKED`, so multiple instances can run the poller safely without duplicate claims. Failed sends retry with exponential backoff, tracked via `lastError` and `availableAt`, up to 5 attempts before landing in the terminal `FAILED` state for manual inspection.

**Event types:** `ORDER_PAID` · `ORDER_STATUS_CHANGED` · `PASSWORD_RESET_REQUESTED`
**Provider:** Resend, sender `PrintForge <orders@printforge.in>`

Email delivery failure never rolls back or corrupts order or payment state — the outbox is downstream of truth, not a dependency of it. There is one accepted edge case: if the process crashes between the provider accepting an email and the outbox row being marked `SENT`, the event is retried and the customer may receive a rare duplicate email. This is treated as acceptable — silently losing a notification is worse than an occasional duplicate.

---

## Database Architecture

```
users, refresh_tokens
categories, products, product_images, product_variants, customization_fields
uploaded_files
carts, cart_items, cart_item_customizations
orders, order_items, order_item_customizations, order_status_history
payment_attempts, webhook_events, idempotency_keys, outbox_events
app_settings
```

**Reserved for future phases (not implemented):** `coupons`, `coupon_usages`, `reviews`.

There is intentionally no `payments` table. It was replaced early in design by `payment_attempts`, which models the real relationship between an order and the (possibly several) attempts made to pay for it.

### Data Integrity

Constraints exist because the failure modes they prevent are worse than the friction they add. Each one maps to a concrete scenario, not a generic best practice:

| Constraint | Prevents |
|---|---|
| `users.email` unique | Duplicate accounts / login ambiguity |
| `products.slug` unique | Colliding public product URLs |
| `categories.slug` unique | Colliding public category URLs |
| `orders.orderNumber` unique | Ambiguous customer-facing order references |
| `orders.razorpayOrderId` unique | Two orders sharing one payment session |
| `payment_attempts.razorpayPaymentId` unique | Recording the same Razorpay payment twice |
| Partial unique: one `CAPTURED` attempt per order | Double-charging or double-crediting a single order |
| `webhook_events.razorpayEventId` unique | Redelivered webhooks re-executing side effects |
| `outbox_events.eventKey` unique | A business event enqueuing more than one notification |
| `idempotency_keys.key` unique | A retried checkout request creating a second order |

The common thread: every one of these encodes a "this must never happen twice" rule directly into the schema, so correctness does not depend on every code path remembering to check.

---

## Security

**Authentication**

- Short-lived JWT access tokens, held client-side in memory only — never `localStorage` or `sessionStorage`.
- Refresh tokens delivered as an HttpOnly, Secure cookie: `SameSite=Strict`, `Path=/api/v1/auth/refresh`, no `Domain` attribute set.
- Refresh-token rotation on every use.
- Refresh-token reuse detection — a reused (already-rotated) token revokes the entire session chain.
- Logout and logout-all via `tokenVersion` invalidation.

**Login protection**

- IP-based throttling (`@nestjs/throttler`).
- Progressive delay after repeated failures.
- No hard account lockout, no CAPTCHA in the current phase — a failed login remains a standard authentication failure, not a distinguishable locked state.

**Transport & CORS**

- CORS restricted to the deployed frontend origin, credentials enabled — never a wildcard, enforced in production `NODE_ENV`.
- Standard security headers (CSP, HSTS, X-Frame-Options, and related) applied platform-wide via Helmet.
- Frontend and backend share the registrable root domain `printforge.in`, required for the refresh cookie's `SameSite=Strict` to survive across subdomains.
- Errors are reported to Sentry when configured, scrubbed of request bodies and sensitive payloads before leaving the process.

### File Upload Security

Accepted formats: **PNG, JPEG, PDF**. Archive formats are not accepted, and the server never extracts or decompresses uploaded content.

| Control | Purpose |
|---|---|
| Magic-byte validation | Detect actual file type, not just extension |
| MIME/type validation | Reject mismatched or spoofed content types |
| 10 MB size limit, enforced on the stream | Bound resource usage before the full file lands |
| No archive extraction, no server-side decompression | Eliminate zip-bomb / archive-based attack surface |
| No unnecessary server-side parsing | Cloudinary handles media processing, not the API |
| Delivery type by purpose | Product catalog images are public and CDN-cacheable; customer file uploads are signed and access-gated — the two have different confidentiality needs and are treated differently |
| Ownership verification on `uploadedFileId` | Prevent one user from referencing another user's file |
| Per-user / per-IP upload rate limits | Bound abuse of the upload endpoint |
| Orphan cleanup | Remove files uploaded but never attached to an order |

---

## Technology Stack

**Frontend**
React · TypeScript · Vite · React Router · TanStack Query · Axios · React Hook Form · Zod · CSS Modules · CSS Variables · Lucide React · Vitest + React Testing Library

**Backend**
NestJS · TypeScript · Prisma · PostgreSQL · REST + JSON · JWT · bcrypt · `@nestjs/schedule` · `@nestjs/throttler` · `@sentry/node`

**Integrations**
Razorpay (payments) · Cloudinary (media) · Resend (transactional email) · Sentry (error tracking)

**Production topology**

| Layer | Domain | Host |
|---|---|---|
| Backend | `api.printforge.in` (DNS cutover pending; live at the Render-assigned URL) | Render |
| Frontend | `www.printforge.in` (not yet deployed) | Vercel / Netlify |

---

## Repository Structure

```
PrintForge/
├── backend/                       # NestJS + Prisma API
│   ├── src/
│   ├── prisma/
│   └── test/
├── frontend/                      # React + TypeScript SPA
│   └── src/
├── docs/
│   └── architecture/
│       └── BLUEPRINT-v1.2.md      # Canonical architecture specification
├── .gitignore
└── README.md
```

---

## API Surface

| Domain | Responsibility |
|---|---|
| `/health` | Liveness and DB-connectivity probes |
| `/auth` | Register, login, logout, token refresh, password reset |
| `/users` | Authenticated user's own profile |
| `/products` | Product catalog reads |
| `/categories` | Category catalog reads |
| `/uploads` | File uploads (product images, customization artwork) |
| `/cart` | Cart and cart item management |
| `/checkout` | Order creation and payment retry |
| `/payments` | Payment verification and webhook ingestion |
| `/orders` | Customer order reads and cancellation |
| `/admin` | Product, category, order, and customer administration |

**Notable endpoints**

```
GET    /health/deep
POST   /checkout/orders
POST   /checkout/orders/:id/retry-payment
POST   /payments/verify
POST   /payments/webhook
POST   /auth/login
PATCH  /admin/orders/:id/status
```

`payment_attempts` has no standalone REST resource — it is exposed only as contextual, read-only data nested within order responses. `outbox_events` and `webhook_events` have no public API; they are internal reliability mechanisms.

---

## Local Development

```bash
# clone
git clone https://github.com/AtharvaVavhal/PrintForge.git
cd PrintForge

# backend
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev

# frontend
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

### Environment Configuration

**`backend/.env`**

```env
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/printforge?schema=public

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=30d

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

RESEND_API_KEY=
EMAIL_FROM_ADDRESS=no-reply@printforge.in

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional — Sentry.init is guarded by this; unset is a valid no-op locally
SENTRY_DSN=
```

**`frontend/.env`**

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_RAZORPAY_KEY_ID=
```

---

## Development Workflow

Feature branches only — no direct commits to `main` or `develop`.

```
feature/<owner>/auth
feature/<owner>/catalog
feature/<owner>/checkout
feature/<owner>/orders
fix/<owner>/<short-description>
```

```
Branch → Implement → Typecheck → Lint → Test → Build → Pull Request → Review → Merge
```

### Architecture Freeze

Blueprint v1.2 is frozen. Code implementing it can evolve freely; the structural decisions it encodes cannot change silently. Any proposed architecture change follows a fixed path:

```
Problem → Impact Analysis → Review → Approval → Blueprint Update → Implementation
```

---

## Reliability / Failure Matrix

| Scenario | Behavior |
|---|---|
| Checkout double-click | Second request hits `idempotency_keys` conflict, returns the original order |
| Simultaneous checkout requests | Cart `FOR UPDATE` lock serializes them |
| Razorpay order creation fails | Order stays valid, `PENDING_PAYMENT`; retry endpoint repeats only the association step |
| Frontend crash after payment | Webhook independently reconciles order state |
| Webhook arrives before frontend verification | Webhook processing applies the state; frontend verification becomes a no-op confirmation |
| Frontend verification arrives before webhook | Verification applies the state; webhook later confirms/no-ops |
| Duplicate webhook delivery | Blocked by unique `razorpayEventId` |
| Webhook processing failure | Marked `PROCESSING_FAILED`, retried by scheduled poller |
| Email provider failure | Outbox retries with backoff; order/payment state unaffected |
| Refresh-token replay | Reuse detection revokes the session |
| Unauthorized `uploadedFileId` reference | Ownership check rejects it |
| Address changed after order placed | Order retains its immutable shipping snapshot |
| Admin double-click on status change | Conditional update is a no-op on the second click |
| Invalid order transition | `409 INVALID_TRANSITION` |
| Retrying payment after a failed attempt | New `PaymentAttempt` row; same Order, same Razorpay Order ID |
| Database connectivity lost | `/health/deep` reports it distinctly from process-alive `/health`, so a transient DB blip doesn't trigger a platform restart-loop |

---

## Tax & GST

GST treatment is a business and legal decision, not an engineering one. PrintForge does not assume, infer, or hard-code any GST rate, invoicing requirement, or filing obligation. The pricing engine is structured so GST handling can be introduced once the following are confirmed by the business:

- Whether GST applies to the platform's transactions.
- Whether GST-compliant invoices must be generated.
- Applicable rate(s) and rule(s).
- GSTIN / HSN / SAC requirements, if any.

Nothing in this repository should be read as tax or legal guidance.

---

## Project Status

Only the architecture is frozen; everything below reflects actual implementation state, not intent.

**Backend — complete.** Auth, catalog, customization, cart, checkout, payments, orders, customer account, and admin are implemented and covered by the full must-pass release suite (73/73 unit, 48/48 e2e). Deployed and live on Render, with health checks, error tracking, and automated migrations on every deploy. Production has been seeded with a real catalog (3 categories, 6 products spanning every customization-field type) via a repeatable, idempotent script (`backend/prisma/seed-production.ts`) that goes through the real public/admin API rather than writing to the database directly.

**Frontend — in progress.** Foundation (auth, routing, API client) and catalog browsing are implemented. Customization, cart, checkout, Razorpay integration, order history, customer account, and the admin UI are not yet built.

**Remaining before production launch:** frontend build-out, a live payment and email smoke test, production credentials for Razorpay/Cloudinary/Resend, DNS cutover to `printforge.in`, and email domain authentication (SPF/DKIM/DMARC).

---

## Team

Maintained by the PrintForge engineering team.

---

## License

Proprietary. All rights reserved. This repository and its contents are not licensed for external use, reproduction, or distribution without written permission.

---

<div align="center">

**PrintForge** · Custom printing, engineered like infrastructure.

</div>
