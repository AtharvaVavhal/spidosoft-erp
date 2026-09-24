# 04 · Database Schema (validated evidence)

> **Status: database and requirements validation, 2026-09-23** (produced under the earlier label
> "Phase 2"; under the standardized numbering in `09` this is Phase 4 — Database Confirmation. Section
> IDs 2A–2E are kept as stable references). This document records only
> what the Supplied Requirement Material shows. Nothing here is inferred from the Reference UI or the
> visual prototype. The consolidated report, including business rules, contradictions and open
> decisions, is in `10-database-requirements-validation.md`.
>
> **Do not convert these tables into DDL, migrations or JPA entities** until the TBD items marked
> *backend-blocking* in `10` are resolved.

## 0. Evidence and conventions

| ID | Evidence |
|---|---|
| E1, E2 | Requirement `.docx` images 1–2: Object Explorer column list of **`dbo.ItemMaster`** |
| E3, E4 | Images 3–4: **`dbo.CustomerMaster`** |
| E5, E6 | Images 5–6: **`dbo.SupplierMaster`** |
| E7, E8, E9 | Images 7–9: Mapping reference screen (UI only, **not** database evidence) |
| T1 | Document text, which in full is: title "11)ItemMaster OR Customer and SupplierMaster Mapping", headings "DataBase:-", "ItemMaster:-", "CustomerMaster:-", "SupplierMaster:-", "Mapping:-", and the sentence "#If you click on the add button, the data should be bind in the GridView below." (36 words in total, with no SQL, no DDL, no comments and no alt text) |

- **Names are exact**, including source spelling: `SystEmentryDate` (not "SystemEntryDate"),
  `HSNCODE`, `supptypeid` (lower-case, not "SuppTypeId"), `EmailID`, `Color` vs `ColourId`.
- **Column order** is as listed in the screenshots.
- **What each screenshot label means.** In the Object Explorer format `Name (PK|FK, type, null|not null)`:
  - "PK" = the column participates in the primary-key constraint
  - "FK" = the column participates in a foreign-key constraint
  - no marker = neither is shown
- **Not shown anywhere in the source**, so recorded as **TBD**: defaults, identity/auto-increment,
  unique constraints and indexes, check constraints, collation, FK target tables and columns, and
  cascade rules.
- **Business meaning** is read from the column name only, marked *(name)*. It is an inference, never a
  confirmed rule.
- **Confidence levels:**
  - *High*: read directly from the screenshot.
  - *Medium*: inferred from standard Object Explorer semantics.
  - *Low*: inferred from the name.
- **Completeness.** Each table spans two screenshots. That no column is missing at the join between
  them is **INFERRED**:
  - CustomerMaster and SupplierMaster: *Medium*. Both joins are consistent (…`LoginBranch` |
    `SystEmentryDate`…).
  - ItemMaster: *Low*. The join is `UnitId` | `UserId`, and no second table confirms the order.

## 1. Database source (Phase 2A)

| # | Question | Finding | Classification |
|---|---|---|---|
| 1 | Database engine | **DATABASE ENGINE = TBD.** The evidence is consistent with Microsoft SQL Server: SSMS-style Object Explorer, the `dbo` schema, and the `varchar(max)` type, which is SQL Server-specific and not valid MySQL. | INFERRED (strong), **not confirmed** |
| 2 | Version | Not shown | **TBD** |
| 3 | Schema name | `dbo` (all three tables) | CONFIRMED (E1, E3, E5) |
| 4 | Is an existing production database/schema available? | Not stated. The screenshots show the tables existed in *some* database instance when captured (the document was created 2026-08-19). Whether that is production, a copy, or available to us is unknown. | **TBD** |
| 5 | SQL Server confirmed? | No. Inferred only (see #1). | INFERRED |
| 6 | Do `dbo.ItemMaster`, `dbo.CustomerMaster`, `dbo.SupplierMaster` exist? | They are shown as existing tables in an Object Explorer tree. Their existence in Spidosoft's target/production database is not stated. | CONFIRMED as shown in the source; existence in production **TBD** |
| 7 | Access to a backup/schema/script | **None.** `docs/source/` holds only the `.docx`, with no `.bak`, `.bacpac`, `.sql`, DDL or connection details. | CONFIRMED (absence) |
| 8 | Database name | Not shown | **TBD** |
| 9 | Other tables | None shown. The FKs imply unseen referenced tables. | **TBD** |

## 2. `dbo.ItemMaster` (Phase 2B): 25 columns

| # | Column (exact) | SQL type | Nullable | Default | PK | Identity | Unique | FK | Ref. table | Ref. column | Business meaning | Evidence | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `ID` | int | NOT NULL | TBD | **Yes** | TBD | Only as part of PK (composite?) | No | n/a | n/a | Row identifier (name) | E1 | High |
| 2 | `ItemCode` | varchar(255) | NOT NULL | TBD | **Yes** | TBD | Only as part of PK (composite?) | No | n/a | n/a | Item code (name) | E1 | High |
| 3 | `ItemName` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Item name (name) | E1 | High |
| 4 | `Material` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Material (name) | E1 | High |
| 5 | `ItemType` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Item type, stored as text (name) | E1 | High |
| 6 | `ItemSubType` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Item sub-type, stored as text (name) | E1 | High |
| 7 | `Color` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Colour as text (name). Coexists with `ColourId`. | E1 | High |
| 8 | `UOM` | varchar(255) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Unit of measure as text (name). Coexists with `UnitId`. | E1 | High |
| 9 | `HSNCODE` | varchar(255) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | HSN code (name) | E1 | High |
| 10 | `GSTRate` | decimal(20,2) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | GST rate (name). Unit (% vs fraction) TBD. | E1 | High |
| 11 | `PurchaseCost` | decimal(20,2) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Purchase cost (name). Currency TBD. | E1 | High |
| 12 | `SellingPrice` | decimal(20,2) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Selling price (name). Currency TBD. | E1 | High |
| 13 | `Username` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | User name as text: creator/editor? (name) | E1 | High |
| 14 | `LoginBranch` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Branch of the logged-in user, as text (name) | E1 | High |
| 15 | `SystEmentryDate` | datetime | NULL | TBD | No | TBD | TBD | No | n/a | n/a | System entry date/time: creation or entry? (name) | E1 | High |
| 16 | `RawMaterial` | varchar(50) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Raw material (name). Meaning vs `Material` TBD. | E1 | High |
| 17 | `SubCategoryId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | Sub-category reference (name) | E1 | High |
| 18 | `ManufacturerId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | Manufacturer reference (name) | E1 | High |
| 19 | `ColourId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | Colour reference (name) | E1 | High |
| 20 | `UnitId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | Unit reference (name) | E1 | High |
| 21 | `UserId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | User reference (name) | E2 | High |
| 22 | `BranchId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | Branch reference (name) | E2 | High |
| 23 | `CategoryId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | Category reference (name) | E2 | High |
| 24 | `DrawingNo` | varchar(50) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Drawing number (name) | E2 | High |
| 25 | `Specification` | varchar(500) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Specification text (name) | E2 | High |

Notes:
- **Primary key.** Both `ID` and `ItemCode` are marked PK. A table has only one primary-key
  constraint, so under Object Explorer semantics this means **a composite PK (`ID`, `ItemCode`)**.
  That is INFERRED (Medium); the "Keys" folder is cut off in E2.
  - Consequence (INFERRED): neither `ID` nor `ItemCode` is guaranteed unique *on its own* unless
    another unique constraint exists (TBD).
- **Identity.** Whether `ID` is an IDENTITY column is not shown (TBD).
- **Missing from your brief.** The Phase 2 brief's column list omits `RawMaterial`, and spells
  `SystEmentryDate` as "SystemEntryDate". The source values above are authoritative.
- **Columns that don't exist.** There is **no** Status, active/inactive, Last Modified/updated,
  Item Group or Base Unit column (CONFIRMED absent from E1–E2, subject to the completeness note in §0).
- **Paired text + FK columns.** `Color`/`ColourId`, `UOM`/`UnitId`,
  `Username`/`UserId`, `LoginBranch`/`BranchId`. Which one is authoritative is TBD.

## 3. `dbo.CustomerMaster` (Phase 2C): 28 columns

| # | Column (exact) | SQL type | Nullable | Default | PK | Identity | Unique | FK | Ref. table | Ref. column | Business meaning | Evidence | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `Id` | int | NOT NULL | TBD | **Yes** | TBD | Yes (PK) | No | n/a | n/a | Row identifier (name) | E3 | High |
| 2 | `CustCode` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Customer code (name) | E3 | High |
| 3 | `CustName` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Customer name (name) | E3 | High |
| 4 | `ContactPerson` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Contact person (name) | E3 | High |
| 5 | `Branch` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Branch as text: customer's branch or ours? (name) | E3 | High |
| 6 | `Address1` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Address line 1 (name) | E3 | High |
| 7 | `Address2` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Address line 2 (name) | E3 | High |
| 8 | `City` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | City as text. Coexists with `CityId`. | E3 | High |
| 9 | `State` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | State as text. Coexists with `StateId`. | E3 | High |
| 10 | `PinCode` | varchar(20) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | PIN code (name) | E3 | High |
| 11 | `Country` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Country as text. Coexists with `CountryId`. | E3 | High |
| 12 | `EmailID` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | E-mail address (name) | E3 | High |
| 13 | `Telephone` | varchar(20) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Telephone (name) | E3 | High |
| 14 | `Mobile` | varchar(20) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Mobile (name) | E3 | High |
| 15 | `Fax` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Fax (name) | E3 | High |
| 16 | `Website` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Website (name) | E3 | High |
| 17 | `GSTIN` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | GST identification number (name) | E3 | High |
| 18 | `Remarks` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Remarks (name) | E3 | High |
| 19 | `Username` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | User name as text (name) | E3 | High |
| 20 | `LoginBranch` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Branch of the logged-in user, as text (name) | E3 | High |
| 21 | `SystEmentryDate` | datetime | NULL | TBD | No | TBD | TBD | No | n/a | n/a | System entry date/time (name) | E4 | High |
| 22 | `CustomerTypeId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | Customer type reference (name) | E4 | High |
| 23 | `CityId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | City reference (name) | E4 | High |
| 24 | `StateId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | State reference (name) | E4 | High |
| 25 | `CountryId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | Country reference (name) | E4 | High |
| 26 | `BranchId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | Branch reference (name) | E4 | High |
| 27 | `LoginUserId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | Logged-in user reference (name) | E4 | High |
| 28 | `ConsigneeId` | int | NULL | TBD | No | TBD | TBD | **Yes** | TBD | TBD | Consignee reference (name) | E4 | High |

Notes:
- **Paired text + FK columns.** `City`/`CityId`, `State`/`StateId`, `Country`/`CountryId`,
  `Branch`/`BranchId`, `Username`/`LoginUserId`, `LoginBranch`/`BranchId`. Which one is authoritative
  is TBD.
- **`CustCode` is nullable `varchar(max)`.** If the engine is SQL Server, a `varchar(max)` column
  **cannot be an index key**, so a standard UNIQUE constraint on `CustCode` cannot exist.
  Uniqueness would have to be enforced by the application or by other means (INFERRED, conditional
  on the engine).
- **`ConsigneeId`** has no SupplierMaster counterpart.

## 4. `dbo.SupplierMaster` (Phase 2D): 27 columns

| # | Column (exact) | SQL type | Nullable | Default | PK | Identity | Unique | FK | Ref. table | Ref. column | Business meaning | Evidence | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `Id` | int | NOT NULL | TBD | **Yes** | TBD | Yes (PK) | No | n/a | n/a | Row identifier (name) | E5 | High |
| 2 | `SuppCode` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Supplier code (name) | E5 | High |
| 3 | `SuppName` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Supplier name (name) | E5 | High |
| 4 | `ContactPerson` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Contact person (name) | E5 | High |
| 5 | `Branch` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Branch as text (name) | E5 | High |
| 6 | `Address1` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Address line 1 (name) | E5 | High |
| 7 | `Address2` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Address line 2 (name) | E5 | High |
| 8 | `City` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | City as text. Coexists with `CityId`. | E5 | High |
| 9 | `State` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | State as text. Coexists with `StateId`. | E5 | High |
| 10 | `PinCode` | numeric(6,0) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | PIN code, numeric (name) | E5 | High |
| 11 | `Country` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Country as text. Coexists with `CountryId`. | E5 | High |
| 12 | `EmailID` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | E-mail address (name) | E5 | High |
| 13 | `Telephone` | numeric(18,0) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Telephone, numeric (name) | E5 | High |
| 14 | `Mobile` | numeric(10,0) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Mobile, numeric (name) | E5 | High |
| 15 | `Fax` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Fax (name) | E5 | High |
| 16 | `Website` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Website (name) | E5 | High |
| 17 | `GSTIN` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | GST identification number (name) | E5 | High |
| 18 | `Remarks` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Remarks (name) | E5 | High |
| 19 | `Username` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | User name as text (name) | E5 | High |
| 20 | `LoginBranch` | varchar(max) | NULL | TBD | No | TBD | TBD | No | n/a | n/a | Branch of the logged-in user, as text (name) | E5 | High |
| 21 | `SystEmentryDate` | datetime | NULL | TBD | No | TBD | TBD | No | n/a | n/a | System entry date/time (name) | E6 | High |
| 22 | `supptypeid` | int | NULL | TBD | No | TBD | TBD | Not marked | TBD | TBD | Supplier type reference? (name) | E6 | High (type/null); FK status TBD |
| 23 | `CountryId` | int | NULL | TBD | No | TBD | TBD | Not marked | TBD | TBD | Country reference? (name) | E6 | High (type/null); FK status TBD |
| 24 | `StateId` | int | NULL | TBD | No | TBD | TBD | Not marked | TBD | TBD | State reference? (name) | E6 | High (type/null); FK status TBD |
| 25 | `CityId` | int | NULL | TBD | No | TBD | TBD | Not marked | TBD | TBD | City reference? (name) | E6 | High (type/null); FK status TBD |
| 26 | `BranchId` | int | NULL | TBD | No | TBD | TBD | Not marked | TBD | TBD | Branch reference? (name) | E6 | High (type/null); FK status TBD |
| 27 | `LoginUserId` | int | NULL | TBD | No | TBD | TBD | Not marked | TBD | TBD | Logged-in user reference? (name) | E6 | High (type/null); FK status TBD |

Notes, in the areas you flagged:
- **`supptypeid` vs `CustomerTypeId`.**
  - `supptypeid` is lower-case, plain `int`, and **not marked FK**.
  - `CustomerTypeId` is PascalCase and **marked FK**.
  - Do not assume they are parallel. Whether a supplier-type table exists, and whether
    `supptypeid` references it, is TBD.
- **`CountryId`, `StateId`, `CityId`, `BranchId`, `LoginUserId`.**
  - Same names as the CustomerMaster columns, but **no FK constraint is shown** here.
  - They may be logical references without DB-enforced integrity, or constraints the screenshot
    doesn't show.
  - **Do not assume the same FK structure as CustomerMaster.** TBD.
- **Type differences from CustomerMaster.** `PinCode` numeric(6,0), `Telephone` numeric(18,0) and
  `Mobile` numeric(10,0), where CustomerMaster uses `varchar(20)` for all three.
  - Numeric columns cannot store leading zeros, `+`, spaces or extensions, and `Mobile` holds at most
    10 digits.
  - These types are recorded as-is and not reconciled.
- **`SuppCode`** is nullable `varchar(max)`. The same uniqueness limitation as `CustCode` applies.

## 5. Item ↔ Customer/Supplier mapping (Phase 2E)

**Mapping persistence structure is UNKNOWN.**

What I searched the source for (text, all 9 images, document metadata):

| Looked for | Found |
|---|---|
| Mapping/junction table name | **None** |
| SQL statements, stored procedures, DDL | **None** (the document has 36 words and no SQL) |
| Any column linking Item to Customer or Supplier (e.g. `ItemId`, `ItemCode`, `CustomerId`, `CustId`, `SupplierId`, `SuppId`, `SuppCode`, `CustCode` in another table) | **None.** No such column appears in any of the three tables. ItemMaster has no customer/supplier column, and Customer/SupplierMaster have no item column. |
| FKs that could represent the mapping | **None.** All shown FKs point to unseen lookup tables (category, unit, city, …) by name. |
| Database identifiers in the mapping screenshots (E7–E9) | Only UI text: URL `localhost:3000/Masters/ItemMasterCo`, menu label "Item Master JDBC", codes `SMSP0001…0007` and `SMCX0002`. **No table or column names.** |

**Cardinality**

| Relationship | Finding | Classification |
|---|---|---|
| Item → Suppliers (one item, many suppliers?) | The UI adds parties "to List", and the GridView has an **S.No** column, which suggests several rows per item. Only one row is ever shown (E9). | INFERRED (1 item : N parties), **TBD** |
| Supplier → Items | Nothing shown | **TBD** |
| Overall Item ↔ Supplier | If both directions hold, N:N. Nothing confirms it. | **TBD** |
| Item ↔ Customer | Same as above | **TBD** |
| Item ↔ both types at once | The title says "ItemMaster **OR** Customer and SupplierMaster". E9 shows Is Supplier greyed out after a Customer row was added. | **TBD** (conflicting hints) |

**No mapping table may be designed or created** until Spidosoft states either the existing
structure or approves a new one (see `10` §9).

## 6. Referenced (lookup) tables: UNKNOWN

The FK-marked columns imply referenced tables for: sub-category, manufacturer, colour, unit, user,
branch, category (ItemMaster); customer type, city, state, country, branch, login user, consignee
(CustomerMaster). **No names, columns or keys for these tables appear in the source.** The
SupplierMaster `…Id` columns may or may not reference the same tables.
