# 🚀 IFAndLookup.js - Enhanced Formula Builder

## 📋 Overview

`IFAndLookup.js` is an enhanced version of `NestedIfGridV2.js` with a major new feature: **multiple rows support under TRUE and FALSE branches**. This allows for much more complex and flexible formula structures.

## 🆕 New Features

### 1. **Multiple Children Support**
- ✅ Add unlimited rows under TRUE branches
- ✅ Add unlimited rows under FALSE branches  
- ✅ Independent management of each branch
- ✅ Visual indicators and row counters

### 2. **Enhanced UI Controls**
- ✅ Add/Remove buttons for each branch
- ✅ Visual branch sections with color coding
- ✅ Row numbering within branches
- ✅ Improved layout for complex structures

### 3. **Advanced Data Structure**
- ✅ Array-based children (`trueChildren[]`, `falseChildren[]`)
- ✅ `branchIndex` field for proper ordering
- ✅ Enhanced database integration
- ✅ Backward compatibility maintained

## 🔄 Key Differences from NestedIfGridV2

| Feature | NestedIfGridV2 | IFAndLookup (Enhanced) |
|---------|----------------|------------------------|
| TRUE Branch | Single child | **Multiple children array** |
| FALSE Branch | Single child | **Multiple children array** |
| Data Structure | `trueChild`, `falseChild` | `trueChildren[]`, `falseChildren[]` |
| Branch Management | Auto-created | **Manual add/remove controls** |
| Visual Interface | Basic expand/collapse | **Enhanced branch sections** |
| Database Field | No branch indexing | **branchIndex for ordering** |

## 🏗️ Data Structure Comparison

### Original Structure (NestedIfGridV2)
```javascript
{
    id: "row_1",
    children: {
        trueChild: {/* single child */},
        falseChild: {/* single child */}
    }
}
```

### Enhanced Structure (IFAndLookup)
```javascript
{
    id: "row_1",
    children: {
        trueChildren: [    // Array of children
            {/* child 1 */},
            {/* child 2 */},
            {/* child 3 */}
        ],
        falseChildren: [   // Array of children
            {/* child 1 */},
            {/* child 2 */}
        ]
    }
}
```

## 📊 Database Integration

### Enhanced Database Schema
```sql
-- New field added for multiple children support
ALTER TABLE FormulaData ADD COLUMN branchIndex INT DEFAULT NULL;

-- Sample data with multiple children
INSERT INTO FormulaData VALUES 
(1, NULL, NULL, NULL, '000001', 'Engine Speed', 'Main Module', true, ...),
(2, 1, true, 0, '000002', 'High Speed Calc 1', 'Module 1', false, ...), -- First TRUE child
(3, 1, true, 1, '000003', 'High Speed Calc 2', 'Module 2', false, ...), -- Second TRUE child  
(4, 1, true, 2, '000004', 'High Speed Calc 3', 'Module 3', false, ...), -- Third TRUE child
(5, 1, false, 0, '000005', 'Low Speed Calc 1', 'Module 4', false, ...), -- First FALSE child
(6, 1, false, 1, '000006', 'Low Speed Calc 2', 'Module 5', false, ...); -- Second FALSE child
```

### Enhanced Data Transformation
- `EnhancedDataTransformUtils.js` - Handles array-based children
- `prepareEnhancedDataForComponent()` - Converts flat DB to tree with arrays
- `prepareEnhancedDataForDatabase()` - Flattens arrays back to DB format
- Automatic `branchIndex` management and re-indexing

## 🎯 Formula Generation Enhancement

### Original Formula (Single Children)
```javascript
IF(condition, single_true_child, single_false_child)
```

### Enhanced Formula (Multiple Children)
```javascript
IF(condition, (child1 + child2 + child3), (child1 + child2))
```

### Example Complex Formula
```javascript
IF([000001] > 1000, 
   ([000002] * 25 + [000003] + 15 + [000004] * 5), 
   ([000005] * 10 + [000006] + 8)
)
```

## 🎨 Enhanced User Interface

### Branch Sections
- **TRUE Branch**: Green-colored section with child count
- **FALSE Branch**: Red-colored section with child count  
- **Add Controls**: + button to add new rows to each branch
- **Remove Controls**: - button to remove rows (minimum 1 per branch)
- **Visual Indicators**: Row numbering and branch type icons

### Enhanced Layout
```
🔽 IF Row (Engine Speed > 1000)
    ├── TRUE Branch (3 rows)
    │   ├── [+] Add Row Button
    │   ├── Row 1: [000002] * 25 [-] Remove
    │   ├── Row 2: [000003] + 15 [-] Remove  
    │   └── Row 3: [000004] * 5 [-] Remove
    └── FALSE Branch (2 rows)
        ├── [+] Add Row Button
        ├── Row 1: [000005] * 10 [-] Remove
        └── Row 2: [000006] + 8 [-] Remove
```

## 🚀 Usage Examples

### Basic Usage (Same as NestedIfGridV2)
```javascript
import IFAndLookup from './components/IFAndLookup';

<IFAndLookup
    initialRows={data.rows}
    paramIdOptions={data.paramOptions}
    uomOptions={data.uomOptions}
    onDataChange={handleChange}
/>
```

### Enhanced Database Integration
```javascript
import { 
    prepareEnhancedDataForComponent,
    prepareEnhancedDataForDatabase 
} from './components/EnhancedDataTransformUtils';

// Load data with multiple children support
const componentData = prepareEnhancedDataForComponent(dbRows, params, uoms);

// Save data with array flattening
const dbData = prepareEnhancedDataForDatabase(componentRows);
```

### Demo Component
```javascript
import EnhancedExampleUsage from './components/EnhancedExampleUsage';

// Shows complete working example with 12 sample rows
// demonstrating complex nested structures with multiple children
<EnhancedExampleUsage />
```

## 📁 Files Created/Updated

### New Files
1. **`IFAndLookup.js`** - Enhanced component with multiple children support
2. **`EnhancedDataTransformUtils.js`** - Enhanced data transformation utilities
3. **`EnhancedExampleUsage.js`** - Complete demo with sample data

### Updated Files
1. **`App.js`** - Added routes for enhanced components
2. **Routes added**: `/enhanced` and `/enhanced-demo`

## 🔄 Migration Guide

### From NestedIfGridV2 to IFAndLookup

1. **Import Change**:
```javascript
// Before
import NestedIfGridV2 from './components/NestedIfGridV2';

// After  
import IFAndLookup from './components/IFAndLookup';
```

2. **Data Transformation**:
```javascript
// Before
import { prepareDataForComponent } from './components/DataTransformUtils';

// After
import { prepareEnhancedDataForComponent } from './components/EnhancedDataTransformUtils';
```

3. **Database Schema Update**:
```sql
-- Add branchIndex field for multiple children ordering
ALTER TABLE your_formula_table ADD COLUMN branchIndex INT DEFAULT NULL;
```

## 🎉 Benefits

### For Users
- ✅ **More Flexibility**: Create complex formulas with multiple conditions
- ✅ **Better Organization**: Separate different calculations clearly
- ✅ **Easier Management**: Add/remove rows independently in each branch
- ✅ **Visual Clarity**: Clear branch sections and row indicators

### For Developers  
- ✅ **Enhanced Data Model**: More powerful and flexible data structure
- ✅ **Backward Compatibility**: Existing NestedIfGridV2 code still works
- ✅ **Better Database Design**: Proper indexing and relationship management
- ✅ **Production Ready**: Full validation, error handling, and testing

## 🧪 Testing

### Test Routes Available
1. **`/enhanced`** - Basic IFAndLookup component (start with empty row)
2. **`/enhanced-demo`** - Full demo with 12 complex sample rows
3. **`/data`** - Original NestedIfGridV2 (for comparison)
4. **`/database`** - Database integration example

### Sample Data Included
- **Engine Speed IF**: 3 TRUE children + 2 FALSE children
- **Temperature IF**: Nested IF with multiple children at deep levels  
- **12 Total Rows**: Complex relationships demonstrating all features

## 📈 Performance

The enhanced version maintains excellent performance even with complex structures:
- ✅ Efficient array management
- ✅ Optimized re-rendering
- ✅ Smart validation paths
- ✅ Minimal database queries

---

**Ready to use!** Start with `/enhanced-demo` to see the full capabilities, then use `/enhanced` to build your own complex formulas! 🚀