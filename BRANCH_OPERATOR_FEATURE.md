# Branch Operator Feature Implementation

## Overview
Extended the row-level operator feature to TRUE and FALSE branch children, allowing flexible combination of children within conditional branches.

## Changes Made:

### 1. Formula Generation (generateChildrenFormula)

**Before:**
```javascript
const generateChildrenFormula = (children) => {
    if (children.length === 0) return 'NO_FORMULA';
    if (children.length === 1) return generateFormula(children[0]);
    return `(${children.map(child => generateFormula(child)).join(' + ')})`;
};
```

**After:**
```javascript
const generateChildrenFormula = (children) => {
    if (children.length === 0) return 'NO_FORMULA';
    if (children.length === 1) return generateFormula(children[0]);
    
    // Build formula using each child's rowOperator
    let formula = `(${generateFormula(children[0])})`;
    for (let i = 1; i < children.length; i++) {
        const childOperator = children[i].rowOperator || '+';
        formula += ` ${childOperator} (${generateFormula(children[i])})`;
    }
    return formula;
};
```

### 2. UI Component
- Added "Row Op" dropdown for child rows in TRUE/FALSE branches
- Position: After the TRUE/FALSE indicator icon
- Shows only for children with index > 0 (2nd child onwards)
- Same options as root rows: +, ×, ÷, −

## Example Formulas:

### IF Condition with Multiple TRUE Children:
```javascript
IF([1000] = 'A', ([2000] * 10) + ([3000] * 20) * ([4000] * 30))
```
- TRUE Child 1: `[2000] * 10` (no operator dropdown)
- TRUE Child 2: `[3000] * 20` (operator: +)
- TRUE Child 3: `[4000] * 30` (operator: *)

### IF-ELSE Condition with Multiple Children in Both Branches:
```javascript
IF([1000] > 100, 
    ([2000] * 5) + ([3000] * 10), 
    ([4000] * 2) - ([5000] * 3) / ([6000] * 1)
)
```
- TRUE Branch:
  - Child 1: `[2000] * 5`
  - Child 2: `[3000] * 10` (operator: +)
  
- FALSE Branch:
  - Child 1: `[4000] * 2`
  - Child 2: `[5000] * 3` (operator: -)
  - Child 3: `[6000] * 1` (operator: /)

### LOOKUP with Nested IF (Complex Example):
```javascript
LOOKUP([1000], 
    ([2000] * 10) + ([3000] * 20), 
    IF([4000] = 'X', ([5000] * 1) * ([6000] * 2), ([7000] * 3))
)
```

## Usage:

### For Root Rows:
1. Add multiple rows with "Add Row" button
2. From 2nd row onwards, select operator from "Row Op" dropdown

### For TRUE Branch Children:
1. Select condition type (IF or IF-ELSE)
2. Add multiple children to TRUE branch using + button
3. From 2nd child onwards, select operator from "Row Op" dropdown

### For FALSE Branch Children:
1. Select IF-ELSE condition type
2. Add multiple children to FALSE branch using + button
3. From 2nd child onwards, select operator from "Row Op" dropdown

## Visual Layout:

```
Root Rows:
[↓] [Param ID] [Description] [UOM] [Operation] [Standard] [Condition] [Formula] [Comment] [Delete]
[↓] [Row Op] [Param ID] ...  (2nd root row onwards)

TRUE/FALSE Children:
    [✓/✗ 1] [Param ID] [Description] ...  (1st child)
    [✓/✗ 2] [Row Op] [Param ID] ...       (2nd child onwards)
    [✓/✗ 3] [Row Op] [Param ID] ...       (3rd child onwards)
```

## Technical Notes:
- First child in any branch never shows operator dropdown
- Default operator is '+' for backward compatibility
- Operators apply left-to-right in formula generation
- Works for all condition types: IF, IF-ELSE
- LOOKUP children also support operators (for nested conditions)

## Benefits:
✅ Maximum flexibility in formula construction
✅ Supports complex mathematical expressions
✅ Independent operator control for each branch
✅ Consistent UI across root rows and child rows
✅ Real-time formula preview updates
