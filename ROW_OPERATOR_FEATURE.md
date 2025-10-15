# Row Operator Feature Implementation

## Overview
Added row-level operator dropdown to control how multiple root rows are combined in the formula.

## Changes Made:

### 1. Data Model (createNewRow)
- Added `rowOperator: '+'` field to store the operator for each row
- Default value is '+' (addition)

### 2. Formula Generation (generateCompleteFormula)
**Before:**
```javascript
return rows.map(row => `(${generateFormula(row)})`).join(' + ');
```

**After:**
```javascript
let formula = `(${generateFormula(rows[0])})`;
for (let i = 1; i < rows.length; i++) {
    const rowOperator = rows[i].rowOperator || '+';
    formula += ` ${rowOperator} (${generateFormula(rows[i])})`;
}
return formula;
```

### 3. UI Component
- Added "Row Operator" dropdown for root rows (except the first one)
- Position: After the expand/collapse toggle
- Width: 60px (w60 class)
- Options: + (addition), × (multiplication), ÷ (division), − (subtraction)
- Label: "Row Op"

### 4. Row Rendering
- Updated `renderRow` function to accept `rowIndex` parameter
- Only shows dropdown when `!isChild && rowIndex > 0`
- Updated `rows.map` to pass row index: `rows.map((row, index) => renderRow(row, false, null, index))`

## Example Formulas:

### Before (all with +):
```
([17132] * 84) + ([17133] * 84) + ([17134] * 1)
```

### After (mixed operators):
```
([17132] * 84) + ([17133] * 84) * ([17134] * 1) / ([17135] * 1)
```

## Usage:
1. Add multiple root rows using "Add Row" button
2. For row 2 onwards, select the operator from "Row Op" dropdown
3. Operators determine how that row combines with the formula so far
4. Formula updates in real-time

## Technical Notes:
- First root row never shows the dropdown (nothing to combine with yet)
- Child rows don't show the dropdown (they use their parent's combination logic)
- Default operator is '+' for backward compatibility
- Operators: +, *, /, -
