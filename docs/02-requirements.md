# 02 · Requirements

**Formal functional source:** `docs/source/Item Master OR Customer And Supplier Master Mapping Problem STMT - ERP APP.docx`
(5 pages, 9 embedded images).
**Supporting material:** Reference Screenshots (see `03-reference-ui.md`).

Sections: **§2 Formal requirements** · **§3 Reference UI observations** ·
**§4 Technical decisions** · **§5 TO BE CONFIRMED**

## 1. What the requirement document contains

Its full text, verbatim and in order:

```
11)ItemMaster OR Customer and SupplierMaster Mapping
DataBase:-
ItemMaster:-          [image 1, image 2 — dbo.ItemMaster columns]
CustomerMaster:-      [image 3, image 4 — dbo.CustomerMaster columns]
SupplierMaster:-      [image 5, image 6 — dbo.SupplierMaster columns]
Mapping:-             [image 7, image 8 — Mapping UI, Supplier / Customer selection]
#If you click on the add button, the data should be bind in the GridView below.
                      [image 9 — Mapping UI after Add]
```

The requirement is conveyed mostly through images.

## 2. Formal requirements

### R-1 ItemMaster
The Target ERP works with **`dbo.ItemMaster`**, with the columns in `04-database-schema.md` §1.

### R-2 CustomerMaster
The Target ERP works with **`dbo.CustomerMaster`** (see `04-database-schema.md` §2).

### R-3 SupplierMaster
The Target ERP works with **`dbo.SupplierMaster`** (see `04-database-schema.md` §3).

### R-4 Mapping UI (from images 7–9)
Within the **Item Master** screen there is a section titled
**"Select Type & Add Supplier/Customer to List"** with:

| Control | Label (exact) | Type |
|---|---|---|
| Type selector | **Is Supplier:** / **Is Customer:** | Radio buttons |
| Code selector | **Select Code:** | Drop-down (placeholder "Select Code") |
| Name selector | **Select Name:** | Drop-down (placeholder "Select Name") |
| Add action | **Add** | Button |
| GridView | **S.No**, **Customer Code**, **Customer Name**, **Action** (Customer selected) | Table |
| Row action | **Delete** | Button per row |
| Form actions | **Save**, **Clear** | Buttons |

### R-5 Add binds to GridView (text)
> "#If you click on the add button, the data should be bind in the GridView below."

Clicking **Add** shows the selected Supplier/Customer as a new row in the GridView below the
selectors.

### R-6 Supplier / Customer lists (from images 7–8)
- With **Is Supplier** selected, **Select Code** lists supplier codes (e.g. `SMSP0001`).
- With **Is Customer** selected, **Select Name** lists customer names.
- Data source `dbo.SupplierMaster` (`SuppCode`, `SuppName`) / `dbo.CustomerMaster` (`CustCode`,
  `CustName`): **ASSUMPTION**. The obvious reading, but not stated.

## 3. Reference UI observations (supporting, not formal requirements)
Details are in `03-reference-ui.md`. In summary, from images 7–9: the empty-grid text "No entries
added yet.", drop-downs reset after Add, Is Supplier greyed out after a Customer row was added, and
Save appears inactive while the grid is empty.

The Item List and Create Item Master Reference Screenshots are **not yet supplied**. Their
contents are **TO BE CONFIRMED**.

## 4. Technical decisions
The stack is listed in `01-project-overview.md` and `08-architecture.md`, and the API proposal is in
`07-api-specification.md`. **None of these are Spidosoft requirements.**

## 5. TO BE CONFIRMED

Phase 2 classification of these questions (CONFIRMED / INFERRED / TBD), the contradiction audit, and
the decisions required from Spidosoft are in `10-database-requirements-validation.md`.

| # | Question |
|---|---|
| Q-1 | How and where is a mapping persisted? No mapping table is shown. |
| Q-2 | What does "OR" in the title mean? Can one Item have Suppliers **and** Customers, or only one type? |
| Q-3 | Are Code and Name linked, i.e. does selecting one auto-select the other? Must both be selected? |
| Q-4 | Are duplicate rows allowed? |
| Q-5 | What does **Save** save (the Item, the mappings, or both), and what feedback is shown? |
| Q-6 | What does **Clear** clear? |
| Q-7 | Does **Delete** remove an unsaved row only, or a persisted mapping too? Is there a confirmation? |
| Q-8 | What validation applies (Add with nothing selected, Save with an empty grid, …)? |
| Q-9 | What are the GridView headers when Supplier is selected? They are only partly visible. |
| Q-10 | What is the full Item Master field list? Only part of the form is visible in images 7–9. |
| Q-11 | How are a saved Item's mappings edited? |
| Q-12 | How are the drop-downs filtered (branch, active status)? |
| Q-13 | How are `Username`, `LoginBranch`, `SystEmentryDate`, `UserId`, `BranchId`, `LoginUserId` populated? |
| Q-14 | What are the Item List, Search, Pagination, Create New, Edit, Export Excel, Print, Upload Excel and Back scope and behaviour? Reference Screenshots not yet supplied. |
| Q-15 | Are authentication and roles required? |
