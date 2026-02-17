# Responsive Design Guidelines

## Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `default` | < 640px | Mobile portrait |
| `sm:` | ≥ 640px | Mobile landscape |
| `md:` | ≥ 768px | Tablet |
| `lg:` | ≥ 1024px | Desktop |
| `xl:` | ≥ 1280px | Large desktop |
| `2xl:` | ≥ 1536px | Extra large |

## Container Strategy

```tsx
// Mobile-first container
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// Full-width on mobile, contained on desktop
<div className="w-full lg:max-w-7xl lg:mx-auto">
  {/* Content */}
</div>
```

## Grid Patterns

### 1 Column (Mobile) → 2 Columns (Tablet) → 3 Columns (Desktop)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>
```

### Bento Grid Responsive
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div className="col-span-1 md:col-span-2 lg:col-span-2">Large Item</div>
  <div className="col-span-1">Small Item</div>
  <div className="col-span-1">Small Item</div>
</div>
```

## Typography Scale

### Headings
```tsx
// Hero Title
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
  Title
</h1>

// Section Title
<h2 className="text-2xl sm:text-3xl md:text-4xl">
  Section Title
</h2>

// Card Title
<h3 className="text-lg sm:text-xl md:text-2xl">
  Card Title
</h3>
```

### Body Text
```tsx
// Large text
<p className="text-base sm:text-lg md:text-xl">
  Large paragraph
</p>

// Regular text
<p className="text-sm sm:text-base">
  Regular paragraph
</p>

// Small text
<span className="text-xs sm:text-sm">
  Small text
</span>
```

## Touch Targets

### Buttons
```tsx
// Minimum touch target: 44x44px
<button className="min-h-[44px] min-w-[44px] px-4 py-2">
  Click Me
</button>

// Larger touch target for mobile
<button className="h-12 px-6 sm:h-10 sm:px-4">
  Mobile Optimized
</button>
```

### Interactive Elements
```tsx
// Cards with touch feedback
<div className="p-4 active:scale-95 transition-transform">
  Card Content
</div>

// Navigation items
<a className="block py-3 px-4 hover:bg-accent">
  Nav Item
</a>
```

## Spacing

### Section Padding
```tsx
// Consistent section spacing
<section className="py-12 sm:py-16 md:py-20 lg:py-24">
  {/* Content */}
</section>
```

### Component Spacing
```tsx
// Card padding
<div className="p-4 sm:p-6 lg:p-8">
  Card Content
</div>

// Gap between items
<div className="flex flex-col gap-4 sm:gap-6">
  {/* Items */}
</div>
```

## Navigation Patterns

### Mobile Navigation
```tsx
// Hamburger menu on mobile, full nav on desktop
<nav className="hidden md:flex">
  {/* Desktop nav items */}</nav>
<button className="md:hidden">
  {/* Hamburger icon */}
</button>
```

### Responsive Sidebar
```tsx
<aside className="fixed inset-y-0 left-0 w-64 transform -translate-x-full 
  lg:translate-x-0 lg:static lg:w-64 transition-transform">
  Sidebar Content
</aside>
```

## Images

### Responsive Images
```tsx
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  className="w-full h-auto object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Aspect Ratio
```tsx
// 16:9 aspect ratio
<div className="aspect-video">
  <Image src="/video-thumb.jpg" fill alt="Video" />
</div>

// 1:1 aspect ratio (square)
<div className="aspect-square">
  <Image src="/avatar.jpg" fill alt="Avatar" />
</div>
```

## Testing Checklist

### Mobile (320px - 767px)
- [ ] All text readable without zooming
- [ ] Touch targets ≥ 44x44px
- [ ] No horizontal scrolling
- [ ] Images scale properly
- [ ] Navigation accessible via hamburger menu

### Tablet (768px - 1023px)
- [ ] 2-column layouts work correctly
- [ ] Touch targets still appropriate
- [ ] No content overflow
- [ ] Sidebar collapses properly

### Desktop (1024px+)
- [ ] Full navigation visible
- [ ] Multi-column layouts
- [ ] Hover states work
- [ ] Maximum content width applied

## Common Patterns

### Hide on Mobile, Show on Desktop
```tsx
<div className="hidden md:block">Desktop Only</div>
```

### Show on Mobile, Hide on Desktop
```tsx
<div className="md:hidden">Mobile Only</div>
```

### Responsive Flex Direction
```tsx
<div className="flex flex-col sm:flex-row">
  {/* Stacks on mobile, side-by-side on desktop */}
</div>
```

### Responsive Text Alignment
```tsx
<div className="text-center sm:text-left">
  Centered on mobile, left on desktop
</div>
```
