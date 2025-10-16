import React, { useState, useEffect } from 'react';
import { 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    Snackbar,
    IconButton,
    Tooltip,
    Divider
} from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveIcon from '@material-ui/icons/Remove';

import './index.css';

// Import transformation utilities for database format
import { prepareEnhancedDataForDatabase } from './EnhancedDataTransformUtils';

function FeaturesV3({ 
    initialRows = [], 
    paramIdOptions = [], 
    uomOptions = [], 
    onDataChange 
}) {
    // Simple ID counter for clean sequential IDs
    const [idCounter, setIdCounter] = useState(1);
    
    // Generate next sequential ID
    const generateNextId = () => {
        const nextId = idCounter;
        setIdCounter(prev => prev + 1);
        console.log(`🆔 Generated ID: ${nextId}, next counter will be: ${nextId + 1}`);
        return nextId;
    };

    // CRITICAL FIX: Synchronous ID generation to prevent duplicate IDs
    const generateMultipleIds = (count) => {
        const ids = [];
        let currentId = idCounter;
        for (let i = 0; i < count; i++) {
            ids.push(currentId + i);
        }
        setIdCounter(prev => prev + count);
        console.log(`🆔 Generated ${count} IDs: [${ids.join(', ')}], next counter: ${currentId + count}`);
        return ids;
    };

    // Create default initial rows if needed - Fixed to not cause infinite loops
    const createDefaultRow = () => {
        const newId = idCounter;
        setIdCounter(prev => prev + 1);
        
        return {
            id: newId,
            parentId: null,
            isTrueBranch: null,
            branchIndex: null,
            paramId: '',
            paramDesc: '',
            moduleDesc: '',
            uom: 'EA',
            operation: '*',
            standardMH: '',
            conditionType: 'None', // Enhanced: None | IF | IF-ELSE | LOOKUP
            ifChecked: false,
            isExpanded: false,
            hasChildren: false,
            leftType: 'PARAM ID',
            leftValue: '',
            condition: '==',
            rightType: 'PARAM ID',
            rightValue: '',
            children: {
                trueChildren: [],
                falseChildren: []
            }
        };
    };

    // Initialize rows with proper handling of database data
    const initializeRows = () => {
        if (initialRows.length > 0) {
            return initialRows.map(row => ({
                ...row,
                conditionType: row.conditionType || (row.ifChecked ? 'IF' : 'None'),
                standardMH: String(row.standardMH || ''),
                isExpanded: row.isExpanded !== undefined ? row.isExpanded : (row.ifChecked || false),
                hasChildren: row.hasChildren !== undefined ? row.hasChildren : (row.ifChecked || false),
                children: row.children ? {
                    trueChildren: row.children.trueChildren || (row.children.trueChild ? [row.children.trueChild] : []),
                    falseChildren: row.children.falseChildren || (row.children.falseChild ? [row.children.falseChild] : [])
                } : { trueChildren: [], falseChildren: [] },
                branchIndex: row.branchIndex !== undefined ? row.branchIndex : null
            }));
        }
        return [];
    };

    const [rows, setRows] = useState(initializeRows);
    
    // Validation state
    const [validationErrors, setValidationErrors] = useState({});
    const [showValidationAlert, setShowValidationAlert] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

    // Default options if not provided
    const defaultParamOptions = [
        { value: '000001', label: '[000001]', description: 'Param Testing Description 1' },
        { value: '000002', label: '[000002]', description: 'Param Testing Description 2' },
        { value: '000003', label: '[000003]', description: 'Param Testing Description 3' }
    ];

    const defaultUomOptions = [
        { value: 'EA', label: 'EA' },
        { value: 'SEC', label: 'SEC' },
        { value: 'MIN', label: 'MIN' },
        { value: 'HRS', label: 'HRS' }
    ];

    const operationOptions = ['+', '-', '*', '/', 'Number', 'String'];
    const conditionOptions = ['=', '>', '<', '<>'];
    const typeOptions = ['PARAM ID', 'NUMBER', 'TEXT'];

    const finalParamOptions = paramIdOptions.length > 0 ? paramIdOptions : defaultParamOptions;
    const finalUomOptions = uomOptions.length > 0 ? uomOptions : defaultUomOptions;

    // Initialize ID counter based on existing data
    const initializeIdCounter = (rows) => {
        let maxId = 0;
        
        const findMaxId = (rowsList) => {
            rowsList.forEach(row => {
                const numericId = typeof row.id === 'number' ? row.id : 
                                 typeof row.id === 'string' ? parseInt(row.id.replace(/\D/g, '')) || 0 : 0;
                maxId = Math.max(maxId, numericId);
                
                if (row.children?.trueChildren) findMaxId(row.children.trueChildren);
                if (row.children?.falseChildren) findMaxId(row.children.falseChildren);
            });
        };
        
        findMaxId(rows);
        setIdCounter(maxId + 1);
    };

    useEffect(() => {
        if (initialRows.length > 0) {
            initializeIdCounter(initialRows);
            
            const initializedRows = initialRows.map(row => ({
                ...row,
                isExpanded: row.isExpanded !== undefined ? row.isExpanded : (row.ifChecked || false),
                hasChildren: row.hasChildren !== undefined ? row.hasChildren : (row.ifChecked || false),
                children: row.children ? {
                    trueChildren: row.children.trueChildren || (row.children.trueChild ? [row.children.trueChild] : []),
                    falseChildren: row.children.falseChildren || (row.children.falseChild ? [row.children.falseChild] : [])
                } : { trueChildren: [], falseChildren: [] },
                branchIndex: row.branchIndex !== undefined ? row.branchIndex : null
            }));
            setRows(initializedRows);
        }
    }, [initialRows]);

    // Validation functions - Updated for LOOKUP
    const validateRow = (row, errors = {}, path = '') => {
        const rowPath = path || row.id;
        
        // Validate Param ID
        if (!row.paramId || row.paramId.trim() === '') {
            errors[`${rowPath}.paramId`] = 'Param ID is required';
        }
        
        // Validate Comment
        if (!row.moduleDesc || row.moduleDesc.trim() === '') {
            errors[`${rowPath}.moduleDesc`] = 'Comment is required';
        }
        
        // None or LOOKUP: Validate basic fields
        if (row.conditionType === 'None' || row.conditionType === 'LOOKUP') {
            if (!row.uom || row.uom.trim() === '') {
                errors[`${rowPath}.uom`] = 'UOM is required';
            }
            if (!row.operation || row.operation.trim() === '') {
                errors[`${rowPath}.operation`] = 'Operation is required';
            }
            if (row.standardMH === null || row.standardMH === undefined || row.standardMH === '') {
                errors[`${rowPath}.standardMH`] = 'Standard MH/UOM is required';
            } else {
                const operation = row.operation;
                if (operation === 'Number') {
                    const mathRegex = /^[0-9+\-*/.()]+$/;
                    if (!mathRegex.test(row.standardMH)) {
                        errors[`${rowPath}.standardMH`] = 'Standard MH/UOM must contain only numbers and math operators (+, -, *, /, ., (, ))';
                    }
                } else if (operation === 'String') {
                    const stringRegex = /^[A-Za-z_\- ]+$/;
                    const hasMultipleSpaces = /\s{2,}/.test(row.standardMH);
                    if (!stringRegex.test(row.standardMH)) {
                        errors[`${rowPath}.standardMH`] = 'Standard MH/UOM must contain only letters, underscore, dash, and single spaces';
                    } else if (hasMultipleSpaces) {
                        errors[`${rowPath}.standardMH`] = 'Standard MH/UOM cannot contain multiple consecutive spaces';
                    }
                } else {
                    const mathRegex = /^[0-9+\-*/.()]+$/;
                    if (!mathRegex.test(row.standardMH)) {
                        errors[`${rowPath}.standardMH`] = 'Standard MH/UOM must contain only numbers and math operators (+, -, *, /, ., (, ))';
                    }
                }
            }
            
            // LOOKUP specific: Validate it has at least 3 parameters
            if (row.conditionType === 'LOOKUP') {
                if (!row.children?.trueChildren || row.children.trueChildren.length < 3) {
                    errors[`${rowPath}.children`] = 'LOOKUP requires at least 3 parameters';
                }
            }
        } else if (row.conditionType === 'IF' || row.conditionType === 'IF-ELSE') {
            // Validate conditional fields
            if (!row.leftType || row.leftType.trim() === '') {
                errors[`${rowPath}.leftType`] = 'Left Type is required';
            }
            if (!row.leftValue || row.leftValue.trim() === '') {
                errors[`${rowPath}.leftValue`] = 'Left Value is required';
            }
            if (!row.condition || row.condition.trim() === '') {
                errors[`${rowPath}.condition`] = 'Condition is required';
            }
            if (!row.rightType || row.rightType.trim() === '') {
                errors[`${rowPath}.rightType`] = 'Right Type is required';
            }
            if (!row.rightValue || row.rightValue.trim() === '') {
                errors[`${rowPath}.rightValue`] = 'Right Value is required';
            }
        }
        
        // Validate children recursively
        if (row.conditionType === 'IF' || row.conditionType === 'IF-ELSE' || row.conditionType === 'LOOKUP') {
            if (row.children.trueChildren && row.children.trueChildren.length > 0) {
                row.children.trueChildren.forEach((child, index) => {
                    validateRow(child, errors, `${rowPath}.true.${index}`);
                });
            }
            
            if (row.conditionType === 'IF-ELSE' && row.children.falseChildren && row.children.falseChildren.length > 0) {
                row.children.falseChildren.forEach((child, index) => {
                    validateRow(child, errors, `${rowPath}.false.${index}`);
                });
            }
        }
        
        return errors;
    };

    const validateAllRows = () => {
        let errors = {};
        
        if (rows.length === 0) {
            errors.general = 'At least one row is required';
            return errors;
        }
        
        rows.forEach(row => {
            validateRow(row, errors);
        });
        
        return errors;
    };

    const hasValidationErrors = (errors) => {
        return Object.keys(errors).length > 0;
    };

    const buildValidationPath = (row, allRows) => {
        if (!row.parentId || row.isTrueBranch === null) {
            return row.id;
        }
        
        const parent = findRowRecursively(allRows, row.parentId);
        if (!parent) {
            return row.id;
        }
        
        const parentPath = buildValidationPath(parent, allRows);
        const branchType = row.isTrueBranch ? 'true' : 'false';
        const branchIndex = row.branchIndex !== null ? row.branchIndex : 0;
        return `${parentPath}.${branchType}.${branchIndex}`;
    };

    const findRowRecursively = (rowsList, targetId) => {
        for (let row of rowsList) {
            if (row.id === targetId) {
                return row;
            }
            
            if (row.children.trueChildren && row.children.trueChildren.length > 0) {
                const found = findRowRecursively(row.children.trueChildren, targetId);
                if (found) return found;
            }
            if (row.children.falseChildren && row.children.falseChildren.length > 0) {
                const found = findRowRecursively(row.children.falseChildren, targetId);
                if (found) return found;
            }
        }
        return null;
    };

    const getFieldError = (row, fieldName) => {
        const path = buildValidationPath(row, rows);
        const errorKey = `${path}.${fieldName}`;
        return validationErrors[errorKey];
    };

    const hasFieldError = (row, fieldName) => {
        return !!getFieldError(row, fieldName);
    };

    // Create new row structure
    const createNewRow = (id, parentId = null, isTrueBranch = null, branchIndex = null) => ({
        id,
        parentId,
        isTrueBranch,
        branchIndex,
        paramId: '',
        paramDesc: '',
        moduleDesc: '',
        uom: 'EA',
        operation: '*',
        standardMH: '',
        rowOperator: '+', // Operator to combine this row with previous rows
        conditionType: 'None',
        ifChecked: false,
        isExpanded: false,
        hasChildren: false,
        leftType: 'PARAM ID',
        leftValue: '',
        condition: '==',
        rightType: 'PARAM ID',
        rightValue: '',
        children: {
            trueChildren: [],
            falseChildren: []
        }
    });

    // Update row data with deep copy
    const updateRow = (rowId, field, value) => {
        setRows(prevRows => {
            const newRows = JSON.parse(JSON.stringify(prevRows));
            console.log(`🔧 Updating row ${rowId}, field: ${field}, value:`, value);
            updateRowRecursive(newRows, rowId, field, value);
            if (onDataChange) onDataChange(newRows);
            return newRows;
        });
    };

    const updateRowRecursive = (rowsList, rowId, field, value) => {
        for (let row of rowsList) {
            if (row.id === rowId) {
                console.log(`🎯 UPDATING ROW ${rowId}: Field: ${field}, Old: ${row[field]}, New: ${value}`);
                row[field] = value;
                
                if (field === 'paramId') {
                    const selectedParam = finalParamOptions.find(opt => opt.value === value);
                    if (selectedParam) {
                        row.paramDesc = selectedParam.description || '';
                    }
                }
                return true;
            }
            
            // Check if any child was updated - if so, mark parent as updated to trigger re-render
            if (row.children.trueChildren && updateRowRecursive(row.children.trueChildren, rowId, field, value)) {
                // Force parent to re-render by updating its lastUpdated timestamp
                row.lastUpdated = Date.now();
                console.log(`🔄 Parent row ${row.id} marked for re-render due to child ${rowId} update`);
                return true;
            }
            if (row.children.falseChildren && updateRowRecursive(row.children.falseChildren, rowId, field, value)) {
                // Force parent to re-render by updating its lastUpdated timestamp
                row.lastUpdated = Date.now();
                console.log(`🔄 Parent row ${row.id} marked for re-render due to child ${rowId} update`);
                return true;
            }
        }
        return false;
    };

    // Handle Condition Type change - Updated for LOOKUP
    const handleConditionTypeChange = (rowId, conditionType) => {
        setRows(prevRows => {
            const newRows = JSON.parse(JSON.stringify(prevRows));
            updateConditionTypeRecursive(newRows, rowId, conditionType);
            if (onDataChange) onDataChange(newRows);
            return newRows;
        });
    };

    const updateConditionTypeRecursive = (rowsList, rowId, conditionType) => {
        for (let row of rowsList) {
            if (row.id === rowId) {
                row.conditionType = conditionType;
                const hasChildren = conditionType === 'IF' || conditionType === 'IF-ELSE' || conditionType === 'LOOKUP';
                
                row.ifChecked = hasChildren;
                row.hasChildren = hasChildren;
                
                if (hasChildren && row.children.trueChildren.length === 0 && row.children.falseChildren.length === 0) {
                    console.log(`🔧 Creating children for parent ${rowId}, condition type: ${conditionType}`);
                    
                    if (conditionType === 'IF-ELSE') {
                        const [trueChildId, falseChildId] = generateMultipleIds(2);
                        const trueChild = createNewRow(trueChildId, rowId, true, 0);
                        const falseChild = createNewRow(falseChildId, rowId, false, 0);
                        row.children.trueChildren = [trueChild];
                        row.children.falseChildren = [falseChild];
                        console.log(`✅ Created TRUE child ID: ${trueChildId}, FALSE child ID: ${falseChildId}`);
                    } else if (conditionType === 'IF') {
                        const trueChildId = generateNextId();
                        const trueChild = createNewRow(trueChildId, rowId, true, 0);
                        row.children.trueChildren = [trueChild];
                        row.children.falseChildren = [];
                        console.log(`✅ Created TRUE child ID: ${trueChildId} for IF condition`);
                    } else if (conditionType === 'LOOKUP') {
                        // Create 3 children for LOOKUP initially (minimum parameters)
                        const [param1Id, param2Id, param3Id] = generateMultipleIds(3);
                        const param1Child = createNewRow(param1Id, rowId, true, 0);
                        const param2Child = createNewRow(param2Id, rowId, true, 1);
                        const param3Child = createNewRow(param3Id, rowId, true, 2);
                        row.children.trueChildren = [param1Child, param2Child, param3Child];
                        row.children.falseChildren = [];
                        console.log(`✅ Created 3 LOOKUP parameters: Param1(${param1Id}), Param2(${param2Id}), Param3(${param3Id})`);
                    }
                    
                    row.isExpanded = true;
                } else if (hasChildren) {
                    console.log(`🔄 Switching condition type to: ${conditionType} for parent ${rowId}`);
                    
                    if (conditionType === 'IF') {
                        row.children.falseChildren = [];
                        if (row.children.trueChildren.length === 0) {
                            const trueChildId = generateNextId();
                            const trueChild = createNewRow(trueChildId, rowId, true, 0);
                            row.children.trueChildren = [trueChild];
                        }
                    } else if (conditionType === 'LOOKUP') {
                        row.children.falseChildren = [];
                        const currentCount = row.children.trueChildren.length;
                        if (currentCount < 3) {
                            const neededCount = 3 - currentCount;
                            const newIds = generateMultipleIds(neededCount);
                            for (let i = 0; i < neededCount; i++) {
                                const newChild = createNewRow(newIds[i], rowId, true, currentCount + i);
                                row.children.trueChildren.push(newChild);
                            }
                            console.log(`✅ Added ${neededCount} children for LOOKUP to reach 3 minimum`);
                        }
                    } else if (conditionType === 'IF-ELSE') {
                        const needsTrue = row.children.trueChildren.length === 0;
                        const needsFalse = row.children.falseChildren.length === 0;
                        const childrenNeeded = (needsTrue ? 1 : 0) + (needsFalse ? 1 : 0);
                        
                        if (childrenNeeded > 0) {
                            const newIds = generateMultipleIds(childrenNeeded);
                            let idIndex = 0;
                            
                            if (needsTrue) {
                                const trueChild = createNewRow(newIds[idIndex++], rowId, true, 0);
                                row.children.trueChildren = [trueChild];
                            }
                            
                            if (needsFalse) {
                                const falseChild = createNewRow(newIds[idIndex++], rowId, false, 0);
                                row.children.falseChildren = [falseChild];
                            }
                        }
                    }
                } else if (!hasChildren) {
                    row.children.trueChildren = [];
                    row.children.falseChildren = [];
                    row.isExpanded = false;
                }
                return true;
            }
            
            // Check if any child's condition type was updated - if so, mark parent as updated to trigger re-render
            if (row.children.trueChildren && updateConditionTypeRecursive(row.children.trueChildren, rowId, conditionType)) {
                row.lastUpdated = Date.now();
                console.log(`🔄 Parent row ${row.id} marked for re-render due to child ${rowId} condition change`);
                return true;
            }
            if (row.children.falseChildren && updateConditionTypeRecursive(row.children.falseChildren, rowId, conditionType)) {
                row.lastUpdated = Date.now();
                console.log(`🔄 Parent row ${row.id} marked for re-render due to child ${rowId} condition change`);
                return true;
            }
        }
        return false;
    };

    // Toggle expand/collapse
    const toggleExpand = (rowId) => {
        setRows(prevRows => {
            const newRows = JSON.parse(JSON.stringify(prevRows));
            toggleExpandRecursive(newRows, rowId);
            return newRows;
        });
    };

    const toggleExpandRecursive = (rowsList, rowId) => {
        for (let row of rowsList) {
            if (row.id === rowId) {
                row.isExpanded = !row.isExpanded;
                return true;
            }
            
            if (row.children.trueChildren && toggleExpandRecursive(row.children.trueChildren, rowId)) {
                return true;
            }
            if (row.children.falseChildren && toggleExpandRecursive(row.children.falseChildren, rowId)) {
                return true;
            }
        }
        return false;
    };

    // Add child row
    const addChildRow = (parentRowId, isTrueBranch) => {
        setRows(prevRows => {
            const newRows = JSON.parse(JSON.stringify(prevRows));
            addChildRowRecursive(newRows, parentRowId, isTrueBranch);
            if (onDataChange) onDataChange(newRows);
            return newRows;
        });
    };

    const addChildRowRecursive = (rowsList, parentRowId, isTrueBranch) => {
        for (let row of rowsList) {
            if (row.id === parentRowId) {
                const targetArray = isTrueBranch ? row.children.trueChildren : row.children.falseChildren;
                const newIndex = targetArray.length;
                const newRowId = generateNextId();
                
                const newChildRow = createNewRow(newRowId, parentRowId, isTrueBranch, newIndex);
                targetArray.push(newChildRow);
                
                row.hasChildren = true;
                row.isExpanded = true;
                // Force parent to re-render by updating its lastUpdated timestamp
                row.lastUpdated = Date.now();
                console.log(`🔄 Parent row ${row.id} marked for re-render due to new child ${newRowId} added`);
                return true;
            }
            
            if (row.children.trueChildren && addChildRowRecursive(row.children.trueChildren, parentRowId, isTrueBranch)) {
                // Mark grandparent for re-render too
                row.lastUpdated = Date.now();
                console.log(`🔄 Grandparent row ${row.id} marked for re-render due to nested child addition`);
                return true;
            }
            if (row.children.falseChildren && addChildRowRecursive(row.children.falseChildren, parentRowId, isTrueBranch)) {
                // Mark grandparent for re-render too
                row.lastUpdated = Date.now();
                console.log(`🔄 Grandparent row ${row.id} marked for re-render due to nested child addition`);
                return true;
            }
        }
        return false;
    };

    // Remove child row
    const removeChildRow = (parentRowId, isTrueBranch, childIndex) => {
        setRows(prevRows => {
            const newRows = JSON.parse(JSON.stringify(prevRows));
            removeChildRowRecursive(newRows, parentRowId, isTrueBranch, childIndex);
            if (onDataChange) onDataChange(newRows);
            return newRows;
        });
    };

    const removeChildRowRecursive = (rowsList, parentRowId, isTrueBranch, childIndex) => {
        for (let row of rowsList) {
            if (row.id === parentRowId) {
                const targetArray = isTrueBranch ? row.children.trueChildren : row.children.falseChildren;
                
                if (childIndex >= 0 && childIndex < targetArray.length) {
                    targetArray.splice(childIndex, 1);
                    
                    targetArray.forEach((child, index) => {
                        child.branchIndex = index;
                    });
                    
                    row.hasChildren = row.children.trueChildren.length > 0 || row.children.falseChildren.length > 0;
                }
                return true;
            }
            
            if (row.children.trueChildren && removeChildRowRecursive(row.children.trueChildren, parentRowId, isTrueBranch, childIndex)) {
                return true;
            }
            if (row.children.falseChildren && removeChildRowRecursive(row.children.falseChildren, parentRowId, isTrueBranch, childIndex)) {
                return true;
            }
        }
        return false;
    };

    // Generate formula preview - Updated for LOOKUP
    const generateFormula = (row) => {
        if (row.conditionType === 'None') {
            const paramDisplay = row.paramId ? `[${row.paramId}]` : '[PARAM]';
            const standardMH = String(row.standardMH || '');
            const operation = row.operation || '*';
            
            if (operation === 'Number' || operation === 'String') {
                if (!standardMH || standardMH.trim() === '') {
                    return operation === 'Number' ? '0' : 'EMPTY_STRING';
                }
                return standardMH;
            } else {
                if (!standardMH || standardMH.trim() === '' || standardMH === '0') {
                    return paramDisplay;
                }
                return `${paramDisplay} ${operation} ${standardMH}`;
            }
        } else if (row.conditionType === 'LOOKUP') {
            // LOOKUP formula: All children are parameters for the LOOKUP function
            const children = row.children?.trueChildren || [];
            
            if (children.length === 0) {
                return 'LOOKUP(NO_PARAMS)';
            }
            
            // Build LOOKUP with all child parameters
            const params = children.map((child, index) => {
                console.log(`🔍 LOOKUP Param ${index + 1}:`, {
                    id: child.id,
                    paramId: child.paramId,
                    operation: child.operation,
                    standardMH: child.standardMH,
                    conditionType: child.conditionType
                });
                
                // If child has its own condition (IF, IF-ELSE, nested LOOKUP), generate its formula recursively
                if (child.conditionType && child.conditionType !== 'None') {
                    const formula = generateFormula(child);
                    console.log(`  ➜ Nested formula for Param ${index + 1}:`, formula);
                    return formula;
                }
                
                // For 'None' condition children, generate their basic formula
                if (!child.paramId || child.paramId.trim() === '') {
                    console.log(`  ➜ Param ${index + 1}: No paramId, returning PARAM`);
                    return 'PARAM';
                }
                
                // Check if it's a text/string value (contains quotes or text)
                const paramValue = child.paramId;
                
                // If it looks like a number parameter ID, wrap in brackets
                if (/^\d+$/.test(paramValue)) {
                    // Check if there's an operation and standardMH
                    const standardMH = String(child.standardMH || '');
                    const operation = child.operation || '*';
                    
                    if (operation === 'Number' || operation === 'String') {
                        if (!standardMH || standardMH.trim() === '') {
                            return operation === 'Number' ? '0' : 'EMPTY_STRING';
                        }
                        return standardMH;
                    } else {
                        // For LOOKUP parameters, include the operation and standardMH if present
                        if (!standardMH || standardMH.trim() === '') {
                            console.log(`  ➜ No standardMH, returning [${paramValue}]`);
                            return `[${paramValue}]`;
                        }
                        // Only skip operation if standardMH is explicitly 0
                        if (standardMH === '0') {
                            console.log(`  ➜ standardMH=0, returning [${paramValue}]`);
                            return `[${paramValue}]`;
                        }
                        // Always show the operation and value for LOOKUP parameters (even * 1)
                        const result = `[${paramValue}] ${operation} ${standardMH}`;
                        console.log(`  ➜ Returning: ${result}`);
                        return result;
                    }
                }
                
                // If it contains brackets already, use as-is
                if (paramValue.startsWith('[') && paramValue.endsWith(']')) {
                    return paramValue;
                }
                
                // If it's a string literal (starts with quote), use as-is
                if (paramValue.startsWith("'") || paramValue.startsWith('"')) {
                    return paramValue;
                }
                
                // If it looks like a variable name (uppercase letters, underscores)
                if (/^[A-Z_]+$/.test(paramValue)) {
                    return paramValue;
                }
                
                // If it contains curly braces (like {ML_CODE}), use as-is
                if (paramValue.includes('{') && paramValue.includes('}')) {
                    return paramValue;
                }
                
                // Default: treat as text and add quotes
                return `'${paramValue}'`;
            });
            
            return `LOOKUP(${params.join(', ')})`;
        } else {
            // IF and IF-ELSE conditions
            const formatValueForFormula = (value, type) => {
                if (!value) return type === 'PARAM ID' ? '[PARAM]' : type === 'TEXT' ? "'TEXT'" : 'VALUE';
                
                switch (type) {
                    case 'PARAM ID':
                        return `[${value}]`;
                    case 'TEXT':
                        return `'${value}'`;
                    case 'NUMBER':
                    default:
                        return value;
                }
            };

            const leftVal = formatValueForFormula(row.leftValue, row.leftType);
            const condition = row.condition || '=';
            const rightVal = formatValueForFormula(row.rightValue, row.rightType);
            
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
            
            const trueFormula = generateChildrenFormula(row.children.trueChildren);
            
            if (row.conditionType === 'IF') {
                return `IF(${leftVal} ${condition} ${rightVal}, ${trueFormula})`;
            } else if (row.conditionType === 'IF-ELSE') {
                const falseFormula = generateChildrenFormula(row.children.falseChildren);
                return `IF(${leftVal} ${condition} ${rightVal}, ${trueFormula}, ${falseFormula})`;
            }
        }
    };

    // Render value field based on type
    const renderValueField = (row, fieldPrefix) => {
        const typeField = `${fieldPrefix}Type`;
        const valueField = `${fieldPrefix}Value`;
        const typeValue = row[typeField];
        const currentValue = row[valueField];
        const hasError = hasFieldError(row, valueField);

        switch (typeValue) {
            case 'PARAM ID':
                return (
                    <Autocomplete
                        value={finalParamOptions.find(option => option.value === currentValue) || null}
                        onChange={(event, newValue) => {
                            updateRow(row.id, valueField, newValue ? newValue.value : '');
                        }}
                        options={finalParamOptions}
                        getOptionLabel={(option) => option.label || ''}
                        getOptionSelected={(option, value) => option.value === value.value}
                        size="small"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                error={hasError}
                                placeholder="Search Param ID..."
                            />
                        )}
                        renderOption={(option) => (
                            <div>
                                <strong>{option.label}</strong>
                                {option.description && (
                                    <div style={{ fontSize: '0.8em', color: '#666' }}>
                                        {option.description}
                                    </div>
                                )}
                            </div>
                        )}
                        noOptionsText="No matching Param ID found"
                        clearOnEscape
                        openOnFocus
                    />
                );
            case 'NUMBER':
                return (
                    <TextField
                        type="number"
                        variant="outlined"
                        size="small"
                        value={currentValue}
                        onChange={(e) => updateRow(row.id, valueField, e.target.value)}
                        error={hasError}
                    />
                );
            case 'TEXT':
                return (
                    <TextField
                        type="text"
                        variant="outlined"
                        size="small"
                        value={currentValue}
                        onChange={(e) => updateRow(row.id, valueField, e.target.value)}
                        error={hasError}
                    />
                );
            default:
                return (
                    <TextField
                        variant="outlined"
                        size="small"
                        value={currentValue}
                        disabled
                        error={hasError}
                    />
                );
        }
    };

    // Add new row
    const addNewRow = () => {
        setRows(prevRows => {
            const newRow = createDefaultRow();
            const updatedRows = [...prevRows, newRow];
            if (onDataChange) onDataChange(updatedRows);
            return updatedRows;
        });
    };

    // Delete row
    const deleteRow = (rowId) => {
        setRows(prevRows => {
            const deepCopiedRows = JSON.parse(JSON.stringify(prevRows));
            const updatedRows = removeRowRecursive(deepCopiedRows, rowId);
            if (onDataChange) onDataChange(updatedRows);
            return updatedRows;
        });
    };

    const removeRowRecursive = (rowsList, rowId) => {
        const filteredRows = rowsList.filter(row => row.id !== rowId);
        
        return filteredRows.map(row => {
            const updatedRow = { ...row };
            let childrenChanged = false;
            
            if (updatedRow.children.trueChildren && updatedRow.children.trueChildren.length > 0) {
                const originalLength = updatedRow.children.trueChildren.length;
                updatedRow.children.trueChildren = removeRowRecursive(updatedRow.children.trueChildren, rowId);
                if (originalLength !== updatedRow.children.trueChildren.length) {
                    childrenChanged = true;
                }
            }
            
            if (updatedRow.children.falseChildren && updatedRow.children.falseChildren.length > 0) {
                const originalLength = updatedRow.children.falseChildren.length;
                updatedRow.children.falseChildren = removeRowRecursive(updatedRow.children.falseChildren, rowId);
                if (originalLength !== updatedRow.children.falseChildren.length) {
                    childrenChanged = true;
                }
            }
            
            updatedRow.hasChildren = updatedRow.children.trueChildren.length > 0 || updatedRow.children.falseChildren.length > 0;
            
            // If any children were removed, mark parent for re-render
            if (childrenChanged) {
                updatedRow.lastUpdated = Date.now();
                console.log(`🔄 Parent row ${updatedRow.id} marked for re-render due to child ${rowId} deletion`);
            }
            
            return updatedRow;
        });
    };

    // Generate complete formula
    const generateCompleteFormula = () => {
        if (rows.length === 0) return '';
        if (rows.length === 1) return generateFormula(rows[0]);
        
        // Build formula using each row's rowOperator
        let formula = `(${generateFormula(rows[0])})`;
        for (let i = 1; i < rows.length; i++) {
            const rowOperator = rows[i].rowOperator || '+';
            formula += ` ${rowOperator} (${generateFormula(rows[i])})`;
        }
        return formula;
    };

    // Save data
    const saveData = () => {
        setValidationErrors({});
        setShowValidationAlert(false);
        
        const errors = validateAllRows();
        
        if (hasValidationErrors(errors)) {
            setValidationErrors(errors);
            
            const errorCount = Object.keys(errors).length;
            const errorMessages = Object.values(errors).slice(0, 3);
            
            let message = `Found ${errorCount} validation error${errorCount > 1 ? 's' : ''}:\n`;
            message += errorMessages.join('\n');
            
            if (errorCount > 3) {
                message += `\n... and ${errorCount - 3} more error${errorCount - 3 > 1 ? 's' : ''}`;
            }
            
            setValidationMessage(message);
            setShowValidationAlert(true);
            alert(`Validation Failed!\n\n${message}\n\nPlease fix the errors and try again.`);
            return;
        }
        
        console.log('=== FeaturesV3 Data Export ===');
        console.log('Validation Status: PASSED ✅');
        console.log('Complete Formula:', generateCompleteFormula());
        console.log('Rows Data (Component Format):', JSON.stringify(rows, null, 2));
        console.log('Total Rows:', rows.length);
        
        try {
            const dbData = prepareEnhancedDataForDatabase(rows);
            
            // Enhance database data with formula preview for each row
            const enhancedDbData = dbData.map(dbRow => {
                // Find the original component row to generate its formula
                const findRowById = (rows, id) => {
                    for (const row of rows) {
                        if (row.id === id) return row;
                        const trueResult = findRowById(row.children.trueChildren, id);
                        if (trueResult) return trueResult;
                        const falseResult = findRowById(row.children.falseChildren, id);
                        if (falseResult) return falseResult;
                    }
                    return null;
                };
                
                const componentRow = findRowById(rows, dbRow.id);
                const formula = componentRow ? generateFormula(componentRow) : 'N/A';
                
                return {
                    ...dbRow,
                    formulaPreview: formula // Add formula preview to each row
                };
            });
            
            console.log('💾 Rows Data for DB (Flat Structure):', JSON.stringify(enhancedDbData, null, 2));
            console.log('📋 Database Rows Count:', enhancedDbData.length);
            console.log('✅ Database transformation completed successfully!');
        } catch (error) {
            console.error('❌ Error transforming to database format:', error);
        }
        
        console.log('Timestamp:', new Date().toISOString());
        alert('✅ Validation Passed!\n\nData saved to console successfully!\nCheck browser console for both Component and Database formats.');
    };

    // Render children section - Enhanced for LOOKUP
    const renderChildrenSection = (row, isTrueBranch) => {
        const children = isTrueBranch ? row.children.trueChildren : row.children.falseChildren;
        
        let branchName, branchColor, backgroundColor;
        if (row.conditionType === 'LOOKUP') {
            branchName = 'LOOKUP Children';
            branchColor = '#ff9800';
            backgroundColor = '#fff3e0';
        } else {
            branchName = isTrueBranch ? 'TRUE' : 'FALSE';
            branchColor = isTrueBranch ? '#4caf50' : '#f44336';
            backgroundColor = isTrueBranch ? '#e8f5e8' : '#ffebee';
        }
        
        return (
            <div style={{ marginLeft: '40px', marginTop: '10px' }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '10px',
                    padding: '8px',
                    backgroundColor: backgroundColor,
                    borderLeft: `4px solid ${branchColor}`,
                    borderRadius: '4px'
                }}>
                    <Typography variant="subtitle2" style={{ color: branchColor, fontWeight: 'bold', marginRight: '10px' }}>
                        {branchName} ({children.length} row{children.length !== 1 ? 's' : ''})
                    </Typography>
                    <Tooltip title={`Add new row to ${branchName}`}>
                        <IconButton
                            size="small"
                            onClick={() => addChildRow(row.id, isTrueBranch)}
                            style={{ color: branchColor }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                
                {children.map((child, index) => {
                    let rowLabel = `Row ${index + 1}:`;
                    if (row.conditionType === 'LOOKUP') {
                        rowLabel = `🔍 Param ${index + 1}:`;
                    }
                    
                    // For LOOKUP, first 3 children cannot be removed (minimum required)
                    const canRemove = row.conditionType === 'LOOKUP' ? (index >= 3 && children.length > 3) : children.length > 1;
                    
                    return (
                        <div key={child.id} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                <Typography variant="caption" style={{ 
                                    marginRight: '10px', 
                                    minWidth: '130px', 
                                    fontWeight: (index < 3 && row.conditionType === 'LOOKUP') ? 'bold' : 'normal',
                                    color: (index < 3 && row.conditionType === 'LOOKUP') ? '#ff9800' : 'inherit'
                                }}>
                                    {rowLabel}
                                </Typography>
                                {canRemove && (
                                    <Tooltip title={`Remove this row from ${branchName} branch`}>
                                        <IconButton
                                            size="small"
                                            onClick={() => removeChildRow(row.id, isTrueBranch, index)}
                                            style={{ color: '#f44336', marginRight: '10px' }}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>
                            {renderRow(child, true, index, 0, row.conditionType)}
                        </div>
                    );
                })}
                
                {children.length === 0 && (
                    <div style={{ 
                        padding: '20px', 
                        textAlign: 'center', 
                        color: '#666',
                        fontStyle: 'italic',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '4px',
                        border: '1px dashed #ccc'
                    }}>
                        No rows in {branchName} branch. Click + to add a row.
                    </div>
                )}
            </div>
        );
    };

    // Enhanced row rendering
    const renderRow = (row, isChild = false, childIndex = null, rowIndex = 0, parentConditionType = null) => (
        <div key={row.id} className={isChild ? 'custom-child-row' : 'row'}>
            <div className='custom-row border-bottom'>
                
                {/* Show/Hide Toggle */}
                <div className='col-block row-show-hide w40'>
                    {row.hasChildren && (
                        <KeyboardArrowDownIcon 
                            onClick={() => toggleExpand(row.id)}
                            style={{ 
                                transform: row.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                        />
                    )}
                </div>

                {/* Row Operator - Only show for root rows (not first) */}
                {!isChild && rowIndex > 0 && (
                    <div className='col-block w60'>
                        <FormControl variant="outlined" size="small" fullWidth>
                            <InputLabel>Row Op</InputLabel>
                            <Select
                                value={row.rowOperator || '+'}
                                onChange={(e) => updateRow(row.id, 'rowOperator', e.target.value)}
                                label="Row Op"
                            >
                                <MenuItem value="+">+</MenuItem>
                                <MenuItem value="*">×</MenuItem>
                                <MenuItem value="/">÷</MenuItem>
                                <MenuItem value="-">−</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                )}

                {/* TRUE/FALSE Indicator for child rows */}
                {isChild && (
                    <div className={`col-block col-condition ${row.isTrueBranch ? 'true' : 'false'} w40`}>
                        {row.isTrueBranch ? <DoneIcon /> : <ClearIcon />}
                        {childIndex !== null && (
                            <Typography variant="caption" style={{ marginLeft: '4px' }}>
                                {childIndex + 1}
                            </Typography>
                        )}
                    </div>
                )}

                {/* Row Operator for child rows (not first child, and not LOOKUP children) */}
                {isChild && childIndex > 0 && parentConditionType !== 'LOOKUP' && (
                    <div className='col-block w60'>
                        <FormControl variant="outlined" size="small" fullWidth>
                            <InputLabel>Row Op</InputLabel>
                            <Select
                                value={row.rowOperator || '+'}
                                onChange={(e) => updateRow(row.id, 'rowOperator', e.target.value)}
                                label="Row Op"
                            >
                                <MenuItem value="+">+</MenuItem>
                                <MenuItem value="*">×</MenuItem>
                                <MenuItem value="/">÷</MenuItem>
                                <MenuItem value="-">−</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                )}

                {/* Param ID - Searchable */}
                <div className='col-block'>
                    <Autocomplete
                        value={finalParamOptions.find(option => option.value === row.paramId) || null}
                        onChange={(event, newValue) => {
                            updateRow(row.id, 'paramId', newValue ? newValue.value : '');
                        }}
                        options={finalParamOptions}
                        getOptionLabel={(option) => option.label || ''}
                        getOptionSelected={(option, value) => option.value === value.value}
                        size="small"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Param ID"
                                variant="outlined"
                                error={hasFieldError(row, 'paramId')}
                                placeholder="Search Param ID..."
                            />
                        )}
                        renderOption={(option) => (
                            <div>
                                <strong>{option.label}</strong>
                                {option.description && (
                                    <div style={{ fontSize: '0.8em', color: '#666' }}>
                                        {option.description}
                                    </div>
                                )}
                            </div>
                        )}
                        noOptionsText="No matching Param ID found"
                        clearOnEscape
                        openOnFocus
                    />
                </div>

                {/* Param Description */}
                <div className='col-block w200'>
                    <TextField
                        label="Param Description"
                        value={row.paramDesc}
                        variant="outlined"
                        size="small"
                        disabled
                    />
                </div>

                {/* UOM - Disabled for IF/IF-ELSE */}
                <div className='col-block'>
                    <Autocomplete
                        value={finalUomOptions.find(option => option.value === row.uom) || null}
                        onChange={(event, newValue) => {
                            updateRow(row.id, 'uom', newValue ? newValue.value : '');
                        }}
                        options={finalUomOptions}
                        getOptionLabel={(option) => option.label || ''}
                        getOptionSelected={(option, value) => option.value === value.value}
                        size="small"
                        disabled={row.conditionType === 'IF' || row.conditionType === 'IF-ELSE'}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="UOM"
                                variant="outlined"
                                error={hasFieldError(row, 'uom')}
                                placeholder="Search UOM..."
                            />
                        )}
                        noOptionsText="No matching UOM found"
                        clearOnEscape
                        openOnFocus
                    />
                </div>

                {/* Operation - Disabled for IF/IF-ELSE */}
                <div className='col-block'>
                    <Autocomplete
                        value={operationOptions.find(op => op === row.operation) || null}
                        onChange={(event, newValue) => {
                            updateRow(row.id, 'operation', newValue || '');
                        }}
                        options={operationOptions}
                        getOptionLabel={(option) => option}
                        size="small"
                        disabled={row.conditionType === 'IF' || row.conditionType === 'IF-ELSE'}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Operation"
                                variant="outlined"
                                error={hasFieldError(row, 'operation')}
                                placeholder="Search Operation..."
                            />
                        )}
                        renderOption={(option) => (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{option}</span>
                                {option === 'Number' && <span style={{ color: '#666', fontSize: '0.8em' }}>(Numeric values)</span>}
                                {option === 'String' && <span style={{ color: '#666', fontSize: '0.8em' }}>(Text values)</span>}
                            </div>
                        )}
                        noOptionsText="No matching operation found"
                        clearOnEscape
                        openOnFocus
                    />
                </div>

                {/* Standard MH/UOM */}
                <div className='col-block'>
                    <TextField
                        label="Standard MH/UOM"
                        type="text"
                        value={String(row.standardMH || '')}
                        onChange={(e) => {
                            const value = e.target.value;
                            const operation = row.operation;
                            
                            if (operation === 'Number') {
                                const mathRegex = /^[0-9+\-*/.()]*$/;
                                if (mathRegex.test(value)) {
                                    updateRow(row.id, 'standardMH', value);
                                }
                            } else if (operation === 'String') {
                                const stringRegex = /^[A-Za-z_\- ]*$/;
                                const hasMultipleSpaces = /\s{2,}/.test(value);
                                if (stringRegex.test(value) && !hasMultipleSpaces) {
                                    updateRow(row.id, 'standardMH', value);
                                }
                            } else {
                                const mathRegex = /^[0-9+\-*/.()]*$/;
                                if (mathRegex.test(value)) {
                                    updateRow(row.id, 'standardMH', value);
                                }
                            }
                        }}
                        variant="outlined"
                        size="small"
                        disabled={row.conditionType === 'IF' || row.conditionType === 'IF-ELSE'}
                        error={hasFieldError(row, 'standardMH')}
                        placeholder={
                            row.operation === 'Number' ? "e.g. 10, (2+3)*4, 15.5" :
                            row.operation === 'String' ? "e.g. Product_Name, Test-Case" :
                            "e.g. 10, (2+3)*4, 15.5"
                        }
                    />
                </div>

                {/* CONDITION TYPE DROPDOWN - Now includes LOOKUP */}
                <div className='col-block w120'>
                    <FormControl 
                        variant="outlined" 
                        size="small"
                        error={hasFieldError(row, 'conditionType')}
                    >
                        <InputLabel error={hasFieldError(row, 'conditionType')}>Condition</InputLabel>
                        <Select
                            value={row.conditionType || 'None'}
                            onChange={(e) => handleConditionTypeChange(row.id, e.target.value)}
                            label="Condition"
                            error={hasFieldError(row, 'conditionType')}
                        >
                            <MenuItem value="None">None</MenuItem>
                            <MenuItem value="IF">IF</MenuItem>
                            <MenuItem value="IF-ELSE">IF-ELSE</MenuItem>
                            <MenuItem value="LOOKUP">LOOKUP</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {/* Conditional Fields - Only for IF/IF-ELSE */}
                {(row.conditionType === 'IF' || row.conditionType === 'IF-ELSE') && (
                    <>
                        {/* Left Type */}
                        <div className='col-block'>
                            <FormControl 
                                variant="outlined" 
                                size="small"
                                error={hasFieldError(row, 'leftType')}
                            >
                                <InputLabel error={hasFieldError(row, 'leftType')}>Left Type</InputLabel>
                                <Select
                                    value={row.leftType}
                                    onChange={(e) => updateRow(row.id, 'leftType', e.target.value)}
                                    label="Left Type"
                                    error={hasFieldError(row, 'leftType')}
                                >
                                    {typeOptions.map(type => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Left Value */}
                        <div className='col-block'>
                            {renderValueField(row, 'left')}
                        </div>

                        {/* Condition */}
                        <div className='col-block'>
                            <FormControl 
                                variant="outlined" 
                                size="small"
                                error={hasFieldError(row, 'condition')}
                            >
                                <InputLabel error={hasFieldError(row, 'condition')}>Condition</InputLabel>
                                <Select
                                    value={row.condition}
                                    onChange={(e) => updateRow(row.id, 'condition', e.target.value)}
                                    label="Condition"
                                    error={hasFieldError(row, 'condition')}
                                >
                                    {conditionOptions.map(cond => (
                                        <MenuItem key={cond} value={cond}>{cond}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Right Type */}
                        <div className='col-block'>
                            <FormControl 
                                variant="outlined" 
                                size="small"
                                error={hasFieldError(row, 'rightType')}
                            >
                                <InputLabel error={hasFieldError(row, 'rightType')}>Right Type</InputLabel>
                                <Select
                                    value={row.rightType}
                                    onChange={(e) => updateRow(row.id, 'rightType', e.target.value)}
                                    label="Right Type"
                                    error={hasFieldError(row, 'rightType')}
                                >
                                    {typeOptions.map(type => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Right Value */}
                        <div className='col-block'>
                            {renderValueField(row, 'right')}
                        </div>
                    </>
                )}

                {/* Formula Preview */}
                <div className='col-block formula-preview' key={`formula-${row.id}-${row.lastUpdated || 0}`}>
                    <span>{generateFormula(row)}</span>
                </div>

                {/* Comment */}
                <div className='col-block w200'>
                    <TextField
                        label="Comment"
                        value={row.moduleDesc}
                        onChange={(e) => updateRow(row.id, 'moduleDesc', e.target.value)}
                        variant="outlined"
                        size="small"
                        error={hasFieldError(row, 'moduleDesc')}
                    />
                </div>

                {/* Delete Button */}
                {!isChild && (
                    <div className='col-block w60'>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => deleteRow(row.id)}
                            style={{ minWidth: '40px' }}
                        >
                            Delete
                        </Button>
                    </div>
                )}

            </div>

            {/* Child Rendering for IF, IF-ELSE, and LOOKUP */}
            {row.hasChildren && row.isExpanded && (row.conditionType === 'IF' || row.conditionType === 'IF-ELSE' || row.conditionType === 'LOOKUP') && (
                <div className='custom-child-container' style={{ marginLeft: '20px', marginTop: '10px' }}>
                    <Divider style={{ margin: '10px 0' }} />
                    
                    {/* TRUE Branch / LOOKUP Children */}
                    {renderChildrenSection(row, true)}
                    
                    {/* FALSE Branch - Only for IF-ELSE */}
                    {row.conditionType === 'IF-ELSE' && renderChildrenSection(row, false)}
                    
                    <Divider style={{ margin: '10px 0' }} />
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Control Panel */}
            <Paper elevation={2} style={{ padding: '20px', marginBottom: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
                    <Typography variant="h5" component="h2">
                        🎯 FeaturesV3 - IF Builder with LOOKUP
                    </Typography>
                    <Box>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={addNewRow}
                            style={{ marginRight: '10px' }}
                        >
                            Add Row
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<SaveIcon />}
                            onClick={saveData}
                        >
                            Save Data
                        </Button>
                    </Box>
                </Box>
                
                {/* Enhancement Info */}
                <Box marginBottom={2}>
                    <Typography variant="body2" style={{ 
                        padding: '10px', 
                        backgroundColor: '#e3f2fd', 
                        borderRadius: '4px',
                        border: '1px solid #2196f3'
                    }}>
                        ✨ <strong>FeaturesV3 Enhancements:</strong> Choose condition type (None/IF/IF-ELSE/LOOKUP)! 
                        🔍 LOOKUP supports dynamic parameters (3, 4, 5, 6, 7, or more). Parent row keeps basic fields, children are LOOKUP parameters.
                        Click the <AddIcon style={{ fontSize: '16px', verticalAlign: 'middle' }} /> button to add more parameters.
                    </Typography>
                </Box>
                
                {/* Final Formula Preview */}
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Complete Formula Preview:
                    </Typography>
                    <Paper 
                        elevation={1} 
                        style={{ 
                            padding: '15px', 
                            backgroundColor: '#f5f5f5',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            wordBreak: 'break-all',
                            border: '1px solid #ddd'
                        }}
                    >
                        <Typography variant="body1" component="code">
                            {generateCompleteFormula() || 'No formula available'}
                        </Typography>
                    </Paper>
                </Box>
            </Paper>

            {/* Formula Build Form */}
            <div className='formula-build-form'>
                {rows.length > 0 ? (
                    rows.map((row, index) => renderRow(row, false, null, index))
                ) : (
                    <div style={{ 
                        padding: '40px', 
                        textAlign: 'center', 
                        backgroundColor: '#f8f9fa',
                        border: '2px dashed #dee2e6',
                        borderRadius: '8px',
                        margin: '20px 0'
                    }}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            No rows available
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Click the "Add Row" button to create your first formula row.
                        </Typography>
                        <button
                            onClick={addNewRow}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            ➕ Add First Row
                        </button>
                    </div>
                )}
            </div>

            {/* Validation Alert */}
            <Snackbar
                open={showValidationAlert}
                autoHideDuration={6000}
                onClose={() => setShowValidationAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowValidationAlert(false)} 
                    severity="error" 
                    variant="filled"
                    style={{ whiteSpace: 'pre-line' }}
                >
                    {validationMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default FeaturesV3;
