# Agent Guidelines for OK9 SaaS Starter Kit

## Commands
- **Dev**: `npm run dev` (Turbopack localhost:3000)
- **Build**: `npm run build` (production bundle)
- **Lint**: `npm run lint` (ESLint + TypeScript)
- **Test all**: `npm test` (Vitest once)
- **Test watch**: `npm run test:watch`
- **Test coverage**: `npm run test:coverage`
- **Single test**: `npx vitest run src/path/to/file.test.ts`
- **Database**: `npm run db:push` (schema), `npm run db:seed` (data)

## Code Style
- **TypeScript**: Strict mode, full type safety, no `any`
- **Imports**: `@/` alias for src/, no relative paths
- **Components**: Functional React, PascalCase, destructured props
- **Functions/Hooks**: camelCase, hooks prefixed `use`
- **Formatting**: 2-space indent, ESLint auto-fix
- **Styling**: Tailwind CSS, `cn()` for class merging
- **Error Handling**: Try/catch, error boundaries
- **Testing**: Vitest + RTL, co-located `.test.tsx`
- **Naming**: Descriptive, consistent patterns

## Project Structure
- `src/app/`: Next.js App Router pages
- `src/components/`: Reusable UI components
- `src/lib/`: Utilities and configs
- `src/hooks/`: Custom React hooks
- `src/stores/`: Zustand state management
- `prisma/`: Database schema and seeds

Always run `npm run lint` and `npm test` before committing.