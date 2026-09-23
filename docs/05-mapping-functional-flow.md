# 05 · Mapping Functional Flow: ItemMaster → Customer / Supplier

Target behaviour for the **New ERP Implementation**.
Source: the requirement document section **"Mapping:-"**, images 7–9 (Spidosoft Reference UI), and
the sentence *"#If you click on the add button, the data should be bind in the GridView below."*

Legend: **[REQ]** formal requirement · **[REF]** Reference UI observation (visible in
screenshot, not a stated rule) · **[TBC]** to be confirmed · **[ASSUMPTION]**

Backend behaviour (persistence, transactions, server validation) is **not** inferred from the
screenshots.

## Flow

```
Item Master screen
  │
  ├─ 1. User fills Item Master fields ................................ [REF, fields partially visible; full list TBC]
  │
  └─ Section "Select Type & Add Supplier/Customer to List"
        │
        ├─ 2. Choose type: (•) Is Supplier  ( ) Is Customer ............ [REQ]
        │
        ├─ 3. Choose from "Select Code" and/or "Select Name" ............ [REQ, controls exist]
        │        Supplier → codes like SMSP0001…                         [REF]
        │        Customer → names like "A-One Aluminium Works"           [REF]
        │
        ├─ 4. Click "Add" ──► selected record is bound as a new row
        │                     in the GridView below .................... [REQ, verbatim text]
        │        Row: S.No | Customer Code | Customer Name | Action      [REQ, Customer headers from image 9]
        │        Selectors reset to placeholders                         [REF]
        │
        ├─ 5. Repeat 2–4 to add more rows .............................. [ASSUMPTION, S.No implies multiple rows]
        │
        ├─ 6. "Delete" in the Action column ............................ [REF, button shown; behaviour TBC]
        │
        ├─ 7. "Save" ................................................... [REF, button shown; behaviour TBC]
        └─ 8. "Clear" .................................................. [REF, button shown; behaviour TBC]
```

## Step detail

### 1. Item Master fields
Visible in the Reference UI: Material, Manufacturer Name, HSN Code, GST Rate, Purchase Cost,
Selling Price [REF]. The rest of the form is scrolled out of view [TBC].

### 2. Type selection [REQ]
- Two radios: **Is Supplier**, **Is Customer**. One is selected at a time [REF].
- Default selection: image 7 shows Is Supplier selected, but it is not stated as the default [TBC].
- The selected type changes the drop-down contents and the GridView headers [REF].
- Image 9 shows Is Supplier greyed out after a Customer row was added. Whether one Item maps to
  only one type is [TBC]. This relates to "OR" in the title.
- Whether switching type clears rows already in the grid is [TBC].

### 3. Code / Name selection
- **Select Code** lists codes and **Select Name** lists names [REF].
- Source tables `dbo.SupplierMaster.SuppCode/SuppName` and `dbo.CustomerMaster.CustCode/CustName`
  [ASSUMPTION].
- Whether choosing a Code auto-fills the Name (and vice versa), and whether both are required: [TBC].
- The sample data contains duplicate names (e.g. "A-One Aluminium Works" twice) [REF]. That makes
  selecting by Name alone ambiguous, so how the record is identified is [TBC].

### 4. Add [REQ]
- The selected record is appended to the GridView as a row with S.No, Code, Name and a Delete action.
- Reference example (image 9): `1 | SMCX0002 | A-One Aluminium Works | Delete` [REF].
- Validation with nothing selected: [TBC].
- Duplicate prevention: [TBC].
- Whether Add only changes the on-screen grid until Save: [TBC].

### 5. GridView
- Empty state: "No entries added yet." [REF]
- Whether S.No is a display sequence or a stored value: [TBC].

### 6. Action / Delete [REF]
- A red **Delete** button appears per row.
- Confirmation prompt, S.No renumbering, and the effect on previously saved data: [TBC].

### 7. Save [REF, behaviour TBC]
- What Save persists (the Item, the mappings, or both), where it persists them (see
  `04-database-schema.md` §4), whether it is one transaction, and what success/error feedback is
  shown: [TBC].
- Save appears inactive with an empty grid [REF]. Whether that is a rule: [TBC].

### 8. Clear [REF, behaviour TBC]
- Its scope (selectors, grid, entire form): [TBC].

## Editing an Item's saved mappings
Not covered by the supplied material [TBC].
