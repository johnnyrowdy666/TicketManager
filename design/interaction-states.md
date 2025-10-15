# TicketManager Interaction States & Micro-interactions

## 🎯 Interaction Design Principles

### Core Principles
1. **Feedback**: Every user action should provide immediate visual feedback
2. **Consistency**: Similar interactions should behave the same way across the application
3. **Accessibility**: All states must be accessible via keyboard and screen readers
4. **Performance**: Animations should be smooth (60fps) and respect user preferences

## 🎨 Component Interaction States

### Button States

#### Primary Button
```css
/* Default State */
.btn-primary {
  background-color: var(--primary-600);
  color: var(--text-inverse);
  border: 1px solid var(--primary-600);
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover State */
.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-700);
  border-color: var(--primary-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Active State */
.btn-primary:active:not(:disabled) {
  background-color: var(--primary-800);
  border-color: var(--primary-800);
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Focus State */
.btn-primary:focus:not(:disabled) {
  outline: none;
  box-shadow: var(--shadow-sm), 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Loading State */
.btn-primary.loading {
  position: relative;
  color: transparent;
  pointer-events: none;
}

.btn-primary.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid transparent;
  border-top-color: var(--text-inverse);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Disabled State */
.btn-primary:disabled {
  background-color: var(--neutral-300);
  border-color: var(--neutral-300);
  color: var(--neutral-500);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Secondary Button
```css
.btn-secondary {
  background-color: transparent;
  color: var(--primary-600);
  border: 1px solid var(--primary-600);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--primary-50);
  color: var(--primary-700);
  border-color: var(--primary-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:active:not(:disabled) {
  background-color: var(--primary-100);
  transform: translateY(0);
}
```

#### Danger Button
```css
.btn-danger {
  background-color: var(--error-500);
  color: var(--text-inverse);
  border: 1px solid var(--error-500);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--error-600);
  border-color: var(--error-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-danger:focus:not(:disabled) {
  box-shadow: var(--shadow-sm), 0 0 0 3px rgba(239, 68, 68, 0.2);
}
```

### Card States

```css
.card {
  background-color: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

/* Hover State */
.card:hover {
  border-color: var(--border-medium);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

/* Focus State (for keyboard navigation) */
.card:focus-within {
  outline: none;
  border-color: var(--primary-400);
  box-shadow: var(--shadow-lg), 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Active State */
.card:active {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Selected State */
.card.selected {
  border-color: var(--primary-500);
  background-color: var(--primary-50);
  box-shadow: var(--shadow-md), 0 0 0 2px rgba(59, 130, 246, 0.2);
}
```

### Form Input States

```css
.form-input {
  background-color: var(--surface);
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus State */
.form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Valid State */
.form-input:valid {
  border-color: var(--success-500);
}

.form-input:valid:focus {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/* Invalid State */
.form-input:invalid {
  border-color: var(--error-500);
  background-color: var(--error-50);
}

.form-input:invalid:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Disabled State */
.form-input:disabled {
  background-color: var(--neutral-100);
  border-color: var(--neutral-300);
  color: var(--neutral-500);
  cursor: not-allowed;
}

/* Placeholder State */
.form-input::placeholder {
  color: var(--neutral-400);
  opacity: 1;
}
```

### Navigation States

```css
.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

/* Hover State */
.nav-link:hover {
  color: var(--text-primary);
  background-color: var(--neutral-100);
}

/* Active State */
.nav-link.active {
  color: var(--primary-600);
  background-color: var(--primary-50);
  font-weight: var(--font-medium);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 20px;
  height: 2px;
  background-color: var(--primary-600);
  border-radius: 1px;
  transform: translateX(-50%);
}

/* Focus State */
.nav-link:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
```

## 🎭 Toast Notification States

```css
.toast {
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enter Animation */
.toast.show {
  transform: translateX(0);
  opacity: 1;
}

/* Exit Animation */
.toast.hide {
  transform: translateX(100%);
  opacity: 0;
}

/* Success Toast */
.toast.success {
  border-left: 4px solid var(--success-500);
  background-color: var(--success-50);
  color: var(--success-700);
}

/* Error Toast */
.toast.error {
  border-left: 4px solid var(--error-500);
  background-color: var(--error-50);
  color: var(--error-700);
}

/* Warning Toast */
.toast.warning {
  border-left: 4px solid var(--warning-500);
  background-color: var(--warning-50);
  color: var(--warning-700);
}

/* Info Toast */
.toast.info {
  border-left: 4px solid var(--info-500);
  background-color: var(--info-50);
  color: var(--info-700);
}
```

## 🎬 Micro-interactions & Animations

### Page Transitions
```css
/* Page fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-content {
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Stagger animation for card grids */
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 100ms; }
.card:nth-child(3) { animation-delay: 200ms; }
.card:nth-child(4) { animation-delay: 300ms; }
```

### Loading States
```css
/* Skeleton loading animation */
@keyframes skeleton {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, var(--neutral-200) 25%, var(--neutral-100) 50%, var(--neutral-200) 75%);
  background-size: 200px 100%;
  animation: skeleton 1.5s infinite linear;
}

/* Pulse animation for loading buttons */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.loading-pulse {
  animation: pulse 2s infinite;
}
```

### Search Input Animation
```css
.search-input {
  position: relative;
}

.search-input::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-500);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:focus-within::after {
  width: 100%;
}
```

## ♿ Accessibility Considerations

### Focus Management
```css
/* High contrast focus indicators */
@media (prefers-contrast: high) {
  .btn:focus,
  .form-input:focus,
  .nav-link:focus {
    outline: 3px solid var(--text-primary);
    outline-offset: 2px;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader States
```css
/* Screen reader only text for state changes */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Announce state changes */
.btn.loading::before {
  content: 'กำลังโหลด';
  @extend .sr-only;
}

.form-input:invalid + .error-message {
  color: var(--error-600);
  font-size: var(--text-sm);
  margin-top: var(--space-1);
}
```

## 📱 Touch & Mobile Interactions

### Touch Targets
```css
/* Minimum 44px touch targets */
.btn,
.nav-link,
.form-input {
  min-height: 44px;
  min-width: 44px;
}

/* Touch feedback */
@media (hover: none) {
  .btn:active {
    background-color: var(--primary-700);
    transform: scale(0.98);
  }
  
  .card:active {
    transform: scale(0.98);
  }
}
```

### Swipe Gestures
```css
/* Swipe indicators for mobile carousels */
.swipe-indicator {
  position: relative;
}

.swipe-indicator::after {
  content: '← Swipe →';
  position: absolute;
  bottom: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  color: var(--neutral-400);
  font-size: var(--text-sm);
  opacity: 0;
  animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
```

## 🎯 Performance Considerations

### GPU Acceleration
```css
/* Use transform and opacity for smooth animations */
.card,
.btn,
.toast {
  will-change: transform, opacity;
}

/* Remove will-change after animation */
.animation-complete {
  will-change: auto;
}
```

### Efficient Transitions
```css
/* Use transform instead of changing layout properties */
.hover-lift:hover {
  transform: translateY(-4px); /* Instead of margin-top: -4px */
}

/* Use opacity instead of visibility */
.fade-transition {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fade-transition.visible {
  opacity: 1;
}
```