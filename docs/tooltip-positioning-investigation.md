# Tooltip Positioning Investigation Report

## Overview
This document chronicles the attempts to fix tooltip positioning issues in the GenreDonutChart component. Despite multiple approaches and fixes, the tooltips continue to overlap with the donut chart segments instead of appearing outside them.

## Problem Statement
- **Expected**: Tooltips should appear outside the donut chart segments with proper spacing
- **Actual**: Tooltips overlap directly on top of the segments they're supposed to describe
- **Environment**: Next.js app with SVG donut chart, Framer Motion animations, Tailwind CSS

## Key Technical Details

### SVG Setup
- **ViewBox**: 240x240 (`size = 240`)
- **CSS Dimensions**: `className="w-80 h-80"` (320x320 pixels)
- **Outer Radius**: 90 SVG units
- **Inner Radius**: 54 SVG units

### Container Structure
```jsx
<div ref={containerRef} className="relative">  // Tooltip container
  <svg ref={svgRef} viewBox="0 0 240 240" className="w-80 h-80">
    {/* Donut segments */}
  </svg>
  {/* Tooltip with position: absolute */}
</div>
```

## Attempted Solutions

### 1. Initial Percentage-Based Approach (Failed)
**Problem**: Used percentage-based transforms like `translate(-50%, -50%)`
**Issue**: Doesn't account for actual tooltip dimensions, fails on left side
**Result**: Inconsistent positioning, especially for left-side segments

### 2. Geometry-First with Edge Anchoring (Failed)
**Approach**: 
- Created `useTooltipPositioning` hook
- Implemented smart placement engine with collision detection
- Used edge-based anchoring instead of center positioning

**Code**:
```javascript
const calculatePosition = (anchorX, anchorY, containerRect, tooltipDims, placement) => {
  // Complex placement logic with fallbacks
}
```

**Issue**: Coordinate system mismatch between calculations and actual rendering
**Result**: Tooltips still overlapping

### 3. Fixed Coordinate Scaling Issues (Failed)
**Problem Identified**: Single scale factor used for both X and Y
```javascript
// Before (wrong)
const scaleFactor = containerRect.width / size;
const anchorY = edgeY * scaleFactor; // Over-scales Y when width ≠ height

// After (fixed)
const scaleX = containerRect.width / size;
const scaleY = containerRect.height / size;
```

**Issue**: Fixed scaling but positioning still wrong
**Result**: No improvement

### 4. Container-Relative Positioning (Failed)
**Approach**: Created container-relative DOMRect for collision detection
```javascript
const containerLocalRect = {
  x: 0, y: 0,
  width: containerRect.width,
  height: containerRect.height,
  // ...
}
```

**Issue**: Coordinate space confusion persisted
**Result**: Still overlapping

### 5. SVG Element Reference Approach (Failed)
**Approach**: Use actual SVG element dimensions instead of container
```javascript
const svgRect = svgRef.current.getBoundingClientRect();
const anchorX = (svgAnchorX * scaleX) + (svgRect.left - containerRect.left);
```

**Issue**: Added complexity without solving core problem
**Result**: No improvement

### 6. Simplified Direct Calculation (Failed)
**Latest Approach**: Complete rewrite with simple math
```javascript
const renderCenterX = containerRect.width / 2;
const renderCenterY = containerRect.height / 2;
const tooltipDistance = renderOuterRadius + (30 * scale);
const anchorX = renderCenterX + tooltipDistance * Math.cos(angleRad);
const anchorY = renderCenterY + tooltipDistance * Math.sin(angleRad);
```

**Issue**: Still not working despite simpler approach
**Result**: Tooltips still overlap

## Root Cause Analysis

### Potential Issues Not Yet Addressed

1. **CSS Transform Origin**: The donut segments use `whileHover={{ scale: 1.05 }}` which might affect positioning calculations

2. **SVG Viewport vs Display Mismatch**: 
   - SVG has explicit width/height AND viewBox
   - CSS classes override with different dimensions
   - This creates multiple coordinate systems

3. **Absolute Positioning Context**: 
   - Tooltip uses `position: absolute` relative to container
   - But calculations might be relative to wrong element

4. **Framer Motion Interference**: 
   - Animation states might affect final positioning
   - `onAnimationComplete={measureTooltip}` might run too late

5. **Browser Rendering Pipeline**: 
   - Layout calculations might happen before final render
   - SVG scaling might not be accounted for properly

## Recommended Next Steps

### 1. Debug Current State
```javascript
// Add debug logging to understand actual values
console.log({
  containerRect,
  svgRect,
  calculatedAnchor: { x: anchorX, y: anchorY },
  tooltipPosition,
  scale,
  segment
});
```

### 2. Try Fixed Positioning Approach
Instead of calculating, use fixed positions for testing:
```javascript
// Test with hardcoded positions
const positions = {
  0: { x: 400, y: 200 }, // Right
  1: { x: 300, y: 350 }, // Bottom-right
  // etc...
};
```

### 3. Alternative Architecture
Consider moving tooltips outside the container entirely:
```jsx
<div className="relative">
  <div className="donut-container">
    <svg>...</svg>
  </div>
  <div className="tooltip-layer absolute inset-0 pointer-events-none">
    {/* Tooltips here */}
  </div>
</div>
```

### 4. Use Portal for Tooltips
Render tooltips in a portal to avoid positioning context issues:
```javascript
import { createPortal } from 'react-dom';

return createPortal(
  <Tooltip style={{
    position: 'fixed',
    left: viewportX,
    top: viewportY
  }} />,
  document.body
);
```

### 5. Inspect Actual Rendered Values
Use browser DevTools to:
- Check computed styles on tooltip
- Verify container dimensions
- Inspect transform matrices
- Look for unexpected CSS inheritance

## Lessons Learned

1. **Complexity Creep**: Each "fix" added more complexity without solving the core issue
2. **Coordinate System Confusion**: Multiple coordinate systems (SVG viewBox, CSS pixels, container-relative) create confusion
3. **Assumption Errors**: Assumed the math was wrong when it might be the rendering context
4. **Missing Context**: Something else in the component hierarchy might be affecting positioning

## Conclusion

Despite multiple sophisticated approaches, the tooltip positioning remains broken. This suggests the issue might not be with the positioning math itself, but with:
- How the tooltip is rendered in the DOM
- CSS/styling conflicts
- Animation state interference
- Browser-specific SVG rendering behavior

The next step should be to create a minimal reproduction to isolate the issue, or to use a completely different approach (like portals or fixed positioning map).