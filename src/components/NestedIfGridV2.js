import React, { useState, useEffect } from 'react';
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

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
            const operation = row.operation || '*';
            const standardMH = row.standardMH || 0;
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

        switch (typeValue) {
            case 'PARAM ID':
                return (
                    <FormControl variant="outlined" size="small">
                        <Select
                            value={currentValue}
                            onChange={(e) => updateRow(row.id, valueField, e.target.value)}
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
                    />
                );
            default:
                return (
                    <TextField
                        variant="outlined"
                        size="small"
                        value={currentValue}
                        disabled
                    />
                );
        }
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
                    <FormControl variant="outlined" size="small">
                        <InputLabel>Param ID</InputLabel>
                        <Select
                            value={row.paramId}
                            onChange={(e) => updateRow(row.id, 'paramId', e.target.value)}
                            label="Param ID"
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
                    />
                </div>

                {/* UOM - Disabled when IF checked */}
                <div className='col-block'>
                    <FormControl variant="outlined" size="small">
                        <InputLabel>UOM</InputLabel>
                        <Select
                            value={row.uom}
                            onChange={(e) => updateRow(row.id, 'uom', e.target.value)}
                            label="UOM"
                            disabled={row.ifChecked}
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
                    <FormControl variant="outlined" size="small">
                        <InputLabel>Operation</InputLabel>
                        <Select
                            value={row.operation}
                            onChange={(e) => updateRow(row.id, 'operation', e.target.value)}
                            label="Operation"
                            disabled={row.ifChecked}
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
                            <FormControl variant="outlined" size="small">
                                <InputLabel>Left Type</InputLabel>
                                <Select
                                    value={row.leftType}
                                    onChange={(e) => updateRow(row.id, 'leftType', e.target.value)}
                                    label="Left Type"
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
                            <FormControl variant="outlined" size="small">
                                <InputLabel>Condition</InputLabel>
                                <Select
                                    value={row.condition}
                                    onChange={(e) => updateRow(row.id, 'condition', e.target.value)}
                                    label="Condition"
                                >
                                    {conditionOptions.map(cond => (
                                        <MenuItem key={cond} value={cond}>{cond}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Right Type */}
                        <div className='col-block'>
                            <FormControl variant="outlined" size="small">
                                <InputLabel>Right Type</InputLabel>
                                <Select
                                    value={row.rightType}
                                    onChange={(e) => updateRow(row.id, 'rightType', e.target.value)}
                                    label="Right Type"
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
        <div className='formula-build-form'>
            {rows.map(row => renderRow(row))}
        </div>
    );
}

export default NestedIfGridV2;
