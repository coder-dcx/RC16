import React, { useState, useEffect } from 'react';
import FeaturesV3 from './FeaturesV3';

/**
 * FeaturesV3 Example Component - Combines FeaturesV1 + Dynamic LOOKUP Enhancement
 * 
 * This example demonstrates FeaturesV3 capabilities:
 * 1. None - Shows Param ID, Description, UOM, Operation, Standard MH/UOM, Formula Preview, Comment
 * 2. IF - Shows conditional fields and TRUE branch only
 * 3. IF-ELSE - Shows conditional fields and both TRUE/FALSE branches
 * 4. LOOKUP - Dynamic parameters (3, 4, 5, 6, 7+). Parent has basic fields, all children are LOOKUP parameters
 *    - Supports variable parameter counts based on real-world usage
 *    - Smart formatting: [paramId] for numbers, 'TEXT' for strings, VARIABLE for uppercase, {ml_code} preserved
 *    - Examples: LOOKUP(HP_SEP, SEPARATOR_COST, [15001]) or LOOKUP([15080], PP_PPM_TUBE, [15006], {ml_code}, [15082])
 */
function FeaturesV3Example() {
    // Sample data combining IF/IF-ELSE and LOOKUP features with dynamic parameters
    const customInitialRows = [{
        "id": 1,
        "parentId": null,
        "isTrueBranch": null,
        "branchIndex": null,
        "paramId": "17132",
        "operation": "*",
        "standardMH": "84",
        "conditionType": "None",
        "moduleDesc": "Simple calculation example"
    }, {
        "id": 2,
        "parentId": null,
        "isTrueBranch": null,
        "branchIndex": null,
        "paramId": "1000",
        "operation": "",
        "standardMH": "",
        "conditionType": "IF-ELSE",
        "leftType": "PARAM ID",
        "leftValue": "1000",
        "condition": "=",
        "rightType": "TEXT",
        "rightValue": "OT1.1",
        "moduleDesc": "IF-ELSE conditional example"
    }, {
        "id": 3,
        "parentId": 2,
        "isTrueBranch": true,
        "branchIndex": 0,
        "paramId": "18910",
        "operation": "*",
        "standardMH": "1.39",
        "conditionType": "None",
        "moduleDesc": "TRUE branch result"
    }, {
        "id": 4,
        "parentId": 2,
        "isTrueBranch": false,
        "branchIndex": 0,
        "paramId": "18910",
        "operation": "*",
        "standardMH": "1.05",
        "conditionType": "None",
        "moduleDesc": "FALSE branch result"
    }, {
        "id": 5,
        "parentId": null,
        "isTrueBranch": null,
        "branchIndex": null,
        "paramId": "18920",
        "operation": "*",
        "standardMH": "1",
        "conditionType": "LOOKUP",
        "moduleDesc": "LOOKUP with 3 params - LOOKUP(HP_SEP, SEPARATOR_COST, [15001])"
    }, {
        "id": 6,
        "parentId": 5,
        "isTrueBranch": true,
        "branchIndex": 0,
        "paramId": "HP_SEP",
        "operation": "",
        "standardMH": "",
        "conditionType": "None",
        "moduleDesc": "Param 1: Table/Variable name"
    }, {
        "id": 7,
        "parentId": 5,
        "isTrueBranch": true,
        "branchIndex": 1,
        "paramId": "SEPARATOR_COST",
        "operation": "",
        "standardMH": "",
        "conditionType": "None",
        "moduleDesc": "Param 2: Column name"
    }, {
        "id": 8,
        "parentId": 5,
        "isTrueBranch": true,
        "branchIndex": 2,
        "paramId": "15001",
        "operation": "",
        "standardMH": "",
        "conditionType": "None",
        "moduleDesc": "Param 3: Lookup key"
    }, {
        "id": 10,
        "parentId": null,
        "isTrueBranch": null,
        "branchIndex": null,
        "paramId": "18921",
        "operation": "*",
        "standardMH": "1",
        "conditionType": "LOOKUP",
        "moduleDesc": "LOOKUP with 5 params - LOOKUP([15080], PP_PPM_TUBE, [15006], {ml_code}, [15082])"
    }, {
        "id": 11,
        "parentId": 10,
        "isTrueBranch": true,
        "branchIndex": 0,
        "paramId": "15080",
        "operation": "",
        "standardMH": "",
        "conditionType": "None",
        "moduleDesc": "Param 1"
    }, {
        "id": 12,
        "parentId": 10,
        "isTrueBranch": true,
        "branchIndex": 1,
        "paramId": "PP_PPM_TUBE",
        "operation": "",
        "standardMH": "",
        "conditionType": "None",
        "moduleDesc": "Param 2"
    }, {
        "id": 13,
        "parentId": 10,
        "isTrueBranch": true,
        "branchIndex": 2,
        "paramId": "15006",
        "operation": "",
        "standardMH": "",
        "conditionType": "None",
        "moduleDesc": "Param 3"
    }, {
        "id": 14,
        "parentId": 10,
        "isTrueBranch": true,
        "branchIndex": 3,
        "paramId": "{ml_code}",
        "operation": "",
        "standardMH": "",
        "conditionType": "None",
        "moduleDesc": "Param 4: Special format preserved"
    }, {
        "id": 15,
        "parentId": 10,
        "isTrueBranch": true,
        "branchIndex": 4,
        "paramId": "15082",
        "operation": "",
        "standardMH": "",
        "conditionType": "None",
        "moduleDesc": "Param 5"
    }];

    const customParamIdOptions = [{
        value: '1000',
        label: '[1000]',
        description: '1000 - Testing Description'
    }, {
        value: '15001',
        label: '[15001]',
        description: '15001 - Lookup Key'
    }, {
        value: '15006',
        label: '[15006]',
        description: '15006 - Parameter'
    }, {
        value: '15080',
        label: '[15080]',
        description: '15080 - Parameter'
    }, {
        value: '15082',
        label: '[15082]',
        description: '15082 - Parameter'
    }, {
        value: '17132',
        label: '[17132]',
        description: '17132 - Main Parameter'
    }, {
        value: '18910',
        label: '[18910]',
        description: '18910 - Conditional Parameter'
    }, {
        value: '18920',
        label: '[18920]',
        description: '18920 - LOOKUP Parameter (3 params)'
    }, {
        value: '18921',
        label: '[18921]',
        description: '18921 - LOOKUP Parameter (5 params)'
    }, {
        value: 'HP_SEP',
        label: 'HP_SEP',
        description: 'HP_SEP - Variable Name'
    }, {
        value: 'SEPARATOR_COST',
        label: 'SEPARATOR_COST',
        description: 'SEPARATOR_COST - Column Name'
    }, {
        value: 'PP_PPM_TUBE',
        label: 'PP_PPM_TUBE',
        description: 'PP_PPM_TUBE - Table Name'
    }, {
        value: '{ml_code}',
        label: '{ml_code}',
        description: '{ml_code} - Special Format Variable'
    }];

    const customUomOptions = [{
        value: 'EA',
        label: 'EA'
    }, {
        value: 'SEC',
        label: 'SEC'
    }, {
        value: 'MIN',
        label: 'MIN'
    }];

    // Helper function to transform flat data to nested structure
    const transformFlatToNestedData = (flatData) => {
        console.log('🔄 Transforming flat data to nested structure for FeaturesV3...');
        console.log('📊 Input flat data:', flatData);

        const dataMap = new Map();
        
        flatData.forEach(row => {
            dataMap.set(row.id, {
                ...row,
                paramDesc: row.paramDesc || '',
                uom: row.uom || 'EA',
                conditionType: row.conditionType || 'None',
                moduleDesc: row.moduleDesc || '',
                isExpanded: row.isExpanded !== undefined ? row.isExpanded : (row.conditionType !== 'None'),
                hasChildren: false,
                children: {
                    trueChildren: [],
                    falseChildren: []
                }
            });
        });

        dataMap.forEach(row => {
            if (row.parentId !== null && row.parentId !== undefined) {
                const parent = dataMap.get(row.parentId);
                if (parent) {
                    parent.hasChildren = true;
                    parent.isExpanded = true;
                    
                    if (row.isTrueBranch === true) {
                        parent.children.trueChildren.push(row);
                    } else if (row.isTrueBranch === false) {
                        parent.children.falseChildren.push(row);
                    }
                }
            }
        });

        dataMap.forEach(row => {
            if (row.children.trueChildren.length > 0) {
                row.children.trueChildren.sort((a, b) => (a.branchIndex || 0) - (b.branchIndex || 0));
            }
            if (row.children.falseChildren.length > 0) {
                row.children.falseChildren.sort((a, b) => (a.branchIndex || 0) - (b.branchIndex || 0));
            }
        });

        const rootRows = Array.from(dataMap.values()).filter(row => row.parentId === null || row.parentId === undefined);
        
        console.log('✅ FeaturesV3 transformation complete. Root rows:', rootRows.length);
        console.log('🌳 Nested structure:', rootRows);
        
        return rootRows;
    };

    const [componentData, setComponentData] = useState({
        initialRows: [],
        paramIdOptions: [],
        uomOptions: []
    });
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    // Load sample data for FeaturesV3
    const loadFeaturesV3Data = async () => {
        setLoading(true);
        setSaveStatus('🔄 Loading FeaturesV3 sample data...');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('🚀 ===== LOADING FEATURESV3 DATA =====');
            console.log('🗄️ Custom Flat Data:', customInitialRows);
            console.log('🔢 Total rows from flat data:', customInitialRows.length);
            
            const nestedRows = transformFlatToNestedData(customInitialRows);
            
            console.log('🌳 Transformed to nested structure:', nestedRows);
            
            nestedRows.forEach((rootRow, index) => {
                console.log(`🎯 Root Row ${index + 1} (${rootRow.id}):`);
                console.log(`  - paramId: ${rootRow.paramId}`);
                console.log(`  - conditionType: ${rootRow.conditionType}`);
                console.log(`  - hasChildren: ${rootRow.hasChildren}`);
                console.log(`  - moduleDesc: ${rootRow.moduleDesc}`);
                console.log(`  - trueChildren: ${rootRow.children.trueChildren.length}`);
                console.log(`  - falseChildren: ${rootRow.children.falseChildren.length}`);
            });
            
            setComponentData({
                initialRows: nestedRows,
                paramIdOptions: customParamIdOptions,
                uomOptions: customUomOptions
            });
            
            console.log('✅ FeaturesV3 custom data loaded successfully!');
            setSaveStatus(`✅ Loaded ${customInitialRows.length} rows transformed to ${nestedRows.length} root rows - Ready for FeaturesV3 testing!`);
            
        } catch (error) {
            console.error('❌ Error loading FeaturesV3 data:', error);
            setSaveStatus('❌ Error loading FeaturesV3 data');
        } finally {
            setLoading(false);
        }
    };

    // Save FeaturesV3 component data
    const saveFeaturesV3Data = async (componentRows) => {
        setSaveStatus('💾 Saving FeaturesV3 data...');
        
        try {
            console.log('📤 FeaturesV3 data for save:', componentRows);
            await new Promise(resolve => setTimeout(resolve, 500));
            setSaveStatus('✅ FeaturesV3 data saved successfully with IF/IF-ELSE/LOOKUP support');
        } catch (error) {
            console.error('❌ Error saving FeaturesV3 data:', error);
            setSaveStatus('❌ Error saving FeaturesV3 data');
        }
    };

    useEffect(() => {
        loadFeaturesV3Data();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{ padding: '20px' }}>
            <h2>🎯 FeaturesV3 - Enhanced IF Builder with LOOKUP</h2>
            
            {/* Features Info */}
            <div style={{ 
                padding: '20px', 
                marginBottom: '20px', 
                backgroundColor: '#e8f5e8', 
                border: '2px solid #4caf50',
                borderRadius: '8px'
            }}>
                <h3>🎉 FeaturesV3 = FeaturesV1 + LOOKUP Enhancement</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
                    <div>
                        <h4>🔘 None Condition:</h4>
                        <ul style={{ marginBottom: 0 }}>
                            <li>Param ID, Description</li>
                            <li>UOM, Operation, Standard MH</li>
                            <li>Formula Preview, Comment</li>
                            <li>Simple calculation only</li>
                        </ul>
                    </div>
                    <div>
                        <h4>🔀 IF Condition:</h4>
                        <ul style={{ marginBottom: 0 }}>
                            <li>Left Type, Left Value</li>
                            <li>Condition, Right Type, Right Value</li>
                            <li>Shows only TRUE branch</li>
                            <li>Multiple children supported</li>
                        </ul>
                    </div>
                    <div>
                        <h4>⚡ IF-ELSE Condition:</h4>
                        <ul style={{ marginBottom: 0 }}>
                            <li>Same conditional fields as IF</li>
                            <li>Shows both TRUE and FALSE branches</li>
                            <li>Multiple children in each branch</li>
                            <li>Complete conditional logic</li>
                        </ul>
                    </div>
                    <div>
                        <h4>🔍 LOOKUP Condition (NEW!):</h4>
                        <ul style={{ marginBottom: 0 }}>
                            <li>Parent: Basic fields (like None)</li>
                            <li>Dynamic Parameters (3, 5, 6, 7...)</li>
                            <li>Child 1, 2, 3...: All are LOOKUP params</li>
                            <li>Minimum 3 params required</li>
                            <li>Add more with + button</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Status Display */}
            <div style={{ 
                padding: '15px', 
                marginBottom: '20px', 
                backgroundColor: '#f0f8ff', 
                border: '1px solid #2196f3',
                borderRadius: '4px'
            }}>
                <h4>📊 Status: {saveStatus}</h4>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                        onClick={loadFeaturesV3Data}
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        🔄 Reload FeaturesV3 Data
                    </button>
                </div>
            </div>

            {/* Sample Data Preview */}
            <div style={{ 
                padding: '15px', 
                marginBottom: '20px', 
                backgroundColor: '#e3f2fd', 
                border: '1px solid #2196f3',
                borderRadius: '4px'
            }}>
                <h3>📋 FeaturesV3 Sample Data - Dynamic LOOKUP Parameters</h3>
                <p><strong>Test Scenarios:</strong></p>
                <ul>
                    <li><strong>Simple Calc (ID: 1):</strong> None condition with basic calculation</li>
                    <li><strong>IF-ELSE Logic (ID: 2):</strong> Conditional with TRUE/FALSE branches</li>
                    <li><strong>LOOKUP 3 Params (ID: 5):</strong> LOOKUP(HP_SEP, SEPARATOR_COST, [15001])</li>
                    <li><strong>LOOKUP 5 Params (ID: 10):</strong> LOOKUP([15080], PP_PPM_TUBE, [15006], {'{ml_code}'}, [15082])</li>
                </ul>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>✅ Supports 3, 5, 6, 7+ parameters</li>
                    <li>✅ Smart formatting: [brackets] for IDs, quotes for text, raw for variables</li>
                    <li>✅ Preserves special formats like {'{ml_code}'}</li>
                    <li>✅ Minimum 3 parameters enforced</li>
                    <li>✅ Use + button to add more parameters</li>
                </ul>
                <p><strong>Test Instructions:</strong> Try all condition types: None, IF, IF-ELSE, and LOOKUP with different param counts!</p>
            </div>

            {/* The FeaturesV3 Component */}
            <div style={{ border: '2px solid #4caf50', borderRadius: '8px', padding: '10px' }}>
                <FeaturesV3
                    initialRows={componentData.initialRows}
                    paramIdOptions={componentData.paramIdOptions}
                    uomOptions={componentData.uomOptions}
                    onDataChange={saveFeaturesV3Data}
                />
            </div>

            {/* Usage Instructions */}
            <div style={{ 
                padding: '20px', 
                marginTop: '20px', 
                backgroundColor: '#f0f8ff', 
                border: '1px solid #0066cc',
                borderRadius: '4px'
            }}>
                <h3>📖 How to Use FeaturesV3</h3>
                <ol>
                    <li><strong>Choose Condition Type:</strong> None (default) | IF | IF-ELSE | LOOKUP</li>
                    <li><strong>None:</strong> Fill Param ID, UOM, Operation, Standard MH/UOM, Comment</li>
                    <li><strong>IF:</strong> Set conditional fields, then add children to TRUE branch</li>
                    <li><strong>IF-ELSE:</strong> Set conditional fields, then add children to both branches</li>
                    <li><strong>LOOKUP:</strong> Parent row has basic fields. All children are LOOKUP parameters (min 3, max unlimited)</li>
                    <li><strong>Add Children:</strong> Use + button to add more rows (for IF/IF-ELSE/LOOKUP)</li>
                    <li><strong>Save & Validate:</strong> Click "Save Data" to see database format</li>
                </ol>
                
                <h4>🆕 What's in FeaturesV3:</h4>
                <ul>
                    <li>✅ All FeaturesV1 capabilities (None/IF/IF-ELSE with searchable dropdowns)</li>
                    <li>✅ LOOKUP condition with clean parent row (basic fields like None)</li>
                    <li>✅ Dynamic LOOKUP parameters - supports 3, 4, 5, 6, 7, or more parameters</li>
                    <li>✅ Smart parameter formatting: [15001] for IDs, 'TEXT' for strings, VARIABLE for uppercase, {'{ml_code}'} preserved</li>
                    <li>✅ Minimum 3 parameters enforced for valid LOOKUP syntax</li>
                    <li>✅ Sequential ID system for clean database storage</li>
                    <li>✅ Deep copy state management preventing reference issues</li>
                    <li>✅ Comprehensive validation for all condition types</li>
                    <li>✅ Database transformation utilities included</li>
                </ul>
            </div>
        </div>
    );
}

export default FeaturesV3Example;
