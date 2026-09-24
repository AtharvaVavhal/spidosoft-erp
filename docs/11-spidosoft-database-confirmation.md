# Spidosoft ERP
## Database & Backend Confirmation

**Prepared for:** Spidosoft Technologies OPC Pvt. Ltd.
**Subject:** Item Master OR Customer and Supplier Master Mapping
**Date:** 24 September 2026 · **Version:** 1.0

<!--
  Internal note (not rendered): every question traces to a decision in
  docs/10-database-requirements-validation.md (§9 decisions, §10 backend-blocking list,
  contradictions C1–C17). References are kept in HTML comments so the rendered/printed
  document stays client-friendly. Nothing in this questionnaire states an answer as confirmed.
-->

---

### Introduction

We have completed the ERP foundation and UI implementation. Before connecting the application to
the production database, we need confirmation of the following database and business rules.

Your requirement document shows the structure of **ItemMaster**, **CustomerMaster** and
**SupplierMaster**, and the Item Master screen where a Supplier or Customer is selected and added
to a list. Screenshots alone cannot show some details, such as keys, generated values and where the
Supplier/Customer list is saved. We don't want to guess those, so we are asking you.

**How to answer**

- Tick ☐ → ☑ the options that apply, or write in the **Response** space.
- If a question is best answered by your database files, answer **Section G** and write
  "see schema" against the related questions.
- If you are unsure, write **"not sure"**. We will follow up rather than assume.

---

## A. Database

### A1. Database engine and version
<!-- ref: docs/10 §9 decision 1, C16 -->

**Which database engine does the existing ERP database use?**

Our reference material appears consistent with Microsoft SQL Server. Please confirm whether the
existing database is SQL Server and provide the exact version.

☐ Microsoft SQL Server  ☐ MySQL  ☐ PostgreSQL  ☐ Oracle  ☐ Other: __________

**Version** (e.g. "SQL Server 2019"): __________

**Database name:** __________

*Why we need this:* the application connects differently to each database product and version.

---

### A2. Existing database or new database
<!-- ref: docs/10 C17 -->

**How should the new ERP work with your data?**

☐ Connect to the **existing** ERP database and use its current tables and data
☐ Use a **copy** of the existing database (for example, a separate test/UAT copy)
☐ Create a **new** database with the same table structure
☐ Other: __________

**Response / notes:** __________

*Why we need this:* it decides whether we must match your existing tables exactly or set up a new
database.

---

## B. Item Master

### B1. How an Item is identified
<!-- ref: docs/10 §9 decision 2, C3, C15 -->

In our reference screenshot, both **ID** and **ItemCode** in `dbo.ItemMaster` are marked as
primary-key columns. We cannot tell from a screenshot exactly what this means.

**What is the primary key of `dbo.ItemMaster`?**

☐ `ID` and `ItemCode` together (one combined key)
☐ `ID` only (and `ItemCode` is separately unique)
☐ `ItemCode` only
☐ Other: __________

**Is `ID` generated automatically by the database** (auto-number / IDENTITY)?
☐ Yes  ☐ No, it is assigned by: __________

**When the application refers to one specific Item** (to open, edit or map it), which value should it use?
☐ `ID`  ☐ `ItemCode`  ☐ Both together

*Why we need this:* every edit, save and mapping must point to exactly one Item.

---

### B2. Item Code
<!-- ref: docs/10 §9 decision 2, §2H code generation -->

**How is `ItemCode` created?**

☐ Typed in by the user
☐ Generated automatically. Rule / format: __________
☐ Other: __________

**Must `ItemCode` be unique?** ☐ Yes  ☐ No

*Why we need this:* it decides whether the screen asks for the code or creates it, and whether
duplicates must be blocked.

---

### B3. Required and optional Item fields
<!-- ref: docs/10 §9 decision 7, §10 "required fields for Item create/update", C14 -->

In the database only `ID` and `ItemCode` are shown as "not null". We need your **business** rules for
creating an Item. Please tick one column per row.

| Field (as shown in your material) | Required | Optional | Filled automatically | Not used |
|---|:-:|:-:|:-:|:-:|
| `ItemCode` | ☐ | ☐ | ☐ | ☐ |
| `ItemName` | ☐ | ☐ | ☐ | ☐ |
| `ItemType` | ☐ | ☐ | ☐ | ☐ |
| `ItemSubType` | ☐ | ☐ | ☐ | ☐ |
| `Material` | ☐ | ☐ | ☐ | ☐ |
| `RawMaterial` | ☐ | ☐ | ☐ | ☐ |
| `Color` | ☐ | ☐ | ☐ | ☐ |
| `UOM` | ☐ | ☐ | ☐ | ☐ |
| `HSNCODE` | ☐ | ☐ | ☐ | ☐ |
| `GSTRate` | ☐ | ☐ | ☐ | ☐ |
| `PurchaseCost` | ☐ | ☐ | ☐ | ☐ |
| `SellingPrice` | ☐ | ☐ | ☐ | ☐ |
| `DrawingNo` | ☐ | ☐ | ☐ | ☐ |
| `Specification` | ☐ | ☐ | ☐ | ☐ |
| `CategoryId` | ☐ | ☐ | ☐ | ☐ |
| `SubCategoryId` | ☐ | ☐ | ☐ | ☐ |
| `ManufacturerId` | ☐ | ☐ | ☐ | ☐ |
| `ColourId` | ☐ | ☐ | ☐ | ☐ |
| `UnitId` | ☐ | ☐ | ☐ | ☐ |

**If a number field (GST Rate, Purchase Cost, Selling Price) is left blank, what should be saved?**
☐ 0  ☐ Empty (NULL)  ☐ Not allowed to be blank

**Any other validation rules** (formats, allowed ranges, e.g. GST Rate values): __________

*Why we need this:* we will not make any field mandatory, or add any validation, without your
confirmation.

---

### B4. Text fields and lookup fields that look alike
<!-- ref: docs/10 C4 -->

`dbo.ItemMaster` contains both a text field and an ID field for the same information:

| Text field | ID field | Which one should the application use? |
|---|---|---|
| `Color` | `ColourId` | ☐ Text  ☐ ID  ☐ Both (keep in step)  ☐ Other: ______ |
| `UOM` | `UnitId` | ☐ Text  ☐ ID  ☐ Both (keep in step)  ☐ Other: ______ |

*Why we need this:* writing to the wrong field would store Item data that your other screens and
reports do not read.

---

### B5. Lookup tables (drop-down values)
<!-- ref: docs/10 §9 decision 8, §10 "FK target tables for the drop-downs", §6 of docs/04 -->

These Item Master fields are marked as references to other tables, but those tables are not shown
in our material. Please complete one row per field.

| Field | Table it comes from | Value stored (e.g. `Id`) | Value shown to the user (e.g. `Name`) | Same database? | Optional? |
|---|---|---|---|:-:|:-:|
| `CategoryId` | | | | ☐ | ☐ |
| `SubCategoryId` | | | | ☐ | ☐ |
| `ManufacturerId` ("Manufacturer Name" on screen) | | | | ☐ | ☐ |
| `ColourId` | | | | ☐ | ☐ |
| `UnitId` | | | | ☐ | ☐ |
| `UserId` | | | | ☐ | ☐ |
| `BranchId` | | | | ☐ | ☐ |

*Why we need this:* the Item Master drop-downs must list the correct values and store the correct
reference.

---

## C. Customer & Supplier

### C1. Customer and Supplier codes
<!-- ref: docs/10 §9 decision 5, C8 -->

In our reference material `CustCode` and `SuppCode` are optional text fields, with no uniqueness
shown.

| Question | CustomerMaster (`CustCode`) | SupplierMaster (`SuppCode`) |
|---|---|---|
| Must every record have a code? | ☐ Yes ☐ No | ☐ Yes ☐ No |
| Must the code be unique? | ☐ Yes ☐ No | ☐ Yes ☐ No |

*Why we need this:* the mapping screen selects Suppliers and Customers by code, so a code must point
to exactly one record.

---

### C2. Supplier telephone and other number fields
<!-- ref: docs/10 C7, docs/07 §0 open contract question -->

In `dbo.SupplierMaster`, `Telephone`, `Mobile` and `PinCode` are **numeric** fields
(`numeric(18,0)`, `numeric(10,0)`, `numeric(6,0)`). In `dbo.CustomerMaster` the same fields are
**text** (`varchar(20)`). Numeric fields cannot keep a leading zero, a "+", spaces or extensions.

**Are the Supplier values truly numbers in the database?**
☐ Yes, they are stored as numbers, and the application may send them as text
☐ Yes, they are stored as numbers, and they must be treated as numbers
☐ No, the actual database uses text for these fields
☐ Not sure

*Why we need this:* very long telephone numbers can lose digits if handled as numbers in a web
application. We will not change your database. We only need to know how to handle the values.

---

## D. Item Mapping

The reference Item Master screen has a **Select Type & Add Supplier/Customer to List** section. The
user chooses **Is Supplier** or **Is Customer**, picks a **Code/Name**, clicks **Add**, and the row
appears in the list below. **Save** then saves the screen.

**The reference UI contains an Add → GridView → Save workflow, but the supplied material does not
identify a database table or column structure for persisting the relationship.** This is the most
important information we need.

### D1. Where is the Item–Supplier/Customer list saved?
<!-- ref: docs/10 §9 decision 3, C11, docs/04 §5 -->

☐ In an existing table. Table name(s): __________
   → Please include its complete structure in Section G (columns, types, keys).
☐ There is no existing table. Please advise how you want this stored: __________
☐ Other: __________

*Why we need this:* without the storage location, Save cannot keep the list. We will not create or
design a table without your approval.

---

### D2. How many Suppliers/Customers per Item?
<!-- ref: docs/10 §9 decision 4, C10, §2F Q1–3 -->

| Question | Yes | No |
|---|:-:|:-:|
| Can one Item have **several Suppliers**? | ☐ | ☐ |
| Can one Item have **several Customers**? | ☐ | ☐ |
| Can one Item have **both** Suppliers **and** Customers at the same time? | ☐ | ☐ |
| Can the same Supplier/Customer be linked to **several different Items**? | ☐ | ☐ |

The requirement title reads "ItemMaster **OR** Customer and SupplierMaster Mapping". Please tell us
what "OR" means here: __________

*Why we need this:* it decides whether the screen allows one type or both, and how many rows it
accepts.

---

### D3. Duplicates and uniqueness
<!-- ref: docs/10 §9 decision 4, §2F Q4 -->

**Can the same Supplier/Customer be added to the same Item more than once?** ☐ Yes  ☐ No

**What makes one mapping row unique?** (e.g. Item + Supplier): __________

**Does a mapping row have an active/inactive status?** ☐ Yes (field name: ______)  ☐ No

*Why we need this:* it tells us whether Add must block duplicates.

---

### D4. Which identifiers does the mapping store?
<!-- ref: docs/10 §9 decision 5, C3, C8 -->

| The mapping refers to… | by… |
|---|---|
| the Item | ☐ `ItemMaster.ID`  ☐ `ItemMaster.ItemCode`  ☐ Both |
| a Customer | ☐ `CustomerMaster.Id`  ☐ `CustomerMaster.CustCode` |
| a Supplier | ☐ `SupplierMaster.Id`  ☐ `SupplierMaster.SuppCode` |

*Why we need this:* this tells us which value is saved for each mapping row.

---

### D5. Select Code and Select Name
<!-- ref: docs/10 §9 decision 5, C9, docs/02 Q-3 -->

The screen has both a **Select Code** and a **Select Name** drop-down. In the reference data some
names appear more than once (for example "A-One Aluminium Works").

**How should the two drop-downs work?**
☐ They are linked: choosing a Code selects its Name, and vice versa
☐ They are independent, and the user must choose both
☐ Only one of them is needed to Add. Which one: ______

**If two records have the same name, how should the user tell them apart?** __________

*Why we need this:* it avoids adding the wrong Supplier/Customer when names repeat.

---

## E. Save / Delete / Clear Behavior
<!-- ref: docs/10 §9 decision 6, §2F Q12–16, docs/02 Q-5–Q-8, Q-11 -->

The screen has **Add**, **Save**, **Delete** (per row) and **Clear** buttons. Please describe exactly
what each one does.

### E1. Add
☐ Adds the row to the list on screen only; nothing is saved until **Save**
☐ Saves the row to the database immediately
☐ Other: __________

### E2. Save
☐ Saves the Item **and** its Supplier/Customer list together
☐ Saves the Item only; the list is saved separately
☐ Other: __________

**If the Item saves but the list fails to save, what should happen?**
☐ Nothing is saved (all or nothing)  ☐ Keep the Item and show an error for the list  ☐ Other: ______

**When an existing Item is opened for editing, should its saved Suppliers/Customers appear in the
list?** ☐ Yes  ☐ No

### E3. Delete (in the list)
☐ Removes the row from the screen only; the database changes on **Save**
☐ Deletes a saved row from the database immediately
☐ Other: __________

**Should Delete ask for confirmation?** ☐ Yes  ☐ No

### E4. Clear
☐ Clears the Item fields only
☐ Clears the unsaved Supplier/Customer list only
☐ Resets the entire screen (fields and list)
☐ Other: __________

*Why we need this:* these answers decide when data is written to your database.

---

## F. Audit & Branch Rules

### F1. System-filled fields
<!-- ref: docs/10 §9 decision 9, §10 audit population, docs/02 Q-13, C13 -->

These fields appear in the tables, but our material does not show how they are filled. Please tick
where each value comes from.

| Field | Table(s) | Logged-in user / session | Database default | Database trigger | Not used | Also updated on edit? |
|---|---|:-:|:-:|:-:|:-:|:-:|
| `Username` | Item, Customer, Supplier | ☐ | ☐ | ☐ | ☐ | ☐ |
| `LoginBranch` | Item, Customer, Supplier | ☐ | ☐ | ☐ | ☐ | ☐ |
| `SystEmentryDate` | Item, Customer, Supplier | ☐ | ☐ | ☐ | ☐ | ☐ |
| `UserId` | Item | ☐ | ☐ | ☐ | ☐ | ☐ |
| `BranchId` | Item, Customer, Supplier | ☐ | ☐ | ☐ | ☐ | ☐ |
| `LoginUserId` | Customer, Supplier | ☐ | ☐ | ☐ | ☐ | ☐ |

**If the date/time is set by the application, which time zone should it use?**
☐ Indian Standard Time (IST)  ☐ UTC  ☐ Other: ______

*Why we need this:* if the application must fill these fields, it needs to know the source and the
format.

---

### F2. Branch / company scope
<!-- ref: docs/10 §9 decision 9, §2H branch scoping -->

**Is each type of record specific to a branch?**

| Record type | Branch-specific? | Column that controls it |
|---|---|---|
| Items | ☐ Yes ☐ No | |
| Customers | ☐ Yes ☐ No | |
| Suppliers | ☐ Yes ☐ No | |
| Item–Supplier/Customer mappings | ☐ Yes ☐ No | |

*Why we need this:* it decides whether users see and save data only for their own branch.

---

### F3. Delete policy
<!-- ref: docs/10 §9 decision 9, §2H deletion rules, soft vs hard delete -->

**When a record is deleted, is it physically removed?**
☐ Yes, physically deleted  ☐ No, marked as deleted/inactive (field name: ______)

**Can an Item be deleted after Suppliers/Customers are mapped to it?** ☐ Yes  ☐ No

**If an Item, Customer or Supplier is deleted, what happens to its mappings?**
☐ Deleted as well  ☐ Kept  ☐ Deletion is not allowed while mappings exist  ☐ Other: ______

*Why we need this:* it prevents mapping rows that point to deleted records.

---

## G. Schema / Technical Files Required

### G1. Authoritative database structure
<!-- ref: docs/10 §9 decision 1, §1 of docs/04 (no DDL/backup supplied) -->

**Please provide ONE of the following** (only through a secure channel you approve; please do not
send passwords by ordinary email):

☐ A database **backup** (structure; data optional)
☐ A complete **DDL / schema script** (CREATE TABLE statements, including keys and constraints)
☐ **Read-only access** to a test or UAT copy of the database

It should cover:

- `dbo.ItemMaster`, `dbo.CustomerMaster`, `dbo.SupplierMaster`
- the Item–Supplier/Customer mapping table (if one exists, see D1)
- the lookup tables from B5

For each table, we need:

- data types
- nullability
- defaults
- identity / auto-increment
- primary keys
- unique constraints
- foreign keys
- indexes

**Which database should the development team work against?**
☐ A separate test/UAT database  ☐ Other: __________

*Why we need this:* one authoritative source removes all remaining guesswork about the structure.

---

### G2. Exact column names
<!-- ref: docs/10 §9 decision 10, C1 -->

Some names in our material have unusual spelling or capitalisation, for example `SystEmentryDate`,
`supptypeid`, `HSNCODE` and `EmailID`.

**Please provide the authoritative column names exactly as they exist in the database.**
We will use them exactly as given.

☐ The files in G1 contain the exact names
☐ Corrections: __________

*Why we need this:* a single letter's difference prevents the application from reading or saving a
field.

---

## What we need from Spidosoft

1. ☐ Database engine + version (A1)
2. ☐ Database name (A1)
3. ☐ DDL / backup / schema access (G1)
4. ☐ Exact `ItemMaster` schema (G1, G2)
5. ☐ Exact `CustomerMaster` schema (G1, G2)
6. ☐ Exact `SupplierMaster` schema (G1, G2)
7. ☐ Item key behaviour (B1, B2)
8. ☐ Lookup-table relationships (B4, B5)
9. ☐ Mapping table / schema (D1, G1)
10. ☐ Mapping cardinality and duplicate rules (D2, D3)
11. ☐ Code vs ID relationships (C1, D4, D5)
12. ☐ Add / Save / Delete / Clear behaviour (E1–E4)
13. ☐ Audit-field behaviour (F1)
14. ☐ Branch-scoping behaviour (F2)
15. ☐ Delete policy (F3)
16. ☐ Supplier telephone representation (C2)

Also required to build the Item form: required fields and defaults (B3), and whether the new ERP uses
the existing database (A2).

Thank you. Once these answers arrive, we will connect the application to the confirmed database
structure without making assumptions.
