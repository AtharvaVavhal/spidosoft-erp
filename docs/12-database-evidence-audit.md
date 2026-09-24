# Spidosoft ERP — Database Evidence Audit

**Phase:** 4 — Database Confirmation · **Date:** 2026-09-24 · **Type:** forensic audit (read-only)
**Repository state audited:** branch `docs/database-confirmation-questionnaire` @ `7d9eb13`
(`main` @ `411ee11`), working tree clean.

Status labels used throughout:

| Label | Meaning |
|---|---|
| **CONFIRMED** | Directly shown or stated in primary evidence (§2, source P1) |
| **INFERRED** | Strongly suggested by evidence, not stated. Always labelled `INFERRED`. |
| **UNKNOWN** | No reliable evidence exists |
| **CONTRADICTORY** | Two sources disagree (see §6); not reconciled here |

---

## 1. Purpose

Establish, from the evidence actually present in the repository and workspace, what is known about
the database the Spidosoft ERP must use, before any persistence is implemented. This report:
- **records** the evidence
- **classifies** each finding as CONFIRMED / INFERRED / UNKNOWN / CONTRADICTORY
- **identifies** backend blockers and the exact artifacts needed to clear them

It designs nothing, and it creates no entity, SQL, table or migration.

---

## 2. Evidence Sources

### 2.1 Primary evidence: the only first-hand database evidence that exists

| ID | Source | Content | Integrity check |
|---|---|---|---|
| **P1** | `docs/source/Item Master OR Customer And Supplier Master Mapping Problem STMT - ERP APP.docx` (local only, gitignored) | 5 pages; 36 words of text (`docProps/app.xml` Words = 36); 9 embedded PNG images; no SQL, no DDL, no comments, no hyperlinks, no external targets, no embedded objects | MD5 `44b3332dd8ce39fdd9783a658e1d7655`, identical to the file extracted in Phase 1 |
| P1-T | P1 text, verbatim | "11)ItemMaster OR Customer and SupplierMaster Mapping" · "DataBase:-" · "ItemMaster:-" · "CustomerMaster:-" · "SupplierMaster:-" · "Mapping:-" · "#If you click on the add button, the data should be bind in the GridView below." | — |
| P1-E1, E2 | P1 images 1–2 | Object Explorer column list, `dbo.ItemMaster` | — |
| P1-E3, E4 | P1 images 3–4 | Object Explorer column list, `dbo.CustomerMaster` | — |
| P1-E5, E6 | P1 images 5–6 | Object Explorer column list, `dbo.SupplierMaster` | — |
| P1-E7, E8, E9 | P1 images 7–9 | Screenshots of the reference Item Master / mapping screen (UI only) | — |

### 2.2 Secondary evidence: derived from P1, not independent

These documents record analysis of P1. They are cited for traceability, but **they add no new
first-hand database facts.**

| ID | Source | Relevant sections |
|---|---|---|
| S01 | `docs/01-project-overview.md` | L5 (built from scratch), L25–27 (scope), L53 (engine TBD) |
| S02 | `docs/02-requirements.md` | R-4 L38, R-5 L52, R-6 L58; open questions Q-1…Q-15 L83–97 |
| S04 | `docs/04-database-schema.md` | §0 L11, §1 L43, §2 L57, §3 L101, §4 L144, §5 L194, §6 L221 |
| S05 | `docs/05-mapping-functional-flow.md` | Flow L13, steps L41–88 |
| S07 | `docs/07-api-specification.md` | §0 L18, §2 L56–63, §3 L65 |
| S08 | `docs/08-architecture.md` | Backend profiles L155–163; Database L166–169 |
| S09 | `docs/09-implementation-plan.md` | Phase 3 (foundation) L20–36; Phase 4 (Database Confirmation) L38–54; legacy numbering table L92–108 |
| S10 | `docs/10-database-requirements-validation.md` | §2F L25, §2G L50, §2H L67, §2I L85 (C1–C17 at L91–107), §2J L113–213 |
| S11 | `docs/11-spidosoft-database-confirmation.md` | Questions A1 L38 … G2 L439 |
| SCL | `CLAUDE.md` | Database safety rules L107–118 |
| SRM | `README.md` (root; added on GitHub `main` in commits `7bb18a4`…`19922ae`, outside this workflow) | Overview L62–64; Product Scope L89–97; Database L249–294 |

### 2.3 Implementation artifacts inspected (no database evidence)

These were inspected to confirm that they contain no database facts or schema and do not
contradict the evidence.

| Source | Finding |
|---|---|
| `backend/src/main/resources/application.yml`, `application-nodb.yml`, `application-db.yml` | Placeholders only (`${ERP_DB_URL}` …), `ddl-auto: none`; DataSource/JPA disabled by default |
| `backend/pom.xml` | No JDBC driver declared |
| `backend/src/main/java/**` | DTOs mirror the P1 columns; mapping module is placeholder interfaces only; no `@Entity`, `@Table`, repository or SQL |
| `frontend/src/types/*.ts`, `frontend/src/services/**/mock*.ts` | Types mirror the P1 columns; mock data is fictitious |
| `prototypes/visual-validation/**` | Visual prototype; sample data is illustrative, not evidence |

### 2.4 Searches for other database artifacts

| Search | Result |
|---|---|
| Workspace files `*.sql *.bak *.bacpac *.dacpac *.mdf *.ldf *.ndf *.db *.sqlite* *.dump *schema* *ddl* *.xlsx *.csv` (excluding `node_modules`, `target`, `dist`) | **None.** The only `schema`-named files are this project's own `docs/04` and frontend validation helpers. |
| Text search for `CREATE TABLE`, `ALTER TABLE`, `INSERT INTO`, `SELECT … FROM`, `CREATE PROC`, `stored procedure`, `jdbc:` | Only 2 hits, both in this project's docs (S11 L412 asks for a DDL; S04 L203 records its absence). **No SQL exists.** |
| Git history, all branches (`main`, `phase-3-foundation`, `docs/database-confirmation-questionnaire`, remotes) | No SQL, DDL, backup, migration or schema file has ever been committed |

**Evidence sources inspected:**
- 1 primary document: P1, meaning its text plus 9 images
- 12 secondary documents: S01, S02, S04, S05, S07, S08, S09, S10, S11, SCL, SRM, plus `docs/03`/`docs/06` where they refer to the database
- 3 categories of implementation artifacts
- 3 artifact searches

---

## 3. Confirmed Database Facts

Every fact below is read directly from P1.

| # | Fact | Evidence |
|---|---|---|
| F1 | Three tables are shown: `dbo.ItemMaster`, `dbo.CustomerMaster`, `dbo.SupplierMaster` | P1-E1, E3, E5 (tree roots) |
| F2 | All three are in schema `dbo` | P1-E1, E3, E5 |
| F3 | The tables were displayed in an Object Explorer tree, i.e. they existed in *some* database instance when captured | P1-E1–E6 (visual form) |
| F4 | `dbo.ItemMaster` shows 25 columns, `dbo.CustomerMaster` 28, `dbo.SupplierMaster` 27, with names, SQL types and nullability as listed in §8–§10 | P1-E1–E6 |
| F5 | PK markers: `ItemMaster.ID`, `ItemMaster.ItemCode`, `CustomerMaster.Id`, `SupplierMaster.Id` | P1-E1, E3, E5 |
| F6 | FK markers (on the source column only): ItemMaster `SubCategoryId`, `ManufacturerId`, `ColourId`, `UnitId`, `UserId`, `BranchId`, `CategoryId`; CustomerMaster `CustomerTypeId`, `CityId`, `StateId`, `CountryId`, `BranchId`, `LoginUserId`, `ConsigneeId` | P1-E1, E2, E4 |
| F7 | SupplierMaster `supptypeid`, `CountryId`, `StateId`, `CityId`, `BranchId`, `LoginUserId` carry **no** FK marker | P1-E6 |
| F8 | NOT NULL columns are exactly: `ItemMaster.ID`, `ItemMaster.ItemCode`, `CustomerMaster.Id`, `SupplierMaster.Id`. Every other shown column is `null`. | P1-E1–E6 |
| F9 | No shown column in any of the three tables stores a relationship between an Item and a Customer or Supplier | P1-E1–E6 (full column lists) |
| F10 | No status/active/deleted flag and no modification timestamp appear in any of the three tables | P1-E1–E6 |
| F11 | The mapping screen has **Is Supplier / Is Customer** radios, **Select Code**, **Select Name**, **Add**, a GridView (**S.No**, Code, Name, **Action** → **Delete**), **Save** and **Clear** | P1-E7–E9 |
| F12 | Clicking **Add** binds the selected data into the GridView below | P1-T ("#If you click on the add button, the data should be bind in the GridView below.") |
| F13 | No database backup, DDL, schema export, connection detail or SQL has been supplied | §2.4 searches; P1 contents |

---

## 4. Inferred Facts

Each item is an inference, **not** a confirmed fact.

| # | Inference | Basis | Confidence |
|---|---|---|---|
| I1 | **INFERRED:** the engine is Microsoft SQL Server | SSMS-style Object Explorer rendering, `dbo` schema, `varchar(max)` (not valid MySQL) (P1-E1–E6); recorded S04 §1 L47, S10 §2J-6 | Strong, not confirmed |
| I2 | **INFERRED:** `ItemMaster` has one composite PK (`ID`, `ItemCode`) | Both columns carry the PK marker (P1-E1). Object Explorer marks every column of the single PK constraint. The "Keys" folder is collapsed (P1-E2). S04 L89–90 | Medium |
| I3 | **INFERRED:** the three column lists are complete across each pair of screenshots | CustomerMaster/SupplierMaster joins are consistent (`LoginBranch` → `SystEmentryDate`). The ItemMaster join (`UnitId` → `UserId`) has no second table to compare against. S04 L37 | Customer/Supplier: Medium · ItemMaster: Low |
| I4 | **INFERRED:** one Item can hold several Supplier/Customer rows | The section title says "Add … to **List**" and the GridView has an **S.No** column (P1-E7–E9). Only one row is ever shown (P1-E9). | Medium |
| I5 | **INFERRED:** Add changes only on-screen state until Save | A separate **Save** button exists (P1-E7–E9) | Low–Medium |
| I6 | **INFERRED:** customer names are not unique | The reference drop-down lists "A-One Aluminium Works" twice and "ABCDXYZ" four times (P1-E8) | Medium (reference data only) |
| I7 | **INFERRED:** `SystEmentryDate` is an entry/creation timestamp | Column name only | Low |
| I8 | **INFERRED (conditional on I1):** `CustCode`/`SuppCode` (`varchar(max)`) cannot carry a standard UNIQUE index | SQL Server index-key limits; S04 L138 | Conditional |
| I9 | **INFERRED:** customer codes use prefix `SMCX`, supplier codes `SMSP` | Sample values `SMSP0001…0007`, `SMCX0002` (P1-E7, E9) | Pattern only. Not a generation rule. |

---

## 5. Unknowns

No reliable evidence exists for any of the following:

| Area | Unknown |
|---|---|
| A | Engine (see I1), version, database name, hosting |
| B | Whether an existing production/test database exists and is accessible; any DDL/backup; whether the ERP must use the existing database or create a new one |
| C–E | Defaults, identity/auto-increment, unique constraints, check constraints, indexes, collation, FK constraint names, cascade rules; whether any columns exist beyond those shown (I3) |
| F | Identity behaviour of `ItemMaster.ID`, `CustomerMaster.Id`, `SupplierMaster.Id` |
| G | Target table and column of **every** FK marker in F6; whether the unmarked SupplierMaster `…Id` columns (F7) reference anything; the names of all lookup tables |
| H | Whether the screenshot spellings are the actual database identifiers (see C1) |
| I | Business-required fields for Item/Customer/Supplier (DB nullability is known: F8) |
| J | Which of `ID` / `ItemCode` identifies an Item in the application, and whether either is unique on its own |
| K | Whether `CustCode`/`SuppCode` are mandatory or unique; whether mapping references `Id` or Code |
| L | **Mapping storage** (see §11) |
| M–O | Mapping cardinality; duplicate rule; whether one Item may have Suppliers **and** Customers ("OR" semantics) |
| P–S | What Add, Save, Delete and Clear persist and when |
| T | How `Username`, `LoginBranch`, `SystEmentryDate`, `UserId`, `BranchId`, `LoginUserId` are populated; time zone of `datetime` values |
| U | Whether Items, Customers, Suppliers or mappings are branch-scoped, and which column controls it |
| V | Delete policy (physical/soft); whether mapped records may be deleted |
| X | The lookup source for "Manufacturer Name" (UI label, P1-E7) |

---

## 6. Contradictions

None of these is reconciled in this report.

| ID | Topic | Source A | Source B | Conflict | Resolution Status |
|---|---|---|---|---|---|
| C1 | Column spelling | P1-E1, E4, E6: `SystEmentryDate`, `supptypeid` | Database-validation brief (recorded S10 L91): "SystemEntryDate", "SuppTypeId" | Different identifiers | **OPEN.** Repo docs and code use the P1 spelling; awaiting S11 G2 |
| C2 | ItemMaster column list | P1-E1: 25 columns incl. `RawMaterial varchar(50)` | Database-validation brief (recorded S10 L92): 24 columns, no `RawMaterial` | Column omitted in brief | **OPEN** (S11 B3 lists `RawMaterial`; G1/G2 will settle it) |
| C3 | Item key | P1-E1: `ID` **and** `ItemCode` both PK-marked (I2) | S07 L60–61: `GET/PUT /api/items/{id}`; frontend route `/masters/items/:id` uses `ID` (marked TBD in code) | A single-key API vs a possibly composite key | **OPEN** (S11 B1, D4) |
| C4 | Text vs FK duplicates | P1-E1: `Color`+`ColourId`, `UOM`+`UnitId`, `Username`+`UserId`, `LoginBranch`+`BranchId`; P1-E3/E5: `City/State/Country/Branch` + `…Id` | — | Two representations of one attribute | **OPEN** (S11 B4, B5) |
| C5 | Supplier vs Customer FK markers | P1-E4: Customer `CityId…LoginUserId` **FK** | P1-E6: Supplier same-named columns **not FK** | Asymmetric referential integrity | **OPEN** (S11 G1) |
| C6 | Party-type column | P1-E4: `CustomerTypeId` (FK, PascalCase) | P1-E6: `supptypeid` (plain int, lower-case) | Not parallel | **OPEN** (S11 G1, G2) |
| C7 | Contact field types | P1-E3: Customer `PinCode`/`Telephone`/`Mobile` = `varchar(20)` | P1-E5: Supplier = `numeric(6,0)`/`numeric(18,0)`/`numeric(10,0)` | Same attribute, different types | **OPEN** (S11 C2) |
| C8 | Party identifier | P1-E7–E9: UI selects by **Code** and **Name** | P1-E3/E5: `CustCode`/`SuppCode` nullable `varchar(max)`, uniqueness not shown | A code shown as identifier may be NULL or duplicated | **OPEN** (S11 C1, D4) |
| C9 | Selection by name | P1-E8: separate **Select Name** drop-down | P1-E8: duplicate names in the list | Name alone is ambiguous | **OPEN** (S11 D5) |
| C10 | "OR" semantics | P1-T title: "ItemMaster **OR** Customer and SupplierMaster Mapping" | P1-E7/E8: both radio types on one screen; P1-E9: Is Supplier greyed after a Customer row | Exclusive vs combined mapping | **OPEN** (S11 D2) |
| C11 | Mapping storage | P1-E7–E9: **Save** + GridView | P1-E1–E6: no mapping table or linking column | Behaviour with no storage structure | **OPEN, critical** (S11 D1) |
| C12 | Item List columns | `docs/06` §7 / prototype: Status, Last Modified, Item Group, Base Unit | P1-E1/E2: none of these columns exist | UI concepts without DB backing | **OPEN** (deferred, S10 §11) |
| C13 | Entry vs modification time | UI "Last Modified" (prototype) | P1-E1: only `SystEmentryDate` | Different semantics | **OPEN** (S11 F1) |
| C14 | Numeric defaults | P1-E7/E9: UI shows `0` for GST Rate, Purchase Cost | P1-E1: columns nullable, no default shown | 0 vs NULL | **OPEN** (S11 B3) |
| C15 | Item ID generation | Prototype form: "Assigned on save" | P1-E1: identity not shown | Prototype implies IDENTITY | **OPEN** (S11 B1). The prototype is illustrative only. |
| C16 | From-scratch vs existing DB | S01 L5 / SRM L58: "built from scratch" | P1-E1–E6: tables that already exist in some database | Must the ERP use the existing schema/data? | **OPEN** (S11 A2) |
| C17 | Mapping cardinality stated as fact | SRM L63–64: "mapping an Item to one or more Suppliers or Customers" (Overview, unqualified) | SRM L268 ("One Item can likely map to multiple…", *Inferred*); S10 §2F Q1–2 (INFERRED) | README states an inference as fact; it contradicts itself | **RESOLVED (documentation).** Existed at audit time (SRM line numbers refer to the README as audited). Corrected by the Phase 4 README/documentation cleanup: the Overview now describes only the demonstrated Add → GridView workflow and states that cardinality and storage are not confirmed. Evidence still supports only I4. |
| C18 | Read/write access and "save the mapping" stated as confirmed | SRM L91–97 ("Confirmed by the Supplied Requirement Material: … read/write access to `dbo.ItemMaster` … save the mapping") | P1: shows table structures and a Save button; states no access mode and no persistence behaviour | Unsupported "confirmed" claims | **RESOLVED (documentation).** Existed at audit time (SRM line numbers refer to the README as audited). Corrected by the Phase 4 README/documentation cleanup: Product Scope now lists what the material shows (column structures; Add places the entry into the GridView) and states that database access level and mapping persistence are not confirmed. No evidence finding changed. |
| C19 | Phase numbering for database confirmation | S09 (before 2026-09-24): "Phase 2: Database discovery and confirmation"; Phase 5 = "Database integration" | Project instruction: "Phase 4 — Database Confirmation", with Phase 5 to follow | The same activity had two phase numbers | **RESOLVED (naming only).** Numbering standardized to 9 phases in S09 (Phase 4 = Database Confirmation, Phase 5 = Database Persistence; legacy table S09 L92–108). No evidence finding changed. |

C1–C15 are S10's C1–C15. C16 here is S10's C17. S10's C16 (engine wording) is omitted because it recorded no actual conflict. C17–C19 are new in this audit.

---

## 7. Database Object Inventory

Only objects evidenced in P1 are listed.

| Object | Confirmed? | Evidence | Notes |
|---|---|---|---|
| `dbo.ItemMaster` | **CONFIRMED** (shown) | P1-E1, E2 | 25 columns shown. Existence in the target/production DB: UNKNOWN (C16). |
| `dbo.CustomerMaster` | **CONFIRMED** (shown) | P1-E3, E4 | 28 columns shown |
| `dbo.SupplierMaster` | **CONFIRMED** (shown) | P1-E5, E6 | 27 columns shown |
| PK constraint(s) on the three tables | **CONFIRMED** to exist (PK markers) | P1-E1, E3, E5 | Constraint names and composition UNKNOWN. ItemMaster "Keys" folder collapsed (P1-E2). |
| FK constraints on 14 columns (F6) | **CONFIRMED** to exist (FK markers) | P1-E1, E2, E4 | Target tables/columns UNKNOWN |
| Lookup/referenced tables behind the FKs | **UNKNOWN.** Not shown | — | Named only by the FK column names (e.g. `ManufacturerId`). No table name is evidenced. |
| Item ↔ Customer/Supplier mapping table | **UNKNOWN.** Not shown | — | See §11 |
| Stored procedures, views, triggers | **UNKNOWN.** None shown | — | — |

No other database object is evidenced anywhere in the workspace.

---

## 8. ItemMaster Contract

**Source:** P1-E1 (rows 1–20), P1-E2 (rows 21–25), transcribed in S04 §2 L57–99. Types and
nullability are **CONFIRMED** as shown. **Unknown for every column:** default, identity, unique,
check constraint, FK target.

| # | Column (exact) | Type | Null | Key marker | Evidence |
|---|---|---|---|---|---|
| 1 | `ID` | int | NOT NULL | PK | E1 |
| 2 | `ItemCode` | varchar(255) | NOT NULL | PK | E1 |
| 3 | `ItemName` | varchar(max) | NULL | — | E1 |
| 4 | `Material` | varchar(max) | NULL | — | E1 |
| 5 | `ItemType` | varchar(max) | NULL | — | E1 |
| 6 | `ItemSubType` | varchar(max) | NULL | — | E1 |
| 7 | `Color` | varchar(max) | NULL | — | E1 |
| 8 | `UOM` | varchar(255) | NULL | — | E1 |
| 9 | `HSNCODE` | varchar(255) | NULL | — | E1 |
| 10 | `GSTRate` | decimal(20,2) | NULL | — | E1 |
| 11 | `PurchaseCost` | decimal(20,2) | NULL | — | E1 |
| 12 | `SellingPrice` | decimal(20,2) | NULL | — | E1 |
| 13 | `Username` | varchar(max) | NULL | — | E1 |
| 14 | `LoginBranch` | varchar(max) | NULL | — | E1 |
| 15 | `SystEmentryDate` | datetime | NULL | — | E1 |
| 16 | `RawMaterial` | varchar(50) | NULL | — | E1 |
| 17 | `SubCategoryId` | int | NULL | FK | E1 |
| 18 | `ManufacturerId` | int | NULL | FK | E1 |
| 19 | `ColourId` | int | NULL | FK | E1 |
| 20 | `UnitId` | int | NULL | FK | E1 |
| 21 | `UserId` | int | NULL | FK | E2 |
| 22 | `BranchId` | int | NULL | FK | E2 |
| 23 | `CategoryId` | int | NULL | FK | E2 |
| 24 | `DrawingNo` | varchar(50) | NULL | — | E2 |
| 25 | `Specification` | varchar(500) | NULL | — | E2 |

| Contract element | Status |
|---|---|
| Keys | `ID` and `ItemCode` both PK-marked: **CONFIRMED**. Composite PK: **INFERRED** (I2). Uniqueness of either column alone: **UNKNOWN**. |
| Foreign keys | FK markers on 7 columns: **CONFIRMED**. Targets: **UNKNOWN**. |
| Required fields | DB-level NOT NULL = `ID`, `ItemCode`: **CONFIRMED**. Business-required fields: **UNKNOWN**. |
| Identity behaviour | `ID` identity/auto-increment: **UNKNOWN**. `ItemCode` generation: **UNKNOWN**. |
| Completeness | **INFERRED, Low** (I3: continuity between E1 and E2 unverifiable) |

---

## 9. CustomerMaster Contract

**Source:** P1-E3 (rows 1–20), P1-E4 (rows 21–28), transcribed in S04 §3 L101–142.

| # | Column (exact) | Type | Null | Key marker | Evidence |
|---|---|---|---|---|---|
| 1 | `Id` | int | NOT NULL | PK | E3 |
| 2 | `CustCode` | varchar(max) | NULL | — | E3 |
| 3 | `CustName` | varchar(max) | NULL | — | E3 |
| 4 | `ContactPerson` | varchar(max) | NULL | — | E3 |
| 5 | `Branch` | varchar(max) | NULL | — | E3 |
| 6 | `Address1` | varchar(max) | NULL | — | E3 |
| 7 | `Address2` | varchar(max) | NULL | — | E3 |
| 8 | `City` | varchar(max) | NULL | — | E3 |
| 9 | `State` | varchar(max) | NULL | — | E3 |
| 10 | `PinCode` | varchar(20) | NULL | — | E3 |
| 11 | `Country` | varchar(max) | NULL | — | E3 |
| 12 | `EmailID` | varchar(max) | NULL | — | E3 |
| 13 | `Telephone` | varchar(20) | NULL | — | E3 |
| 14 | `Mobile` | varchar(20) | NULL | — | E3 |
| 15 | `Fax` | varchar(max) | NULL | — | E3 |
| 16 | `Website` | varchar(max) | NULL | — | E3 |
| 17 | `GSTIN` | varchar(max) | NULL | — | E3 |
| 18 | `Remarks` | varchar(max) | NULL | — | E3 |
| 19 | `Username` | varchar(max) | NULL | — | E3 |
| 20 | `LoginBranch` | varchar(max) | NULL | — | E3 |
| 21 | `SystEmentryDate` | datetime | NULL | — | E4 |
| 22 | `CustomerTypeId` | int | NULL | FK | E4 |
| 23 | `CityId` | int | NULL | FK | E4 |
| 24 | `StateId` | int | NULL | FK | E4 |
| 25 | `CountryId` | int | NULL | FK | E4 |
| 26 | `BranchId` | int | NULL | FK | E4 |
| 27 | `LoginUserId` | int | NULL | FK | E4 |
| 28 | `ConsigneeId` | int | NULL | FK | E4 |

| Contract element | Status |
|---|---|
| Keys | `Id` PK: **CONFIRMED** |
| Foreign keys | FK markers on 7 columns: **CONFIRMED**. Targets: **UNKNOWN**. |
| Required fields | DB-level NOT NULL = `Id` only: **CONFIRMED**. Business-required: **UNKNOWN**. |
| Identity behaviour | `Id` identity: **UNKNOWN**. `CustCode` mandatory/unique/generated: **UNKNOWN**. |
| Completeness | **INFERRED, Medium** (I3) |

---

## 10. SupplierMaster Contract

**Source:** P1-E5 (rows 1–20), P1-E6 (rows 21–27), transcribed in S04 §4 L144–192.

| # | Column (exact) | Type | Null | Key marker | Evidence |
|---|---|---|---|---|---|
| 1 | `Id` | int | NOT NULL | PK | E5 |
| 2 | `SuppCode` | varchar(max) | NULL | — | E5 |
| 3 | `SuppName` | varchar(max) | NULL | — | E5 |
| 4 | `ContactPerson` | varchar(max) | NULL | — | E5 |
| 5 | `Branch` | varchar(max) | NULL | — | E5 |
| 6 | `Address1` | varchar(max) | NULL | — | E5 |
| 7 | `Address2` | varchar(max) | NULL | — | E5 |
| 8 | `City` | varchar(max) | NULL | — | E5 |
| 9 | `State` | varchar(max) | NULL | — | E5 |
| 10 | `PinCode` | numeric(6,0) | NULL | — | E5 |
| 11 | `Country` | varchar(max) | NULL | — | E5 |
| 12 | `EmailID` | varchar(max) | NULL | — | E5 |
| 13 | `Telephone` | numeric(18,0) | NULL | — | E5 |
| 14 | `Mobile` | numeric(10,0) | NULL | — | E5 |
| 15 | `Fax` | varchar(max) | NULL | — | E5 |
| 16 | `Website` | varchar(max) | NULL | — | E5 |
| 17 | `GSTIN` | varchar(max) | NULL | — | E5 |
| 18 | `Remarks` | varchar(max) | NULL | — | E5 |
| 19 | `Username` | varchar(max) | NULL | — | E5 |
| 20 | `LoginBranch` | varchar(max) | NULL | — | E5 |
| 21 | `SystEmentryDate` | datetime | NULL | — | E6 |
| 22 | `supptypeid` | int | NULL | none shown | E6 |
| 23 | `CountryId` | int | NULL | none shown | E6 |
| 24 | `StateId` | int | NULL | none shown | E6 |
| 25 | `CityId` | int | NULL | none shown | E6 |
| 26 | `BranchId` | int | NULL | none shown | E6 |
| 27 | `LoginUserId` | int | NULL | none shown | E6 |

| Contract element | Status |
|---|---|
| Keys | `Id` PK: **CONFIRMED** |
| Foreign keys | **None shown: CONFIRMED** (F7). Whether the `…Id` columns are references at all: **UNKNOWN**. **Contradicts CustomerMaster's pattern (C5, C6).** |
| Required fields | DB-level NOT NULL = `Id` only: **CONFIRMED**. Business-required: **UNKNOWN**. |
| Identity behaviour | `Id` identity: **UNKNOWN**. `SuppCode` mandatory/unique/generated: **UNKNOWN**. |
| Completeness | **INFERRED, Medium** (I3) |

---

## 11. Mapping Evidence

### What the UI demonstrates (P1-E7, E8, E9, and P1-T)
- **CONFIRMED:** a section titled "Select Type & Add Supplier/Customer to List", with the controls listed in F11.
- **CONFIRMED:** **Add** binds the selected data into the GridView below (P1-T).
- **CONFIRMED:**
  - Supplier options are shown as codes `SMSP0001…0007` (P1-E7).
  - Customer options are shown as names (P1-E8).
  - After Add, the GridView shows `1 | SMCX0002 | A-One Aluminium Works | Delete` (P1-E9).
- **OBSERVED, rule not established:**
  - the selectors reset after Add (P1-E9)
  - Is Supplier appears greyed out after a Customer row exists (P1-E9)
  - Save appears inactive while the grid is empty (P1-E7/E8 vs E9)
- The browser address `localhost:3000/Masters/ItemMasterCo` and the menu label "Item Master JDBC" (P1-E7–E9) are **UI text only**. They identify no table, column, procedure or query.

### What the database evidence demonstrates (P1-E1–E6)

| Looked for | Found |
|---|---|
| A mapping table / junction table | **None** |
| Mapping columns in another table | **None** |
| An `ItemMaster` column storing supplier/customer relationships | **None.** All 25 ItemMaster columns are listed in §8, and none references a Customer or Supplier. |
| A Customer/Supplier column storing item relationships | **None** (§9, §10) |
| A foreign key that could represent the mapping | **None.** The FK markers are all on lookup-style columns (F6); none links the three tables to each other. |
| Stored procedure, query, API behaviour, SQL implementation | **None** anywhere in P1 or the workspace (§2.4) |

### Findings

| Question | Status |
|---|---|
| Is persistence storage identified? | **No: UNKNOWN** |
| Is cardinality identified? | **No: UNKNOWN.** Multiple rows per Item: **INFERRED** (I4) only. |
| Are the identifiers stored by a mapping (Item `ID`/`ItemCode`; Customer `Id`/`CustCode`; Supplier `Id`/`SuppCode`) identified? | **No: UNKNOWN** |
| Is supplier-only / customer-only / both behaviour identified? | **No: UNKNOWN.** Conflicting hints: C10. |
| Are duplicate rules identified? | **No: UNKNOWN** |

> **MAPPING PERSISTENCE STRUCTURE: UNKNOWN**

No structure is proposed or designed in this report.

---

## 12. Backend Implementation Blockers

Only items that prevent **safe** persistence implementation are listed.

| # | Blocker | Why it blocks | Clears with (S11) |
|---|---|---|---|
| B1 | Database engine and version unknown (I1 not confirmed) | JDBC driver, SQL dialect, `varchar(max)`/`numeric` mapping and identity strategy all depend on the engine | A1 |
| B2 | No authoritative schema (DDL/backup/access) | Defaults, identity, constraints, FK targets and exact names cannot be verified. Entities would be guesses. | G1, G2 |
| B3 | Existing vs new database unknown (C16) | Decides whether the ERP maps onto existing data or owns a new schema | A2 |
| B4 | Item key semantics unknown (C3, I2) | Every Item read, update and mapping reference depends on it | B1, D4 |
| B5 | **Mapping persistence structure unknown (C11)** | Save has no storage target | D1 |
| B6 | Mapping cardinality, duplicate rule and "OR" semantics unknown (C10) | Determines the constraints and what Save writes | D2, D3 |
| B7 | Party identifier unknown (C8, C9) | Determines what a mapping row references | C1, D4, D5 |
| B8 | Add/Save/Delete/Clear persistence semantics unknown | Determines transactions and when writes occur | E1–E4 |
| B9 | Exact identifiers unconfirmed (C1, C2) | A single spelling difference breaks mapping to the real columns | G2 |
| B10 | Business-required Item fields and 0-vs-NULL defaults unknown (C14) | Create/update validation cannot be finalised | B3 |
| B11 | FK target (lookup) tables unknown | Item form drop-downs and the FK columns cannot be populated | B4, B5 |
| B12 | Audit-column population unknown (C13) | If the backend must write `Username`, `LoginBranch`, `SystEmentryDate` and user/branch IDs, their source must be known | F1 |
| B13 | Branch scope unknown | Reads and writes may need to be filtered or stamped by branch | F2 |
| B14 | Delete policy unknown | Mapping rows could be left pointing at deleted records | F3 |

**Handling concerns** (not blockers by themselves):
- `SupplierMaster.Telephone` is `numeric(18,0)`, which exceeds JavaScript's safe-integer range (C7). Transport format is TBD (S11 C2).
- `datetime` columns have no time zone (S11 F1).
- If I1 holds, `varchar(max)` code columns cannot be UNIQUE-indexed (I8).

---

## 13. Resolved Questions

This maps the questions in `docs/11` against the current evidence. No question is fully answered by the
evidence yet.

| Q | Topic | Status | Evidence / note |
|---|---|---|---|
| A1 | Engine / version / name | **UNKNOWN** | SQL Server only INFERRED (I1) |
| A2 | Existing vs new database | **CONTRADICTORY** | C16 |
| B1 | Item primary key / ID generation / API reference | **PARTIALLY CONFIRMED** | PK markers on both columns (F5); composition INFERRED (I2); identity UNKNOWN; C3 |
| B2 | ItemCode creation / uniqueness | **UNKNOWN** | NOT NULL only (F8) |
| B3 | Required / optional Item fields; 0 vs NULL | **PARTIALLY CONFIRMED** | DB nullability CONFIRMED (F8); business rules UNKNOWN; C14 |
| B4 | Text vs lookup fields | **PARTIALLY CONFIRMED** | Both columns of each pair exist (§8); authority UNKNOWN (C4) |
| B5 | Lookup tables | **PARTIALLY CONFIRMED** | FK markers CONFIRMED (F6); targets UNKNOWN |
| C1 | CustCode / SuppCode mandatory, unique | **PARTIALLY CONFIRMED** | Nullable `varchar(max)` CONFIRMED; uniqueness UNKNOWN (C8) |
| C2 | Supplier numeric contact fields | **PARTIALLY CONFIRMED** | Types CONFIRMED (§10); handling UNKNOWN; C7 |
| D1 | Mapping storage | **UNKNOWN** | §11. **MAPPING PERSISTENCE STRUCTURE: UNKNOWN** |
| D2 | Cardinality / "OR" | **CONTRADICTORY** | I4 only; C10 |
| D3 | Duplicates / uniqueness / active flag | **UNKNOWN** | — |
| D4 | Identifiers stored by the mapping | **UNKNOWN** | C3, C8 |
| D5 | Select Code / Select Name linkage | **UNKNOWN** | Duplicate names observed (I6); C9 |
| E1 | Add | **PARTIALLY CONFIRMED** | Binds into the GridView: CONFIRMED (F12). Persistence: UNKNOWN (I5). |
| E2 | Save | **UNKNOWN** | Button exists (F11) |
| E3 | Delete | **UNKNOWN** | Button exists (F11) |
| E4 | Clear | **UNKNOWN** | Button exists (F11) |
| F1 | Audit-field population | **PARTIALLY CONFIRMED** | Columns exist (§8–§10); population UNKNOWN; C13 |
| F2 | Branch scope | **PARTIALLY CONFIRMED** | `BranchId`/`LoginBranch`/`Branch` columns exist; scope rule UNKNOWN |
| F3 | Delete policy | **PARTIALLY CONFIRMED** | No deleted/active flag in any table (F10); policy UNKNOWN |
| G1 | Authoritative schema | **UNKNOWN** | Not supplied (F13) |
| G2 | Exact column names | **CONTRADICTORY** | Screenshot spellings CONFIRMED as shown; C1, C2 |

Totals:

| Status | Questions |
|---|---|
| CONFIRMED | 0 |
| PARTIALLY CONFIRMED | 10 |
| UNKNOWN | 10 |
| CONTRADICTORY | 3 |
| **Total** | **23** |

---

## 14. Phase 4 Exit Criteria

Phase 5 — Database Persistence may begin only when **all** of the following are true. Phase numbers
follow the standardized scheme in `docs/09` (C19, resolved).

1. **Engine, version and database name** are confirmed in writing (A1).
2. The **existing vs new database** decision is confirmed (A2).
3. An **authoritative schema** is in hand (DDL, backup or read-only access) and has been verified against §8–§10. It must cover:
   - exact names
   - types, nullability, defaults and identity
   - PK, unique and FK constraints
   - indexes

   (G1, G2)
4. **Item key semantics** are confirmed (B1, B2).
5. **Mapping persistence structure** is identified from an existing object in the schema. If no mapping table exists, a structure must be explicitly approved by Spidosoft in writing (D1).
6. **Mapping rules** are confirmed: cardinality, "OR" semantics, duplicates, and the stored identifiers (D2–D5).
7. **Add/Save/Delete/Clear persistence semantics** are confirmed (E1–E4).
8. **Business-required Item fields and defaults** are confirmed (B3).
9. **Lookup (FK target) tables** are identified for every FK column the Item form uses (B4, B5).
10. **Audit-field population** is confirmed for every audit column the backend must write (F1).
11. **Branch scope and delete policy** are confirmed, or explicitly deferred by the project owner with the impact recorded (F2, F3).
12. **Every contradiction C1–C16** in §6 is resolved or explicitly accepted, and `docs/04` and `docs/10` are updated.
    - C17–C18 are corrections to `README.md` and do not block Phase 5.
    - C19 is resolved (naming only).

---

## 15. Recommended Next Evidence

| # | Artifact | Resolves | Notes |
|---|---|---|---|
| 1 | **Complete DDL / schema script** (`CREATE TABLE …` for `dbo.ItemMaster`, `dbo.CustomerMaster`, `dbo.SupplierMaster`, the mapping table if any, and every FK target table, including PK/UQ/FK/index/default/identity definitions) | B1, B2, B4, B5, B9, B11, C1–C8, C14 | The single most valuable artifact |
| 2 | **Database backup** (structure; data optional), **or** read-only access to a test/UAT copy through an approved secure channel | Same as #1, plus A1, A2 | Alternative to #1 |
| 3 | **Engine and version statement** (e.g. `SELECT @@VERSION` output if the engine is SQL Server, or the equivalent) | B1 | Only needed if not in #1/#2 |
| 4 | **The existing mapping table's definition**, or written confirmation that none exists | B5 | The critical blocker |
| 5 | **The existing application's save logic for this screen:** stored procedure, SQL statements or source code behind the reference screen (`localhost:3000/Masters/ItemMasterCo`) | B5–B8 | Shows exactly what Add/Save/Delete persist |
| 6 | **Sample rows** (non-sensitive or masked) from the three tables and the mapping table | B6, B7, C8, C9 | Demonstrates real code uniqueness and cardinality |
| 7 | **Lookup table definitions** (category, sub-category, manufacturer, colour, unit, user, branch; customer type, city, state, country, consignee) | B11 | Covered by #1 if complete |
| 8 | **Written answers to `docs/11`** (sections B–F) for business rules no schema can show | B3, B8, B10, B12–B14 | Required even with #1/#2 |
| 9 | **Uncropped Object Explorer screenshots** of the ItemMaster "Keys" folder and the E1/E2 join | I2, I3 | Only if #1/#2 cannot be supplied |

This report recommends evidence only. It does not prescribe an implementation for any missing
item.
