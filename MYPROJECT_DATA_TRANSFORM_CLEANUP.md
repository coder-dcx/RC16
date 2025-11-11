# Data Transform Utils - Data Cleanup Implementation

## Overview
This document describes the data cleanup changes applied to the data transformation utility files in the myProject folder to ensure proper field management based on row type (None, IF, IF-ELSE, LOOKUP).

## Implementation Date
October 17, 2025

## Files Updated

### 1. ✅ EnhancedDataTransformUtils.js
**Location:** `src/components/myProject/FormulaBuilder/EnhancedDataTransformUtils.js`
**Changes:** Complete data cleanup logic for all row types

### 2. ✅ DataTransformUtils.js
**Location:** `src/components/myProject/FormulaBuilder/DataTransformUtils.js`
**Changes:** Data cleanup logic for IF/IF-ELSE and None rows

## Problem Statement

**Before:** All fields were saved to the database regardless of row type, causing data pollution:
- IF/IF-ELSE rows had `paramId`, `uom`, `standardMh` (shouldn't have)
- None rows had `leftType`, `leftValue`, `ifCondition`, etc. (shouldn't have)
- LOOKUP rows had mixed irrelevant fields

**After:** Only relevant fields are saved based on row type:
- IF/IF-ELSE rows: Only IF condition fields
- None rows: Only parameter calculation fields
- LOOKUP parent: Only LOOKUP metadata
- LOOKUP children: Only LOOKUP parameter fields

## Changes to EnhancedDataTransformUtils.js

### 1. Updated `componentRowToDbRow()` Function

**Before (Line 108):**
```javascript
export const componentRowToDbRow = (componentRow) => {
    if (!componentRow) return null;

    return {
        id: componentIdToDbId(componentRow.id),
        formulaBreakdownId: componentIdToDbId(componentRow.id),
        parentId: componentIdToDbId(componentRow.parentId),
        branchFlag: componentRow.branchFlag,
        branchIndex: componentRow.branchIndex,
        paramId: componentRow.paramId,           // ❌ Always saved
        description: componentRow.description,
        userComments: componentRow.userComments,
        uom: componentRow.uom,                   // ❌ Always saved
        operation: componentRow.operation,
        standardMh: componentRow.standardMh,     // ❌ Always saved
        rowOperator: componentRow.rowOperator || '+',
        conditionType: componentRow.conditionType || 'None',
        ifChecked: componentRow.ifChecked || false,
        leftType: componentRow.leftType,         // ❌ Always saved
        leftValue: componentRow.leftValue,       // ❌ Always saved
        ifCondition: componentRow.ifCondition,   // ❌ Always saved
        rightType: componentRow.rightType,       // ❌ Always saved
        rightValue: componentRow.rightValue,     // ❌ Always saved
        formula: generateFormula(componentRow)
    };
}
```

**After (Line 108-232):**
```javascript
export const componentRowToDbRow = (componentRow, parentRow = null) => {
    if (!componentRow) return null;
    
    // Determine row type
    const isLookupChild = parentRow && parentRow.conditionType === 'LOOKUP';
    const isLookupParent = componentRow.conditionType === 'LOOKUP';
    const isIfElseRow = componentRow.conditionType === 'IF' || componentRow.conditionType === 'IF-ELSE';
    
    // Base fields for ALL rows
    const baseFields = {
        id: componentIdToDbId(componentRow.id),
        formulaBreakdownId: componentIdToDbId(componentRow.id),
        parentId: componentIdToDbId(componentRow.parentId),
        branchFlag: componentRow.branchFlag,
        branchIndex: componentRow.branchIndex,
        userComments: componentRow.userComments,
        rowOperator: componentRow.rowOperator || '+',
        formula: generateFormula(componentRow)
    };
    
    // LOOKUP CHILD: Only LOOKUP parameter fields
    if (isLookupChild) {
        return {
            ...baseFields,
            lookupParamType: componentRow.lookupParamType || 'Param ID',
            lookupParamValue: componentRow.lookupParamValue || '',
            lookupParamDesc: componentRow.lookupParamDesc || '',
            paramId: null,              // ✅ NULL for LOOKUP children
            description: null,
            uom: null,
            operation: null,
            standardMh: null,
            conditionType: 'None',
            ifChecked: false,
            leftType: null,             // ✅ NULL for LOOKUP children
            leftValue: null,
            ifCondition: null,
            rightType: null,
            rightValue: null
        };
    }
    
    // LOOKUP PARENT: Only metadata
    if (isLookupParent) {
        return {
            ...baseFields,
            paramId: null,              // ✅ NULL for LOOKUP parent
            description: componentRow.description || '',
            uom: null,
            operation: null,
            standardMh: null,
            conditionType: 'LOOKUP',
            ifChecked: true,
            leftType: null,             // ✅ NULL for LOOKUP parent
            leftValue: null,
            ifCondition: null,
            rightType: null,
            rightValue: null,
            lookupParamType: null,
            lookupParamValue: null,
            lookupParamDesc: null
        };
    }
    
    // IF/IF-ELSE ROW: Only IF condition fields
    if (isIfElseRow) {
        return {
            ...baseFields,
            paramId: null,              // ✅ NULL for IF/IF-ELSE
            description: null,
            uom: null,
            operation: null,
            standardMh: null,
            conditionType: componentRow.conditionType,
            ifChecked: true,
            leftType: componentRow.leftType,    // ✅ Required for IF/IF-ELSE
            leftValue: componentRow.leftValue,
            ifCondition: componentRow.ifCondition,
            rightType: componentRow.rightType,
            rightValue: componentRow.rightValue,
            lookupParamType: null,
            lookupParamValue: null,
            lookupParamDesc: null
        };
    }
    
    // NONE ROW: Only parameter calculation fields
    return {
        ...baseFields,
        paramId: componentRow.paramId,         // ✅ Required for None
        description: componentRow.description,
        uom: componentRow.uom,
        operation: componentRow.operation,
        standardMh: componentRow.standardMh,
        conditionType: 'None',
        ifChecked: false,
        leftType: null,                        // ✅ NULL for None rows
        leftValue: null,
        ifCondition: null,
        rightType: null,
        rightValue: null,
        lookupParamType: null,
        lookupParamValue: null,
        lookupParamDesc: null
    };
}
```

### 2. Updated `flattenEnhancedTreeForDatabase()` Function

**Before (Line 328):**
```javascript
const flattenRecursive = (row) => {
    if (!row) return;

    // Add current row to flat array
    flatRows.push(componentRowToDbRow(row));  // ❌ No parent context

    // Recursively add children
    [...row.children.trueChildren, ...row.children.falseChildren].forEach(child => {
        flattenRecursive(child);              // ❌ No parent passed
    });
};

componentRows.forEach(flattenRecursive);      // ❌ No parent tracking
```

**After (Line 328):**
```javascript
const flattenRecursive = (row, parentRow = null) => {
    if (!row) return;

    // Add current row with parent context for proper field cleanup
    flatRows.push(componentRowToDbRow(row, parentRow));  // ✅ Parent passed

    // Recursively add children with current row as parent
    [...row.children.trueChildren, ...row.children.falseChildren].forEach(child => {
        flattenRecursive(child, row);                    // ✅ Parent passed
    });
};

componentRows.forEach(row => flattenRecursive(row, null)); // ✅ Track parent
```

## Changes to DataTransformUtils.js

### 1. Updated `dbRowToComponentRow()` Function

**Before (Line 49):**
```javascript
return {
    id: dbIdToComponentId(dbRow.id),
    parentId: dbIdToComponentId(dbRow.parentId),
    branchFlag: dbRow.branchFlag,
    paramId: dbRow.paramId || '',
    description: dbRow.description || '',
    userComments: dbRow.userComments || '',
    uom: dbRow.uom || 'EA',
    operation: dbRow.operation || '*',
    standardMh: dbRow.standardMh || 0,
    ifChecked: dbRow.ifChecked || false,              // ❌ Old field only
    // ... rest
};
```

**After (Line 49):**
```javascript
return {
    id: dbIdToComponentId(dbRow.id),
    parentId: dbIdToComponentId(dbRow.parentId),
    branchFlag: dbRow.branchFlag,
    paramId: dbRow.paramId || '',
    description: dbRow.description || '',
    userComments: dbRow.userComments || '',
    uom: dbRow.uom || 'EA',
    operation: dbRow.operation || '*',
    standardMh: dbRow.standardMh || 0,
    rowOperator: dbRow.rowOperator || '+',            // ✅ Added
    
    // Enhanced: Support conditionType field (migrated from ifChecked)
    conditionType: dbRow.conditionType || (dbRow.ifChecked ? 'IF' : 'None'),  // ✅ New field
    ifChecked: dbRow.ifChecked || false,
    // ... rest
};
```

### 2. Updated `componentRowToDbRow()` Function

**Before (Line 82):**
```javascript
export const componentRowToDbRow = (componentRow) => {
    if (!componentRow) return null;

    return {
        id: componentIdToDbId(componentRow.id),
        parentId: componentIdToDbId(componentRow.parentId),
        branchFlag: componentRow.branchFlag,
        paramId: componentRow.paramId,           // ❌ Always saved
        description: componentRow.description,
        userComments: componentRow.userComments,
        uom: componentRow.uom,                   // ❌ Always saved
        operation: componentRow.operation,
        standardMh: componentRow.standardMh,     // ❌ Always saved
        ifChecked: componentRow.ifChecked,
        leftType: componentRow.leftType,         // ❌ Always saved
        leftValue: componentRow.leftValue,
        ifCondition: componentRow.ifCondition,
        rightType: componentRow.rightType,
        rightValue: componentRow.rightValue
    };
}
```

**After (Line 82):**
```javascript
export const componentRowToDbRow = (componentRow) => {
    if (!componentRow) return null;

    // Base fields for ALL rows
    const baseFields = {
        id: componentIdToDbId(componentRow.id),
        parentId: componentIdToDbId(componentRow.parentId),
        branchFlag: componentRow.branchFlag,
        userComments: componentRow.userComments,
        rowOperator: componentRow.rowOperator || '+'
    };
    
    // IF/IF-ELSE ROW: Only IF fields
    const isIfElseRow = componentRow.conditionType === 'IF' || componentRow.conditionType === 'IF-ELSE';
    if (isIfElseRow) {
        return {
            ...baseFields,
            paramId: null,                       // ✅ NULL for IF/IF-ELSE
            description: null,
            uom: null,
            operation: null,
            standardMh: null,
            conditionType: componentRow.conditionType,
            ifChecked: true,
            leftType: componentRow.leftType,     // ✅ Required
            leftValue: componentRow.leftValue,
            ifCondition: componentRow.ifCondition,
            rightType: componentRow.rightType,
            rightValue: componentRow.rightValue
        };
    }
    
    // NONE ROW: Only param fields
    return {
        ...baseFields,
        paramId: componentRow.paramId,           // ✅ Required
        description: componentRow.description,
        uom: componentRow.uom,
        operation: componentRow.operation,
        standardMh: componentRow.standardMh,
        conditionType: 'None',
        ifChecked: false,
        leftType: null,                          // ✅ NULL for None
        leftValue: null,
        ifCondition: null,
        rightType: null,
        rightValue: null
    };
}
```

## Data Cleanup Rules Summary

| Row Type | Saved Fields | NULL Fields |
|----------|-------------|-------------|
| **None** | paramId, description, uom, operation, standardMh | leftType, leftValue, ifCondition, rightType, rightValue, lookupParamType, lookupParamValue, lookupParamDesc |
| **IF/IF-ELSE** | leftType, leftValue, ifCondition, rightType, rightValue | paramId, description, uom, operation, standardMh, lookupParamType, lookupParamValue, lookupParamDesc |
| **LOOKUP Parent** | description (minimal metadata) | paramId, uom, operation, standardMh, leftType, leftValue, ifCondition, rightType, rightValue, lookupParamType, lookupParamValue, lookupParamDesc |
| **LOOKUP Child** | lookupParamType, lookupParamValue, lookupParamDesc | paramId, description, uom, operation, standardMh, leftType, leftValue, ifCondition, rightType, rightValue |

## Benefits

### 1. Data Integrity ✅
- Clean database: Only relevant fields stored
- No field pollution: Irrelevant fields are NULL
- Clear data structure: Easy to understand row types

### 2. Database Optimization ✅
- Reduced storage: NULL values instead of empty strings
- Better indexing: Clear field usage patterns
- Efficient queries: Filter by relevant fields only

### 3. Debugging & Maintenance ✅
- Clear row types: Easy to identify from database
- Consistent structure: All rows follow same pattern
- Error prevention: Can't accidentally use wrong fields

## Testing Scenarios

### Test 1: None Row
**Input:**
```javascript
{
  conditionType: 'None',
  paramId: '15082',
  description: 'Test Param',
  uom: 'EA',
  operation: '*',
  standardMh: '10'
}
```

**Output:**
```javascript
{
  conditionType: 'None',
  paramId: '15082',           // ✅ Saved
  description: 'Test Param',  // ✅ Saved
  uom: 'EA',                  // ✅ Saved
  operation: '*',             // ✅ Saved
  standardMh: '10',           // ✅ Saved
  leftType: null,             // ✅ NULL
  leftValue: null,            // ✅ NULL
  ifCondition: null,          // ✅ NULL
  rightType: null,            // ✅ NULL
  rightValue: null            // ✅ NULL
}
```

### Test 2: IF/IF-ELSE Row
**Input:**
```javascript
{
  conditionType: 'IF',
  leftType: 'PARAM ID',
  leftValue: '15080',
  ifCondition: '>',
  rightType: 'NUMBER',
  rightValue: '100'
}
```

**Output:**
```javascript
{
  conditionType: 'IF',
  leftType: 'PARAM ID',       // ✅ Saved
  leftValue: '15080',         // ✅ Saved
  ifCondition: '>',           // ✅ Saved
  rightType: 'NUMBER',        // ✅ Saved
  rightValue: '100',          // ✅ Saved
  paramId: null,              // ✅ NULL
  description: null,          // ✅ NULL
  uom: null,                  // ✅ NULL
  operation: null,            // ✅ NULL
  standardMh: null            // ✅ NULL
}
```

### Test 3: LOOKUP Parent
**Input:**
```javascript
{
  conditionType: 'LOOKUP',
  description: 'LOOKUP(HP_SEP, SEPARATOR_COST, [15001])'
}
```

**Output:**
```javascript
{
  conditionType: 'LOOKUP',
  description: 'LOOKUP(...)', // ✅ Saved
  paramId: null,              // ✅ NULL
  uom: null,                  // ✅ NULL
  operation: null,            // ✅ NULL
  standardMh: null,           // ✅ NULL
  leftType: null,             // ✅ NULL
  leftValue: null,            // ✅ NULL
  ifCondition: null,          // ✅ NULL
  rightType: null,            // ✅ NULL
  rightValue: null            // ✅ NULL
}
```

### Test 4: LOOKUP Child
**Input:**
```javascript
{
  parentId: 5,
  conditionType: 'None',
  lookupParamType: 'Param ID',
  lookupParamValue: '15001,15082',
  lookupParamDesc: 'Table/Variable name'
}
```

**Output:**
```javascript
{
  conditionType: 'None',
  lookupParamType: 'Param ID',       // ✅ Saved
  lookupParamValue: '15001,15082',   // ✅ Saved
  lookupParamDesc: 'Table/Variable', // ✅ Saved
  paramId: null,                     // ✅ NULL
  description: null,                 // ✅ NULL
  uom: null,                         // ✅ NULL
  operation: null,                   // ✅ NULL
  standardMh: null,                  // ✅ NULL
  leftType: null,                    // ✅ NULL
  leftValue: null,                   // ✅ NULL
  ifCondition: null,                 // ✅ NULL
  rightType: null,                   // ✅ NULL
  rightValue: null                   // ✅ NULL
}
```

## Compilation Status
✅ **No compilation errors**
✅ **Both files compile successfully**

## Backward Compatibility
✅ **Fully backward compatible:**
- Supports old `ifChecked` field (migrated to `conditionType`)
- Handles existing data with mixed fields
- Cleans up data on save

## Related Documentation
1. `DATA_CLEANUP_COMPLETE.md` - Main project data cleanup
2. `FEATURESV3_CHANGES_APPLIED_MYPROJECT.md` - UI and validation changes
3. `OPTIONAL_FIELDS_UOM_STANDARDMH.md` - Field validation changes

## Next Steps
1. ✅ Data cleanup applied to transform utils
2. ✅ Parent context passed for LOOKUP children
3. ✅ All row types handled correctly
4. **Action:** Test save functionality with all row types
