# Spidosoft ERP

A modular Enterprise Resource Planning (ERP) system being built for **Spidosoft Technologies OPC Pvt. Ltd.**, developed as an industrial project by Computer Engineering students of **Vishwakarma Institute of Technology (VIT), Pune**.

![Status](https://img.shields.io/badge/status-early--development-yellow)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript%20%2B%20Vite-61DAFB)
![License](https://img.shields.io/badge/license-TBD-lightgrey)

## Live Demo

The current deployed build is a landing/status page for the project:

🔗 **https://spidosoft-erp-ch48.vercel.app/**

> This deployment currently shows a placeholder "coming soon" page. It does **not** yet reflect ERP functionality — that is under active development. See [Project Status](#project-status) below.

---

## Overview

Spidosoft ERP is a modular ERP application intended to support core enterprise/business operations for Spidosoft Technologies, including centralized master-data management, structured business workflows, and secure, role-based access to business data. The system is designed as a **modular monolith**: a single deployable backend organized into clean, independent modules, paired with a decoupled React/TypeScript frontend.

This repository represents both an **industrial software project** for Spidosoft Technologies and an **academic project** submitted under the Department of Computer Engineering (Software Engineering), VIT Pune, for the 2026–27 academic year.

**This README reflects the actual state of the repository at the time of writing** (see [Project Status](#project-status)). Sections describing planned architecture, modules, or technologies that are not yet implemented in code are explicitly labeled **Planned / Architecture Decision**.

---

## Objectives

* Provide centralized, structured master-data management (Items, Customers, Suppliers)
* Support relational data modelling with clear, maintainable schemas
* Establish a modular, maintainable separation between frontend and backend
* Implement secure, role-based API access
* Build a foundation that can be extended with further ERP modules over time

---

## Key Features

> Features are grouped by their current state. See [Functional Scope](#functional-scope) for full detail.

| Feature | Status |
|---|---|
| Landing / status page | ✅ Implemented |
| Project technology baseline (frontend) | ✅ Implemented |
| Item Master | 🟡 Planned |
| Customer Master | 🟡 Planned |
| Supplier Master | 🟡 Planned |
| Item ↔ Customer / Supplier Mapping | 🟡 Planned |
| Maintenance / Work Orders module | 🟡 Planned |
| Backend (Spring Boot API) | 🟡 Planned |
| Authentication (JWT) & RBAC | 🟡 Planned |
| Database schema (MySQL / Flyway) | 🟡 Planned |

---

## Functional Scope

The functional scope below is derived from the confirmed company reference document for Spidosoft Technologies. **None of these modules currently exist in the repository's code** — they define the target scope of the project, not delivered functionality.

### Item Master (Planned)
Master data for items, including:
* Item Code, Item Name
* Material, Item Type, Item SubType, Color
* UOM (Unit of Measure)
* HSN/SAC Code, GST Rate
* Purchase Cost, Selling Price
* Drawing No., Specification

### Customer Master (Planned)
Master data for customers, including:
* Customer Code, Customer Name, Contact Person
* Address, City, State, Country, PIN Code
* Email, Telephone, Mobile
* GSTIN, Website

### Supplier Master (Planned)
Master data for suppliers, mirroring the corresponding Customer Master fields for supplier business and contact information.

### Item Mapping (Planned)
A workflow linking Items to Customers/Suppliers:

```
Item → Select Customer/Supplier → Add → Display mapping in GridView/table
```

This establishes:
* Item ↔ Customer mapping
* Item ↔ Supplier mapping

### Maintenance / Work Orders Module (Under Specification)
A Maintenance/Work Orders module is part of the **current development specification**. Unlike the Item/Customer/Supplier scope above, its detailed fields and workflows are **not** derived from the original company reference document and are not yet confirmed by repository documentation. Treat this module's requirements as in-progress rather than finalized.

The only Maintenance-related artifact currently in the repository is a **frontend placeholder screen** (`MaintenancePage`) used as a "site under construction" splash page for the live deployment — this is a UI placeholder, not an implementation of the ERP Maintenance/Work Orders business workflow.

---

## Architecture

Spidosoft ERP is designed as a **modular monolith** — a single backend service organized into cohesive, independent modules — paired with a separate single-page frontend application. This is an architectural decision for the target system; the backend itself does not yet exist in the repository.

**High-level request flow (Planned / Architecture Decision):**

```
Users
  ↓
React + TypeScript
  ↓
REST API
  ↓
Spring Boot
  ↓
Controller
  ↓
DTO + Validation
  ↓
Service
  ↓
Mapper
  ↓
Repository
  ↓
Spring Data JPA / Hibernate
  ↓
MySQL
```

**Security flow (Planned / Architecture Decision):**

```
React
  ↓
Spring Security
  ↓
JWT Authentication
  ↓
RBAC / Permissions
  ↓
Protected REST APIs
```

The system is **not** built as a microservices architecture, and no message queues, caching layers, container orchestration, or cloud infrastructure are part of the current design.

---

## Technology Stack

Technologies are labeled **Implemented** only where confirmed by inspecting the repository (`frontend/package.json` and source). Everything else reflects the agreed technology baseline for the project and is labeled **Planned / Architecture Decision**.

### Frontend

| Technology | Status |
|---|---|
| React 19 | ✅ Implemented |
| TypeScript | ✅ Implemented |
| Vite | ✅ Implemented |
| CSS Modules | ✅ Implemented |
| CSS Variables (design tokens) | ✅ Implemented |
| oxlint (linting) | ✅ Implemented |
| React Router | 🟡 Planned |
| TanStack Query | 🟡 Planned |
| Axios | 🟡 Planned |
| React Hook Form | 🟡 Planned |
| Zod | 🟡 Planned |
| Lucide React | 🟡 Planned |

### Backend (Planned / Architecture Decision — not yet present in the repository)

* Java 21
* Spring Boot
* Maven
* REST API / JSON
* Spring Data JPA, Hibernate
* MapStruct
* Jakarta Bean Validation
* Spring Security, JWT Authentication
* RBAC / Permissions
* SLF4J / Logback

### Database (Planned / Architecture Decision)

* MySQL
* Flyway (schema migrations)

### Testing (Planned / Architecture Decision)

* JUnit 5, Mockito, Spring Boot Test, MockMvc (backend)
* Vitest, React Testing Library, Playwright (frontend)

> No test runner, test files, or test scripts currently exist in the repository.

### Development / DevOps

| Technology | Status |
|---|---|
| Git / GitHub | ✅ In use |
| GitHub Actions (CI/CD) | 🟡 Planned — no workflow files currently exist |

### API Documentation (Planned / Architecture Decision)

* OpenAPI / Swagger — to be added once the backend is implemented

---

## Repository Structure

This reflects the **actual, current** contents of the repository:

```
spidosoft-erp/
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── components/
    │   │   ├── MaintenancePage.tsx
    │   │   └── MaintenancePage.module.css
    │   ├── styles/
    │   │   └── tokens.css
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── svg/                    # Brand/logo assets
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
    ├── .oxlintrc.json
    └── README.md
```

There is currently **no** `backend/`, `docs/`, root-level `.gitignore`, or `LICENSE` file in the repository. These will be added as the corresponding parts of the project are implemented.

### Planned frontend feature structure (Planned / Architecture Decision)

As ERP modules are implemented, the frontend is intended to move to a feature-based organization:

```
frontend/
└── src/
    ├── features/
    │   ├── maintenance/
    │   ├── item-master/
    │   ├── customer-master/
    │   ├── supplier-master/
    │   └── mapping/
    ├── components/
    ├── layouts/
    ├── services/
    ├── hooks/
    ├── types/
    └── utils/
```

### Planned backend structure (Planned / Architecture Decision)

```
backend/
└── src/
    └── main/
        └── java/
            ├── controller/   # REST endpoints — request/response handling
            ├── service/      # Business logic
            ├── repository/   # Spring Data JPA interfaces
            ├── entity/       # JPA entities mapped to MySQL tables
            ├── dto/          # Request/response data transfer objects
            ├── mapper/       # MapStruct entity ↔ DTO mapping
            ├── exception/    # Centralized exception handling
            └── config/       # Security, CORS, and application configuration
```

Exact package paths will be documented once the backend module is created.

---

## Getting Started

### Prerequisites

For the current state of the repository (frontend only):

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (a recent LTS release; the project uses Vite 8 and TypeScript 6, which require a current Node.js version)
* npm (bundled with Node.js)

The following will be required once the backend is added (Planned):

* Java 21 (JDK)
* Maven
* MySQL

### Clone the Repository

```bash
git clone https://github.com/AtharvaVavhal/spidosoft-erp.git
cd spidosoft-erp
```

### Frontend Setup

Commands below are taken directly from `frontend/package.json`.

```bash
cd frontend
npm install

# Start the development server
npm run dev

# Type-check the project
npm run typecheck

# Lint the project (oxlint)
npm run lint

# Production build
npm run build

# Preview the production build locally
npm run preview
```

### Backend Setup (Planned)

A `backend/` module does not yet exist in this repository. Once added, it is expected to be a standard Maven-based Spring Boot application runnable via:

```bash
./mvnw spring-boot:run
```

This section will be updated with exact instructions once the backend is implemented.

### Database Setup (Planned)

Database setup instructions will be added once MySQL schema/entities and Flyway migrations are implemented in the repository. No schema currently exists.

---

## Environment Configuration

No environment variable files (`.env`, `application.yml`, etc.) currently exist in the repository. The variables below reflect the **planned** configuration for the backend and are illustrative only — do not treat these as final or as real credentials.

```env
# Example only — planned variables, to be finalized once the backend is implemented
DATABASE_URL=
DATABASE_USERNAME=
DATABASE_PASSWORD=
JWT_SECRET=
```

Real credentials and secrets must never be committed to this repository or documented in the README.

---

## API Documentation

No backend or API currently exists in the repository. Once the Spring Boot backend is implemented, API documentation is planned to be exposed via **springdoc-openapi / Swagger UI**, typically at a local URL such as:

```
http://localhost:8080/swagger-ui.html
```

This section will be updated with the actual configured path and real endpoint documentation once the backend exists.

---

## Authentication & Authorization

Authentication and authorization are **planned**, not yet implemented:

* **Spring Security** for request-level protection
* **JWT** for stateless authentication
* **RBAC (Role-Based Access Control)** for permission-scoped access to modules and endpoints
* Password hashing and input validation on all secured endpoints
* All business/master-data endpoints intended to sit behind protected routes

No authentication code currently exists in the repository.

---

## Testing

No test tooling, test scripts, or test files currently exist in the repository. The following is the **planned** testing strategy:

**Frontend (Planned)**
```bash
npm run typecheck   # type checking (already available)
npm run lint        # linting (already available)
# vitest / React Testing Library for unit & component tests (planned)
# Playwright for E2E tests (planned)
```

**Backend (Planned)**
```bash
# Once the Maven backend exists:
mvn test
```
Using JUnit 5, Mockito, Spring Boot Test, and MockMvc for unit and integration tests.

---

## Git Workflow

```
main
  ↑
develop
  ↑
feature/*
```

Recommended process:

1. Create a feature branch from `develop`.
2. Implement the feature.
3. Run all relevant tests and checks locally.
4. Commit meaningful, scoped changes.
5. Push the branch.
6. Open a Pull Request into `develop`.
7. Request review from a team member.
8. Merge into `develop` after approval.
9. Periodically release stable, tested changes from `develop` into `main`.

Direct pushes to `main` are discouraged.

---

## Team

| Member | Responsibility |
|---|---|
| Atharva Vavhal | Team Lead, Architecture, Backend & Integration |
| Vedika Mehta | Frontend, UI & Design System |
| Swapnil Pawar | Backend, Database & Persistence |
| Janhavi Waychal | Frontend Workflows, QA & Documentation |

These reflect development responsibilities within the project team and are not ERP system authorization roles.

---

## Project Status

**Status: Early Development**

Verified as of this README:

* ✅ Repository initialized, with Git history and a live Vercel deployment
* ✅ Frontend technology baseline selected and scaffolded (React, TypeScript, Vite, CSS Modules, CSS Variables, oxlint)
* ✅ A placeholder landing/status page is live at the [live demo](#live-demo) URL
* 🟡 Backend (Spring Boot) not yet present in the repository
* 🟡 Database schema, migrations, and persistence layer not yet implemented
* 🟡 Authentication and RBAC not yet implemented
* 🟡 Item Master, Customer Master, Supplier Master, and Item Mapping modules are defined in project requirements but not yet coded
* 🟡 Maintenance/Work Orders module is under active specification; only a UI placeholder screen exists today
* 🟡 No automated tests or CI/CD workflows currently exist

This project has **not** been deployed to production for real business use, and no claims of live enterprise adoption are made.

---

## Roadmap

- [x] Project repository initialized
- [x] Frontend technology baseline selected
- [x] Placeholder landing page deployed
- [ ] Backend project scaffold (Spring Boot, Maven)
- [ ] Database schema & Flyway migrations
- [ ] Authentication (JWT) and RBAC
- [ ] Item Master module
- [ ] Customer Master module
- [ ] Supplier Master module
- [ ] Item ↔ Customer/Supplier Mapping
- [ ] Maintenance / Work Orders module
- [ ] Automated testing (frontend & backend)
- [ ] API documentation (OpenAPI/Swagger)
- [ ] CI/CD via GitHub Actions
- [ ] Deployment pipeline for backend + database

---

## Documentation

No `docs/` directory or supplementary documentation files (architecture notes, requirements documents, database design, technical decision records, or project synopsis) currently exist in the repository. Links to such documents will be added here once they are committed.

---

## Contributing

This is currently a closed academic/industrial team project developed by the team listed above. External contributions are not being accepted at this stage. Team members should follow the [Git Workflow](#git-workflow) described above for all changes.

---

## Security

* No secrets, credentials, API keys, or private configuration values are stored in this repository or in this README.
* Planned security controls include Spring Security, JWT-based authentication, RBAC, password hashing, and server-side input validation on all endpoints.
* If you discover a security concern in this repository, please raise it directly with the project maintainers rather than filing a public issue.

---

## License

**TBD** — a license has not yet been selected for this repository.

---

## Acknowledgements

* **Spidosoft Technologies OPC Pvt. Ltd.** — project sponsor and functional requirements owner
* **Vishwakarma Institute of Technology (VIT), Pune** — Department of Computer Engineering (Software Engineering), Academic Year 2026–27
