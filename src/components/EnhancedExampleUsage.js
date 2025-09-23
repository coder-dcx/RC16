import React, { useState, useEffect } from 'react';
import IFAndLookup from './IFAndLookup';
import { 
    prepareEnhancedDataForComponent, 
    prepareEnhancedDataForDatabase,
    enhancedSampleDatabaseData,
    enhancedSampleParameterOptions,
    enhancedSampleUomOptions 
} from './EnhancedDataTransformUtils';

/**
 * Enhanced Example Component: Multiple Children Support
 * 
 * This example demonstrates the new capabilities:
 * 1. Multiple rows under TRUE branches
 * 2. Multiple rows under FALSE branches  
 * 3. Nested IF conditions with multiple children at each level
 * 4. Enhanced database integration with branchIndex support
 */
function EnhancedExampleUsage() {
    const [componentData, setComponentData] = useState({
        initialRows: [],
        paramIdOptions: [],
        uomOptions: []
    });
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    // Load enhanced sample data (12 rows with complex nesting)
    const loadEnhancedData = async () => {
        setLoading(true);
        setSaveStatus('Loading enhanced data with multiple children...');
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('� DEBUG: Raw Database Data:', enhancedSampleDatabaseData);
            console.log('🔢 Total enhanced rows from DB:', enhancedSampleDatabaseData.length);
            
            // DEBUG: Check parent-child relationships
            const parentChildMap = {};
            enhancedSampleDatabaseData.forEach(row => {
                console.log(`🔍 Row ${row.id}: parentId=${row.parentId}, isTrueBranch=${row.isTrueBranch}, branchIndex=${row.branchIndex}, paramId=${row.paramId}`);
                
                if (row.parentId) {
                    const key = `${row.parentId}_${row.isTrueBranch}`;
                    if (!parentChildMap[key]) {
                        parentChildMap[key] = [];
                    }
                    parentChildMap[key].push(row);
                }
            });
            
            console.log('🗂️ Parent-Child mapping:', parentChildMap);
            
            // Transform database data to enhanced component format
            const transformedData = prepareEnhancedDataForComponent(
                enhancedSampleDatabaseData,
                enhancedSampleParameterOptions,
                enhancedSampleUomOptions
            );
            
            console.log('🔄 Transformation result:', transformedData);
            
            // DEBUG: Check each root row's children
            transformedData.initialRows.forEach((rootRow, index) => {
                console.log(`🌳 Root Row ${index + 1} (${rootRow.id}):`);
                console.log(`  - paramId: ${rootRow.paramId}`);
                console.log(`  - hasChildren: ${rootRow.hasChildren}`);
                console.log(`  - isExpanded: ${rootRow.isExpanded}`);
                console.log(`  - ifChecked: ${rootRow.ifChecked}`);
                console.log(`  - trueChildren count: ${rootRow.children.trueChildren.length}`);
                console.log(`  - falseChildren count: ${rootRow.children.falseChildren.length}`);
                
                if (rootRow.children.trueChildren.length > 0) {
                    console.log(`  - TRUE children:`, rootRow.children.trueChildren.map(c => ({ 
                        id: c.id, 
                        paramId: c.paramId, 
                        branchIndex: c.branchIndex 
                    })));
                }
                if (rootRow.children.falseChildren.length > 0) {
                    console.log(`  - FALSE children:`, rootRow.children.falseChildren.map(c => ({ 
                        id: c.id, 
                        paramId: c.paramId, 
                        branchIndex: c.branchIndex 
                    })));
                }
            });
            
            // Set the component data correctly  
            setComponentData({
                initialRows: transformedData.initialRows,
                paramIdOptions: transformedData.paramIdOptions,
                uomOptions: transformedData.uomOptions
            });
            
            console.log('🎯 Final component data set:', {
                rootCount: transformedData.initialRows.length,
                paramOptions: transformedData.paramIdOptions.length,
                uomOptions: transformedData.uomOptions.length
            });
            
            setSaveStatus(`✅ Loaded ${enhancedSampleDatabaseData.length} enhanced rows with ${transformedData.initialRows.length} roots - Children should now be visible!`);
            
        } catch (error) {
            console.error('❌ Error loading enhanced data:', error);
            setSaveStatus('❌ Error loading enhanced data');
        } finally {
            setLoading(false);
        }
    };

    // Save enhanced component data back to database
    const saveEnhancedData = async (componentRows) => {
        setSaveStatus('💾 Saving enhanced data with multiple children...');
        
        try {
            // Transform component data to database format (handles multiple children)
            const dbData = prepareEnhancedDataForDatabase(componentRows);
            
            console.log('📤 Enhanced data prepared for database:', dbData);
            console.log('🏗️ Flattened to', dbData.length, 'database rows with branchIndex');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setSaveStatus('✅ Enhanced data saved successfully with multiple children support');
            
        } catch (error) {
            console.error('❌ Error saving enhanced data:', error);
            setSaveStatus('❌ Error saving enhanced data');
        }
    };

    // Load data when component mounts
    useEffect(() => {
        loadEnhancedData();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>🚀 Enhanced IF & Lookup - Multiple Children Demo</h2>
            
            {/* Enhanced Features Info */}
            <div style={{ 
                padding: '20px', 
                marginBottom: '20px', 
                backgroundColor: '#e8f5e8', 
                border: '2px solid #4caf50',
                borderRadius: '8px'
            }}>
                <h3>🎉 New Enhanced Features Demonstrated</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                        <h4>✨ Multiple Children Support:</h4>
                        <ul style={{ marginBottom: 0 }}>
                            <li>Add unlimited rows under TRUE branches</li>
                            <li>Add unlimited rows under FALSE branches</li>
                            <li>Independent management of each branch</li>
                            <li>Visual branch indicators and counters</li>
                        </ul>
                    </div>
                    <div>
                        <h4>🔧 Enhanced Data Handling:</h4>
                        <ul style={{ marginBottom: 0 }}>
                            <li>branchIndex field for proper ordering</li>
                            <li>Array-based children structure</li>
                            <li>Enhanced database transformation</li>
                            <li>Backward compatibility maintained</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Status Panel */}
            <div style={{ 
                padding: '15px', 
                marginBottom: '20px', 
                backgroundColor: '#f5f5f5', 
                border: '1px solid #ddd',
                borderRadius: '4px'
            }}>
                <h3>Database Status</h3>
                <p><strong>Status:</strong> {saveStatus}</p>
                <p><strong>Root Rows Loaded:</strong> {componentData.initialRows.length}</p>
                <p><strong>Parameters Available:</strong> {componentData.paramIdOptions.length}</p>
                <p><strong>Sample Data Features:</strong> Engine Speed (3 TRUE + 2 FALSE), Temperature (Nested IF with multiple children)</p>
                
                <button 
                    onClick={loadEnhancedData} 
                    disabled={loading}
                    style={{ 
                        padding: '10px 20px', 
                        marginRight: '10px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '🔄 Loading...' : '🔄 Reload Enhanced Data'}
                </button>
                
                <button 
                    onClick={() => console.log('Enhanced component data:', componentData)}
                    style={{ 
                        padding: '10px 20px',
                        backgroundColor: '#ff9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    📋 Show Enhanced Data
                </button>
            </div>

            {/* Enhanced Data Structure Info */}
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
  "branchIndex": 0,    // ← New field
  "paramId": "000002",
  "moduleDesc": "...",
  "ifChecked": false
}`}
                        </pre>
                    </div>
                    <div>
                        <h4>Component Structure:</h4>
                        <pre style={{ fontSize: '12px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
{`{
  "id": "row_1",
  "children": {
    "trueChildren": [...],  // ← Array
    "falseChildren": [...] // ← Array  
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
                <p><strong>Row 1:</strong> Engine Speed IF condition with <span style={{ color: '#4caf50', fontWeight: 'bold' }}>3 TRUE children</span> and <span style={{ color: '#f44336', fontWeight: 'bold' }}>2 FALSE children</span></p>
                <p><strong>Row 2:</strong> Temperature IF condition with nested IF that also has multiple children at deep levels</p>
                <p><strong>Total Complexity:</strong> 12 database rows reconstructed into proper tree with multiple branches</p>
            </div>

            {/* The Enhanced Component */}
            {componentData.initialRows.length > 0 ? (
                <div style={{ border: '2px solid #4caf50', borderRadius: '8px', padding: '10px' }}>
                    <IFAndLookup
                        initialRows={componentData.initialRows}
                        paramIdOptions={componentData.paramIdOptions}
                        uomOptions={componentData.uomOptions}
                        onDataChange={saveEnhancedData}
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
                    {loading ? '🔄 Loading enhanced data...' : '📭 No enhanced data available. Click "Reload Enhanced Data" to load sample data.'}
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
                <h3>📖 How to Use Enhanced Features</h3>
                <ol>
                    <li><strong>Enable IF Condition:</strong> Check the "IF" checkbox on any row</li>
                    <li><strong>Expand Branches:</strong> Click the arrow to see TRUE and FALSE branches</li>
                    <li><strong>Add Multiple Rows:</strong> Click the + button in any branch section</li>
                    <li><strong>Remove Rows:</strong> Click the - button next to any row (minimum 1 per branch)</li>
                    <li><strong>Nested IFs:</strong> Enable IF on child rows for deeper nesting</li>
                    <li><strong>Save & Validate:</strong> All validation works with multiple children</li>
                </ol>
            </div>
        </div>
    );
}

export default EnhancedExampleUsage;