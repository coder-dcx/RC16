#!/bin/bash

echo "� Starting property renaming across all files..."

FILES=(
    "src/components/EnhancedDataTransformUtils.js"
    "src/components/DataTransformUtils.js"
    "src/components/FeaturesV1.js"
    "src/components/FeaturesV1Example.js"
    "src/components/FeaturesV2.js"
    "src/components/FeaturesV2Example.js"
    "src/components/FeaturesV3.js"
    "src/components/FeaturesV3Example.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "� Processing $file..."
        
        # Create backup
        cp "$file" "${file}.backup"
        
        # Rename: isTrueBranch → branchFlag
        sed -i 's/isTrueBranch/branchFlag/g' "$file"
        
        # Rename: paramDesc → description
        sed -i 's/paramDesc/description/g' "$file"
        
        # Rename: moduleDesc → userComments
        sed -i 's/moduleDesc/userComments/g' "$file"
        
        # Rename: standardMH → standardMh  
        sed -i 's/standardMH/standardMh/g' "$file"
        
        # Rename: condition → ifCondition (but preserve conditionType)
        # First protect conditionType, then replace condition, then restore
        sed -i 's/conditionType/CONDITION_TYPE_TEMP/g' "$file"
        sed -i 's/\bcondition\b/ifCondition/g' "$file"
        sed -i 's/CONDITION_TYPE_TEMP/conditionType/g' "$file"
        
        echo "✅ Completed $file"
    else
        echo "⚠️  File not found: $file"
    fi
done

echo "✅ All property renames completed!"
echo "� Backups saved with .backup extension"
