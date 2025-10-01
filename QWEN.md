# OK9 SaaS Starter Kit - Development Context

## Project Overview

The OK9 SaaS Starter Kit is a modular, highly maintainable SaaS starter kit designed for rapid development of professional SaaS applications with Next.js 15. It provides a complete foundation with authentication, payments, UI components, and testing infrastructure.

**Key Features:**
- 🔐 Authentication: Clerk.com + NextAuth.js Fallback
- 💳 Payments: Stripe Integration with Subscriptions
- 🎨 UI/UX: shadcn/ui + TailwindCSS + Dark/Light Mode
- 🗄️ Database: Prisma ORM + PostgreSQL
- 📧 Email: Resend Integration
- 🧪 Testing: Vitest + React Testing Library (80%+ Coverage)
- 🔍 SEO: Automatic Sitemap, Meta Tags, OpenGraph
- 🚀 Performance: Optimized for Lighthouse Score >90
- 📱 Responsive: Mobile-first Design
- 🛠️ Developer Experience: TypeScript, ESLint, Prettier

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS v4, shadcn/ui, CSS Modules
- **State Management**: React Context, Zustand
- **UI Components**: shadcn/ui, Radix UI, Lucide React
- **Forms**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js 18+
- **ORM**: Prisma
- **Database**: PostgreSQL 14+
- **Authentication**: Clerk.com (NextAuth.js Fallback for Self-Hosting)
- **Payments**: Stripe
- **Email**: Resend

### Testing & Quality
- **Unit Tests**: Vitest + React Testing Library
- **Coverage**: >80% Code Coverage (currently 23.42%, goal to expand)
- **Linting**: ESLint v9 with TypeScript rules
- **Formatting**: Prettier
- **Type Checking**: TypeScript 5+ with strict mode

### Infrastructure
- **Deployment**: Vercel, Docker, Coolify
- **Monitoring**: Vercel Analytics
- **CDN**: Vercel Edge Network

## Project Structure

```
src/
├── __mocks__/            # Mock implementations for testing
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Dashboard pages
│   ├── demo/            # Demo pages
│   ├── favicon.ico
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page (UI Components Showcase)
│   ├── providers.tsx    # Application providers
│   ├── robots.ts        # SEO robots configuration
│   └── sitemap.ts       # Sitemap generation
├── components/          # Reusable UI components
├── contexts/            # React contexts
├── emails/              # Email templates
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── stores/              # State management stores (Zustand)
├── test-utils/          # Testing utilities
├── middleware.ts        # Authentication and routing middleware
└── middleware.ts.bak    # Backup of middleware
```

## Key Configuration Files

### Next.js Configuration (`next.config.ts`)
- Standalone output for production
- Server external packages configuration (`@prisma/client`, `bcrypt`)
- Development-specific optimizations (disables standalone output in development)

### TypeScript Configuration (`tsconfig.json`)
- TypeScript 5+ with strict mode
- Path aliases using `@/*` → `./src/*`
- Next.js plugin integration
- Module resolution using "bundler" mode

### Package.json Scripts
```bash
# Development
npm run dev              # Development Server with Turbopack
npm run build           # Production Build with Turbopack
npm run start           # Production Server

# Code Quality
npm run lint            # ESLint
npm run type-check      # TypeScript type checking

# Testing
npm test                # Run all tests with Vitest
npm run test:watch      # Tests in watch mode
npm run test:coverage   # Coverage report
npm run test:ui         # Test UI interface

# Database
npm run db:generate     # Prisma Client generation
npm run db:push         # Push schema to database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with data
npm run db:studio       # Open Prisma Studio
```

### Database Configuration (Prisma)
- PostgreSQL with Prisma ORM
- Migration and seeding capabilities
- Type-safe database access through Prisma Client
- Schema defined in `prisma/schema.prisma`

## Development Workflows

### Authentication & Authorization
The project implements a flexible authentication system with:
1. **Primary**: Clerk.com integration (recommended)
2. **Fallback**: NextAuth.js for self-hosting scenarios

The middleware.ts file contains route protection logic that distinguishes between public and protected paths, with support for role-based access control.

### Testing Strategy
The project follows a comprehensive testing approach:
- **Unit Tests**: Vitest with React Testing Library
- **Integration Tests**: API route testing
- **Coverage Target**: >80% (currently 23.42% as per testing docs, with goal to expand)
- **Test Location**: Test files colocated with source files using `*.test.tsx` pattern
- **Testing Principles**: User-centric testing with accessibility queries

### UI Components Showcase
The home page (page.tsx) serves as an interactive component catalog showcasing all available UI components with live demos, code snippets, and responsive design examples. This doubles as both a landing page and a comprehensive UI documentation.

## Claude Code Subagents

The project is designed to work with specialized Claude Code subagents for different development areas:

- **PO Agent (Product Owner)**: User communication, requirements analysis
- **Architecture Agent**: Technical coordination and task delegation
- **Frontend Agent**: React/Next.js development with UI/UX focus
- **Backend Agent**: API and database development
- **DevOps Agent**: Deployment and CI/CD configuration
- **Testing Agent**: Quality assurance and test strategy
- **Documentation Agent**: Technical documentation

### Agent Communication Flow
```
User Request → PO Agent → Architecture Agent → Specialized Agent → Architecture Agent → PO Agent → Response
```

## Environment Configuration

All environment variables are documented in both the PRD and CLAUDE.md files, including:
- Clerk authentication keys
- Database URL
- Stripe payment keys
- Resend email API key
- NextAuth configuration

## Deployment Options

### Vercel (Recommended)
- Optimized for Next.js
- Global CDN and automatic SSL
- Direct integration with Next.js features

### Self-Hosting Options
- Docker containerization
- Coolify deployment platform
- NextAuth.js fallback for self-hosted authentication

## Development Conventions

### Coding Standards
- TypeScript with strict mode
- ESLint with Next.js recommended rules
- Prettier for consistent formatting
- Absolute imports using `@/*` path alias

### Component Development
- shadcn/ui component library
- Accessibility-first approach
- Responsive design principles
- Dark/light mode support
- Performance optimization

### Testing Patterns
- Testing Library principles (user-centric testing)
- AAA pattern (Arrange-Act-Assert)
- Mock external dependencies
- Test colocated with source files

## Troubleshooting Common Issues

### Database Connection Issues
```bash
# Resolve database connection problems
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Module Installation Issues
```bash
# Clean install if modules fail to install
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Fix TypeScript issues
npm run type-check
npm run lint -- --fix
```

## Project Status & Next Steps

### ✅ Implemented
- Next.js 15 Setup with App Router
- Authentication (Clerk + NextAuth.js)
- Stripe Payment Integration
- shadcn/ui Component Library
- Database Layer (Prisma + PostgreSQL)
- Testing Infrastructure (Vitest)
- Email System (Resend)
- SEO Optimization
- Responsive Design
- Dark/Light Mode

### 🔄 In Development
- Advanced Dashboard Features
- E2E Tests with Playwright
- Performance Optimizations
- Advanced Analytics

This starter kit provides a production-ready foundation for SaaS applications with comprehensive tooling, testing, and development workflows optimized for rapid development.