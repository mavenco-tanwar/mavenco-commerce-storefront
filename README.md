# Mavenco Commerce — Multi-Tenant Storefront Engine

**Mavenco Commerce Storefront** is a high-performance, headless, multi-tenant ecommerce storefront designed to dynamically render thousands of merchant stores with custom branding, themes, typography, product catalogs, visual CMS pages, and carts on the fly.

---

## 🚀 Key Features

- **Multi-Tenant Architecture**: Automatically resolves active tenant via custom domain (`brand.com`), subdomain (`brand.ourplatform.com`), or path routing (`/stores/[slug]`).
- **Dynamic Theme Injector**: On-the-fly injection of brand palettes, Google Fonts, border radii, and luxury design tokens.
- **Visual Headless CMS**: Dynamic section rendering for Hero Banners, Lookbooks, Product Carousels, Video, Testimonials, Instagram Feed, and Newsletters.
- **Full Commerce Engine**:
  - Filterable Product Listing Pages (PLP) with facets
  - Product Details Page (PDP) with multi-variant selectors (Size/Color)
  - Multi-Currency Cart & Checkout
  - Customer Account Portal with 5-stage order tracking and GSTIN tax invoices.

---

## 🛠️ Multi-Tenant URL Routing

| Store | Customer Storefront URL | Theme Style |
| :--- | :--- | :--- |
| **JQ Trends** | `/stores/jqtrends` or `jqtrends.com` | Black, Cream, Blush Rose Gold (Fashion) |
| **Aura Living** | `/stores/auraliving` or `auraliving.com` | Forest Green, Sage, Sand (Home Decor) |
| **Apex Athletics** | `/stores/apexathletics` or `apexathletics.com` | Carbon Black, Electric Cyan (Activewear) |

---

## 💻 Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens
- **Icons**: Lucide React
- **Deployment**: Vercel Serverless Edge
