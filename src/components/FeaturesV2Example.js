import React, { useState, useEffect } from 'react';
import FeaturesV2 from './FeaturesV2';

/**
 * FeaturesV2 Example Component - Enhanced with LOOKUP and improved field organization
 * 
 * This example demonstrates the new FeaturesV2 capabilities:
 * 1. Condition Type dropdown moved before Param ID: None, IF, IF-ELSE, LOOKUP
 * 2. None - Shows Param ID, Description, UOM, Operation, Standard MH/UOM, Formula Preview, Comment
 * 3. IF - Shows conditional fields and TRUE branch only
 * 4. IF-ELSE - Shows conditional fields and both TRUE/FALSE branches
 * 5. LOOKUP - Shows three parameter fields for Excel-like LOOKUP function
 */
function FeaturesV2Example() {
    // Custom data for testing - Replace this with your actual data
    const customInitialRows = [{
        "id": 1,
        "parentId": null,
        "isTrueBranch": null,
        "branchIndex": null,
        "paramId": "17132",
        "operation": "*",
        "standardMH": "84",
        "conditionType": "None",
        "comment": "Simple calculation example"
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
        "comment": "Conditional logic example"
    }, {
        "id": 3,
        "parentId": 2,
        "isTrueBranch": true,
        "branchIndex": 0,
        "paramId": "18910",
        "operation": "*",
        "standardMH": "1.39",
        "conditionType": "None",
        "comment": "TRUE branch result"
    }, {
        "id": 4,
        "parentId": 2,
        "isTrueBranch": false,
        "branchIndex": 0,
        "paramId": "18910",
        "operation": "*",
        "standardMH": "1.05",
        "conditionType": "None",
        "comment": "FALSE branch result"
    }, {
        "id": 5,
        "parentId": null,
        "isTrueBranch": null,
        "branchIndex": null,
        "paramId": "18920",
        "operation": "*",
        "standardMH": "1",
        "conditionType": "LOOKUP",
        "comment": "LOOKUP parent with basic fields"
    }, {
        "id": 6,
        "parentId": 5,
        "isTrueBranch": true,
        "branchIndex": 0,
        "paramId": "15371",
        "operation": "*",
        "standardMH": "1",
        "conditionType": "None",
        "comment": "LOOKUP Array Parameter"
    }, {
        "id": 7,
        "parentId": 5,
        "isTrueBranch": true,
        "branchIndex": 1,
        "paramId": "15515",
        "operation": "*",
        "standardMH": "1",
        "conditionType": "None",
        "comment": "LOOKUP Index Parameter"
    }, {
        "id": 8,
        "parentId": 5,
        "isTrueBranch": true,
        "branchIndex": 2,
        "paramId": "15516",
        "operation": "*",
        "standardMH": "1",
        "conditionType": "None",
        "comment": "LOOKUP Value Parameter"
    }, {
        "id": 9,
        "parentId": 5,
        "isTrueBranch": true,
        "branchIndex": 3,
        "paramId": "17132",
        "operation": "*",
        "standardMH": "2.5",
        "conditionType": "None",
        "comment": "Additional multiplier for LOOKUP result"
    }];

    const customParamIdOptions = [{
        value: '1000',
        label: '[1000]',
        description: '1000 - Testing Description'
    }, {
        value: '15371',
        label: '[15371]',
        description: '15371 - Array Parameter'
    }, {
        value: '15515',
        label: '[15515]',
        description: '15515 - Index Parameter'
    }, {
        value: '15516',
        label: '[15516]',
        description: '15516 - Value Parameter'
    }, {
        value: '15517',
        label: '[15517]',
        description: '15517 - Testing Description'
    }, {
        value: '15518',
        label: '[15518]',
        description: '15518 - Testing Description'
    }, {
        value: '15984',
        label: '[15984]',
        description: '15984 - Testing Description'
    }, {
        value: '17132',
        label: '[17132]',
        description: '17132 - Main Parameter'
    }, {
        value: '18910',
        label: '[18910]',
        description: '18910 - Conditional Parameter'
    }, {
        value: '18911',
        label: '[18911]',
        description: '18911 - Testing Description'
    }, {
        value: '18920',
        label: '[18920]',
        description: '18920 - LOOKUP Parameter'
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
        console.log('🔄 Transforming flat data to nested structure for FeaturesV2...');
        console.log('📊 Input flat data:', flatData);

        // Create a map for quick lookup
        const dataMap = new Map();
        
        // First pass: Create all rows with basic structure
        flatData.forEach(row => {
            dataMap.set(row.id, {
                ...row,
                // Set default values for missing fields
                paramDesc: row.paramDesc || '',
                uom: row.uom || 'EA',
                conditionType: row.conditionType || 'None',
                comment: row.comment || '',
                isExpanded: row.isExpanded !== undefined ? row.isExpanded : (row.conditionType !== 'None'),
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
                    
                    // Add to appropriate branch based on isTrueBranch
                    if (row.isTrueBranch === true) {
                        parent.children.trueChildren.push(row);
                    } else if (row.isTrueBranch === false) {
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
        
        console.log('✅ FeaturesV2 transformation complete. Root rows:', rootRows.length);
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

    // Load sample data for FeaturesV2
    const loadFeaturesV2Data = async () => {
        setLoading(true);
        setSaveStatus('🔄 Loading FeaturesV2 sample data...');
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('🚀 ===== LOADING FEATURESV2 DATA =====');
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
                console.log(`  - comment: ${rootRow.comment}`);
                
                if (rootRow.conditionType === 'LOOKUP') {
                    console.log(`  - LOOKUP: array=${rootRow.lookupArray}, index=${rootRow.lookupIndex}, value=${rootRow.lookupValue}`);
                }
                
                console.log(`  - trueChildren: ${rootRow.children.trueChildren.length}`);
                console.log(`  - falseChildren: ${rootRow.children.falseChildren.length}`);
                
                // Show children details
                if (rootRow.children.trueChildren.length > 0) {
                    console.log(`    TRUE Children:`);
                    rootRow.children.trueChildren.forEach((child, idx) => {
                        console.log(`      ${idx + 1}. ID: ${child.id}, ParamID: ${child.paramId}, Comment: ${child.comment}`);
                    });
                }
                if (rootRow.children.falseChildren.length > 0) {
                    console.log(`    FALSE Children:`);
                    rootRow.children.falseChildren.forEach((child, idx) => {
                        console.log(`      ${idx + 1}. ID: ${child.id}, ParamID: ${child.paramId}, Comment: ${child.comment}`);
                    });
                }
            });
            
            // Set the component data with custom data
            setComponentData({
                initialRows: nestedRows,
                paramIdOptions: customParamIdOptions,
                uomOptions: customUomOptions
            });
            
            console.log('✅ FeaturesV2 custom data loaded successfully!');
            setSaveStatus(`✅ Loaded ${customInitialRows.length} rows transformed to ${nestedRows.length} root rows - Ready for FeaturesV2 testing!`);
            
        } catch (error) {
            console.error('❌ Error loading FeaturesV2 data:', error);
            setSaveStatus('❌ Error loading FeaturesV2 data');
        } finally {
            setLoading(false);
        }
    };

    // Save FeaturesV2 component data
    const saveFeaturesV2Data = async (componentRows) => {
        setSaveStatus('💾 Saving FeaturesV2 data...');
        
        try {
            console.log('📤 FeaturesV2 data for save:', componentRows);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setSaveStatus('✅ FeaturesV2 data saved successfully with LOOKUP support');
            
        } catch (error) {
            console.error('❌ Error saving FeaturesV2 data:', error);
            setSaveStatus('❌ Error saving FeaturesV2 data');
        }
    };

    // Load data when component mounts
    useEffect(() => {
        loadFeaturesV2Data();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{ padding: '20px' }}>
            <h2>🎯 FeaturesV2 - Enhanced Formula Builder with LOOKUP</h2>
            
            {/* Enhanced Features Info */}
            <div style={{ 
                padding: '20px', 
                marginBottom: '20px', 
                backgroundColor: '#e8f5e8', 
                border: '2px solid #4caf50',
                borderRadius: '8px'
            }}>
                <h3>🎉 FeaturesV2 Enhancements</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
                    <div>
                        <h4>🔘 None Condition (Default):</h4>
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
                            <li>Parent row: Basic fields (like None)</li>
                            <li>Child 1: Array Param for LOOKUP</li>
                            <li>Child 2: Index Param for LOOKUP</li>
                            <li>Child 3: Value Param for LOOKUP</li>
                            <li>Child 4+: Optional multipliers</li>
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
                        onClick={loadFeaturesV2Data}
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
                        🔄 Reload FeaturesV2 Data
                    </button>
                </div>
            </div>

            {/* Field Organization Info */}
            <div style={{ 
                padding: '15px', 
                marginBottom: '20px', 
                backgroundColor: '#fff3e0', 
                border: '1px solid #ff9800',
                borderRadius: '4px'
            }}>
                <h3>🔄 New Field Organization</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <h4>Field Order Changes:</h4>
                        <ol style={{ fontSize: '14px' }}>
                            <li><strong>Condition</strong> - Now appears FIRST</li>
                            <li><strong>Param ID</strong> - Moved after Condition</li>
                            <li>Dynamic fields based on Condition Type</li>
                            <li><strong>Comment</strong> - Replaces old moduleDesc</li>
                        </ol>
                    </div>
                    <div>
                        <h4>Database Column Mapping:</h4>
                        <ul style={{ fontSize: '14px' }}>
                            <li><code>conditionType</code> - None/IF/IF-ELSE/LOOKUP</li>
                            <li><code>comment</code> - User comment field</li>
                            <li><code>lookupArray, lookupIndex, lookupValue</code> - LOOKUP params</li>
                            <li>All existing fields maintained</li>
                        </ul>
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
                <h3>📋 FeaturesV2 Sample Data</h3>
                <p><strong>Test Scenarios:</strong></p>
                <ul>
                    <li><strong>Simple Calc (ID: 1):</strong> None condition with basic calculation</li>
                    <li><strong>IF-ELSE Logic (ID: 2):</strong> Conditional with TRUE/FALSE branches</li>
                    <li><strong>LOOKUP Function (ID: 5):</strong> Parent row with basic fields, children define LOOKUP params</li>
                    <li><strong>LOOKUP Children (ID: 6-8):</strong> First 3 children are Array, Index, Value parameters</li>
                    <li><strong>LOOKUP Multiplier (ID: 9):</strong> 4th+ children multiply the LOOKUP result</li>
                </ul>
                <p><strong>Test Instructions:</strong> LOOKUP parent stays clean like None condition. First 3 children configure LOOKUP parameters. Additional children multiply the result!</p>
            </div>

            {/* The FeaturesV2 Component */}
            <div style={{ border: '2px solid #4caf50', borderRadius: '8px', padding: '10px' }}>
                <FeaturesV2
                    initialRows={componentData.initialRows}
                    paramIdOptions={componentData.paramIdOptions}
                    uomOptions={componentData.uomOptions}
                    onDataChange={saveFeaturesV2Data}
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
                <h3>📖 How to Use FeaturesV2</h3>
                <ol>
                    <li><strong>Choose Condition Type FIRST:</strong> None (default) | IF | IF-ELSE | LOOKUP</li>
                    <li><strong>None:</strong> Fill Param ID, UOM, Operation, Standard MH/UOM, Comment</li>
                    <li><strong>IF:</strong> Set conditional fields, then add children to TRUE branch</li>
                    <li><strong>IF-ELSE:</strong> Set conditional fields, then add children to both branches</li>
                    <li><strong>LOOKUP:</strong> Parent row has basic fields. First 3 children are Array/Index/Value params</li>
                    <li><strong>Add Children:</strong> Use + button to add more multipliers after 3 LOOKUP params</li>
                    <li><strong>Save & Validate:</strong> Click "Save Data" to see database format</li>
                </ol>
                
                <h4>🆕 What's New in V2:</h4>
                <ul>
                    <li>✨ Condition field moved to front for better UX</li>
                    <li>🔍 LOOKUP function: Parent row keeps basic fields clean</li>
                    <li>🌳 LOOKUP uses 3 children for Array/Index/Value params</li>
                    <li>📊 LOOKUP 4th+ children multiply the result</li>
                    <li>💬 Comment field replaces moduleDesc</li>
                    <li>🗄️ Enhanced database column mapping</li>
                    <li>🎯 Default "None" condition for new rows</li>
                </ul>
            </div>
        </div>
    );
}

export default FeaturesV2Example;