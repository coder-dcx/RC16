# LOOKUP Typed Parameters - Visual Guide

## 🎨 UI Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CREATE ROOT ROW                              │
│                                                                     │
│  [Param ID: 15001] [Condition Type: LOOKUP ▼] [+ Add Row]         │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Creates 3 children automatically
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LOOKUP CHILDREN (Parameters)                     │
│                                                                     │
│  Parameter 1:                                                       │
│  ┌────────────┬──────────────┬─────────────┬─────────────┐         │
│  │ Type ▼     │ Value Input  │ Description │ Comments    │         │
│  │ Param ID   │ [15080] ▼    │ Tube param  │ Primary key │         │
│  └────────────┴──────────────┴─────────────┴─────────────┘         │
│                                                                     │
│  Parameter 2:                                                       │
│  ┌────────────┬──────────────┬─────────────┬─────────────┐         │
│  │ Type ▼     │ Value Input  │ Description │ Comments    │         │
│  │ String     │ COST_TABLE   │ Table name  │ Reference   │         │
│  └────────────┴──────────────┴─────────────┴─────────────┘         │
│                                                                     │
│  Parameter 3:                                                       │
│  ┌────────────┬──────────────┬─────────────┬─────────────┐         │
│  │ Type ▼     │ Value Input  │ Description │ Comments    │         │
│  │ ML_CODE    │ ML_CODE      │ ML ref      │ Code var    │         │
│  └────────────┴──────────────┴─────────────┴─────────────┘         │
│                                                                     │
│  [+ Add Parameter] [View Formula]                                  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Generates formula
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         FORMULA OUTPUT                              │
│                                                                     │
│  LOOKUP([15080], 'COST_TABLE', {ML_CODE})                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Type Selection Flow

```
┌────────────────────────────────────────────────────────────────┐
│                  SELECT PARAMETER TYPE                         │
│                                                                │
│  [Type Dropdown ▼]                                             │
│   ├─ Param ID                                                  │
│   ├─ String                                                    │
│   ├─ Number                                                    │
│   ├─ Variable                                                  │
│   ├─ ML_CODE                                                   │
│   └─ Nested LOOKUP                                             │
└────────────────────────────────────────────────────────────────┘
                │
                │ User selects type
                ▼
┌─────────────┬──────────────┬──────────────┬──────────────┬──────────────┬─────────────┐
│  Param ID   │   String     │   Number     │   Variable   │   ML_CODE    │ Nested      │
│             │              │              │              │              │ LOOKUP      │
├─────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│             │              │              │              │              │             │
│  Multi-     │  Text Input  │  Number      │  Text Input  │  Text Input  │  Button     │
│  Select     │              │  Input       │              │              │             │
│  Dropdown   │              │              │              │              │             │
│             │              │              │              │              │             │
│  [15080] ✓  │  [____]      │  [____]      │  [____]      │  [____]      │ [Configure] │
│  [15081] ✓  │  A-Z,a-z     │  0-9.        │  A-Z,_       │  A-Z,a-z     │             │
│  [15082] ✓  │  0-9,_       │              │  (uppercase) │  0-9,_       │  (Phase 2)  │
│             │              │              │              │              │             │
│  Multiple   │  Text with   │  Numeric     │  Uppercase   │  Braces      │  Nested     │
│  selection  │  quotes      │  only        │  variable    │  wrapped     │  config     │
│             │              │              │              │              │             │
│  Output:    │  Output:     │  Output:     │  Output:     │  Output:     │  Output:    │
│  [15080]    │  'COST_      │  10.3        │  HP_SEP      │  {ML_CODE}   │  LOOKUP(...)│
│  [15081]    │   TABLE'     │              │              │              │             │
│  [15082]    │              │              │              │              │             │
│             │              │              │              │              │             │
└─────────────┴──────────────┴──────────────┴──────────────┴──────────────┴─────────────┘
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                               │
│                                                                     │
│  User selects type and enters value                                │
│                                                                     │
│  Type: Param ID          Value: 15080,15081,15082                  │
│  Type: String            Value: COST_TABLE                         │
│  Type: ML_CODE           Value: ML_CODE                            │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Store in component state
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       COMPONENT STATE                               │
│                                                                     │
│  {                                                                  │
│    id: 6,                                                           │
│    parentId: 5,                                                     │
│    branchFlag: true,                                                │
│    branchIndex: 0,                                                  │
│                                                                     │
│    lookupParamType: 'Param ID',        ◄── NEW                     │
│    lookupParamValue: '15080,15081',    ◄── NEW                     │
│    lookupParamDesc: 'Tube params',     ◄── NEW                     │
│                                                                     │
│    userComments: 'Comment here'                                     │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
         Generate Formula          Save to Database
                    │                       │
                    ▼                       ▼
    ┌──────────────────────┐   ┌──────────────────────┐
    │  FORMULA OUTPUT      │   │  DATABASE STORAGE    │
    │                      │   │                      │
    │  LOOKUP(             │   │  lookupParamType:    │
    │    [15080][15081],   │   │    'Param ID'        │
    │    'COST_TABLE',     │   │                      │
    │    {ML_CODE}         │   │  lookupParamValue:   │
    │  )                   │   │    '15080,15081'     │
    │                      │   │                      │
    │                      │   │  lookupParamDesc:    │
    │                      │   │    'Tube params'     │
    └──────────────────────┘   └──────────────────────┘
```

---

## 🔄 Formula Generation Process

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FORMULA GENERATION FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

    Start: LOOKUP parent with 3 children
              │
              ▼
    ┌─────────────────────────┐
    │  Get all children       │
    │  (branchFlag = true)    │
    └─────────────────────────┘
              │
              ▼
    ┌─────────────────────────┐
    │  For each child:        │
    │  Check lookupParamType  │
    └─────────────────────────┘
              │
       ┌──────┴──────┬──────────┬──────────┬──────────┬──────────┐
       │             │          │          │          │          │
       ▼             ▼          ▼          ▼          ▼          ▼
    Param ID      String     Number    Variable   ML_CODE    Nested
       │             │          │          │          │          │
       │             │          │          │          │          │
    Multiple?      Add        Plain     Plain     Wrap in    Recursive
    Split by      quotes     number    text      braces     call
    comma           │          │          │          │          │
       │             │          │          │          │          │
    [15080]       'TEXT'      10.3     HP_SEP    {CODE}   LOOKUP(...)
    [15081]
    [15082]
       │             │          │          │          │          │
       └─────────────┴──────────┴──────────┴──────────┴──────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  Join all params with   │
                    │  comma and space        │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  Wrap in LOOKUP()       │
                    └─────────────────────────┘
                                  │
                                  ▼
            LOOKUP([15080][15081][15082], 'TEXT', 10.3, HP_SEP, {CODE})
```

---

## 🎯 Multi-Select Param ID Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              MULTI-SELECT PARAM ID PROCESS                          │
└─────────────────────────────────────────────────────────────────────┘

    User Interface: Multi-select dropdown
              │
              ▼
    ┌─────────────────────────┐
    │  User selects:          │
    │  ☑ 15080                │
    │  ☑ 15081                │
    │  ☑ 15082                │
    └─────────────────────────┘
              │
              ▼
    ┌─────────────────────────┐
    │  Store as:              │
    │  '15080,15081,15082'    │
    │  (comma-separated)      │
    └─────────────────────────┘
              │
              ▼
    ┌─────────────────────────┐
    │  Save to Database:      │
    │  lookupParamValue =     │
    │  '15080,15081,15082'    │
    └─────────────────────────┘
              │
              ▼
    ┌─────────────────────────┐
    │  Generate Formula:      │
    │  Split by comma         │
    │  Wrap each in []        │
    │  Concatenate            │
    └─────────────────────────┘
              │
              ▼
        Output: [15080][15081][15082]
```

---

## 📋 Database Schema Visualization

```
┌─────────────────────────────────────────────────────────────────────┐
│                          parameters TABLE                           │
├─────────────────────────────────────────────────────────────────────┤
│  Existing Columns:                                                  │
│  ├─ id (PK)                                                         │
│  ├─ parentId (FK)                                                   │
│  ├─ branchFlag                                                      │
│  ├─ branchIndex                                                     │
│  ├─ paramId                                                         │
│  ├─ description                                                     │
│  ├─ userComments                                                    │
│  ├─ uom                                                             │
│  ├─ operation                                                       │
│  ├─ standardMh                                                      │
│  ├─ conditionType                                                   │
│  ├─ rowOperator                                                     │
│  ├─ leftType, leftValue                                             │
│  ├─ ifCondition                                                     │
│  └─ rightType, rightValue                                           │
│                                                                     │
│  NEW COLUMNS: ◄─────────────────────────────────────────            │
│  ├─ lookupParamType VARCHAR(20) DEFAULT 'Param ID'                 │
│  ├─ lookupParamValue TEXT                                           │
│  └─ lookupParamDesc TEXT                                            │
└─────────────────────────────────────────────────────────────────────┘

Example Data:

┌──────────────────────────────────────────────────────────────────┐
│  LOOKUP Parent Row (ID: 5)                                       │
├──────────────────────────────────────────────────────────────────┤
│  id: 5                                                           │
│  parentId: NULL                                                  │
│  conditionType: 'LOOKUP'                                         │
│  paramId: '15001'                                                │
└──────────────────────────────────────────────────────────────────┘
                    │
                    │ has children
                    ▼
┌──────────────────────────────────────────────────────────────────┐
│  LOOKUP Child 1 (ID: 6)                                          │
├──────────────────────────────────────────────────────────────────┤
│  id: 6                                                           │
│  parentId: 5                                                     │
│  branchFlag: true                                                │
│  branchIndex: 0                                                  │
│  conditionType: 'None'                                           │
│  lookupParamType: 'Param ID'      ◄── NEW                        │
│  lookupParamValue: '15080,15081'  ◄── NEW                        │
│  lookupParamDesc: 'Tube params'   ◄── NEW                        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  LOOKUP Child 2 (ID: 7)                                          │
├──────────────────────────────────────────────────────────────────┤
│  id: 7                                                           │
│  parentId: 5                                                     │
│  branchFlag: true                                                │
│  branchIndex: 1                                                  │
│  conditionType: 'None'                                           │
│  lookupParamType: 'String'        ◄── NEW                        │
│  lookupParamValue: 'COST_TABLE'   ◄── NEW                        │
│  lookupParamDesc: 'Table name'    ◄── NEW                        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  LOOKUP Child 3 (ID: 8)                                          │
├──────────────────────────────────────────────────────────────────┤
│  id: 8                                                           │
│  parentId: 5                                                     │
│  branchFlag: true                                                │
│  branchIndex: 2                                                  │
│  conditionType: 'None'                                           │
│  lookupParamType: 'ML_CODE'       ◄── NEW                        │
│  lookupParamValue: 'ML_CODE'      ◄── NEW                        │
│  lookupParamDesc: 'ML reference'  ◄── NEW                        │
└──────────────────────────────────────────────────────────────────┘

Generated Formula:
LOOKUP([15080][15081], 'COST_TABLE', {ML_CODE})
```

---

## 🎨 UI Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FeaturesV3 Component                           │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  Root Row                                                     │ │
│  │  [Param ID] [Condition: LOOKUP ▼] [...other fields...]       │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                    │                                                │
│                    │ isExpanded = true                              │
│                    ▼                                                │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  Children Container                                           │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │  LOOKUP Child 1 (branchIndex: 0)                       │ │ │
│  │  │                                                         │ │ │
│  │  │  [Type ▼] [Value Input] [Description] [Comments]       │ │ │
│  │  │                                                         │ │ │
│  │  │  Conditional Rendering Based on Type:                  │ │ │
│  │  │  ├─ Type = Param ID → Multi-select Autocomplete        │ │ │
│  │  │  ├─ Type = String → Text Input (A-Z,a-z,0-9,_)        │ │ │
│  │  │  ├─ Type = Number → Number Input                       │ │ │
│  │  │  ├─ Type = Variable → Text Input (A-Z,_)              │ │ │
│  │  │  ├─ Type = ML_CODE → Text Input (alphanumeric)        │ │ │
│  │  │  └─ Type = Nested LOOKUP → Button                     │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │  LOOKUP Child 2 (branchIndex: 1)                       │ │ │
│  │  │  [Type ▼] [Value Input] [Description] [Comments]       │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │  LOOKUP Child 3 (branchIndex: 2)                       │ │ │
│  │  │  [Type ▼] [Value Input] [Description] [Comments]       │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  [+ Add Parameter]                                            │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                       STATE MANAGEMENT                              │
└─────────────────────────────────────────────────────────────────────┘

    User Action: Select Type → "Param ID"
              │
              ▼
    ┌─────────────────────────┐
    │  updateRow() called     │
    │  field: 'lookupParamType'│
    │  value: 'Param ID'      │
    └─────────────────────────┘
              │
              ▼
    ┌─────────────────────────┐
    │  setRows() updates      │
    │  component state        │
    └─────────────────────────┘
              │
              ▼
    ┌─────────────────────────┐
    │  React re-renders       │
    │  with new state         │
    └─────────────────────────┘
              │
              ▼
    ┌─────────────────────────┐
    │  Conditional rendering  │
    │  shows Param ID input   │
    └─────────────────────────┘
              │
              ▼
    User sees: [Multi-select Dropdown]
```

---

**Visual Guide Complete!** 🎨

These diagrams provide a visual understanding of how the LOOKUP typed parameters system works.
