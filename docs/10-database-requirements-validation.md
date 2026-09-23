# 10 · Database & Requirements Validation Report (Phase 2)

**Date:** 2026-09-23 · **Status:** Phase 2 findings recorded. Awaiting Spidosoft decisions.
**Inputs reviewed:** `CLAUDE.md`, `docs/01–09`, and `docs/source/Item Master OR Customer And Supplier Master Mapping Problem STMT - ERP APP.docx`
(re-extracted in full: 36 words of text, 9 images; no SQL, comments, alt text, hyperlinks or
embedded objects).
**Column-level detail:** `04-database-schema.md` (evidence IDs E1–E9, T1 are defined there).

Classification used throughout:
- **CONFIRMED**: stated in the requirement text or read directly from the schema screenshots
- **INFERRED**: a reasoned reading of the evidence, not stated
- **TBD**: unknown

The Reference UI (E7–E9) and the visual prototype are **not** evidence of database structure. Where
the UI hints at behaviour, it is at most INFERRED.

> No entities, repositories, services, controllers, migrations or Spring Boot project were created
> in this phase.

---

## Phase 2F: Mapping business rules

| # | Question | Answer | Class | Evidence |
|---|---|---|---|---|
| 1 | Can one Item map to multiple Suppliers? | Likely yes: "Add … to **List**", and the GridView has S.No | INFERRED | E7–E9 |
| 2 | Can one Item map to multiple Customers? | Likely yes (same reasoning) | INFERRED | E8, E9 |
| 3 | Can one Item map to both Suppliers and Customers? | Unknown. The title says "OR". E9 shows Is Supplier greyed out once a Customer row exists, which hints at one type per Item, but no rule is stated. | **TBD** | T1, E9 |
| 4 | Can duplicate mappings exist? | Not stated | **TBD** | – |
| 5 | What uniquely identifies a Supplier? | `SupplierMaster.Id` is the PK, so it is unique by definition. `SuppCode` is nullable varchar(max) with no uniqueness shown. | `Id`: CONFIRMED (PK). Business identifier: **TBD** | E5 |
| 6 | What uniquely identifies a Customer? | `CustomerMaster.Id` is the PK. `CustCode` is the same as `SuppCode`. | `Id`: CONFIRMED (PK). Business identifier: **TBD** | E3 |
| 7 | Is Code globally unique? | Not shown. If the engine is SQL Server, varchar(max) can't carry a UNIQUE index. | **TBD** | E3, E5 |
| 8 | Is Name unique? | Probably not: the reference data lists "A-One Aluminium Works" twice and "ABCDXYZ" four times | INFERRED (not unique) | E8 |
| 9 | Is Code ↔ Name one-to-one? | Not stated. Duplicate names mean a Name can't identify a single Code. | **TBD** (INFERRED: Name → Code is not 1:1) | E8 |
| 10 | Does selecting Code auto-select Name? | Not shown | **TBD** | – |
| 11 | Does selecting Name auto-select Code? | Not shown | **TBD** | – |
| 12 | What does Add persist? | The text only says Add **binds the data into the GridView** | Binding: CONFIRMED. Persistence: **TBD** | T1 |
| 13 | Does Add only change client-side GridView state? | Likely, because a separate Save button exists | INFERRED | E7–E9 |
| 14 | Does Save persist the whole mapping set? | Not stated | **TBD** | – |
| 15 | Does Clear clear only the GridView, or the whole form? | Not stated | **TBD** | – |
| 16 | Does Delete persist immediately, or only remove a pending row? | Not stated | **TBD** | – |

**The only CONFIRMED behaviour rule:** clicking **Add** binds the selected Supplier/Customer into the
GridView below (T1), and the screen has the controls Is Supplier / Is Customer, Select Code, Select
Name, Add, a GridView (S.No, Code, Name, Action/Delete), Save and Clear (E7–E9).

## Phase 2G: Item List questions

| Question | Finding | Class |
|---|---|---|
| Is Status in ItemMaster? | **No.** There is no status/active/inactive column. | CONFIRMED absent (subject to §0 completeness in `04`) |
| Is there another status table? | None shown | **TBD** |
| Is "Last Modified" represented by another column? | No modification column exists. `SystEmentryDate` is the only timestamp. | CONFIRMED (no modified column); mapping **TBD** |
| Is `SystEmentryDate` only creation/entry time? | The name suggests "system entry date". Whether it is updated on edit is unknown. | INFERRED (entry time), **TBD** |
| Is Item Group equivalent to Category? | Unknown. Candidates: `CategoryId`, `SubCategoryId`, `ItemType`, `ItemSubType`. | **TBD** |
| Is Base Unit equivalent to UOM? | Unknown | **TBD** |
| Is `UnitId` an FK to a Unit master? | `UnitId` is marked FK (CONFIRMED). The target table is not shown. | FK: CONFIRMED. Target: **TBD** |
| Is `UOM` stored text, derived, or legacy? | It is a stored `varchar(255)` column (CONFIRMED). Its role relative to `UnitId` is unknown. | **TBD** |
| `CategoryId` / `SubCategoryId` | Both marked FK, with targets not shown | FK: CONFIRMED. Targets: **TBD** |

The Item List columns used in the UI prototype (Item Group, Status, Last Modified, Base Unit) remain
**illustrative only** (`06` §7).

## Phase 2H: Required business rules

| Rule area | Finding | Class |
|---|---|---|
| Required fields | Only `ItemMaster.ID`, `ItemMaster.ItemCode`, `CustomerMaster.Id` and `SupplierMaster.Id` are NOT NULL. Every other column is nullable. Business-required fields are not stated. | DB nullability: CONFIRMED. Business-required: **TBD** |
| Optional fields | Every nullable column is optional at DB level. Business optionality: TBD. | as above |
| Validation rules (formats, ranges: GSTIN, HSN, PIN, e-mail, phone, GST rate) | Only type limits are known, e.g. `Mobile` numeric(10,0) in Supplier vs varchar(20) in Customer, and `DrawingNo` max 50, `Specification` max 500 | Type limits: CONFIRMED. Business rules: **TBD** |
| Duplicate rules (Item/Customer/Supplier codes, names, mappings) | Not stated | **TBD** |
| Deletion rules (can a mapped Item/Customer/Supplier be deleted?) | Not stated. No cascade rules shown. | **TBD** |
| Code generation (`ItemCode`, `CustCode`, `SuppCode`) | Not stated. Sample codes follow patterns (`SMSP0001`, `SMCX0002`), but that doesn't establish a generation rule. | **TBD** (pattern INFERRED from sample data only) |
| Identity for `ID`/`Id` | Not shown | **TBD** |
| Branch/company scoping | Columns `LoginBranch` (text) and `BranchId` exist in all three tables, and `Branch` (text) in Customer/Supplier. Whether data is scoped per branch is not stated. | Columns: CONFIRMED. Scoping rule: **TBD** |
| Audit requirements | Audit-like columns exist: `Username`, `LoginBranch`, `SystEmentryDate`, plus `UserId` (Item) or `LoginUserId` (Customer/Supplier). Their population rules are not stated. | Columns: CONFIRMED. Rules: **TBD** |
| Created/updated user | Only one user column pair per table. There is no separate "updated by". | CONFIRMED (no updated-by column). Semantics: **TBD** |
| Created/updated timestamps | Only `SystEmentryDate` (datetime, no time zone). There is no updated timestamp. | CONFIRMED (no updated column). Time zone: **TBD** |
| Soft vs hard delete | No deleted/active flag in any table | CONFIRMED (no flag column). Delete policy: **TBD** |
| Authentication/roles | Not in the source | **TBD** |

## Phase 2I: Contradiction audit

No contradiction below has been resolved. Each needs the stated decision.

| # | Issue | Source A | Source B | Conflict | Required decision |
|---|---|---|---|---|---|
| C1 | Column spelling | Source schema: `SystEmentryDate`, `supptypeid` (E1, E4, E6) | Phase 2 brief: "SystemEntryDate", "SuppTypeId" | Different identifiers. Code using the brief's spelling would not match the DB. | Confirm that the actual DB spellings match the screenshots. Until then, docs use the source spelling. |
| C2 | ItemMaster column list | Source: 25 columns incl. `RawMaterial varchar(50)` (E1) | Phase 2 brief: 24 columns, no `RawMaterial` | A column is missing from the brief | Confirm `RawMaterial` is part of ItemMaster, and its meaning vs `Material` |
| C3 | ItemMaster key | E1: `ID` **and** `ItemCode` both marked PK (composite, INFERRED) | `07` API: `GET/PUT /api/items/{id}`, `/items/{itemId}/mappings` assume a single key | A single-key API vs a composite PK | What identifies an Item (ID, ItemCode, or the pair)? Is `ID` IDENTITY? Is either column unique alone? |
| C4 | Duplicate text vs FK columns | ItemMaster `Color`+`ColourId`, `UOM`+`UnitId`, `Username`+`UserId`, `LoginBranch`+`BranchId`. Customer/Supplier `City/State/Country/Branch` + `…Id` (E1–E6). | `06` §6.1 maps the "Manufacturer Name" drop-down to an FK, which assumes FK-driven lookups | Two sources of truth per attribute | For each pair: which is authoritative, must both be written, and are the text columns legacy? |
| C5 | Supplier vs Customer FKs | CustomerMaster `CityId…LoginUserId` marked **FK** (E4) | SupplierMaster same-named columns **not marked FK** (E6) | Asymmetric referential integrity | Are the Supplier `…Id` columns FKs? To which tables? |
| C6 | Type of supplier vs customer | `CustomerTypeId` (FK, PascalCase) | `supptypeid` (plain int, lower-case) | Not parallel | Does a supplier-type table exist? Is `supptypeid` a reference? |
| C7 | Contact field types | CustomerMaster `PinCode/Telephone/Mobile` = varchar(20) | SupplierMaster = numeric(6,0)/numeric(18,0)/numeric(10,0) | The same attribute has different types; numeric drops leading zeros and `+` | Validation and format rules per entity. Are the types intended? |
| C8 | Party identifier | UI identifies parties by **Code** and **Name** (E7–E9); `05`/`02` R-6 assume `SuppCode`/`CustCode` | DB: `SuppCode`/`CustCode` are nullable varchar(max), with uniqueness not guaranteed (and not indexable as UNIQUE on SQL Server); `07` returns `Id` | A code shown as the identifier may be NULL or duplicated | Is the mapping keyed by `Id` or by Code? Is Code mandatory and unique? |
| C9 | Selecting by Name | UI has a separate **Select Name** drop-down (E8) | Reference data shows duplicate names (E8) | Selecting by Name alone is ambiguous | Is Code↔Name linked? How is a duplicated name disambiguated? |
| C10 | "OR" semantics | Title: "ItemMaster **OR** Customer and SupplierMaster Mapping" (T1) | UI offers both radio types on one screen (E7, E8). E9 greys out Is Supplier after a Customer row. | Exclusive or combined mapping per Item? | Can one Item be mapped to Suppliers **and** Customers? |
| C11 | Mapping storage | UI has Save and a GridView (E7–E9); `07` proposes mapping endpoints | No mapping table or linking column anywhere (E1–E6) | Behaviour to persist, with no structure to persist into | Existing mapping table (name, columns, keys), or approval to design one |
| C12 | Item List columns | `06` §7 / prototype: Status, Last Modified, Item Group, Base Unit | ItemMaster has no Status or Last Modified column, and no Group/Base Unit column by that name | UI concepts without DB backing | Confirm Item List scope and the source of each column (or drop it) |
| C13 | Entry vs modification time | Prototype/UI "Last Modified" | Only `SystEmentryDate` exists (entry/creation by name) | Different semantics | Is `SystEmentryDate` updated on edit? Is a modified timestamp required? |
| C14 | Default values | Reference UI shows GST Rate `0`, Purchase Cost `0` (E7, E9) | DB columns are nullable with no default shown (E1) | UI default vs DB null | Should unset numeric fields be stored as 0 or NULL? |
| C15 | Generated ID in prototype | Prototype form shows "ID — Assigned on save (system generated)" | Identity of `ItemMaster.ID` not shown (E1) | The prototype implies IDENTITY | Is `ID` IDENTITY, sequence-based, or manually assigned? (The prototype is illustrative only.) |
| C16 | Database engine wording | `01`/`08`/`CLAUDE.md`: engine TBD, "consistent with SQL Server" | Evidence (`varchar(max)`, `dbo`, SSMS format) strongly indicates SQL Server | No contradiction in the docs, but the backend driver/dialect cannot be chosen until confirmed | Confirm the engine and version |
| C17 | Existing vs from-scratch | `CLAUDE.md`/`01`: the ERP is built from scratch | E1–E6 show tables that exist in some database | Is the Target ERP expected to use this existing schema/data, or to recreate it? | Is there an existing database the new ERP must connect to, or does the new ERP own a new database with this schema? |

Checked and **not** contradictory: `05` flow vs `02` requirements (consistent); `03` reference UI vs
`06` locked design system (styling differences are intentional, and labels and workflow are
preserved); `08` architecture vs findings (it already keeps DB, data access and entities TBD).

## Phase 2J: Report

### 1. Confirmed database facts
- Schema name `dbo` for all three tables (E1, E3, E5).
- The three tables are shown in an Object Explorer tree, i.e. they existed in some database instance
  when the screenshots were taken.
- No database backup, script, DDL or connection information has been supplied.

### 2. Confirmed tables
- `dbo.ItemMaster`, `dbo.CustomerMaster`, `dbo.SupplierMaster`. **No other tables are confirmed.**

### 3. Confirmed columns
- ItemMaster: 25 columns; CustomerMaster: 28; SupplierMaster: 27. Each has the exact name, SQL
  type and nullability in `04` §2–§4.

### 4. Confirmed relationships
- **PK markers:** `ItemMaster.ID` and `ItemMaster.ItemCode` (both), `CustomerMaster.Id`,
  `SupplierMaster.Id`.
- **FK markers, on the source column only:**
  - ItemMaster: `SubCategoryId`, `ManufacturerId`, `ColourId`, `UnitId`, `UserId`, `BranchId`,
    `CategoryId`
  - CustomerMaster: `CustomerTypeId`, `CityId`, `StateId`, `CountryId`, `BranchId`, `LoginUserId`,
    `ConsigneeId`
- **No FK target, and no Item↔Customer/Supplier relationship, is confirmed.**
  **Mapping persistence structure is UNKNOWN.**

### 5. Confirmed business rules
- Clicking **Add** binds the selected Supplier/Customer into the GridView below (T1).
- The mapping screen has these controls: Is Supplier / Is Customer, Select Code, Select Name, Add,
  GridView (S.No, Code, Name, Action → Delete), Save, Clear (E7–E9; labels per `02` R-4).
- DB-level nullability as shown. No other business rule is confirmed.

### 6. Inferred facts
- The database engine is very likely Microsoft SQL Server (not confirmed).
- ItemMaster has a composite PK (`ID`, `ItemCode`).
- One Item can hold several Supplier/Customer rows.
- Add is client-side until Save.
- Customer names are not unique.
- `SystEmentryDate` is an entry/creation timestamp.
- The "(name)" meanings of columns in `04`.
- If on SQL Server, `CustCode`/`SuppCode` (varchar(max)) cannot have a standard UNIQUE constraint.
- CustomerMaster/SupplierMaster screenshots are complete (Medium). ItemMaster completeness is Low.

### 7. Unknown/TBD facts
- **Database:** engine, version, database name, and whether a real database exists and is accessible.
- **Constraints:** identity, defaults, unique constraints, FK targets, cascade rules, lookup tables.
- **Mapping:** storage and cardinality, "OR" semantics, and duplicate rules.
- **Identifiers:** the party identifier (Id vs Code), code uniqueness and generation.
- **Screen behaviour:** Code↔Name linking; Save/Clear/Delete semantics; required fields and
  validation; Item List columns (Status, Last Modified, Group, Base Unit).
- **Data rules:** authoritative text-vs-FK columns; audit field population; branch scoping; delete
  policy; time zone; authentication/roles.

### 8. Contradictions
C1–C17 above.

### 9. Required decisions from Spidosoft
1. **Database:** engine and version; is there an existing database the new ERP must use (C17)? Supply
   a schema script (DDL) or backup, with keys, identity, defaults and FKs.
2. **ItemMaster key (C3, C15):** composite (`ID`, `ItemCode`) or not; is `ID` IDENTITY; is
   `ItemCode` unique on its own; how is `ItemCode` generated?
3. **Mapping storage (C11):** the existing mapping table's definition, or approval for a new one
   (name, columns, keys, constraints).
4. **Mapping semantics (C10, Q3–4):** can one Item map to Suppliers and Customers; is Supplier ↔ Item
   N:N; are duplicates prevented?
5. **Party identifier (C8, C9):** is the mapping keyed by `Id` or Code; are Codes mandatory and
   unique; is Code↔Name linked, and how are duplicate names handled?
6. **Screen behaviour (Q12–16):** exactly what Add, Save, Clear and Delete persist, and when.
7. **Item Master form:** the full field list, required fields, validation rules, and defaults (0 vs
   NULL, C14).
8. **Text vs FK columns (C4, C5, C6):** for each pair, which is authoritative; the FK target tables
   (including Manufacturer, Category, SubCategory, Colour, Unit); whether the Supplier `…Id` columns
   are FKs; the supplier-type table.
9. **Audit and scoping:** how `Username`, `LoginBranch`, `SystEmentryDate`, `UserId`/`LoginUserId`
   and `BranchId` are populated; whether data is branch-scoped; the delete policy (soft/hard, and
   whether mapped records can be deleted).
10. **Column spelling (C1, C2):** confirm the actual DB identifiers, including `RawMaterial`.
11. **Item List (C12, C13):** scope and a data source for each column.

### 10. Backend-blocking questions
These must be answered before any Spring Boot entity, repository, service or controller is written:
- Decision 1 (engine, existing database, DDL/backup)
- Decision 2 (Item key and identity)
- Decision 3 (mapping storage)
- Decision 4 (mapping semantics)
- Decision 5 (party identifier)
- Decision 6 (Add/Save/Delete persistence semantics)
- Decision 10 (exact identifiers)
- From Decision 7: required fields for Item create/update
- From Decision 8: the FK target tables for the drop-downs used on the Item Master form
- From Decision 9: population of the audit columns (`Username`, `LoginBranch`, `SystEmentryDate`, user/branch IDs), if the backend must write them

### 11. Questions that can safely wait
They don't block the first backend slice (party option lists + Item + mapping):
- Item List columns and features (Status, Last Modified, Group, Base Unit, export, print, upload),
  which are needed only when the Item List is built.
- Supplier contact-field formats (C7) and GSTIN/HSN/PIN validation formats, needed only when
  Customer/Supplier create/edit is in scope (not in the current requirement).
- Branch scoping details beyond audit population, authentication/roles (needed before production),
  time zone of `SystEmentryDate`, `ConsigneeId`/`supptypeid` semantics, dashboard scope, and
  phone/mobile layout.

---
**STOP.** Phase 2 cannot complete until Spidosoft answers the decisions in §9. No implementation
has started.
