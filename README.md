# FrameOS

UI Operating System - Design system runtime with conversational control

## Project Structure
```
frameos/
├── apps/
│   ├── web/              # React frontend (Phase 6+)
│   └── api/              # API server (Phase 6+)
├── packages/
│   ├── runtime/          # Core runtime library (Phase 2+)
│   ├── types/            # Shared TypeScript types (Phase 1+)
│   ├── validators/       # Zod validation schemas (Phase 1+)
│   ├── adapters/         # Persistence adapters (Phase 5+)
│   └── config/           # Shared configs (Phase 0)
```

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Getting Started
```bash
# Install dependencies
pnpm install

# Run all packages in dev mode
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Type check
pnpm typecheck
```

### Package Scripts

Each package supports:
- `pnpm dev` - Watch mode with hot reload
- `pnpm build` - Production build
- `pnpm test` - Run tests
- `pnpm typecheck` - Type checking

## Turborepo

This monorepo uses Turborepo for:
- Parallel execution
- Dependency-aware builds
- Remote caching (future)

### Turborepo Commands
```bash
# Run task for all packages
turbo <task>

# Run task for specific package
turbo <task> --filter=@frameos/runtime

# Clear cache
turbo clean
```

## Phase Status

- ✅ Phase 0: Monorepo Infrastructure (Complete)
- ⏳ Phase 1: Domain Model & Types (Pending)
- ⏳ Phase 2: Runtime Core (Pending)

## Contributing

This project is under active development. Phase-by-phase implementation in progress.
