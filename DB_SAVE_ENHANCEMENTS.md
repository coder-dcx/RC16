# Database Save Enhancements

## Overview
Enhanced the database save functionality to include `rowOperator` and `formulaPreview` fields in the flat structure output.

## Changes Made:

### 1. EnhancedDataTransformUtils.js

#### A. componentRowToDbRow Function
**Added Field:**
```javascript
rowOperator: componentRow.rowOperator || '+', // Row-level operator for combining rows
```

**Updated Comment:**
```javascript
// Note: isExpanded, hasChildren, children, and formula (calculated field) are NOT saved to DB
```

#### B. dbRowToComponentRow Function
**Added Field:**
```javascript
rowOperator: dbRow.rowOperator || '+', // Row-level operator for combining rows
```

This ensures the rowOperator is:
- ✅ Saved to database when exporting
- ✅ Loaded from database when importing
- ✅ Has default value of '+' for backward compatibility

### 2. FeaturesV3.js - saveData Function

**Enhanced Database Output:**
```javascript
// Enhance database data with formula preview for each row
const enhancedDbData = dbData.map(dbRow => {
    // Find the original component row to generate its formula
    const findRowById = (rows, id) => {
        for (const row of rows) {
            if (row.id === id) return row;
            const trueResult = findRowById(row.children.trueChildren, id);
            if (trueResult) return trueResult;
            const falseResult = findRowById(row.children.falseChildren, id);
            if (falseResult) return falseResult;
        }
        return null;
    };
    
    const componentRow = findRowById(rows, dbRow.id);
    const formula = componentRow ? generateFormula(componentRow) : 'N/A';
    
    return {
        ...dbRow,
        formulaPreview: formula // Add formula preview to each row
    };
});
```

## Database Output Structure:

### Before (Missing Fields):
```json
{
  "id": 1,
  "parentId": null,
  "paramId": "17132",
  "operation": "*",
  "standardMH": "84",
  "conditionType": "None",
  ...
}
```

### After (With New Fields):
```json
{
  "id": 1,
  "parentId": null,
  "paramId": "17132",
  "operation": "*",
  "standardMH": "84",
  "rowOperator": "+",
  "conditionType": "None",
  "formulaPreview": "[17132] * 84",
  ...
}
```

## Benefits:

### 1. rowOperator Field
✅ **Persistent Storage**: Row operators are now saved and restored
✅ **Backward Compatible**: Defaults to '+' if not present
✅ **Round-trip Support**: Export and import maintain operator settings

### 2. formulaPreview Field
✅ **Debugging**: Easy to see formula for each row in database
✅ **Documentation**: Human-readable formula in flat structure
✅ **Validation**: Can verify formulas match expectations
✅ **Reporting**: Formula preview available for database queries

## Example Console Output:

```javascript
=== FeaturesV3 Data Export ===
Validation Status: PASSED ✅
Complete Formula: ([17132] * 84) + ([17133] * 84) * ([17134] * 1)
Rows Data (Component Format): [...]
Total Rows: 3

��� Rows Data for DB (Flat Structure):
[
  {
    "id": 1,
    "parentId": null,
    "paramId": "17132",
    "operation": "*",
    "standardMH": "84",
    "rowOperator": "+",
    "conditionType": "None",
    "formulaPreview": "[17132] * 84"
  },
  {
    "id": 2,
    "parentId": null,
    "paramId": "17133",
    "operation": "*",
    "standardMH": "84",
    "rowOperator": "+",
    "conditionType": "None",
    "formulaPreview": "[17133] * 84"
  },
  {
    "id": 3,
    "parentId": null,
    "paramId": "17134",
    "operation": "*",
    "standardMH": "1",
    "rowOperator": "*",
    "conditionType": "None",
    "formulaPreview": "[17134] * 1"
  }
]
��� Database Rows Count: 3
✅ Database transformation completed successfully!
```

## Usage:

1. **Build your formula** with conditions and operators
2. **Click "Save Data"** button
3. **Open browser console** (F12)
4. **View flat structure** with:
   - ✅ All row operators preserved
   - ✅ Individual formula preview for each row
   - ✅ Complete combined formula at top

## Notes:

- `formulaPreview` is calculated dynamically during save (not stored in component state)
- Each row's formula includes its own operations and conditions
- Nested formulas (IF, IF-ELSE, LOOKUP) are fully rendered in preview
- Root rows show their complete formula including all children
