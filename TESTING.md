# Testing Setup für OK9 SaaS Starter Kit

> **Version:** 1.2.0
> **Letzte Aktualisierung:** 2024-09-29
> **Status:** Production Ready

### 🔗 Verwandte Dokumentation
- [Claude Code Configuration](./CLAUDE.md)
- [Product Requirements Document](./OK9-SaaS-Starter-Kit-PRD.md)
- [Frontend Components](./src/components/README.md)

## 🧪 Test-Framework

Das Projekt verwendet **Vitest** als Test-Runner in Kombination mit **React Testing Library** für Komponententests.

### Installierte Abhängigkeiten

- `vitest` - Test-Runner (Vite-basiert)
- `@vitest/ui` - Test UI Interface
- `jsdom` - DOM-Umgebung für Tests
- `@testing-library/react` - React Testing Utilities
- `@testing-library/jest-dom` - DOM Matchers
- `@testing-library/user-event` - User Event Simulation

## ⚙️ Test-Konfiguration

### Vitest Konfiguration (`vitest.config.ts`)

Die Vitest-Konfiguration ist für Next.js optimiert und beinhaltet:

- **Module Aliases**: Unterstützung für `@/`-Importe
- **Test Environment**: jsdom für DOM-Tests
- **Setup**: Automatisches Setup mit `vitest.setup.ts`
- **Coverage**: Coverage-Berichte mit V8 Provider
- **UI Interface**: Web-basierte Test-UI

### Test Setup (`vitest.setup.ts`)

Das Setup beinhaltet:

- **DOM Matchers**: Erweiterte DOM-Matcher
- **Mocks**: Next.js Router, Navigation und Authentication
- **Global Setup**: Globale Test-Konfiguration
- **Environment Variables**: Test-Umgebungsvariablen

## Test-Scripts

Die folgenden Scripts sind in `package.json` verfügbar:

```bash
# Alle Tests ausführen
npm test

# Tests im Watch-Modus
npm run test:watch

# Tests mit Coverage-Bericht
npm run test:coverage

# Test UI Interface öffnen
npm run test:ui
```

## Test-Struktur

### Test-Dateien

Tests folgen dem Pattern `*.test.ts` oder `*.test.tsx` und befinden sich neben den zu testenden Dateien:

```
src/
  components/
    ui/
      button.tsx
      button.test.tsx
  lib/
    utils.ts
    utils.test.ts
  app/
    page.tsx
    page.test.tsx
```

### Beispiel-Tests

#### Utility-Funktionen

```typescript
// src/lib/utils.test.ts
import { cn } from './utils'

describe('cn utility function', () => {
  test('merges class names correctly', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })
})
```

#### React-Komponenten

```typescript
// src/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button Component', () => {
  test('renders button with default variant', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })
})
```

#### Seiten-Komponenten

```typescript
// src/app/page.test.tsx
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  test('renders main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })
})
```

## Best Practices

### Testing Library Principles

1. **Queries nach Accessibility**: Verwende `getByRole`, `getByLabelText` etc.
2. **User-Centric**: Teste das Verhalten aus Benutzersicht
3. **Avoid Implementation Details**: Teste nicht interne Implementierungsdetails

### Jest Best Practices

1. **Descriptive Test Names**: Klare, beschreibende Test-Namen
2. **AAA Pattern**: Arrange-Act-Assert Struktur
3. **Mock External Dependencies**: Mocke externe Abhängigkeiten

## Coverage

Der aktuelle Test-Coverage liegt bei **23.42%** mit folgenden Highlights:

- **Utils**: 100% Coverage
- **Button Component**: 87.5% Coverage
- **Home Page**: 100% Coverage
- **UI Components**: 47.61% Coverage

## Troubleshooting

### Häufige Probleme

#### fetch is not defined

**Lösung**: Das Problem tritt auf, weil Jest in Node.js läuft. Die Lösung ist in `jest.setup.js` implementiert.

#### Module Aliases nicht erkannt

**Lösung**: Überprüfe die `moduleNameMapper`-Konfiguration in `jest.config.js`.

#### act() Warnings

**Lösung**: Diese Warnungen sind normal für komplexe React-Komponenten. Sie können ignoriert werden, solange die Tests grün sind.

### Debugging

```bash
# Ausführliche Ausgabe
npm run test:verbose

# Spezifische Test-Datei
npm test -- src/components/ui/button.test.tsx

# Watch-Modus für Entwicklung
npm run test:watch
```

## Erweiterung

### Neue Tests hinzufügen

1. Erstelle eine Test-Datei neben der zu testenden Datei
2. Importiere die notwendigen Testing Utilities
3. Schreibe Tests nach den Best Practices
4. Führe die Tests aus und überprüfe die Coverage

### Integrationstests

Für komplexere Integrationstests können zusätzliche Tools wie **Cypress** oder **Playwright** hinzugefügt werden.

## CI/CD Integration

Die Tests können in CI/CD-Pipelines integriert werden:

```yaml
# Beispiel GitHub Actions
- name: Run Tests
  run: npm test

- name: Generate Coverage
  run: npm run test:coverage
```

## Nächste Schritte

- [ ] Erweiterung der Test-Coverage auf > 80%
- [ ] Integrationstests für API-Routen
- [ ] E2E-Tests mit Playwright
- [ ] Performance-Tests
- [ ] Accessibility-Tests