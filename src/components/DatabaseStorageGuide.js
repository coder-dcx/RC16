/**
 * Database Storage Guide for NestedIfGridV2 Component
 * 
 * This guide shows how to store the nested IF grid data in different database systems
 */

// =====================================
// 1. DATABASE SCHEMA DESIGN
// =====================================

// SQL Schema (MySQL/PostgreSQL/SQL Server)
const sqlSchema = `
-- Main table for storing formula configurations
CREATE TABLE FormulaConfigurations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    status ENUM('active', 'inactive', 'draft') DEFAULT 'draft'
);

-- Table for storing the complete nested structure as JSON
CREATE TABLE FormulaData (
    id INT PRIMARY KEY AUTO_INCREMENT,
    configuration_id INT,
    formula_data JSON NOT NULL,  -- Stores the complete nested structure
    formula_preview TEXT,        -- Generated formula string
    version INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (configuration_id) REFERENCES FormulaConfigurations(id) ON DELETE CASCADE,
    INDEX idx_config_version (configuration_id, version)
);

-- Alternative: Normalized approach (if you prefer relational structure)
CREATE TABLE FormulaRows (
    id VARCHAR(50) PRIMARY KEY,          -- row_1, row_2, etc.
    configuration_id INT,
    parent_id VARCHAR(50) NULL,          -- NULL for main rows
    is_true_branch BOOLEAN NULL,         -- NULL for main rows, TRUE/FALSE for children
    param_id VARCHAR(20),
    param_desc TEXT,
    module_desc VARCHAR(255),
    uom VARCHAR(10),
    operation VARCHAR(5),
    standard_mh DECIMAL(10,2),
    if_checked BOOLEAN DEFAULT FALSE,
    is_expanded BOOLEAN DEFAULT FALSE,
    has_children BOOLEAN DEFAULT FALSE,
    left_type ENUM('PARAM ID', 'NUMBER', 'TEXT'),
    left_value VARCHAR(255),
    condition_op ENUM('==', '>', '<', '<>'),
    right_type ENUM('PARAM ID', 'NUMBER', 'TEXT'),
    right_value VARCHAR(255),
    row_order INT,
    level_depth INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (configuration_id) REFERENCES FormulaConfigurations(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES FormulaRows(id) ON DELETE CASCADE,
    INDEX idx_config_parent (configuration_id, parent_id),
    INDEX idx_hierarchy (parent_id, is_true_branch)
);
`;

// MongoDB Schema
const mongoSchema = {
    // Collection: formula_configurations
    formula_configurations: {
        _id: "ObjectId",
        name: "String",
        description: "String",
        created_at: "Date",
        updated_at: "Date",
        created_by: "String",
        status: "String", // 'active', 'inactive', 'draft'
        
        // Embedded document approach - store complete structure
        formula_data: {
            rows: "Array", // Complete nested structure from NestedIfGridV2
            param_options: "Array",
            uom_options: "Array",
            formula_preview: "String",
            version: "Number"
        }
    }
};

// =====================================
// 2. BACKEND API IMPLEMENTATION
// =====================================

// Node.js/Express API endpoints
const apiEndpoints = `
// Save formula configuration
POST /api/formulas
Body: {
    name: "Engine Configuration Formula",
    description: "Complex engine parameter calculation",
    formula_data: {rows: [...], param_options: [...], uom_options: [...]}
}

// Get all formula configurations
GET /api/formulas

// Get specific formula configuration
GET /api/formulas/:id

// Update formula configuration
PUT /api/formulas/:id
Body: {formula_data: {...}, formula_preview: "..."}

// Delete formula configuration
DELETE /api/formulas/:id

// Get formula versions (if versioning is needed)
GET /api/formulas/:id/versions
`;

// =====================================
// 3. FRONTEND INTEGRATION CODE
// =====================================

// React service for API calls
const apiServiceCode = `
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class FormulaConfigService {
    
    // Save new formula configuration
    static async saveFormulaConfig(data) {
        try {
            const payload = {
                name: data.name,
                description: data.description,
                formula_data: {
                    rows: data.rows,
                    param_options: data.paramOptions || [],
                    uom_options: data.uomOptions || [],
                    formula_preview: data.formulaPreview,
                    version: 1
                }
            };
            
            const response = await axios.post(\${API_BASE_URL}/formulas, payload);
            return response.data;
        } catch (error) {
            console.error('Error saving formula config:', error);
            throw error;
        }
    }
    
    // Update existing formula configuration
    static async updateFormulaConfig(id, data) {
        try {
            const payload = {
                formula_data: {
                    rows: data.rows,
                    param_options: data.paramOptions || [],
                    uom_options: data.uomOptions || [],
                    formula_preview: data.formulaPreview,
                    version: (data.version || 1) + 1
                }
            };
            
            const response = await axios.put(\${API_BASE_URL}/formulas/\${id}, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating formula config:', error);
            throw error;
        }
    }
    
    // Load formula configuration
    static async loadFormulaConfig(id) {
        try {
            const response = await axios.get(\${API_BASE_URL}/formulas/\${id});
            return response.data;
        } catch (error) {
            console.error('Error loading formula config:', error);
            throw error;
        }
    }
    
    // Get all formula configurations
    static async getAllFormulaConfigs() {
        try {
            const response = await axios.get(\${API_BASE_URL}/formulas);
            return response.data;
        } catch (error) {
            console.error('Error loading formula configs:', error);
            throw error;
        }
    }
    
    // Delete formula configuration
    static async deleteFormulaConfig(id) {
        try {
            const response = await axios.delete(\${API_BASE_URL}/formulas/\${id});
            return response.data;
        } catch (error) {
            console.error('Error deleting formula config:', error);
            throw error;
        }
    }
}
`;

// =====================================
// 4. COMPONENT INTEGRATION EXAMPLE
// =====================================

const componentIntegrationCode = `
import React, { useState, useEffect } from 'react';
import NestedIfGridV2 from './components/NestedIfGridV2';
import { FormulaConfigService } from './services/FormulaConfigService';

function FormulaBuilder() {
    const [formulaData, setFormulaData] = useState({
        rows: [],
        paramOptions: [],
        uomOptions: []
    });
    const [configId, setConfigId] = useState(null);
    const [configName, setConfigName] = useState('');
    const [loading, setLoading] = useState(false);

    // Load existing configuration
    const loadConfiguration = async (id) => {
        setLoading(true);
        try {
            const config = await FormulaConfigService.loadFormulaConfig(id);
            setFormulaData({
                rows: config.formula_data.rows,
                paramOptions: config.formula_data.param_options,
                uomOptions: config.formula_data.uom_options
            });
            setConfigId(id);
            setConfigName(config.name);
        } catch (error) {
            alert('Error loading configuration: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Save configuration
    const saveConfiguration = async () => {
        if (!configName.trim()) {
            alert('Please enter a configuration name');
            return;
        }

        setLoading(true);
        try {
            const saveData = {
                name: configName,
                description: 'Formula configuration created with NestedIfGridV2',
                rows: formulaData.rows,
                paramOptions: formulaData.paramOptions,
                uomOptions: formulaData.uomOptions,
                formulaPreview: generateCompleteFormula(formulaData.rows)
            };

            let result;
            if (configId) {
                // Update existing
                result = await FormulaConfigService.updateFormulaConfig(configId, saveData);
                alert('Configuration updated successfully!');
            } else {
                // Create new
                result = await FormulaConfigService.saveFormulaConfig(saveData);
                setConfigId(result.id);
                alert('Configuration saved successfully!');
            }
        } catch (error) {
            alert('Error saving configuration: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle data changes from NestedIfGridV2
    const handleDataChange = (newRowData) => {
        setFormulaData(prev => ({
            ...prev,
            rows: newRowData
        }));
    };

    return (
        <div>
            <div style={{ padding: '20px', marginBottom: '20px', border: '1px solid #ccc' }}>
                <h3>Configuration Management</h3>
                <input
                    type="text"
                    placeholder="Configuration Name"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <button onClick={saveConfiguration} disabled={loading}>
                    {loading ? 'Saving...' : (configId ? 'Update' : 'Save')}
                </button>
                <button onClick={() => loadConfiguration(1)} disabled={loading}>
                    Load Sample Config
                </button>
            </div>

            <NestedIfGridV2
                initialRows={formulaData.rows}
                paramIdOptions={formulaData.paramOptions}
                uomOptions={formulaData.uomOptions}
                onDataChange={handleDataChange}
            />
        </div>
    );
}

export default FormulaBuilder;
`;

// =====================================
// 5. DATABASE QUERY EXAMPLES
// =====================================

const queryExamples = `
-- Save new formula configuration (SQL)
INSERT INTO FormulaConfigurations (name, description, created_by, status) 
VALUES ('Engine Config', 'Complex engine formula', 'user123', 'draft');

INSERT INTO FormulaData (configuration_id, formula_data, formula_preview, version)
VALUES (1, '{"rows": [...], "param_options": [...]}', 'IF([P001] > 100, [P002] * 25, [P003] * 15)', 1);

-- Load formula configuration (SQL)
SELECT fc.*, fd.formula_data, fd.formula_preview, fd.version
FROM FormulaConfigurations fc
JOIN FormulaData fd ON fc.id = fd.configuration_id
WHERE fc.id = 1 AND fd.version = (
    SELECT MAX(version) FROM FormulaData WHERE configuration_id = 1
);

-- MongoDB queries
// Save new configuration
db.formula_configurations.insertOne({
    name: "Engine Configuration",
    description: "Complex engine parameter calculation",
    created_at: new Date(),
    status: "draft",
    formula_data: {
        rows: [...],
        param_options: [...],
        uom_options: [...],
        formula_preview: "IF([P001] > 100, [P002] * 25, [P003] * 15)",
        version: 1
    }
});

// Load configuration
db.formula_configurations.findOne({_id: ObjectId("...")});

// Update configuration
db.formula_configurations.updateOne(
    {_id: ObjectId("...")},
    {
        $set: {
            "formula_data.rows": [...],
            "formula_data.version": 2,
            updated_at: new Date()
        }
    }
);
`;

export {
    sqlSchema,
    mongoSchema,
    apiEndpoints,
    apiServiceCode,
    componentIntegrationCode,
    queryExamples
};