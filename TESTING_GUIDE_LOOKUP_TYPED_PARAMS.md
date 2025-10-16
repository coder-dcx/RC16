# LOOKUP Typed Parameters - Testing Guide

## 🧪 Comprehensive Testing Checklist

This guide provides step-by-step testing procedures to validate the LOOKUP typed parameters implementation.

---

## ✅ Pre-Testing Setup

### 1. Database Migration
- [ ] Run the database migration script: `database_migration_lookup_typed_params.sql`
- [ ] Verify new columns exist:
  ```sql
  SELECT column_name FROM information_schema.columns 
  WHERE table_name = 'parameters' 
  AND column_name LIKE 'lookup%';
  ```
- [ ] Expected columns: `lookupParamType`, `lookupParamValue`, `lookupParamDesc`

### 2. Code Deployment
- [ ] Ensure FeaturesV3.js is updated
- [ ] Ensure EnhancedDataTransformUtils.js is updated
- [ ] No compilation errors: `npm run build` or check browser console

### 3. Browser Testing Environment
- [ ] Clear browser cache
- [ ] Open Developer Tools (F12)
- [ ] Monitor Console tab for errors

---

## 🎯 Test Cases

### TEST 1: Basic LOOKUP Creation with Typed Parameters

**Objective:** Create a simple 3-parameter LOOKUP with different types

**Steps:**
1. Create a new root row
2. Select "LOOKUP" from Condition Type dropdown
3. Verify 3 children are created automatically
4. Configure parameters:
   - **Param 1:** Type=Param ID, Value="15001"
   - **Param 2:** Type=String, Value="HRSG_FIXED_MATL_COST"
   - **Param 3:** Type=ML_CODE, Value="ML_CODE"

**Expected Results:**
- ✅ 3 children visible under LOOKUP parent
- ✅ Type dropdown shows 6 options
- ✅ Input controls change based on type selection
- ✅ Formula displays: `LOOKUP([15001], 'HRSG_FIXED_MATL_COST', {ML_CODE})`

**Console Verification:**
```javascript
// Check console for:
🔍 LOOKUP Param 1: {lookupParamType: "Param ID", lookupParamValue: "15001"}
🔍 LOOKUP Param 2: {lookupParamType: "String", lookupParamValue: "HRSG_FIXED_MATL_COST"}
🔍 LOOKUP Param 3: {lookupParamType: "ML_CODE", lookupParamValue: "ML_CODE"}
```

---

### TEST 2: Multiple Param IDs

**Objective:** Test multi-select Param ID functionality

**Steps:**
1. Create LOOKUP with 5 parameters
2. Set Param 1:
   - Type: Param ID
   - Select multiple IDs: 15080, 15081, 15082
3. Set other params:
   - Param 2: Type=Variable, Value="PP_PPM_TUBE"
   - Param 3: Type=Param ID, Value="15006"
   - Param 4: Type=ML_CODE, Value="ml_code"
   - Param 5: Type=Param ID, Value="15082"

**Expected Results:**
- ✅ Multi-select works for Param ID type
- ✅ Formula displays: `LOOKUP([15080][15081][15082], PP_PPM_TUBE, [15006], {ml_code}, [15082])`
- ✅ Each selected ID wrapped in brackets and concatenated

**Database Verification:**
```sql
SELECT lookupParamValue 
FROM parameters 
WHERE lookupParamType = 'Param ID';
-- Expected: '15080,15081,15082' (comma-separated)
```

---

### TEST 3: String Type Validation

**Objective:** Test String type input validation

**Steps:**
1. Create LOOKUP parameter
2. Select Type: String
3. Try entering:
   - Valid: `HRSG_FIXED_MATL_COST` ✅
   - Valid: `Test123_Value` ✅
   - Invalid: `Test 123` ❌ (with space)
   - Invalid: `Test@123` ❌ (with special char)

**Expected Results:**
- ✅ Only A-Z, a-z, 0-9, underscore allowed
- ✅ Invalid characters not entered
- ✅ Formula shows quotes: `'HRSG_FIXED_MATL_COST'`

---

### TEST 4: Number Type

**Objective:** Test Number type input

**Steps:**
1. Create LOOKUP parameter
2. Select Type: Number
3. Test values:
   - `10` ✅
   - `10.3` ✅
   - `0.5` ✅
   - `-5` ✅
   - `abc` ❌

**Expected Results:**
- ✅ Only numeric values accepted
- ✅ Decimals allowed
- ✅ Formula shows plain number: `10.3`

---

### TEST 5: Variable Type

**Objective:** Test Variable type with uppercase conversion

**Steps:**
1. Create LOOKUP parameter
2. Select Type: Variable
3. Try entering:
   - `hp_sep` → Converts to `HP_SEP` ✅
   - `PPM_TUBE` → Stays `PPM_TUBE` ✅
   - `Test123` → Blocks `123`, accepts `TEST` ✅

**Expected Results:**
- ✅ Auto-converts to uppercase
- ✅ Only letters and underscores allowed
- ✅ Formula shows plain text: `HP_SEP`

---

### TEST 6: ML_CODE Type

**Objective:** Test ML_CODE type with brace wrapping

**Steps:**
1. Create LOOKUP parameter
2. Select Type: ML_CODE
3. Enter values:
   - `ML_CODE` ✅
   - `ML_CODE1` ✅
   - `ml_code` ✅

**Expected Results:**
- ✅ Alphanumeric and underscore allowed
- ✅ Formula wraps in braces: `{ML_CODE}`

---

### TEST 7: Add/Remove Parameters

**Objective:** Test dynamic parameter management

**Steps:**
1. Create LOOKUP with 3 parameters (minimum)
2. Try to remove a parameter → Should fail (need minimum 3)
3. Add 4th parameter using "+ Add Parameter" button
4. Add 5th parameter
5. Remove 5th parameter → Should succeed
6. Remove 4th parameter → Should succeed
7. Try to remove 3rd parameter → Should fail

**Expected Results:**
- ✅ Cannot reduce below 3 parameters
- ✅ Can add unlimited parameters
- ✅ Can remove parameters (keeping min 3)
- ✅ branchIndex updates correctly (0, 1, 2, 3...)

---

### TEST 8: Nested LOOKUP Placeholder

**Objective:** Test Nested LOOKUP button

**Steps:**
1. Create LOOKUP parameter
2. Select Type: Nested LOOKUP
3. Click "Configure Nested LOOKUP" button

**Expected Results:**
- ✅ Button visible
- ✅ Alert shows: "Nested LOOKUP configuration coming soon!"
- ✅ Formula shows placeholder: `LOOKUP(...)`

---

### TEST 9: UI Field Visibility

**Objective:** Verify correct fields show for LOOKUP children

**Steps:**
1. Create LOOKUP with 3 parameters
2. Click on a LOOKUP child row
3. Verify visible fields:
   - ✅ Type dropdown
   - ✅ Value input (changes based on type)
   - ✅ Param Description
   - ✅ Comments
4. Verify hidden fields:
   - ❌ UOM
   - ❌ Operation
   - ❌ Standard MH/UOM
   - ❌ Row Operator (between LOOKUP params)

**Expected Results:**
- ✅ Only relevant fields visible for LOOKUP children
- ✅ Standard fields visible for non-LOOKUP rows
- ✅ IF/IF-ELSE children unchanged

---

### TEST 10: Database Save/Load

**Objective:** Test persistence of typed parameters

**Steps:**
1. Create LOOKUP with typed parameters:
   - Param 1: Type=Param ID, Value="15080,15081"
   - Param 2: Type=String, Value="COST_TABLE"
   - Param 3: Type=ML_CODE, Value="ML_CODE"
2. Save data (trigger database save)
3. Refresh page
4. Verify data loaded correctly

**Expected Results:**
- ✅ All parameter types preserved
- ✅ Values match exactly
- ✅ Descriptions and comments preserved
- ✅ Formula regenerated correctly

**Database Query:**
```sql
SELECT 
    id, parentId, branchIndex,
    lookupParamType, lookupParamValue, lookupParamDesc
FROM parameters
WHERE parentId = [LOOKUP_PARENT_ID]
ORDER BY branchIndex;
```

---

### TEST 11: Backward Compatibility

**Objective:** Test old LOOKUP data still works

**Steps:**
1. Create old-style LOOKUP (using paramId field)
2. Insert test data directly in database:
   ```sql
   INSERT INTO parameters (id, parentId, branchFlag, branchIndex, conditionType, paramId)
   VALUES (200, 199, true, 0, 'None', '15001');
   ```
3. Load in component
4. Verify it displays and works

**Expected Results:**
- ✅ Old data loads without errors
- ✅ Falls back to paramId if lookupParamType empty
- ✅ Formula generates correctly
- ✅ Can edit and convert to new format

---

### TEST 12: Formula Generation Accuracy

**Objective:** Test all formula patterns match requirements

**Test Data:**
```javascript
// Test Case 1: Basic 3 params
Input: [15001], 'HRSG_FIXED_MATL_COST', {ML_CODE}
Expected: LOOKUP([15001], 'HRSG_FIXED_MATL_COST', {ML_CODE})

// Test Case 2: Multiple IDs
Input: [15080,15081,15082], PP_PPM_TUBE, [15006], {ml_code}, [15082]
Expected: LOOKUP([15080][15081][15082], PP_PPM_TUBE, [15006], {ml_code}, [15082])

// Test Case 3: Mixed types
Input: 10.3, PP_PPM_TUBE, [15006], 'GLB_SEAMLESS', [15081]
Expected: LOOKUP(10.3, PP_PPM_TUBE, [15006], 'GLB_SEAMLESS', [15081])
```

**Expected Results:**
- ✅ All formulas match requirements exactly
- ✅ Proper spacing after commas
- ✅ Correct bracket/quote/brace placement

---

### TEST 13: No Impact on IF/IF-ELSE

**Objective:** Verify IF/IF-ELSE functionality unchanged

**Steps:**
1. Create IF condition row
2. Verify UI unchanged:
   - ✅ Same fields visible
   - ✅ IF condition inputs work
   - ✅ TRUE/FALSE branches work
3. Create IF-ELSE condition row
4. Verify same behavior as before

**Expected Results:**
- ✅ No changes to IF/IF-ELSE UI
- ✅ No changes to IF/IF-ELSE logic
- ✅ Formula generation works as before

---

### TEST 14: Error Handling

**Objective:** Test error scenarios gracefully handled

**Steps:**
1. Try creating LOOKUP with empty parameter values
2. Try deleting all parameters
3. Try selecting Param ID with no options available
4. Try invalid characters in String type

**Expected Results:**
- ✅ Empty values show "PARAM" in formula
- ✅ Cannot delete below minimum 3 parameters
- ✅ Graceful handling of missing options
- ✅ Invalid characters blocked at input

---

### TEST 15: Console Log Verification

**Objective:** Verify logging for debugging

**Steps:**
1. Create LOOKUP with various parameter types
2. Check browser console
3. Look for formula generation logs

**Expected Console Output:**
```
🔍 LOOKUP Param 1: {lookupParamType: "Param ID", lookupParamValue: "15001"}
  ➜ Single Param ID: [15001]
🔍 LOOKUP Param 2: {lookupParamType: "String", lookupParamValue: "COST_TABLE"}
  ➜ String: 'COST_TABLE'
🔍 LOOKUP Param 3: {lookupParamType: "ML_CODE", lookupParamValue: "ML_CODE"}
  ➜ ML_CODE: {ML_CODE}
```

**Expected Results:**
- ✅ Clear logging of each parameter
- ✅ Type and value shown
- ✅ Formula generation steps visible

---

## 🔍 Performance Testing

### TEST 16: Large LOOKUP (10+ Parameters)

**Steps:**
1. Create LOOKUP with 15 parameters
2. Mix different types
3. Save and load

**Expected Results:**
- ✅ No performance degradation
- ✅ Smooth scrolling
- ✅ Formula renders quickly
- ✅ Save/load works correctly

---

## 🐛 Known Issues / Limitations

Document any issues found during testing:

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| Nested LOOKUP not implemented | Low | Expected | Phase 2 feature |
| Variable dropdown not available | Low | Expected | Uses text input instead |
| Multi-ID selection may be slow with 1000+ options | Low | Monitor | Consider pagination if needed |

---

## 📊 Test Results Summary

**Test Date:** _______________  
**Tester:** _______________  
**Environment:** _______________

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Basic LOOKUP Creation | ⬜ | |
| 2 | Multiple Param IDs | ⬜ | |
| 3 | String Validation | ⬜ | |
| 4 | Number Type | ⬜ | |
| 5 | Variable Type | ⬜ | |
| 6 | ML_CODE Type | ⬜ | |
| 7 | Add/Remove Parameters | ⬜ | |
| 8 | Nested LOOKUP Placeholder | ⬜ | |
| 9 | UI Field Visibility | ⬜ | |
| 10 | Database Save/Load | ⬜ | |
| 11 | Backward Compatibility | ⬜ | |
| 12 | Formula Generation | ⬜ | |
| 13 | IF/IF-ELSE Unchanged | ⬜ | |
| 14 | Error Handling | ⬜ | |
| 15 | Console Logging | ⬜ | |
| 16 | Performance (10+ params) | ⬜ | |

**Legend:** ✅ Pass | ❌ Fail | ⚠️ Issue | ⬜ Not Tested

---

## 🚀 Production Readiness Checklist

- [ ] All tests passing
- [ ] Database migration completed
- [ ] Backup created
- [ ] Documentation reviewed
- [ ] Team trained on new features
- [ ] Rollback plan prepared
- [ ] Monitoring in place

---

## 📝 Notes

Use this section for additional observations during testing:

```
[Your notes here]
```

---

## ✅ Sign-Off

**QA Approval:** _______________  
**Date:** _______________  

**Dev Approval:** _______________  
**Date:** _______________  

**Ready for Production:** YES / NO

---

## 🆘 Troubleshooting

### Issue: Type dropdown not showing
**Solution:** Clear cache, verify FeaturesV3.js loaded

### Issue: Formula not generating
**Solution:** Check console for errors, verify lookupParamValue not empty

### Issue: Database save failing
**Solution:** Verify migration ran, check new columns exist

### Issue: Old data not loading
**Solution:** Check backward compatibility logic in dbRowToComponentRow()

---

**End of Testing Guide**
