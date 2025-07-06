/**
 * Дизайн-система - константы для использования в TypeScript/JavaScript
 * Синхронизированы с CSS переменными в styles.css
 */

export const colors = {
  // Основные цвета
  primary: '#4fc3f7',
  primaryHover: '#29b6f6',
  primaryDark: '#0288d1',

  secondary: '#757575',
  secondaryHover: '#616161',
  secondaryDark: '#424242',

  danger: '#f44336',
  dangerHover: '#d32f2f',
  dangerDark: '#b71c1c',

  warning: '#ffc107',
  success: '#4caf50',

  // Текст
  textPrimary: '#e6edf3',
  textSecondary: '#c0c0c0',
  textMuted: '#999',
  textDisabled: '#666',

  // Фон
  bgPrimary: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
  bgSecondary: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
  bgSurface: 'rgba(30, 30, 30, 0.8)',
  bgSurfaceElevated: 'rgba(40, 40, 40, 0.8)',
  bgOverlay: 'rgba(0, 0, 0, 0.5)',
  bgSidebar: 'rgba(20, 20, 20, 0.95)',

  // Границы
  borderPrimary: '#333',
  borderSecondary: '#444',
  borderFocus: '#4fc3f7',
} as const

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const

export const fontSize = {
  xs: '0.8rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.75rem',
} as const

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
} as const

export const shadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
  md: '0 4px 12px rgba(0, 0, 0, 0.4)',
  lg: '0 6px 20px rgba(79, 195, 247, 0.4)',
  focus: '0 0 0 2px rgba(79, 195, 247, 0.2)',
} as const

export const transitions = {
  fast: '0.2s ease',
  normal: '0.3s ease',
  slow: '0.5s ease',
} as const

export const zIndex = {
  dropdown: 100,
  sidebarOverlay: 999,
  sidebar: 1000,
  toggle: 1002,
} as const

export const dimensions = {
  sidebarWidth: '320px',
  sidebarWidthMobile: '280px',
  toggleButtonSize: '2.5rem',
  toggleButtonSizeMobile: '2rem',
} as const

export const fontFamily = {
  base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
} as const

// Экспорт всех токенов как единый объект
export const designTokens = {
  colors,
  spacing,
  fontSize,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  dimensions,
  fontFamily,
} as const

// Типы для TypeScript
export type Colors = typeof colors
export type Spacing = typeof spacing
export type FontSize = typeof fontSize
export type BorderRadius = typeof borderRadius
export type Shadows = typeof shadows
export type Transitions = typeof transitions
export type ZIndex = typeof zIndex
export type Dimensions = typeof dimensions
export type FontFamily = typeof fontFamily
export type DesignTokens = typeof designTokens
