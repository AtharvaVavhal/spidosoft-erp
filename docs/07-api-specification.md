# 07 · API Specification (PROVISIONAL)

> **This is a TECHNICAL PROPOSAL by the development team for the New ERP Implementation. It is
> NOT a Spidosoft requirement.** The Supplied Requirement Material defines no API. The endpoints
> below exist only to support the formal UI behaviour in `05-mapping-functional-flow.md`.
> Anything touching mapping persistence is **BLOCKED** until the questions in
> `04-database-schema.md` §4 are answered.

Status: **PROPOSED** (can be built against the specified tables once the DB is confirmed) ·
**BLOCKED** (needs further database or functional confirmation).

Conventions (TECHNICAL DECISION): REST/JSON under `/api`, Spring Boot backend, consumed through
Axios + TanStack Query. Response fields mirror the database column names exactly. The response
envelope, error format and pagination shape are implemented (§0). Auth is **TO BE CONFIRMED**.

---

## 0. Implemented (Phase 3): TECHNICAL, not a Spidosoft requirement

| Endpoint | Returns |
|---|---|
| `GET /api/system/health` | `{ status: "UP", database: "NOT_CONFIGURED" \| "UP" \| "DOWN" }` |
| `GET /api/system/version` | `{ name, version, buildTime, javaVersion, springBootVersion }` |

**Envelope (all endpoints):** `{ success, data, error, timestamp }`.
- `error` is `{ code, message, violations[{field, message}], path, requestId }`.
- The codes come from backend `ErrorCode`, e.g. `VALIDATION_FAILED`, `NOT_FOUND`,
  `PENDING_CONFIRMATION` (501) and `PERSISTENCE_NOT_CONFIGURED` (503).
- The correlation id is returned in `X-Request-Id`.

**Contracts only:** Java controller *interfaces* and DTOs that mirror the confirmed columns. They
have **no implementation**, so they are neither served (requests return 404) nor listed in OpenAPI
yet. §3 stays blocked. The declared contracts are exactly:

| Interface | Declared operations | Relation to §1–§2 |
|---|---|---|
| `ItemApi` | `GET /api/items?q=&page=&size=` (search) · `POST /api/items` (create) | §2 search/create. `GET/PUT /api/items/{id}` are **not declared**: the Item key is unresolved (C3). |
| `CustomerApi` | `GET /api/customers?q=&page=&size=` · `GET /api/customers/{id}` · `GET /api/customers/options` | `/options` = §1. List and `/{id}` back the read-only Customer list/detail shells (not in §1–§2). |
| `SupplierApi` | `GET /api/suppliers?q=&page=&size=` · `GET /api/suppliers/{id}` · `GET /api/suppliers/options` | `/options` = §1. List and `/{id}` back the read-only Supplier list/detail shells (not in §1–§2). |
| `MappingApi` | none (empty placeholder) | §3 blocked |

`{id}` for Customer/Supplier is the table's `Id` (a single-column PK, CONFIRMED). All of the above
stay PROVISIONAL until Phase 6.

**Large numeric transport (TECHNICAL DECISION, 2026-09-24):** `SupplierMaster.Telephone` is
numeric(18,0). Up to 18 digits exceeds JavaScript's safe-integer range (2^53 − 1, 16 digits), so it
travels as a **JSON string of digits** (e.g. `"Telephone": "987654321098765432"`) in both responses and
requests. The backend keeps it as a `Long` with `@Digits(integer = 18)`, and the frontend types it as
`string | null` and never converts it to a number. The database column type is **unchanged**.
`PinCode` numeric(6,0) and `Mobile` numeric(10,0) fit safely and stay JSON numbers. Covered by
`SupplierTelephoneTransportTest`. The business question in `10` C7 (why Supplier and Customer use
different types, and which formats are valid) stays **TBD**.

## 1. Lookup lists for the mapping drop-downs

### `GET /api/suppliers/options`: PROPOSED
Feeds **Select Code / Select Name** when **Is Supplier** is selected. Reads `dbo.SupplierMaster`.
```json
[ { "Id": 1, "SuppCode": "SMSP0001", "SuppName": "…" } ]
```

### `GET /api/customers/options`: PROPOSED
Feeds the same controls when **Is Customer** is selected. Reads `dbo.CustomerMaster`.
```json
[ { "Id": 2, "CustCode": "SMCX0002", "CustName": "A-One Aluminium Works" } ]
```

TBC for both: filtering (branch, active), sort order, and handling of null codes/names.

Whether **Add** calls the API or only updates on-screen grid state until Save is **TO BE CONFIRMED**.

## 2. Item Master

| Endpoint | Status | Blocking questions |
|---|---|---|
| `GET /api/items/{id}` | BLOCKED | PK semantics (`ID` + `ItemCode` both marked PK) |
| `POST /api/items`, `PUT /api/items/{id}` | BLOCKED | Full field list, required fields, population of `Username`, `LoginBranch`, `SystEmentryDate`, `UserId`, `BranchId` |
| `GET /api/manufacturers/options` | BLOCKED | Table behind `ManufacturerId` unknown |
| Item List (search, pagination, export, print, upload) | BLOCKED | Reference Screenshots not supplied, scope TBC |

## 3. Mapping persistence: BLOCKED

Placeholder only. **No shape is defined until Spidosoft confirms mapping storage and save strategy.**

| Proposed | Purpose | Blocking questions |
|---|---|---|
| `GET /api/items/{itemId}/mappings` | Load an Item's saved rows into the GridView | Mapping table? Keyed by `ID` or `ItemCode`? |
| `PUT /api/items/{itemId}/mappings` | **Save** the grid contents | Save strategy, transaction with the Item save, duplicates, "OR" semantics |
| `DELETE /api/items/{itemId}/mappings/{mappingId}` | Delete a saved mapping | Is Delete immediate or applied on Save? |

## 4. Cross-cutting: TO BE CONFIRMED
Authentication/authorisation, branch scoping (`LoginBranch`/`BranchId`), audit fields, error
format, versioning.
