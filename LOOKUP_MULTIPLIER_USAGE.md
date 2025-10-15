# LOOKUP with Multipliers - Usage Guide

## Feature Overview
FeaturesV3 now supports applying operations to LOOKUP results, enabling formulas like:
```
LOOKUP(RATE, INSTRUMENTS, {ML_CODE}, CHAMBERS) * [1944] * IF([1909]='YES', 1+0.5, 1)
```

## How to Create LOOKUP with Multipliers

### Step 1: Create the LOOKUP Parent Row
1. Set **Condition Type** to `LOOKUP`
2. Set the parent row's **Param ID** (optional) - e.g., `1944`
3. Set the parent row's **Operation** - e.g., `*`
4. Set the parent row's **Standard MH/UOM** - e.g., `1.5` or leave empty

### Step 2: Add LOOKUP Parameters as Children
All children become LOOKUP parameters:
- **Param 1**: RATE (table name)
- **Param 2**: INSTRUMENTS (column name)
- **Param 3**: {ML_CODE} (lookup key)
- **Param 4**: CHAMBERS (additional parameter)

### Step 3: Understand the Formula Generation

#### Case 1: LOOKUP only (no parent multipliers)
Parent: Param ID = empty, Standard MH = empty
```
LOOKUP(RATE, INSTRUMENTS, {ML_CODE}, CHAMBERS)
```

#### Case 2: LOOKUP with parent's Standard MH
Parent: Param ID = empty, Operation = `*`, Standard MH = `1.5`
```
LOOKUP(RATE, INSTRUMENTS, {ML_CODE}, CHAMBERS) * 1.5
```

#### Case 3: LOOKUP with parent's Param ID
Parent: Param ID = `1944`, Operation = empty, Standard MH = empty
```
LOOKUP(RATE, INSTRUMENTS, {ML_CODE}, CHAMBERS) * [1944]
```

#### Case 4: LOOKUP with both (your example)
Parent: Param ID = `1944`, Operation = `*`, Standard MH = `1.5`
```
LOOKUP(RATE, INSTRUMENTS, {ML_CODE}, CHAMBERS) * 1.5 * [1944]
```

## Advanced: Nested IF as Multiplier

To create: `LOOKUP(...) * [1944] * IF([1909]='YES', 1+0.5, 1)`

You need to create TWO rows:
1. **LOOKUP Row** with Param ID = `1944`
2. **Separate IF Row** with the IF condition

Then combine them manually or create a parent row that adds both.

## Current Behavior

- **All children** of a LOOKUP parent are treated as LOOKUP parameters
- Parent row's **Param ID** is multiplied with the LOOKUP result
- Parent row's **Operation + Standard MH** are applied to the LOOKUP result
- Order: `LOOKUP(params) * standardMH * [paramId]`

## Examples in FeaturesV3

### Example 1: Simple LOOKUP
```
Parent Row:
- Condition: LOOKUP
- Param ID: (empty)
- Standard MH: (empty)

Children:
- Param 1: HP_SEP
- Param 2: SEPARATOR_COST  
- Param 3: [15001]

Result: LOOKUP(HP_SEP, SEPARATOR_COST, [15001])
```

### Example 2: LOOKUP with Multiplier
```
Parent Row:
- Condition: LOOKUP
- Param ID: 1944
- Operation: *
- Standard MH: 2.5

Children:
- Param 1: RATE
- Param 2: INSTRUMENTS
- Param 3: {ML_CODE}
- Param 4: CHAMBERS

Result: LOOKUP(RATE, INSTRUMENTS, {ML_CODE}, CHAMBERS) * 2.5 * [1944]
```

## Notes
- The parent's operation and standardMH are applied BEFORE the paramId multiplication
- If you need complex multipliers (like nested IF), consider adding them as separate rows
- All children are ALWAYS treated as LOOKUP parameters, not multipliers
