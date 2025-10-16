# LOOKUP Parameter Types Enhancement - Design Document

## Overview
Enhance LOOKUP parameters to support multiple value types with dynamic UI and proper data structure.

## Current vs New

### Current State:
```javascript
// LOOKUP child row
{
  id: 6,
  parentId: 5,
  branchFlag: true,
  branchIndex: 0,
  paramId: "15001",  // Simple string
  // ... other fields
}

// Formula: LOOKUP([15001], ...)
```

### New State:
```javascript
// LOOKUP child row
{
  id: 6,
  parentId: 5,
  branchFlag: true,
  branchIndex: 0,
  
  // NEW: Parameter type and type-specific fields
  paramType: "PARAM_ID",  // Type selector
  
  // For PARAM_ID type:
  paramIds: ["15080", "15081", "15082"],  // Multiple params
  paramDescription: "Description for params",
  
  // For STRING type:
  stringValue: "HRSG_FIXED_MATL_COST",
  
  // For NUMBER type:
  numberValue: "10.3",
  
  // For VARIABLE type:
  variableName: "HP_SEP",
  variableDescription: "Variable description",
  
  // For ML_CODE type:
  mlCode: "ML_CODE",
  mlCodeDescription: "ML code description",
  
  // For LOOKUP type (nested):
  nestedLookup: { /* Recursive LOOKUP structure */ },
  
  // Keep for backward compatibility
  paramId: "[15080][15081][15082]",  // Generated from paramIds
  
  userComments: "...",
}

// Formula: LOOKUP([15080][15081][15082], ...)
```

## Parameter Types

| Type | Example | UI Components | Storage |
|------|---------|---------------|---------|
| **PARAM_ID** | `[15001]` or `[15080][15081][15082]` | Multi-select Autocomplete | `paramIds: ['15080', '15081']` |
| **STRING** | `'HRSG_FIXED_MATL_COST'` | Text input with quotes | `stringValue: 'HRSG_FIXED_MATL_COST'` |
| **NUMBER** | `10.3` | Number input | `numberValue: '10.3'` |
| **VARIABLE** | `HP_SEP` | Dropdown (predefined list) | `variableName: 'HP_SEP'` |
| **ML_CODE** | `{ML_CODE}` | Text input (auto-braces) | `mlCode: 'ML_CODE'` |
| **LOOKUP** | `LOOKUP(...)` | Recursive LOOKUP builder | `nestedLookup: {...}` |

## Data Structure

### Row Object for LOOKUP Child:
```javascript
{
  // Existing fields
  id: 6,
  parentId: 5,
  branchFlag: true,
  branchIndex: 0,
  conditionType: "None",
  uom: "EA",
  operation: "*",
  standardMh: "",
  rowOperator: "+",
  
  // NEW: Parameter Type System
  paramType: "PARAM_ID" | "STRING" | "NUMBER" | "VARIABLE" | "ML_CODE" | "LOOKUP",
  
  // Type-specific fields (only one set used based on paramType)
  
  // PARAM_ID fields:
  paramIds: ["15080", "15081", "15082"],
  paramDescription: "Parameter description",
  
  // STRING fields:
  stringValue: "HRSG_FIXED_MATL_COST",
  
  // NUMBER fields:
  numberValue: "10.3",
  
  // VARIABLE fields:
  variableName: "HP_SEP",
  variableDescription: "Variable description",
  
  // ML_CODE fields:
  mlCode: "ML_CODE",
  mlCodeDescription: "ML code description",
  
  // LOOKUP fields:
  nestedLookupParams: [ /* array of nested param objects */ ],
  
  // Backward compatibility (generated/computed field)
  paramId: "[15080][15081][15082]",  // Auto-generated from type-specific fields
  
  userComments: "User comments",
}
```

## UI Components

### 1. Parameter Type Selector
```jsx
<FormControl>
  <InputLabel>Param Type</InputLabel>
  <Select value={row.paramType} onChange={handleTypeChange}>
    <MenuItem value="PARAM_ID">Param ID</MenuItem>
    <MenuItem value="STRING">String</MenuItem>
    <MenuItem value="NUMBER">Number</MenuItem>
    <MenuItem value="VARIABLE">Variable</MenuItem>
    <MenuItem value="ML_CODE">ML Code</MenuItem>
    <MenuItem value="LOOKUP">Nested LOOKUP</MenuItem>
  </Select>
</FormControl>
```

### 2. Conditional Field Rendering

#### For PARAM_ID:
```jsx
{row.paramType === 'PARAM_ID' && (
  <>
    <Autocomplete
      multiple
      value={row.paramIds || []}
      options={paramIdOptions}
      renderInput={(params) => <TextField {...params} label="Param IDs" />}
    />
    <TextField label="Description" value={row.paramDescription} />
    <TextField label="Comment" value={row.userComments} />
  </>
)}
```

#### For STRING:
```jsx
{row.paramType === 'STRING' && (
  <>
    <TextField 
      label="String Value" 
      value={row.stringValue}
      placeholder="e.g., HRSG_FIXED_MATL_COST"
      pattern="[A-Za-z0-9_]+"
    />
    <TextField label="Comment" value={row.userComments} />
  </>
)}
```

#### For NUMBER:
```jsx
{row.paramType === 'NUMBER' && (
  <>
    <TextField 
      label="Number Value" 
      type="number"
      value={row.numberValue}
      placeholder="e.g., 10.3"
    />
    <TextField label="Comment" value={row.userComments} />
  </>
)}
```

#### For VARIABLE:
```jsx
{row.paramType === 'VARIABLE' && (
  <>
    <Autocomplete
      value={row.variableName}
      options={variableOptions}
      renderInput={(params) => <TextField {...params} label="Variable" />}
    />
    <TextField label="Variable Description" value={row.variableDescription} />
    <TextField label="Comment" value={row.userComments} />
  </>
)}
```

#### For ML_CODE:
```jsx
{row.paramType === 'ML_CODE' && (
  <>
    <TextField 
      label="ML Code" 
      value={row.mlCode}
      placeholder="e.g., ML_CODE"
      helperText="Will be formatted as {ML_CODE}"
    />
    <TextField label="ML Description" value={row.mlCodeDescription} />
    <TextField label="Comment" value={row.userComments} />
  </>
)}
```

#### For LOOKUP (Nested):
```jsx
{row.paramType === 'LOOKUP' && (
  <div style={{ border: '2px dashed #ff9800', padding: '10px' }}>
    <Typography>Nested LOOKUP Parameters:</Typography>
    {/* Recursive rendering of LOOKUP parameters */}
    <Button onClick={addNestedParam}>+ Add Parameter</Button>
  </div>
)}
```

## Formula Generation

### generateLookupParameter Function:
```javascript
const generateLookupParameter = (param) => {
  switch (param.paramType) {
    case 'PARAM_ID':
      // [15080][15081][15082]
      return param.paramIds.map(id => `[${id}]`).join('');
    
    case 'STRING':
      // 'HRSG_FIXED_MATL_COST'
      return `'${param.stringValue}'`;
    
    case 'NUMBER':
      // 10.3
      return param.numberValue;
    
    case 'VARIABLE':
      // HP_SEP
      return param.variableName;
    
    case 'ML_CODE':
      // {ML_CODE}
      return `{${param.mlCode}}`;
    
    case 'LOOKUP':
      // Recursive: LOOKUP(...)
      return generateNestedLookupFormula(param.nestedLookupParams);
    
    default:
      return 'UNKNOWN';
  }
};
```

### Updated LOOKUP Formula Generation:
```javascript
if (row.conditionType === 'LOOKUP') {
  const children = row.children?.trueChildren || [];
  const params = children.map(child => generateLookupParameter(child));
  return `LOOKUP(${params.join(', ')})`;
}
```

## Database Format

### Flat Structure for DB:
```javascript
{
  id: 6,
  parentId: 5,
  branchFlag: true,
  branchIndex: 0,
  
  // Parameter type fields
  paramType: "PARAM_ID",
  paramIds: "15080,15081,15082",  // Comma-separated for DB
  paramDescription: "Description",
  stringValue: null,
  numberValue: null,
  variableName: null,
  variableDescription: null,
  mlCode: null,
  mlCodeDescription: null,
  nestedLookupData: null,  // JSON string for nested lookup
  
  // Computed field for backward compatibility
  paramId: "[15080][15081][15082]",
  
  userComments: "...",
  formulaPreview: "[15080][15081][15082]"
}
```

## Implementation Steps

### Phase 1: Data Model (Priority: High)
1. ✅ Update `createNewRow()` to include parameter type fields
2. ✅ Add parameter type constants
3. ✅ Update validation to handle new fields

### Phase 2: UI Components (Priority: High)
1. ✅ Add parameter type dropdown to LOOKUP children
2. ✅ Create conditional rendering for each type
3. ✅ Add multi-select support for PARAM_ID
4. ✅ Add validation for each input type

### Phase 3: Formula Generation (Priority: High)
1. ✅ Update `generateLookupParameter()` function
2. ✅ Handle all parameter types
3. ✅ Support nested LOOKUP

### Phase 4: Database Transform (Priority: High)
1. ✅ Update `componentRowToDbRow()` for new fields
2. ✅ Update `dbRowToComponentRow()` for loading
3. ✅ Handle serialization (arrays, nested objects)

### Phase 5: Variables & ML Codes (Priority: Medium)
1. ⏳ Create variable options list
2. ⏳ Create ML code management
3. ⏳ Add autocomplete for variables

### Phase 6: Nested LOOKUP (Priority: Low)
1. ⏳ Implement recursive LOOKUP UI
2. ⏳ Handle nested formula generation
3. ⏳ Add validation for nested structures

## Backward Compatibility

### Migration Strategy:
```javascript
// Auto-detect existing paramId values and convert
const migrateOldLookupParam = (row) => {
  if (!row.paramType && row.paramId) {
    // Detect type from paramId format
    if (row.paramId.match(/^\[[\d,\]]+$/)) {
      // [15001] or [15080][15081]
      row.paramType = 'PARAM_ID';
      row.paramIds = row.paramId.match(/\[(\d+)\]/g).map(m => m.slice(1, -1));
    } else if (row.paramId.match(/^'.*'$/)) {
      // 'STRING'
      row.paramType = 'STRING';
      row.stringValue = row.paramId.slice(1, -1);
    } else if (row.paramId.match(/^\d+\.?\d*$/)) {
      // 10.3
      row.paramType = 'NUMBER';
      row.numberValue = row.paramId;
    } else if (row.paramId.match(/^{.*}$/)) {
      // {ML_CODE}
      row.paramType = 'ML_CODE';
      row.mlCode = row.paramId.slice(1, -1);
    } else {
      // Variable
      row.paramType = 'VARIABLE';
      row.variableName = row.paramId;
    }
  }
  return row;
};
```

## Example Scenarios

### Scenario 1: Multiple Param IDs
```
Input: [15080][15081][15082]
paramType: "PARAM_ID"
paramIds: ["15080", "15081", "15082"]
Formula: LOOKUP([15080][15081][15082], ...)
```

### Scenario 2: String Value
```
Input: 'HRSG_FIXED_MATL_COST'
paramType: "STRING"
stringValue: "HRSG_FIXED_MATL_COST"
Formula: LOOKUP('HRSG_FIXED_MATL_COST', ...)
```

### Scenario 3: ML Code
```
Input: {ML_CODE}
paramType: "ML_CODE"
mlCode: "ML_CODE"
Formula: LOOKUP({ML_CODE}, ...)
```

### Scenario 4: Mixed Types
```
LOOKUP([15080], 'CO_CATALYST_COST', {ML_CODE}, 10.3, HP_SEP)

Param 1: paramType="PARAM_ID", paramIds=["15080"]
Param 2: paramType="STRING", stringValue="CO_CATALYST_COST"
Param 3: paramType="ML_CODE", mlCode="ML_CODE"
Param 4: paramType="NUMBER", numberValue="10.3"
Param 5: paramType="VARIABLE", variableName="HP_SEP"
```

## Testing Checklist

- [ ] Create LOOKUP with PARAM_ID (single)
- [ ] Create LOOKUP with PARAM_ID (multiple)
- [ ] Create LOOKUP with STRING
- [ ] Create LOOKUP with NUMBER
- [ ] Create LOOKUP with VARIABLE
- [ ] Create LOOKUP with ML_CODE
- [ ] Create LOOKUP with mixed types
- [ ] Test formula generation for all types
- [ ] Test save/load with new structure
- [ ] Test backward compatibility
- [ ] Test nested LOOKUP (future)

## Notes

- This is a major enhancement requiring careful implementation
- Start with Phase 1-4 (data model, UI, formula, database)
- Phases 5-6 can be added incrementally
- Maintain backward compatibility throughout
- Consider performance with many LOOKUP parameters
- Add proper validation for each type
