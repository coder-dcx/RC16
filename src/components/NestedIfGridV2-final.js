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
    Snackbar
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

import './index.css';

function NestedIfGridV2({ 
    initialRows = [], 
    paramIdOptions = [], 
    uomOptions = [], 
    onDataChange 
}) {
    // Create default initial rows if none provided
    const createDefaultRows = () => [
        {
            id: 'row_1',
            parentId: null,
            isTrueBranch: null,
            paramId: '000001',
            paramDesc: 'Param Testing Description 1',
            moduleDesc: 'Sample Module 1',
            uom: 'EA',
            operation: '*',
            standardMH: 10,
            ifChecked: false,
            isExpanded: false,
            hasChildren: false,
            leftType: 'PARAM ID',
            leftValue: '',
            condition: '==',
            rightType: 'PARAM ID',
            rightValue: '',
            children: {
                trueChild: null,
                falseChild: null
            }
        },
        {
            id: 'row_2',
            parentId: null,
            isTrueBranch: null,
            paramId: '000002',
            paramDesc: 'Param Testing Description 2',
            moduleDesc: 'Sample Module 2',
            uom: 'HRS',
            operation: '+',
            standardMH: 5,
            ifChecked: false,
            isExpanded: false,
            hasChildren: false,
            leftType: 'PARAM ID',
            leftValue: '',
            condition: '==',
            rightType: 'PARAM ID',
            rightValue: '',
            children: {
                trueChild: null,
                falseChild: null
            }
        }
    ];

    const [rows, setRows] = useState(initialRows.length > 0 ? initialRows : createDefaultRows());
    
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
            setRows(initialRows);
        }
    }, [initialRows]);

    // Validation functions
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
            
            // Validate child rows recursively
            if (row.children.trueChild) {
                validateRow(row.children.trueChild, errors, `${rowPath}.true`);
            }
            if (row.children.falseChild) {
                validateRow(row.children.falseChild, errors, `${rowPath}.false`);
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
        return `${parentPath}.${row.isTrueBranch ? 'true' : 'false'}`;
    };

    // Helper function to find a row by ID in the nested structure
    const findRowRecursively = (rowsList, targetId) => {
        for (let row of rowsList) {
            if (row.id === targetId) {
                return row;
            }
            
            // Check children recursively
            if (row.children.trueChild) {
                const found = findRowRecursively([row.children.trueChild], targetId);
                if (found) return found;
            }
            if (row.children.falseChild) {
                const found = findRowRecursively([row.children.falseChild], targetId);
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

    // Create new row structure
    const createNewRow = (id, parentId = null, isTrueBranch = null) => ({
        id,
        parentId,
        isTrueBranch,
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
            trueChild: null,
            falseChild: null
        }
    });

    // Update row data
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
            
            if (row.children.trueChild && updateRowRecursive([row.children.trueChild], rowId, field, value)) {
                return true;
            }
            if (row.children.falseChild && updateRowRecursive([row.children.falseChild], rowId, field, value)) {
                return true;
            }
        }
        return false;
    };

    // Handle IF checkbox toggle
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
                
                if (checked && !row.children.trueChild) {
                    // Create true and false child rows
                    row.children.trueChild = createNewRow(`${rowId}_true`, rowId, true);
                    row.children.falseChild = createNewRow(`${rowId}_false`, rowId, false);
                    row.isExpanded = true;
                } else if (!checked) {
                    // Remove children
                    row.children.trueChild = null;
                    row.children.falseChild = null;
                    row.isExpanded = false;
                }
                return true;
            }
            
            if (row.children.trueChild && toggleIfRecursive([row.children.trueChild], rowId, checked)) {
                return true;
            }
            if (row.children.falseChild && toggleIfRecursive([row.children.falseChild], rowId, checked)) {
                return true;
            }
        }
        return false;
    };

    // Toggle expand/collapse
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
            
            if (row.children.trueChild && toggleExpandRecursive([row.children.trueChild], rowId)) {
                return true;
            }
            if (row.children.falseChild && toggleExpandRecursive([row.children.falseChild], rowId)) {
                return true;
            }
        }
        return false;
    };

    // Generate formula preview
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
            
            const trueFormula = row.children.trueChild ? generateFormula(row.children.trueChild) : 'TRUE_FORMULA';
            const falseFormula = row.children.falseChild ? generateFormula(row.children.falseChild) : 'FALSE_FORMULA';
            
            return `IF(${leftVal} ${condition} ${rightVal}, ${trueFormula}, ${falseFormula})`;
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

    // Add new row to the grid
    const addNewRow = () => {
        const newRowId = `row_${Date.now()}`;
        const newRow = createNewRow(newRowId);
        setRows(prevRows => {
            const updatedRows = [...prevRows, newRow];
            if (onDataChange) onDataChange(updatedRows);
            return updatedRows;
        });
    };

    // Delete row from the grid
    const deleteRow = (rowId) => {
        setRows(prevRows => {
            const updatedRows = removeRowRecursive(prevRows, rowId);
            if (onDataChange) onDataChange(updatedRows);
            return updatedRows;
        });
    };

    // Recursive function to remove a row from the tree structure
    const removeRowRecursive = (rowsList, rowId) => {
        // Filter out the row with matching ID from the current level
        const filteredRows = rowsList.filter(row => row.id !== rowId);
        
        // For remaining rows, check and clean their children
        return filteredRows.map(row => {
            const updatedRow = { ...row };
            
            // Check true child
            if (updatedRow.children.trueChild?.id === rowId) {
                updatedRow.children.trueChild = null;
            } else if (updatedRow.children.trueChild) {
                const updatedTrueChild = removeRowRecursive([updatedRow.children.trueChild], rowId);
                updatedRow.children.trueChild = updatedTrueChild.length > 0 ? updatedTrueChild[0] : null;
            }
            
            // Check false child
            if (updatedRow.children.falseChild?.id === rowId) {
                updatedRow.children.falseChild = null;
            } else if (updatedRow.children.falseChild) {
                const updatedFalseChild = removeRowRecursive([updatedRow.children.falseChild], rowId);
                updatedRow.children.falseChild = updatedFalseChild.length > 0 ? updatedFalseChild[0] : null;
            }
            
            // Update hasChildren status
            updatedRow.hasChildren = !!(updatedRow.children.trueChild || updatedRow.children.falseChild);
            
            return updatedRow;
        });
    };

    // Generate complete formula for all rows
    const generateCompleteFormula = () => {
        if (rows.length === 0) return '';
        if (rows.length === 1) return generateFormula(rows[0]);
        
        // For multiple rows, join them with + operation
        return rows.map(row => `(${generateFormula(row)})`).join(' + ');
    };

    // Save data to console with validation
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
        console.log('=== NestedIfGridV2 Data Export ===');
        console.log('Validation Status: PASSED ✅');
        console.log('Complete Formula:', generateCompleteFormula());
        console.log('Rows Data:', JSON.stringify(rows, null, 2));
        console.log('Total Rows:', rows.length);
        console.log('Timestamp:', new Date().toISOString());
        console.log('=====================================');
        
        // Show success message
        alert('✅ Validation Passed!\n\nData saved to console successfully!\nCheck browser console for details.');
    };

    // Render single row
    const renderRow = (row, isChild = false) => (
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

            {/* Recursive Child Rendering */}
            {row.hasChildren && row.isExpanded && (
                <div className='custom-child-row'>
                    {row.children.trueChild && renderRow(row.children.trueChild, true)}
                    {row.children.falseChild && renderRow(row.children.falseChild, true)}
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
                        Nested IF Grid Builder
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

export default NestedIfGridV2;
