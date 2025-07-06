# Дизайн-система React WASM Utils

Эта папка содержит константы и конфигурацию дизайн-системы проекта.

## Структура

- `design-tokens.ts` - TypeScript константы дизайн-системы
- `demo-pages.ts` - конфигурация демо-страниц

## Использование дизайн-токенов

### В CSS модулях

Используйте CSS переменные из `src/styles.css`:

```css
.myComponent {
  color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}
```

### В TypeScript/JavaScript

Импортируйте константы из `design-tokens.ts`:

```typescript
import { colors, spacing, designTokens } from '~/shared/config/design-tokens'

const styles = {
  backgroundColor: colors.primary,
  padding: spacing.md,
  borderRadius: designTokens.borderRadius.md,
}
```

## Цветовая палитра

### Основные цвета

- `--color-primary`: #4fc3f7 (синий)
- `--color-secondary`: #757575 (серый)
- `--color-danger`: #f44336 (красный)
- `--color-warning`: #ffc107 (жёлтый)
- `--color-success`: #4caf50 (зелёный)

### Текст

- `--color-text-primary`: #e6edf3 (основной текст)
- `--color-text-secondary`: #c0c0c0 (вторичный текст)
- `--color-text-muted`: #999 (приглушённый текст)

### Фон

- `--color-bg-primary`: градиент (основной фон)
- `--color-bg-surface`: rgba(30, 30, 30, 0.8) (поверхности)
- `--color-bg-overlay`: rgba(0, 0, 0, 0.5) (оверлей)

## Отступы

```css
--spacing-xs: 0.25rem /* 4px */ --spacing-sm: 0.5rem /* 8px */ --spacing-md: 1rem /* 16px */
  --spacing-lg: 1.5rem /* 24px */ --spacing-xl: 2rem /* 32px */ --spacing-2xl: 3rem /* 48px */;
```

## Типографика

```css
--font-size-xs: 0.8rem /* 12.8px */ --font-size-sm: 0.875rem /* 14px */ --font-size-md: 1rem
  /* 16px */ --font-size-lg: 1.125rem /* 18px */ --font-size-xl: 1.25rem /* 20px */
  --font-size-2xl: 1.5rem /* 24px */ --font-size-3xl: 1.75rem /* 28px */;
```

## Тени и эффекты

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3) --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4) --shadow-lg: 0
  6px 20px rgba(79, 195, 247, 0.4) --shadow-focus: 0 0 0 2px rgba(79, 195, 247, 0.2);
```

## Переходы

```css
--transition-fast: 0.2s ease --transition-normal: 0.3s ease --transition-slow: 0.5s ease;
```

## Z-индексы

```css
--z-index-dropdown: 100 --z-index-sidebar-overlay: 999 --z-index-sidebar: 1000
  --z-index-toggle: 1002;
```

## Примеры использования

### Кнопка с дизайн-токенами

```css
.button {
  background: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.button:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-lg);
}
```

### Карточка компонента

```css
.card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}
```
