# Optional Fields: UOM and Standard MH

## Overview
This document describes the changes made to make UOM and Standard MH fields optional for all row types (including children rows).

## Implementation Date
October 17, 2025

## Changes Made

### 1. Validation Logic Update (FeaturesV3.js - Line ~238-268)

**Before:**
```javascript
// None: Validate basic fields (BUT NOT for IF/IF-ELSE children where fields are disabled)
if (row.conditionType === 'None' && !isIfElseChild) {
    if (!row.uom || row.uom.trim() === '') {
        errors[`${rowPath}.uom`] = 'UOM is required';
    }
    if (!row.operation || row.operation.trim() === '') {
        errors[`${rowPath}.operation`] = 'Operation is required';
    }
    if (row.standardMh === null || row.standardMh === undefined || row.standardMh === '') {
        errors[`${rowPath}.standardMh`] = 'Standard MH/UOM is required';
    } else {
        // Format validation...
    }
}
```

**After:**
```javascript
// None: Validate basic fields (BUT NOT for IF/IF-ELSE children where fields are disabled)
if (row.conditionType === 'None' && !isIfElseChild) {
    // UOM is now optional - no validation required
    
    if (!row.operation || row.operation.trim() === '') {
        errors[`${rowPath}.operation`] = 'Operation is required';
    }
    
    // Standard MH is now optional - only validate format if provided
    if (row.standardMh !== null && row.standardMh !== undefined && row.standardMh !== '') {
        // Format validation still applies when value is provided
        const operation = row.operation;
        if (operation === 'Number') {
            const mathRegex = /^[0-9+\-*/.()]+$/;
            if (!mathRegex.test(row.standardMh)) {
                errors[`${rowPath}.standardMh`] = 'Standard MH/UOM must contain only numbers...';
            }
        }
        // ... other format validations
    }
}
```

### 2. Key Changes

#### UOM Field
- **Status:** Now optional for all rows (parent and children)
- **Validation:** No validation required
- **Behavior:** Users can leave UOM empty when not needed

#### Standard MH Field
- **Status:** Now optional for all rows (parent and children)
- **Validation:** 
  - No required validation
  - Format validation still applies when value is provided
  - If user enters a value, it must match the operation type rules:
    - `Number` operation: Must contain only numbers and math operators
    - `String` operation: Must contain only letters, underscore, dash, single spaces
- **Behavior:** Users can leave Standard MH empty when not needed

## User Experience Flow

### Before (Mandatory Fields)
1. User adds row with `conditionType = None`
2. User must fill UOM field → Error if empty
3. User must fill Standard MH field → Error if empty
4. Cannot save without both fields populated

### After (Optional Fields)
1. User adds row with `conditionType = None`
2. User can optionally fill UOM field → No error if empty ✅
3. User can optionally fill Standard MH field → No error if empty ✅
4. If Standard MH is filled, format validation still applies
5. Can save with empty UOM and/or empty Standard MH

## Applies To

This change applies to:
- **Parent rows** with `conditionType = 'None'`
- **Children rows** (all types):
  - None children (nested under any parent)
  - IF/IF-ELSE children (true/false branches)
  - LOOKUP children (parameters)
  
Note: IF/IF-ELSE/LOOKUP parent rows don't show these fields (already hidden in UI)

## Validation Rules Summary

| Field | Required? | Format Validation |
|-------|-----------|-------------------|
| Row Operator | ✅ Yes | Must be +, -, *, / |
| Condition Type | ✅ Yes | None, IF, IF-ELSE, LOOKUP |
| Param ID | ✅ Yes (for None rows only) | Must be valid parameter ID |
| Description | Auto-populated | N/A |
| **UOM** | ❌ No | None |
| Operation | ✅ Yes | *, /, +, -, Number, String |
| **Standard MH** | ❌ No | Only if value provided |
| Comments | ❌ No | None |

## Testing

### Test Case 1: Empty UOM Field
1. Add new row with `conditionType = None`
2. Fill Param ID, Operation
3. Leave UOM empty
4. Leave Standard MH empty
5. Click "Save Data"
6. **Expected:** Data saves successfully without validation errors ✅

### Test Case 2: Empty Standard MH Field
1. Add new row with `conditionType = None`
2. Fill Param ID, Operation, UOM
3. Leave Standard MH empty
4. Click "Save Data"
5. **Expected:** Data saves successfully without validation errors ✅

### Test Case 3: Standard MH Format Validation Still Works
1. Add new row with `conditionType = None`
2. Fill Param ID, Operation = `*` (multiply)
3. Enter Standard MH = `abc` (invalid for Number operation)
4. Click "Save Data"
5. **Expected:** Validation error: "Standard MH/UOM must contain only numbers and math operators" ⚠️

### Test Case 4: Children Rows Also Optional
1. Create IF row with child
2. In child row, leave UOM empty
3. In child row, leave Standard MH empty
4. Click "Save Data"
5. **Expected:** Data saves successfully without validation errors ✅

## Console Output Example

### Successful Save (Empty Optional Fields)
```javascript
Rows Data for DB (Flat Structure): [
  {
    "id": 1,
    "conditionType": "None",
    "paramId": "15082",
    "description": "15082 - Parameter",
    "uom": "",              // ✅ Empty UOM allowed
    "operation": "*",
    "standardMh": "",       // ✅ Empty Standard MH allowed
    "userComments": ""      // ✅ Empty comment allowed
  }
]
```

### Validation Error (Invalid Format When Provided)
```javascript
Validation Errors:
{
  "1.standardMh": "Standard MH/UOM must contain only numbers and math operators (+, -, *, /, ., (, ))"
}
```

## Implementation Files
- **FeaturesV3.js** (Line ~238-268): Removed required validation for UOM and Standard MH

## Backward Compatibility
- Existing data with populated UOM/Standard MH fields: ✅ Works normally
- Existing data with empty UOM/Standard MH fields: ✅ Now valid (previously would error)
- Format validation: ✅ Still enforced when values are provided

## Notes
- Operation field remains mandatory (needed to determine Standard MH format validation)
- Format validation for Standard MH only runs when a value is provided
- This aligns with the flexible validation approach used for Comments field
