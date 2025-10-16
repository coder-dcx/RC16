#!/usr/bin/env node
/**
 * Property Renaming Script for RC16 Project
 * Renames properties to match target project naming convention
 */

const fs = require('fs');
const path = require('path');

// Property mapping: old_name -> new_name
const PROPERTY_MAPPING = {
    'isTrueBranch': 'branchFlag',
    'paramDesc': 'description',
    'moduleDesc': 'userComments',
    'standardMH': 'standardMh',
};

// Files to update
const FILES_TO_UPDATE = [
    'src/components/EnhancedDataTransformUtils.js',
    'src/components/DataTransformUtils.js',
    'src/components/FeaturesV1.js',
    'src/components/FeaturesV1Example.js',
    'src/components/FeaturesV2.js',
    'src/components/FeaturesV2Example.js',
    'src/components/FeaturesV3.js',
    'src/components/FeaturesV3Example.js',
];

function renamePropertiesInFile(filepath) {
    console.log(`📝 Processing ${filepath}...`);
    
    if (!fs.existsSync(filepath)) {
        console.log(`⚠️  File not found: ${filepath}`);
        return false;
    }
    
    // Read file content
    let content = fs.readFileSync(filepath, 'utf8');
    const originalContent = content;
    
    // Apply simple property renames
    for (const [oldProp, newProp] of Object.entries(PROPERTY_MAPPING)) {
        // Replace property names - word boundary aware
        const regex = new RegExp(`\\b${oldProp}\\b`, 'g');
        content = content.replace(regex, newProp);
    }
    
    // Handle 'condition' -> 'ifCondition' carefully
    // Don't replace 'conditionType', only standalone 'condition'
    content = content.replace(/(?<![a-zA-Z])condition(?![a-zA-Z]|Type)/g, 'ifCondition');
    
    // Create backup
    const backupPath = filepath + '.backup';
    fs.writeFileSync(backupPath, originalContent, 'utf8');
    
    // Write updated content
    fs.writeFileSync(filepath, content, 'utf8');
    
    const changesMade = content !== originalContent;
    if (changesMade) {
        console.log(`✅ Updated ${filepath}`);
        return true;
    } else {
        console.log(`ℹ️  No changes needed in ${filepath}`);
        return false;
    }
}

function main() {
    console.log('🔄 Starting property renaming across all files...\n');
    console.log('Property mappings:');
    for (const [old, newName] of Object.entries(PROPERTY_MAPPING)) {
        console.log(`  • ${old} → ${newName}`);
    }
    console.log(`  • condition → ifCondition (preserving conditionType)\n`);
    
    let updatedCount = 0;
    for (const filepath of FILES_TO_UPDATE) {
        if (renamePropertiesInFile(filepath)) {
            updatedCount++;
        }
        console.log('');
    }
    
    console.log(`\n✅ Property renaming completed!`);
    console.log(`📊 ${updatedCount}/${FILES_TO_UPDATE.length} files updated`);
    console.log(`💾 Backups saved with .backup extension`);
    console.log(`\nℹ️  If something goes wrong, restore from .backup files`);
}

main();
