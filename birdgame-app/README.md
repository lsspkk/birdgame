# Next.js + Tailwind CSS Example

This example shows how to use [Tailwind CSS](https://tailwindcss.com/) [(v2.2)](https://blog.tailwindcss.com/tailwindcss-2-2) with Next.js. It follows the steps outlined in the official [Tailwind docs](https://tailwindcss.com/docs/guides/nextjs).

It uses the new [`Just-in-Time Mode`](https://tailwindcss.com/docs/just-in-time-mode) for Tailwind CSS.

## Preview

Preview the example live on [StackBlitz](http://stackblitz.com/):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-tailwindcss)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss&project-name=with-tailwindcss&repository-name=with-tailwindcss)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-tailwindcss with-tailwindcss-app
# or
yarn create next-app --example with-tailwindcss with-tailwindcss-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## Testing

This project uses Jest for testing. The tests are located in the `tests` directory.

### Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm test -- --watch
```

To run a specific test file:

```bash
npm test -- tests/pages/api/scores/[[...scoreslug]].test.ts
```

### Creating New Tests

When creating new tests, follow these guidelines:

1. Place tests in the `tests` directory mirroring the structure of the source files
2. Use the existing mock utilities in `tests/mocks/` for consistent testing
3. For API route tests, use the `runHandler` utility from `tests/testutils.ts`

#### Import Conventions

For all new test files:

- Use at most two levels of parent directories (`../../`) in import paths
- If shorter, use the `@/` alias for imports (e.g., `@/models/score` instead of `../../../../models/score`)
- Prefer the shortest, clearest import path

#### Mock Conventions

- Place reusable mock data in dedicated files under `tests/mocks/`
- For model mocks, follow the pattern in `scoreMocks.ts` or `userMocks.ts`
- Reset all mocks in `beforeEach` blocks

Example API test pattern:

```typescript
// Import mocks and utilities
import { scoreMock, resetScoreMocks } from '@/tests/mocks/scoreMocks'
import { runHandler } from '@/tests/testutils'
import handler from '@/pages/api/yourEndpoint'

// Mock the modules
jest.mock('@/models/score', () => scoreMock)

// Setup and tests
describe('GET /api/yourEndpoint', () => {
  beforeEach(() => {
    resetScoreMocks()
    jest.clearAllMocks()
  })

  it('should return expected data', async () => {
    // Arrange - set up mocks
    // Act - call the handler
    const { res } = await runHandler(handler, 'GET', {
      /* query params */
    })
    // Assert - check the response
    expect(res._getStatusCode()).toBe(200)
  })
})
```
