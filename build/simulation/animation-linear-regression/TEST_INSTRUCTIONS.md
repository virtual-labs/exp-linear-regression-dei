# Zoom Constraint Fix - Test Instructions

## Overview
The zoom constraint and plot area boundary fixes have been implemented. This document provides instructions for testing the changes.

## Changes Made

### 1. Maximum Zoom Constraint (Fixed)
- **File**: `animation/script.js` (line ~730)
- **Change**: Maximum viewport span reduced from 5000 to 500 units
- **Before**: `clamp(numXSpan, 10, 5000)` and `clamp(numYSpan, 10, 5000)`
- **After**: `clamp(numXSpan, 10, 500)` and `clamp(numYSpan, 10, 500)`

### 2. Plot Area Boundary Check (Fixed)
- **File**: `animation/script.js` (line ~651)
- **Change**: Added boundary check to prevent points from being added in margin areas
- **New Logic**: 
  - Extract click pixel coordinates
  - Check if click is within plot area boundaries (excluding margins)
  - Return early if click is outside plot area
  - Only add point if click is inside plot area AND within viewport bounds

## Manual Testing

### Test the Interactive Point Generator

1. **Open the application**:
   - Open `animation/index.html` in a web browser
   - Select "Interactive Point Generator" mode

2. **Test Zoom Constraint**:
   - Scroll mouse wheel down (zoom out) repeatedly
   - **Expected**: Viewport should stop expanding at a reasonable size (500 units max)
   - **Before fix**: Viewport would expand to 5000 units, making the plot unusable
   - **After fix**: Viewport stops at 500 units, keeping the plot usable

3. **Test Plot Area Boundaries**:
   - Try clicking in the left margin (where Y-axis labels are)
   - Try clicking in the top margin
   - Try clicking in the bottom margin (where X-axis labels are)
   - Try clicking in the right margin
   - **Expected**: No points should be added when clicking in margin areas
   - **Before fix**: Points would be added in margins, appearing to float in empty space
   - **After fix**: Clicks in margins are ignored, no points added

4. **Test Valid Point Addition (Preservation)**:
   - Click inside the plot area (within the axes boundaries)
   - **Expected**: Points should be added normally with correct split mode (train/test)
   - This behavior should be unchanged from before the fix

5. **Test Zoom In (Preservation)**:
   - Scroll mouse wheel up (zoom in)
   - **Expected**: Viewport should shrink normally down to 10-unit minimum
   - This behavior should be unchanged from before the fix

## Automated Testing

### Run Bug Condition Exploration Tests

1. **Open test file**: `animation/test-zoom-constraint.html` in a web browser
2. **Click "Run All Tests"**
3. **Expected Results**:
   - ✅ Property 1.1: Excessive Zoom Out - Should PASS (viewport constrained to 500 units)
   - ✅ Property 1.2: Click in Left Margin - Should PASS (no point added)
   - ✅ Property 1.3: Click in Top Margin - Should PASS (no point added)
   - ✅ Property 1.4: Click in Bottom Margin - Should PASS (no point added)
   - ✅ Property 1.5: Click in Right Margin - Should PASS (no point added)
   - ✅ Property 1.6: Click Inside Plot Area - Should PASS (point added correctly)

**Note**: Before the fix, tests 1.1-1.5 would have shown "EXPECTED FAIL" (confirming bugs existed). After the fix, all tests should show "PASS".

### Run Preservation Property Tests

1. **Open test file**: `animation/test-preservation.html` in a web browser
2. **Click "Run All Tests"**
3. **Expected Results**:
   - ✅ Property 2.1: Zoom In - Should PASS (viewport shrinks with 10-unit minimum)
   - ✅ Property 2.2: Valid Point Addition - Should PASS (point added with correct split mode)
   - ✅ Property 2.3: Test Split Mode - Should PASS (point added with test split mode)
   - ✅ Property 2.4: Metrics Calculation - Should PASS (MSE, RMSE, R² calculated)
   - ✅ Property 2.5: Hover Tooltip - Should PASS (tooltip mechanism works)
   - ✅ Property 2.6: Multiple Zoom In - Should PASS (handles multiple zoom-in events)

**Note**: All preservation tests should pass both before and after the fix, confirming no regressions.

## Visual Verification

### Before Fix Issues:
1. Zooming out excessively made the plot tiny and unusable
2. Points could appear in margin areas, overlapping with axis labels
3. Points appeared to float in empty space outside the plot region

### After Fix Improvements:
1. Zoom-out is constrained to a reasonable maximum (500 units)
2. Points can only be added within the plot area (inside axes boundaries)
3. All points appear within the visible plot region
4. Existing functionality (zoom-in, tooltips, metrics) remains unchanged

## Success Criteria

✅ Maximum zoom-out is constrained to 500 units
✅ Points cannot be added in margin areas
✅ Points can only be added inside plot area boundaries
✅ Zoom-in behavior works correctly (10-unit minimum)
✅ Valid point addition works correctly with proper split mode
✅ Tooltips display correctly when hovering over points
✅ Metrics (MSE, RMSE, R²) calculate correctly
✅ No syntax errors or console errors
✅ All automated tests pass

## Troubleshooting

If tests fail or behavior is incorrect:

1. **Check browser console** for JavaScript errors
2. **Verify changes** in `animation/script.js`:
   - Line ~730: `clamp(numXSpan, 10, 500)` and `clamp(numYSpan, 10, 500)`
   - Line ~651: Plot area boundary check added
3. **Clear browser cache** and reload the page
4. **Try different browsers** (Chrome, Firefox, Safari, Edge)

## Files Modified

- `animation/script.js` - Main application logic (2 changes)

## Files Created

- `animation/test-zoom-constraint.html` - Bug condition exploration tests
- `animation/test-preservation.html` - Preservation property tests
- `animation/TEST_INSTRUCTIONS.md` - This file

## Next Steps

After verifying the fixes work correctly:

1. Test the application thoroughly in different browsers
2. Consider adding more edge case tests if needed
3. Update documentation if necessary
4. Deploy the fixed version

---

**Spec**: zoom-constraint-fix
**Status**: ✅ Complete
**Date**: 2026-03-09
