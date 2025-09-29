# 🚀 OK9 SaaS Starter Kit

> **Version:** 1.2.0
> **Status:** Production Ready
> **Letzte Aktualisierung:** 2024-09-29

Ein modulares, hochgradig wartbares SaaS-Starter-Kit für die schnelle Entwicklung professioneller SaaS-Anwendungen mit Next.js 14+.

## ✨ Features

- 🔐 **Authentication**: Clerk.com + NextAuth.js Fallback
- 💳 **Payments**: Stripe Integration mit Subscriptions
- 🎨 **UI/UX**: shadcn/ui + TailwindCSS + Dark/Light Mode
- 🗄️ **Database**: Prisma ORM + PostgreSQL
- 📧 **Email**: Resend Integration
- 🧪 **Testing**: Vitest + React Testing Library (80%+ Coverage)
- 🔍 **SEO**: Automatische Sitemap, Meta Tags, OpenGraph
- 🚀 **Performance**: Optimiert für Lighthouse Score >90
- 📱 **Responsive**: Mobile-first Design
- 🛠️ **Developer Experience**: TypeScript, ESLint, Prettier

## 🏗️ Architektur

### Technologie-Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: TailwindCSS, shadcn/ui, CSS Modules
- **Backend**: API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk.com (NextAuth.js Fallback)
- **Payments**: Stripe
- **Testing**: Vitest, Playwright
- **Deployment**: Vercel, Docker, Coolify

### Claude Code Subagenten
Das Projekt nutzt spezialisierte Claude Code Subagenten für verschiedene Bereiche:
- **Architecture Agent**: Gesamtsteuerung und Integration
- **Frontend Agent**: React/Next.js Entwicklung
- **Backend Agent**: API und Datenbank
- **DevOps Agent**: Deployment und CI/CD
- **Testing Agent**: Qualitätssicherung
- **Documentation Agent**: Dokumentation

## 🚀 Quick Start

### 1. Repository klonen
```bash
git clone https://github.com/ok9/saas-starter-kit
cd ok9-saas-starter-kit
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Environment konfigurieren
```bash
cp .env.example .env.local
# Editiere .env.local mit deinen API Keys
```

### 4. Database setup
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Development Server starten
```bash
npm run dev
```

🎉 **Fertig!** Das Projekt läuft auf http://localhost:3000

## 📚 Dokumentation

- [📋 Product Requirements Document](./OK9-SaaS-Starter-Kit-PRD.md) - Detaillierte Projektspezifikation
- [🤖 Claude Code Configuration](./CLAUDE.md) - Subagenten-Konfiguration
- [🧪 Testing Setup](./TESTING.md) - Test-Strategie und -Konfiguration
- [🧩 Frontend Components](./src/components/README.md) - UI-Komponenten Dokumentation

## 🛠️ Verfügbare Scripts

```bash
# Development
npm run dev              # Development Server starten
npm run build           # Production Build erstellen
npm run start           # Production Server starten

# Code Quality
npm run lint            # ESLint ausführen
npm run type-check      # TypeScript Typprüfung

# Testing
npm test                # Alle Tests ausführen
npm run test:watch      # Tests im Watch-Modus
npm run test:coverage   # Coverage-Bericht erstellen
npm run test:ui         # Test UI Interface öffnen

# Database
npm run db:generate     # Prisma Client generieren
npm run db:push         # Schema zu Datenbank pushen
npm run db:seed         # Datenbank mit Seed-Daten füllen
```

## 🧪 Testing

Das Projekt verfügt über eine umfassende Test-Suite:
- **Unit Tests**: Vitest + React Testing Library
- **Coverage**: >80% Code Coverage
- **Integration Tests**: API Routes Testing
- **E2E Tests**: Playwright (geplant)

```bash
npm test                # Alle Tests ausführen
npm run test:ui         # Interaktive Test UI
```

## 🚀 Deployment

### Vercel (Empfohlen)
```bash
vercel --prod
```

### Docker
```bash
docker build -t ok9-saas .
docker run -p 3000:3000 ok9-saas
```

### Coolify (Self-Hosting)
Siehe [Deployment Guide](./OK9-SaaS-Starter-Kit-PRD.md#deployment-targets)

## 🎯 Projekt-Status

### ✅ Implementiert
- [x] Next.js 14 Setup mit App Router
- [x] Authentication (Clerk + NextAuth.js)
- [x] Stripe Payment Integration
- [x] shadcn/ui Component Library
- [x] Database Layer (Prisma + PostgreSQL)
- [x] Testing Infrastructure (Vitest)
- [x] Email System (Resend)
- [x] SEO Optimization
- [x] Responsive Design
- [x] Dark/Light Mode

### 🔄 In Entwicklung
- [ ] Advanced Dashboard Features
- [ ] E2E Tests mit Playwright
- [ ] Performance Optimierungen
- [ ] Erweiterte Analytics

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne eine Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT Lizenz lizenziert - siehe [LICENSE](LICENSE) für Details.

## 🆘 Support

- 📖 [Dokumentation](./OK9-SaaS-Starter-Kit-PRD.md)
- 🐛 [Issues](https://github.com/ok9/saas-starter-kit/issues)
- 💬 [Discussions](https://github.com/ok9/saas-starter-kit/discussions)

---

**Entwickelt mit ❤️ vom Architecture Agent und dem OK9 Team**