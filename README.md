# Inventory Management System (IMS)

A production-ready, multi-tenant Inventory Management System built for various business types (grocery, hardware, pharmacy, wholesale, etc.). The system supports B2B & B2C workflows, flexible quantity/unit management, role-based access control, barcode scanning, PDF invoice generation, and advanced reports.

## Features

- **Multi-tenant Architecture:** Single deployment supports multiple organizations/shops securely with isolated data.
- **Role-Based Access Control (RBAC):** Super Admin, Org Admin, and Staff roles with granular permissions.
- **Advanced Stock Engine:** Real-time stock tracking, automated base-unit conversions, low-stock alerts, and transfer between shops.
- **Unit Conversion:** Flexible unit definitions (e.g., buy in Boxes, sell in Pieces) with custom conversion ratios.
- **Sales & Purchases:** Complete workflows for incoming stock (Purchases) and outgoing stock (Sales) with automatic ledger updates.
- **Barcode Scanning:** Built-in camera-based barcode scanner for adding products to sales and purchases.
- **Reporting & Dashboard:** Visual KPIs, profit analysis, stock reports, and charts powered by Recharts.
- **Invoicing:** Generate and download PDF invoices, and share summaries via WhatsApp.
- **SaaS Hardened:** Rate limiting, MongoDB sanitization, XSS protection, helmet headers, and dynamic theme customization per organization.

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS v4, TanStack React Query, React Router, Lucide Icons, Recharts.
- **Backend:** Node.js, Express, MongoDB (Mongoose ODM), JSON Web Tokens (JWT) for authentication.

---

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas cluster)

---

## Installation & Setup

### 1. Clone the repository

If you haven't already, navigate to the project directory:
```bash
cd IMS
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Configuration:
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/ims_db  # Or your MongoDB Atlas URI
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=1d
   ```
4. Run Database Seeds (Optional but recommended to populate default units & categories):
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server should now be running on http://localhost:5000*

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Configuration:
   If necessary, configure the API base URL in `src/lib/api.ts`. By default, Vite is usually configured to proxy `/api` requests to the backend, or the Axios instance uses relative paths if served together. Ensure your backend is accessible.
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application should now be accessible at http://localhost:5173*

---

## How to Run in Production

### Backend
For production, avoid using `nodemon`. Instead, use `node` or a process manager like PM2:
```bash
cd backend
npm install --production
npm start
```

### Frontend
Build the frontend for production:
```bash
cd frontend
npm run build
```
This generates optimized static files in the `frontend/dist` directory. You can serve these files using Nginx, Apache, or even statically via the Express backend.

---

## Project Structure Overview

### `/backend`
- `src/features/`: Contains domain-driven modules (`auth`, `org`, `products`, `sales`, `stock`, `reports`, etc.), each encapsulating its own controller, service, routes, and models.
- `src/middleware/`: Security, authentication, RBAC, tenant scoping, and error handling.
- `src/utils/`: Core business logic engines (e.g., `unitConverter.js`) and pagination helpers.

### `/frontend`
- `src/components/`: Reusable UI primitives (Buttons, Modals, Tables) and shared layouts.
- `src/features/`: Mirrors the backend domains, containing feature-specific components, hooks (ViewModels), and API services.
- `src/contexts/`: Global React contexts (`AuthContext`, `OrgContext`).
- `src/pages/`: Route-level page components assembling feature components.
- `src/styles/`: Contains `theme.css` which acts as the central design token file for Tailwind CSS v4.

---

## First-time Usage Guide

1. **Register:** Go to the frontend URL, click "Sign up", and create your first Organization and Super Admin / Org Admin account.
2. **Setup Shop:** Once logged in, navigate to Settings or use the Topbar to ensure a Shop is created and selected.
3. **Configure Units:** Go to the 'Units' page to review base units and standard conversions.
4. **Add Products:** Navigate to 'Products', create items, set unit types, and optionally enable advanced batch/expiry tracking.
5. **Purchase Stock:** Go to 'Purchases' to log incoming inventory. This automatically adjusts the stock ledger.
6. **Make Sales:** Go to 'Sales', add products, and generate a PDF invoice or share via WhatsApp.
7. **Review Reports:** Check the Dashboard and Reports sections for visual insights into gross profit, stock movement, and low-stock alerts.

---

## Security Notes

- **Tenant Isolation:** Every backend query automatically injects the `orgId` scope via the `tenantScope` middleware to prevent data leakage.
- **Data Sanitization:** The Express server uses `helmet` for secure headers, `express-rate-limit` for DDoS protection, and `express-mongo-sanitize` to prevent NoSQL injections.
- **Secrets:** Never commit your `.env` file to version control.

## License
MIT License.
