import React, { useState, useEffect } from 'react';
import FeaturesV1 from './FeaturesV1';
import { 
    enhancedSampleDatabaseData, 
    enhancedSampleParameterOptions, 
    enhancedSampleUomOptions,
    prepareEnhancedDataForComponent,
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
            console.log('🗄️ Raw Database Data:', enhancedSampleDatabaseData);
            console.log('🔢 Total rows from DB:', enhancedSampleDatabaseData.length);
            
            // Migrate sample data to include conditionType field
            const migratedData = enhancedSampleDatabaseData.map(row => ({
                ...row,
                // Convert ifChecked to conditionType for demo
                conditionType: row.ifChecked ? 'IF-ELSE' : 'None'
            }));
            
            console.log('🔄 Migrated data with conditionType:', migratedData);
            
            // Transform using utility function
            const transformedData = prepareEnhancedDataForComponent(
                migratedData,
                enhancedSampleParameterOptions,
                enhancedSampleUomOptions
            );
            
            console.log('🌳 Transformation result:', transformedData);
            
            // DEBUG: Verify condition types
            transformedData.initialRows.forEach((rootRow, index) => {
                console.log(`🎯 Root Row ${index + 1} (${rootRow.id}):`);
                console.log(`  - paramId: ${rootRow.paramId}`);
                console.log(`  - conditionType: ${rootRow.conditionType}`);
                console.log(`  - ifChecked: ${rootRow.ifChecked} (legacy)`);
                console.log(`  - hasChildren: ${rootRow.hasChildren}`);
                console.log(`  - trueChildren: ${rootRow.children.trueChildren.length}`);
                console.log(`  - falseChildren: ${rootRow.children.falseChildren.length}`);
            });
            
            // Set the component data
            setComponentData({
                initialRows: transformedData.initialRows,
                paramIdOptions: transformedData.paramIdOptions,
                uomOptions: transformedData.uomOptions
            });
            
            console.log('✅ FeaturesV1 data loaded successfully!');
            setSaveStatus(`✅ Loaded ${migratedData.length} rows with conditionType support - Ready for testing!`);
            
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
            setSaveStatus('✅ FeaturesV1 data saved successfully with condition type analysis');
            
        } catch (error) {
            console.error('❌ Error saving FeaturesV1 data:', error);
            setSaveStatus('❌ Error saving FeaturesV1 data');
        }
    };

    // Load data when component mounts
    useEffect(() => {
        loadFeaturesV1Data();
    }, []);

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
  "isTrueBranch": true,
  "branchIndex": 0,
  "paramId": "000002",
  "conditionType": "IF-ELSE", // NEW FIELD
  "ifChecked": true,          // Legacy support
  "moduleDesc": "..."
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
                    <li><strong>Engine Speed:</strong> IF-ELSE condition with multiple TRUE/FALSE children</li>
                    <li><strong>Temperature:</strong> Nested IF-ELSE with deep branching</li>
                    <li><strong>Pressure:</strong> Complex IF-ELSE with 4 TRUE + 3 FALSE children</li>
                    <li><strong>Simple Calc:</strong> None condition (no branches)</li>
                </ul>
                <p><strong>Test Instructions:</strong> Change condition types in dropdown and see how branches appear/disappear!</p>
            </div>

            {/* The FeaturesV1 Component */}
            {componentData.initialRows.length > 0 ? (
                <div style={{ border: '2px solid #4caf50', borderRadius: '8px', padding: '10px' }}>
                    <FeaturesV1
                        initialRows={componentData.initialRows}
                        paramIdOptions={componentData.paramIdOptions}
                        uomOptions={componentData.uomOptions}
                        onDataChange={saveFeaturesV1Data}
                    />
                </div>
            ) : (
                <div style={{ 
                    padding: '40px', 
                    textAlign: 'center', 
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px'
                }}>
                    {loading ? '🔄 Loading FeaturesV1 data...' : '📭 No data available. Click "Reload FeaturesV1 Data" to load sample data.'}
                </div>
            )}

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
                    <li><strong>Nested Conditions:</strong> Set condition types on child rows for deep nesting</li>
                    <li><strong>Save & Validate:</strong> Click "Save Data" to see database format with conditionType analysis</li>
                </ol>
            </div>
        </div>
    );
}

export default FeaturesV1Example;