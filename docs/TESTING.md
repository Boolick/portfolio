<!-- generated-by: gsd-doc-writer -->
# Testing & Quality Assurance Guide

## Test Framework and Setup

The project currently uses static analysis and build verification as its primary automated quality gates:

- **Linter**: ESLint 9 (`eslint.config.mjs`) configured with `eslint-config-next`.
- **Type Checker**: TypeScript 5 in strict mode (`tsconfig.json`).
- **Build Verification**: Next.js production compiler (`next build`).

No automated unit test runner (such as Vitest or Jest) is currently installed in `devDependencies`. When adding automated unit and integration tests, Vitest with React Testing Library is the recommended test framework for React 19 and Next.js 16 App Router compatibility.

## Running Tests

Current verification commands:

### Static Analysis

Validate code style and rule compliance:

```bash
npm run lint
```

### Type Checking & Production Compilation

Ensure TypeScript types and Next.js route builds compile cleanly:

```bash
npm run build
```

### Manual Verification of API Endpoints

Test referral tracking locally:

```bash
curl -i "http://localhost:3000/api/track-visit?ref=test"
```

Verify Telegram webhook operational status:

```bash
node --env-file=.env.local scripts/set-webhook.mjs info
```

## Writing New Tests

When contributing automated test suites, adhere to the following naming and directory conventions:

- **Unit Tests**: Place test files adjacent to the implementation or in `__tests__/` directories using the `*.test.ts` or `*.test.tsx` suffix.
- **Component Tests**: Test UI primitives and widgets in isolation with simulated user interactions.
- **Route Handler Tests**: Verify HTTP status codes, CSRF protection, and error envelopes (`error.code`, `error.status`).

## Coverage Requirements

| Type | Threshold |
|------|-----------|
| Lines | No coverage threshold configured |
| Statements | No coverage threshold configured |
| Functions | No coverage threshold configured |
| Branches | No coverage threshold configured |

## CI Integration

No CI/CD pipeline detected. Test execution currently occurs during local pre-flight checks before deployment.
