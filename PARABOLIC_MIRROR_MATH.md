# Parabolic Mirror Mathematics

## Overview

This document explains the mathematical principles behind parabolic reflectors and their implementation in ray tracing systems.

## 1. Parabola Fundamentals

### Standard Parabola Equation

A parabola with vertex at the origin and axis of symmetry along the y-axis:

```
y = (1/4f) * x²
```

Where:

- `f` is the **focal length** (distance from vertex to focus)
- The focus is at point `(0, f)`
- All rays parallel to the axis of symmetry will reflect through the focus

### General Parabola Form

```
y = ax² + bx + c
```

Where:

- `a` determines the curvature (positive = opens upward)
- `b` shifts the parabola horizontally
- `c` shifts the parabola vertically

## 2. Ray-Parabola Intersection

### Ray Parametric Equation

A ray can be represented as:

```
P(t) = P₀ + t * d⃗
```

Where:

- `P₀` is the ray origin point
- `d⃗` is the direction vector (normalized)
- `t` is the parameter (0 ≤ t ≤ 1 for ray segments)

### Intersection Calculation

**Step 1: Substitute ray into parabola equation**

For ray: `x = x₀ + t*dx`, `y = y₀ + t*dy`
For parabola: `y = ax² + bx + c`

Substituting:

```
y₀ + t*dy = a*(x₀ + t*dx)² + b*(x₀ + t*dx) + c
```

**Step 2: Expand and rearrange**

```
y₀ + t*dy = a*(x₀² + 2*x₀*t*dx + t²*dx²) + b*(x₀ + t*dx) + c
y₀ + t*dy = a*x₀² + 2*a*x₀*t*dx + a*t²*dx² + b*x₀ + b*t*dx + c
```

**Step 3: Form quadratic equation**

Rearranging to `At² + Bt + C = 0`:

```
a*dx²*t² + (2*a*x₀*dx + b*dx - dy)*t + (a*x₀² + b*x₀ + c - y₀) = 0
```

Where:

- `A = a*dx²`
- `B = 2*a*x₀*dx + b*dx - dy`
- `C = a*x₀² + b*x₀ + c - y₀`

**Step 4: Solve quadratic**

```
t = (-B ± √(B² - 4AC)) / (2A)
```

Choose the smallest positive `t` that's within the ray's length.

## 3. Surface Normal Calculation

### Tangent and Normal Vectors

For parabola `y = ax² + bx + c`:

**Tangent slope:** `dy/dx = 2ax + b`

**Normal vector:** `n⃗ = (-(2ax + b), 1)`

**Normalized normal:** `n⃗ = (-(2ax + b), 1) / √((2ax + b)² + 1)`

The normal points "outward" from the surface (away from the interior of the parabola).

## 4. Reflection Law

### Vector Reflection Formula

The law of reflection states that the angle of incidence equals the angle of reflection. In vector form:

```
R⃗ = I⃗ - 2(I⃗ · n⃗)n⃗
```

Where:

- `I⃗` is the incident ray direction (normalized)
- `n⃗` is the surface normal (normalized, pointing outward)
- `R⃗` is the reflected ray direction

### Implementation Steps

1. **Normalize incident vector:** `I⃗ = incident / |incident|`
2. **Calculate dot product:** `dot = I⃗ · n⃗`
3. **Apply reflection formula:** `R⃗ = I⃗ - 2*dot*n⃗`

## 5. Key Properties of Parabolic Mirrors

### Focusing Property

- **Parallel rays** hitting a parabolic mirror all reflect through the **focus**
- **Rays from focus** reflect as **parallel rays**
- This makes parabolic mirrors ideal for:
  - Solar concentrators
  - Telescope mirrors
  - Satellite dishes
  - Flashlight reflectors

### Focal Length Relationship

For a parabola `y = (1/4f)*x²`:

- Focus is at `(0, f)`
- Focal length `f` determines the curvature
- Smaller `f` = more curved = stronger focusing
- Larger `f` = less curved = weaker focusing

## 6. Implementation Considerations

### Coordinate Systems

- Transform rays to parabola's local coordinate system
- Handle rotation and translation of the parabola
- Convert back to world coordinates for rendering

### Numerical Stability

- Check for parallel rays (denominator near zero)
- Handle edge cases (ray tangent to parabola)
- Use appropriate epsilon values for floating-point comparisons

### Performance Optimization

- Early rejection of rays that can't intersect
- Bounding box checks before detailed intersection
- Efficient normal calculation caching

## 7. Example Usage

```typescript
// Create a parabolic mirror
const mirror = new ParabolicMirror({
  vertex: { x: 100, y: 100 },
  focalLength: 50,
  width: 200,
});

// The mirror will focus parallel rays to the focus point
// Focus is at: (vertex.x, vertex.y + focalLength)
```

## 8. Advanced Topics

### Off-Axis Parabolic Mirrors

- Parabolas rotated or translated
- More complex intersection calculations
- Useful for non-centered optical systems

### Aberrations

- Spherical aberration (not present in perfect parabolas)
- Coma and astigmatism in off-axis systems
- Manufacturing tolerances and surface roughness

### 3D Extensions

- Parabolic surfaces in 3D space
- Ray tracing through 3D parabolic mirrors
- Integration with 3D rendering pipelines

This mathematical foundation provides the basis for accurate ray tracing through parabolic optical elements, enabling realistic simulation of focusing systems and optical devices.
