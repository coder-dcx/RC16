// Sample data for NestedIfGridV2 component testing

// 1. Empty data - will use default empty row
export const emptyData = {
    initialRows: [],
    paramIdOptions: [],
    uomOptions: []
};

// 2. Simple data with 2 rows
export const simpleData = {
    initialRows: [
        {
            id: 'row_1',
            parentId: null,
            isTrueBranch: null,
            paramId: '000001',
            paramDesc: 'Engine Power Parameter',
            moduleDesc: 'Engine Module',
            uom: 'HP',
            operation: '*',
            standardMH: 15,
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
            paramDesc: 'Weight Parameter',
            moduleDesc: 'Chassis Module',
            uom: 'KG',
            operation: '+',
            standardMH: 8,
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
    ],
    paramIdOptions: [
        { value: '000001', label: '[000001]', description: 'Engine Power Parameter' },
        { value: '000002', label: '[000002]', description: 'Weight Parameter' },
        { value: '000003', label: '[000003]', description: 'Speed Parameter' },
        { value: '000004', label: '[000004]', description: 'Temperature Parameter' }
    ],
    uomOptions: [
        { value: 'HP', label: 'HP' },
        { value: 'KG', label: 'KG' },
        { value: 'KMH', label: 'KMH' },
        { value: 'CEL', label: 'CEL' },
        { value: 'EA', label: 'EA' },
        { value: 'SEC', label: 'SEC' },
        { value: 'MIN', label: 'MIN' },
        { value: 'HRS', label: 'HRS' }
    ]
};

// 3. Complex data with nested IF conditions (pre-built structure)
export const complexData = {
    initialRows: [
        {
            id: 'row_1',
            parentId: null,
            isTrueBranch: null,
            paramId: '000001',
            paramDesc: 'Engine Power Parameter',
            moduleDesc: 'Engine Control Module',
            uom: 'HP',
            operation: '*',
            standardMH: 0,
            ifChecked: true,
            isExpanded: true,
            hasChildren: true,
            leftType: 'PARAM ID',
            leftValue: '000001',
            condition: '>',
            rightType: 'NUMBER',
            rightValue: '100',
            children: {
                trueChild: {
                    id: 'row_1_true',
                    parentId: 'row_1',
                    isTrueBranch: true,
                    paramId: '000002',
                    paramDesc: 'High Power Configuration',
                    moduleDesc: 'Performance Module',
                    uom: 'KW',
                    operation: '*',
                    standardMH: 25,
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
                falseChild: {
                    id: 'row_1_false',
                    parentId: 'row_1',
                    isTrueBranch: false,
                    paramId: '000003',
                    paramDesc: 'Standard Power Configuration',
                    moduleDesc: 'Standard Module',
                    uom: 'KW',
                    operation: '*',
                    standardMH: 15,
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
            }
        }
    ],
    paramIdOptions: [
        { value: '000001', label: '[000001]', description: 'Engine Power Parameter' },
        { value: '000002', label: '[000002]', description: 'High Power Configuration' },
        { value: '000003', label: '[000003]', description: 'Standard Power Configuration' },
        { value: '000004', label: '[000004]', description: 'Speed Parameter' }
    ],
    uomOptions: [
        { value: 'HP', label: 'HP' },
        { value: 'KW', label: 'KW' },
        { value: 'KG', label: 'KG' },
        { value: 'EA', label: 'EA' },
        { value: 'SEC', label: 'SEC' },
        { value: 'MIN', label: 'MIN' },
        { value: 'HRS', label: 'HRS' }
    ]
};

// 4. Usage examples in parent component
export const usageExamples = `
// Example 1: Empty data (will create default empty row)
import { emptyData } from './SampleDataForTesting';
<NestedIfGridV2 
    initialRows={emptyData.initialRows}
    paramIdOptions={emptyData.paramIdOptions}
    uomOptions={emptyData.uomOptions}
    onDataChange={(data) => console.log('Data changed:', data)}
/>

// Example 2: Simple data with 2 rows
import { simpleData } from './SampleDataForTesting';
<NestedIfGridV2 
    initialRows={simpleData.initialRows}
    paramIdOptions={simpleData.paramIdOptions}
    uomOptions={simpleData.uomOptions}
    onDataChange={(data) => console.log('Data changed:', data)}
/>

// Example 3: Complex nested data
import { complexData } from './SampleDataForTesting';
<NestedIfGridV2 
    initialRows={complexData.initialRows}
    paramIdOptions={complexData.paramIdOptions}
    uomOptions={complexData.uomOptions}
    onDataChange={(data) => console.log('Data changed:', data)}
/>
`;