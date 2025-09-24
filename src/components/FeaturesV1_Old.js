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
    Tooltip
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';

import './index.css';

// Import transformation utilities for database format
import { prepareEnhancedDataForDatabase } from './EnhancedDataTransformUtils';

/**
 * FeaturesV1 Component - Enhanced with IF/IF-ELSE Dropdown
 * 
 * New Features:
 * 1. Dropdown with options: ['None', 'IF', 'IF-ELSE']
 * 2. 'IF' - Shows only TRUE branch
 * 3. 'IF-ELSE' - Shows both TRUE and FALSE branches
 * 4. 'None' - No conditional logic (like unchecked)
 * 5. Multiple children support for each branch
 * 6. Database format logging on save
 */
const FeaturesV1 = ({ 
    initialRows = [], 
    paramIdOptions = [], 
    uomOptions = [], 
    onDataChange 
}) => {
    // Enhanced state management
    const [rows, setRows] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [showValidationAlert, setShowValidationAlert] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());

    // Initialize rows from props or create default
    useEffect(() => {
        if (initialRows && initialRows.length > 0) {
            setRows(initialRows);
            
            // Auto-expand rows that have IF/IF-ELSE conditions
            const autoExpand = new Set();
            initialRows.forEach(row => {
                if (row.conditionType && row.conditionType !== 'None') {
                    autoExpand.add(row.id);
                }
            });
            setExpandedRows(autoExpand);
        } else {
            // Create default row with enhanced structure
            const defaultRow = createDefaultRow();
            setRows([defaultRow]);
        }
    }, [initialRows]);

    // Create a new default row with enhanced structure
    const createDefaultRow = (parentId = null, isTrueBranch = null, branchIndex = 0) => {
        const rowId = `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return {
            id: rowId,
            parentId,
            isTrueBranch,
            branchIndex,
            paramId: '',
            paramDesc: '',
            moduleDesc: '',
            uom: 'EA',
            operation: '*',
            standardMH: 0,
            
            // Enhanced: Condition type dropdown
            conditionType: 'None', // 'None', 'IF', 'IF-ELSE'
            
            // Conditional fields
            leftType: 'PARAM ID',
            leftValue: '',
            condition: '==',
            rightType: 'PARAM ID',
            rightValue: '',
            
            // UI state
            isExpanded: false,
            hasChildren: false,
            
            // Enhanced: Multiple children support
            children: {
                trueChildren: [],
                falseChildren: []
            }
        };
    };

    // Add new row at root level
    const addRow = () => {
        const newRow = createDefaultRow();
        setRows([...rows, newRow]);
        
        if (onDataChange) {
            onDataChange([...rows, newRow]);
        }
    };

    // Remove row by ID (with children cleanup)
    const removeRow = (rowId) => {
        const removeRecursively = (rowsArray, targetId) => {
            return rowsArray.filter(row => {
                if (row.id === targetId) {
                    return false; // Remove this row
                }
                
                // Remove from children arrays recursively
                if (row.children && row.children.trueChildren) {
                    row.children.trueChildren = removeRecursively(row.children.trueChildren, targetId);
                }
                if (row.children && row.children.falseChildren) {
                    row.children.falseChildren = removeRecursively(row.children.falseChildren, targetId);
                }
                
                // Update hasChildren status
                row.hasChildren = (row.children.trueChildren.length > 0 || row.children.falseChildren.length > 0);
                
                return true; // Keep this row
            });
        };

        const updatedRows = removeRecursively(rows, rowId);
        setRows(updatedRows);
        
        // Remove from expanded set
        const newExpanded = new Set(expandedRows);
        newExpanded.delete(rowId);
        setExpandedRows(newExpanded);
        
        if (onDataChange) {
            onDataChange(updatedRows);
        }
    };

    // Enhanced: Add child row to specific branch
    const addChildRow = (parentId, isTrueBranch) => {
        const addChildRecursively = (rowsArray) => {
            return rowsArray.map(row => {
                if (row.id === parentId) {
                    const targetChildren = isTrueBranch ? row.children.trueChildren : row.children.falseChildren;
                    const branchIndex = targetChildren.length;
                    const newChild = createDefaultRow(parentId, isTrueBranch, branchIndex);
                    
                    const updatedChildren = [...targetChildren, newChild];
                    
                    return {
                        ...row,
                        hasChildren: true,
                        isExpanded: true,
                        children: {
                            ...row.children,
                            [isTrueBranch ? 'trueChildren' : 'falseChildren']: updatedChildren
                        }
                    };
                } else {
                    // Recursively check children
                    return {
                        ...row,
                        children: {
                            trueChildren: addChildRecursively(row.children.trueChildren),
                            falseChildren: addChildRecursively(row.children.falseChildren)
                        }
                    };
                }
            });
        };

        const updatedRows = addChildRecursively(rows);
        setRows(updatedRows);
        
        // Auto-expand parent
        const newExpanded = new Set(expandedRows);
        newExpanded.add(parentId);
        setExpandedRows(newExpanded);
        
        if (onDataChange) {
            onDataChange(updatedRows);
        }
    };

    // Enhanced: Remove child row
    const removeChildRow = (parentId, isTrueBranch, childIndex) => {
        const removeChildRecursively = (rowsArray) => {
            return rowsArray.map(row => {
                if (row.id === parentId) {
                    const targetChildren = isTrueBranch ? row.children.trueChildren : row.children.falseChildren;
                    
                    // Don't remove if only one child remains
                    if (targetChildren.length <= 1) {
                        return row;
                    }
                    
                    const updatedChildren = targetChildren.filter((_, index) => index !== childIndex);
                    
                    // Update branch indices
                    updatedChildren.forEach((child, index) => {
                        child.branchIndex = index;
                    });
                    
                    const newRow = {
                        ...row,
                        children: {
                            ...row.children,
                            [isTrueBranch ? 'trueChildren' : 'falseChildren']: updatedChildren
                        }
                    };
                    
                    // Update hasChildren status
                    newRow.hasChildren = (newRow.children.trueChildren.length > 0 || newRow.children.falseChildren.length > 0);
                    
                    return newRow;
                } else {
                    // Recursively check children
                    return {
                        ...row,
                        children: {
                            trueChildren: removeChildRecursively(row.children.trueChildren),
                            falseChildren: removeChildRecursively(row.children.falseChildren)
                        }
                    };
                }
            });
        };

        const updatedRows = removeChildRecursively(rows);
        setRows(updatedRows);
        
        if (onDataChange) {
            onDataChange(updatedRows);
        }
    };

    // Update row field value
    const updateRowField = (rowId, field, value) => {
        const updateRecursively = (rowsArray) => {
            return rowsArray.map(row => {
                if (row.id === rowId) {
                    const updatedRow = { ...row, [field]: value };
                    
                    // Enhanced: Handle condition type changes
                    if (field === 'conditionType') {
                        // Update children visibility and expansion
                        if (value === 'None') {
                            updatedRow.hasChildren = false;
                            updatedRow.isExpanded = false;
                            // Keep existing children but hide them
                        } else if (value === 'IF') {
                            updatedRow.hasChildren = updatedRow.children.trueChildren.length > 0;
                            updatedRow.isExpanded = true;
                            // Ensure at least one TRUE child exists
                            if (updatedRow.children.trueChildren.length === 0) {
                                const newChild = createDefaultRow(rowId, true, 0);
                                updatedRow.children.trueChildren = [newChild];
                                updatedRow.hasChildren = true;
                            }
                        } else if (value === 'IF-ELSE') {
                            updatedRow.hasChildren = (updatedRow.children.trueChildren.length > 0 || updatedRow.children.falseChildren.length > 0);
                            updatedRow.isExpanded = true;
                            // Ensure at least one child in each branch
                            if (updatedRow.children.trueChildren.length === 0) {
                                const newTrueChild = createDefaultRow(rowId, true, 0);
                                updatedRow.children.trueChildren = [newTrueChild];
                            }
                            if (updatedRow.children.falseChildren.length === 0) {
                                const newFalseChild = createDefaultRow(rowId, false, 0);
                                updatedRow.children.falseChildren = [newFalseChild];
                            }
                            updatedRow.hasChildren = true;
                        }
                        
                        // Update expanded state
                        if (value !== 'None') {
                            const newExpanded = new Set(expandedRows);
                            newExpanded.add(rowId);
                            setExpandedRows(newExpanded);
                        } else {
                            const newExpanded = new Set(expandedRows);
                            newExpanded.delete(rowId);
                            setExpandedRows(newExpanded);
                        }
                    }
                    
                    return updatedRow;
                } else {
                    // Recursively update children
                    return {
                        ...row,
                        children: {
                            trueChildren: updateRecursively(row.children.trueChildren),
                            falseChildren: updateRecursively(row.children.falseChildren)
                        }
                    };
                }
            });
        };

        const updatedRows = updateRecursively(rows);
        setRows(updatedRows);
        
        if (onDataChange) {
            onDataChange(updatedRows);
        }
    };

    // Toggle row expansion
    const toggleRowExpansion = (rowId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(rowId)) {
            newExpanded.delete(rowId);
        } else {
            newExpanded.add(rowId);
        }
        setExpandedRows(newExpanded);
    };

    // Generate complete formula
    const generateCompleteFormula = () => {
        const generateRowFormula = (row) => {
            if (row.conditionType === 'None') {
                // Simple calculation
                if (row.paramId) {
                    return `[${row.paramId}] ${row.operation} ${row.standardMH}`;
                }
                return 'NO_FORMULA';
            } else if (row.conditionType === 'IF') {
                // IF condition with only TRUE branch
                const condition = `[${row.leftValue}] ${row.condition} ${row.rightValue}`;
                const trueFormulas = row.children.trueChildren
                    .map(child => generateRowFormula(child))
                    .filter(f => f !== 'NO_FORMULA');
                const trueResult = trueFormulas.length > 0 ? `(${trueFormulas.join(' + ')})` : 'NO_FORMULA';
                
                return `IF(${condition}, ${trueResult})`;
            } else if (row.conditionType === 'IF-ELSE') {
                // IF-ELSE condition with both branches
                const condition = `[${row.leftValue}] ${row.condition} ${row.rightValue}`;
                const trueFormulas = row.children.trueChildren
                    .map(child => generateRowFormula(child))
                    .filter(f => f !== 'NO_FORMULA');
                const falseFormulas = row.children.falseChildren
                    .map(child => generateRowFormula(child))
                    .filter(f => f !== 'NO_FORMULA');
                
                const trueResult = trueFormulas.length > 0 ? `(${trueFormulas.join(' + ')})` : 'NO_FORMULA';
                const falseResult = falseFormulas.length > 0 ? `(${falseFormulas.join(' + ')})` : 'NO_FORMULA';
                
                return `IF(${condition}, ${trueResult}, ${falseResult})`;
            }
            
            return 'NO_FORMULA';
        };

        const rootFormulas = rows
            .map(row => generateRowFormula(row))
            .filter(formula => formula !== 'NO_FORMULA');
            
        return rootFormulas.length > 0 ? `(${rootFormulas.join(' + ')})` : 'NO_FORMULA_GENERATED';
    };

    // Enhanced validation
    const validateAllRows = () => {
        const errors = {};

        const validateRecursively = (rowsArray, path = '') => {
            rowsArray.forEach((row, index) => {
                const rowPath = path ? `${path}.${index}` : `${index}`;
                
                // Validate basic fields
                if (!row.paramId) {
                    errors[`${rowPath}.paramId`] = 'Param ID is required';
                }
                if (!row.moduleDesc) {
                    errors[`${rowPath}.moduleDesc`] = 'Module Description is required';
                }
                
                // Validate conditional fields for IF/IF-ELSE
                if (row.conditionType === 'IF' || row.conditionType === 'IF-ELSE') {
                    if (!row.leftValue) {
                        errors[`${rowPath}.leftValue`] = 'Left value is required for IF condition';
                    }
                    if (!row.rightValue) {
                        errors[`${rowPath}.rightValue`] = 'Right value is required for IF condition';
                    }
                    
                    // Validate children exist
                    if (row.conditionType === 'IF' && row.children.trueChildren.length === 0) {
                        errors[`${rowPath}.trueChildren`] = 'IF condition must have at least one TRUE branch child';
                    }
                    if (row.conditionType === 'IF-ELSE') {
                        if (row.children.trueChildren.length === 0) {
                            errors[`${rowPath}.trueChildren`] = 'IF-ELSE condition must have at least one TRUE branch child';
                        }
                        if (row.children.falseChildren.length === 0) {
                            errors[`${rowPath}.falseChildren`] = 'IF-ELSE condition must have at least one FALSE branch child';
                        }
                    }
                }
                
                // Recursively validate children
                if (row.children) {
                    validateRecursively(row.children.trueChildren, `${rowPath}.trueChildren`);
                    validateRecursively(row.children.falseChildren, `${rowPath}.falseChildren`);
                }
            });
        };

        validateRecursively(rows);
        return errors;
    };

    // Check if validation has errors
    const hasValidationErrors = (errors) => {
        return Object.keys(errors).length > 0;
    };

    // Enhanced save data with database logging
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
        console.log('=== FeaturesV1 Data Export ===');
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
                    relationships[`Root_${row.id}`] = { 
                        paramId: row.paramId, 
                        conditionType: row.conditionType 
                    };
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
            console.log(`🔄 None Conditions: ${dbData.filter(r => r.conditionType === 'None').length}`);
            console.log(`🔀 IF Conditions: ${dbData.filter(r => r.conditionType === 'IF').length}`);
            console.log(`🔄 IF-ELSE Conditions: ${dbData.filter(r => r.conditionType === 'IF-ELSE').length}`);
            
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
                    conditionType: row.conditionType, // NEW field
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
        alert('✅ Validation Passed!\n\nData saved to console successfully!\nCheck browser console for both Component and Database formats with IF/IF-ELSE analysis.');
    };

    // Enhanced: Render children section with add/remove buttons
    const renderChildrenSection = (row, isTrueBranch) => {
        const children = isTrueBranch ? row.children.trueChildren : row.children.falseChildren;
        const branchName = isTrueBranch ? 'TRUE' : 'FALSE';
        const branchColor = isTrueBranch ? '#4caf50' : '#f44336';
        
        // Don't render FALSE branch for IF condition type
        if (!isTrueBranch && row.conditionType === 'IF') {
            return null;
        }
        
        // Don't render any branches for None condition type
        if (row.conditionType === 'None') {
            return null;
        }
        
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
                
                {children.map((child, childIndex) => (
                    <div key={child.id} style={{ marginBottom: '10px' }}>
                        {renderRow(child, `${row.id}_${isTrueBranch ? 'true' : 'false'}_${childIndex}`, true, () => removeChildRow(row.id, isTrueBranch, childIndex))}
                    </div>
                ))}
            </div>
        );
    };

    // Enhanced: Render individual row with condition type dropdown
    const renderRow = (row, rowKey, isChild = false, onRemove = null) => {
        const isExpanded = expandedRows.has(row.id);
        const hasError = Object.keys(validationErrors).some(key => key.startsWith(rowKey));
        
        return (
            <Paper 
                key={row.id} 
                style={{ 
                    marginBottom: '15px', 
                    padding: '15px',
                    backgroundColor: isChild ? '#f8f9fa' : '#ffffff',
                    border: hasError ? '2px solid #f44336' : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: isChild ? '0 1px 3px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                {/* Row Header */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: isChild ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                }}>
                    <Typography variant="h6" style={{ fontWeight: 'bold', marginRight: '15px', color: '#1976d2' }}>
                        {isChild ? '🔸' : '📋'} Row {rowKey}
                    </Typography>
                    
                    {/* Enhanced: Condition Type Dropdown */}
                    <FormControl style={{ minWidth: 120, marginRight: '15px' }}>
                        <InputLabel>Condition</InputLabel>
                        <Select
                            value={row.conditionType}
                            onChange={(e) => updateRowField(row.id, 'conditionType', e.target.value)}
                        >
                            <MenuItem value="None">None</MenuItem>
                            <MenuItem value="IF">IF</MenuItem>
                            <MenuItem value="IF-ELSE">IF-ELSE</MenuItem>
                        </Select>
                    </FormControl>
                    
                    {/* Expansion Button (only for IF/IF-ELSE) */}
                    {(row.conditionType === 'IF' || row.conditionType === 'IF-ELSE') && (
                        <Tooltip title="Toggle branches visibility">
                            <IconButton
                                onClick={() => toggleRowExpansion(row.id)}
                                style={{ 
                                    color: isExpanded ? '#4caf50' : '#757575',
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s'
                                }}
                            >
                                <KeyboardArrowDownIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    
                    {/* Remove Button (for child rows or root rows with multiple) */}
                    {(onRemove || rows.length > 1) && (
                        <Tooltip title="Remove this row">
                            <IconButton
                                onClick={onRemove || (() => removeRow(row.id))}
                                style={{ color: '#f44336' }}
                                size="small"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>

                {/* Basic Row Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                    {/* Param ID */}
                    <FormControl fullWidth>
                        <InputLabel>Param ID</InputLabel>
                        <Select
                            value={row.paramId}
                            onChange={(e) => updateRowField(row.id, 'paramId', e.target.value)}
                            error={!!validationErrors[`${rowKey}.paramId`]}
                        >
                            {paramIdOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {validationErrors[`${rowKey}.paramId`] && (
                            <Typography variant="caption" color="error">
                                {validationErrors[`${rowKey}.paramId`]}
                            </Typography>
                        )}
                    </FormControl>

                    {/* Module Description */}
                    <TextField
                        label="Module Description"
                        value={row.moduleDesc}
                        onChange={(e) => updateRowField(row.id, 'moduleDesc', e.target.value)}
                        error={!!validationErrors[`${rowKey}.moduleDesc`]}
                        helperText={validationErrors[`${rowKey}.moduleDesc`]}
                        fullWidth
                    />

                    {/* UOM */}
                    <FormControl fullWidth>
                        <InputLabel>UOM</InputLabel>
                        <Select
                            value={row.uom}
                            onChange={(e) => updateRowField(row.id, 'uom', e.target.value)}
                        >
                            {uomOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Operation */}
                    <FormControl fullWidth>
                        <InputLabel>Operation</InputLabel>
                        <Select
                            value={row.operation}
                            onChange={(e) => updateRowField(row.id, 'operation', e.target.value)}
                        >
                            <MenuItem value="*">Multiply (*)</MenuItem>
                            <MenuItem value="+">Add (+)</MenuItem>
                            <MenuItem value="-">Subtract (-)</MenuItem>
                            <MenuItem value="/">/Divide (/)</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Standard MH */}
                    <TextField
                        label="Standard MH"
                        type="number"
                        value={row.standardMH}
                        onChange={(e) => updateRowField(row.id, 'standardMH', parseFloat(e.target.value) || 0)}
                        fullWidth
                        inputProps={{ min: 0, step: 0.01 }}
                    />
                </div>

                {/* Enhanced: Conditional Fields (only for IF/IF-ELSE) */}
                {(row.conditionType === 'IF' || row.conditionType === 'IF-ELSE') && (
                    <div style={{ 
                        padding: '15px', 
                        backgroundColor: '#fff3e0', 
                        border: '1px solid #ff9800',
                        borderRadius: '4px',
                        marginBottom: '15px'
                    }}>
                        <Typography variant="subtitle2" style={{ fontWeight: 'bold', color: '#e65100', marginBottom: '10px' }}>
                            🔀 {row.conditionType} Condition Setup
                        </Typography>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', alignItems: 'end' }}>
                            {/* Left Type */}
                            <FormControl fullWidth size="small">
                                <InputLabel>Left Type</InputLabel>
                                <Select
                                    value={row.leftType}
                                    onChange={(e) => updateRowField(row.id, 'leftType', e.target.value)}
                                >
                                    <MenuItem value="PARAM ID">PARAM ID</MenuItem>
                                    <MenuItem value="NUMBER">NUMBER</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Left Value */}
                            <TextField
                                label="Left Value"
                                value={row.leftValue}
                                onChange={(e) => updateRowField(row.id, 'leftValue', e.target.value)}
                                error={!!validationErrors[`${rowKey}.leftValue`]}
                                helperText={validationErrors[`${rowKey}.leftValue`]}
                                size="small"
                                fullWidth
                            />

                            {/* Condition */}
                            <FormControl fullWidth size="small">
                                <InputLabel>Condition</InputLabel>
                                <Select
                                    value={row.condition}
                                    onChange={(e) => updateRowField(row.id, 'condition', e.target.value)}
                                >
                                    <MenuItem value="==">=</MenuItem>
                                    <MenuItem value="!=">≠</MenuItem>
                                    <MenuItem value=">">&gt;</MenuItem>
                                    <MenuItem value="<">&lt;</MenuItem>
                                    <MenuItem value=">=">&gt;=</MenuItem>
                                    <MenuItem value="<=">&lt;=</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Right Type */}
                            <FormControl fullWidth size="small">
                                <InputLabel>Right Type</InputLabel>
                                <Select
                                    value={row.rightType}
                                    onChange={(e) => updateRowField(row.id, 'rightType', e.target.value)}
                                >
                                    <MenuItem value="PARAM ID">PARAM ID</MenuItem>
                                    <MenuItem value="NUMBER">NUMBER</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Right Value */}
                            <TextField
                                label="Right Value"
                                value={row.rightValue}
                                onChange={(e) => updateRowField(row.id, 'rightValue', e.target.value)}
                                error={!!validationErrors[`${rowKey}.rightValue`]}
                                helperText={validationErrors[`${rowKey}.rightValue`]}
                                size="small"
                                fullWidth
                            />
                        </div>
                        
                        <Typography variant="caption" style={{ color: '#bf360c', marginTop: '8px', display: 'block' }}>
                            Preview: [{row.leftValue}] {row.condition} {row.rightValue}
                        </Typography>
                    </div>
                )}

                {/* Enhanced: Children Sections (TRUE and FALSE branches) */}
                {isExpanded && (row.conditionType === 'IF' || row.conditionType === 'IF-ELSE') && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', border: '1px solid #2196f3', borderRadius: '4px' }}>
                        <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '15px' }}>
                            🌳 {row.conditionType === 'IF' ? 'Conditional Branch' : 'Conditional Branches'}
                        </Typography>
                        
                        {/* TRUE Branch */}
                        {renderChildrenSection(row, true)}
                        
                        {/* FALSE Branch (only for IF-ELSE) */}
                        {row.conditionType === 'IF-ELSE' && renderChildrenSection(row, false)}
                    </div>
                )}
            </Paper>
        );
    };

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
                            onClick={addRow}
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
                        ✨ <strong>Enhanced with Condition Types:</strong> None (no branches), IF (TRUE only), IF-ELSE (both branches)
                        <AddIcon style={{ fontSize: '16px', verticalAlign: 'middle' }} /> Add multiple rows under each branch!
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
            {showValidationAlert && (
                <Alert 
                    severity="error" 
                    style={{ marginBottom: '20px' }}
                    onClose={() => setShowValidationAlert(false)}
                >
                    <strong>Validation Errors:</strong>
                    <pre style={{ whiteSpace: 'pre-wrap', marginTop: '5px' }}>{validationMessage}</pre>
                </Alert>
            )}

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
};

export default FeaturesV1;