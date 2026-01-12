# Component API Documentation

This document provides detailed API documentation for the custom components used in the Kafkasder Management Panel.

## Table of Contents

- [Shared Components](#shared-components)
  - [PageHeader](#pageheader)
  - [DataTable](#datatable)
  - [StatCard](#statcard)
  - [EmptyState](#emptystate)
  - [LoadingState](#loadingstate)
  - [QueryError](#queryerror)
  - [ErrorBoundary](#errorboundary)
- [UI Components](#ui-components)
  - [Button](#button)
  - [Card](#card)
  - [Dialog](#dialog)
  - [Select](#select)
  - [Input](#input)
  - [Spinner](#spinner)

---

## Shared Components

### PageHeader

A reusable page header component with title, description, and optional action button.

**Location:** `@/components/shared/page-header`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | Page title |
| `description` | `string` | No | - | Optional description text |
| `action` | `ReactNode` | No | - | Optional action button or component |
| `className` | `string` | No | - | Additional CSS classes |

**Example:**

```tsx
<PageHeader
  title="İhtiyaç Sahipleri"
  description="Sosyal yardım alan kişilerin listesi"
  action={
    <Button onClick={() => router.push('/yeni')}>
      <Plus className="mr-2 h-4 w-4" />
      Yeni Ekle
    </Button>
  }
/>
```

---

### DataTable

A feature-rich data table component built on TanStack Table with search, filtering, and pagination.

**Location:** `@/components/shared/data-table`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `columns` | `ColumnDef<T>[]` | Yes | - | Table column definitions |
| `data` | `T[]` | Yes | - | Table data array |
| `isLoading` | `boolean` | No | `false` | Loading state |
| `searchPlaceholder` | `string` | No | - | Search input placeholder |
| `searchColumn` | `string` | No | - | Column key to search in |
| `filters` | `FilterConfig[]` | No | - | Array of filter configurations |
| `onRowClick` | `(row: T) => void` | No | - | Callback when row is clicked |

**Example:**

```tsx
<DataTable
  columns={columns}
  data={beneficiaries}
  isLoading={isLoading}
  searchPlaceholder="İsim ile ara..."
  searchColumn="ad"
  onRowClick={(row) => router.push(`/ihtiyac-sahipleri/${row.id}`)}
/>
```

---

### StatCard

A card component for displaying statistics with trend indicators.

**Location:** `@/components/shared/stat-card`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | Statistic title |
| `value` | `string \| number` | Yes | - | Statistic value |
| `icon` | `LucideIcon` | No | - | Icon component |
| `trend` | `number` | No | - | Trend percentage (positive/negative) |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger'` | No | `'default'` | Visual variant |

**Example:**

```tsx
<StatCard
  title="Toplam Bağış"
  value="₺125,000"
  icon={DollarSign}
  trend={12.5}
  variant="success"
/>
```

---

### EmptyState

A component for displaying empty states with customizable messages and actions.

**Location:** `@/components/shared/empty-state`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `'default' \| 'search' \| 'error' \| 'success'` | No | `'default'` | Visual variant |
| `title` | `string` | No | - | Custom title |
| `description` | `string` | No | - | Custom description |
| `action` | `ReactNode` | No | - | Optional action button |

**Example:**

```tsx
<EmptyState
  variant="search"
  title="Sonuç Bulunamadı"
  description="Arama kriterlerinize uygun kayıt yok"
  action={<Button>Filtreleri Temizle</Button>}
/>
```

---

### LoadingState

A skeleton loading component for displaying loading states.

**Location:** `@/components/shared/loading-state`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `'page' \| 'card' \| 'list'` | No | `'page'` | Loading variant |
| `count` | `number` | No | `3` | Number of skeleton items (for card variant) |

**Example:**

```tsx
<LoadingState variant="page" />
<LoadingState variant="card" count={6} />
```

---

### QueryError

A component for displaying API errors with retry functionality.

**Location:** `@/components/shared/query-error`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | No | `'Bir Hata Oluştu'` | Error title |
| `message` | `string` | Yes | - | Error message |
| `onRetry` | `() => void` | No | - | Retry callback |

**Example:**

```tsx
<QueryError
  title="Veri Yüklenemedi"
  message="Bağlantı hatası oluştu. Lütfen tekrar deneyin."
  onRetry={() => refetch()}
/>
```

---

### ErrorBoundary

A React error boundary component for catching and displaying errors.

**Location:** `@/components/shared/error-boundary`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Child components |
| `fallback` | `ReactNode` | No | - | Custom fallback UI |

**Example:**

```tsx
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

---

## UI Components

### Button

A button component with multiple variants and sizes.

**Location:** `@/components/ui/button`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | No | `'default'` | Visual variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | No | `'default'` | Button size |
| `loading` | `boolean` | No | `false` | Loading state |
| `disabled` | `boolean` | No | `false` | Disabled state |
| `children` | `ReactNode` | Yes | - | Button content |

**Example:**

```tsx
<Button variant="default" size="lg" loading={isLoading}>
  Kaydet
</Button>
```

---

### Card

A card component for grouping related content.

**Location:** `@/components/ui/card`

**Components:**

- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Description text
- `CardContent`: Main content area
- `CardFooter`: Footer section

**Example:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Kart Başlığı</CardTitle>
    <CardDescription>Kart açıklaması</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Kart içeriği</p>
  </CardContent>
  <CardFooter>
    <Button>İşlem</Button>
  </CardFooter>
</Card>
```

---

### Dialog

A modal dialog component built on Radix UI.

**Location:** `@/components/ui/dialog`

**Components:**

- `Dialog`: Main container
- `DialogTrigger`: Trigger element
- `DialogContent`: Dialog content
- `DialogHeader`: Header section
- `DialogTitle`: Title text
- `DialogDescription`: Description text
- `DialogFooter`: Footer section

**Example:**

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger>
    <Button>Dialog Aç</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Başlık</DialogTitle>
      <DialogDescription>Açıklama</DialogDescription>
    </DialogHeader>
    <div>İçerik</div>
    <DialogFooter>
      <Button onClick={() => setOpen(false)}>Kapat</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Select

A dropdown select component built on Radix UI.

**Location:** `@/components/ui/select`

**Components:**

- `Select`: Main container
- `SelectTrigger`: Trigger element
- `SelectValue`: Selected value display
- `SelectContent`: Dropdown content
- `SelectItem`: Individual option
- `SelectGroup`: Group of options
- `SelectLabel`: Group label

**Example:**

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Seçiniz" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Seçenek 1</SelectItem>
    <SelectItem value="option2">Seçenek 2</SelectItem>
  </SelectContent>
</Select>
```

---

### Input

A text input component with variants.

**Location:** `@/components/ui/input`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `'text' \| 'password' \| 'email' \| 'number'` | No | `'text'` | Input type |
| `placeholder` | `string` | No | - | Placeholder text |
| `disabled` | `boolean` | No | `false` | Disabled state |
| `className` | `string` | No | - | Additional CSS classes |

**Example:**

```tsx
<Input
  type="email"
  placeholder="E-posta adresi"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

### Spinner

A loading spinner component.

**Location:** `@/components/ui/spinner`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `className` | `string` | No | - | Additional CSS classes |

**Example:**

```tsx
<Spinner className="size-8" />
```

---

## Icon Size Constants

Use the following constants for consistent icon sizing:

**Location:** `@/lib/icon-constants`

```typescript
import { IconSizes, IconUsage } from '@/lib/icon-constants'

// Usage
<Icon className={IconSizes.md} /> // Default (16px)
<Icon className={IconSizes.lg} /> // Large (20px)
<Icon className={IconSizes.xl} /> // Extra large (24px)
```

**Available Sizes:**

- `xs`: `size-3` (12px)
- `sm`: `size-3.5` (14px)
- `md`: `size-4` (16px) - Default
- `lg`: `size-5` (20px)
- `xl`: `size-6` (24px)
- `2xl`: `size-8` (32px)

---

## Best Practices

1. **Use TypeScript**: Always define proper types for component props
2. **Accessibility**: Include proper ARIA labels and keyboard navigation
3. **Responsive Design**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)
4. **Loading States**: Always show loading states for async operations
5. **Error Handling**: Use `QueryError` for API errors and `ErrorBoundary` for component errors
6. **Icon Consistency**: Use `IconSizes` constants for consistent icon sizing
7. **Form Validation**: Use React Hook Form with Zod validation

---

## Contributing

When adding new components:

1. Create the component file in the appropriate directory
2. Add TypeScript interfaces for props
3. Include JSDoc comments for complex props
4. Add examples to this documentation
5. Write unit tests for the component
6. Update the component API documentation

For more information, see the [Style Guide](./STYLE_GUIDE.md) and [Contributing Guide](./CONTRIBUTING.md).
