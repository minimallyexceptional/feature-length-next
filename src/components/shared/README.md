# Shared Components

This directory contains shared components that can be used throughout the application.

## Button

The `Button` component provides a consistent button styling across the entire application.

### Usage

```tsx
import Button from './shared/Button';

// Primary button (default)
<Button onClick={() => console.log('Clicked')}>Click Me</Button>

// With an icon
<Button icon={<Save size={18} />}>Save</Button>

// Icon on the right
<Button icon={<ArrowRight size={18} />} iconPosition="right">Next</Button>

// Different variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (Default)</Button>
<Button size="lg">Large</Button>

// Full width button
<Button fullWidth>Full Width</Button>

// Loading state
<Button isLoading>Loading</Button>

// Disabled state
<Button disabled>Disabled</Button>
```

### Props

| Prop           | Type                                           | Default      | Description                           |
|----------------|------------------------------------------------|--------------|---------------------------------------|
| `variant`      | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'`  | The visual style of the button        |
| `size`         | `'sm' \| 'md' \| 'lg'`                         | `'md'`       | The size of the button                |
| `icon`         | `ReactNode`                                    | `undefined`  | Optional icon to display              |
| `iconPosition` | `'left' \| 'right'`                            | `'left'`     | Position of the icon                  |
| `fullWidth`    | `boolean`                                      | `false`      | Whether button should take full width |
| `isLoading`    | `boolean`                                      | `false`      | Shows loading spinner when true       |
| `className`    | `string`                                       | `''`         | Additional CSS classes                |
| `disabled`     | `boolean`                                      | `false`      | Disables the button                   |

Plus all standard button attributes from React's `ButtonHTMLAttributes<HTMLButtonElement>`. 