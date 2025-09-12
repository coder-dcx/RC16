import React from 'react'
import CustDxTreeDataV1 from './CustDxTreeDataV1'
import rowsData from './rowsData.json'
function DataGrid() {
    const columns = [
        { name: 'rowId', title: 'Param ID' },
        { name: 'rowDesc', title: 'Param Description' },
        { name: 'moduleDesc', title: 'Module Description' },
        { name: 'formulaType', title: 'Formula Type' },
        { name: 'uom', title: 'UOM' },
        { name: 'standardMhUom', title: 'Standard MH/UOM' },
        { name: 'operation', title: 'Operation' },
        { name: 'formula', title: 'Formula' },
        { name: 'if', title: 'IF' },
        { name: 'leftValueType', title: 'Left Value Type' },
        { name: 'leftTypeValue', title: 'Left Type Value' },
        { name: 'ifOperator', title: 'IF Operator' },
        { name: 'rightValueType', title: 'Right Value Type' },
        { name: 'rightTypeValue', title: 'Right Type Value' },
    ];

    return (
        <div>
            DataGrid
            <CustDxTreeDataV1 initialRows={rowsData} columns={columns} />
        </div>
    )
}

export default DataGrid
