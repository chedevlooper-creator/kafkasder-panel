# Style Guide

This document provides guidelines for maintaining consistent code style and design patterns in the Kafkasder Management Panel.

## Table of Contents

- [Code Style](#code-style)
- [Component Patterns](#component-patterns)
- [Design System](#design-system)
- [Typography](#typography)
- [Colors](#colors)
- [Spacing](#spacing)
- [Icons](#icons)
- [Forms](#forms)
- [Responsive Design](#responsive-design)

---

## Code Style

### TypeScript

- Use TypeScript strict mode
- Avoid `any` types - use proper type definitions
- Use interfaces for object shapes
- Use type aliases for unions and primitives
- Add JSDoc comments for complex functions

**Example:**

```typescript
// Good
interface User {
  id: number
  name: string
  email: string
}

type UserRole = 'admin' | 'user' | 'guest'

function getUser(id: number): Promise<User> {
  // Implementation
}

// Bad
function getUser(id: any): any {
  // Implementation
}
```

### Naming Conventions

- **Components**: PascalCase (`PageHeader`, `DataTable`)
- **Functions/Variables**: camelCase (`formatCurrency`, `isLoading`)
- **Types/Interfaces**: PascalCase (`UserProps`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Files**: kebab-case (`page-header.tsx`, `use-api.ts`)

### Import Organization

```typescript
// 1. External libraries (React, third-party libs)
import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

// 2. Internal imports (components, hooks, lib)
import { PageHeader } from '@/components/shared/page-header'
import { useDashboardStats } from '@/hooks/use-api'
import { formatCurrency } from '@/lib/utils'
```

### File Structure

```
src/
├── app/              # Next.js App Router
├── components/
│   ├── features/     # Feature-specific components
│   ├── layout/       # Layout components
│   ├── shared/       # Shared/reusable components
│   └── ui/           # shadcn/ui components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── stores/           # Zustand state management
└── types/            # TypeScript type definitions
```

---

## Component Patterns

### Component Structure

```typescript
'use client'

// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Types/Interfaces
interface MyComponentProps {
  title: string
  onSave: () => void
}

// 3. Component
export function MyComponent({ title, onSave }: MyComponentProps) {
  // 4. Hooks
  const [isOpen, setIsOpen] = useState(false)

  // 5. Event handlers
  const handleSave = () => {
    onSave()
    setIsOpen(false)
  }

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleSave}>Kaydet</Button>
    </div>
  )
}
```

### Props Pattern

- Define explicit TypeScript interfaces
- Use optional props with `?`
- Provide default values when appropriate
- Use `children` prop for composition

**Example:**

```typescript
interface CardProps {
  title: string
  description?: string
  variant?: 'default' | 'primary'
  children?: React.ReactNode
}

export function Card({ title, description, variant = 'default', children }: CardProps) {
  return (
    <div className={`card card-${variant}`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  )
}
```

### Loading States

Use consistent loading patterns:

```typescript
// For page-level loading
if (isLoading) {
  return <LoadingState variant="page" />
}

// For component-level loading
{isLoading && <Spinner className="size-4" />}

// For button loading
<Button loading={isSubmitting}>Kaydet</Button>
```

### Error Handling

```typescript
// API errors
{error && <QueryError message={error.message} onRetry={refetch} />}

// Component errors
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

---

## Design System

### Colors

Use Tailwind's semantic color tokens:

- **Primary**: `bg-primary`, `text-primary`, `border-primary`
- **Secondary**: `bg-secondary`, `text-secondary`
- **Accent**: `bg-accent`, `text-accent`
- **Destructive**: `bg-destructive`, `text-destructive`
- **Muted**: `bg-muted`, `text-muted-foreground`
- **Background**: `bg-background`
- **Foreground**: `text-foreground`

**Example:**

```tsx
<Button variant="default" className="bg-primary text-primary-foreground">
  Primary Action
</Button>

<Button variant="destructive" className="bg-destructive text-destructive-foreground">
  Delete
</Button>
```

### Typography

**Font Sizes:**

- `text-xs`: 12px - Small labels
- `text-sm`: 14px - Body text
- `text-base`: 16px - Default text
- `text-lg`: 18px - Subheadings
- `text-xl`: 20px - Headings
- `text-2xl`: 24px - Large headings
- `text-3xl`: 30px - Page titles

**Font Weights:**

- `font-normal`: 400
- `font-medium`: 500
- `font-semibold`: 600
- `font-bold`: 700

**Example:**

```tsx
<h1 className="text-2xl font-bold">Page Title</h1>
<p className="text-sm text-muted-foreground">Description</p>
```

### Spacing

Use Tailwind's spacing scale:

- `p-1` to `p-6`: Padding (4px to 24px)
- `m-1` to `m-6`: Margin (4px to 24px)
- `gap-1` to `gap-6`: Gap between elements (4px to 24px)
- `space-y-1` to `space-y-6`: Vertical spacing (4px to 24px)

**Example:**

```tsx
<div className="p-6 space-y-4">
  <h2>Title</h2>
  <p>Content</p>
</div>
```

### Borders

- `border`: 1px solid border
- `border-2`: 2px solid border
- `border-r`, `border-l`, `border-t`, `border-b`: Directional borders
- `rounded`: 4px radius
- `rounded-md`: 6px radius
- `rounded-lg`: 8px radius
- `rounded-xl`: 12px radius
- `rounded-full`: Full circle

**Example:**

```tsx
<div className="border rounded-lg p-4">
  Content with border
</div>
```

---

## Icons

Use `lucide-react` for icons. Import from the library:

```typescript
import { Plus, Edit, Trash2, Search } from 'lucide-react'
```

### Icon Sizes

Use the `IconSizes` constants from `@/lib/icon-constants`:

```typescript
import { IconSizes, IconUsage } from '@/lib/icon-constants'

<Plus className={IconSizes.md} /> // Default (16px)
<Edit className={IconSizes.lg} /> // Large (20px)
<Trash2 className={IconSizes.xl} /> // Extra large (24px)
```

### Common Icon Patterns

```tsx
// Button with icon
<Button>
  <Plus className={IconSizes.md} />
  <span className="ml-2">Yeni Ekle</span>
</Button>

// Action buttons
<Button variant="ghost" size="icon">
  <Edit className={IconSizes.md} />
</Button>

// Status icons
<div className="flex items-center gap-2">
  <CheckCircle className={IconSizes.sm} />
  <span>Onaylandı</span>
</div>
```

---

## Forms

### Form Structure

Use React Hook Form with Zod validation:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin'),
})

type FormData = z.infer<typeof schema>

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>İsim</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Kaydet</Button>
      </form>
    </Form>
  )
}
```

### Form Validation

- Use Zod schemas for validation
- Provide clear error messages in Turkish
- Show validation errors inline
- Disable submit button while submitting

---

## Responsive Design

### Breakpoints

- `sm`: 640px - Small screens
- `md`: 768px - Tablets
- `lg`: 1024px - Laptops
- `xl`: 1280px - Desktops
- `2xl`: 1536px - Large screens

### Responsive Patterns

```tsx
// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Flex layout
<div className="flex flex-col md:flex-row gap-4">
  {/* Content */}
</div>

// Hidden/Visible
<div className="hidden md:block">
  {/* Desktop only */}
</div>

<div className="block md:hidden">
  {/* Mobile only */}
</div>

// Text size
<h1 className="text-xl md:text-2xl lg:text-3xl">
  Responsive heading
</h1>
```

### Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```tsx
// Good - mobile-first
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-lg md:text-xl lg:text-2xl">Title</h1>
</div>

// Bad - desktop-first
<div className="p-8 lg:p-6 md:p-4">
  <h1 className="text-3xl lg:text-xl md:text-lg">Title</h1>
</div>
```

---

## Accessibility

### ARIA Labels

```tsx
<Button aria-label="Kapat">
  <X />
</Button>

<input
  type="text"
  aria-label="Arama"
  placeholder="Ara..."
/>
```

### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Use semantic HTML elements
- Provide focus indicators

```tsx
// Good - semantic
<button onClick={handleClick}>Click</button>

// Bad - non-semantic without proper attributes
<div onClick={handleClick} role="button" tabIndex={0}>
  Click
</div>
```

### Alt Text

```tsx
<img
  src="/logo.png"
  alt="Kafkasder Logo"
  width={200}
  height={50}
/>
```

---

## Performance

### Code Splitting

Use dynamic imports for heavy components:

```typescript
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Spinner />,
  ssr: false,
})
```

### Image Optimization

Use Next.js Image component:

```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
/>
```

### Memoization

Use `useMemo` and `useCallback` for expensive operations:

```typescript
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.name.localeCompare(b.name))
}, [data])

const handleClick = useCallback(() => {
  // Handler logic
}, [dependency])
```

---

## Best Practices

1. **Keep components small**: Single responsibility principle
2. **Use composition**: Prefer composition over inheritance
3. **Avoid prop drilling**: Use context or state management
4. **Type everything**: Leverage TypeScript for type safety
5. **Write tests**: Unit tests for utilities, integration tests for features
6. **Follow conventions**: Consistent naming and structure
7. **Document complex logic**: Use comments and JSDoc
8. **Optimize for performance**: Lazy loading, memoization, code splitting
9. **Test on mobile**: Ensure responsive design works
10. **Use semantic HTML**: Better accessibility and SEO

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
