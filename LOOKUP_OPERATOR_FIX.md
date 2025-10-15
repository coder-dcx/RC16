# LOOKUP Children Operator Fix

## Issue
Row operator dropdown was appearing for LOOKUP children, but LOOKUP children are parameters (not calculations), so they should not have operators between them.

## Problem Example (Before Fix):
```
LOOKUP Children:
  � Param 1: [1000]
  � Param 2: [Row Op] [2000]  ← Should NOT have operator
  � Param 3: [Row Op] [3000]  ← Should NOT have operator
```

LOOKUP parameters are comma-separated, not operator-separated:
```
LOOKUP([1000], [2000], [3000])  ← Correct
```

NOT:
```
LOOKUP([1000] + [2000] * [3000])  ← Wrong!
```

## Solution

### 1. Updated renderRow Function Signature
**Added `parentConditionType` parameter:**
```javascript
const renderRow = (row, isChild = false, childIndex = null, rowIndex = 0, parentConditionType = null)
```

### 2. Updated Child Rendering Call
**Pass parent's condition type to children:**
```javascript
{renderRow(child, true, index, 0, row.conditionType)}
```

### 3. Updated Operator Dropdown Condition
**Exclude LOOKUP children from showing operator:**
```javascript
{/* Row Operator for child rows (not first child, and not LOOKUP children) */}
{isChild && childIndex > 0 && parentConditionType !== 'LOOKUP' && (
    <div className='col-block w60'>
        <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel>Row Op</InputLabel>
            <Select...>
```

## Behavior After Fix:

### LOOKUP Children (No Operators):
```
LOOKUP Children:
  � Param 1: [1000]
  � Param 2: [2000]      ← No operator dropdown
  � Param 3: [3000]      ← No operator dropdown
```
**Formula:** `LOOKUP([1000], [2000], [3000])`

### IF/IF-ELSE TRUE Branch (Has Operators):
```
TRUE Branch:
  ✓ 1: [1000] * 10
  ✓ 2: [Row Op +] [2000] * 20    ← Has operator dropdown
  ✓ 3: [Row Op *] [3000] * 30    ← Has operator dropdown
```
**Formula:** `([1000] * 10) + ([2000] * 20) * ([3000] * 30)`

### IF-ELSE FALSE Branch (Has Operators):
```
FALSE Branch:
  ✗ 1: [4000] * 5
  ✗ 2: [Row Op -] [5000] * 10    ← Has operator dropdown
```
**Formula:** `([4000] * 5) - ([5000] * 10)`

## Operator Dropdown Visibility Rules:

| Row Type | Position | Parent Type | Show Operator? |
|----------|----------|-------------|----------------|
| Root Row | 1st | N/A | ❌ No |
| Root Row | 2nd+ | N/A | ✅ Yes |
| Child | 1st | IF/IF-ELSE | ❌ No |
| Child | 2nd+ | IF/IF-ELSE | ✅ Yes |
| Child | 1st | LOOKUP | ❌ No |
| Child | 2nd+ | LOOKUP | ❌ No (FIXED!) |

## Key Points:

✅ LOOKUP parameters are comma-separated
✅ IF/IF-ELSE children can have operators
✅ Root rows can have operators
✅ First child/row never has operator (nothing to combine with)
✅ Parent condition type determines child operator visibility

## Example Formulas:

### Valid LOOKUP (Parameters):
```javascript
LOOKUP([1000], PP_TABLE, [2000], {ml_code}, [3000])
```

### Valid IF with Operators:
```javascript
IF([1000] = 'A', ([2000] * 10) + ([3000] * 20) * ([4000] * 30))
```

### Valid IF-ELSE with Operators:
```javascript
IF([1000] > 100, 
    ([2000] * 5) + ([3000] * 10), 
    ([4000] * 2) - ([5000] * 3)
)
```

### Valid Root Rows with Operators:
```javascript
([1000] * 10) + ([2000] * 20) * ([3000] * 30)
```

## Testing:

1. ✅ Create LOOKUP condition
2. ✅ Add 3+ parameters
3. ✅ Verify NO "Row Op" dropdown appears for 2nd+ params
4. ✅ Create IF condition  
5. ✅ Add 3+ children to TRUE branch
6. ✅ Verify "Row Op" dropdown DOES appear for 2nd+ children
7. ✅ Create IF-ELSE condition
8. ✅ Add 3+ children to FALSE branch
9. ✅ Verify "Row Op" dropdown DOES appear for 2nd+ children
