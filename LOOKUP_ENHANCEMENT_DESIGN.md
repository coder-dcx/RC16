# LOOKUP Enhancement - Typed Parameters Design

## Overview
Enhance LOOKUP children to support different parameter types with proper UI controls and validation.

## Current vs New Structure

### Current (Simple):
```javascript
{
    id: 1,
    parentId: 5,
    branchFlag: true,
    branchIndex: 0,
    paramId: "15080",  // Simple string value
    conditionType: "None",
    ...
}
```

### New (Typed Parameters):
```javascript
{
    id: 1,
    parentId: 5,
    branchFlag: true,
    branchIndex: 0,
    conditionType: "None",
    
    // NEW FIELDS for LOOKUP parameters
    lookupParamType: "Param ID",  // Type dropdown
    lookupParamValue: "15080,15081,15082",  // Value(s)
    lookupParamDesc: "Multiple IDs",  // Description
    userComments: "Comment here",  // Already exists
    ...
}
```

## Parameter Types

| Type | Description | UI Control | Value Format | Example |
|------|-------------|------------|--------------|---------|
| **Param ID** | Database parameter ID | Multi-select dropdown | Comma-separated | `15080,15081,15082` |
| **String** | Text value with quotes | Text input (A-Z,a-z,0-9,_) | Quoted string | `'HRSG_FIXED_MATL_COST'` |
| **Number** | Numeric value | Number input | Plain number | `10.3` |
| **Variable** | System variable | Dropdown | Uppercase text | `HP_SEP` |
| **ML_CODE** | Machine learning code | Text input | {code} format | `{ML_CODE}` |
| **Nested LOOKUP** | Another LOOKUP | Recursive UI | Nested object | `LOOKUP(...)` |

## New Database Fields

Add to database table:
```sql
ALTER TABLE parameters ADD COLUMN lookupParamType VARCHAR(20);
ALTER TABLE parameters ADD COLUMN lookupParamValue TEXT;
ALTER TABLE parameters ADD COLUMN lookupParamDesc TEXT;
```

## Data Structure

### Component State (Child of LOOKUP parent):
```javascript
{
    id: 6,
    parentId: 5,  // Parent LOOKUP row
    branchFlag: true,
    branchIndex: 0,  // First param
    conditionType: "None",  // Can be "LOOKUP" for nested
    
    // LOOKUP-specific fields
    lookupParamType: "Param ID",  // Type selector
    lookupParamValue: "15080,15081",  // Multi-select values
    lookupParamDesc: "Tube parameters",  // Description
    userComments: "User comment",  // General comments
    
    // Keep existing fields for compatibility
    paramId: "",  // Empty for LOOKUP params
    operation: "",
    standardMh: "",
    ...
}
```

### Database Format:
```javascript
{
    id: 6,
    parentId: 5,
    branchFlag: true,
    branchIndex: 0,
    conditionType: "None",
    lookupParamType: "Param ID",
    lookupParamValue: "15080,15081",
    lookupParamDesc: "Tube parameters",
    userComments: "User comment",
    paramId: "",
    operation: "",
    standardMh: "",
    ...
}
```

## UI Design

### For Each LOOKUP Parameter (Child Row):

```
[Type Dropdown ▼] [Value Input/Dropdown] [Description] [Comment]
```

#### Type: Param ID
```
[Param ID ▼] [Multi-select: 15080, 15081, 15082 ▼] [Description: ...] [Comment: ...]
```

#### Type: String
```
[String ▼] [Text: 'HRSG_FIXED_MATL_COST'] [Description: Table name] [Comment: ...]
```

#### Type: Number
```
[Number ▼] [Number: 10.3] [Description: Version] [Comment: ...]
```

#### Type: Variable
```
[Variable ▼] [Dropdown: HP_SEP ▼] [Description: High pressure] [Comment: ...]
```

#### Type: ML_CODE
```
[ML_CODE ▼] [Text: {ML_CODE}] [Description: Code ref] [Comment: ...]
```

#### Type: Nested LOOKUP
```
[Nested LOOKUP ▼] [+ Configure LOOKUP] [Description: ...] [Comment: ...]
```

## Formula Generation

### Examples:

**3 Params - Mixed Types:**
```javascript
// Data:
Param 1: Type=Param ID, Value="15001"
Param 2: Type=String, Value="'HRSG_FIXED_MATL_COST'"
Param 3: Type=ML_CODE, Value="{ML_CODE}"

// Formula:
LOOKUP([15001], 'HRSG_FIXED_MATL_COST', {ML_CODE})
```

**5 Params - Multi Param IDs:**
```javascript
// Data:
Param 1: Type=Param ID, Value="15080,15081,15082"
Param 2: Type=Variable, Value="PP_PPM_TUBE"
Param 3: Type=Param ID, Value="15006"
Param 4: Type=Param ID, Value="15775"
Param 5: Type=Param ID, Value="15081"

// Formula:
LOOKUP([15080][15081][15082], PP_PPM_TUBE, [15006], [15775], [15081])
```

**6 Params - With Nested LOOKUP:**
```javascript
// Data:
Param 1: Type=Param ID, Value="15300"
Param 2: Type=String, Value="'CO_CATALYST_COST'"
Param 3: Type=Param ID, Value="15001"
Param 4: Type=Param ID, Value="15070"
Param 5: Type=Param ID, Value="15090"
Param 6: Type=Nested LOOKUP, Value={nested lookup data}

// Formula:
LOOKUP([15300], 'CO_CATALYST_COST', [15001], [15070], [15090], LOOKUP(RANGE, FIN_TUBE_CO_RANGE, [15080]))
```

## Implementation Plan

### Phase 1: Data Model
1. ✅ Add new fields to `createNewRow()`
2. ✅ Update `componentRowToDbRow()`
3. ✅ Update `dbRowToComponentRow()`

### Phase 2: UI Components
1. ✅ Create type dropdown for LOOKUP params
2. ✅ Create conditional input based on type
3. ✅ Add multi-select for Param ID
4. ✅ Add description and comment fields

### Phase 3: Formula Generation
1. ✅ Update `generateFormula()` for typed params
2. ✅ Handle multi-value Param IDs: `[15080][15081][15082]`
3. ✅ Handle nested LOOKUPs recursively

### Phase 4: Validation
1. ✅ Validate based on type
2. ✅ Ensure required fields filled
3. ✅ Format validation (ML_CODE, String, etc.)

## Backward Compatibility

Keep existing `paramId` field:
- If `lookupParamType` is empty, use old logic (paramId)
- If `lookupParamType` is set, use new typed logic
- Migration: Convert old data to new format on load

## Benefits

✅ Support all real-world LOOKUP patterns
✅ Type-safe parameter entry
✅ Better validation
✅ Clearer UI for different parameter types
✅ Support multi-value Param IDs
✅ Support nested LOOKUPs
✅ Database-ready structure
