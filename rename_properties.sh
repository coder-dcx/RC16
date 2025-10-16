#!/bin/bash

echo "Ì¥Ñ Starting property renaming across all files..."

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
        echo "Ì≥ù Processing $file..."
        
        # Create backup
        cp "$file" "${file}.backup"
        
        # Rename: isTrueBranch ‚Üí branchFlag
        sed -i 's/isTrueBranch/branchFlag/g' "$file"
        
        # Rename: paramDesc ‚Üí description
        sed -i 's/paramDesc/description/g' "$file"
        
        # Rename: moduleDesc ‚Üí userComments
        sed -i 's/moduleDesc/userComments/g' "$file"
        
        # Rename: standardMH ‚Üí standardMh  
        sed -i 's/standardMH/standardMh/g' "$file"
        
        # Rename: condition ‚Üí ifCondition (but preserve conditionType)
        # First protect conditionType, then replace condition, then restore
        sed -i 's/conditionType/CONDITION_TYPE_TEMP/g' "$file"
        sed -i 's/\bcondition\b/ifCondition/g' "$file"
        sed -i 's/CONDITION_TYPE_TEMP/conditionType/g' "$file"
        
        echo "‚úÖ Completed $file"
    else
        echo "‚ö†Ô∏è  File not found: $file"
    fi
done

echo "‚úÖ All property renames completed!"
echo "Ì≤æ Backups saved with .backup extension"
