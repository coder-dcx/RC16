import React, { useState, useEffect } from 'react';
import FeaturesV1 from './FeaturesV1';
import { 
    prepareEnhancedDataForDatabase
} from './EnhancedDataTransformUtils';

/**
 * FeaturesV1 Example Component - Enhanced with Condition Type Dropdown
 * 
 * This example demonstrates the new FeaturesV1 capabilities:
 * 1. Condition Type dropdown: None, IF, IF-ELSE
 * 2. IF - Shows only TRUE branch
 * 3. IF-ELSE - Shows both TRUE and FALSE branches  
 * 4. None - Simple calculation without branches
 * 5. Database format logging on save
 */
function FeaturesV1Example() {
    // Custom data for testing - Replace this with your actual data
    const customInitialRows = [{
        "id": 1,
        "parentId": null,
        "branchFlag": null,
        "branchIndex": null,
        "paramId": "17132",
        "operation": "*",
        "standardMh": "84"
    }, {
        "id": 2,
        "parentId": null,
        "branchFlag": null,
        "branchIndex": null,
        "paramId": "1000",
        "operation": "",
        "standardMh": "",
        "leftType": "PARAM ID",
        "leftValue": "1000",
        "ifCondition": "=",
        "rightType": "TEXT",
        "rightValue": "OT1.1"
    }, {
        "id": 3,
        "parentId": 2,
        "branchFlag": true,
        "branchIndex": 0,
        "paramId": "18910",
        "operation": "*",
        "standardMh": "1.39"
    }, {
        "id": 5,
        "parentId": 2,
        "branchFlag": true,
        "branchIndex": 1,
        "paramId": "18911",
        "operation": "*",
        "standardMh": "1.54"
    }, {
        "id": 4,
        "parentId": 2,
        "branchFlag": false,
        "branchIndex": 0,
        "paramId": "18910",
        "operation": "*",
        "standardMh": "1.05"
    }, {
        "id": 6,
        "parentId": 2,
        "branchFlag": false,
        "branchIndex": 1,
        "paramId": "18910",
        "operation": "",
        "standardMh": "",
        "leftType": "PARAM ID",
        "leftValue": "18910",
        "ifCondition": ">",
        "rightType": "NUMBER",
        "rightValue": "0"
    }, {
        "id": 7,
        "parentId": 6,
        "branchFlag": true,
        "branchIndex": 0,
        "paramId": "18910",
        "operation": "Number",
        "standardMh": "316"
    }, {
        "id": 8,
        "parentId": 6,
        "branchFlag": false,
        "branchIndex": 0,
        "paramId": "18910",
        "operation": "Number",
        "standardMh": "0"
    }, {
        "id": 9,
        "parentId": 2,
        "branchFlag": false,
        "branchIndex": 2,
        "paramId": "18920",
        "operation": "*",
        "standardMh": "150"
    }, {
        "id": 10,
        "parentId": 2,
        "branchFlag": false,
        "branchIndex": 3,
        "paramId": "18910",
        "operation": "",
        "standardMh": "",
        "leftType": "PARAM ID",
        "leftValue": "18910",
        "ifCondition": ">",
        "rightType": "NUMBER",
        "rightValue": "0"
    }, {
        "id": 11,
        "parentId": 10,
        "branchFlag": true,
        "branchIndex": 0,
        "paramId": "18910",
        "operation": "Number",
        "standardMh": "200"
    }, {
        "id": 12,
        "parentId": 10,
        "branchFlag": false,
        "branchIndex": 0,
        "paramId": "18910",
        "operation": "Number",
        "standardMh": "0"
    }];

    const customParamIdOptions = [{
        value: '1000',
        label: '[1000]',
        description: '1000 - Testing Description'
    }, {
        value: '15371',
        label: '[15371]',
        description: '15371 - Testing Description'
    }, {
        value: '15515',
        label: '[15515]',
        description: '15515 - Testing Description'
    }, {
        value: '15516',
        label: '[15516]',
        description: '15516 - Testing Description'
    }, {
        value: '15517',
        label: '[15517]',
        description: '15517 - Testing Description'
    }, {
        value: '15518',
        label: '[15518]',
        description: '15518 - Testing Description'
    }, {
        value: '15519',
        label: '[15519]',
        description: '15519 - Testing Description'
    }, {
        value: '15520',
        label: '[15520]',
        description: '15520 - Testing Description'
    }, {
        value: '15984',
        label: '[15984]',
        description: '15984 - Testing Description'
    }, {
        value: '17132',
        label: '[17132]',
        description: '17132 - Testing Description'
    }, {
        value: '18910',
        label: '[18910]',
        description: '18910 - Testing Description'
    }, {
        value: '18911',
        label: '[18911]',
        description: '18911 - Testing Description'
    }, {
        value: '18912',
        label: '[18912]',
        description: '18912 - Testing Description'
    }, {
        value: '18913',
        label: '[18913]',
        description: '18913 - Testing Description'
    }, {
        value: '18920',
        label: '[18920]',
        description: '18920 - Testing Description'
    }];

    const customUomOptions = [{
        value: 'EA',
        label: 'EA'
    }];

    // Helper function to transform flat data to nested structure
    const transformFlatToNestedData = (flatData) => {
        console.log('🔄 Transforming flat data to nested structure...');
        console.log('📊 Input flat data:', flatData);

        // Create a map for quick lookup
        const dataMap = new Map();
        
        // First pass: Create all rows with basic structure
        flatData.forEach(row => {
            dataMap.set(row.id, {
                ...row,
                // Set default values for missing fields
                description: row.description || '',
                userComments: row.userComments || '',
                uom: row.uom || 'EA',
                conditionType: row.conditionType || (row.leftValue ? 'IF-ELSE' : 'None'),
                ifChecked: row.ifChecked !== undefined ? row.ifChecked : !!row.leftValue,
                isExpanded: row.isExpanded !== undefined ? row.isExpanded : !!row.leftValue,
                hasChildren: false, // Will be updated in second pass
                // Initialize children structure
                children: {
                    trueChildren: [],
                    falseChildren: []
                }
            });
        });

        // Second pass: Build parent-child relationships
        dataMap.forEach(row => {
            if (row.parentId !== null && row.parentId !== undefined) {
                const parent = dataMap.get(row.parentId);
                if (parent) {
                    parent.hasChildren = true;
                    parent.isExpanded = true;
                    
                    // Add to appropriate branch based on branchFlag
                    if (row.branchFlag === true) {
                        parent.children.trueChildren.push(row);
                    } else if (row.branchFlag === false) {
                        parent.children.falseChildren.push(row);
                    }
                }
            }
        });

        // Sort children by branchIndex
        dataMap.forEach(row => {
            if (row.children.trueChildren.length > 0) {
                row.children.trueChildren.sort((a, b) => (a.branchIndex || 0) - (b.branchIndex || 0));
            }
            if (row.children.falseChildren.length > 0) {
                row.children.falseChildren.sort((a, b) => (a.branchIndex || 0) - (b.branchIndex || 0));
            }
        });

        // Get root rows (no parent)
        const rootRows = Array.from(dataMap.values()).filter(row => row.parentId === null || row.parentId === undefined);
        
        console.log('✅ Transformation complete. Root rows:', rootRows.length);
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

    // Load enhanced sample data with migration to conditionType
    const loadFeaturesV1Data = async () => {
        setLoading(true);
        setSaveStatus('🔄 Loading FeaturesV1 sample data...');
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('🚀 ===== LOADING FEATURESV1 DATA =====');
            console.log('🗄️ Custom Flat Data:', customInitialRows);
            console.log('🔢 Total rows from flat data:', customInitialRows.length);
            
            // Transform flat data to nested structure
            const nestedRows = transformFlatToNestedData(customInitialRows);
            
            console.log('🌳 Transformed to nested structure:', nestedRows);
            
            // DEBUG: Verify nested structure
            nestedRows.forEach((rootRow, index) => {
                console.log(`🎯 Root Row ${index + 1} (${rootRow.id}):`);
                console.log(`  - paramId: ${rootRow.paramId}`);
                console.log(`  - conditionType: ${rootRow.conditionType}`);
                console.log(`  - hasChildren: ${rootRow.hasChildren}`);
                console.log(`  - trueChildren: ${rootRow.children.trueChildren.length}`);
                console.log(`  - falseChildren: ${rootRow.children.falseChildren.length}`);
                
                // Show children details
                if (rootRow.children.trueChildren.length > 0) {
                    console.log(`    TRUE Children:`);
                    rootRow.children.trueChildren.forEach((child, idx) => {
                        console.log(`      ${idx + 1}. ID: ${child.id}, ParamID: ${child.paramId}, Op: ${child.operation}, StandardMH: ${child.standardMh}`);
                    });
                }
                if (rootRow.children.falseChildren.length > 0) {
                    console.log(`    FALSE Children:`);
                    rootRow.children.falseChildren.forEach((child, idx) => {
                        console.log(`      ${idx + 1}. ID: ${child.id}, ParamID: ${child.paramId}, Op: ${child.operation}, StandardMH: ${child.standardMh}`);
                    });
                }
            });
            
            // Set the component data with custom data
            setComponentData({
                initialRows: nestedRows,
                paramIdOptions: customParamIdOptions,
                uomOptions: customUomOptions
            });
            
            console.log('✅ FeaturesV1 custom data loaded successfully!');
            setSaveStatus(`✅ Loaded ${customInitialRows.length} rows transformed to ${nestedRows.length} root rows - Ready for testing!`);
            
        } catch (error) {
            console.error('❌ Error loading FeaturesV1 data:', error);
            setSaveStatus('❌ Error loading FeaturesV1 data');
        } finally {
            setLoading(false);
        }
    };

    // Save FeaturesV1 component data
    const saveFeaturesV1Data = async (componentRows) => {
        setSaveStatus('💾 Saving FeaturesV1 data...');
        
        try {
            // Transform component data to database format
            const dbData = prepareEnhancedDataForDatabase(componentRows);
            
            console.log('📤 FeaturesV1 data prepared for database:', dbData);
            console.log('🔄 Condition Type Analysis:');
            
            const conditionStats = {
                None: dbData.filter(r => r.conditionType === 'None').length,
                IF: dbData.filter(r => r.conditionType === 'IF').length,
                'IF-ELSE': dbData.filter(r => r.conditionType === 'IF-ELSE').length
            };
            
            console.log('📊 Condition Type Distribution:', conditionStats);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setSaveStatus('✅ FeaturesV1 data saved successfully with ifCondition type analysis');
            
        } catch (error) {
            console.error('❌ Error saving FeaturesV1 data:', error);
            setSaveStatus('❌ Error saving FeaturesV1 data');
        }
    };

    // Load data when component mounts
    useEffect(() => {
        loadFeaturesV1Data();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{ padding: '20px' }}>
            <h2>🎯 FeaturesV1 - Enhanced Condition Types Demo</h2>
            
            {/* Enhanced Features Info */}
            <div style={{ 
                padding: '20px', 
                marginBottom: '20px', 
                backgroundColor: '#e8f5e8', 
                border: '2px solid #4caf50',
                borderRadius: '8px'
            }}>
                <h3>🎉 FeaturesV1 Enhancements</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <div>
                        <h4>🔘 None Condition:</h4>
                        <ul style={{ marginBottom: 0 }}>
                            <li>Simple calculation only</li>
                            <li>No conditional branches</li>
                            <li>Like original unchecked state</li>
                        </ul>
                    </div>
                    <div>
                        <h4>🔀 IF Condition:</h4>
                        <ul style={{ marginBottom: 0 }}>
                            <li>Shows only TRUE branch</li>
                            <li>Multiple children in TRUE branch</li>
                            <li>No FALSE branch displayed</li>
                        </ul>
                    </div>
                    <div>
                        <h4>⚡ IF-ELSE Condition:</h4>
                        <ul style={{ marginBottom: 0 }}>
                            <li>Shows both TRUE and FALSE branches</li>
                            <li>Multiple children in each branch</li>
                            <li>Complete conditional logic</li>
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
                        onClick={loadFeaturesV1Data}
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
                        🔄 Reload FeaturesV1 Data
                    </button>
                </div>
            </div>

            {/* Enhanced Data Structure Comparison */}
            <div style={{ 
                padding: '15px', 
                marginBottom: '20px', 
                backgroundColor: '#fff3e0', 
                border: '1px solid #ff9800',
                borderRadius: '4px'
            }}>
                <h3>🔄 Enhanced Data Structure</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <h4>Database Structure:</h4>
                        <pre style={{ fontSize: '12px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
{`{
  "id": 2,
  "parentId": 1,
  "branchFlag": true,
  "branchIndex": 0,
  "paramId": "000002",
  "conditionType": "IF-ELSE", // NEW FIELD
  "ifChecked": true,          // Legacy support
  "userComments": "..."
}`}
                        </pre>
                    </div>
                    <div>
                        <h4>Component Structure:</h4>
                        <pre style={{ fontSize: '12px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
{`{
  "id": "row_1",
  "conditionType": "IF-ELSE", // NEW FIELD
  "children": {
    "trueChildren": [...],
    "falseChildren": [...] 
  },
  "isExpanded": true,
  "hasChildren": true
}`}
                        </pre>
                    </div>
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
                <h3>📋 Sample Data Preview</h3>
                <p><strong>Test Scenarios:</strong></p>
                <ul>
                    <li><strong>Engine Speed:</strong> IF-ELSE ifCondition with multiple TRUE/FALSE children</li>
                    <li><strong>Temperature:</strong> Nested IF-ELSE with deep branching</li>
                    <li><strong>Pressure:</strong> Complex IF-ELSE with 4 TRUE + 3 FALSE children</li>
                    <li><strong>Simple Calc:</strong> None ifCondition (no branches)</li>
                </ul>
                <p><strong>Test Instructions:</strong> Change ifCondition types in dropdown and see how branches appear/disappear!</p>
            </div>

            {/* The FeaturesV1 Component */}
            <div style={{ border: '2px solid #4caf50', borderRadius: '8px', padding: '10px' }}>
                <FeaturesV1
                    initialRows={componentData.initialRows}
                    paramIdOptions={componentData.paramIdOptions}
                    uomOptions={componentData.uomOptions}
                    onDataChange={saveFeaturesV1Data}
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
                <h3>📖 How to Use FeaturesV1</h3>
                <ol>
                    <li><strong>Select Condition Type:</strong> Use dropdown to choose None, IF, or IF-ELSE</li>
                    <li><strong>None:</strong> Simple calculation without any branches</li>
                    <li><strong>IF:</strong> Shows only TRUE branch with multiple children support</li>
                    <li><strong>IF-ELSE:</strong> Shows both TRUE and FALSE branches</li>
                    <li><strong>Add Children:</strong> Click + button in branch sections to add multiple rows</li>
                    <li><strong>Nested Conditions:</strong> Set ifCondition types on child rows for deep nesting</li>
                    <li><strong>Save & Validate:</strong> Click "Save Data" to see database format with conditionType analysis</li>
                </ol>
            </div>
        </div>
    );
}

export default FeaturesV1Example;