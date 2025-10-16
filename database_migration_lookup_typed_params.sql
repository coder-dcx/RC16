-- ============================================
-- LOOKUP Typed Parameters - Database Migration
-- ============================================
-- Purpose: Add support for typed LOOKUP parameters in FeaturesV3
-- Date: October 16, 2025
-- Version: 1.0
-- ============================================

-- ============================================
-- STEP 1: Add New Columns
-- ============================================

-- Add lookupParamType column
-- Stores the parameter type: 'Param ID', 'String', 'Number', 'Variable', 'ML_CODE', 'Nested LOOKUP'
ALTER TABLE parameters 
ADD COLUMN lookupParamType VARCHAR(20) DEFAULT 'Param ID';

-- Add lookupParamValue column
-- Stores the actual value(s) - can be comma-separated for multiple Param IDs
ALTER TABLE parameters 
ADD COLUMN lookupParamValue TEXT;

-- Add lookupParamDesc column
-- Stores parameter-specific description
ALTER TABLE parameters 
ADD COLUMN lookupParamDesc TEXT;

-- ============================================
-- STEP 2: Add Comments to New Columns
-- ============================================

COMMENT ON COLUMN parameters.lookupParamType IS 'LOOKUP parameter type: Param ID, String, Number, Variable, ML_CODE, Nested LOOKUP';
COMMENT ON COLUMN parameters.lookupParamValue IS 'LOOKUP parameter value(s) - comma-separated for multiple Param IDs';
COMMENT ON COLUMN parameters.lookupParamDesc IS 'LOOKUP parameter description';

-- ============================================
-- STEP 3: Create Index for Performance
-- ============================================

-- Index for filtering LOOKUP rows
CREATE INDEX idx_parameters_condition_type 
ON parameters(conditionType);

-- Index for parent-child relationships (if not exists)
CREATE INDEX IF NOT EXISTS idx_parameters_parent_id 
ON parameters(parentId);

-- Index for branch organization (if not exists)
CREATE INDEX IF NOT EXISTS idx_parameters_branch 
ON parameters(parentId, branchFlag, branchIndex);

-- ============================================
-- STEP 4: Data Migration (Optional)
-- ============================================

-- Migrate existing LOOKUP children to use new typed system
-- This is optional - the system handles backward compatibility
-- Uncomment if you want to migrate existing data:

/*
UPDATE parameters p
SET 
    lookupParamType = CASE
        -- Detect Param ID (numeric)
        WHEN p.paramId ~ '^\d+$' THEN 'Param ID'
        
        -- Detect String (quoted text)
        WHEN p.paramId LIKE '''%''' THEN 'String'
        
        -- Detect Variable (uppercase with underscores)
        WHEN p.paramId ~ '^[A-Z_]+$' THEN 'Variable'
        
        -- Detect ML_CODE (with curly braces)
        WHEN p.paramId LIKE '{%}' THEN 'ML_CODE'
        
        -- Detect Number (numeric with decimal)
        WHEN p.paramId ~ '^\d+\.?\d*$' THEN 'Number'
        
        -- Default to Param ID
        ELSE 'Param ID'
    END,
    lookupParamValue = CASE
        -- Extract value from String (remove quotes)
        WHEN p.paramId LIKE '''%''' THEN TRIM('''' FROM p.paramId)
        
        -- Extract value from ML_CODE (remove braces)
        WHEN p.paramId LIKE '{%}' THEN TRIM('{}' FROM p.paramId)
        
        -- Use paramId as-is for others
        ELSE p.paramId
    END,
    lookupParamDesc = p.description
WHERE 
    -- Only migrate LOOKUP children (rows with LOOKUP parent)
    p.parentId IN (SELECT id FROM parameters WHERE conditionType = 'LOOKUP')
    AND p.branchFlag = true
    -- Only migrate if not already migrated
    AND (p.lookupParamType IS NULL OR p.lookupParamType = 'Param ID');
*/

-- ============================================
-- STEP 5: Validation Constraints
-- ============================================

-- Add check constraint for lookupParamType
ALTER TABLE parameters
ADD CONSTRAINT chk_lookup_param_type
CHECK (lookupParamType IN ('Param ID', 'String', 'Number', 'Variable', 'ML_CODE', 'Nested LOOKUP'));

-- ============================================
-- STEP 6: Sample Data (For Testing)
-- ============================================

-- Example: LOOKUP with typed parameters
-- Parent LOOKUP row
/*
INSERT INTO parameters (id, parentId, branchFlag, branchIndex, conditionType, paramId, description, userComments)
VALUES (100, NULL, NULL, NULL, 'LOOKUP', '15001', 'LOOKUP function', 'Catalyst cost calculation');

-- Child 1: Param ID type
INSERT INTO parameters (id, parentId, branchFlag, branchIndex, conditionType, lookupParamType, lookupParamValue, lookupParamDesc, userComments)
VALUES (101, 100, true, 0, 'None', 'Param ID', '15001', 'Catalyst type parameter', 'Primary key');

-- Child 2: String type
INSERT INTO parameters (id, parentId, branchFlag, branchIndex, conditionType, lookupParamType, lookupParamValue, lookupParamDesc, userComments)
VALUES (102, 100, true, 1, 'None', 'String', 'HRSG_FIXED_MATL_COST', 'Cost table name', 'Reference table');

-- Child 3: ML_CODE type
INSERT INTO parameters (id, parentId, branchFlag, branchIndex, conditionType, lookupParamType, lookupParamValue, lookupParamDesc, userComments)
VALUES (103, 100, true, 2, 'None', 'ML_CODE', 'ML_CODE', 'Machine learning code reference', 'ML code variable');
*/

-- ============================================
-- STEP 7: Verification Queries
-- ============================================

-- Check if columns were added successfully
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'parameters'
AND column_name IN ('lookupParamType', 'lookupParamValue', 'lookupParamDesc');

-- Count LOOKUP rows
SELECT 
    conditionType,
    COUNT(*) as row_count
FROM parameters
WHERE conditionType = 'LOOKUP'
GROUP BY conditionType;

-- Count LOOKUP children with typed parameters
SELECT 
    lookupParamType,
    COUNT(*) as param_count
FROM parameters
WHERE parentId IN (SELECT id FROM parameters WHERE conditionType = 'LOOKUP')
AND branchFlag = true
GROUP BY lookupParamType;

-- Sample query to view LOOKUP structure
SELECT 
    p.id,
    p.parentId,
    p.branchIndex,
    p.conditionType,
    p.lookupParamType,
    p.lookupParamValue,
    p.lookupParamDesc,
    p.userComments
FROM parameters p
WHERE p.conditionType = 'LOOKUP'
   OR p.parentId IN (SELECT id FROM parameters WHERE conditionType = 'LOOKUP')
ORDER BY 
    COALESCE(p.parentId, p.id),
    p.parentId NULLS FIRST,
    p.branchIndex;

-- ============================================
-- ROLLBACK SCRIPT (Use only if needed)
-- ============================================

/*
-- WARNING: This will remove the new columns and all their data!
-- Backup your data before running this!

-- Remove constraints
ALTER TABLE parameters DROP CONSTRAINT IF EXISTS chk_lookup_param_type;

-- Drop indexes
DROP INDEX IF EXISTS idx_parameters_condition_type;

-- Remove columns
ALTER TABLE parameters DROP COLUMN IF EXISTS lookupParamType;
ALTER TABLE parameters DROP COLUMN IF EXISTS lookupParamValue;
ALTER TABLE parameters DROP COLUMN IF EXISTS lookupParamDesc;
*/

-- ============================================
-- END OF MIGRATION SCRIPT
-- ============================================

-- Next Steps:
-- 1. Review the script
-- 2. Backup your database
-- 3. Run the migration in a test environment first
-- 4. Verify with the verification queries
-- 5. Deploy to production
-- 6. Test the FeaturesV3 component with new data

-- ============================================
-- Notes:
-- ============================================
-- - This migration is backward compatible
-- - Existing LOOKUP rows will continue to work
-- - The component handles both old and new formats
-- - Migration of existing data is optional
-- - All new LOOKUP parameters will use typed system
-- ============================================
