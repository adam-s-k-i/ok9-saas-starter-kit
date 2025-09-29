// Custom Components
export { CustomComponent } from './custom/custom-component'
export { ThemeToggle } from './custom/theme-toggle'
export { NotificationToast } from './custom/notification-toast'
export { ResponsiveNavigation } from './custom/responsive-navigation'

// Form Components
export { LoginForm } from './forms/login-form'
export { ContactForm } from './forms/contact-form'

// Error Components
export { ErrorBoundary } from './error/error-boundary'
export { ErrorFallback } from './error/error-fallback'

// Performance Components
export { 
  withLazyLoading, 
  createLazyComponent, 
  LazyHeavyComponent, 
  LazyChart 
} from './performance/lazy-component'
export { 
  OptimizedImage, 
  HeroImage, 
  ThumbnailImage 
} from './performance/optimized-image'

// Contexts
export { ThemeProvider, useTheme } from '../contexts/theme-context'

// Hooks
export { useMediaQuery } from '../hooks/use-media-query'
export { 
  usePerformance, 
  useComponentPerformance, 
  useLazyLoading 
} from '../hooks/use-performance'

// Stores
export { useAppStore } from '../stores/app-store'

// Test Utilities
export * from '../test-utils/test-helpers'
export {
  renderWithProviders
} from '../test-utils/component-test-utils'


