# Technical Decision: 3D Geospatial Visualization Library Selection

**Date:** January 15, 2026  
**Status:** Decided  
**Decision:** Cesium.js

## Context

We are building a web-based 3D visualization system that displays:
- Real-time aircraft positions from external APIs (azimuth/elevation data)
- Moon position in the sky
- Terrain elevation around a specific geographic point (lat/long)

The visualization must accurately render objects in 3D space relative to a ground observer's perspective, handle coordinate transformations from azimuth/elevation to 3D positions, and display realistic terrain. The terrain is important to know if the moon is above the horizon but still blocked by montains or other.

## Problem Statement

We need a JavaScript 3D rendering solution that can:
1. Convert geographic coordinates (lat/long) and azimuth/elevation angles to 3D space
2. Render realistic Earth terrain with elevation data
3. Position and track moving objects (aircraft) in real-time
4. Calculate and display celestial object positions (moon)
5. Provide good performance and maintainability

## Options Evaluated

### Option 1: Cesium.js
**Description:** Purpose-built 3D geospatial visualization library with native Earth rendering capabilities.

**Pros:**
- Built-in coordinate system transformations (geographic to 3D)
- Native terrain support with free elevation data available
- Time-dynamic visualization for moving objects
- Celestial object positioning included
- Handles Earth curvature and map projections automatically

**Cons:**
- Larger bundle size (~500KB)
- Steeper learning curve than general 3D libraries
- Some advanced features require Cesium ion account

### Option 2: Three.js
**Description:** General-purpose WebGL 3D library.

**Pros:**
- Lightweight and flexible
- Full creative control
- Large community and ecosystem
- Well-documented

**Cons:**
- No geospatial features out-of-box
- Would require custom implementation of:
  - Coordinate transformations
  - Terrain rendering pipeline
  - Earth sphere with curvature
  - Azimuth/elevation conversions
- Significant development time for geospatial features

### Option 3: Mapbox GL JS
**Description:** 2.5D mapping library with 3D terrain support.

**Pros:**
- Good terrain rendering
- Easy to use for standard maps
- Beautiful styling options

**Cons:**
- Limited to 2.5D (restricted camera angles)
- Not designed for celestial objects or arbitrary 3D positioning
- Requires API token with usage limits
- Poor fit for observer-centric sky visualization

### Option 4: Deck.gl
**Description:** WebGL data visualization framework.

**Pros:**
- High performance for data overlays
- Layer-based architecture

**Cons:**
- Focused on data visualization, not realistic 3D environments
- Limited terrain support
- Would require additional libraries for geospatial functionality

## Decision: Cesium.js

### Rationale

Cesium.js is selected because it directly addresses our core requirements with minimal custom development:

1. **Coordinate Systems:** Cesium provides robust utilities for converting between geographic coordinates, azimuth/elevation, and 3D Cartesian space. This is complex to implement correctly and would take significant time with Three.js.

2. **Terrain Integration:** Built-in support for terrain elevation with free worldwide data (Cesium World Terrain). Three.js would require building a terrain rendering pipeline from scratch.

3. **Geospatial DNA:** Cesium is designed for exactly this use case - tracking objects in 3D space relative to Earth's surface. Features like time management, moving entities, and coordinate transformations are core capabilities rather than afterthoughts.

4. **Astronomical Positioning:** Cesium includes utilities for celestial object calculations, reducing complexity for moon positioning.

5. **Development Velocity:** The library handles the "hard parts" (map projections, Earth curvature, coordinate math) automatically, allowing us to focus on application logic and API integration rather than reinventing geospatial infrastructure.

6. **Maintenance:** Using a specialized library reduces custom code maintenance and leverages community updates for improvements and bug fixes.

### Trade-offs Accepted

- **Bundle Size:** Accepting ~500KB library size for comprehensive geospatial features
- **Learning Curve:** Team will invest time learning Cesium-specific APIs
- **Flexibility:** Less low-level control compared to Three.js, but this is acceptable given our requirements align with Cesium's design

## Conclusion

Cesium.js provides the most direct path to a working solution with the least custom code. While Three.js offers more flexibility, the 2-3 weeks of development time required to build equivalent geospatial features makes it inefficient for our timeline and requirements. Cesium's purpose-built design for geospatial visualization makes it the pragmatic choice.