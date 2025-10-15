# TicketManager Design System

## 🎨 Enhanced Color Palette

### Primary Colors
```css
:root {
  /* Brand Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;  /* Main brand color */
  --primary-600: #2563eb;  /* Current accent */
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* Neutral Colors */
  --neutral-50: #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;  /* Current muted */
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;  /* Current text */

  /* Semantic Colors */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  --success-700: #15803d;

  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  --warning-700: #b45309;

  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  --error-700: #b91c1c;

  --info-50: #eff6ff;
  --info-500: #3b82f6;
  --info-600: #2563eb;
  --info-700: #1d4ed8;
}
```

### Updated CSS Variables
```css
:root {
  /* Background & Surface */
  --bg-primary: var(--neutral-50);
  --bg-secondary: #ffffff;
  --surface: #ffffff;
  --surface-elevated: #ffffff;

  /* Text */
  --text-primary: var(--neutral-900);
  --text-secondary: var(--neutral-600);
  --text-muted: var(--neutral-500);
  --text-inverse: #ffffff;

  /* Brand */
  --brand-primary: var(--primary-600);
  --brand-secondary: var(--primary-500);
  --brand-light: var(--primary-100);

  /* Borders */
  --border-light: var(--neutral-200);
  --border-medium: var(--neutral-300);
  --border-strong: var(--neutral-400);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

## 📝 Typography System

### Font Stack
```css
:root {
  --font-primary: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-thai: 'Sarabun', 'Noto Sans Thai', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
}

body {
  font-family: var(--font-thai);
  font-feature-settings: 'kern' 1, 'liga' 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Type Scale
```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### Typography Classes
```css
.text-display-1 {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
}

.text-display-2 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
}

.text-heading-1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
}

.text-heading-2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

.text-heading-3 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

.text-body-lg {
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
}

.text-body {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}

.text-body-sm {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}

.text-caption {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## 🧩 Component System

### Spacing Scale
```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Border Radius
```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-base: 0.25rem;  /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-3xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;
}
```

### Enhanced Button System
```css
/* Base Button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-tight);
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  user-select: none;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Button Variants */
.btn-primary {
  background-color: var(--brand-primary);
  color: var(--text-inverse);
  border-color: var(--brand-primary);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-700);
  border-color: var(--primary-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: transparent;
  color: var(--brand-primary);
  border-color: var(--brand-primary);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--brand-light);
  transform: translateY(-1px);
}

.btn-ghost {
  background-color: transparent;
  color: var(--text-secondary);
  border-color: transparent;
}

.btn-ghost:hover:not(:disabled) {
  background-color: var(--neutral-100);
  color: var(--text-primary);
}

.btn-danger {
  background-color: var(--error-500);
  color: var(--text-inverse);
  border-color: var(--error-500);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--error-600);
  border-color: var(--error-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Button Sizes */
.btn-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
}

.btn-lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-base);
}

.btn-xl {
  padding: var(--space-5) var(--space-8);
  font-size: var(--text-lg);
}
```

### Enhanced Card System
```css
.card {
  background-color: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.card:hover {
  border-color: var(--border-medium);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-elevated {
  box-shadow: var(--shadow-md);
}

.card-elevated:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

.card-body {
  padding: var(--space-6);
}

.card-body-sm {
  padding: var(--space-4);
}

.card-body-lg {
  padding: var(--space-8);
}

.card-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-light);
}

.card-footer {
  padding: var(--space-6);
  border-top: 1px solid var(--border-light);
  background-color: var(--neutral-50);
}
```

### Form System
```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.form-input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background-color: var(--surface);
  color: var(--text-primary);
  transition: all 0.2s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.form-input:invalid {
  border-color: var(--error-500);
}

.form-input:invalid:focus {
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
}
```

## 📱 Responsive Breakpoints
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Grid System */
.grid-responsive {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

@media (min-width: 640px) {
  .grid-responsive {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  }
}
```

## ♿ Accessibility Guidelines

### Focus Management
- All interactive elements must have visible focus indicators
- Focus should be trapped within modals and dropdowns
- Skip links should be provided for keyboard navigation

### Color Contrast
- Text on background: minimum 4.5:1 ratio (WCAG AA)
- Large text (18px+): minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio for borders/icons

### Screen Reader Support
- All images must have appropriate alt text
- Form inputs must have associated labels
- Interactive elements must have descriptive aria-labels
- Status messages should use aria-live regions

### Motion & Animation
- Respect prefers-reduced-motion setting
- Animations should be subtle and purposeful
- Provide alternatives for motion-based interactions