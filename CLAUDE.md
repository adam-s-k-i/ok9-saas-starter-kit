# OK9 SaaS Starter Kit - Claude Code Configuration

## Projektübersicht

Das OK9 SaaS Starter Kit ist ein modulares Next.js-basiertes Starter-Kit für die schnelle Entwicklung von SaaS-Anwendungen. Diese Konfiguration definiert spezialisierte Claude Code Subagenten zur Unterstützung der Entwicklung.

## Subagenten-Architektur

### Architecture Agent (Hauptagent)
**Verantwortlich für**: Gesamtsteuerung, Modul-Integration, Code-Review

```yaml
role: architecture-agent
description: "Hauptagent für Architektur-Entscheidungen und Modul-Integration"
capabilities:
  - module-integration
  - code-review
  - dependency-management
  - performance-optimization
  - security-audit
```

### Frontend Agent
**Verantwortlich für**: React/Next.js Entwicklung, UI/UX, Component Library

```yaml
role: frontend-agent
description: "Spezialisiert auf Frontend-Entwicklung mit React, Next.js und shadcn/ui"
capabilities:
  - react-development
  - nextjs-optimization
  - component-creation
  - tailwind-styling
  - performance-monitoring
```

### Backend Agent
**Verantwortlich für**: API-Entwicklung, Database, Authentication

```yaml
role: backend-agent
description: "Spezialisiert auf Backend-Entwicklung mit Prisma, PostgreSQL und API-Routes"
capabilities:
  - api-development
  - database-design
  - authentication-integration
  - webhook-handling
  - data-validation
```

### DevOps Agent
**Verantwortlich für**: Deployment, CI/CD, Infrastructure

```yaml
role: devops-agent
description: "Spezialisiert auf Deployment, CI/CD und Infrastructure Management"
capabilities:
  - deployment-configuration
  - ci-cd-pipelines
  - environment-management
  - monitoring-setup
  - security-hardening
```

### Testing Agent
**Verantwortlich für**: Test-Strategie, Quality Assurance

```yaml
role: testing-agent
description: "Spezialisiert auf Testing-Strategien und Quality Assurance"
capabilities:
  - test-strategy
  - unit-testing
  - integration-testing
  - e2e-testing
  - performance-testing
```

## Agenten-Kommunikation

### Workflow Pattern
```
User Request → Architecture Agent → Specialized Agent → Architecture Agent → Response
```

### Kommunikationsprotokolle
1. **Task Delegation**: Architecture Agent delegiert spezifische Tasks an spezialisierte Agents
2. **Result Aggregation**: Specialized Agents liefern Ergebnisse zurück an Architecture Agent
3. **Quality Control**: Architecture Agent führt finalen Code-Review durch

## Module-spezifische Konfigurationen

### Authentication Module (Clerk)
```yaml
module: authentication
agent: backend-agent
config:
  - clerk-setup
  - user-management
  - role-based-access
  - social-login
  - session-management
```

### Payment Module (Stripe)
```yaml
module: payment
agent: backend-agent
config:
  - stripe-integration
  - subscription-management
  - webhook-handling
  - billing-portal
  - tax-calculation
```

### Database Module (Prisma/PostgreSQL)
```yaml
module: database
agent: backend-agent
config:
  - schema-design
  - migrations
  - query-optimization
  - data-seeding
  - backup-strategy
```

### UI Module (shadcn/ui)
```yaml
module: ui
agent: frontend-agent
config:
  - component-library
  - design-system
  - responsive-design
  - accessibility
  - theme-management
```

### SEO Module
```yaml
module: seo
agent: frontend-agent
config:
  - meta-tags
  - sitemap-generation
  - open-graph
  - structured-data
  - performance-optimization
```

## Entwicklungsworkflows

### Neue Feature-Entwicklung
```bash
# 1. Architecture Agent analysiert Anforderung
# 2. Delegiert an entsprechende spezialisierte Agents
# 3. Agents implementieren ihre Teile
# 4. Architecture Agent führt Integration durch
# 5. Testing Agent validiert Implementation
```

### Code-Review Prozess
```bash
# 1. Architecture Agent prüft Gesamtarchitektur
# 2. Specialized Agents prüfen fachspezifische Aspekte
# 3. Testing Agent prüft Testabdeckung
# 4. DevOps Agent prüft Deployment-Readiness
```

### Bug Fixing
```bash
# 1. Architecture Agent identifiziert Problembereich
# 2. Delegiert an zuständigen Specialized Agent
# 3. Agent implementiert Fix
# 4. Testing Agent validiert Fix
# 5. Architecture Agent führt Regression-Test durch
```

## Quality Gates

### Code Quality Standards
- **TypeScript Coverage**: 100% Type Coverage
- **Test Coverage**: > 80% Line Coverage
- **Linting**: Zero ESLint Warnings
- **Performance**: Lighthouse Score > 90
- **Security**: No Critical Vulnerabilities

### Deployment Criteria
- **Build Success**: Green CI/CD Pipeline
- **Test Passing**: All Tests Green
- **Performance Budget**: Within Defined Limits
- **Security Scan**: Clean Security Report

## Konfigurationsdateien

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

### Environment Variables Template
```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ok9_saas

# Payments
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Email
RESEND_API_KEY=your_resend_api_key

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Troubleshooting Guide

### Häufige Probleme

#### Module Installation Fehler
```bash
# Problem: npm install fehlgeschlagen
# Lösung: Cache leeren und neu installieren
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Issues
```bash
# Problem: Prisma kann nicht verbinden
# Lösung: Database URL prüfen und Migrationen ausführen
npx prisma generate
npx prisma db push
npx prisma db seed
```

#### Build Errors
```bash
# Problem: Next.js Build fehlgeschlagen
# Lösung: TypeScript Fehler beheben
npm run lint -- --fix
npm run type-check
```

## Weiterentwicklung

### Neue Module hinzufügen
1. Architecture Agent definiert Modul-Spezifikation
2. Corresponding Specialized Agent implementiert Modul
3. Testing Agent erstellt Test-Suite
4. DevOps Agent konfiguriert Deployment
5. Documentation Agent erstellt Dokumentation

### Agenten erweitern
1. Neue Capabilities definieren
2. Training Data vorbereiten
3. Integrationstests durchführen
4. Performance optimieren

## Support & Kontakt

### Issue Reporting
- **GitHub Issues**: Für Bug Reports und Feature Requests
- **Discord Community**: Für Entwickler-Support
- **Documentation**: Detaillierte Setup-Anleitungen

### Contribution Guidelines
- **Code Standards**: TypeScript, ESLint, Prettier
- **Testing Requirements**: > 80% Coverage
- **Documentation**: Jede Funktion dokumentieren
- **Review Process**: Zwei Reviews erforderlich

---

**Diese Konfiguration wird automatisch von Claude Code geladen und bietet spezialisierte Unterstützung für die Entwicklung des OK9 SaaS Starter Kits.**