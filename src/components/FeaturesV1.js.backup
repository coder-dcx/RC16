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

function FeaturesV1({ 
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
        const newId = idCounter;  // Use current counter value without triggering state update
        setIdCounter(prev => prev + 1); // Update counter separately
        
        return {
            id: newId,
            parentId: null,
            isTrueBranch: null,
            branchIndex: null, // New field for multiple rows under same branch
            paramId: '',
            paramDesc: '',
            moduleDesc: '',
            uom: 'EA',
            operation: '*',
            standardMH: '',
            conditionType: 'None', // Enhanced: Use dropdown instead of checkbox
            ifChecked: false, // Keep for backward compatibility
            isExpanded: false,
            hasChildren: false,
            leftType: 'PARAM ID',
            leftValue: '',
            condition: '==',
            rightType: 'PARAM ID',
            rightValue: '',
            children: {
                trueChildren: [], // Changed from single child to array
                falseChildren: [] // Changed from single child to array
            }
        };
    };

    // Initialize rows with proper handling of database data
    const initializeRows = () => {
        if (initialRows.length > 0) {
            // Ensure all rows have required UI fields and new structure
            return initialRows.map(row => ({
                ...row,
                // Enhanced: Migrate from ifChecked to conditionType
                conditionType: row.conditionType || (row.ifChecked ? 'IF' : 'None'),
                // Convert standardMH to string for consistency
                standardMH: String(row.standardMH || ''),
                // Ensure UI-only fields are properly set
                isExpanded: row.isExpanded !== undefined ? row.isExpanded : (row.ifChecked || false),
                hasChildren: row.hasChildren !== undefined ? row.hasChildren : (row.ifChecked || false),
                // Ensure children structure exists with new array format
                children: row.children ? {
                    trueChildren: row.children.trueChildren || (row.children.trueChild ? [row.children.trueChild] : []),
                    falseChildren: row.children.falseChildren || (row.children.falseChild ? [row.children.falseChild] : [])
                } : { trueChildren: [], falseChildren: [] },
                // Add branchIndex if not present
                branchIndex: row.branchIndex !== undefined ? row.branchIndex : null
            }));
        }
        // FIXED: Return empty array instead of creating default rows to prevent infinite loop
        return [];
    };

    const [rows, setRows] = useState(initializeRows);  // Use function reference, not function call
    
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
                // Extract numeric part from ID (handle both numeric and string IDs)
                const numericId = typeof row.id === 'number' ? row.id : 
                                 typeof row.id === 'string' ? parseInt(row.id.replace(/\D/g, '')) || 0 : 0;
                maxId = Math.max(maxId, numericId);
                
                // Check children recursively
                if (row.children?.trueChildren) findMaxId(row.children.trueChildren);
                if (row.children?.falseChildren) findMaxId(row.children.falseChildren);
            });
        };
        
        findMaxId(rows);
        setIdCounter(maxId + 1); // Start from next available ID
    };

    useEffect(() => {
        if (initialRows.length > 0) {
            // Initialize ID counter based on existing data
            initializeIdCounter(initialRows);
            
            // Inline the initialization logic to avoid dependency issues
            const initializedRows = initialRows.map(row => ({
                ...row,
                // Ensure UI-only fields are properly set
                isExpanded: row.isExpanded !== undefined ? row.isExpanded : (row.ifChecked || false),
                hasChildren: row.hasChildren !== undefined ? row.hasChildren : (row.ifChecked || false),
                // Ensure children structure exists with new array format
                children: row.children ? {
                    trueChildren: row.children.trueChildren || (row.children.trueChild ? [row.children.trueChild] : []),
                    falseChildren: row.children.falseChildren || (row.children.falseChild ? [row.children.falseChild] : [])
                } : { trueChildren: [], falseChildren: [] },
                // Add branchIndex if not present
                branchIndex: row.branchIndex !== undefined ? row.branchIndex : null
            }));
            setRows(initializedRows);
        }
    }, [initialRows]);

    // Validation functions - Updated for new structure
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
        
        // Enhanced: Check condition type instead of ifChecked
        if (row.conditionType === 'None') {
            if (!row.uom || row.uom.trim() === '') {
                errors[`${rowPath}.uom`] = 'UOM is required';
            }
            if (!row.operation || row.operation.trim() === '') {
                errors[`${rowPath}.operation`] = 'Operation is required';
            }
            if (row.standardMH === null || row.standardMH === undefined || row.standardMH === '') {
                errors[`${rowPath}.standardMH`] = 'Standard MH/UOM is required';
            } else {
                // Enhanced validation based on operation type
                const operation = row.operation;
                if (operation === 'Number') {
                    // Validate mathematical characters
                    const mathRegex = /^[0-9+\-*/.()]+$/;
                    if (!mathRegex.test(row.standardMH)) {
                        errors[`${rowPath}.standardMH`] = 'Standard MH/UOM must contain only numbers and math operators (+, -, *, /, ., (, ))';
                    }
                } else if (operation === 'String') {
                    // Validate string characters (A-Z, a-z, _, -, single space)
                    const stringRegex = /^[A-Za-z_\- ]+$/;
                    const hasMultipleSpaces = /\s{2,}/.test(row.standardMH);
                    if (!stringRegex.test(row.standardMH)) {
                        errors[`${rowPath}.standardMH`] = 'Standard MH/UOM must contain only letters, underscore, dash, and single spaces';
                    } else if (hasMultipleSpaces) {
                        errors[`${rowPath}.standardMH`] = 'Standard MH/UOM cannot contain multiple consecutive spaces';
                    }
                } else {
                    // For +, -, *, / operations - validate mathematical characters
                    const mathRegex = /^[0-9+\-*/.()]+$/;
                    if (!mathRegex.test(row.standardMH)) {
                        errors[`${rowPath}.standardMH`] = 'Standard MH/UOM must contain only numbers and math operators (+, -, *, /, ., (, ))';
                    }
                }
            }
        } else {
            // If condition type is IF or IF-ELSE, validate conditional fields
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
            
            // Enhanced: Validate child rows based on condition type
            if (row.conditionType === 'IF' || row.conditionType === 'IF-ELSE') {
                // Always validate TRUE branch for both IF and IF-ELSE
                if (row.children.trueChildren && row.children.trueChildren.length > 0) {
                    row.children.trueChildren.forEach((child, index) => {
                        validateRow(child, errors, `${rowPath}.true.${index}`);
                    });
                }
                
                // Only validate FALSE branch for IF-ELSE condition type
                if (row.conditionType === 'IF-ELSE' && row.children.falseChildren && row.children.falseChildren.length > 0) {
                    row.children.falseChildren.forEach((child, index) => {
                        validateRow(child, errors, `${rowPath}.false.${index}`);
                    });
                }
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

    // Helper function to build the complete validation path for any row (handles unlimited nesting)
    const buildValidationPath = (row, allRows) => {
        if (!row.parentId || row.isTrueBranch === null) {
            // This is a main row
            return row.id;
        }
        
        // This is a child row - need to find the parent and build the full path
        const parent = findRowRecursively(allRows, row.parentId);
        if (!parent) {
            return row.id; // Fallback if parent not found
        }
        
        const parentPath = buildValidationPath(parent, allRows);
        const branchType = row.isTrueBranch ? 'true' : 'false';
        const branchIndex = row.branchIndex !== null ? row.branchIndex : 0;
        return `${parentPath}.${branchType}.${branchIndex}`;
    };

    // Helper function to find a row by ID in the nested structure - Updated for arrays
    const findRowRecursively = (rowsList, targetId) => {
        for (let row of rowsList) {
            if (row.id === targetId) {
                return row;
            }
            
            // Check children recursively in arrays
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

    // Helper function to check if a specific field has validation error
    const getFieldError = (row, fieldName) => {
        const path = buildValidationPath(row, rows);
        const errorKey = `${path}.${fieldName}`;
        return validationErrors[errorKey];
    };

    // Helper function to check if field has error (returns boolean)
    const hasFieldError = (row, fieldName) => {
        return !!getFieldError(row, fieldName);
    };

    // Create new row structure - Updated for new format
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
        conditionType: 'None', // Enhanced: Use dropdown instead of checkbox
        ifChecked: false, // Keep for backward compatibility
        isExpanded: false,
        hasChildren: false,
        
        // Conditional fields
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

    // Update row data - Updated for array structure with deep copy and debugging
    const updateRow = (rowId, field, value) => {
        setRows(prevRows => {
            // Deep copy the entire rows structure to avoid reference issues
            const newRows = JSON.parse(JSON.stringify(prevRows));
            
            // Debug: Log the update operation
            console.log(`🔧 Updating row ${rowId}, field: ${field}, value:`, value);
            
            // Verify object uniqueness before update
            const verifyUniqueness = (rows) => {
                const findRowById = (rowsList, targetId) => {
                    for (let row of rowsList) {
                        if (row.id === targetId) return row;
                        const trueFound = findRowById(row.children.trueChildren || [], targetId);
                        if (trueFound) return trueFound;
                        const falseFound = findRowById(row.children.falseChildren || [], targetId);
                        if (falseFound) return falseFound;
                    }
                    return null;
                };
                
                const targetRow = findRowById(rows, rowId);
                if (targetRow && targetRow.parentId) {
                    const parent = findRowById(rows, targetRow.parentId);
                    if (parent) {
                        const trueChildren = parent.children.trueChildren || [];
                        const falseChildren = parent.children.falseChildren || [];
                        
                        console.log(`🔍 Debug - Target row ${rowId} references:`, {
                            targetRow: targetRow,
                            parentId: targetRow.parentId,
                            isTrueBranch: targetRow.isTrueBranch,
                            trueChildrenCount: trueChildren.length,
                            falseChildrenCount: falseChildren.length
                        });
                        
                        // Check if TRUE and FALSE children share references
                        trueChildren.forEach((trueChild, trueIndex) => {
                            falseChildren.forEach((falseChild, falseIndex) => {
                                if (trueChild === falseChild) {
                                    console.error(`🚨 REFERENCE ISSUE: TRUE child ${trueIndex} and FALSE child ${falseIndex} share the same reference!`);
                                }
                            });
                        });
                    }
                }
            };
            
            verifyUniqueness(newRows);
            
            updateRowRecursive(newRows, rowId, field, value);
            if (onDataChange) onDataChange(newRows);
            return newRows;
        });
    };

    const updateRowRecursive = (rowsList, rowId, field, value) => {
        for (let row of rowsList) {
            if (row.id === rowId) {
                // CRITICAL DEBUG: Log the exact update operation
                console.log(`🎯 UPDATING ROW ${rowId}:`);
                console.log(`   Field: ${field}`);
                console.log(`   Old Value: ${row[field]}`);
                console.log(`   New Value: ${value}`);
                console.log(`   Row Branch: ${row.isTrueBranch ? 'TRUE' : 'FALSE'}`);
                console.log(`   Row Object Reference:`, row);
                
                // Make the field update
                row[field] = value;
                
                // Handle dependent field updates
                if (field === 'paramId') {
                    const selectedParam = finalParamOptions.find(opt => opt.value === value);
                    if (selectedParam) {
                        row.paramDesc = selectedParam.description || '';
                        console.log(`   ↳ Updated paramDesc: ${row.paramDesc}`);
                    }
                }
                
                // CRITICAL CHECK: Verify if this same row object exists elsewhere
                const verifyRowUniqueness = () => {
                    let foundCount = 0;
                    const checkRecursive = (checkRows, path = 'root') => {
                        checkRows.forEach((checkRow, index) => {
                            if (checkRow === row) { // Same object reference check
                                foundCount++;
                                console.log(`🚨 DUPLICATE REFERENCE FOUND: ${path}[${index}] -> Row ${rowId}`);
                            }
                            if (checkRow.children?.trueChildren) {
                                checkRecursive(checkRow.children.trueChildren, `${path}.children.trueChildren`);
                            }
                            if (checkRow.children?.falseChildren) {
                                checkRecursive(checkRow.children.falseChildren, `${path}.children.falseChildren`);
                            }
                        });
                    };
                    
                    // Check from the top level
                    checkRecursive(rowsList, 'currentLevel');
                    
                    if (foundCount > 1) {
                        console.error(`🚨 CRITICAL: Row ${rowId} found ${foundCount} times with same object reference!`);
                    } else {
                        console.log(`✅ Row ${rowId} has unique object reference`);
                    }
                };
                
                verifyRowUniqueness();
                return true;
            }
            
            if (row.children.trueChildren && updateRowRecursive(row.children.trueChildren, rowId, field, value)) {
                return true;
            }
            if (row.children.falseChildren && updateRowRecursive(row.children.falseChildren, rowId, field, value)) {
                return true;
            }
        }
        return false;
    };

    // Handle Condition Type change - Updated for dropdown structure with deep copy
    const handleConditionTypeChange = (rowId, conditionType) => {
        setRows(prevRows => {
            // Deep copy to avoid reference issues between TRUE and FALSE branches
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
                const hasCondition = conditionType === 'IF' || conditionType === 'IF-ELSE';
                
                // Update legacy ifChecked for compatibility
                row.ifChecked = hasCondition;
                row.hasChildren = hasCondition;
                
                if (hasCondition && row.children.trueChildren.length === 0 && row.children.falseChildren.length === 0) {
                    // CRITICAL FIX: Use synchronous ID generation to prevent duplicate IDs
                    console.log(`🔧 Creating children for parent ${rowId}, condition type: ${conditionType}`);
                    
                    if (conditionType === 'IF-ELSE') {
                        // Generate both IDs at once to ensure they're unique
                        const [trueChildId, falseChildId] = generateMultipleIds(2);
                        
                        const trueChild = createNewRow(trueChildId, rowId, true, 0);
                        const falseChild = createNewRow(falseChildId, rowId, false, 0);
                        
                        row.children.trueChildren = [trueChild];
                        row.children.falseChildren = [falseChild];
                        
                        console.log(`✅ Created TRUE child ID: ${trueChildId}, FALSE child ID: ${falseChildId}`);
                        
                        // Verify they are different
                        if (trueChild === falseChild) {
                            console.error(`🚨 CRITICAL: TRUE and FALSE children share the same reference!`);
                        } else if (trueChild.id === falseChild.id) {
                            console.error(`🚨 CRITICAL: TRUE and FALSE children have the same ID! TRUE: ${trueChild.id}, FALSE: ${falseChild.id}`);
                        } else {
                            console.log(`✅ VERIFIED: TRUE child ${trueChild.id} and FALSE child ${falseChild.id} have unique IDs`);
                        }
                    } else if (conditionType === 'IF') {
                        // Only TRUE child for IF condition
                        const trueChildId = generateNextId();
                        const trueChild = createNewRow(trueChildId, rowId, true, 0);
                        row.children.trueChildren = [trueChild];
                        row.children.falseChildren = [];
                        
                        console.log(`✅ Created TRUE child ID: ${trueChildId} for IF condition`);
                    }
                    
                    row.isExpanded = true;
                } else if (hasCondition) {
                    // Handle switching between IF and IF-ELSE with guaranteed unique IDs
                    console.log(`🔄 Switching condition type to: ${conditionType} for parent ${rowId}`);
                    
                    if (conditionType === 'IF') {
                        // Clear FALSE children when switching to IF-only
                        row.children.falseChildren = [];
                        // Ensure TRUE children exist
                        if (row.children.trueChildren.length === 0) {
                            const trueChildId = generateNextId();
                            const trueChild = createNewRow(trueChildId, rowId, true, 0);
                            row.children.trueChildren = [trueChild];
                            console.log(`✅ Added TRUE child ID: ${trueChildId} for IF condition`);
                        }
                    } else if (conditionType === 'IF-ELSE') {
                        // Determine how many new children we need
                        const needsTrue = row.children.trueChildren.length === 0;
                        const needsFalse = row.children.falseChildren.length === 0;
                        const childrenNeeded = (needsTrue ? 1 : 0) + (needsFalse ? 1 : 0);
                        
                        if (childrenNeeded > 0) {
                            // Generate unique IDs for all needed children
                            const newIds = generateMultipleIds(childrenNeeded);
                            let idIndex = 0;
                            
                            if (needsTrue) {
                                const trueChild = createNewRow(newIds[idIndex++], rowId, true, 0);
                                row.children.trueChildren = [trueChild];
                                console.log(`✅ Added TRUE child ID: ${trueChild.id} for IF-ELSE switch`);
                            }
                            
                            if (needsFalse) {
                                const falseChild = createNewRow(newIds[idIndex++], rowId, false, 0);
                                row.children.falseChildren = [falseChild];
                                console.log(`✅ Added FALSE child ID: ${falseChild.id} for IF-ELSE switch`);
                            }
                            
                            // Final verification
                            const allTrueIds = row.children.trueChildren.map(child => child.id);
                            const allFalseIds = row.children.falseChildren.map(child => child.id);
                            const duplicateIds = allTrueIds.filter(id => allFalseIds.includes(id));
                            
                            if (duplicateIds.length > 0) {
                                console.error(`🚨 DUPLICATE IDs FOUND: ${duplicateIds.join(', ')}`);
                            } else {
                                console.log(`✅ VERIFIED: All child IDs are unique. TRUE: [${allTrueIds.join(', ')}], FALSE: [${allFalseIds.join(', ')}]`);
                            }
                        }
                    }
                } else if (!hasCondition) {
                    // Remove all children
                    row.children.trueChildren = [];
                    row.children.falseChildren = [];
                    row.isExpanded = false;
                }
                return true;
            }
            
            if (row.children.trueChildren && updateConditionTypeRecursive(row.children.trueChildren, rowId, conditionType)) {
                return true;
            }
            if (row.children.falseChildren && updateConditionTypeRecursive(row.children.falseChildren, rowId, conditionType)) {
                return true;
            }
        }
        return false;
    };

    // Toggle expand/collapse - Updated for array structure with deep copy
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

    // NEW FEATURE: Add multiple rows under TRUE/FALSE branches with deep copy
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
                const newRowId = generateNextId(); // Use sequential ID for simplicity
                
                const newChildRow = createNewRow(newRowId, parentRowId, isTrueBranch, newIndex);
                targetArray.push(newChildRow);
                
                row.hasChildren = true;
                row.isExpanded = true; // Auto-expand when adding children
                return true;
            }
            
            if (row.children.trueChildren && addChildRowRecursive(row.children.trueChildren, parentRowId, isTrueBranch)) {
                return true;
            }
            if (row.children.falseChildren && addChildRowRecursive(row.children.falseChildren, parentRowId, isTrueBranch)) {
                return true;
            }
        }
        return false;
    };

    // NEW FEATURE: Remove child row from TRUE/FALSE branches with deep copy
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
                    
                    // Re-index remaining children (keep their IDs but update branchIndex)
                    targetArray.forEach((child, index) => {
                        child.branchIndex = index;
                        // Don't change the ID - keep the sequential ID system
                    });
                    
                    // Update hasChildren status
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

    // Generate formula preview - Updated for multiple children
    const generateFormula = (row) => {
        if (row.conditionType === 'None') {
            const paramDisplay = row.paramId ? `[${row.paramId}]` : '[PARAM]';
            // Convert to string and handle both string and number types
            const standardMH = String(row.standardMH || '');
            const operation = row.operation || '*';
            
            // Special handling for Number and String operations
            if (operation === 'Number' || operation === 'String') {
                // For Number and String operations, show only Standard MH/UOM value
                if (!standardMH || standardMH.trim() === '') {
                    return operation === 'Number' ? '0' : 'EMPTY_STRING';
                }
                return standardMH;
            } else {
                // For math operations (+, -, *, /), show full format
                if (!standardMH || standardMH.trim() === '' || standardMH === '0') {
                    return paramDisplay;
                }
                return `${paramDisplay} ${operation} ${standardMH}`;
            }
        } else {
            // Helper function to format values based on type
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
            
            // Handle multiple children in TRUE and FALSE branches
            const generateChildrenFormula = (children) => {
                if (children.length === 0) return 'NO_FORMULA';
                if (children.length === 1) return generateFormula(children[0]);
                
                // Multiple children - combine with + operation
                return `(${children.map(child => generateFormula(child)).join(' + ')})`;
            };
            
            const trueFormula = generateChildrenFormula(row.children.trueChildren);
            
            // Enhanced: Generate different formulas based on condition type
            if (row.conditionType === 'IF') {
                // IF only - no FALSE part
                return `IF(${leftVal} ${condition} ${rightVal}, ${trueFormula})`;
            } else if (row.conditionType === 'IF-ELSE') {
                // IF-ELSE - both TRUE and FALSE parts
                const falseFormula = generateChildrenFormula(row.children.falseChildren);
                return `IF(${leftVal} ${condition} ${rightVal}, ${trueFormula}, ${falseFormula})`;
            }
        }
    };

    // Render value field based on type (unchanged from original)
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

    // Add new row to the grid - Updated with sequential ID and safe initialization
    const addNewRow = () => {
        setRows(prevRows => {
            const newRow = createDefaultRow(); // Use the safe default row creation
            const updatedRows = [...prevRows, newRow];
            if (onDataChange) onDataChange(updatedRows);
            return updatedRows;
        });
    };

    // Delete row from the grid - Updated for array structure with deep copy
    const deleteRow = (rowId) => {
        setRows(prevRows => {
            const deepCopiedRows = JSON.parse(JSON.stringify(prevRows));
            const updatedRows = removeRowRecursive(deepCopiedRows, rowId);
            if (onDataChange) onDataChange(updatedRows);
            return updatedRows;
        });
    };

    // Recursive function to remove a row from the tree structure - Updated for arrays
    const removeRowRecursive = (rowsList, rowId) => {
        // Filter out the row with matching ID from the current level
        const filteredRows = rowsList.filter(row => row.id !== rowId);
        
        // For remaining rows, check and clean their children
        return filteredRows.map(row => {
            const updatedRow = { ...row };
            
            // Check and update true children
            if (updatedRow.children.trueChildren && updatedRow.children.trueChildren.length > 0) {
                updatedRow.children.trueChildren = removeRowRecursive(updatedRow.children.trueChildren, rowId);
            }
            
            // Check and update false children
            if (updatedRow.children.falseChildren && updatedRow.children.falseChildren.length > 0) {
                updatedRow.children.falseChildren = removeRowRecursive(updatedRow.children.falseChildren, rowId);
            }
            
            // Update hasChildren status
            updatedRow.hasChildren = updatedRow.children.trueChildren.length > 0 || updatedRow.children.falseChildren.length > 0;
            
            return updatedRow;
        });
    };

    // Generate complete formula for all rows (unchanged)
    const generateCompleteFormula = () => {
        if (rows.length === 0) return '';
        if (rows.length === 1) return generateFormula(rows[0]);
        
        // For multiple rows, join them with + operation
        return rows.map(row => `(${generateFormula(row)})`).join(' + ');
    };

    // Save data to console with validation (unchanged)
    const saveData = () => {
        // Clear previous validation errors
        setValidationErrors({});
        setShowValidationAlert(false);
        
        // Validate all rows
        const errors = validateAllRows();
        
        if (hasValidationErrors(errors)) {
            // Show validation errors
            setValidationErrors(errors);
            
            const errorCount = Object.keys(errors).length;
            const errorMessages = Object.values(errors).slice(0, 3); // Show first 3 errors
            
            let message = `Found ${errorCount} validation error${errorCount > 1 ? 's' : ''}:\n`;
            message += errorMessages.join('\n');
            
            if (errorCount > 3) {
                message += `\n... and ${errorCount - 3} more error${errorCount - 3 > 1 ? 's' : ''}`;
            }
            
            setValidationMessage(message);
            setShowValidationAlert(true);
            
            // Also show in alert for immediate feedback
            alert(`Validation Failed!\n\n${message}\n\nPlease fix the errors and try again.`);
            return;
        }
        
        // If validation passes, save the data
        console.log('=== IFAndLookup Data Export ===');
        console.log('Validation Status: PASSED ✅');
        console.log('Complete Formula:', generateCompleteFormula());
        console.log('Rows Data (Component Format):', JSON.stringify(rows, null, 2));
        console.log('Total Rows:', rows.length);
        
        // NEW: Transform to database format and log
        console.log('📊 === DATABASE FORMAT TRANSFORMATION ===');
        try {
            // Transform component data to database format
            const dbData = prepareEnhancedDataForDatabase(rows);
            console.log('💾 Rows Data for DB (Flat Structure):', JSON.stringify(dbData, null, 2));
            console.log('📋 Database Rows Count:', dbData.length);
            console.log('🔗 Parent-Child Relationships Analysis:');
            
            // Analyze parent-child relationships
            const relationships = {};
            dbData.forEach(row => {
                if (row.parentId) {
                    const key = `Parent_${row.parentId}`;
                    if (!relationships[key]) {
                        relationships[key] = { true: [], false: [] };
                    }
                    relationships[key][row.isTrueBranch ? 'true' : 'false'].push({
                        id: row.id,
                        paramId: row.paramId,
                        branchIndex: row.branchIndex
                    });
                } else {
                    relationships[`Root_${row.id}`] = { paramId: row.paramId, ifChecked: row.ifChecked };
                }
            });
            
            console.log('🌳 Relationship Analysis:', JSON.stringify(relationships, null, 2));
            
            // Create summary for easy DB insertion
            console.log('📝 === DATABASE INSERTION SUMMARY ===');
            console.log(`📊 Total Rows to Insert: ${dbData.length}`);
            console.log(`🌱 Root Rows: ${dbData.filter(r => !r.parentId).length}`);
            console.log(`👶 Child Rows: ${dbData.filter(r => r.parentId).length}`);
            console.log(`✅ TRUE Branch Children: ${dbData.filter(r => r.isTrueBranch === true).length}`);
            console.log(`❌ FALSE Branch Children: ${dbData.filter(r => r.isTrueBranch === false).length}`);
            
            // Show SQL-ready format with enhanced parent-child visualization
            console.log('🗄️ === SQL INSERT READY FORMAT ===');
            
            // Group by parent-child relationships for cleaner display
            const parentRows = dbData.filter(r => !r.parentId);
            const childRows = dbData.filter(r => r.parentId);
            
            console.log('📋 ROOT ROWS (Parents):');
            parentRows.forEach((row, index) => {
                console.log(`  ${index + 1}. ID: ${row.id} | ParamID: [${row.paramId}] | Operation: ${row.operation} | Standard MH: ${row.standardMH}`);
                
                // Find children for this parent
                const trueChildren = childRows.filter(c => c.parentId === row.id && c.isTrueBranch === true);
                const falseChildren = childRows.filter(c => c.parentId === row.id && c.isTrueBranch === false);
                
                if (trueChildren.length > 0) {
                    console.log(`    ✅ TRUE Branch (${trueChildren.length} children):`);
                    trueChildren.forEach((child, idx) => {
                        console.log(`      ${idx + 1}. ID: ${child.id} | ParamID: [${child.paramId}] | Operation: ${child.operation} | Standard MH: ${child.standardMH}`);
                    });
                }
                
                if (falseChildren.length > 0) {
                    console.log(`    ❌ FALSE Branch (${falseChildren.length} children):`);
                    falseChildren.forEach((child, idx) => {
                        console.log(`      ${idx + 1}. ID: ${child.id} | ParamID: [${child.paramId}] | Operation: ${child.operation} | Standard MH: ${child.standardMH}`);
                    });
                }
                
                if (trueChildren.length === 0 && falseChildren.length === 0) {
                    console.log('    📄 No children (simple row)');
                }
                console.log(''); // Empty line for readability
            });
            
            console.log('📊 DETAILED SQL INSERT DATA:');
            dbData.forEach((row, index) => {
                const rowType = row.parentId ? `Child of ${row.parentId} (${row.isTrueBranch ? 'TRUE' : 'FALSE'})` : 'Root Row';
                console.log(`Row ${index + 1} [${rowType}]:`, {
                    id: row.id,
                    parentId: row.parentId,
                    isTrueBranch: row.isTrueBranch,
                    branchIndex: row.branchIndex,
                    paramId: row.paramId,
                    operation: row.operation,
                    standardMH: row.standardMH,
                    // Only show IF condition fields if they exist
                    ...(row.leftType && { leftType: row.leftType, leftValue: row.leftValue }),
                    ...(row.condition && { condition: row.condition }),
                    ...(row.rightType && { rightType: row.rightType, rightValue: row.rightValue })
                });
            });
            
            console.log('✅ Database transformation completed successfully!');
            
        } catch (error) {
            console.error('❌ Error transforming to database format:', error);
            console.log('📝 Raw component data is still available above');
        }
        
        console.log('Timestamp:', new Date().toISOString());
        console.log('=====================================');
        
        // Show success message
        alert('✅ Validation Passed!\n\nData saved to console successfully!\nCheck browser console for both Component and Database formats.');
    };

    // NEW FEATURE: Render children section with add/remove buttons
    const renderChildrenSection = (row, isTrueBranch) => {
        const children = isTrueBranch ? row.children.trueChildren : row.children.falseChildren;
        const branchName = isTrueBranch ? 'TRUE' : 'FALSE';
        const branchColor = isTrueBranch ? '#4caf50' : '#f44336';
        
        return (
            <div style={{ marginLeft: '40px', marginTop: '10px' }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '10px',
                    padding: '8px',
                    backgroundColor: isTrueBranch ? '#e8f5e8' : '#ffebee',
                    borderLeft: `4px solid ${branchColor}`,
                    borderRadius: '4px'
                }}>
                    <Typography variant="subtitle2" style={{ color: branchColor, fontWeight: 'bold', marginRight: '10px' }}>
                        {branchName} Branch ({children.length} row{children.length !== 1 ? 's' : ''})
                    </Typography>
                    <Tooltip title={`Add new row to ${branchName} branch`}>
                        <IconButton
                            size="small"
                            onClick={() => addChildRow(row.id, isTrueBranch)}
                            style={{ color: branchColor }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                
                {children.map((child, index) => (
                    <div key={child.id} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                            <Typography variant="caption" style={{ marginRight: '10px', minWidth: '60px' }}>
                                Row {index + 1}:
                            </Typography>
                            {children.length > 1 && (
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
                        {renderRow(child, true, index)}
                    </div>
                ))}
                
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

    // Enhanced row rendering with multiple children support
    const renderRow = (row, isChild = false, childIndex = null) => (
        <div key={row.id} className={isChild ? 'custom-child-row' : 'row'}>
            <div className='custom-row border-bottom'>
                
                {/* Show/Hide Toggle - Only if has children */}
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

                {/* UOM - Searchable, Disabled when IF checked */}
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
                        disabled={row.conditionType !== 'None'}
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

                {/* Operation - Searchable, Disabled when IF checked */}
                <div className='col-block'>
                    <Autocomplete
                        value={operationOptions.find(op => op === row.operation) || null}
                        onChange={(event, newValue) => {
                            updateRow(row.id, 'operation', newValue || '');
                        }}
                        options={operationOptions}
                        getOptionLabel={(option) => option}
                        size="small"
                        disabled={row.conditionType !== 'None'}
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

                {/* Standard MH/UOM - Dynamic validation based on operation */}
                <div className='col-block'>
                    <TextField
                        label="Standard MH/UOM"
                        type="text"
                        value={String(row.standardMH || '')}
                        onChange={(e) => {
                            const value = e.target.value;
                            const operation = row.operation;
                            
                            // Different validation based on operation type
                            if (operation === 'Number') {
                                // Only allow numbers, +, -, *, /, ., (, )
                                const mathRegex = /^[0-9+\-*/.()]*$/;
                                if (mathRegex.test(value)) {
                                    updateRow(row.id, 'standardMH', value);
                                }
                            } else if (operation === 'String') {
                                // Allow A-Z, a-z, _, -, and single space
                                const stringRegex = /^[A-Za-z_\- ]*$/;
                                // Check for single space (no multiple consecutive spaces)
                                const hasMultipleSpaces = /\s{2,}/.test(value);
                                if (stringRegex.test(value) && !hasMultipleSpaces) {
                                    updateRow(row.id, 'standardMH', value);
                                }
                            } else {
                                // For +, -, *, / operations - math validation
                                const mathRegex = /^[0-9+\-*/.()]*$/;
                                if (mathRegex.test(value)) {
                                    updateRow(row.id, 'standardMH', value);
                                }
                            }
                        }}
                        variant="outlined"
                        size="small"
                        disabled={row.conditionType !== 'None'}
                        error={hasFieldError(row, 'standardMH')}
                        placeholder={
                            row.operation === 'Number' ? "e.g. 10, (2+3)*4, 15.5" :
                            row.operation === 'String' ? "e.g. Product_Name, Test-Case" :
                            "e.g. 10, (2+3)*4, 15.5"
                        }
                    />
                </div>

                {/* CONDITION TYPE DROPDOWN - Replaces IF Checkbox */}
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
                        </Select>
                    </FormControl>
                </div>

                {/* Conditional Fields - Only show when conditionType is IF or IF-ELSE */}
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
                <div className='col-block formula-preview'>
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

                {/* Delete Button - Only show for main rows, not for TRUE/FALSE child rows */}
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

            {/* Enhanced: Child Rendering Based on Condition Type */}
            {row.hasChildren && row.isExpanded && (row.conditionType === 'IF' || row.conditionType === 'IF-ELSE') && (
                <div className='custom-child-container' style={{ marginLeft: '20px', marginTop: '10px' }}>
                    <Divider style={{ margin: '10px 0' }} />
                    
                    {/* TRUE Branch Section - Show for both IF and IF-ELSE */}
                    {renderChildrenSection(row, true)}
                    
                    {/* FALSE Branch Section - Show only for IF-ELSE */}
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
                        🚀 FeaturesV1 - Enhanced IF Builder
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
                        ✨ <strong>Enhanced Features:</strong> Choose condition type from dropdown (None/IF/IF-ELSE)! 
                        Click the <AddIcon style={{ fontSize: '16px', verticalAlign: 'middle' }} /> button in each branch section to add more rows.
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
                    rows.map(row => renderRow(row))
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

export default FeaturesV1;