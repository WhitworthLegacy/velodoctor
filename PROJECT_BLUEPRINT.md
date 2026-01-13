# Project Blueprint: VeloDoctor Monorepo

## 1) Repo Overview
- Monorepo layout: `velodoctor-web/` (Next.js App Router) + `velodoctor-admin/` (Vite SPA) + `supabase/` (migrations + edge functions).
- Build/deploy targets:
  - Web: Next.js app in `velodoctor-web/` (scripts in `velodoctor-web/package.json`).
  - Admin: Vite SPA in `velodoctor-admin/` (scripts in `velodoctor-admin/package.json`).
  - Supabase: migrations and edge functions in `supabase/`.
- Runtime split:
  - Public website + booking + shop + API routes run in `velodoctor-web/app/**` and `velodoctor-web/app/api/**`.
  - Backoffice UI runs in `velodoctor-admin/src/**`.
  - Supabase edge function runs in `supabase/functions/stripe-webhook/index.ts`.

## 2) Full Tree (high-level)
- `velodoctor-web/`
  - `app/` (App Router pages + API routes)
    - Pages: `app/page.js`, `app/booking/page.js`, `app/shop/page.js`, `app/shop/[slug]/page.js`, `app/cart/page.js`, `app/checkout/page.js`, `app/blog/page.js`, `app/blog/[slug]/page.js`, `app/services/page.js`, `app/contact/page.js`, `app/zones/page.js`.
    - API routes: `app/api/*` (availability, booking, checkout, google-reviews, admin APIs).
  - `components/` (UI building blocks; see components referenced from pages like `Section`, `Card`, `Button`, `Footer`, `GoogleReviews`).
  - `lib/` (server helpers and data sources: `supabaseServer.ts`, `productsDb.ts`, `products.ts`, `reviews.ts`, `blog.js`, `adminAuth.ts`, `cors.ts`).
  - `app/globals.css`, `tailwind.config.mjs` (design system, brand variables).
- `velodoctor-admin/`
  - `src/App.jsx` (auth gate + routing)
  - `src/lib/` (`supabase.js`, `apiClient.js`, `adminApi.js`, `automation.js`, `constants.js`)
  - `src/modules/` (feature pages: `planning/`, `logistics/`, `crm/`, `admin/`, `inventory/`, `workshop/`, `auth/`)
  - `src/components/` (UI and admin modals)
- `supabase/`
  - `migrations/` (RLS + ecommerce + quotes + booking_requests + stock movement links)
  - `functions/stripe-webhook/` (Stripe webhook handler)

## 3) Tech Stack & Runtimes
- Next.js App Router: `next` 16.1.1 in `velodoctor-web/package.json`.
- React 19: `react` 19.2.x in both apps (`velodoctor-web/package.json`, `velodoctor-admin/package.json`).
- Vite SPA: `velodoctor-admin/package.json` (rolldown-vite override).
- Supabase JS client:
  - Server-side: `velodoctor-web/lib/supabaseServer.ts` uses `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
  - Client-side Auth (admin): `velodoctor-admin/src/lib/supabase.js` uses `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.
- Vercel deployment (implied by scripts + Next.js). No explicit `vercel.json` found.
- Supabase Edge Function: `supabase/functions/stripe-webhook/index.ts` (Deno runtime + Stripe SDK).

## 4) Environments & Secrets
**velodoctor-web (Next.js)**
- `SUPABASE_URL` (required) — `velodoctor-web/lib/supabaseServer.ts`.
- `SUPABASE_SERVICE_ROLE_KEY` (required) — `velodoctor-web/lib/supabaseServer.ts`.
- `GOOGLE_PLACES_API_KEY` (optional) — `velodoctor-web/app/api/google-reviews/route.ts`.
- `GOOGLE_PLACE_ID` (optional) — `velodoctor-web/app/api/google-reviews/route.ts`.
- `RESEND_API_KEY` (optional) — `velodoctor-web/app/api/booking/route.js` (email confirmations).
- `ADMIN_ORIGIN` (optional) — `velodoctor-web/lib/cors.ts` (CORS allow-list).
- **Documented but not referenced in code**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` appears in `velodoctor-web/BOOKING_SYSTEM.md` (used historically for client access, but not referenced in current code).

**velodoctor-admin (Vite)**
- `VITE_API_BASE_URL` (required) — `velodoctor-admin/src/lib/apiClient.js`.
- `VITE_SUPABASE_URL` (required for auth) — `velodoctor-admin/src/lib/supabase.js`.
- `VITE_SUPABASE_ANON_KEY` (required for auth) — `velodoctor-admin/src/lib/supabase.js`.

**Supabase Edge Function (Stripe)**
- `STRIPE_SECRET_KEY` — `supabase/functions/stripe-webhook/index.ts`.
- `STRIPE_WEBHOOK_SECRET` — `supabase/functions/stripe-webhook/index.ts`.
- `SUPABASE_URL` — `supabase/functions/stripe-webhook/index.ts`.
- `SUPABASE_SERVICE_ROLE_KEY` — `supabase/functions/stripe-webhook/index.ts`.

## 5) Database Model (Supabase/Postgres)
**Tables referenced in code**
- `appointments` — booking + admin scheduling (multiple files: `velodoctor-web/app/api/availability/route.js`, `velodoctor-web/app/api/booking/route.js`, `velodoctor-web/app/api/admin/appointments/route.ts`, `velodoctor-web/app/api/admin/appointments/[id]/route.ts`, `velodoctor-web/app/api/admin/appointments/[id]/complete/route.ts`, `velodoctor-web/app/api/admin/clients/[id]/appointments/route.ts`).
- `clients` — CRM + booking + admin (files: `velodoctor-web/app/api/booking/route.js`, `velodoctor-web/app/api/admin/clients/route.ts`, `velodoctor-web/app/api/admin/clients/[id]/route.ts`, `velodoctor-web/app/api/admin/clients/[id]/appointments/route.ts`, `velodoctor-admin/src/modules/inventory/StockMovementModal.jsx`).
- `profiles` — role lookup in admin auth (`velodoctor-web/lib/adminAuth.ts`).
- `crm_columns` — CRM pipeline columns (`velodoctor-web/app/api/admin/crm-columns/route.ts`).
- `interventions` — workshop (`velodoctor-web/app/api/admin/interventions/route.ts`, `velodoctor-admin/src/modules/workshop/*`).
- `vehicles` — joined in admin appointments and interventions (`velodoctor-web/app/api/admin/appointments/route.ts`, `velodoctor-web/app/api/admin/interventions/route.ts`, `velodoctor-admin/src/modules/workshop/*`).
- `inventory_items` — shop + inventory + quotes (`velodoctor-web/lib/productsDb.ts`, `velodoctor-admin/src/modules/inventory/*`, `velodoctor-admin/src/modules/workshop/QuoteItemForm.jsx`).
- `stock_movements` — inventory movements (`velodoctor-admin/src/modules/inventory/StockMovementModal.jsx`).
- `quotes` and `quote_items` — workshop quotes (`velodoctor-admin/src/modules/workshop/QuoteSection.jsx`, `velodoctor-admin/src/modules/workshop/QuoteItemsList.jsx`).
- `products` — shop catalog (`velodoctor-web/lib/productsDb.ts`).
- `orders`, `order_items`, `stripe_events` — ecommerce + Stripe webhook (`supabase/migrations/20260109090003_ecommerce.sql`, `supabase/functions/stripe-webhook/index.ts`).
- Storage bucket `photos` — uploads in workshop UI (`velodoctor-admin/src/modules/workshop/VehicleSheet.jsx`).

**Tables defined in migrations (supabase/migrations)**
- `quotes`, `quote_items` — `supabase/migrations/20260109090001_quotes.sql`.
- `products`, `orders`, `order_items`, `stripe_events` — `supabase/migrations/20260109090003_ecommerce.sql`.
- `booking_requests` — `supabase/migrations/20260109120000_booking_requests.sql` (not referenced in code).
- `stock_movements` link columns and FKs — `supabase/migrations/0260109090002_stock_movements_links.sql`.
- RLS policies and helper functions — `supabase/migrations/20260109091000_rls_staff.sql`.
- Quote recalculation function — `supabase/migrations/20260109092000_quote_recalc.sql`.
- Quote status sync trigger — `supabase/migrations/20260109100000_quote_status_sync.sql`.

**RLS/Policies (from migrations)**
- `public.current_role()` and `public.is_staff()` functions (file: `supabase/migrations/20260109091000_rls_staff.sql`).
- RLS enabled on: `profiles`, `clients`, `vehicles`, `interventions`, `intervention_items`, `appointments`, `inventory_items`, `stock_movements`, `quotes`, `quote_items`, `products`, `orders`, `order_items`, `stripe_events` (same file).

**Canonical vs Legacy**
- Canonical products table: `products` (used by `velodoctor-web/lib/productsDb.ts`). No `shop_products` table referenced in code or migrations.
- Canonical inventory table: `inventory_items` (used across admin and migrations).
- `booking_requests` exists in migrations but not in code (UNKNOWN usage).

## 6) API Surface (Contracts)
**Public API routes (velodoctor-web/app/api)**
- `GET /api/availability` — `velodoctor-web/app/api/availability/route.js`
  - Input: `date=YYYY-MM-DD`, optional `serviceType/service_type`, optional `debug=1`.
  - Output: `{ date, availableSlots, allSlots, debug? }`.
  - Filters: `appointments.status in ['pending','confirmed','in_transit']`.
- `POST /api/booking` — `velodoctor-web/app/api/booking/route.js`
  - Input: JSON `serviceType`, `scheduledAt`, `customerName`, `customerPhone`, etc.
  - Output: `{ success: true, appointment }` (or error).
  - Creates/updates `clients` and `appointments` using service role.
- Optional email send via Resend when `RESEND_API_KEY` is set.
- `GET /api/google-reviews` — `velodoctor-web/app/api/google-reviews/route.ts`
  - Output: `{ source, reviews, averageRating, totalRatings }`.
  - Uses Google Places if env vars exist; falls back to `FALLBACK_REVIEWS`.
- `POST /api/checkout` — `velodoctor-web/app/api/checkout/route.ts`
  - Output: `{ error, message }` with HTTP 503 (Stripe disabled).

**Admin API routes (CORS-enabled, require JWT)**
- `OPTIONS /api/admin/*` — explicit preflight handlers (see per-route files).
- `GET /api/admin/me` — `velodoctor-web/app/api/admin/me/route.ts`
  - Auth: `requireStaff`.
  - Output: `{ userId, role }`.
- `GET /api/admin/appointments` — `velodoctor-web/app/api/admin/appointments/route.ts`
  - Auth: `requireStaff`.
  - Query: `status` or `include_cancelled=true` (default excludes cancelled).
  - Output: `{ appointments: [...] }` (joins `clients`, `vehicles`).
- `GET /api/admin/appointments/:id` — `velodoctor-web/app/api/admin/appointments/[id]/route.ts`
  - Auth: `requireStaff`.
  - Output: `{ appointment }` (joins `clients`).
- `PATCH /api/admin/appointments/:id` — same file
  - Auth: `requireStaff`.
  - Body: `{ status }` (validated against set).
  - Output: `{ success: true }`.
- `DELETE /api/admin/appointments/:id` — same file
  - Auth: `requireAdmin`.
  - Soft delete: sets `status='cancelled'`.
  - Output: `{ success: true }`.
- `POST /api/admin/appointments/:id/complete` — `velodoctor-web/app/api/admin/appointments/[id]/complete/route.ts`
  - Auth: `requireStaff`.
  - Behavior: sets `appointments.status='done'`.
  - Output: `{ success: true }` or errors.
- `GET /api/admin/clients` — `velodoctor-web/app/api/admin/clients/route.ts`
  - Auth: `requireStaff`.
  - Output: `{ clients: [...] }`.
- `POST /api/admin/clients` — same file
  - Auth: `requireStaff`.
  - Output: `{ client }`.
- `GET /api/admin/clients/:id` — `velodoctor-web/app/api/admin/clients/[id]/route.ts`
  - Auth: `requireStaff`.
  - Output: `{ client }`.
- `PATCH /api/admin/clients/:id` — same file
  - Auth: `requireStaff`.
  - Output: `{ client }`.
- `GET /api/admin/clients/:id/appointments` — `velodoctor-web/app/api/admin/clients/[id]/appointments/route.ts`
  - Auth: `requireStaff`.
  - Query: `include_cancelled=true` (default excludes cancelled).
  - Output: `{ appointments: [...] }`.
- `GET /api/admin/interventions` — `velodoctor-web/app/api/admin/interventions/route.ts`
  - Auth: `requireStaff`.
  - Output: `{ interventions: [...] }` (joins `vehicles`, `clients`).
- `GET /api/admin/crm-columns` — `velodoctor-web/app/api/admin/crm-columns/route.ts`
  - Auth: `requireStaff`.
  - Output: `{ columns: [...] }`.

**Known contract pitfall**
- Dynamic route params typing in App Router is currently implemented as `ctx.params: Promise<{id: string}>` in admin APIs (e.g., `velodoctor-web/app/api/admin/appointments/[id]/route.ts`). Keep this consistent across dynamic API routes to avoid Next.js type mismatches.

## 7) Auth & Roles
- Admin login via Supabase Auth: `velodoctor-admin/src/modules/auth/Login.jsx` (email/password).
- JWT passed to web API via `Authorization: Bearer <token>` in `velodoctor-admin/src/lib/apiClient.js`.
- Roles stored in `profiles.role` and enforced in `velodoctor-web/lib/adminAuth.ts` via `requireStaff`/`requireAdmin`.
- Role sets:
  - Staff: `admin`, `super_admin`, `manager`, `dispatch`, `tech`, `driver`, `support`.
  - Admin: `admin`, `super_admin`.
- Failure modes:
  - Missing token ⇒ 401 from `requireStaff`/`requireAdmin`.
  - Missing/incorrect role ⇒ 403.
  - CORS preflight must be handled (use `applyCors` from `velodoctor-web/lib/cors.ts`).

## 8) Core Business Flows (End-to-End)
**Booking → Admin scheduling**
- UI wizard: `velodoctor-web/app/booking/page.js`.
- Availability: `GET /api/availability` (`velodoctor-web/app/api/availability/route.js`).
- Booking creation: `POST /api/booking` (`velodoctor-web/app/api/booking/route.js`) → `clients` + `appointments`.
- Admin visibility:
  - Logistics list: `velodoctor-admin/src/modules/logistics/LogisticsDashboard.jsx` (API `/api/admin/appointments`).
  - Planning calendar: `velodoctor-admin/src/modules/planning/PlanningDashboard.jsx`.
  - CRM/Clients: `velodoctor-admin/src/modules/crm/PipelineBoard.jsx` and `velodoctor-admin/src/modules/admin/ClientList.jsx` (API `/api/admin/clients`).

**Shop → Products → Checkout**
- Product list: `velodoctor-web/app/shop/page.js` → `fetchPublishedProducts()` from `velodoctor-web/lib/productsDb.ts`, fallback to `velodoctor-web/lib/products.ts`.
- Product details: `velodoctor-web/app/shop/[slug]/page.js` → DB first, fallback to local products.
- Checkout API stub: `velodoctor-web/app/api/checkout/route.ts` (disabled).
- Stripe webhook handles paid orders: `supabase/functions/stripe-webhook/index.ts` writes to `orders`, `order_items`, `stock_movements`, `inventory_items`.

**CRM Pipeline**
- Columns: `/api/admin/crm-columns` (table `crm_columns`).
- Leads: `/api/admin/clients` (table `clients` with `crm_stage`).
- Modal: `velodoctor-admin/src/components/admin/CrmCardModal.jsx` with bilingual labels.

**Workshop → Quotes**
- Interventions list: `velodoctor-admin/src/modules/workshop/WorkshopDashboard.jsx` (direct Supabase access; see pitfall below).
- Intervention details: `velodoctor-admin/src/modules/workshop/InterventionDetail.jsx`.
- Quotes: `velodoctor-admin/src/modules/workshop/QuoteSection.jsx`, `QuoteItemsList.jsx`, `QuoteItemForm.jsx`.

## 9) Frontend Modules (Admin)
- **Routing + auth gate**: `velodoctor-admin/src/App.jsx` (Supabase session + role fetch; renders login or app).
- **API client**: `velodoctor-admin/src/lib/apiClient.js` (base URL + JWT + timeout + error throwing).
- **CRM**: `velodoctor-admin/src/modules/crm/PipelineBoard.jsx`, `components/admin/CrmCardModal.jsx`.
- **Clients**: `velodoctor-admin/src/modules/admin/ClientList.jsx` + `components/admin/AdminDetailsModal`.
- **Logistics**: `velodoctor-admin/src/modules/logistics/LogisticsDashboard.jsx`.
- **Planning**: `velodoctor-admin/src/modules/planning/PlanningDashboard.jsx`.
- **Inventory/Workshop**: `velodoctor-admin/src/modules/inventory/*`, `velodoctor-admin/src/modules/workshop/*` (currently direct Supabase access; see pitfall).
- State management: local React state + async effects (no Redux or global store).

**Known pitfall (admin boundary)**
- Some admin modules still query Supabase directly (Inventory + Workshop). This violates the API-only boundary and should be migrated to `/api/admin/**` endpoints for reuse.
  - Examples: `velodoctor-admin/src/modules/inventory/InventoryDashboard.jsx`, `velodoctor-admin/src/modules/workshop/WorkshopDashboard.jsx`.

## 10) Frontend Modules (Web)
- Marketing pages: `velodoctor-web/app/page.js`, `app/services/page.js`, `app/contact/page.js`, `app/zones/page.js`.
- Booking: `velodoctor-web/app/booking/page.js` (4-step wizard, fetches `/api/availability`, posts `/api/booking`).
- Shop: `velodoctor-web/app/shop/page.js`, `app/shop/[slug]/page.js` (DB + fallback products).
- Blog: `velodoctor-web/app/blog/page.js`, `app/blog/[slug]/page.js` with `velodoctor-web/lib/blog.js` static content.
- Reviews: `velodoctor-web/app/api/google-reviews/route.ts` + `velodoctor-web/lib/reviews.ts` fallback.
- Caching:
  - Shop listing uses `noStore` + `dynamic = 'force-dynamic'` (file: `velodoctor-web/app/shop/page.js`).
  - Google reviews API uses `revalidate = 3600` and `Cache-Control` headers (`velodoctor-web/app/api/google-reviews/route.ts`).

## 11) Reusable Template Spec (“Clone Kit”)
**Folders to copy**
- `velodoctor-web/` and `velodoctor-admin/` as separate deployable apps.
- `supabase/migrations/` + `supabase/functions/` for DB + webhook baseline.

**Template placeholders**
- `BUSINESS_NAME` (hero copy, brand text): `velodoctor-web/app/page.js`, `velodoctor-admin/src/components/layout/Navbar.jsx`.
- `BRAND_COLORS` and typography: `velodoctor-web/app/globals.css`, `velodoctor-web/tailwind.config.mjs`.
- `DOMAIN_WEB`, `DOMAIN_ADMIN`: API base URLs + CORS (`velodoctor-admin/src/lib/apiClient.js`, `velodoctor-web/lib/cors.ts`).
- `SERVICE_TYPES`: booking normalization in `velodoctor-web/app/api/availability/route.js` and `velodoctor-web/app/api/booking/route.js`.
- `CONTACT_EMAIL`: content references in pages and footer components (search in `velodoctor-web/components/Footer.js`).

**Reusable modules (generic)**
- Booking + availability API (`velodoctor-web/app/api/availability/route.js`, `velodoctor-web/app/api/booking/route.js`).
- Admin API boundary with `requireStaff/requireAdmin` + CORS (`velodoctor-web/lib/adminAuth.ts`, `velodoctor-web/lib/cors.ts`, `velodoctor-web/app/api/admin/**`).
- Admin UI shell + login + apiFetch (`velodoctor-admin/src/App.jsx`, `velodoctor-admin/src/lib/apiClient.js`).
- CRM pipeline module (`velodoctor-admin/src/modules/crm/*`).

**Business-specific modules**
- Shop product catalog content + copy (`velodoctor-web/lib/products.ts`, `velodoctor-web/app/shop/**`).
- Workshop/Inventory workflows (`velodoctor-admin/src/modules/workshop/*`, `velodoctor-admin/src/modules/inventory/*`).
- Email/SMS workflows (`velodoctor-web/app/api/booking/route.js`, `velodoctor-admin/src/lib/automation.js`).

**Feature toggles (suggested)**
- `ENABLE_SHOP` → show `/shop` and `/cart`.
- `ENABLE_BOOKING` → show `/booking` and booking APIs.
- `ENABLE_CRM` → show CRM module in admin.
- `ENABLE_STOCK` → show inventory module.

## 12) One-Week Build Plan (for 1 project)
**Day 1**
- Copy `velodoctor-web/`, `velodoctor-admin/`, `supabase/` into new repo.
- Set env vars for both apps (see section 4).
- Update branding (colors, logo, domain names).

**Day 2**
- Configure Supabase project + apply migrations in `supabase/migrations/`.
- Create `profiles` roles and test RLS with admin API endpoints.

**Day 3**
- Update booking service types, copy, and emails.
- Verify `/api/availability` and `/api/booking` end-to-end.

**Day 4**
- Shop setup: seed `inventory_items` + `products` (published), check `/shop` and `/shop/[slug]`.
- Confirm Stripe webhook (if needed) or keep `/api/checkout` disabled.

**Day 5**
- Admin setup: configure VITE_API_BASE_URL + Supabase Auth.
- Verify admin routing, `/api/admin/me`, CRM, clients, appointments lists.

**Day 6**
- Migrate remaining direct Supabase admin modules to API-only (inventory/workshop).

**Day 7**
- Smoke tests + deploy on Vercel + edge function verification.

## 13) QA Checklist
- `npm run build` passes in `velodoctor-web/` and `velodoctor-admin/`.
- Admin login works (Supabase Auth) and `/api/admin/me` returns role.
- Admin lists load (CRM, Clients, Logistics, Planning) and no infinite loading states.
- Booking creates `clients` + `appointments` and respects availability rules.
- Soft delete (cancelled) hides appointments from lists by default (`include_cancelled=true` to view).
- CORS works for admin domain (check `ADMIN_ORIGIN`).
- Shop product detail resolves by slug (DB or fallback).
- RLS policies exist and service-role usage is server-side only.

## 14) Appendix: Command Index
**velodoctor-web**
- Install: `npm install` (in `velodoctor-web/`)
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`

**velodoctor-admin**
- Install: `npm install` (in `velodoctor-admin/`)
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

**Supabase**
- Migrations in `supabase/migrations/` (no CLI scripts defined in repo; run via Supabase CLI manually if needed).
