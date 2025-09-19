import React, { useState, useEffect } from 'react';
import NestedIfGridV2 from './NestedIfGridV2';
import { 
    prepareDataForComponent, 
    prepareDataForDatabase
} from './DataTransformUtils';

/**
 * Example Component: Database Integration with NestedIfGridV2
 * 
 * This example shows how to:
 * 1. Load data from database (40+ rows with mixed parent-child relationships)
 * 2. Handle numeric IDs from database
 * 3. Exclude UI-only fields when saving to database
 * 4. Reconstruct tree structure from flat database data
 */
function DatabaseExampleUsage() {
    const [componentData, setComponentData] = useState({
        initialRows: [],
        paramIdOptions: [],
        uomOptions: []
    });
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    // Simulate loading 40 rows from database
    const loadFromDatabase = async () => {
        setLoading(true);
        setSaveStatus('Loading data from database...');
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate database response with 40+ rows
            // In real implementation, this would be: const response = await fetch('/api/formula-rows');
            const simulatedDatabaseResponse = generateLargeDatabaseSample();
            
            console.log('📊 Raw Database Data:', simulatedDatabaseResponse);
            console.log('🔢 Total rows from DB:', simulatedDatabaseResponse.rows.length);
            
            // Transform database data to component format
            const transformedData = prepareDataForComponent(
                simulatedDatabaseResponse.rows, 
                simulatedDatabaseResponse.paramOptions, 
                simulatedDatabaseResponse.uomOptions
            );
            
            setComponentData(transformedData);
            setSaveStatus(`✅ Loaded ${simulatedDatabaseResponse.rows.length} rows successfully`);
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            setSaveStatus('❌ Error loading data from database');
        } finally {
            setLoading(false);
        }
    };

    // Save component data back to database
    const saveToDatabase = async (componentRows) => {
        setSaveStatus('💾 Saving to database...');
        
        try {
            // Transform component data to database format (removes UI-only fields)
            const dbData = prepareDataForDatabase(componentRows);
            
            console.log('📤 Data prepared for database:', dbData);
            console.log('🏗️ Flattened to', dbData.length, 'database rows');
            
            // Simulate API call
            // In real implementation: 
            // await fetch('/api/formula-rows', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(dbData)
            // });
            
            await new Promise(resolve => setTimeout(resolve, 500));
            setSaveStatus('✅ Data saved to database successfully');
            
        } catch (error) {
            console.error('❌ Error saving data:', error);
            setSaveStatus('❌ Error saving data to database');
        }
    };

    // Load data when component mounts
    useEffect(() => {
        loadFromDatabase();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>🗄️ Database Integration Example</h2>
            
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
                <p><strong>Rows Loaded:</strong> {componentData.initialRows.length}</p>
                <p><strong>Parameters Available:</strong> {componentData.paramIdOptions.length}</p>
                
                <button 
                    onClick={loadFromDatabase} 
                    disabled={loading}
                    style={{ 
                        padding: '10px 20px', 
                        marginRight: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '🔄 Loading...' : '🔄 Reload from Database'}
                </button>
                
                <button 
                    onClick={() => console.log('Current component data:', componentData)}
                    style={{ 
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    📋 Show Component Data
                </button>
            </div>

            {/* Data Transformation Info */}
            <div style={{ 
                padding: '15px', 
                marginBottom: '20px', 
                backgroundColor: '#e7f3ff', 
                border: '1px solid #b3d9ff',
                borderRadius: '4px'
            }}>
                <h3>🔄 Data Transformation Details</h3>
                <ul style={{ marginBottom: 0 }}>
                    <li><strong>ID Conversion:</strong> Database numeric IDs (1, 2, 3...) → Component string IDs ("row_1", "row_2", "row_3"...)</li>
                    <li><strong>UI Fields:</strong> isExpanded, hasChildren automatically derived from ifChecked and children</li>
                    <li><strong>Tree Structure:</strong> Flat database rows reconstructed into nested parent-child relationships</li>
                    <li><strong>Saving:</strong> Only database fields saved, UI-only fields excluded</li>
                </ul>
            </div>

            {/* The Actual Component */}
            {componentData.initialRows.length > 0 ? (
                <NestedIfGridV2
                    initialRows={componentData.initialRows}
                    paramIdOptions={componentData.paramIdOptions}
                    uomOptions={componentData.uomOptions}
                    onDataChange={saveToDatabase}
                />
            ) : (
                <div style={{ 
                    padding: '40px', 
                    textAlign: 'center', 
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px'
                }}>
                    {loading ? '🔄 Loading data...' : '📭 No data available. Click "Reload from Database" to load sample data.'}
                </div>
            )}
        </div>
    );
}

// Generate a large sample database with 40+ rows including nested structures
function generateLargeDatabaseSample() {
    const rows = [];
    const paramOptions = [];
    const uomOptions = [
        { value: 'EA', label: 'EA' },
        { value: 'SEC', label: 'SEC' },
        { value: 'MIN', label: 'MIN' },
        { value: 'HRS', label: 'HRS' },
        { value: 'KG', label: 'KG' },
        { value: 'M', label: 'M' },
        { value: 'RPM', label: 'RPM' }
    ];

    let idCounter = 1;

    // Generate parameter options
    for (let i = 1; i <= 20; i++) {
        paramOptions.push({
            value: String(i).padStart(6, '0'),
            label: `[${String(i).padStart(6, '0')}]`,
            description: `Parameter ${i} Description`
        });
    }

    // Generate 10 root-level rows with varying complexity
    for (let rootIndex = 1; rootIndex <= 10; rootIndex++) {
        const hasIfCondition = rootIndex % 3 === 0; // Every 3rd row has IF condition
        
        // Root row
        const rootRow = {
            id: idCounter++,
            parentId: null,
            isTrueBranch: null,
            paramId: String(rootIndex).padStart(6, '0'),
            paramDesc: `Root Parameter ${rootIndex} Description`,
            moduleDesc: `Module ${rootIndex} - Main Configuration`,
            uom: uomOptions[rootIndex % uomOptions.length].value,
            operation: ['+', '-', '*', '/'][rootIndex % 4],
            standardMH: hasIfCondition ? 0 : rootIndex * 5,
            ifChecked: hasIfCondition,
            leftType: hasIfCondition ? 'PARAM ID' : 'PARAM ID',
            leftValue: hasIfCondition ? String(rootIndex).padStart(6, '0') : '',
            condition: hasIfCondition ? ['>', '<', '==', '<>'][rootIndex % 4] : '==',
            rightType: hasIfCondition ? 'NUMBER' : 'PARAM ID',
            rightValue: hasIfCondition ? String(rootIndex * 100) : ''
        };
        rows.push(rootRow);

        // If this root has IF condition, add TRUE and FALSE children
        if (hasIfCondition) {
            // TRUE child
            const trueChild = {
                id: idCounter++,
                parentId: rootRow.id,
                isTrueBranch: true,
                paramId: String(rootIndex * 10 + 1).padStart(6, '0'),
                paramDesc: `True Branch Parameter ${rootIndex} Description`,
                moduleDesc: `Module ${rootIndex} - True Branch`,
                uom: uomOptions[(rootIndex + 1) % uomOptions.length].value,
                operation: '*',
                standardMH: rootIndex * 10,
                ifChecked: false,
                leftType: 'PARAM ID',
                leftValue: '',
                condition: '==',
                rightType: 'NUMBER',
                rightValue: ''
            };
            rows.push(trueChild);

            // FALSE child
            const falseChild = {
                id: idCounter++,
                parentId: rootRow.id,
                isTrueBranch: false,
                paramId: String(rootIndex * 10 + 2).padStart(6, '0'),
                paramDesc: `False Branch Parameter ${rootIndex} Description`,
                moduleDesc: `Module ${rootIndex} - False Branch`,
                uom: uomOptions[(rootIndex + 2) % uomOptions.length].value,
                operation: '+',
                standardMH: rootIndex * 5,
                ifChecked: false,
                leftType: 'PARAM ID',
                leftValue: '',
                condition: '==',
                rightType: 'NUMBER',
                rightValue: ''
            };
            rows.push(falseChild);

            // Add nested IF condition to some TRUE children (deeper nesting)
            if (rootIndex % 6 === 0) {
                // Convert TRUE child to have nested IF
                trueChild.ifChecked = true;
                trueChild.standardMH = 0;
                trueChild.leftType = 'PARAM ID';
                trueChild.leftValue = trueChild.paramId;
                trueChild.condition = '>';
                trueChild.rightType = 'NUMBER';
                trueChild.rightValue = '50';

                // TRUE-TRUE grandchild
                const trueTrueGrandchild = {
                    id: idCounter++,
                    parentId: trueChild.id,
                    isTrueBranch: true,
                    paramId: String(rootIndex * 100 + 1).padStart(6, '0'),
                    paramDesc: `Deep True Parameter ${rootIndex}`,
                    moduleDesc: `Module ${rootIndex} - Deep True`,
                    uom: 'SEC',
                    operation: '*',
                    standardMH: 30,
                    ifChecked: false,
                    leftType: 'PARAM ID',
                    leftValue: '',
                    condition: '==',
                    rightType: 'NUMBER',
                    rightValue: ''
                };
                rows.push(trueTrueGrandchild);

                // TRUE-FALSE grandchild
                const trueFalseGrandchild = {
                    id: idCounter++,
                    parentId: trueChild.id,
                    isTrueBranch: false,
                    paramId: String(rootIndex * 100 + 2).padStart(6, '0'),
                    paramDesc: `Deep False Parameter ${rootIndex}`,
                    moduleDesc: `Module ${rootIndex} - Deep False`,
                    uom: 'MIN',
                    operation: '+',
                    standardMH: 20,
                    ifChecked: false,
                    leftType: 'PARAM ID',
                    leftValue: '',
                    condition: '==',
                    rightType: 'NUMBER',
                    rightValue: ''
                };
                rows.push(trueFalseGrandchild);
            }
        }
    }

    // Add some additional standalone rows to reach 40+
    for (let extra = 1; extra <= 15; extra++) {
        const extraRow = {
            id: idCounter++,
            parentId: null,
            isTrueBranch: null,
            paramId: String(100 + extra).padStart(6, '0'),
            paramDesc: `Additional Parameter ${extra} Description`,
            moduleDesc: `Additional Module ${extra}`,
            uom: uomOptions[extra % uomOptions.length].value,
            operation: ['+', '-', '*'][extra % 3],
            standardMH: extra * 2,
            ifChecked: false,
            leftType: 'PARAM ID',
            leftValue: '',
            condition: '==',
            rightType: 'NUMBER',
            rightValue: ''
        };
        rows.push(extraRow);
    }

    console.log(`🏗️ Generated ${rows.length} database rows with complex nested structures`);
    
    return {
        rows,
        paramOptions,
        uomOptions
    };
}

export default DatabaseExampleUsage;