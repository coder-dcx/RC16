/**
 * Data Transformation Utilities for NestedIfGridV2
 * Handles conversion between database format and component format
 */

// =====================================
// 1. ID CONVERSION UTILITIES
// =====================================

/**
 * Convert database numeric ID to component string ID
 * @param {number} dbId - Database ID (number)
 * @returns {string} Component ID (string)
 */
export const dbIdToComponentId = (dbId) => {
    if (dbId === null || dbId === undefined) return null;
    return `row_${dbId}`;
};

/**
 * Convert component string ID to database numeric ID
 * @param {string} componentId - Component ID (string like "row_123")
 * @returns {number|null} Database ID (number)
 */
export const componentIdToDbId = (componentId) => {
    if (!componentId || typeof componentId !== 'string') return null;
    
    // Handle special cases for auto-generated IDs
    if (componentId.includes('_true') || componentId.includes('_false')) {
        const baseId = componentId.split('_')[1];
        return parseInt(baseId, 10) || null;
    }
    
    const match = componentId.match(/^row_(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
};

// =====================================
// 2. DATA STRUCTURE CONVERSION
// =====================================

/**
 * Convert single database row to component format
 * @param {Object} dbRow - Database row object
 * @returns {Object} Component row object
 */
export const dbRowToComponentRow = (dbRow) => {
    if (!dbRow) return null;
    
    return {
        id: dbIdToComponentId(dbRow.id),
        parentId: dbIdToComponentId(dbRow.parentId),
        isTrueBranch: dbRow.isTrueBranch,
        paramId: dbRow.paramId || '',
        paramDesc: dbRow.paramDesc || '',
        moduleDesc: dbRow.moduleDesc || '',
        uom: dbRow.uom || 'EA',
        operation: dbRow.operation || '*',
        standardMH: dbRow.standardMH || 0,
        ifChecked: dbRow.ifChecked || false,
        
        // Conditional fields
        leftType: dbRow.leftType || 'PARAM ID',
        leftValue: dbRow.leftValue || '',
        condition: dbRow.condition || '==',
        rightType: dbRow.rightType || 'PARAM ID',
        rightValue: dbRow.rightValue || '',
        
        // UI-only fields (derived, not from DB)
        isExpanded: dbRow.ifChecked || false, // Expand if it's an IF condition
        hasChildren: dbRow.ifChecked || false, // Has children if it's an IF condition
        children: {
            trueChild: null,
            falseChild: null
        }
    };
};

/**
 * Convert component row to database format (for saving)
 * @param {Object} componentRow - Component row object
 * @returns {Object} Database row object
 */
export const componentRowToDbRow = (componentRow) => {
    if (!componentRow) return null;
    
    return {
        id: componentIdToDbId(componentRow.id),
        parentId: componentIdToDbId(componentRow.parentId),
        isTrueBranch: componentRow.isTrueBranch,
        paramId: componentRow.paramId,
        paramDesc: componentRow.paramDesc,
        moduleDesc: componentRow.moduleDesc,
        uom: componentRow.uom,
        operation: componentRow.operation,
        standardMH: componentRow.standardMH,
        ifChecked: componentRow.ifChecked,
        leftType: componentRow.leftType,
        leftValue: componentRow.leftValue,
        condition: componentRow.condition,
        rightType: componentRow.rightType,
        rightValue: componentRow.rightValue
        // Note: isExpanded, hasChildren, and children are NOT saved to DB
    };
};

// =====================================
// 3. TREE STRUCTURE RECONSTRUCTION
// =====================================

/**
 * Convert flat database rows to nested tree structure for component
 * @param {Array} dbRows - Flat array of database rows
 * @returns {Array} Nested tree structure for component
 */
export const buildTreeFromFlatData = (dbRows) => {
    if (!dbRows || !Array.isArray(dbRows)) return [];
    
    // Step 1: Convert all rows to component format
    const componentRows = dbRows.map(dbRowToComponentRow).filter(Boolean);
    
    // Step 2: Create a map for quick lookup
    const rowMap = new Map();
    componentRows.forEach(row => {
        rowMap.set(row.id, { ...row });
    });
    
    // Step 3: Build parent-child relationships
    const rootRows = [];
    
    componentRows.forEach(row => {
        const currentRow = rowMap.get(row.id);
        
        if (!currentRow.parentId) {
            // This is a root row
            rootRows.push(currentRow);
        } else {
            // This is a child row
            const parent = rowMap.get(currentRow.parentId);
            if (parent) {
                if (currentRow.isTrueBranch === true) {
                    parent.children.trueChild = currentRow;
                } else if (currentRow.isTrueBranch === false) {
                    parent.children.falseChild = currentRow;
                }
                
                // Update parent's hasChildren status
                parent.hasChildren = !!(parent.children.trueChild || parent.children.falseChild);
            }
        }
    });
    
    // Step 4: Recursively update hasChildren for all nested levels
    const updateChildrenStatus = (row) => {
        if (row.children.trueChild || row.children.falseChild) {
            row.hasChildren = true;
            
            // Recursively update children
            if (row.children.trueChild) {
                updateChildrenStatus(row.children.trueChild);
            }
            if (row.children.falseChild) {
                updateChildrenStatus(row.children.falseChild);
            }
        } else {
            row.hasChildren = false;
        }
    };
    
    rootRows.forEach(updateChildrenStatus);
    
    return rootRows;
};

/**
 * Convert nested tree structure to flat database format (for saving)
 * @param {Array} componentRows - Nested tree structure
 * @returns {Array} Flat array for database storage
 */
export const flattenTreeForDatabase = (componentRows) => {
    const flatRows = [];
    
    const flattenRecursive = (row) => {
        if (!row) return;
        
        // Add current row to flat array
        flatRows.push(componentRowToDbRow(row));
        
        // Recursively add children
        if (row.children.trueChild) {
            flattenRecursive(row.children.trueChild);
        }
        if (row.children.falseChild) {
            flattenRecursive(row.children.falseChild);
        }
    };
    
    componentRows.forEach(flattenRecursive);
    
    return flatRows.filter(Boolean);
};

// =====================================
// 4. USAGE EXAMPLES AND INTEGRATION
// =====================================

/**
 * Example: Loading data from database and preparing for component
 * @param {Array} dbData - Raw data from database
 * @param {Array} paramOptions - Parameter options
 * @param {Array} uomOptions - UOM options
 * @returns {Object} Ready-to-use component props
 */
export const prepareDataForComponent = (dbData, paramOptions = [], uomOptions = []) => {
    console.log('🔄 Converting database data to component format...');
    console.log('📊 Database rows received:', dbData.length);
    
    // Convert flat database data to nested tree structure
    const nestedRows = buildTreeFromFlatData(dbData);
    
    console.log('🌳 Tree structure created with', nestedRows.length, 'root rows');
    
    // Prepare final data structure
    const componentData = {
        initialRows: nestedRows,
        paramIdOptions: paramOptions,
        uomOptions: uomOptions
    };
    
    console.log('✅ Component data prepared successfully');
    return componentData;
};

/**
 * Example: Preparing component data for database save
 * @param {Array} componentRows - Component tree structure
 * @returns {Array} Flat array ready for database
 */
export const prepareDataForDatabase = (componentRows) => {
    console.log('💾 Converting component data to database format...');
    
    // Flatten tree structure for database storage
    const flatData = flattenTreeForDatabase(componentRows);
    
    console.log('📋 Flattened to', flatData.length, 'database rows');
    console.log('✅ Database data prepared successfully');
    
    return flatData;
};

// =====================================
// 5. SAMPLE DATABASE DATA EXAMPLES
// =====================================

export const sampleDatabaseData = [
    // Root row with IF condition
    {
        id: 1,
        parentId: null,
        isTrueBranch: null,
        paramId: "000001",
        paramDesc: "Engine Speed Parameter",
        moduleDesc: "Engine Control Module",
        uom: "RPM",
        operation: "*",
        standardMH: 0,
        ifChecked: true,
        leftType: "PARAM ID",
        leftValue: "000001",
        condition: ">",
        rightType: "NUMBER",
        rightValue: "1000"
    },
    // True branch child
    {
        id: 2,
        parentId: 1,
        isTrueBranch: true,
        paramId: "000002",
        paramDesc: "High Speed Calculation",
        moduleDesc: "Performance Module",
        uom: "SEC",
        operation: "*",
        standardMH: 25,
        ifChecked: false,
        leftType: "PARAM ID",
        leftValue: "",
        condition: "==",
        rightType: "NUMBER",
        rightValue: ""
    },
    // False branch child
    {
        id: 3,
        parentId: 1,
        isTrueBranch: false,
        paramId: "000003",
        paramDesc: "Low Speed Calculation",
        moduleDesc: "Economy Module",
        uom: "SEC",
        operation: "*",
        standardMH: 15,
        ifChecked: false,
        leftType: "PARAM ID",
        leftValue: "",
        condition: "==",
        rightType: "NUMBER",
        rightValue: ""
    },
    // Another root row (simple calculation)
    {
        id: 4,
        parentId: null,
        isTrueBranch: null,
        paramId: "000004",
        paramDesc: "Base Calculation",
        moduleDesc: "Base Module",
        uom: "MIN",
        operation: "+",
        standardMH: 10,
        ifChecked: false,
        leftType: "PARAM ID",
        leftValue: "",
        condition: "==",
        rightType: "NUMBER",
        rightValue: ""
    }
];

export const sampleParameterOptions = [
    { value: '000001', label: '[000001]', description: 'Engine Speed Parameter' },
    { value: '000002', label: '[000002]', description: 'High Speed Calculation' },
    { value: '000003', label: '[000003]', description: 'Low Speed Calculation' },
    { value: '000004', label: '[000004]', description: 'Base Calculation' }
];

export const sampleUomOptions = [
    { value: 'EA', label: 'EA' },
    { value: 'SEC', label: 'SEC' },
    { value: 'MIN', label: 'MIN' },
    { value: 'HRS', label: 'HRS' },
    { value: 'RPM', label: 'RPM' }
];

// =====================================
// 6. INTEGRATION EXAMPLE COMPONENT
// =====================================

export const exampleIntegration = `
import React, { useState, useEffect } from 'react';
import NestedIfGridV2 from './NestedIfGridV2';
import { 
    prepareDataForComponent, 
    prepareDataForDatabase,
    sampleDatabaseData,
    sampleParameterOptions,
    sampleUomOptions 
} from './DataTransformUtils';

function DatabaseIntegratedGrid() {
    const [componentData, setComponentData] = useState({
        initialRows: [],
        paramIdOptions: [],
        uomOptions: []
    });
    const [loading, setLoading] = useState(false);

    // Load data from database (simulated)
    const loadFromDatabase = async () => {
        setLoading(true);
        try {
            // Simulate API call - replace with your actual API
            // const response = await fetch('/api/formula-rows');
            // const dbData = await response.json();
            
            // For demo, use sample data
            const dbData = sampleDatabaseData;
            const paramOptions = sampleParameterOptions;
            const uomOptions = sampleUomOptions;
            
            // Transform database data to component format
            const transformedData = prepareDataForComponent(dbData, paramOptions, uomOptions);
            setComponentData(transformedData);
            
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading data from database');
        } finally {
            setLoading(false);
        }
    };

    // Save data to database
    const saveToDatabase = async (componentRows) => {
        try {
            // Transform component data to database format
            const dbData = prepareDataForDatabase(componentRows);
            
            console.log('Data to save:', dbData);
            
            // Replace with your actual API call
            // const response = await fetch('/api/formula-rows', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(dbData)
            // });
            
            alert('Data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data to database');
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadFromDatabase();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Database Integrated Formula Builder</h2>
            <button onClick={loadFromDatabase} style={{ marginBottom: '20px' }}>
                Reload from Database
            </button>
            
            <NestedIfGridV2
                initialRows={componentData.initialRows}
                paramIdOptions={componentData.paramIdOptions}
                uomOptions={componentData.uomOptions}
                onDataChange={saveToDatabase}
            />
        </div>
    );
}

export default DatabaseIntegratedGrid;
`;