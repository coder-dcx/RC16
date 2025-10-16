#!/usr/bin/env python3
"""
Property Renaming Script for RC16 Project
Renames properties to match target project naming convention
"""

import os
import re
from pathlib import Path

# Property mapping: old_name -> new_name
PROPERTY_MAPPING = {
    'isTrueBranch': 'branchFlag',
    'paramDesc': 'description',
    'moduleDesc': 'userComments',
    'standardMH': 'standardMh',
    # 'condition' will be handled specially to avoid conditionType
}

# Files to update
FILES_TO_UPDATE = [
    'src/components/EnhancedDataTransformUtils.js',
    'src/components/DataTransformUtils.js',
    'src/components/FeaturesV1.js',
    'src/components/FeaturesV1Example.js',
    'src/components/FeaturesV2.js',
    'src/components/FeaturesV2Example.js',
    'src/components/FeaturesV3.js',
    'src/components/FeaturesV3Example.js',
]

def rename_properties_in_file(filepath):
    """Rename properties in a single file"""
    print(f"📝 Processing {filepath}...")
    
    if not os.path.exists(filepath):
        print(f"⚠️  File not found: {filepath}")
        return False
    
    # Read file content
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Apply simple property renames
    for old_prop, new_prop in PROPERTY_MAPPING.items():
        # Replace property names in object literals, destructuring, etc.
        # Matches: {oldProp:, oldProp,, oldProp}, row.oldProp, etc.
        pattern = r'\b' + re.escape(old_prop) + r'\b'
        content = re.sub(pattern, new_prop, content)
    
    # Handle 'condition' -> 'ifCondition' carefully
    # Don't replace 'conditionType', only standalone 'condition'
    # Matches contexts like: {condition:, row.condition, condition =, etc.
    # But NOT: conditionType
    content = re.sub(
        r'(?<![a-zA-Z])condition(?![a-zA-Z]|Type)',
        'ifCondition',
        content
    )
    
    # Create backup
    backup_path = filepath + '.backup'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(original_content)
    
    # Write updated content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    changes_made = content != original_content
    if changes_made:
        print(f"✅ Updated {filepath}")
        return True
    else:
        print(f"ℹ️  No changes needed in {filepath}")
        return False

def main():
    print("🔄 Starting property renaming across all files...\n")
    print("Property mappings:")
    for old, new in PROPERTY_MAPPING.items():
        print(f"  • {old} → {new}")
    print(f"  • condition → ifCondition (preserving conditionType)\n")
    
    updated_count = 0
    for filepath in FILES_TO_UPDATE:
        if rename_properties_in_file(filepath):
            updated_count += 1
        print()
    
    print(f"\n✅ Property renaming completed!")
    print(f"📊 {updated_count}/{len(FILES_TO_UPDATE)} files updated")
    print(f"💾 Backups saved with .backup extension")
    print(f"\nℹ️  If something goes wrong, restore from .backup files")

if __name__ == '__main__':
    main()
