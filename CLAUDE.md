# OK9 SaaS Starter Kit - Claude Code Configuration

> **Version:** 1.2.0
> **Letzte Aktualisierung:** 2024-09-29
> **Status:** Production Ready

## 📋 Projektübersicht

Das OK9 SaaS Starter Kit ist ein modulares Next.js-basiertes Starter-Kit für die schnelle Entwicklung von SaaS-Anwendungen. Diese Konfiguration definiert spezialisierte Claude Code Subagenten zur Unterstützung der Entwicklung.

### 🔗 Verwandte Dokumentation
- [Product Requirements Document](./OK9-SaaS-Starter-Kit-PRD.md)
- [Testing Setup](./TESTING.md)
- [Frontend Components](./src/components/README.md)

## Subagenten-Architektur

Diese Konfiguration nutzt die Claude Code eigenen Subagenten-Features für spezialisierte Entwicklungstasks mit einer neuen PO-Agent zentrierten Kommunikationsstruktur.

### PO Agent (Product Owner - Kommunikationszentrale)
**Verantwortlich für**: User-Kommunikation, Anforderungsanalyse, Task-Koordination

```yaml
subagent_type: general-purpose
role: product-owner-agent
description: "Zentraler Kommunikations-Agent zwischen User und Entwicklungsteam"
capabilities:
  - user-communication
  - requirements-analysis
  - task-coordination
  - priority-management
  - stakeholder-management
  - project-overview
communication_flow:
  - direct-user-interface: true
  - architecture-agent-delegation: true
  - no-direct-tools: true
```

### Architecture Agent (Koordinations-Agent)
**Verantwortlich für**: Technische Architektur, Modul-Integration, Task-Delegation an Fachagenten

```yaml
subagent_type: general-purpose
role: architecture-agent
description: "Technischer Koordinations-Agent für Architektur-Entscheidungen"
capabilities:
  - technical-architecture
  - module-integration
  - specialist-agent-delegation
  - code-review
  - dependency-management
  - performance-optimization
  - security-audit
communication_flow:
  - receives-from: product-owner-agent
  - delegates-to: [frontend-agent, backend-agent, devops-agent, testing-agent, documentation-agent]
```

### Frontend Agent (Spezialist)
**Verantwortlich für**: React/Next.js Entwicklung, UI/UX, Component Library

```yaml
subagent_type: general-purpose
role: frontend-agent
description: "Spezialisiert auf Frontend-Entwicklung mit React, Next.js und shadcn/ui"
capabilities:
  - react-development
  - nextjs-optimization
  - component-creation
  - tailwind-styling
  - performance-monitoring
  - responsive-design
  - accessibility
communication_flow:
  - receives-from: architecture-agent
  - reports-to: architecture-agent
  - collaboration: [testing-agent, documentation-agent]
```

### Backend Agent (Spezialist)
**Verantwortlich für**: API-Entwicklung, Database, Authentication

```yaml
subagent_type: general-purpose
role: backend-agent
description: "Spezialisiert auf Backend-Entwicklung mit Prisma, PostgreSQL und API-Routes"
capabilities:
  - api-development
  - database-design
  - authentication-integration
  - webhook-handling
  - data-validation
  - security-implementation
  - performance-optimization
communication_flow:
  - receives-from: architecture-agent
  - reports-to: architecture-agent
  - collaboration: [testing-agent, devops-agent]
```

### DevOps Agent (Spezialist)
**Verantwortlich für**: Deployment, CI/CD, Infrastructure

```yaml
subagent_type: general-purpose
role: devops-agent
description: "Spezialisiert auf Deployment, CI/CD und Infrastructure Management"
capabilities:
  - deployment-configuration
  - ci-cd-pipelines
  - environment-management
  - monitoring-setup
  - security-hardening
  - docker-configuration
  - performance-monitoring
communication_flow:
  - receives-from: architecture-agent
  - reports-to: architecture-agent
  - collaboration: [backend-agent, testing-agent]
```

### Testing Agent (Spezialist)
**Verantwortlich für**: Test-Strategie, Quality Assurance

```yaml
subagent_type: general-purpose
role: testing-agent
description: "Spezialisiert auf Testing-Strategien und Quality Assurance"
capabilities:
  - test-strategy
  - unit-testing
  - integration-testing
  - e2e-testing
  - performance-testing
  - test-coverage-analysis
  - quality-metrics
communication_flow:
  - receives-from: architecture-agent
  - reports-to: architecture-agent
  - collaboration: [all-agents]
```

### Documentation Agent (Spezialist)
**Verantwortlich für**: Dokumentation, Code-Dokumentation, READMEs

```yaml
subagent_type: general-purpose
role: documentation-agent
description: "Spezialisiert auf Dokumentation und Code-Dokumentation"
capabilities:
  - technical-documentation
  - api-documentation
  - code-comments
  - readme-generation
  - user-guides
  - troubleshooting-guides
communication_flow:
  - receives-from: architecture-agent
  - reports-to: architecture-agent
  - collaboration: [all-agents]
```

## 🔄 Agenten-Kommunikation

### Neue Workflow Pattern
```
User Request → PO Agent → Architecture Agent → Specialized Agent → Architecture Agent → PO Agent → Response
```

### Kommunikationshierarchie
```
┌─────────────────┐
│    User/Client  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐  (einziger User-Kontakt)
│    PO Agent     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐  (technische Koordination)
│Architecture Agnt│
└─────────┬───────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  Specialized Agents (Parallelarbeitung) │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │Frontend │ │Backend  │ │DevOps   │    │
│  └─────────┘ └─────────┘ └─────────┘    │
│  ┌─────────┐ ┌─────────┐               │
│  │Testing  │ │  Docs   │               │
│  └─────────┘ └─────────┘               │
└─────────────────────────────────────────┘
```

### Kommunikationsprotokolle
1. **User Interface**: PO Agent ist einziger direkter User-Kontakt
2. **Requirements Analysis**: PO Agent analysiert und strukturiert User Requests
3. **Technical Delegation**: PO Agent delegiert an Architecture Agent
4. **Task Distribution**: Architecture Agent delegiert an Fachagenten
5. **Result Aggregation**: Architecture Agent sammelt und integriert Ergebnisse
6. **Quality Control**: Architecture Agent führt finalen Review durch
7. **User Communication**: PO Agent übersetzt technische Ergebnisse für User

### Task Delegation mit neuer PO-Agent Struktur
```bash
# Neue Agenten-Hierarchie
product-owner-agent: User-Interface, Requirements-Analyse (keine Tools)
architecture-agent: Technische Koordination, Task-Verteilung
frontend-agent: UI/UX, React, Next.js, CSS
backend-agent: API, Database, Authentication, Security
devops-agent: Deployment, CI/CD, Infrastructure
testing-agent: Tests, Quality Assurance, Performance
documentation-agent: Dokumentation, READMEs, Guides

# Beispiel für neue Task-Delegation-Kette
# 1. PO Agent erhält User Request
# 2. PO Agent analysiert und strukturiert Request
Task(
  description="Koordiniere Dashboard-Implementierung",
  prompt="User möchte Dashboard-Komponente. Analysiere technische Anforderungen und delegiere an entsprechende Fachagenten.",
  subagent_type="general-purpose"  # Architecture Agent
)

# 3. Architecture Agent delegiert an Fachagenten
Task(
  description="Implementiere Dashboard-Komponente",
  prompt="Erstelle React Dashboard-Komponente basierend auf Architecture Agent Spezifikation",
  subagent_type="general-purpose"  # Frontend Agent
)
```

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

## 🔧 Entwicklungsworkflows

### Neue Feature-Entwicklung mit PO-Agent
```bash
# 1. User stellt Anfrage an PO Agent
# 2. PO Agent analysiert User-Anforderungen und Business-Logik
# 3. PO Agent delegiert technische Analyse an Architecture Agent
# 4. Architecture Agent erstellt technische Spezifikation
# 5. Architecture Agent delegiert an entsprechende Fachagenten (parallel)
# 6. Fachagenten implementieren ihre Bereiche
# 7. Architecture Agent koordiniert Integration
# 8. Testing Agent validiert Gesamtimplementierung
# 9. Architecture Agent meldet Ergebnis an PO Agent
# 10. PO Agent kommuniziert Ergebnis an User
```

### Code-Review Prozess mit PO-Agent
```bash
# 1. User Request über PO Agent
# 2. PO Agent strukturiert Review-Anforderungen
# 3. Architecture Agent koordiniert Review-Prozess
# 4. Architecture Agent prüft Gesamtarchitektur
# 5. Fachagenten prüfen ihre spezifischen Bereiche (parallel)
# 6. Testing Agent prüft Testabdeckung und Qualität
# 7. DevOps Agent prüft Deployment-Readiness
# 8. Architecture Agent aggregiert Review-Ergebnisse
# 9. PO Agent präsentiert Ergebnisse an User
```

### Bug Fixing mit PO-Agent
```bash
# 1. User meldet Bug an PO Agent
# 2. PO Agent klassifiziert und priorisiert Bug
# 3. PO Agent delegiert Bug-Analyse an Architecture Agent
# 4. Architecture Agent identifiziert Problembereich
# 5. Architecture Agent delegiert Fix an zuständigen Fachagenten
# 6. Fachagent implementiert Fix
# 7. Testing Agent validiert Fix und führt Regression-Tests durch
# 8. Architecture Agent bestätigt Fix-Integration
# 9. PO Agent kommuniziert Lösung an User
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
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit",
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

## 🚀 Praktische Implementation der PO-Agent Struktur

### User-Interaktion Protokoll
```typescript
// Beispiel: User möchte neue Komponente
// 1. User kommuniziert nur mit PO Agent
"Ich brauche eine neue Login-Komponente mit Social Login"

// 2. PO Agent analysiert und strukturiert
// - Business Requirements: Login-Funktionalität
// - User Experience: Social Login Integration
// - Priorität: Hoch (Authentication kritisch)

// 3. PO Agent delegiert an Architecture Agent
Task(
  description="Analysiere Login-Komponente Anforderungen",
  prompt="User braucht Login-Komponente mit Social Login. Erstelle technische Spezifikation und delegiere an Fachagenten.",
  subagent_type="general-purpose"  // Architecture Agent
)
```

### Architecture Agent Koordination
```typescript
// Architecture Agent erhält strukturierte Anfrage vom PO Agent
// Analysiert technische Anforderungen und delegiert parallel:

// Frontend Komponente
Task(
  description="Implementiere Login-UI-Komponente",
  prompt="Erstelle Login-Formular mit Social Login Buttons (Google, GitHub) basierend auf shadcn/ui",
  subagent_type="general-purpose"  // Frontend Agent
)

// Backend Integration
Task(
  description="Konfiguriere Social Login Backend",
  prompt="Setup Clerk Social Login Provider für Google und GitHub",
  subagent_type="general-purpose"  // Backend Agent
)

// Testing
Task(
  description="Erstelle Login-Tests",
  prompt="Implementiere Unit und Integration Tests für Login-Funktionalität",
  subagent_type="general-purpose"  // Testing Agent
)
```

### Kommunikationsregeln
1. **User ↔ PO Agent**: Einziger direkter Kontakt
2. **PO Agent → Architecture Agent**: Strukturierte technische Delegation
3. **Architecture Agent ↔ Fachagenten**: Parallele Task-Verteilung
4. **Fachagenten → Architecture Agent**: Ergebnisse und Status-Updates
5. **Architecture Agent → PO Agent**: Integrierte Ergebnisse
6. **PO Agent → User**: User-freundliche Kommunikation

## Weiterentwicklung

### Neue Module hinzufügen mit PO-Agent
1. User Request über PO Agent
2. PO Agent analysiert Business-Requirements
3. PO Agent delegiert an Architecture Agent
4. Architecture Agent definiert technische Spezifikation
5. Architecture Agent delegiert an entsprechende Fachagenten
6. Testing Agent erstellt Test-Suite
7. DevOps Agent konfiguriert Deployment
8. Documentation Agent erstellt Dokumentation
9. Architecture Agent integriert alle Komponenten
10. PO Agent kommuniziert Fertigstellung an User

### Agenten-Hierarchie erweitern
1. PO Agent identifiziert neue Anforderungen
2. Architecture Agent evaluiert neue Agent-Rollen
3. Neue Fachagenten-Capabilities definieren
4. Integration in bestehende Kommunikationsstruktur
5. Testing der neuen Agent-Interaktionen

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