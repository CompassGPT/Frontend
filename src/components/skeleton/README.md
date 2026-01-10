# Skeleton Loading Components

A comprehensive set of skeleton loading components for displaying placeholder content while data is being fetched.

## Features

- 🎨 **Dark mode support** - Automatically adapts to light/dark themes
- ⚡ **Two animation types** - Pulse (default) and shimmer/wave
- 🎯 **Multiple variants** - Text, rectangular, and circular shapes
- 📦 **Pre-built layouts** - Ready-to-use skeletons for common patterns
- 🔧 **Highly customizable** - Props for width, height, and styling

## Components

### Base Component

#### `<Skeleton />`

The foundational skeleton component that all others are built upon.

```tsx
import { Skeleton } from "@/components/skeleton";

<Skeleton variant="text" className="h-4 w-full" />
<Skeleton variant="rectangular" width={200} height={100} />
<Skeleton variant="circular" className="h-12 w-12" />
<Skeleton animation="wave" className="h-8 w-48" />
```

**Props:**

- `variant`: `"text" | "rectangular" | "circular"` (default: `"rectangular"`)
- `width`: `string | number` - CSS width value
- `height`: `string | number` - CSS height value
- `animation`: `"pulse" | "wave"` (default: `"pulse"`)
- `className`: Additional Tailwind classes

### Layout Components

#### `<ModuleCardSkeleton />` & `<ModuleGridSkeleton />`

Skeleton for module cards in list view.

```tsx
import { ModuleCardSkeleton, ModuleGridSkeleton } from "@/components/skeleton";

// Single card
<ModuleCardSkeleton />

// Grid of cards
<ModuleGridSkeleton count={5} />
```

#### `<ModuleDetailSkeleton />`

Full-page skeleton for module detail view.

```tsx
import { ModuleDetailSkeleton } from "@/components/skeleton";

{
  isLoading ? <ModuleDetailSkeleton /> : <ModuleContent />;
}
```

#### `<ProfileSkeleton />`

Complete skeleton for user profile page.

```tsx
import { ProfileSkeleton } from "@/components/skeleton";

{
  isLoading ? <ProfileSkeleton /> : <ProfileContent />;
}
```

#### `<FormSkeleton />`

Skeleton for form loading states.

```tsx
import { FormSkeleton } from "@/components/skeleton";

<FormSkeleton />;
```

### Utility Components

#### `<TextSkeleton />`

Multi-line text placeholder.

```tsx
import { TextSkeleton } from "@/components/skeleton";

<TextSkeleton lines={3} />;
```

**Props:**

- `lines`: `number` - Number of text lines (default: 3)
- `className`: Additional styling

#### `<CardSkeleton />`

Generic card with optional image and footer.

```tsx
import { CardSkeleton } from "@/components/skeleton";

<CardSkeleton showImage={true} showFooter={true} />;
```

**Props:**

- `showImage`: `boolean` - Show image placeholder
- `showFooter`: `boolean` - Show footer section
- `className`: Additional styling

#### `<ListSkeleton />`

List of items with optional avatars.

```tsx
import { ListSkeleton } from "@/components/skeleton";

<ListSkeleton count={5} showAvatar={true} />;
```

**Props:**

- `count`: `number` - Number of list items (default: 5)
- `showAvatar`: `boolean` - Show avatar circles
- `className`: Additional styling

## Usage Patterns

### Basic Loading State

```tsx
function MyComponent() {
  const { data, loading } = useData();

  if (loading) {
    return <ModuleGridSkeleton count={6} />;
  }

  return <DataDisplay data={data} />;
}
```

### Conditional Sections

```tsx
{
  loading ? (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <TextSkeleton lines={4} />
    </div>
  ) : (
    <Content />
  );
}
```

### Custom Skeleton

```tsx
function CustomSkeleton() {
  return (
    <div className="flex gap-4">
      <Skeleton variant="circular" className="h-16 w-16" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
```

## Styling

All skeleton components support Tailwind CSS classes and respect the dark mode theme:

- Light mode: Gray 200/300 colors
- Dark mode: Gray 700/600 colors

### Animations

**Pulse** (default): Gentle opacity pulsing

```tsx
<Skeleton animation="pulse" />
```

**Wave/Shimmer**: Gradient moving across the skeleton

```tsx
<Skeleton animation="wave" />
```

## Best Practices

1. **Match the layout**: Skeleton should closely resemble the final content layout
2. **Use appropriate count**: Show realistic number of skeleton items
3. **Consistent animations**: Stick to one animation type per view
4. **Accessible**: Skeletons include `aria-hidden="true"` by default
5. **Performance**: Skeletons are lightweight and render quickly

## Examples

### Page-Level Loading

```tsx
export function ModulesPage() {
  const { modules, loading } = useModules();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ModuleGridSkeleton count={5} />
      </div>
    );
  }

  return <ModulesList modules={modules} />;
}
```

### Component-Level Loading

```tsx
function UserCard({ userId }) {
  const { user, loading } = useUser(userId);

  return (
    <div className="card">
      {loading ? (
        <>
          <Skeleton variant="circular" className="h-20 w-20" />
          <TextSkeleton lines={2} className="mt-4" />
        </>
      ) : (
        <>
          <Avatar src={user.avatar} />
          <UserInfo user={user} />
        </>
      )}
    </div>
  );
}
```
