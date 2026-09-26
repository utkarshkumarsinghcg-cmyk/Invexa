# 📦 Invexa — Next-Gen Multi-Warehouse Inventory Management System

<div align="center">

![Invexa Banner](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80)

**A high-performance, real-time enterprise inventory management platform designed for multi-warehouse operations, atomic inventory ledgers, and end-to-end supply chain transparency.**

[![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Modern_UI-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Test_Suite-52%20Passed-success?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

</div>

---

## 🌟 Executive Summary

**Invexa** replaces error-prone spreadsheets and fragmented paper logs with a synchronized, real-time inventory ledger system. Built on an enterprise-grade atomic ledger architecture, Invexa guarantees data integrity across concurrent transactions (Receipts, Deliveries, Inter-Warehouse Transfers, and Physical Stock Adjustments).

With **Role-Based Access Control (RBAC)**, Invexa provides dedicated dashboards and permissions for **Inventory Managers** (holistic control, master data management, manager-scoped staff management, and system-wide analytics) and **Warehouse Staff** (warehouse-scoped task execution, quick scanning, and stock intake/dispatch).

---

## 🚀 Key Highlights & Architectural Innovations

- 🔒 **Stateless JWT Security & RBAC**: Secure authentication with Bcrypt hashing, role scoping (`Inventory Manager` vs `Warehouse Staff`), and rate limiting.
- ⚡ **Atomic Double-Entry Ledger**: Every stock change creates an immutable audit trail (`Ledger`) linked to a physical warehouse location, preventing negative stock race conditions.
- 🏢 **Multi-Warehouse Isolation**: Strict warehouse scoping prevents unauthorized cross-facility access while enabling smooth inter-warehouse transfer workflows.
- 👥 **Manager-Scoped Staff Management**: Managers can provision, update passwords, activate/deactivate, and oversee only their assigned staff operators.
- 📊 **Real-Time Analytics & Reorder Alerts**: Automatic calculation of total inventory valuation, SKU health metrics, turnover rates, and proactive low-stock threshold triggers.
- 🔄 **Comprehensive Transaction Workflows**:
  - **Receipts (Inbound)**: Supplier PO intake, batch verification, and warehouse shelf putaway.
  - **Deliveries (Outbound)**: Customer order picking, validation, and shipment dispatch.
  - **Internal Transfers**: Multi-step warehouse-to-warehouse stock transit and receipt confirmation.
  - **Stock Adjustments**: Audit-logged discrepancy handling (Damage, Loss, Shrinkage, Recount).

---

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, Recharts |
| **Backend** | Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Bcrypt.js, Express Rate Limit |
| **Database** | MongoDB Atlas (Replica Set with Document-Level Locking & Indexes) |
| **Testing** | Jest, Supertest (52 passing unit & integration test suites) |
| **Build & Tooling** | ESLint, PostCSS, Autoprefixer, Git |

---

## 📁 Repository Structure

```
Invexa/
├── Backend/                     # Node.js & Express API Server
│   ├── src/
│   │   ├── config/              # MongoDB Connection & Environment Loader
│   │   ├── errors/              # Standardized API Error Definitions
│   │   ├── middleware/          # JWT Authentication & Warehouse Scoping
│   │   ├── models/              # Mongoose Schemas (User, Product, Ledger, Warehouse, etc.)
│   │   ├── routes/              # Modular API Endpoints (Auth, Products, Staff, Transfers, etc.)
│   │   ├── services/            # QuantOps (Atomic Ledger Engine), Password Utils
│   │   └── server.js            # Express Server Bootstrap & Graceful Shutdown
│   ├── tests/                   # Complete Jest Integration & Unit Test Suite
│   └── package.json
│
├── Frontent/                    # React + Vite + TypeScript Client
│   ├── src/
│   │   ├── components/          # Reusable UI Components, Modals & Navigation
│   │   │   ├── modals/          # Create Product, Add Staff, Stock Transfer Modals
│   │   │   └── views/           # Dedicated Dashboard, Products, Ledger, Staff Views
│   │   ├── context/             # Global Application & Authentication State
│   │   ├── services/            # Axios / Fetch API Service Integrations
│   │   ├── types/               # Strict TypeScript Interfaces & Type Models
│   │   ├── App.tsx              # Main Root Component & Routing Logic
│   │   └── main.tsx             # React DOM Mounting
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB Atlas** connection string (or local MongoDB daemon)

### 2. Clone Repository
```bash
git clone https://github.com/sahilchaudhari32/Invexa.git
cd Invexa
```

### 3. Backend Setup
```bash
cd Backend
npm install

# Create environment configuration
cp .env.example .env  # Or create .env with the following variables:
```

Configure your `Backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/invexa?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_2026
NODE_ENV=development
```

Start the backend server:
```bash
npm start
# Server will run on http://localhost:5000
```

Run test suites:
```bash
npm test
```

### 4. Frontend Setup
```bash
cd ../Frontent
npm install

# Start the Vite development server
npm run dev
# Frontend will run on http://localhost:5173 (or assigned port)
```

---

## 🔐 API Reference Overview

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate user via Email or Login ID and issue JWT.
- `POST /api/auth/signup` — Manager registration.
- `POST /api/auth/first-admin` — Initial bootstrap setup for the primary administrator.
- `GET /api/auth/me` — Retrieve currently authenticated user profile.

### Inventory & Products (`/api/products`)
- `GET /api/products` — Retrieve paginated, searchable, warehouse-filtered product catalogue.
- `POST /api/products` — Create new SKU / Master Product entry.
- `GET /api/products/:id` — Get SKU details, location breakdown, and transaction history.
- `PUT /api/products/:id` — Update product metadata and reorder thresholds.

### Ledger & Transactions (`/api/ledger`, `/api/transfers`)
- `GET /api/ledger` — Immutable double-entry audit history.
- `POST /api/transfers` — Initiate inter-warehouse transfer with reserved quantity.
- `POST /api/transfers/:id/receive` — Confirm incoming transfer at destination facility.
- `POST /api/adjustments` — Record physical stock count variance with audit reason.

### Staff Management (`/api/staff`)
- `GET /api/staff` — List staff operators (scoped to requesting manager).
- `POST /api/staff` — Provision new warehouse staff member with password and warehouse assignment.
- `PUT /api/staff/:id` — Update staff credentials, assigned warehouse, or role status.
- `PATCH /api/staff/:id/toggle-status` — Quick toggle between Active, On Leave, and Inactive.

---

## 🧪 Testing & Code Quality

Invexa includes an automated Jest integration and unit test suite covering auth flows, warehouse isolation, atomic quant operations, concurrent updates, and staff management:

```bash
cd Backend
npm test
```

```
 PASS  tests/staff.test.js
 PASS  tests/auth.test.js
 PASS  tests/masterData.test.js
 PASS  tests/inventory.test.js
 PASS  tests/warehouseScope.test.js

Test Suites: 5 passed, 5 total
Tests:       52 passed, 52 total
Snapshots:   0 total
Time:        7.977 s
```

---

## 🛡️ Security

1. **Password Security**: Bcrypt with adaptive salt rounds; plain text passwords are never stored or logged.
2. **Access Scoping**: Token-based warehouse assertions on all state-mutating requests prevent cross-tenant data leakage.
3. **Atomic Concurrency**: Mongoose atomic operations (`$inc`, conditional updates) eliminate double-spend and race conditions in stock movements.
4. **Input Sanitization & Validation**: Strict regex and type validations across all incoming request payloads.

---

## 👥 Authors & Acknowledgments

- **Team Invexa** — *Hackathon Edition*
- Developers: [Sahil Chaudhari](https://github.com/sahilchaudhari32), [Utkarsh Kumar Singh](https://github.com/utkarshkumarsinghcg-cmyk), [Deepak Kumar](https://github.com/Kumar-Deepak-DEV), [Aditya Kumar](https://github.com/Kumar-Aditya-DEV)

---
