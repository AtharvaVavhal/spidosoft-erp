<div align="center">
  <img src="https://raw.githubusercontent.com/AtharvaVavhal/spidosoft-erp/main/frontend/public/favicon.svg" width="56" height="56" alt="Spidosoft ERP" />

  # Spidosoft ERP

  ### Enterprise Resource Planning for structured business operations.

  A modular ERP platform being engineered for **Spidosoft Technologies OPC Pvt. Ltd.**

  <p>
    <a href="https://spidosoft-erp-ch48.vercel.app/">
      <img src="https://img.shields.io/badge/🌐_Live_Demo-141414?style=for-the-badge" alt="Live Demo" />
    </a>
    <a href="https://github.com/AtharvaVavhal/spidosoft-erp">
      <img src="https://img.shields.io/badge/⭐_Repository-141414?style=for-the-badge" alt="Repository" />
    </a>
  </p>

  ![Status](https://img.shields.io/badge/status-in%20development-f5a623?style=flat-square)
  ![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
  ![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
  ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)

  <sub>Industrial ERP · Modular Architecture · Master Data · REST APIs · Enterprise Workflows</sub>
</div>

<br/>

## Overview

Spidosoft ERP is an industrial ERP system engineered for **Spidosoft Technologies OPC Pvt. Ltd.** by a Computer Engineering team at **Vishwakarma Institute of Technology, Pune**.

The system centers on a single source of truth for the master data that drives daily operations — items, customers, and suppliers — and the structured relationships between them.

It's built as a **modular monolith**: one cohesively organized backend paired with an independently deployable React frontend, communicating over a REST API. This keeps the codebase easy to reason about while leaving room for new operational modules to be added without disturbing the master-data core.

<br/>

## Snapshot

| | |
|---|---|
| **Industry Partner** | Spidosoft Technologies OPC Pvt. Ltd. |
| **Institution** | VIT Pune |
| **Architecture** | Modular Monolith |
| **Frontend** | React + TypeScript |
| **Backend** | Java + Spring Boot |
| **Database** | MySQL |
| **API** | REST / JSON |
| **Security** | Spring Security + JWT |

> The target architecture above is being introduced incrementally as development progresses — see [Status](#status) for what's running today.

<br/>

## Modules

**Master Data**

| Module | Description |
|---|---|
| Item Master | Structured item records — identity, classification, pricing, specification |
| Customer Master | Centralized customer identity and business records |
| Supplier Master | Centralized supplier identity and business records |
| Item Mapping | Item ↔ Customer and Item ↔ Supplier relationships |

**Operations**

| Module | Description |
|---|---|
| Maintenance / Work Orders | Operational maintenance workflows, defined and iterated on by the engineering team |

```mermaid
flowchart LR
    ERP["Spidosoft ERP"] --> MD["Master Data"]
    ERP --> OPS["Operations"]

    MD --> ITEM["Item"]
    MD --> CUSTOMER["Customer"]
    MD --> SUPPLIER["Supplier"]
    MD --> MAP["Mapping"]
    MAP --> IC["Item ↔ Customer"]
    MAP --> IS["Item ↔ Supplier"]

    OPS --> MAINT["Maintenance"]
    MAINT --> WO["Work Orders"]
```

<br/>

## Architecture

**Target architecture** — the request lifecycle Spidosoft ERP is engineered around.

```mermaid
flowchart TB
    USER["Users"]

    subgraph FRONTEND["Frontend"]
        FE["React + TypeScript"]
        VITE["Vite"]
    end

    subgraph BACKEND["Backend · Java 21"]
        API["REST API"]
        CTRL["Controller"]
        DTO["DTO + Validation"]
        SERVICE["Service"]
        MAPPER["MapStruct"]
        REPO["Repository"]
    end

    DB[("MySQL")]

    USER --> FE
    FE --> API
    API --> CTRL
    CTRL --> DTO
    DTO --> SERVICE
    SERVICE --> MAPPER
    MAPPER --> REPO
    REPO --> DB
```

**Security model**

```mermaid
flowchart LR
    CLIENT["React Client"] --> SECURITY["Spring Security"]
    SECURITY --> JWT["JWT"]
    JWT --> RBAC["RBAC / Permissions"]
    RBAC --> API["Protected REST API"]
```

The system is intentionally a modular monolith — not a microservices architecture — one deployable backend, cleanly separated by module boundaries.

<br/>

## Engineering Principles

- Feature-oriented architecture
- Strong type safety across frontend and backend
- Clear separation of concerns
- API-first design
- Secure boundaries by design
- Reusable, composable UI primitives
- Testable services
- Review-driven Git workflow

<br/>

## Technology Stack

**Frontend**
React · TypeScript · Vite · React Router · TanStack Query · Axios · React Hook Form · Zod · CSS Modules · CSS Variables · Lucide React

**Backend**
Java 21 · Spring Boot · Maven · Spring Data JPA · Hibernate · MapStruct · Jakarta Validation

**Security**
Spring Security · JWT · RBAC / Permissions

**Database**
MySQL · Flyway

**Testing**
JUnit 5 · Mockito · Spring Boot Test · MockMvc · Vitest · React Testing Library · Playwright

**Engineering**
Git · GitHub · GitHub Actions · OpenAPI

> This is the agreed technology baseline for the platform. Entries are adopted as their corresponding modules are implemented — see [Status](#status).

<br/>

## Repository

```
spidosoft-erp/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── styles/
    │   ├── App.tsx
    │   └── main.tsx
    ├── public/
    ├── svg/
    ├── package.json
    └── vite.config.ts
```

The repository is currently in its frontend foundation stage. The backend, database layer, and ERP modules are being introduced incrementally.

<br/>

## Quick Start

```bash
git clone https://github.com/AtharvaVavhal/spidosoft-erp.git
cd spidosoft-erp/frontend
npm install
npm run dev
```

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run typecheck` | Type-check the project |
| `npm run lint` | Lint the codebase |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |

**Live preview:** [spidosoft-erp-ch48.vercel.app](https://spidosoft-erp-ch48.vercel.app/) — the project's current landing experience, while ERP functionality is under active development.

<br/>

## Workflow

```
feature/*  →  Pull Request  →  Code Review  →  develop  →  main
```

Work happens on feature branches off `develop`, validated and reviewed via pull request before merging. Stable changes are periodically promoted from `develop` to `main`.

<br/>

## Team

| Member | Focus |
|---|---|
| Atharva Vavhal | Team Lead · Architecture · Backend · Integration |
| Vedika Mehta | Frontend · UI · Design System |
| Swapnil Pawar | Backend · Database · Persistence |
| Janhavi Waychal | Frontend · QA · Documentation |

**Project Guide:** Prof. Rahul Pawar — Department of Computer Engineering (Software Engineering), VIT Pune

<br/>

## Status

| Area | Status |
|---|---|
| Repository | 🟢 Active |
| Frontend Foundation | 🟢 Active |
| ERP Application Shell | 🟡 Next |
| Backend | 🟡 Planned |
| Database | 🟡 Planned |
| Authentication | 🟡 Planned |
| Master Data | 🟡 In Development |
| Maintenance | 🟡 In Development |
| Testing | ⚪ Planned |
| Production | ⚪ Future |

<br/>

## Roadmap

- [x] Repository foundation
- [x] React + TypeScript frontend
- [x] Landing experience
- [ ] ERP application shell
- [ ] Spring Boot backend
- [ ] MySQL persistence
- [ ] Authentication & RBAC
- [ ] Item Master
- [ ] Customer Master
- [ ] Supplier Master
- [ ] Item Mapping
- [ ] Maintenance / Work Orders
- [ ] Automated testing
- [ ] CI/CD
- [ ] Production deployment

<br/>

## Documentation

Project documentation is being developed alongside implementation.

<br/>

## Security

Target security architecture: Spring Security, JWT authentication, RBAC-based permissions, server-side validation, and environment-based secrets management — introduced as the backend is implemented. No secrets or credentials are stored in this repository.

<br/>

## License

License — TBD

<br/>

---

<div align="center">

**Spidosoft ERP**

Built at Vishwakarma Institute of Technology, Pune
for Spidosoft Technologies OPC Pvt. Ltd.

</div>
