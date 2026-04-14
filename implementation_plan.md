# Inventory Management System — Implementation Plan

## Overview

Build a **production-ready, multi-tenant Inventory Management System** template that works for any shop/business (grocery, hardware, pharmacy, garment, wholesale, warehouse, etc.). The system supports B2B & B2C workflows, flexible quantity/unit management, and role-based access control.

| Dimension           | Decision                                            |
|---------------------|-----------------------------------------------------|
| **Frontend**        | React 18 + Vite + TypeScript                        |
| **Styling**         | Tailwind CSS v4 + `theme.css` design-token file     |
| **Backend**         | Node.js + Express (JavaScript/ES Modules)           |
| **Database**        | MongoDB (Mongoose ODM)                              |
| **Architecture**    | MVVM (Frontend) · Layered MVC (Backend)             |
| **Multi-tenancy**   | Shared-collection with `orgId` on every document    |
| **Auth**            | JWT (access + refresh tokens) + bcrypt              |
| **State Mgmt**      | React Context + TanStack React Query (data cache)   |
| **Folder Strategy** | Feature-based / domain-grouped                      |

---

## User Review Required

> [!IMPORTANT]
> **Database Choice**: This plan uses **MongoDB** (aligns with your existing BuildItQuick stack). If you prefer PostgreSQL/MySQL, please flag early — it changes the schema layer significantly.

> [!IMPORTANT]
> **Tailwind Version**: Plan assumes **Tailwind CSS v4** with the CSS-first `@theme` directive. If you prefer v3 (config-based), the token approach changes.

> [!WARNING]
> **Scope**: The full plan has **7 phases** spanning ~40+ files. Phases 1–5 deliver a fully usable single-org system. Phases 6–7 add SaaS/multi-shop and advanced features. Recommend building phases sequentially — confirm if you want all phases or a subset initially.

> [!IMPORTANT]
> **TypeScript vs JavaScript (Frontend)**: The plan uses TypeScript for the React frontend for type safety and better DX. The backend remains JavaScript (matching your existing patterns). Confirm this is acceptable.

---

## Proposed Architecture

### MVVM in React (Frontend)

```
View (Component)  ←→  ViewModel (Custom Hook)  ←→  Model (API Service + React Query)
```

- **View**: Pure presentational React components — receive props, render UI, emit events
- **ViewModel**: `useXxxViewModel()` custom hooks — state management, data transformation, business logic
- **Model**: API service modules + React Query hooks — HTTP calls, caching, server state sync

### Layered Architecture (Backend)

```
Route  →  Controller  →  Service  →  Model (Mongoose)
```

- **Route**: Express route definitions + middleware binding
- **Controller**: Request parsing, validation, response formatting
- **Service**: Core business logic, multi-tenant filtering, unit conversion engine
- **Model**: Mongoose schemas with tenant-aware indexes

### Multi-Tenancy Strategy

```
Shared-collection with orgId prefix on every document
Every query auto-filtered by orgId from auth middleware
Compound indexes: { orgId: 1, ... }
```

---

## Project Structure

### Frontend (`/frontend`)

```
frontend/
├── public/
├── src/
│   ├── assets/                      # Static images, icons, fonts
│   ├── components/                  # ── Shared Reusable Components ──
│   │   ├── ui/                      # Atomic UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── layout/                  # Layout shells
│   │   │   ├── AppLayout.tsx        # Main authenticated layout
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── AuthLayout.tsx       # Login/register layout
│   │   └── shared/                  # Composite reusable widgets
│   │       ├── StockBadge.tsx       # Low/ok/out-of-stock indicator
│   │       ├── UnitSelector.tsx     # Unit picker with conversion preview
│   │       ├── PriceDisplay.tsx     # Formatted price with currency
│   │       ├── DataTable.tsx        # Advanced table with sort/filter/pagination
│   │       ├── StatCard.tsx         # KPI dashboard tile
│   │       ├── ChartWrapper.tsx     # Chart container (Recharts)
│   │       └── ExcelImportExport.tsx
│   ├── features/                    # ── Feature Modules (MVVM) ──
│   │   ├── auth/
│   │   │   ├── components/          # LoginForm, RegisterForm
│   │   │   ├── hooks/               # useAuthViewModel.ts
│   │   │   ├── services/            # authApi.ts
│   │   │   └── types/               # auth.types.ts
│   │   ├── dashboard/
│   │   │   ├── components/          # DashboardGrid, KPIRow, RecentActivity
│   │   │   ├── hooks/               # useDashboardViewModel.ts
│   │   │   ├── services/            # dashboardApi.ts
│   │   │   └── types/
│   │   ├── products/
│   │   │   ├── components/          # ProductForm, ProductList, ProductDetail
│   │   │   ├── hooks/               # useProductViewModel.ts, useProductFilters.ts
│   │   │   ├── services/            # productApi.ts
│   │   │   └── types/               # product.types.ts
│   │   ├── categories/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── units/
│   │   │   ├── components/          # UnitManager, ConversionRuleEditor
│   │   │   ├── hooks/               # useUnitViewModel.ts
│   │   │   ├── services/
│   │   │   └── types/               # unit.types.ts
│   │   ├── stock/
│   │   │   ├── components/          # StockLedger, StockAdjustmentForm, StockTransfer
│   │   │   ├── hooks/               # useStockViewModel.ts
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── purchases/
│   │   │   ├── components/          # PurchaseForm, PurchaseList, PurchaseDetail
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── sales/
│   │   │   ├── components/          # SaleForm, SaleList, InvoicePreview
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── suppliers/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── customers/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── reports/
│   │   │   ├── components/          # StockReport, SalesReport, ProfitReport
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── users/
│   │   │   ├── components/          # UserManager, RoleEditor
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── settings/
│   │       ├── components/          # OrgSettings, TaxConfig, SetupWizard
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types/
│   ├── contexts/                    # Global React Contexts
│   │   ├── AuthContext.tsx
│   │   ├── OrgContext.tsx           # Current org/shop context
│   │   └── ThemeContext.tsx
│   ├── hooks/                       # Global shared hooks
│   │   ├── useApi.ts               # Base API hook with auth headers
│   │   ├── useDebounce.ts
│   │   ├── usePermission.ts        # Role-based permission check
│   │   └── useNotification.ts
│   ├── lib/                         # Utilities
│   │   ├── api.ts                  # Axios instance with interceptors
│   │   ├── unitConverter.ts        # Client-side unit conversion helper
│   │   ├── formatters.ts           # Currency, date, number formatters
│   │   ├── validators.ts           # Form validation schemas (Zod)
│   │   └── constants.ts            # App-wide constants
│   ├── pages/                       # Route-level page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── UnitsPage.tsx
│   │   ├── StockPage.tsx
│   │   ├── PurchasesPage.tsx
│   │   ├── SalesPage.tsx
│   │   ├── SuppliersPage.tsx
│   │   ├── CustomersPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── SetupWizardPage.tsx     # First-time org setup
│   ├── router/
│   │   ├── AppRouter.tsx           # React Router config
│   │   └── ProtectedRoute.tsx      # Auth + role guard
│   ├── styles/
│   │   └── theme.css               # ★ Central design token file
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                   # Tailwind directives + theme import
├── tailwind.config.ts               # Minimal — references theme.css tokens
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   ├── env.js                   # Env variable validation
│   │   └── corsOptions.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification + user injection
│   │   ├── tenantScope.js           # Auto-inject orgId into req
│   │   ├── rbac.js                  # Role-based access control
│   │   ├── validate.js              # Request validation (Joi/Zod)
│   │   ├── errorHandler.js          # Global error handler
│   │   └── upload.js                # Multer for file/image uploads
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.model.js        # User schema
│   │   ├── org/
│   │   │   ├── org.routes.js
│   │   │   ├── org.controller.js
│   │   │   ├── org.service.js
│   │   │   └── org.model.js         # Organization/Shop schema
│   │   ├── products/
│   │   │   ├── product.routes.js
│   │   │   ├── product.controller.js
│   │   │   ├── product.service.js
│   │   │   ├── product.model.js
│   │   │   └── variant.model.js     # Product variant schema
│   │   ├── categories/
│   │   │   ├── category.routes.js
│   │   │   ├── category.controller.js
│   │   │   ├── category.service.js
│   │   │   └── category.model.js
│   │   ├── units/
│   │   │   ├── unit.routes.js
│   │   │   ├── unit.controller.js
│   │   │   ├── unit.service.js
│   │   │   └── unit.model.js        # Unit + conversion rules
│   │   ├── stock/
│   │   │   ├── stock.routes.js
│   │   │   ├── stock.controller.js
│   │   │   ├── stock.service.js
│   │   │   ├── stock.model.js       # Current stock
│   │   │   └── stockTransaction.model.js  # Stock ledger
│   │   ├── purchases/
│   │   │   ├── purchase.routes.js
│   │   │   ├── purchase.controller.js
│   │   │   ├── purchase.service.js
│   │   │   ├── purchase.model.js
│   │   │   └── purchaseItem.model.js
│   │   ├── sales/
│   │   │   ├── sale.routes.js
│   │   │   ├── sale.controller.js
│   │   │   ├── sale.service.js
│   │   │   ├── sale.model.js
│   │   │   └── saleItem.model.js
│   │   ├── suppliers/
│   │   │   ├── supplier.routes.js
│   │   │   ├── supplier.controller.js
│   │   │   ├── supplier.service.js
│   │   │   └── supplier.model.js
│   │   ├── customers/
│   │   │   ├── customer.routes.js
│   │   │   ├── customer.controller.js
│   │   │   ├── customer.service.js
│   │   │   └── customer.model.js
│   │   ├── reports/
│   │   │   ├── report.routes.js
│   │   │   ├── report.controller.js
│   │   │   └── report.service.js
│   │   └── settings/
│   │       ├── settings.routes.js
│   │       ├── settings.controller.js
│   │       ├── settings.service.js
│   │       └── settings.model.js    # Org-level settings (tax, currency, etc.)
│   ├── utils/
│   │   ├── unitConverter.js         # ★ Core unit conversion engine
│   │   ├── paginateQuery.js         # Mongoose pagination helper
│   │   ├── generateSku.js           # Auto-SKU generator
│   │   ├── excelHelper.js           # xlsx import/export
│   │   └── logger.js                # Winston/Pino logger
│   ├── seeds/
│   │   ├── defaultUnits.js          # Pre-seed standard units
│   │   └── defaultCategories.js
│   ├── app.js                       # Express app config
│   └── server.js                    # Entry point
├── uploads/                          # Product images, excels
├── .env
├── .env.example
└── package.json
```

---

## Design Token System (`theme.css`)

The single `theme.css` file defines ALL design tokens as CSS custom properties. Tailwind references these tokens, and all components use them consistently.

```css
/* frontend/src/styles/theme.css */

:root {
  /* ── Brand Colors ── */
  --color-primary: #4F46E5;          /* Indigo-600 */
  --color-primary-hover: #4338CA;
  --color-primary-light: #EEF2FF;
  --color-primary-dark: #3730A3;

  --color-secondary: #0EA5E9;        /* Sky-500 */
  --color-secondary-hover: #0284C7;

  --color-accent: #F59E0B;           /* Amber-500 */

  /* ── Semantic Colors ── */
  --color-success: #10B981;
  --color-success-light: #D1FAE5;
  --color-warning: #F59E0B;
  --color-warning-light: #FEF3C7;
  --color-danger: #EF4444;
  --color-danger-light: #FEE2E2;
  --color-info: #3B82F6;
  --color-info-light: #DBEAFE;

  /* ── Neutrals ── */
  --color-bg-page: #F8FAFC;
  --color-bg-card: #FFFFFF;
  --color-bg-sidebar: #1E293B;
  --color-bg-hover: #F1F5F9;
  --color-border: #E2E8F0;
  --color-border-focus: #4F46E5;

  /* ── Text ── */
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;
  --color-text-inverse: #FFFFFF;

  /* ── Stock Status Colors ── */
  --color-stock-ok: #10B981;
  --color-stock-low: #F59E0B;
  --color-stock-out: #EF4444;
  --color-stock-negative: #DC2626;

  /* ── Typography ── */
  --font-family-sans: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* ── Spacing ── */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* ── Border Radius ── */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* ── Shadows ── */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* ── Transitions ── */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;

  /* ── Z-Index Scale ── */
  --z-dropdown: 50;
  --z-sticky: 100;
  --z-modal-backdrop: 200;
  --z-modal: 300;
  --z-toast: 400;

  /* ── Layout ── */
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 72px;
  --topbar-height: 64px;
  --content-max-width: 1440px;
}

/* ── Dark Mode Override ── */
[data-theme="dark"] {
  --color-bg-page: #0F172A;
  --color-bg-card: #1E293B;
  --color-bg-sidebar: #0F172A;
  --color-bg-hover: #334155;
  --color-border: #334155;
  --color-border-focus: #818CF8;

  --color-text-primary: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-text-muted: #64748B;

  --color-primary: #818CF8;
  --color-primary-hover: #6366F1;
  --color-primary-light: #1E1B4B;

  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
}
```

---

## Database Schema Design (MongoDB)

### Core Collections

#### Organization (`organizations`)
```js
{
  _id: ObjectId,
  name: String,                    // "Metro Grocery Store"
  slug: String,                    // "metro-grocery"
  businessType: String,            // "grocery" | "hardware" | "pharmacy" | ...
  address: { street, city, state, zipCode, country },
  phone: String,
  email: String,
  logo: String,                    // URL
  currency: { code: "INR", symbol: "₹" },
  taxConfig: {
    enabled: Boolean,
    defaultRate: Number,           // e.g. 18 (GST %)
    taxLabel: String,              // "GST" | "VAT"
    taxTypes: [{ name, rate }]     // [{ name: "CGST", rate: 9 }, ...]
  },
  settings: {
    allowNegativeStock: Boolean,
    defaultBusinessModel: "B2B" | "B2C" | "BOTH",
    fiscalYearStart: Number,       // Month (1-12)
    invoicePrefix: String,
    purchaseOrderPrefix: String,
  },
  subscription: {
    plan: "free" | "starter" | "pro" | "enterprise",
    expiresAt: Date,
    maxUsers: Number,
    maxProducts: Number,
    maxShops: Number,
  },
  shops: [{                        // Multi-shop support
    _id: ObjectId,
    name: String,
    address: { ... },
    phone: String,
    isDefault: Boolean,
  }],
  status: "active" | "suspended" | "trial",
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: { slug: 1 } unique
```

#### User (`users`)
```js
{
  _id: ObjectId,
  orgId: ObjectId,                  // ★ Tenant key
  name: String,
  email: String,
  phone: String,
  password: String,                 // bcrypt hashed
  role: "super_admin" | "org_admin" | "staff",
  permissions: [String],           // granular: ["products.create", "stock.adjust", ...]
  assignedShops: [ObjectId],       // Which shops this user can access
  avatar: String,
  status: "active" | "inactive",
  lastLogin: Date,
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: { email: 1 } unique, { orgId: 1, role: 1 }
```

#### Category (`categories`)
```js
{
  _id: ObjectId,
  orgId: ObjectId,
  name: String,
  slug: String,
  parentId: ObjectId | null,       // Nested categories
  image: String,
  sortOrder: Number,
  status: "active" | "inactive",
  createdAt: Date,
}
// Indexes: { orgId: 1, slug: 1 } unique, { orgId: 1, parentId: 1 }
```

#### Unit (`units`)
```js
{
  _id: ObjectId,
  orgId: ObjectId,                  // null for system defaults
  name: String,                     // "Kilogram"
  symbol: String,                   // "kg"
  type: "weight" | "volume" | "length" | "count" | "custom",
  baseUnit: String,                 // The base for this type: "g", "ml", "mm", "pcs"
  conversionToBase: Number,         // 1 kg = 1000 g → conversionToBase = 1000
  isBaseUnit: Boolean,              // true if this IS the base unit
  isSystem: Boolean,                // true for pre-seeded units
  status: "active" | "inactive",
}
// Indexes: { orgId: 1, symbol: 1 } unique, { orgId: 1, type: 1 }
```

**Pre-seeded Unit Data:**

| Type    | Unit       | Symbol | Base Unit | Conversion |
|---------|------------|--------|-----------|------------|
| weight  | Gram       | g      | g         | 1          |
| weight  | Kilogram   | kg     | g         | 1000       |
| weight  | Quintal    | qtl    | g         | 100000     |
| weight  | Tonne      | ton    | g         | 1000000    |
| volume  | Milliliter | ml     | ml        | 1          |
| volume  | Liter      | L      | ml        | 1000       |
| length  | Millimeter | mm     | mm        | 1          |
| length  | Centimeter | cm     | mm        | 10         |
| length  | Meter      | m      | mm        | 1000       |
| length  | Feet       | ft     | mm        | 304.8      |
| length  | Inch       | in     | mm        | 25.4       |
| count   | Piece      | pcs    | pcs       | 1          |
| count   | Dozen      | dz     | pcs       | 12         |
| count   | Box        | box    | pcs       | 1*         |
| count   | Pack       | pack   | pcs       | 1*         |
| count   | Pair       | pair   | pcs       | 2          |

\* Box/Pack conversion is set per-product (e.g., 1 box = 24 pcs for beverages, 1 box = 10 pcs for pens).

#### Product (`products`)
```js
{
  _id: ObjectId,
  orgId: ObjectId,
  shopId: ObjectId | null,          // null = available in all shops
  categoryId: ObjectId,
  name: String,
  slug: String,
  sku: String,                      // Auto-generated or manual
  barcode: String,
  brand: String,
  description: String,
  images: [String],

  // ── Unit Configuration ──
  unitType: "weight" | "volume" | "length" | "count",
  baseUnitSymbol: String,           // "g", "ml", "mm", "pcs"
  purchaseUnitSymbol: String,       // "kg" — unit used when buying
  saleUnitSymbol: String,           // "kg" — unit used when selling
  customConversions: [{             // Per-product overrides (e.g., 1 box = 24 pcs)
    unitSymbol: String,
    toBaseMultiplier: Number,
  }],

  // ── Pricing ──
  purchasePrice: Number,            // Per purchase unit
  salePrice: Number,                // Per sale unit
  mrp: Number,                      // Maximum retail price
  taxRate: Number,                   // Override org default if needed
  margin: Number,                    // Calculated field

  // ── Stock Thresholds ──
  minStock: Number,                  // In base unit
  maxStock: Number,                  // In base unit (optional)
  reorderLevel: Number,

  // ── Optional Fields ──
  hasVariants: Boolean,
  batchTracking: Boolean,
  expiryTracking: Boolean,
  supplierId: ObjectId,

  // ── Status ──
  status: "active" | "inactive" | "discontinued",
  tags: [String],
  customFields: Map,                 // Flexible key-value for shop-specific needs

  createdAt: Date,
  updatedAt: Date,
}
// Indexes: { orgId: 1, sku: 1 } unique, { orgId: 1, barcode: 1 },
//          { orgId: 1, categoryId: 1 }, { orgId: 1, name: "text" }
```

#### Product Variant (`productVariants`)
```js
{
  _id: ObjectId,
  orgId: ObjectId,
  productId: ObjectId,
  variantName: String,              // "500g Pack", "1L Bottle"
  sku: String,
  barcode: String,
  unitSymbol: String,
  quantity: Number,                  // How many base units in this variant
  purchasePrice: Number,
  salePrice: Number,
  mrp: Number,
  image: String,
  status: "active" | "inactive",
}
// Indexes: { orgId: 1, productId: 1 }, { orgId: 1, sku: 1 }
```

#### Stock (`stocks`)
```js
{
  _id: ObjectId,
  orgId: ObjectId,
  productId: ObjectId,
  variantId: ObjectId | null,
  shopId: ObjectId,
  baseQuantity: Number,             // ★ Always stored in base unit (g, ml, pcs, mm)
  displayUnit: String,              // Preferred display unit
  lastUpdated: Date,
}
// Indexes: { orgId: 1, productId: 1, shopId: 1 } unique
```

#### Stock Transaction (`stockTransactions`)
```js
{
  _id: ObjectId,
  orgId: ObjectId,
  productId: ObjectId,
  variantId: ObjectId | null,
  shopId: ObjectId,
  type: "purchase" | "sale" | "adjustment" | "damage" | "return" | "transfer_in" | "transfer_out",
  quantity: Number,                  // In the unit specified
  unit: String,                     // "kg", "pcs", etc.
  baseQuantity: Number,             // Converted to base unit (±)
  balanceAfter: Number,             // Running balance in base unit
  referenceType: "purchase" | "sale" | "adjustment" | "transfer",
  referenceId: ObjectId,            // Link to purchase/sale/etc.
  note: String,
  createdBy: ObjectId,
  createdAt: Date,
}
// Indexes: { orgId: 1, productId: 1, createdAt: -1 }, { orgId: 1, type: 1 }
```

#### Purchase (`purchases`)
```js
{
  _id: ObjectId,
  orgId: ObjectId,
  shopId: ObjectId,
  supplierId: ObjectId,
  purchaseNumber: String,           // "PO-2026-0001"
  purchaseDate: Date,
  items: [{
    productId: ObjectId,
    variantId: ObjectId | null,
    productName: String,             // Snapshot at time of purchase
    quantity: Number,
    unit: String,
    baseQuantity: Number,
    costPrice: Number,               // Per unit
    taxRate: Number,
    taxAmount: Number,
    discount: Number,
    total: Number,
  }],
  subtotal: Number,
  taxTotal: Number,
  discountTotal: Number,
  grandTotal: Number,
  paymentStatus: "paid" | "partial" | "unpaid",
  paidAmount: Number,
  dueAmount: Number,
  paymentMethod: String,
  notes: String,
  status: "draft" | "confirmed" | "received" | "cancelled",
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: { orgId: 1, purchaseNumber: 1 } unique, { orgId: 1, supplierId: 1 }
```

#### Sale (`sales`)
```js
{
  _id: ObjectId,
  orgId: ObjectId,
  shopId: ObjectId,
  customerId: ObjectId | null,      // Walk-in customer = null
  invoiceNumber: String,            // "INV-2026-0001"
  saleDate: Date,
  businessModel: "B2B" | "B2C",
  items: [{
    productId: ObjectId,
    variantId: ObjectId | null,
    productName: String,
    quantity: Number,
    unit: String,
    baseQuantity: Number,
    salePrice: Number,
    costPrice: Number,               // For profit calculation
    taxRate: Number,
    taxAmount: Number,
    discount: Number,
    total: Number,
  }],
  subtotal: Number,
  taxTotal: Number,
  discountTotal: Number,
  grandTotal: Number,
  paymentStatus: "paid" | "partial" | "unpaid",
  paidAmount: Number,
  dueAmount: Number,
  paymentMethod: "cash" | "card" | "upi" | "bank_transfer" | "credit",
  notes: String,
  status: "draft" | "confirmed" | "cancelled" | "returned",
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date,
}
// Indexes: { orgId: 1, invoiceNumber: 1 } unique, { orgId: 1, customerId: 1 },
//          { orgId: 1, saleDate: -1 }
```

#### Supplier (`suppliers`)
```js
{
  _id: ObjectId,
  orgId: ObjectId,
  name: String,
  phone: String,
  email: String,
  address: { street, city, state, zipCode },
  gstNumber: String,
  paymentTerms: String,
  totalDue: Number,
  status: "active" | "inactive",
  createdAt: Date,
}
// Indexes: { orgId: 1, name: 1 }
```

#### Customer (`customers`)
```js
{
  _id: ObjectId,
  orgId: ObjectId,
  name: String,
  phone: String,
  email: String,
  address: { street, city, state, zipCode },
  gstNumber: String,                // B2B customers
  type: "B2B" | "B2C",
  creditLimit: Number,
  totalDue: Number,
  status: "active" | "inactive",
  createdAt: Date,
}
// Indexes: { orgId: 1, phone: 1 }, { orgId: 1, type: 1 }
```

---

## Unit Conversion Engine (Core Logic)

This is the **most critical business logic** in the system.

### Backend: `utils/unitConverter.js`

```js
/**
 * Convert quantity from one unit to base unit.
 * @param {number} quantity - The amount in source unit
 * @param {string} fromUnitSymbol - Source unit symbol ("kg")
 * @param {Array} unitDefs - Array of unit definitions from DB
 * @returns {number} quantity in base unit
 */
function toBaseUnit(quantity, fromUnitSymbol, unitDefs) {
  const unit = unitDefs.find(u => u.symbol === fromUnitSymbol);
  if (!unit) throw new Error(`Unknown unit: ${fromUnitSymbol}`);
  return quantity * unit.conversionToBase;
}

/**
 * Convert quantity from base unit to display unit.
 */
function fromBaseUnit(baseQuantity, toUnitSymbol, unitDefs) {
  const unit = unitDefs.find(u => u.symbol === toUnitSymbol);
  if (!unit) throw new Error(`Unknown unit: ${toUnitSymbol}`);
  return baseQuantity / unit.conversionToBase;
}

/**
 * Convert between any two compatible units.
 */
function convert(quantity, fromSymbol, toSymbol, unitDefs) {
  const base = toBaseUnit(quantity, fromSymbol, unitDefs);
  return fromBaseUnit(base, toSymbol, unitDefs);
}

/**
 * Smart display: shows stock in the most readable unit.
 * e.g., 1500g → "1.5 kg", 250ml → "250 ml", 2000mm → "2 m"
 */
function smartDisplay(baseQuantity, unitType, unitDefs) { ... }
```

### Flow Example: Rice Purchase

```
Input:   Buy 5 kg of Rice
Convert: toBaseUnit(5, "kg", units) = 5000 (grams)
Store:   stock.baseQuantity += 5000

Input:   Sell 750 g of Rice
Convert: toBaseUnit(750, "g", units) = 750 (grams)
Store:   stock.baseQuantity -= 750

Display: fromBaseUnit(4250, "kg", units) = 4.25 kg
```

---

## Role-Based Access Control (RBAC)

### Role Hierarchy

| Role          | Scope                | Description                                          |
|---------------|-----------------------|------------------------------------------------------|
| `super_admin` | System-wide          | Platform owner. Can manage all orgs, billing, system settings |
| `org_admin`   | Organization-wide    | Business owner. Full access to their org's data       |
| `staff`       | Assigned shop(s)     | Employee. Limited access based on granted permissions  |

### Permission Matrix

| Module         | `super_admin` | `org_admin` | `staff` (configurable)       |
|----------------|:---:|:---:|:---:|
| Dashboard      | ✅ | ✅ | ✅ (own shop)                 |
| Products       | ✅ | ✅ | view / create / edit          |
| Categories     | ✅ | ✅ | view                          |
| Units          | ✅ | ✅ | view                          |
| Stock          | ✅ | ✅ | view / adjust                 |
| Purchases      | ✅ | ✅ | create / view                 |
| Sales          | ✅ | ✅ | create / view                 |
| Suppliers      | ✅ | ✅ | view                          |
| Customers      | ✅ | ✅ | view / create                 |
| Reports        | ✅ | ✅ | view (limited)                |
| Users & Roles  | ✅ | ✅ | ❌                            |
| Org Settings   | ✅ | ✅ | ❌                            |
| System Admin   | ✅ | ❌ | ❌                            |

### Backend Implementation

```js
// middleware/rbac.js
const permit = (...allowedPermissions) => {
  return (req, res, next) => {
    const { role, permissions } = req.user;
    if (role === 'super_admin') return next();
    if (role === 'org_admin') return next();
    // Staff: check granular permissions
    const hasPermission = allowedPermissions.some(p => permissions.includes(p));
    if (!hasPermission) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
};

// Usage in routes:
router.post('/products', auth, permit('products.create'), productController.create);
router.delete('/products/:id', auth, permit('products.delete'), productController.delete);
```

---

## API Structure

### Base URL: `/api/v1`

| Method | Endpoint                         | Permission               | Description                  |
|--------|----------------------------------|--------------------------|------------------------------|
| **Auth** |
| POST   | `/auth/register`                 | public                   | Register org + admin user    |
| POST   | `/auth/login`                    | public                   | Login                        |
| POST   | `/auth/refresh`                  | public                   | Refresh access token         |
| POST   | `/auth/logout`                   | authenticated            | Logout                       |
| **Organization** |
| GET    | `/org`                           | org_admin+               | Get current org details      |
| PUT    | `/org`                           | org_admin+               | Update org settings          |
| POST   | `/org/setup`                     | org_admin                | Initial setup wizard         |
| **Products** |
| GET    | `/products`                      | staff+                   | List (paginated, filtered)   |
| GET    | `/products/:id`                  | staff+                   | Get detail                   |
| POST   | `/products`                      | products.create          | Create                       |
| PUT    | `/products/:id`                  | products.edit            | Update                       |
| DELETE | `/products/:id`                  | products.delete          | Soft delete                  |
| POST   | `/products/import`               | products.create          | Excel import                 |
| GET    | `/products/export`               | staff+                   | Excel export                 |
| **Categories** |
| GET    | `/categories`                    | staff+                   | List                         |
| POST   | `/categories`                    | org_admin+               | Create                       |
| PUT    | `/categories/:id`                | org_admin+               | Update                       |
| DELETE | `/categories/:id`                | org_admin+               | Delete                       |
| **Units** |
| GET    | `/units`                         | staff+                   | List all units               |
| POST   | `/units`                         | org_admin+               | Create custom unit           |
| GET    | `/units/convert`                 | staff+                   | Convert between units        |
| **Stock** |
| GET    | `/stock`                         | staff+                   | Current stock list           |
| GET    | `/stock/:productId`              | staff+                   | Product stock detail         |
| POST   | `/stock/adjust`                  | stock.adjust             | Manual adjustment            |
| POST   | `/stock/transfer`                | stock.transfer           | Transfer between shops       |
| GET    | `/stock/transactions`            | staff+                   | Stock ledger                 |
| **Purchases** |
| GET    | `/purchases`                     | staff+                   | List                         |
| GET    | `/purchases/:id`                 | staff+                   | Detail                       |
| POST   | `/purchases`                     | purchases.create         | Create + stock in            |
| PUT    | `/purchases/:id`                 | purchases.edit           | Update (draft only)          |
| **Sales** |
| GET    | `/sales`                         | staff+                   | List                         |
| GET    | `/sales/:id`                     | staff+                   | Detail                       |
| POST   | `/sales`                         | sales.create             | Create + stock out           |
| PUT    | `/sales/:id`                     | sales.edit               | Update (draft only)          |
| **Suppliers** |
| GET    | `/suppliers`                     | staff+                   | List                         |
| POST   | `/suppliers`                     | org_admin+               | Create                       |
| PUT    | `/suppliers/:id`                 | org_admin+               | Update                       |
| **Customers** |
| GET    | `/customers`                     | staff+                   | List                         |
| POST   | `/customers`                     | customers.create         | Create                       |
| PUT    | `/customers/:id`                 | org_admin+               | Update                       |
| **Reports** |
| GET    | `/reports/stock`                 | reports.view             | Stock report                 |
| GET    | `/reports/sales`                 | reports.view             | Sales report                 |
| GET    | `/reports/purchases`             | reports.view             | Purchase report              |
| GET    | `/reports/low-stock`             | reports.view             | Low stock alert report       |
| GET    | `/reports/profit`                | org_admin+               | Profit analysis              |
| GET    | `/reports/dashboard`             | staff+                   | Dashboard KPIs               |
| **Users** |
| GET    | `/users`                         | org_admin+               | List org users               |
| POST   | `/users`                         | org_admin+               | Create user                  |
| PUT    | `/users/:id`                     | org_admin+               | Update user/role             |
| DELETE | `/users/:id`                     | org_admin+               | Deactivate user              |

---

## Reusable Component Library

### UI Primitives (components/ui/)

| Component        | Props                                                  | Purpose                         |
|------------------|--------------------------------------------------------|---------------------------------|
| `Button`         | variant, size, loading, disabled, icon, onClick        | All clickable actions           |
| `Input`          | label, type, error, icon, placeholder, onChange        | Text/number/password inputs     |
| `Select`         | label, options, value, onChange, searchable             | Dropdown selection              |
| `Modal`          | isOpen, onClose, title, size, children                 | Dialog/modal overlay            |
| `Table`          | columns, data, sortable, onSort                        | Basic table rendering           |
| `Badge`          | variant (success/warning/danger/info), text            | Status indicators               |
| `Card`           | title, subtitle, actions, children                     | Content container               |
| `Loader`         | size, variant (spinner/skeleton/dots)                  | Loading states                  |
| `Toast`          | message, type, duration                                | Notifications                   |
| `Pagination`     | currentPage, totalPages, onPageChange                  | Page navigation                 |
| `SearchBar`      | value, onChange, placeholder, debounceMs               | Search input with debounce      |
| `FileUpload`     | accept, maxSize, onUpload, preview                     | File/image upload               |
| `ConfirmDialog`  | title, message, onConfirm, onCancel, danger            | Destructive action confirmation |
| `EmptyState`     | icon, title, message, actionLabel, onAction            | "No data" placeholder           |

### Shared Widgets (components/shared/)

| Component          | Purpose                                                  |
|--------------------|----------------------------------------------------------|
| `DataTable`        | Advanced table: server-side pagination, sorting, filtering, column visibility, bulk actions, export |
| `StatCard`         | Dashboard KPI tile with icon, value, trend, sparkline    |
| `StockBadge`       | Color-coded stock level indicator (OK / Low / Out)       |
| `UnitSelector`     | Unit picker dropdown with live conversion preview        |
| `PriceDisplay`     | Formatted price with currency symbol, tax-inclusive toggle |
| `ChartWrapper`     | Recharts container with consistent theming               |
| `ExcelImportExport`| Upload/download Excel with column mapping UI             |

---

## Proposed Changes (Phased)

### Phase 1: Foundation (Week 1-2)

> Project scaffolding, auth system, org setup, theme, and layout.

---

#### Frontend Foundation

##### [NEW] [package.json](file:///c:/Users/RahulArora/Desktop/Inventory%20Mgmt/frontend/package.json)
- Vite + React 18 + TypeScript project
- Dependencies: `react-router-dom`, `axios`, `@tanstack/react-query`, `react-hook-form`, `zod`, `recharts`, `xlsx`, `lucide-react` (icons)
- Dev dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `@types/*`

##### [NEW] [theme.css](file:///c:/Users/RahulArora/Desktop/Inventory%20Mgmt/frontend/src/styles/theme.css)
- Full design token system as documented above
- Light + dark mode token sets
- All spacing, color, typography, shadow, z-index tokens

##### [NEW] [index.css](file:///c:/Users/RahulArora/Desktop/Inventory%20Mgmt/frontend/src/index.css)
- Tailwind directives (`@tailwind base/components/utilities`)
- Import `theme.css`
- Base reset styles using theme tokens

##### [NEW] All UI primitives (`components/ui/`)
- Button, Input, Select, Modal, Table, Badge, Card, Loader, Toast, Pagination, SearchBar, ConfirmDialog, EmptyState

##### [NEW] Layout components (`components/layout/`)
- AppLayout (sidebar + topbar + content area)
- Sidebar (collapsible, role-aware navigation)
- Topbar (search, notifications, user menu)
- AuthLayout (centered card layout for login/register)

##### [NEW] Auth feature (`features/auth/`)
- LoginForm, RegisterForm components
- `useAuthViewModel` hook — login/register/logout logic
- `authApi.ts` — API calls
- `AuthContext.tsx` — global auth state + token management

##### [NEW] Router (`router/`)
- AppRouter with all route definitions
- ProtectedRoute with auth + role guards

---

#### Backend Foundation

##### [NEW] [package.json](file:///c:/Users/RahulArora/Desktop/Inventory%20Mgmt/backend/package.json)
- Dependencies: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`, `multer`, `joi`, `xlsx`, `winston`
- Scripts: `dev` (nodemon), `start`, `seed`

##### [NEW] Config files
- `db.js` — MongoDB connection with retry logic
- `env.js` — Environment variable validation
- `corsOptions.js` — CORS configuration

##### [NEW] Middleware
- `auth.js` — JWT verification, user injection into `req.user`
- `tenantScope.js` — Extract `orgId` from authenticated user, inject into `req.orgId`
- `rbac.js` — Permission checking middleware
- `validate.js` — Request body/query validation
- `errorHandler.js` — Centralized error response formatting

##### [NEW] Auth feature (`features/auth/`)
- User model (Mongoose schema)
- Auth routes, controller, service
- Login, register, refresh token, logout

##### [NEW] Org feature (`features/org/`)
- Organization model
- Org routes, controller, service
- Setup wizard endpoint

##### [NEW] Seeds (`seeds/`)
- Default units seeder
- Default categories seeder

---

### Phase 2: Product Core (Week 2-3)

> Products, categories, units, and the conversion engine.

---

##### [NEW] Unit feature (backend `features/units/`)
- Unit model with conversion rules
- CRUD endpoints
- `/units/convert` — conversion API
- `unitConverter.js` utility

##### [NEW] Category feature (backend `features/categories/`)
- Category model with nested support (parentId)
- CRUD endpoints

##### [NEW] Product feature (backend `features/products/`)
- Product model with unit configuration
- Product variant model
- CRUD with pagination, text search, filtering
- Barcode/SKU generation utility
- Excel import/export endpoints

##### [NEW] Frontend features for units, categories, products
- UnitManager page + components
- CategoryManager page + components
- ProductList, ProductForm, ProductDetail pages
- UnitSelector shared component
- Data filtering/search hooks

---

### Phase 3: Stock Engine (Week 3-4)

> Stock tracking, ledger, adjustments, and alerts.

---

##### [NEW] Stock feature (backend `features/stock/`)
- Stock model (current quantity per product/shop)
- StockTransaction model (ledger)
- Stock service with atomic `$inc` operations
- Auto-conversion to base unit on every transaction
- Low stock alert calculation
- Stock adjustment endpoint (with permission check)
- Stock transfer between shops

##### [NEW] Frontend stock features
- StockLedger component (transaction history table)
- StockAdjustmentForm (manual +/- with reason)
- StockBadge component (color-coded status)
- Low stock alert banner on dashboard

---

### Phase 4: Purchase & Sales (Week 4-6)

> Full purchase and sales workflows with stock integration.

---

##### [NEW] Purchase feature (backend `features/purchases/`)
- Purchase + PurchaseItem models
- Purchase CRUD
- On confirm: auto stock-in via stock service
- Supplier due amount update
- Auto purchase number generation

##### [NEW] Sale feature (backend `features/sales/`)
- Sale + SaleItem models
- Sale CRUD with B2B/B2C flag
- On confirm: auto stock-out via stock service
- Customer due amount update
- Auto invoice number generation
- Profit margin calculation

##### [NEW] Supplier feature (backend `features/suppliers/`)
- Supplier model + CRUD
- Purchase history aggregation

##### [NEW] Customer feature (backend `features/customers/`)
- Customer model + CRUD
- Purchase history + credit tracking

##### [NEW] Frontend for all above
- PurchaseForm (multi-item, unit selector, live total)
- PurchaseList with filters
- SaleForm (quick sale screen + full form)
- SaleList, InvoicePreview
- SupplierManager, CustomerManager pages

---

### Phase 5: Reports & Dashboard (Week 6-7)

> KPI dashboard and comprehensive reporting.

---

##### [NEW] Report feature (backend `features/reports/`)
- Dashboard KPI aggregation (total products, sales today, revenue, low stock count)
- Stock report (current stock with unit-aware display)
- Sales report (by date range, product, category)
- Purchase report (by date range, supplier)
- Profit report (per product, per period)
- Low stock report
- Expiry report (if tracking enabled)
- Monthly summary

##### [NEW] Frontend dashboard & reports
- DashboardPage with StatCards, charts, recent activity
- StockReport, SalesReport, PurchaseReport, ProfitReport pages
- ChartWrapper with Recharts
- Export to Excel from any report
- Date range picker, category/product filters

---

### Phase 6: Advanced Features (Week 7-9)

---

- Multi-shop support (shop switcher, stock per shop, transfers)
- Batch tracking (batch number, manufacturing date)
- Expiry tracking (expiry date, alerts)
- Barcode scanning integration (camera-based)
- PDF invoice generation
- WhatsApp-style alerts (optional)
- Mobile responsive optimization

---

### Phase 7: SaaS Template Hardening (Week 9-10)

---

- Super admin panel (manage all orgs, billing)
- Tenant isolation verification
- Subscription/plan management
- Theme customization per org
- Setup wizard refinement
- Data export/import for org migration
- Rate limiting, security hardening

---

## Open Questions

> [!IMPORTANT]
> **1. MongoDB URI**: Do you want to use the same MongoDB instance as BuildItQuick, or a separate one? Please provide the connection string or confirm a new local DB.

> [!IMPORTANT]
> **2. Starting Phase**: Should I build all 7 phases or start with **Phases 1–5** (fully functional single-org system) and add 6–7 later?

> [!IMPORTANT]
> **3. File Uploads**: Should product images be stored locally (`/uploads`) or do you want S3/Cloudinary integration from the start?

> [!IMPORTANT]
> **4. Excel Library**: Plan uses `xlsx` (SheetJS). Any preference for a different Excel library?

> [!IMPORTANT]
> **5. Chart Library**: Plan uses `Recharts`. Any preference for Chart.js, ApexCharts, or another?

---

## Verification Plan

### Automated Tests

1. **Backend API Tests**: Use Postman/Thunder Client collection to test all endpoints
2. **Unit Conversion Tests**: Dedicated test suite for `unitConverter.js` — all conversion paths
3. **Auth Flow Tests**: Register → Login → Token Refresh → Protected Route → Logout
4. **Stock Transaction Tests**: Purchase → Sale → Adjustment → verify balance
5. **RBAC Tests**: Verify each role can only access permitted endpoints

### Manual Verification

1. **Full workflow test**: Register org → Setup wizard → Add products → Purchase stock → Sell items → Check reports
2. **Unit conversion accuracy**: Buy 5kg rice → Sell 750g → Verify remaining = 4.25 kg
3. **Multi-role test**: Login as admin vs staff — verify UI shows/hides features
4. **Responsive check**: Dashboard and forms on mobile/tablet viewport
5. **Browser testing**: Chrome, Firefox, Edge
6. **Dark mode toggle**: Verify all components respect theme tokens

### Build Verification

```bash
# Frontend
cd frontend && npm run build    # Verify no TypeScript errors
npm run lint                      # ESLint check

# Backend
cd backend && npm start          # Verify clean startup
npm run seed                     # Verify seed data loads
```
