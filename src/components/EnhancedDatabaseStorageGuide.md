# 🗄️ Enhanced Database Storage Guide - IFAndLookup Component

## 📋 Overview

This guide provides complete database storage implementation for the `IFAndLookup.js` component with **multiple children support** under TRUE/FALSE branches.

## 🏗️ Enhanced Database Schema

### SQL Schema (MySQL/PostgreSQL)

```sql
-- Enhanced FormulaConfigurations table
CREATE TABLE FormulaConfigurations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('draft', 'active', 'archived') DEFAULT 'draft',
    version INT DEFAULT 1
);

-- Enhanced FormulaData table with multiple children support
CREATE TABLE FormulaData (
    id INT PRIMARY KEY AUTO_INCREMENT,
    configuration_id INT NOT NULL,
    parent_id INT DEFAULT NULL,               -- Parent row ID (NULL for root rows)
    is_true_branch BOOLEAN DEFAULT NULL,      -- TRUE/FALSE/NULL (NULL for root rows)
    branch_index INT DEFAULT NULL,            -- NEW: Index within branch (0, 1, 2...)
    
    -- Core data fields
    param_id VARCHAR(50),
    param_desc TEXT,
    module_desc VARCHAR(255),
    uom VARCHAR(20),
    operation VARCHAR(5),
    standard_mh DECIMAL(10,4),
    if_checked BOOLEAN DEFAULT FALSE,
    
    -- Conditional fields (for IF conditions)
    left_type VARCHAR(20),
    left_value VARCHAR(100),
    condition_op VARCHAR(10),
    right_type VARCHAR(20),
    right_value VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_parent_branch (parent_id, is_true_branch, branch_index),
    INDEX idx_configuration (configuration_id),
    FOREIGN KEY (configuration_id) REFERENCES FormulaConfigurations(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES FormulaData(id) ON DELETE CASCADE
);
```

### MongoDB Schema

```javascript
// FormulaConfigurations collection
{
    _id: ObjectId("..."),
    name: "Enhanced Engine Configuration",
    description: "Complex engine formula with multiple children",
    created_by: "user123",
    created_at: ISODate("2025-09-20T10:00:00Z"),
    updated_at: ISODate("2025-09-20T10:00:00Z"),
    status: "active",
    version: 1,
    
    // Enhanced structure with multiple children
    formula_data: {
        rows: [
            {
                id: 1,
                parent_id: null,
                is_true_branch: null,
                branch_index: null,
                param_id: "000001",
                param_desc: "Engine Speed Parameter",
                module_desc: "Engine Control Module",
                uom: "RPM",
                operation: "*",
                standard_mh: 0,
                if_checked: true,
                left_type: "PARAM ID",
                left_value: "000001",
                condition_op: ">",
                right_type: "NUMBER",
                right_value: "1000"
            },
            // Multiple TRUE children
            {
                id: 2,
                parent_id: 1,
                is_true_branch: true,
                branch_index: 0,  // First child in TRUE branch
                param_id: "000002",
                param_desc: "High Speed Calculation 1",
                module_desc: "Performance Module 1",
                uom: "SEC",
                operation: "*",
                standard_mh: 25,
                if_checked: false
            },
            {
                id: 3,
                parent_id: 1,
                is_true_branch: true,
                branch_index: 1,  // Second child in TRUE branch
                param_id: "000003",
                param_desc: "High Speed Calculation 2",
                module_desc: "Performance Module 2",
                uom: "MIN",
                operation: "+",
                standard_mh: 15,
                if_checked: false
            },
            // Multiple FALSE children
            {
                id: 4,
                parent_id: 1,
                is_true_branch: false,
                branch_index: 0,  // First child in FALSE branch
                param_id: "000004",
                param_desc: "Low Speed Calculation 1",
                module_desc: "Economy Module 1",
                uom: "SEC",
                operation: "*",
                standard_mh: 10,
                if_checked: false
            }
        ],
        formula_preview: "IF([000001] > 1000, ([000002] * 25 + [000003] + 15), ([000004] * 10))"
    }
}
```

## 🔄 Data Flow Examples

### 1. Saving Multiple Children to Database

```javascript
// Component data with multiple children
const componentData = [
    {
        id: "row_1",
        paramId: "000001",
        ifChecked: true,
        leftValue: "000001",
        condition: ">",
        rightValue: "1000",
        children: {
            trueChildren: [
                { id: "row_1_true_0", paramId: "000002", standardMH: 25, branchIndex: 0 },
                { id: "row_1_true_1", paramId: "000003", standardMH: 15, branchIndex: 1 },
                { id: "row_1_true_2", paramId: "000004", standardMH: 5, branchIndex: 2 }
            ],
            falseChildren: [
                { id: "row_1_false_0", paramId: "000005", standardMH: 10, branchIndex: 0 },
                { id: "row_1_false_1", paramId: "000006", standardMH: 8, branchIndex: 1 }
            ]
        }
    }
];

// Database records created
const dbRecords = [
    // Root row
    {
        id: 1,
        parent_id: null,
        is_true_branch: null,
        branch_index: null,
        param_id: "000001",
        if_checked: true,
        left_value: "000001",
        condition_op: ">",
        right_value: "1000"
    },
    // TRUE children
    {
        id: 2,
        parent_id: 1,
        is_true_branch: true,
        branch_index: 0,
        param_id: "000002",
        standard_mh: 25,
        if_checked: false
    },
    {
        id: 3,
        parent_id: 1,
        is_true_branch: true,
        branch_index: 1,
        param_id: "000003",
        standard_mh: 15,
        if_checked: false
    },
    {
        id: 4,
        parent_id: 1,
        is_true_branch: true,
        branch_index: 2,
        param_id: "000004",
        standard_mh: 5,
        if_checked: false
    },
    // FALSE children
    {
        id: 5,
        parent_id: 1,
        is_true_branch: false,
        branch_index: 0,
        param_id: "000005",
        standard_mh: 10,
        if_checked: false
    },
    {
        id: 6,
        parent_id: 1,
        is_true_branch: false,
        branch_index: 1,
        param_id: "000006",
        standard_mh: 8,
        if_checked: false
    }
];
```

### 2. Loading and Reconstructing Tree Structure

```sql
-- SQL Query to load complete formula with multiple children
SELECT 
    fd.*,
    fc.name as config_name,
    fc.description as config_description
FROM FormulaData fd
JOIN FormulaConfigurations fc ON fd.configuration_id = fc.id
WHERE fc.id = 1
ORDER BY 
    CASE WHEN fd.parent_id IS NULL THEN 0 ELSE 1 END,  -- Root rows first
    fd.parent_id,                                       -- Group by parent
    fd.is_true_branch DESC,                            -- TRUE before FALSE
    fd.branch_index;                                   -- Order within branch
```

## 🛠️ API Implementation

### Enhanced Service Class

```javascript
class EnhancedFormulaService {
    
    /**
     * Save enhanced formula with multiple children support
     */
    async saveEnhancedFormula(configId, componentData) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Step 1: Clear existing formula data
            await connection.execute(
                'DELETE FROM FormulaData WHERE configuration_id = ?',
                [configId]
            );
            
            // Step 2: Flatten component data to database format
            const flatData = this.flattenEnhancedData(componentData);
            
            // Step 3: Insert all rows with proper parent-child relationships
            for (const row of flatData) {
                const [result] = await connection.execute(`
                    INSERT INTO FormulaData (
                        configuration_id, parent_id, is_true_branch, branch_index,
                        param_id, param_desc, module_desc, uom, operation, standard_mh,
                        if_checked, left_type, left_value, condition_op, right_type, right_value
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    configId,
                    row.parent_id,
                    row.is_true_branch,
                    row.branch_index,
                    row.param_id,
                    row.param_desc,
                    row.module_desc,
                    row.uom,
                    row.operation,
                    row.standard_mh,
                    row.if_checked,
                    row.left_type,
                    row.left_value,
                    row.condition_op,
                    row.right_type,
                    row.right_value
                ]);
                
                // Update row with actual database ID
                row.database_id = result.insertId;
            }
            
            // Step 4: Update parent_id references with actual database IDs
            await this.updateParentReferences(connection, flatData);
            
            await connection.commit();
            
            return {
                success: true,
                rows_saved: flatData.length,
                message: 'Enhanced formula saved successfully'
            };
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    
    /**
     * Load enhanced formula and reconstruct tree structure
     */
    async loadEnhancedFormula(configId) {
        const [rows] = await db.execute(`
            SELECT 
                fd.*,
                fc.name as config_name,
                fc.description as config_description
            FROM FormulaData fd
            JOIN FormulaConfigurations fc ON fd.configuration_id = fc.id
            WHERE fc.id = ?
            ORDER BY 
                CASE WHEN fd.parent_id IS NULL THEN 0 ELSE 1 END,
                fd.parent_id,
                fd.is_true_branch DESC,
                fd.branch_index
        `, [configId]);
        
        if (rows.length === 0) {
            return null;
        }
        
        // Transform flat database data to enhanced component format
        const componentData = this.buildEnhancedTree(rows);
        
        return {
            id: configId,
            name: rows[0].config_name,
            description: rows[0].config_description,
            formula_data: componentData,
            total_rows: rows.length
        };
    }
    
    /**
     * Flatten enhanced component data for database storage
     */
    flattenEnhancedData(componentRows) {
        const flatRows = [];
        let tempIdCounter = 1;
        
        const flattenRecursive = (row, parentTempId = null) => {
            // Assign temporary ID for relationship mapping
            const tempId = tempIdCounter++;
            row.temp_id = tempId;
            
            // Create database row
            const dbRow = {
                temp_id: tempId,
                parent_id: parentTempId,
                is_true_branch: row.isTrueBranch,
                branch_index: row.branchIndex,
                param_id: row.paramId,
                param_desc: row.paramDesc,
                module_desc: row.moduleDesc,
                uom: row.uom,
                operation: row.operation,
                standard_mh: row.standardMH,
                if_checked: row.ifChecked,
                left_type: row.leftType,
                left_value: row.leftValue,
                condition_op: row.condition,
                right_type: row.rightType,
                right_value: row.rightValue
            };
            
            flatRows.push(dbRow);
            
            // Recursively process children
            if (row.children) {
                [...row.children.trueChildren, ...row.children.falseChildren].forEach(child => {
                    flattenRecursive(child, tempId);
                });
            }
        };
        
        componentRows.forEach(row => flattenRecursive(row));
        
        return flatRows;
    }
    
    /**
     * Build enhanced tree structure from flat database data
     */
    buildEnhancedTree(dbRows) {
        // Convert database rows to component format
        const componentRows = dbRows.map(row => ({
            id: `row_${row.id}`,
            parentId: row.parent_id ? `row_${row.parent_id}` : null,
            isTrueBranch: row.is_true_branch,
            branchIndex: row.branch_index,
            paramId: row.param_id,
            paramDesc: row.param_desc,
            moduleDesc: row.module_desc,
            uom: row.uom,
            operation: row.operation,
            standardMH: row.standard_mh,
            ifChecked: row.if_checked,
            leftType: row.left_type,
            leftValue: row.left_value,
            condition: row.condition_op,
            rightType: row.right_type,
            rightValue: row.right_value,
            isExpanded: row.if_checked,
            hasChildren: row.if_checked,
            children: {
                trueChildren: [],
                falseChildren: []
            }
        }));
        
        // Group children by parent and branch
        const childrenMap = new Map();
        componentRows.forEach(row => {
            if (row.parentId) {
                const key = `${row.parentId}_${row.isTrueBranch}`;
                if (!childrenMap.has(key)) {
                    childrenMap.set(key, []);
                }
                childrenMap.get(key).push(row);
            }
        });
        
        // Assign children to parents and sort by branch_index
        childrenMap.forEach((children, key) => {
            const [parentId, isTrueBranch] = key.split('_');
            const parent = componentRows.find(r => r.id === parentId);
            
            if (parent) {
                // Sort children by branchIndex
                children.sort((a, b) => (a.branchIndex || 0) - (b.branchIndex || 0));
                
                if (isTrueBranch === 'true') {
                    parent.children.trueChildren = children;
                } else {
                    parent.children.falseChildren = children;
                }
                
                parent.hasChildren = parent.children.trueChildren.length > 0 || 
                                   parent.children.falseChildren.length > 0;
            }
        });
        
        // Return root rows only
        return componentRows.filter(row => !row.parentId);
    }
    
    /**
     * Update parent_id references with actual database IDs
     */
    async updateParentReferences(connection, flatData) {
        // Create mapping of temp_id to actual database_id
        const idMapping = {};
        flatData.forEach(row => {
            idMapping[row.temp_id] = row.database_id;
        });
        
        // Update parent_id fields with actual IDs
        for (const row of flatData) {
            if (row.parent_id && idMapping[row.parent_id]) {
                await connection.execute(
                    'UPDATE FormulaData SET parent_id = ? WHERE id = ?',
                    [idMapping[row.parent_id], row.database_id]
                );
            }
        }
    }
}
```

## 🌐 REST API Endpoints

```javascript
// Enhanced API endpoints for multiple children support

// POST /api/enhanced-formulas/:configId
app.post('/api/enhanced-formulas/:configId', async (req, res) => {
    try {
        const { configId } = req.params;
        const { componentData } = req.body;
        
        const service = new EnhancedFormulaService();
        const result = await service.saveEnhancedFormula(configId, componentData);
        
        res.json({
            success: true,
            data: result,
            message: 'Enhanced formula saved successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/enhanced-formulas/:configId
app.get('/api/enhanced-formulas/:configId', async (req, res) => {
    try {
        const { configId } = req.params;
        
        const service = new EnhancedFormulaService();
        const result = await service.loadEnhancedFormula(configId);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Formula configuration not found'
            });
        }
        
        res.json({
            success: true,
            data: result
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
```

## 📊 Sample Database Operations

### Insert Complete Enhanced Formula

```sql
-- Insert configuration
INSERT INTO FormulaConfigurations (name, description, created_by, status) 
VALUES ('Enhanced Engine Formula', 'Complex formula with multiple children per branch', 'user123', 'active');

-- Get configuration ID
SET @config_id = LAST_INSERT_ID();

-- Insert root row with IF condition
INSERT INTO FormulaData (configuration_id, parent_id, is_true_branch, branch_index, param_id, param_desc, module_desc, if_checked, left_value, condition_op, right_value) 
VALUES (@config_id, NULL, NULL, NULL, '000001', 'Engine Speed Check', 'Main Engine Module', true, '000001', '>', '1000');

-- Get root row ID
SET @root_id = LAST_INSERT_ID();

-- Insert multiple TRUE children
INSERT INTO FormulaData (configuration_id, parent_id, is_true_branch, branch_index, param_id, param_desc, module_desc, uom, operation, standard_mh, if_checked) 
VALUES 
(@config_id, @root_id, true, 0, '000002', 'High Speed Calc 1', 'Performance Module 1', 'SEC', '*', 25, false),
(@config_id, @root_id, true, 1, '000003', 'High Speed Calc 2', 'Performance Module 2', 'MIN', '+', 15, false),
(@config_id, @root_id, true, 2, '000004', 'High Speed Calc 3', 'Performance Module 3', 'HRS', '*', 5, false);

-- Insert multiple FALSE children
INSERT INTO FormulaData (configuration_id, parent_id, is_true_branch, branch_index, param_id, param_desc, module_desc, uom, operation, standard_mh, if_checked) 
VALUES 
(@config_id, @root_id, false, 0, '000005', 'Low Speed Calc 1', 'Economy Module 1', 'SEC', '*', 10, false),
(@config_id, @root_id, false, 1, '000006', 'Low Speed Calc 2', 'Economy Module 2', 'MIN', '+', 8, false);
```

### Query with Multiple Children

```sql
-- Load complete formula with all children
SELECT 
    fd.id,
    fd.parent_id,
    fd.is_true_branch,
    fd.branch_index,
    fd.param_id,
    fd.param_desc,
    fd.module_desc,
    fd.uom,
    fd.operation,
    fd.standard_mh,
    fd.if_checked,
    fd.left_type,
    fd.left_value,
    fd.condition_op,
    fd.right_type,
    fd.right_value,
    fc.name as config_name
FROM FormulaData fd
JOIN FormulaConfigurations fc ON fd.configuration_id = fc.id
WHERE fc.id = 1
ORDER BY 
    CASE WHEN fd.parent_id IS NULL THEN 0 ELSE 1 END,  -- Root rows first
    fd.parent_id,                                       -- Group by parent
    fd.is_true_branch DESC,                            -- TRUE before FALSE
    fd.branch_index;                                   -- Order within branch

-- Result shows proper hierarchy:
-- Row 1: Root (parent_id=NULL)
-- Row 2: TRUE child 0 (parent_id=1, is_true_branch=true, branch_index=0)
-- Row 3: TRUE child 1 (parent_id=1, is_true_branch=true, branch_index=1)
-- Row 4: TRUE child 2 (parent_id=1, is_true_branch=true, branch_index=2)
-- Row 5: FALSE child 0 (parent_id=1, is_true_branch=false, branch_index=0)
-- Row 6: FALSE child 1 (parent_id=1, is_true_branch=false, branch_index=1)
```

## 🔧 Integration with Component

```javascript
// Complete integration example
import { 
    prepareEnhancedDataForComponent,
    prepareEnhancedDataForDatabase 
} from './EnhancedDataTransformUtils';

class FormulaManager {
    
    async loadFormula(configId) {
        // Load from database
        const response = await fetch(`/api/enhanced-formulas/${configId}`);
        const result = await response.json();
        
        if (result.success) {
            // Transform for component
            return prepareEnhancedDataForComponent(
                result.data.formula_data,
                parameterOptions,
                uomOptions
            );
        }
        
        throw new Error('Failed to load formula');
    }
    
    async saveFormula(configId, componentData) {
        // Transform from component
        const dbData = prepareEnhancedDataForDatabase(componentData);
        
        // Save to database
        const response = await fetch(`/api/enhanced-formulas/${configId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ componentData: dbData })
        });
        
        return response.json();
    }
}
```

This enhanced database storage guide provides complete implementation for handling multiple children under TRUE/FALSE branches with proper indexing, relationship management, and tree reconstruction! 🎉