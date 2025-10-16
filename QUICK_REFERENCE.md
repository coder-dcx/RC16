# LOOKUP Typed Parameters - Quick Reference

## 🚀 Quick Start

### Creating a LOOKUP with Typed Parameters:
1. Add new row
2. Select "LOOKUP" from Condition Type
3. Configure 3 default parameters (minimum)
4. Add more parameters as needed

---

## 📋 Parameter Types Cheat Sheet

| Type | Input | Output Formula | Example |
|------|-------|----------------|---------|
| **Param ID** | Multi-select dropdown | `[15080][15081]` | Single or multiple IDs |
| **String** | Text (A-Z,a-z,0-9,_) | `'COST_TABLE'` | Table names, constants |
| **Number** | Number input | `10.3` | Numeric values |
| **Variable** | Text (A-Z,_) | `HP_SEP` | System variables |
| **ML_CODE** | Text (alphanumeric) | `{ML_CODE}` | ML references |
| **Nested LOOKUP** | Button (Phase 2) | `LOOKUP(...)` | Recursive LOOKUPs |

---

## 🎯 Common Patterns

### Pattern 1: Simple Table Lookup
```
Type: Param ID → [15001]
Type: String → 'COST_TABLE'
Type: ML_CODE → {ML_CODE}

Result: LOOKUP([15001], 'COST_TABLE', {ML_CODE})
```

### Pattern 2: Multiple Keys
```
Type: Param ID → [15080,15081,15082]
Type: Variable → PP_PPM_TUBE
Type: Param ID → [15006]

Result: LOOKUP([15080][15081][15082], PP_PPM_TUBE, [15006])
```

### Pattern 3: Mixed Types
```
Type: Number → 10.3
Type: Variable → PP_PPM_TUBE
Type: String → 'SEAMLESS'

Result: LOOKUP(10.3, PP_PPM_TUBE, 'SEAMLESS')
```

---

## 🔧 Database Quick Commands

### Check New Columns:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'parameters' 
AND column_name LIKE 'lookup%';
```

### View LOOKUP Structure:
```sql
SELECT id, parentId, branchIndex, lookupParamType, lookupParamValue 
FROM parameters 
WHERE parentId IN (SELECT id FROM parameters WHERE conditionType = 'LOOKUP')
ORDER BY parentId, branchIndex;
```

### Count by Type:
```sql
SELECT lookupParamType, COUNT(*) as count
FROM parameters
WHERE lookupParamType IS NOT NULL
GROUP BY lookupParamType;
```

---

## ⚡ Keyboard Shortcuts

- **Tab**: Move to next field
- **Shift+Tab**: Move to previous field
- **Enter**: Open dropdown (when focused)
- **Esc**: Close dropdown

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Type dropdown not showing | Check if row is LOOKUP child (branchFlag=true) |
| Formula not updating | Check console for errors, verify value not empty |
| Can't remove parameter | Need minimum 3 parameters for LOOKUP |
| Multi-select not working | Only available for Param ID type |
| Old data not loading | Backward compatibility - check lookupParamType is set |

---

## 📝 Validation Rules Quick Reference

### Param ID
- ✅ Numbers only
- ✅ Multiple allowed (comma-separated)
- ❌ Cannot be empty

### String
- ✅ A-Z, a-z, 0-9, underscore
- ❌ No spaces
- ❌ No special characters

### Number
- ✅ Integers and decimals
- ✅ Negative numbers
- ❌ No text

### Variable
- ✅ Uppercase letters
- ✅ Underscores
- ❌ No lowercase (auto-converts)
- ❌ No numbers

### ML_CODE
- ✅ Alphanumeric
- ✅ Underscores
- ❌ No special characters

---

## 🎓 Formula Examples

### 3 Parameters:
```
LOOKUP([15001], 'HRSG_FIXED_MATL_COST', {ML_CODE})
```

### 5 Parameters:
```
LOOKUP([15080], PP_PPM_TUBE, [15006], {ml_code}, [15082])
```

### 6 Parameters:
```
LOOKUP([15300], 'CO_CATALYST_COST', [15001], [15070], [15090], LOOKUP(...))
```

### 7+ Parameters:
```
LOOKUP([15260], 'SCR_COST', [15070], [15001], [15090], LOOKUP(...), [15270])
```

---

## 💾 Database Fields

### Required Fields:
- `lookupParamType` - Parameter type (VARCHAR)
- `lookupParamValue` - Parameter value(s) (TEXT)
- `lookupParamDesc` - Description (TEXT)

### Storage Format:
```javascript
{
    lookupParamType: 'Param ID',
    lookupParamValue: '15080,15081,15082',  // Comma-separated for multi-select
    lookupParamDesc: 'Multiple tube parameters'
}
```

---

## 🔄 Backward Compatibility

### Old Format (Still Works):
```javascript
{
    paramId: '15001',
    lookupParamType: null  // Falls back to paramId
}
```

### New Format:
```javascript
{
    paramId: '',  // Not used for LOOKUP params
    lookupParamType: 'Param ID',
    lookupParamValue: '15001'
}
```

---

## 📊 UI Field Reference

### Visible for LOOKUP Children:
- ✅ Type dropdown
- ✅ Value input (conditional)
- ✅ Param Description
- ✅ Comments

### Hidden for LOOKUP Children:
- ❌ UOM
- ❌ Operation
- ❌ Standard MH/UOM
- ❌ Row Operator

---

## 🚨 Important Notes

1. **Minimum 3 parameters** - Cannot reduce below 3 for LOOKUP
2. **No row operators** - LOOKUP params are comma-separated
3. **Type changes clear value** - Changing type resets value field
4. **Multi-select only for Param ID** - Other types use single input

---

## 📞 Quick Help

### Need to:
- **Add parameter:** Click "+ Add Parameter" button
- **Remove parameter:** Click delete icon (if more than 3)
- **Change type:** Select from Type dropdown
- **Enter multiple IDs:** Select multiple from Param ID dropdown
- **View formula:** Check parent row's formula column

---

## ✅ Checklist for New LOOKUP

- [ ] Create LOOKUP row
- [ ] Configure minimum 3 parameters
- [ ] Select appropriate types
- [ ] Enter values
- [ ] Add descriptions
- [ ] Verify formula
- [ ] Save data

---

## 📚 Documentation Links

- **Full Guide:** `LOOKUP_TYPED_PARAMETERS_IMPLEMENTATION.md`
- **Testing:** `TESTING_GUIDE_LOOKUP_TYPED_PARAMS.md`
- **Design:** `LOOKUP_ENHANCEMENT_DESIGN.md`
- **Database:** `database_migration_lookup_typed_params.sql`

---

## 🎯 Best Practices

1. **Use descriptive names** - Add clear descriptions for each parameter
2. **Group related parameters** - Keep similar types together
3. **Add comments** - Document complex LOOKUPs
4. **Test formulas** - Verify formula output before saving
5. **Review before save** - Double-check all values

---

**Quick Reference Complete!** 📋

For detailed information, refer to the full documentation.
