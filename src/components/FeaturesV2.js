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

function FeaturesV2({ 
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

    // Create default initial rows with default conditionType as "None"
    const createDefaultRow = () => {
        const newId = idCounter;
        setIdCounter(prev => prev + 1);
        
        return {
            id: newId,
            parentId: null,
            branchFlag: null,
            branchIndex: null,
            paramId: '',
            description: '',
            uom: 'EA',
            operation: '*',
            standardMh: '',
            conditionType: 'None', // DEFAULT: None ifCondition type
            comment: '', // NEW: Comment field
            isExpanded: false,
            hasChildren: false,
            // Conditional fields for IF/IF-ELSE
            leftType: 'PARAM ID',
            leftValue: '',
            ifCondition: '=',
            rightType: 'PARAM ID',
            rightValue: '',
            // LOOKUP fields
            lookupArray: '', // For LOOKUP([param1], [param2], [param3])
            lookupIndex: '',
            lookupValue: '',
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
                conditionType: row.conditionType || 'None',
                standardMh: String(row.standardMh || ''),
                comment: row.comment || '',
                isExpanded: row.isExpanded !== undefined ? row.isExpanded : (row.conditionType !== 'None'),
                hasChildren: row.hasChildren !== undefined ? row.hasChildren : (row.conditionType !== 'None'),
                children: row.children ? {
                    trueChildren: row.children.trueChildren || [],
                    falseChildren: row.children.falseChildren || []
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

    // Default options
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
                isExpanded: row.isExpanded !== undefined ? row.isExpanded : (row.conditionType !== 'None'),
                hasChildren: row.hasChildren !== undefined ? row.hasChildren : (row.conditionType !== 'None'),
                children: row.children ? {
                    trueChildren: row.children.trueChildren || [],
                    falseChildren: row.children.falseChildren || []
                } : { trueChildren: [], falseChildren: [] },
                branchIndex: row.branchIndex !== undefined ? row.branchIndex : null
            }));
            setRows(initializedRows);
        }
    }, [initialRows]);

    // Validation functions
    const validateRow = (row, errors = {}, path = '') => {
        const rowPath = path || row.id;
        
        if (!row.paramId || row.paramId.trim() === '') {
            errors[`${rowPath}.paramId`] = 'Param ID is required';
        }
        
        if (!row.comment || row.comment.trim() === '') {
            errors[`${rowPath}.comment`] = 'Comment is required';
        }
        
        if (row.conditionType === 'None') {
            if (!row.uom || row.uom.trim() === '') {
                errors[`${rowPath}.uom`] = 'UOM is required';
            }
            if (!row.operation || row.operation.trim() === '') {
                errors[`${rowPath}.operation`] = 'Operation is required';
            }
            if (row.standardMh === null || row.standardMh === undefined || row.standardMh === '') {
                errors[`${rowPath}.standardMh`] = 'Standard MH/UOM is required';
            }
        } else if (row.conditionType === 'LOOKUP') {
            // Validate LOOKUP parent row has basic fields like None ifCondition
            if (!row.paramId || row.paramId.trim() === '') {
                errors[`${rowPath}.paramId`] = 'Param ID is required';
            }
            if (!row.uom || row.uom.trim() === '') {
                errors[`${rowPath}.uom`] = 'UOM is required';
            }
            if (!row.operation || row.operation.trim() === '') {
                errors[`${rowPath}.operation`] = 'Operation is required';
            }
            if (row.standardMh === null || row.standardMh === undefined || row.standardMh === '') {
                errors[`${rowPath}.standardMh`] = 'Standard MH/UOM is required';
            }
            // Validate LOOKUP needs at least 3 children
            if (!row.children?.trueChildren || row.children.trueChildren.length < 3) {
                errors[`${rowPath}.children`] = 'LOOKUP requires at least 3 children (Array, Index, Value)';
            }
        } else if (row.conditionType === 'IF' || row.conditionType === 'IF-ELSE') {
            if (!row.leftType || row.leftType.trim() === '') {
                errors[`${rowPath}.leftType`] = 'Left Type is required';
            }
            if (!row.leftValue || row.leftValue.trim() === '') {
                errors[`${rowPath}.leftValue`] = 'Left Value is required';
            }
            if (!row.ifCondition || row.ifCondition.trim() === '') {
                errors[`${rowPath}.ifCondition`] = 'Condition is required';
            }
            if (!row.rightType || row.rightType.trim() === '') {
                errors[`${rowPath}.rightType`] = 'Right Type is required';
            }
            if (!row.rightValue || row.rightValue.trim() === '') {
                errors[`${rowPath}.rightValue`] = 'Right Value is required';
            }
            
            // Validate children
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

    // Helper functions
    const buildValidationPath = (row, allRows) => {
        if (!row.parentId || row.branchFlag === null) {
            return row.id;
        }
        
        const parent = findRowRecursively(allRows, row.parentId);
        if (!parent) {
            return row.id;
        }
        
        const parentPath = buildValidationPath(parent, allRows);
        const branchType = row.branchFlag ? 'true' : 'false';
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
    const createNewRow = (id, parentId = null, branchFlag = null, branchIndex = null) => ({
        id,
        parentId,
        branchFlag,
        branchIndex,
        paramId: '',
        description: '',
        uom: 'EA',
        operation: '*',
        standardMh: '',
        conditionType: 'None', // DEFAULT: None ifCondition type
        comment: '', // NEW: Comment field
        isExpanded: false,
        hasChildren: false,
        // Conditional fields
        leftType: 'PARAM ID',
        leftValue: '',
        ifCondition: '=',
        rightType: 'PARAM ID',
        rightValue: '',
        // LOOKUP fields
        lookupArray: '',
        lookupIndex: '',
        lookupValue: '',
        children: {
            trueChildren: [],
            falseChildren: []
        }
    });

    // Update row data
    const updateRow = (rowId, field, value) => {
        setRows(prevRows => {
            const newRows = JSON.parse(JSON.stringify(prevRows));
            updateRowRecursive(newRows, rowId, field, value);
            if (onDataChange) onDataChange(newRows);
            return newRows;
        });
    };

    const updateRowRecursive = (rowsList, rowId, field, value) => {
        for (let row of rowsList) {
            if (row.id === rowId) {
                row[field] = value;
                
                if (field === 'paramId') {
                    const selectedParam = finalParamOptions.find(opt => opt.value === value);
                    if (selectedParam) {
                        row.description = selectedParam.description || '';
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

    // Handle Condition Type change
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
                
                row.hasChildren = hasChildren;
                
                if (hasChildren && row.children.trueChildren.length === 0 && row.children.falseChildren.length === 0) {
                    console.log(`🔧 Creating children for parent ${rowId}, ifCondition type: ${conditionType}`);
                    
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
                        
                        console.log(`✅ Created child ID: ${trueChildId} for IF ifCondition`);
                    } else if (conditionType === 'LOOKUP') {
                        // Create 3 children for LOOKUP (array, index, value)
                        const [arrayId, indexId, valueId] = generateMultipleIds(3);
                        
                        const arrayChild = createNewRow(arrayId, rowId, true, 0);
                        const indexChild = createNewRow(indexId, rowId, true, 1);
                        const valueChild = createNewRow(valueId, rowId, true, 2);
                        
                        row.children.trueChildren = [arrayChild, indexChild, valueChild];
                        row.children.falseChildren = [];
                        
                        console.log(`✅ Created 3 LOOKUP children: Array(${arrayId}), Index(${indexId}), Value(${valueId})`);
                    }
                    
                    row.isExpanded = true;
                } else if (hasChildren) {
                    console.log(`🔄 Switching ifCondition type to: ${conditionType} for parent ${rowId}`);
                    
                    if (conditionType === 'IF') {
                        row.children.falseChildren = [];
                        if (row.children.trueChildren.length === 0) {
                            const trueChildId = generateNextId();
                            const trueChild = createNewRow(trueChildId, rowId, true, 0);
                            row.children.trueChildren = [trueChild];
                        }
                    } else if (conditionType === 'LOOKUP') {
                        row.children.falseChildren = [];
                        // Ensure at least 3 children for LOOKUP
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
                } else {
                    // Remove all children for None only
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
    const addChildRow = (parentRowId, branchFlag) => {
        setRows(prevRows => {
            const newRows = JSON.parse(JSON.stringify(prevRows));
            addChildRowRecursive(newRows, parentRowId, branchFlag);
            if (onDataChange) onDataChange(newRows);
            return newRows;
        });
    };

    const addChildRowRecursive = (rowsList, parentRowId, branchFlag) => {
        for (let row of rowsList) {
            if (row.id === parentRowId) {
                const targetArray = branchFlag ? row.children.trueChildren : row.children.falseChildren;
                const newIndex = targetArray.length;
                const newRowId = generateNextId();
                
                const newChildRow = createNewRow(newRowId, parentRowId, branchFlag, newIndex);
                targetArray.push(newChildRow);
                
                row.hasChildren = true;
                row.isExpanded = true;
                return true;
            }
            
            if (row.children.trueChildren && addChildRowRecursive(row.children.trueChildren, parentRowId, branchFlag)) {
                return true;
            }
            if (row.children.falseChildren && addChildRowRecursive(row.children.falseChildren, parentRowId, branchFlag)) {
                return true;
            }
        }
        return false;
    };

    // Remove child row
    const removeChildRow = (parentRowId, branchFlag, childIndex) => {
        setRows(prevRows => {
            const newRows = JSON.parse(JSON.stringify(prevRows));
            removeChildRowRecursive(newRows, parentRowId, branchFlag, childIndex);
            if (onDataChange) onDataChange(newRows);
            return newRows;
        });
    };

    const removeChildRowRecursive = (rowsList, parentRowId, branchFlag, childIndex) => {
        for (let row of rowsList) {
            if (row.id === parentRowId) {
                const targetArray = branchFlag ? row.children.trueChildren : row.children.falseChildren;
                
                if (childIndex >= 0 && childIndex < targetArray.length) {
                    targetArray.splice(childIndex, 1);
                    
                    targetArray.forEach((child, index) => {
                        child.branchIndex = index;
                    });
                    
                    row.hasChildren = row.children.trueChildren.length > 0 || row.children.falseChildren.length > 0;
                }
                return true;
            }
            
            if (row.children.trueChildren && removeChildRowRecursive(row.children.trueChildren, parentRowId, branchFlag, childIndex)) {
                return true;
            }
            if (row.children.falseChildren && removeChildRowRecursive(row.children.falseChildren, parentRowId, branchFlag, childIndex)) {
                return true;
            }
        }
        return false;
    };

    // Generate formula preview
    const generateFormula = (row) => {
        if (row.conditionType === 'None') {
            const paramDisplay = row.paramId ? `[${row.paramId}]` : '[PARAM]';
            const standardMh = String(row.standardMh || '');
            const operation = row.operation || '*';
            
            if (operation === 'Number' || operation === 'String') {
                if (!standardMh || standardMh.trim() === '') {
                    return operation === 'Number' ? '0' : 'EMPTY_STRING';
                }
                return standardMh;
            } else {
                if (!standardMh || standardMh.trim() === '' || standardMh === '0') {
                    return paramDisplay;
                }
                return `${paramDisplay} ${operation} ${standardMh}`;
            }
        } else if (row.conditionType === 'LOOKUP') {
            // LOOKUP formula: Extract [array], [index], [value] from first 3 children
            // Remaining children are multiplied with the LOOKUP result
            const children = row.children?.trueChildren || [];
            
            if (children.length === 0) {
                return 'LOOKUP(NO_CHILDREN)';
            }
            
            // First 3 children are the LOOKUP parameters (array, index, value)
            const array = children[0] ? `[${children[0].paramId || 'ARRAY'}]` : '[ARRAY]';
            const index = children[1] ? `[${children[1].paramId || 'INDEX'}]` : '[INDEX]';
            const value = children[2] ? `[${children[2].paramId || 'VALUE'}]` : '[VALUE]';
            
            const lookupFormula = `LOOKUP(${array}, ${index}, ${value})`;
            
            // If more than 3 children, multiply LOOKUP result with remaining children
            if (children.length > 3) {
                const additionalChildren = children.slice(3);
                const additionalFormula = additionalChildren.length === 1 
                    ? generateFormula(additionalChildren[0])
                    : `(${additionalChildren.map(child => generateFormula(child)).join(' + ')})`;
                
                return `${lookupFormula} * ${additionalFormula}`;
            }
            
            return lookupFormula;
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
            const ifCondition = row.ifCondition || '=';
            const rightVal = formatValueForFormula(row.rightValue, row.rightType);
            
            const generateChildrenFormula = (children) => {
                if (children.length === 0) return 'NO_FORMULA';
                if (children.length === 1) return generateFormula(children[0]);
                
                return `(${children.map(child => generateFormula(child)).join(' + ')})`;
            };
            
            const trueFormula = generateChildrenFormula(row.children.trueChildren);
            
            if (row.conditionType === 'IF') {
                return `IF(${leftVal} ${ifCondition} ${rightVal}, ${trueFormula})`;
            } else if (row.conditionType === 'IF-ELSE') {
                const falseFormula = generateChildrenFormula(row.children.falseChildren);
                return `IF(${leftVal} ${ifCondition} ${rightVal}, ${trueFormula}, ${falseFormula})`;
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
            
            if (updatedRow.children.trueChildren && updatedRow.children.trueChildren.length > 0) {
                updatedRow.children.trueChildren = removeRowRecursive(updatedRow.children.trueChildren, rowId);
            }
            
            if (updatedRow.children.falseChildren && updatedRow.children.falseChildren.length > 0) {
                updatedRow.children.falseChildren = removeRowRecursive(updatedRow.children.falseChildren, rowId);
            }
            
            updatedRow.hasChildren = updatedRow.children.trueChildren.length > 0 || updatedRow.children.falseChildren.length > 0;
            
            return updatedRow;
        });
    };

    // Generate complete formula
    const generateCompleteFormula = () => {
        if (rows.length === 0) return '';
        if (rows.length === 1) return generateFormula(rows[0]);
        
        return rows.map(row => `(${generateFormula(row)})`).join(' + ');
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
        
        // Database format with correct column names
        const dbFormatRows = [];
        
        const flattenRow = (row, parentId = null, branchFlag = null, branchIndex = null) => {
            // Main row
            dbFormatRows.push({
                id: row.id,
                conditionType: row.conditionType,
                parentId: parentId,
                branchFlag: branchFlag,
                branchIndex: branchIndex,
                paramId: row.paramId,
                operation: row.operation || '',
                standardMh: row.standardMh || '',
                leftType: row.leftType || '',
                leftValue: row.leftValue || '',
                ifCondition: row.ifCondition || '',
                rightType: row.rightType || '',
                rightValue: row.rightValue || '',
                uom: row.uom || '',
                comment: row.comment || '',
                // LOOKUP fields
                lookupArray: row.lookupArray || '',
                lookupIndex: row.lookupIndex || '',
                lookupValue: row.lookupValue || ''
            });
            
            // TRUE children
            if (row.children.trueChildren) {
                row.children.trueChildren.forEach((child, index) => {
                    flattenRow(child, row.id, true, index);
                });
            }
            
            // FALSE children
            if (row.children.falseChildren) {
                row.children.falseChildren.forEach((child, index) => {
                    flattenRow(child, row.id, false, index);
                });
            }
        };
        
        rows.forEach(row => flattenRow(row));
        
        console.log('=== FeaturesV2 Data Export ===');
        console.log('Validation Status: PASSED ✅');
        console.log('Complete Formula:', generateCompleteFormula());
        console.log('Database Format (with correct column names):', JSON.stringify(dbFormatRows, null, 2));
        console.log('Total Database Rows:', dbFormatRows.length);
        console.log('Timestamp:', new Date().toISOString());
        
        alert('✅ Validation Passed!\n\nData saved to console successfully!\nCheck browser console for Database format.');
    };

    // Render children section
    const renderChildrenSection = (row, branchFlag) => {
        const children = branchFlag ? row.children.trueChildren : row.children.falseChildren;
        
        // For LOOKUP, show different label and color
        let branchName, branchColor, backgroundColor;
        if (row.conditionType === 'LOOKUP') {
            branchName = 'LOOKUP Children';
            branchColor = '#ff9800'; // Orange for LOOKUP
            backgroundColor = '#fff3e0';
        } else {
            branchName = branchFlag ? 'TRUE' : 'FALSE';
            branchColor = branchFlag ? '#4caf50' : '#f44336';
            backgroundColor = branchFlag ? '#e8f5e8' : '#ffebee';
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
                            onClick={() => addChildRow(row.id, branchFlag)}
                            style={{ color: branchColor }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                
                {children.map((child, index) => {
                    // For LOOKUP, show special labels for first 3 children
                    let rowLabel = `Row ${index + 1}:`;
                    if (row.conditionType === 'LOOKUP') {
                        if (index === 0) rowLabel = '🔍 Array Param:';
                        else if (index === 1) rowLabel = '🔍 Index Param:';
                        else if (index === 2) rowLabel = '🔍 Value Param:';
                        else rowLabel = `📊 Multiplier ${index - 2}:`; // Additional rows for multiplication
                    }
                    
                    // For LOOKUP, first 3 children cannot be removed (required params)
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
                                            onClick={() => removeChildRow(row.id, branchFlag, index)}
                                            style={{ color: '#f44336', marginRight: '10px' }}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>
                            {renderRow(child, true, index)}
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
    const renderRow = (row, isChild = false, childIndex = null) => (
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

                {/* TRUE/FALSE Indicator for child rows */}
                {isChild && (
                    <div className={`col-block col-ifCondition ${row.branchFlag ? 'true' : 'false'} w40`}>
                        {row.branchFlag ? <DoneIcon /> : <ClearIcon />}
                        {childIndex !== null && (
                            <Typography variant="caption" style={{ marginLeft: '4px' }}>
                                {childIndex + 1}
                            </Typography>
                        )}
                    </div>
                )}

                {/* CHANGE 2: CONDITION TYPE DROPDOWN - MOVED BEFORE PARAM ID */}
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

                {/* CHANGE 3,4,5: CONDITIONAL FIELD DISPLAY BASED ON CONDITION TYPE */}
                
                {/* NONE CONDITION: Show basic fields */}
                {row.conditionType === 'None' && (
                    <>
                        {/* Param ID */}
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
                                value={row.description}
                                variant="outlined"
                                size="small"
                                disabled
                            />
                        </div>

                        {/* UOM */}
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

                        {/* Operation */}
                        <div className='col-block'>
                            <Autocomplete
                                value={operationOptions.find(op => op === row.operation) || null}
                                onChange={(event, newValue) => {
                                    updateRow(row.id, 'operation', newValue || '');
                                }}
                                options={operationOptions}
                                getOptionLabel={(option) => option}
                                size="small"
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
                                value={String(row.standardMh || '')}
                                onChange={(e) => {
                                    updateRow(row.id, 'standardMh', e.target.value);
                                }}
                                variant="outlined"
                                size="small"
                                error={hasFieldError(row, 'standardMh')}
                            />
                        </div>

                        {/* Formula Preview */}
                        <div className='col-block formula-preview'>
                            <span>{generateFormula(row)}</span>
                        </div>
                    </>
                )}

                {/* IF AND IF-ELSE CONDITIONS: Show conditional fields */}
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
                                error={hasFieldError(row, 'ifCondition')}
                            >
                                <InputLabel error={hasFieldError(row, 'ifCondition')}>Condition</InputLabel>
                                <Select
                                    value={row.ifCondition}
                                    onChange={(e) => updateRow(row.id, 'ifCondition', e.target.value)}
                                    label="Condition"
                                    error={hasFieldError(row, 'ifCondition')}
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

                {/* CHANGE 6: LOOKUP CONDITION: Show same basic fields as None - LOOKUP params are in children */}
                {row.conditionType === 'LOOKUP' && (
                    <>
                        {/* Param ID */}
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
                                value={row.description}
                                variant="outlined"
                                size="small"
                                disabled
                            />
                        </div>

                        {/* UOM */}
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

                        {/* Operation */}
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
                                    error={hasFieldError(row, 'operation')}
                                >
                                    <MenuItem value="+">+</MenuItem>
                                    <MenuItem value="-">-</MenuItem>
                                    <MenuItem value="*">*</MenuItem>
                                    <MenuItem value="/">/</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Standard MH/UOM */}
                        <div className='col-block'>
                            <TextField
                                label="Standard MH/UOM"
                                value={row.standardMh}
                                onChange={(e) => updateRow(row.id, 'standardMh', e.target.value)}
                                variant="outlined"
                                size="small"
                                type="number"
                                error={hasFieldError(row, 'standardMh')}
                            />
                        </div>
                    </>
                )}

                {/* Formula Preview - Show for all ifCondition types */}
                <div className='col-block formula-preview'>
                    <span>{generateFormula(row)}</span>
                </div>

                {/* Comment - Show for all ifCondition types */}
                <div className='col-block w200'>
                    <TextField
                        label="Comment"
                        value={row.comment}
                        onChange={(e) => updateRow(row.id, 'comment', e.target.value)}
                        variant="outlined"
                        size="small"
                        error={hasFieldError(row, 'comment')}
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
                    
                    {/* TRUE Branch for IF/IF-ELSE, or Single Branch for LOOKUP */}
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
                        🚀 FeaturesV2 - Enhanced Formula Builder with LOOKUP
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
                        ✨ <strong>FeaturesV2 Enhancements:</strong> Choose ifCondition type (None/IF/IF-ELSE/LOOKUP)! 
                        LOOKUP works like Excel: LOOKUP([array], [index], [value]). 
                        New row default is "None". Condition field moved before Param ID.
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

export default FeaturesV2;