# Property Name Mapping

## Current → New (Your Project)

| Current Name | New Name | Description |
|--------------|----------|-------------|
| `parentId` | `parentId` | ✅ Same (no change) |
| `isTrueBranch` | `branchFlag` | TRUE/FALSE branch indicator |
| `branchIndex` | `branchIndex` | ✅ Same (no change) |
| `paramId` | `paramId` | ✅ Same (no change) |
| `paramDesc` | `description` | Parameter description |
| `moduleDesc` | `userComments` | User comments/module description |
| `uom` | `uom` | ✅ Same (no change) |
| `operation` | `operation` | ✅ Same (no change) |
| `standardMH` | `standardMh` | Standard MH (case change: MH → Mh) |
| `rowOperator` | `rowOperator` | ✅ Same (no change) |
| `conditionType` | `conditionType` | ✅ Same (no change) |
| `ifChecked` | `ifChecked` | ✅ Same (no change) |
| `leftType` | `leftType` | ✅ Same (no change) |
| `leftValue` | `leftValue` | ✅ Same (no change) |
| `condition` | `ifCondition` | Condition operator |
| `rightType` | `rightType` | ✅ Same (no change) |
| `rightValue` | `rightValue` | ✅ Same (no change) |

## Properties to Rename:
1. `isTrueBranch` → `branchFlag`
2. `paramDesc` → `description`
3. `moduleDesc` → `userComments`
4. `standardMH` → `standardMh`
5. `condition` → `ifCondition`

## Files to Update:
- ✅ src/components/FeaturesV1.js
- ✅ src/components/FeaturesV1Example.js
- ✅ src/components/FeaturesV2.js
- ✅ src/components/FeaturesV2Example.js
- ✅ src/components/FeaturesV3.js
- ✅ src/components/FeaturesV3Example.js
- ✅ src/components/EnhancedDataTransformUtils.js
- ✅ src/components/DataTransformUtils.js
