# JQ Trends Storefront — CMS Integration & Architecture Guide

This document details the production integration between the **JQ Trends** fashion storefront and the **Universal Commerce CMS** (`universal-commerce-cms`) backend.

---

## 1. System Architecture

```text
                                  STOREFRONT CLIENT
                        (Next.js App Router / TypeScript / Tailwind)
                                         │
                                         ▼
                            ┌────────────────────────┐
                            │    Frontend API Layer   │
                            │   (src/services/api/)  │
                            └────────────┬───────────┘
                                         │
                                         │ HTTPS REST / Dynamic Tenant Headers
                                         │ (X-Store-ID / X-API-Key / Bearer JWT)
                                         ▼
                            ┌────────────────────────┐
                            │  Universal Commerce    │
                            │      CMS Backend       │
                            │ (http://localhost:4000)│
                            └────────────┬───────────┘
                                         │
                                  Tenant Resolution
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
             Store Apex DB       Store Fashion DB      Store JQ Trends DB
            (Apex Athletics)      (Maison Silk)           (JQ Trends)
```

---

## 2. Multi-Tenant Domain & Header Resolution

The storefront resolves its active tenant dynamically through the CMS endpoint:

`GET /api/v1/storefront/resolve?domain={hostname}&tenant={slug|id}`

### Resolution Cascade:
1. **Hostname / Domain Header**: Matches custom domain (e.g. `jqtrends.com`, `jqtrends.localhost`, `fashion.localhost`).
2. **`X-Store-ID` Header**: Explicitly scoped tenant identifier (e.g. `store_jq_trends`).
3. **Query Parameter**: `?tenant=store_jq_trends` or `?tenant=jq-trends`.
4. **Fallback**: Default configured environment tenant `NEXT_PUBLIC_DEFAULT_TENANT=store_jq_trends`.

---

## 3. Environment Variables

| Variable | Description | Default Development Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_CMS_API_URL` | Base URL of the Universal Commerce CMS API | `http://localhost:4000` |
| `NEXT_PUBLIC_CMS_API_KEY` | Public storefront scoped API key | `pk_live_jq_trends_2026` |
| `NEXT_PUBLIC_DEFAULT_TENANT` | Fallback store identifier | `store_jq_trends` |
| `NEXT_PUBLIC_STORE_DOMAIN` | Local development host | `localhost:3005` |

---

## 4. API Endpoints & Contracts

### 4.1 Tenant & Store Configuration
- **Resolve Store**: `GET /api/v1/storefront/resolve?domain={domain}&tenant={tenant}`
  - Returns store metadata, default currency (`INR`), locale (`en_IN`), theme tokens, and domain status.
- **Store Settings**: `GET /api/v1/settings`
  - Returns contact phone, email (`care@jqtrends.com`), free shipping threshold (₹999), social links, and GST tax rules.

### 4.2 Products & Catalog
- **List Products**: `GET /api/v1/products?page=1&limit=20&sort={sort}&search={query}&category={slug}`
  - Supports server-side pagination, search, category matching, and sorting (`price`, `-price`, `-created_at`).
- **Product Details by Slug**: `GET /api/v1/products/slug/:slug`
  - Returns full product schema with images, options (sizes, colors), and custom fields (fabric, care, fit).
- **Product Details by ID**: `GET /api/v1/products/:id`

### 4.3 Categories & Collections
- **List Categories**: `GET /api/v1/categories`
  - Returns category tree for Women, Kids, Dresses, Kurtis, Co-ords, Tops, Girls Frocks, and Boys Sets.
- **List Collections**: `GET /api/v1/collections`
  - Returns curated studio lookbooks (*Summer Soirée 2026*, *Festive Radiance*, *Little Royals*).

### 4.4 Marketing & Coupons
- **Validate Coupon**: `POST /api/v1/marketing/coupons/validate`
  - Request body: `{ "code": "JQTRENDS10", "subtotal": 1499 }`
  - Response: `{ "data": { "valid": true, "code": "JQTRENDS10", "discountType": "percentage", "discountValue": 10, "discountAmount": 150 } }`

### 4.5 Customer Authentication & Account
- **Customer Login**: `POST /api/v1/auth/customer/login`
  - Request: `{ "email": "aanya.kapoor@example.com", "password": "..." }`
  - Response: `{ "data": { "token": "jwt...", "customer": { "id", "firstName", "lastName", "addresses": [...] } } }`
- **Customer Register**: `POST /api/v1/auth/customer/register`
- **Current Session Profile**: `GET /api/v1/auth/customer/me` (requires `Authorization: Bearer <token>`)
- **Update Customer Profile / Addresses**: `PATCH /api/v1/customers/:id`

### 4.6 Orders & Checkout
- **Create Order**: `POST /api/v1/orders`
  - Request: `{ "items": [...], "email": "...", "shippingAddress": {...}, "grandTotal": 1499, "currency": "INR", "payments": [...] }`
  - Response: `{ "data": { "id": "ord_...", "orderNumber": "JQT-847291", "status": "placed", "timeline": [...] } }`
- **Customer Order History**: `GET /api/v1/customers/me/orders`
- **Order Tracking Details**: `GET /api/v1/orders/:id`

---

## 5. Frontend Service Architecture (`src/services/`)

All UI components interact with the CMS exclusively through centralized services:

```text
src/services/
├── api/
│   ├── client.ts       # Central ApiClient with auto tenant & auth headers, retries & timeout
│   ├── adapters.ts     # Map CMS response models to frontend domain models
│   ├── tenant.ts       # TenantService (hostname & domain resolution)
│   ├── store.ts        # StoreApiService (Store settings & branding loader)
│   ├── products.ts     # ProductApiService (Catalog, filters, search, slug retrieval)
│   ├── categories.ts   # CategoryApiService (Categories & Collections lookbooks)
│   ├── cart.ts         # CartApiService (Totals math & CMS coupon validator)
│   ├── auth.ts         # AuthApiService (Customer login, register, me)
│   ├── customers.ts    # CustomerApiService (Address book persistence)
│   ├── orders.ts       # OrderApiService (Order placement & 5-stage stepper)
│   └── reviews.ts      # ReviewApiService (Customer feedback & verified reviews)
```
