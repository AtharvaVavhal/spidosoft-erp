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

**Contracts only:** the endpoints in §1–§2 exist as Java controller *interfaces* (`ItemApi`,
`CustomerApi`, `SupplierApi`) and DTOs that mirror the confirmed columns. They have **no
implementation**, so they are neither served nor listed in OpenAPI yet. §3 stays blocked.

**Open contract question:** `SupplierMaster.Telephone` is numeric(18,0), which exceeds JavaScript's
safe-integer range. Whether large numerics travel as JSON strings is **TBD** (`10` C7).

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
