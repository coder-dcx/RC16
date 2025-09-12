import React, { useState } from 'react';
import {
    Grid,
    Table,
    TableHeaderRow,
    Toolbar,
    VirtualTable,
    TableFilterRow,
    SearchPanel,
    TableTreeColumn,
} from '@devexpress/dx-react-grid-material-ui';

import {
    TreeDataState,
    CustomTreeData,
    FilteringState,
    SearchState,
    SortingState,
} from '@devexpress/dx-react-grid';

import Paper from '@material-ui/core/Paper'; // ✅ Material-UI v4

// ✅ Safe child accessor
const getChildRows = (row, rootRows) => {
    if (row) return Array.isArray(row.children) ? row.children : [];
    return rootRows;
};

const CustDxTreeDataV1 = ({ columns, initialRows }) => {
    const [rows, setRows] = useState(initialRows);

    console.log('CustDxTreeDataV1', columns, initialRows);


    // Toggle IF checkbox and dynamically add/remove children
    const handleIfToggle = (row) => {
        const updatedRows = [...rows];
        const updateRow = (list) => {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === row.id) {
                    const checked = !list[i].if;
                    list[i].if = checked;

                    if (checked && (!list[i].children || list[i].children.length === 0)) {
                        const baseId = list[i].id * 100;
                        list[i].children = [
                            {
                                ...list[i],
                                id: baseId + 1,
                                rowId: `${list[i].rowId}_TRUE`,
                                branch: 'TRUE',
                                if: false,
                                children: [],
                            },
                            {
                                ...list[i],
                                id: baseId + 2,
                                rowId: `${list[i].rowId}_FALSE`,
                                branch: 'FALSE',
                                if: false,
                                children: [],
                            },
                        ];
                    }

                    if (!checked) {
                        list[i].children = [];
                    }

                    return true;
                }

                if (list[i].children && list[i].children.length) {
                    const found = updateRow(list[i].children);
                    if (found) return true;
                }
            }
            return false;
        };

        updateRow(updatedRows);
        setRows(updatedRows);
    };

    // Custom cell renderer
    const tableBodyCell = (props) => {
        const { column, row } = props;

        if (column.name === 'if') {
            return (
                <Table.Cell {...props}>
                    <input
                        type="checkbox"
                        checked={!!row.if}
                        onChange={() => handleIfToggle(row)}
                    />
                </Table.Cell>
            );
        }

        return (
            <Table.Cell {...props}>
                {props.value || ''}
            </Table.Cell>
        );
    };

    const treeColumn = columns[0]?.name || 'rowId';

    return (
        <Paper>
            <Grid rows={rows} columns={columns}>
                <TreeDataState />
                <CustomTreeData getChildRows={getChildRows} />
                <SearchState />
                <FilteringState />
                <SortingState />
                <VirtualTable cellComponent={tableBodyCell} />
                <TableHeaderRow showSortingControls />
                <TableFilterRow />
                <TableTreeColumn for={treeColumn} />
                <Toolbar />
                <SearchPanel />
            </Grid>
        </Paper>
    );
};

export default CustDxTreeDataV1;
