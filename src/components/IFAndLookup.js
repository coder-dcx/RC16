import React, { useState, useEffect } from 'react';
import { 
    Checkbox, 
    FormControl, 
    FormControlLabel, 
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
import { Alert } from '@material-ui/lab';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
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

function IFAndLookup({ 
    initialRows = [], 
    paramIdOptions = [], 
    uomOptions = [], 
    onDataChange 
}) {
    // Create default initial rows if none provided
    const createDefaultRows = () => [
        {
            id: `row_${Date.now()}`, // Use timestamp for unique ID
            parentId: null,
            isTrueBranch: null,
            branchIndex: null, // New field for multiple rows under same branch
            paramId: '',
            paramDesc: '',
            moduleDesc: '',
            uom: 'EA',
            operation: '*',
            standardMH: 0,
            ifChecked: false,
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
        }
    ];

    // Initialize rows with proper handling of database data
    const initializeRows = () => {
        if (initialRows.length > 0) {
            // Ensure all rows have required UI fields and new structure
            return initialRows.map(row => ({
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
        }
        return createDefaultRows();
    };

    const [rows, setRows] = useState(initializeRows());
    
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

    const operationOptions = ['+', '-', '*', '/'];
    const conditionOptions = ['==', '>', '<', '<>'];
    const typeOptions = ['PARAM ID', 'NUMBER', 'TEXT'];

    const finalParamOptions = paramIdOptions.length > 0 ? paramIdOptions : defaultParamOptions;
    const finalUomOptions = uomOptions.length > 0 ? uomOptions : defaultUomOptions;

    useEffect(() => {
        if (initialRows.length > 0) {
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
        
        // Validate Module Description
        if (!row.moduleDesc || row.moduleDesc.trim() === '') {
            errors[`${rowPath}.moduleDesc`] = 'Module Description is required';
        }
        
        // If IF is not checked, validate standard fields
        if (!row.ifChecked) {
            if (!row.uom || row.uom.trim() === '') {
                errors[`${rowPath}.uom`] = 'UOM is required';
            }
            if (!row.operation || row.operation.trim() === '') {
                errors[`${rowPath}.operation`] = 'Operation is required';
            }
            if (row.standardMH === null || row.standardMH === undefined || row.standardMH < 0) {
                errors[`${rowPath}.standardMH`] = 'Standard MH/UOM must be a positive number';
            }
        } else {
            // If IF is checked, validate conditional fields
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
            
            // Validate child rows recursively - Updated for arrays
            if (row.children.trueChildren && row.children.trueChildren.length > 0) {
                row.children.trueChildren.forEach((child, index) => {
                    validateRow(child, errors, `${rowPath}.true.${index}`);
                });
            }
            if (row.children.falseChildren && row.children.falseChildren.length > 0) {
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
        standardMH: 0,
        ifChecked: false,
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

    // Update row data - Updated for array structure
    const updateRow = (rowId, field, value) => {
        setRows(prevRows => {
            const newRows = [...prevRows];
            updateRowRecursive(newRows, rowId, field, value);
            if (onDataChange) onDataChange(newRows);
            return newRows;
        });
    };

    const updateRowRecursive = (rowsList, rowId, field, value) => {
        for (let row of rowsList) {
            if (row.id === rowId) {
                row[field] = value;
                
                // Handle dependent field updates
                if (field === 'paramId') {
                    const selectedParam = finalParamOptions.find(opt => opt.value === value);
                    if (selectedParam) {
                        row.paramDesc = selectedParam.description || '';
                    }
                }
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

    // Handle IF checkbox toggle - Updated for array structure
    const handleIfToggle = (rowId, checked) => {
        setRows(prevRows => {
            const newRows = [...prevRows];
            toggleIfRecursive(newRows, rowId, checked);
            if (onDataChange) onDataChange(newRows);
            return newRows;
        });
    };

    const toggleIfRecursive = (rowsList, rowId, checked) => {
        for (let row of rowsList) {
            if (row.id === rowId) {
                row.ifChecked = checked;
                row.hasChildren = checked;
                
                if (checked && row.children.trueChildren.length === 0 && row.children.falseChildren.length === 0) {
                    // Create initial true and false child rows
                    const trueChild = createNewRow(`${rowId}_true_0`, rowId, true, 0);
                    const falseChild = createNewRow(`${rowId}_false_0`, rowId, false, 0);
                    
                    row.children.trueChildren = [trueChild];
                    row.children.falseChildren = [falseChild];
                    row.isExpanded = true;
                } else if (!checked) {
                    // Remove all children
                    row.children.trueChildren = [];
                    row.children.falseChildren = [];
                    row.isExpanded = false;
                }
                return true;
            }
            
            if (row.children.trueChildren && toggleIfRecursive(row.children.trueChildren, rowId, checked)) {
                return true;
            }
            if (row.children.falseChildren && toggleIfRecursive(row.children.falseChildren, rowId, checked)) {
                return true;
            }
        }
        return false;
    };

    // Toggle expand/collapse - Updated for array structure
    const toggleExpand = (rowId) => {
        setRows(prevRows => {
            const newRows = [...prevRows];
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

    // NEW FEATURE: Add multiple rows under TRUE/FALSE branches
    const addChildRow = (parentRowId, isTrueBranch) => {
        setRows(prevRows => {
            const newRows = [...prevRows];
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
                const newRowId = `${parentRowId}_${isTrueBranch ? 'true' : 'false'}_${newIndex}`;
                
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

    // NEW FEATURE: Remove child row from TRUE/FALSE branches
    const removeChildRow = (parentRowId, isTrueBranch, childIndex) => {
        setRows(prevRows => {
            const newRows = [...prevRows];
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
                    
                    // Re-index remaining children
                    targetArray.forEach((child, index) => {
                        child.branchIndex = index;
                        child.id = `${parentRowId}_${isTrueBranch ? 'true' : 'false'}_${index}`;
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
        if (!row.ifChecked) {
            const paramDisplay = row.paramId ? `[${row.paramId}]` : '[PARAM]';
            const standardMH = row.standardMH || 0;
            
            // If Standard MH/UOM is empty, null, or 0, show just Param ID
            if (!standardMH || standardMH === 0) {
                return paramDisplay;
            }
            
            // Otherwise show full format: Param ID + Operation + Standard MH/UOM
            const operation = row.operation || '*';
            return `${paramDisplay} ${operation} ${standardMH}`;
        } else {
            const leftVal = row.leftValue || 'LEFT';
            const condition = row.condition || '==';
            const rightVal = row.rightValue || 'RIGHT';
            
            // Handle multiple children in TRUE and FALSE branches
            const generateChildrenFormula = (children) => {
                if (children.length === 0) return 'NO_FORMULA';
                if (children.length === 1) return generateFormula(children[0]);
                
                // Multiple children - combine with + operation
                return `(${children.map(child => generateFormula(child)).join(' + ')})`;
            };
            
            const trueFormula = generateChildrenFormula(row.children.trueChildren);
            const falseFormula = generateChildrenFormula(row.children.falseChildren);
            
            return `IF(${leftVal} ${condition} ${rightVal}, ${trueFormula}, ${falseFormula})`;
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
                    <FormControl 
                        variant="outlined" 
                        size="small"
                        error={hasError}
                    >
                        <Select
                            value={currentValue}
                            onChange={(e) => updateRow(row.id, valueField, e.target.value)}
                            error={hasError}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {finalParamOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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

    // Add new row to the grid (unchanged)
    const addNewRow = () => {
        const newRowId = `row_${Date.now()}`;
        const newRow = createNewRow(newRowId);
        setRows(prevRows => {
            const updatedRows = [...prevRows, newRow];
            if (onDataChange) onDataChange(updatedRows);
            return updatedRows;
        });
    };

    // Delete row from the grid - Updated for array structure
    const deleteRow = (rowId) => {
        setRows(prevRows => {
            const updatedRows = removeRowRecursive(prevRows, rowId);
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
            
            // Show SQL-ready format
            console.log('🗄️ === SQL INSERT READY FORMAT ===');
            dbData.forEach((row, index) => {
                console.log(`Row ${index + 1}:`, {
                    id: row.id,
                    parentId: row.parentId,
                    isTrueBranch: row.isTrueBranch,
                    branchIndex: row.branchIndex,
                    paramId: row.paramId,
                    paramDesc: row.paramDesc,
                    moduleDesc: row.moduleDesc,
                    uom: row.uom,
                    operation: row.operation,
                    standardMH: row.standardMH,
                    ifChecked: row.ifChecked,
                    leftType: row.leftType,
                    leftValue: row.leftValue,
                    condition: row.condition,
                    rightType: row.rightType,
                    rightValue: row.rightValue
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

                {/* Param ID */}
                <div className='col-block'>
                    <FormControl 
                        variant="outlined" 
                        size="small"
                        error={hasFieldError(row, 'paramId')}
                    >
                        <InputLabel error={hasFieldError(row, 'paramId')}>Param ID</InputLabel>
                        <Select
                            value={row.paramId}
                            onChange={(e) => updateRow(row.id, 'paramId', e.target.value)}
                            label="Param ID"
                            error={hasFieldError(row, 'paramId')}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {finalParamOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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

                {/* Module Description */}
                <div className='col-block w200'>
                    <TextField
                        label="Module Description"
                        value={row.moduleDesc}
                        onChange={(e) => updateRow(row.id, 'moduleDesc', e.target.value)}
                        variant="outlined"
                        size="small"
                        error={hasFieldError(row, 'moduleDesc')}
                    />
                </div>

                {/* UOM - Disabled when IF checked */}
                <div className='col-block'>
                    <FormControl 
                        variant="outlined" 
                        size="small"
                        error={hasFieldError(row, 'uom')}
                    >
                        <InputLabel error={hasFieldError(row, 'uom')}>UOM</InputLabel>
                        <Select
                            value={row.uom}
                            onChange={(e) => updateRow(row.id, 'uom', e.target.value)}
                            label="UOM"
                            disabled={row.ifChecked}
                            error={hasFieldError(row, 'uom')}
                        >
                            {finalUomOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {/* Operation - Disabled when IF checked */}
                <div className='col-block'>
                    <FormControl 
                        variant="outlined" 
                        size="small"
                        error={hasFieldError(row, 'operation')}
                    >
                        <InputLabel error={hasFieldError(row, 'operation')}>Operation</InputLabel>
                        <Select
                            value={row.operation}
                            onChange={(e) => updateRow(row.id, 'operation', e.target.value)}
                            label="Operation"
                            disabled={row.ifChecked}
                            error={hasFieldError(row, 'operation')}
                        >
                            {operationOptions.map(op => (
                                <MenuItem key={op} value={op}>{op}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {/* Standard MH/UOM - Disabled when IF checked */}
                <div className='col-block'>
                    <TextField
                        label="Standard MH/UOM"
                        type="number"
                        value={row.standardMH}
                        onChange={(e) => updateRow(row.id, 'standardMH', parseFloat(e.target.value) || 0)}
                        variant="outlined"
                        size="small"
                        disabled={row.ifChecked}
                        error={hasFieldError(row, 'standardMH')}
                    />
                </div>

                {/* IF Checkbox */}
                <div className='col-block w60'>
                    <FormControlLabel
                        control={
                            <Checkbox
                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                checked={row.ifChecked}
                                onChange={(e) => handleIfToggle(row.id, e.target.checked)}
                            />
                        }
                        label="IF"
                    />
                </div>

                {/* Conditional Fields - Only show when IF checked */}
                {row.ifChecked && (
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

            {/* NEW: Enhanced Child Rendering with Multiple Rows Support */}
            {row.hasChildren && row.isExpanded && (
                <div className='custom-child-container' style={{ marginLeft: '20px', marginTop: '10px' }}>
                    <Divider style={{ margin: '10px 0' }} />
                    
                    {/* TRUE Branch Section */}
                    {renderChildrenSection(row, true)}
                    
                    {/* FALSE Branch Section */}
                    {renderChildrenSection(row, false)}
                    
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
                        🚀 IF & Lookup Builder (Enhanced)
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
                        ✨ <strong>New Features:</strong> Add multiple rows under TRUE and FALSE branches! 
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
                {rows.map(row => renderRow(row))}
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

export default IFAndLookup;