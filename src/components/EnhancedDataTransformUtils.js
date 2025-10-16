/**
 * Enhanced Data Transformation Utilities for IFAndLookup Component
 * Supports multiple children under TRUE/FALSE branches
 */

// =====================================
// 1. ENHANCED ID CONVERSION UTILITIES
// =====================================

/**
 * Convert database numeric ID to component string ID
 * @param {number} dbId - Database ID (number)
 * @returns {string|null} Component ID (string)
 */
export const dbIdToComponentId = (dbId) => {
    if (dbId === null || dbId === undefined) return null;
    // For consistency, always return numeric ID as-is for the new system
    return dbId;
};

/**
 * Convert component string ID to database numeric ID
 * @param {string} componentId - Component ID (string like "row_123")
 * @returns {number|null} Database ID (number)
 */
export const componentIdToDbId = (componentId) => {
    if (componentId === null || componentId === undefined) return null;
    
    // Handle numeric IDs (new sequential system)
    if (typeof componentId === 'number') {
        return componentId;
    }
    
    // Handle string IDs (legacy and special cases)
    if (typeof componentId === 'string') {
        // Handle special cases for auto-generated IDs with branch info
        if (componentId.includes('_true_') || componentId.includes('_false_')) {
            const parts = componentId.split('_');
            const baseId = parts[1];
            return parseInt(baseId, 10) || null;
        }
        
        // Handle "row_123" format
        const match = componentId.match(/^row_(\d+)$/);
        if (match) {
            return parseInt(match[1], 10);
        }
        
        // Try to parse as a direct number string
        const numericId = parseInt(componentId, 10);
        return isNaN(numericId) ? null : numericId;
    }
    
    return null;
};

// =====================================
// 2. ENHANCED DATA STRUCTURE CONVERSION
// =====================================

/**
 * Convert single database row to enhanced component format
 * @param {Object} dbRow - Database row object
 * @returns {Object} Component row object with multiple children support
 */
export const dbRowToComponentRow = (dbRow) => {
    if (!dbRow) return null;
    
    return {
        id: dbIdToComponentId(dbRow.id),
        parentId: dbIdToComponentId(dbRow.parentId),
        branchFlag: dbRow.branchFlag,
        branchIndex: dbRow.branchIndex !== undefined ? dbRow.branchIndex : null,
        paramId: dbRow.paramId || '',
        description: dbRow.description || '',
        userComments: dbRow.userComments || '',
        uom: dbRow.uom || 'EA',
        operation: dbRow.operation || '*',
        standardMh: dbRow.standardMh || 0,
        rowOperator: dbRow.rowOperator || '+', // Row-level operator for combining rows
        
        // Enhanced: Support new conditionType field (FeaturesV1)
        conditionType: dbRow.conditionType || (dbRow.ifChecked ? 'IF-ELSE' : 'None'), // Migration support
        ifChecked: dbRow.ifChecked || false, // Keep for backward compatibility
        
        // Conditional fields
        leftType: dbRow.leftType || 'PARAM ID',
        leftValue: dbRow.leftValue || '',
        ifCondition: dbRow.ifCondition || '==',
        rightType: dbRow.rightType || 'PARAM ID',
        rightValue: dbRow.rightValue || '',
        
        // NEW FIELDS FOR LOOKUP TYPED PARAMETERS (FeaturesV3)
        lookupParamType: dbRow.lookupParamType || 'Param ID',
        lookupParamValue: dbRow.lookupParamValue || '',
        lookupParamDesc: dbRow.lookupParamDesc || '',
        
        // UI-only fields (derived, not from DB)
        isExpanded: (dbRow.conditionType && dbRow.conditionType !== 'None') || dbRow.ifChecked || false,
        hasChildren: (dbRow.conditionType && dbRow.conditionType !== 'None') || dbRow.ifChecked || false,
        children: {
            trueChildren: [], // Enhanced: array instead of single child
            falseChildren: [] // Enhanced: array instead of single child
        }
    };
};

/**
 * Convert enhanced component row to database format (for saving)
 * @param {Object} componentRow - Component row object
 * @returns {Object} Database row object
 */
export const componentRowToDbRow = (componentRow) => {
    if (!componentRow) return null;
    
    return {
        id: componentIdToDbId(componentRow.id),
        parentId: componentIdToDbId(componentRow.parentId),
        branchFlag: componentRow.branchFlag,
        branchIndex: componentRow.branchIndex,
        paramId: componentRow.paramId,
        description: componentRow.description,
        userComments: componentRow.userComments,
        uom: componentRow.uom,
        operation: componentRow.operation,
        standardMh: componentRow.standardMh,
        rowOperator: componentRow.rowOperator || '+', // Row-level operator for combining rows
        
        // Enhanced: Support new conditionType field (FeaturesV1)
        conditionType: componentRow.conditionType || 'None', // New field for FeaturesV1
        ifChecked: componentRow.ifChecked || (componentRow.conditionType && componentRow.conditionType !== 'None'), // Migration support
        
        leftType: componentRow.leftType,
        leftValue: componentRow.leftValue,
        ifCondition: componentRow.ifCondition,
        rightType: componentRow.rightType,
        rightValue: componentRow.rightValue,
        
        // NEW FIELDS FOR LOOKUP TYPED PARAMETERS (FeaturesV3)
        lookupParamType: componentRow.lookupParamType || 'Param ID',
        lookupParamValue: componentRow.lookupParamValue || '',
        lookupParamDesc: componentRow.lookupParamDesc || ''
        
        // Note: isExpanded, hasChildren, children, and formula (calculated field) are NOT saved to DB
    };
};

// =====================================
// 3. ENHANCED TREE STRUCTURE RECONSTRUCTION
// =====================================

/**
 * Convert flat database rows to enhanced nested tree structure
 * @param {Array} dbRows - Flat array of database rows
 * @returns {Array} Enhanced nested tree structure with multiple children support
 */
export const buildEnhancedTreeFromFlatData = (dbRows) => {
    if (!dbRows || !Array.isArray(dbRows)) return [];
    
    console.log('🔄 Building enhanced tree from', dbRows.length, 'database rows...');
    
    // Step 1: Convert all rows to component format
    const componentRows = dbRows.map(dbRowToComponentRow).filter(Boolean);
    
    // Step 2: Create a map for quick lookup - FIXED: Reference same objects, don't copy
    const rowMap = new Map();
    componentRows.forEach(row => {
        rowMap.set(row.id, row); // Don't spread - use same reference!
    });
    
    // Step 3: Group children by parent and branch
    const childrenGroups = new Map();
    
    componentRows.forEach(row => {
        if (row.parentId) {
            const key = `${row.parentId}_${row.branchFlag}`;
            if (!childrenGroups.has(key)) {
                childrenGroups.set(key, []);
            }
            childrenGroups.get(key).push(row);
        }
    });
    
    console.log('🔍 Parent-child groups found:', childrenGroups.size);
    
    // Step 4: Sort children by branchIndex and assign to parents
    childrenGroups.forEach((children, key) => {
        const [parentId, branchFlag] = key.split('_');
        const parent = rowMap.get(parentId);
        
        console.log(`🔗 Processing ${children.length} children for parent ${parentId}, branch: ${branchFlag}`);
        
        if (parent) {
            // Sort children by branchIndex
            children.sort((a, b) => (a.branchIndex || 0) - (b.branchIndex || 0));
            
            if (branchFlag === 'true') {
                parent.children.trueChildren = children;
                console.log(`✅ Added ${children.length} TRUE children to parent ${parentId}`);
            } else if (branchFlag === 'false') {
                parent.children.falseChildren = children;
                console.log(`✅ Added ${children.length} FALSE children to parent ${parentId}`);
            }
            
            // Update parent's hasChildren status
            parent.hasChildren = parent.children.trueChildren.length > 0 || parent.children.falseChildren.length > 0;
            console.log(`📊 Parent ${parentId} hasChildren: ${parent.hasChildren} (true: ${parent.children.trueChildren.length}, false: ${parent.children.falseChildren.length})`);
        } else {
            console.warn(`⚠️ Parent ${parentId} not found in rowMap!`);
        }
    });
    
    // Step 5: Get root rows (no parent)
    const rootRows = componentRows.filter(row => !row.parentId);
    
    // Step 6: Recursively update hasChildren for all nested levels
    const updateChildrenStatus = (row) => {
        const hasTrueChildren = row.children.trueChildren && row.children.trueChildren.length > 0;
        const hasFalseChildren = row.children.falseChildren && row.children.falseChildren.length > 0;
        
        row.hasChildren = hasTrueChildren || hasFalseChildren;
        
        // Recursively update children
        [...row.children.trueChildren, ...row.children.falseChildren].forEach(child => {
            updateChildrenStatus(child);
        });
    };
    
    rootRows.forEach(updateChildrenStatus);
    
    console.log('✅ Enhanced tree built with', rootRows.length, 'root rows');
    return rootRows;
};

/**
 * Convert enhanced nested tree structure to flat database format
 * @param {Array} componentRows - Enhanced nested tree structure
 * @returns {Array} Flat array for database storage
 */
export const flattenEnhancedTreeForDatabase = (componentRows) => {
    const flatRows = [];
    
    const flattenRecursive = (row) => {
        if (!row) return;
        
        // Add current row to flat array
        flatRows.push(componentRowToDbRow(row));
        
        // Recursively add all children from both branches
        [...row.children.trueChildren, ...row.children.falseChildren].forEach(child => {
            flattenRecursive(child);
        });
    };
    
    componentRows.forEach(flattenRecursive);
    
    return flatRows.filter(Boolean);
};

// =====================================
// 4. ENHANCED USAGE EXAMPLES
// =====================================

/**
 * Enhanced: Loading data from database and preparing for IFAndLookup component
 * @param {Array} dbData - Raw data from database
 * @param {Array} paramOptions - Parameter options
 * @param {Array} uomOptions - UOM options
 * @returns {Object} Ready-to-use enhanced component props
 */
export const prepareEnhancedDataForComponent = (dbData, paramOptions = [], uomOptions = []) => {
    console.log('🚀 Converting database data to enhanced component format...');
    console.log('📊 Database rows received:', dbData.length);
    
    // Convert flat database data to enhanced nested tree structure
    const nestedRows = buildEnhancedTreeFromFlatData(dbData);
    
    console.log('🌳 Enhanced tree structure created with', nestedRows.length, 'root rows');
    
    // Prepare final data structure
    const componentData = {
        initialRows: nestedRows,
        paramIdOptions: paramOptions,
        uomOptions: uomOptions
    };
    
    console.log('✅ Enhanced component data prepared successfully');
    return componentData;
};

/**
 * Enhanced: Preparing component data for database save
 * @param {Array} componentRows - Enhanced component tree structure
 * @returns {Array} Flat array ready for database
 */
export const prepareEnhancedDataForDatabase = (componentRows) => {
    console.log('💾 Converting enhanced component data to database format...');
    
    // Flatten enhanced tree structure for database storage
    const flatData = flattenEnhancedTreeForDatabase(componentRows);
    
    console.log('📋 Flattened to', flatData.length, 'database rows');
    console.log('✅ Enhanced database data prepared successfully');
    
    return flatData;
};

// =====================================
// 5. ENHANCED SAMPLE DATABASE DATA
// =====================================

export const enhancedSampleDatabaseData = [
    // ================================
    // ROOT 1: Engine Speed Analysis (ID: 1)
    // Complex IF with multiple TRUE/FALSE children
    // ================================
    {
        id: 1,
        parentId: null,
        branchFlag: null,
        branchIndex: null,
        paramId: "000001",
        description: "Engine Speed Parameter",
        userComments: "Engine Control Module",
        uom: "RPM",
        operation: "*",
        standardMh: 0,
        ifChecked: true,
        leftType: "PARAM ID",
        leftValue: "000001",
        ifCondition: ">",
        rightType: "NUMBER",
        rightValue: "1000"
    },
    
    // TRUE Branch: High Speed Operations (3 children)
    {
        id: 2,
        parentId: 1,
        branchFlag: true,
        branchIndex: 0,
        paramId: "000002",
        description: "High Speed Calculation 1",
        userComments: "Performance Module 1",
        uom: "SEC",
        operation: "*",
        standardMh: 25,
        ifChecked: false
    },
    {
        id: 3,
        parentId: 1,
        branchFlag: true,
        branchIndex: 1,
        paramId: "000003",
        description: "High Speed Calculation 2",
        userComments: "Performance Module 2",
        uom: "MIN",
        operation: "+",
        standardMh: 15,
        ifChecked: false
    },
    {
        id: 4,
        parentId: 1,
        branchFlag: true,
        branchIndex: 2,
        paramId: "000004",
        description: "High Speed Calculation 3",
        userComments: "Performance Module 3",
        uom: "HRS",
        operation: "*",
        standardMh: 5,
        ifChecked: false
    },
    
    // FALSE Branch: Low Speed Operations (2 children)
    {
        id: 5,
        parentId: 1,
        branchFlag: false,
        branchIndex: 0,
        paramId: "000005",
        description: "Low Speed Calculation 1",
        userComments: "Economy Module 1",
        uom: "SEC",
        operation: "*",
        standardMh: 10,
        ifChecked: false
    },
    {
        id: 6,
        parentId: 1,
        branchFlag: false,
        branchIndex: 1,
        paramId: "000006",
        description: "Low Speed Calculation 2",
        userComments: "Economy Module 2",
        uom: "MIN",
        operation: "+",
        standardMh: 8,
        ifChecked: false
    },
    
    // ================================
    // ROOT 2: Temperature Analysis (ID: 7)
    // Multi-level nesting with nested IFs
    // ================================
    {
        id: 7,
        parentId: null,
        branchFlag: null,
        branchIndex: null,
        paramId: "000007",
        description: "Temperature Check",
        userComments: "Temperature Control",
        uom: "TEMP",
        operation: "*",
        standardMh: 0,
        ifChecked: true,
        leftType: "PARAM ID",
        leftValue: "000007",
        ifCondition: "<",
        rightType: "NUMBER",
        rightValue: "50"
    },
    
    // TRUE Branch: Cold Temperature Handling
    {
        id: 8,
        parentId: 7,
        branchFlag: true,
        branchIndex: 0,
        paramId: "000008",
        description: "Cold Temperature Handler",
        userComments: "Cold Weather Module",
        uom: "SEC",
        operation: "*",
        standardMh: 20,
        ifChecked: true, // NESTED IF: This has its own children!
        leftType: "PARAM ID",
        leftValue: "000008",
        ifCondition: "<",
        rightType: "NUMBER",
        rightValue: "0"
    },
    
    // Nested TRUE: Extreme Cold (Below 0°)
    {
        id: 9,
        parentId: 8,
        branchFlag: true,
        branchIndex: 0,
        paramId: "000009",
        description: "Extreme Cold Calculation 1",
        userComments: "Arctic Module 1",
        uom: "MIN",
        operation: "*",
        standardMh: 45,
        ifChecked: false
    },
    {
        id: 10,
        parentId: 8,
        branchFlag: true,
        branchIndex: 1,
        paramId: "000010",
        description: "Extreme Cold Calculation 2",
        userComments: "Arctic Module 2",
        uom: "HRS",
        operation: "+",
        standardMh: 30,
        ifChecked: false
    },
    
    // Nested FALSE: Normal Cold (0° to 50°)
    {
        id: 11,
        parentId: 8,
        branchFlag: false,
        branchIndex: 0,
        paramId: "000011",
        description: "Normal Cold Calculation",
        userComments: "Standard Cold Module",
        uom: "SEC",
        operation: "*",
        standardMh: 12,
        ifChecked: false
    },
    
    // Additional TRUE child for Temperature root
    {
        id: 13,
        parentId: 7,
        branchFlag: true,
        branchIndex: 1,
        paramId: "000013",
        description: "General Cold Processing",
        userComments: "Base Cold Module",
        uom: "SEC",
        operation: "+",
        standardMh: 8,
        ifChecked: false
    },
    
    // FALSE Branch: Warm Temperature (Above 50°)
    {
        id: 12,
        parentId: 7,
        branchFlag: false,
        branchIndex: 0,
        paramId: "000012",
        description: "Warm Temperature Calculation",
        userComments: "Warm Weather Module",
        uom: "MIN",
        operation: "+",
        standardMh: 5,
        ifChecked: false
    },
    
    // ================================
    // ROOT 3: Pressure Analysis (ID: 14)
    // Another complex scenario
    // ================================
    {
        id: 14,
        parentId: null,
        branchFlag: null,
        branchIndex: null,
        paramId: "000014",
        description: "Pressure Level Check",
        userComments: "Pressure Control System",
        uom: "PSI",
        operation: "*",
        standardMh: 0,
        ifChecked: true,
        leftType: "PARAM ID",
        leftValue: "000014",
        ifCondition: ">=",
        rightType: "NUMBER",
        rightValue: "100"
    },
    
    // TRUE Branch: High Pressure (4 children)
    {
        id: 15,
        parentId: 14,
        branchFlag: true,
        branchIndex: 0,
        paramId: "000015",
        description: "High Pressure Processing 1",
        userComments: "Pressure Module A",
        uom: "SEC",
        operation: "*",
        standardMh: 18,
        ifChecked: false
    },
    {
        id: 16,
        parentId: 14,
        branchFlag: true,
        branchIndex: 1,
        paramId: "000016",
        description: "High Pressure Processing 2",
        userComments: "Pressure Module B",
        uom: "MIN",
        operation: "+",
        standardMh: 12,
        ifChecked: false
    },
    {
        id: 17,
        parentId: 14,
        branchFlag: true,
        branchIndex: 2,
        paramId: "000017",
        description: "Safety Override Check",
        userComments: "Safety System",
        uom: "SEC",
        operation: "*",
        standardMh: 22,
        ifChecked: false
    },
    {
        id: 18,
        parentId: 14,
        branchFlag: true,
        branchIndex: 3,
        paramId: "000018",
        description: "Pressure Relief Calculation",
        userComments: "Relief Valve Module",
        uom: "HRS",
        operation: "+",
        standardMh: 35,
        ifChecked: false
    },
    
    // FALSE Branch: Normal Pressure (3 children)
    {
        id: 19,
        parentId: 14,
        branchFlag: false,
        branchIndex: 0,
        paramId: "000019",
        description: "Normal Pressure Operation 1",
        userComments: "Standard Module 1",
        uom: "SEC",
        operation: "*",
        standardMh: 8,
        ifChecked: false
    },
    {
        id: 20,
        parentId: 14,
        branchFlag: false,
        branchIndex: 1,
        paramId: "000020",
        description: "Normal Pressure Operation 2",
        userComments: "Standard Module 2",
        uom: "MIN",
        operation: "+",
        standardMh: 6,
        ifChecked: false
    },
    {
        id: 21,
        parentId: 14,
        branchFlag: false,
        branchIndex: 2,
        paramId: "000021",
        description: "Efficiency Optimization",
        userComments: "Optimization Module",
        uom: "SEC",
        operation: "*",
        standardMh: 4,
        ifChecked: false
    },
    
    // ================================
    // ROOT 4: Simple Calculation (ID: 22)
    // Non-IF row for variety
    // ================================
    {
        id: 22,
        parentId: null,
        branchFlag: null,
        branchIndex: null,
        paramId: "000022",
        description: "Base Calculation Module",
        userComments: "Foundation System",
        uom: "SEC",
        operation: "*",
        standardMh: 15,
        ifChecked: false // Simple calculation, no children
    },
    
    // ================================
    // ROOT 5: Fuel Analysis (ID: 23)
    // Deep nesting example
    // ================================
    {
        id: 23,
        parentId: null,
        branchFlag: null,
        branchIndex: null,
        paramId: "000023",
        description: "Fuel Efficiency Check",
        userComments: "Fuel Management System",
        uom: "L/HR",
        operation: "*",
        standardMh: 0,
        ifChecked: true,
        leftType: "PARAM ID",
        leftValue: "000023",
        ifCondition: "<=",
        rightType: "NUMBER",
        rightValue: "20"
    },
    
    // TRUE Branch: Efficient Fuel Usage
    {
        id: 24,
        parentId: 23,
        branchFlag: true,
        branchIndex: 0,
        paramId: "000024",
        description: "Eco Mode Processing",
        userComments: "Economy Module",
        uom: "SEC",
        operation: "*",
        standardMh: 12,
        ifChecked: true, // ANOTHER NESTED IF!
        leftType: "PARAM ID",
        leftValue: "000024",
        ifCondition: "==",
        rightType: "NUMBER",
        rightValue: "1"
    },
    
    // Deep Nested TRUE: Eco Mode Active
    {
        id: 25,
        parentId: 24,
        branchFlag: true,
        branchIndex: 0,
        paramId: "000025",
        description: "Maximum Efficiency Calculation",
        userComments: "Max Efficiency Module",
        uom: "MIN",
        operation: "+",
        standardMh: 25,
        ifChecked: false
    },
    
    // Deep Nested FALSE: Eco Mode Inactive
    {
        id: 26,
        parentId: 24,
        branchFlag: false,
        branchIndex: 0,
        paramId: "000026",
        description: "Standard Efficiency Calculation",
        userComments: "Standard Module",
        uom: "SEC",
        operation: "*",
        standardMh: 15,
        ifChecked: false
    },
    
    // Additional TRUE child for Fuel root
    {
        id: 27,
        parentId: 23,
        branchFlag: true,
        branchIndex: 1,
        paramId: "000027",
        description: "Fuel Conservation Protocol",
        userComments: "Conservation System",
        uom: "HRS",
        operation: "+",
        standardMh: 8,
        ifChecked: false
    },
    
    // FALSE Branch: Inefficient Fuel Usage
    {
        id: 28,
        parentId: 23,
        branchFlag: false,
        branchIndex: 0,
        paramId: "000028",
        description: "High Consumption Processing",
        userComments: "Performance Module",
        uom: "SEC",
        operation: "*",
        standardMh: 18,
        ifChecked: false
    },
    {
        id: 29,
        parentId: 23,
        branchFlag: false,
        branchIndex: 1,
        paramId: "000029",
        description: "Fuel Warning System",
        userComments: "Warning Module",
        uom: "MIN",
        operation: "+",
        standardMh: 5,
        ifChecked: false
    }
];

export const enhancedSampleParameterOptions = [
    { value: '000001', label: '[000001]', description: 'Engine Speed Parameter' },
    { value: '000002', label: '[000002]', description: 'High Speed Calculation 1' },
    { value: '000003', label: '[000003]', description: 'High Speed Calculation 2' },
    { value: '000004', label: '[000004]', description: 'High Speed Calculation 3' },
    { value: '000005', label: '[000005]', description: 'Low Speed Calculation 1' },
    { value: '000006', label: '[000006]', description: 'Low Speed Calculation 2' },
    { value: '000007', label: '[000007]', description: 'Temperature Check' },
    { value: '000008', label: '[000008]', description: 'Cold Temperature Handler' },
    { value: '000009', label: '[000009]', description: 'Extreme Cold Calculation 1' },
    { value: '000010', label: '[000010]', description: 'Extreme Cold Calculation 2' },
    { value: '000011', label: '[000011]', description: 'Normal Cold Calculation' },
    { value: '000012', label: '[000012]', description: 'Warm Temperature Calculation' },
    { value: '000013', label: '[000013]', description: 'General Cold Processing' },
    { value: '000014', label: '[000014]', description: 'Pressure Level Check' },
    { value: '000015', label: '[000015]', description: 'High Pressure Processing 1' },
    { value: '000016', label: '[000016]', description: 'High Pressure Processing 2' },
    { value: '000017', label: '[000017]', description: 'Safety Override Check' },
    { value: '000018', label: '[000018]', description: 'Pressure Relief Calculation' },
    { value: '000019', label: '[000019]', description: 'Normal Pressure Operation 1' },
    { value: '000020', label: '[000020]', description: 'Normal Pressure Operation 2' },
    { value: '000021', label: '[000021]', description: 'Efficiency Optimization' },
    { value: '000022', label: '[000022]', description: 'Base Calculation Module' },
    { value: '000023', label: '[000023]', description: 'Fuel Efficiency Check' },
    { value: '000024', label: '[000024]', description: 'Eco Mode Processing' },
    { value: '000025', label: '[000025]', description: 'Maximum Efficiency Calculation' },
    { value: '000026', label: '[000026]', description: 'Standard Efficiency Calculation' },
    { value: '000027', label: '[000027]', description: 'Fuel Conservation Protocol' },
    { value: '000028', label: '[000028]', description: 'High Consumption Processing' },
    { value: '000029', label: '[000029]', description: 'Fuel Warning System' }
];

export const enhancedSampleUomOptions = [
    { value: 'EA', label: 'EA' },
    { value: 'SEC', label: 'SEC' },
    { value: 'MIN', label: 'MIN' },
    { value: 'HRS', label: 'HRS' },
    { value: 'TEMP', label: 'TEMP' },
    { value: 'RPM', label: 'RPM' },
    { value: 'PSI', label: 'PSI' },
    { value: 'L/HR', label: 'L/HR' },
    { value: 'KG', label: 'KG' },
    { value: 'BAR', label: 'BAR' },
    { value: 'LBS', label: 'LBS' }
];

// =====================================
// 6. ENHANCED INTEGRATION EXAMPLE
// =====================================

export const enhancedIntegrationExample = `
import React, { useState, useEffect } from 'react';
import IFAndLookup from './IFAndLookup';
import { 
    prepareEnhancedDataForComponent, 
    prepareEnhancedDataForDatabase,
    enhancedSampleDatabaseData,
    enhancedSampleParameterOptions,
    enhancedSampleUomOptions 
} from './EnhancedDataTransformUtils';

function EnhancedDatabaseIntegratedGrid() {
    const [componentData, setComponentData] = useState({
        initialRows: [],
        paramIdOptions: [],
        uomOptions: []
    });

    // Load enhanced data from database
    const loadFromDatabase = async () => {
        try {
            // Your API call that returns flat data with multiple children
            // const response = await fetch('/api/enhanced-formula-rows');
            // const dbData = await response.json();
            
            // For demo, use enhanced sample data
            const dbData = enhancedSampleDatabaseData;
            const paramOptions = enhancedSampleParameterOptions;
            const uomOptions = enhancedSampleUomOptions;
            
            // Transform database data to enhanced component format
            const transformedData = prepareEnhancedDataForComponent(dbData, paramOptions, uomOptions);
            setComponentData(transformedData);
            
        } catch (error) {
            console.error('Error loading enhanced data:', error);
        }
    };

    // Save enhanced data to database
    const saveToDatabase = async (componentRows) => {
        try {
            // Transform enhanced component data to database format
            const dbData = prepareEnhancedDataForDatabase(componentRows);
            
            console.log('Enhanced data to save:', dbData);
            
            // Your API call to save enhanced data
            // await fetch('/api/enhanced-formula-rows', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(dbData)
            // });
            
        } catch (error) {
            console.error('Error saving enhanced data:', error);
        }
    };

    useEffect(() => {
        loadFromDatabase();
    }, []);

    return (
        <IFAndLookup
            initialRows={componentData.initialRows}
            paramIdOptions={componentData.paramIdOptions}
            uomOptions={componentData.uomOptions}
            onDataChange={saveToDatabase}
        />
    );
}

export default EnhancedDatabaseIntegratedGrid;
`;

// =====================================
// 7. BACKWARD COMPATIBILITY & EXPORTS
// =====================================

const EnhancedDataTransformUtils = {
    // Enhanced functions
    dbIdToComponentId,
    componentIdToDbId,
    dbRowToComponentRow,
    componentRowToDbRow,
    buildEnhancedTreeFromFlatData,
    flattenEnhancedTreeForDatabase,
    prepareEnhancedDataForComponent,
    prepareEnhancedDataForDatabase,
    
    // Sample data
    enhancedSampleDatabaseData,
    enhancedSampleParameterOptions,
    enhancedSampleUomOptions,
    
    // Example code
    enhancedIntegrationExample
};

export default EnhancedDataTransformUtils;