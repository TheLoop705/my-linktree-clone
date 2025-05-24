# Testing Infrastructure Documentation

## Overview

This project uses a comprehensive testing infrastructure built on Jest, React Testing Library, and Supertest to ensure API reliability and UI functionality.

## Test Structure

```
tests/
├── api/           # API endpoint tests
├── client/        # React component tests
├── fixtures/      # Test data and mocks
├── setup/         # Jest configuration files
└── utils/         # Test helper functions
```

## Test Types

### 1. API Tests (`tests/api/`)

- **Framework**: Jest + Supertest
- **Purpose**: Test API endpoints, authentication, data validation
- **Files**:
  - `auth.test.js` - Authentication endpoints
  - `pages.test.js` - Page CRUD operations
  - `links.test.js` - Link management

### 2. Client Tests (`tests/client/`)

- **Framework**: Jest + React Testing Library
- **Purpose**: Test React components, user interactions, form validation
- **Files**:
  - `register.test.js` - Registration form testing

### 3. Fixtures (`tests/fixtures/`)

- **Purpose**: Centralized test data and mock responses
- **Files**:
  - `testData.js` - Common test data objects

### 4. Utilities (`tests/utils/`)

- **Purpose**: Helper functions for test setup and data creation
- **Files**:
  - `testHelpers.js` - Database setup, user creation, cleanup

## Getting Started

### Prerequisites

```bash
npm install  # Install all dependencies including test packages
```

### Environment Setup

1. Test environment variables are in `.env.test`
2. Uses separate test database (`test.db`)
3. Mocks external services (email, storage, etc.)

### Running Tests

#### Quick Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run only API tests
npm run test:api

# Run only client tests
npm run test:client

# Set up test environment
npm run test:setup
```

#### Advanced Test Runner

```bash
# Use the custom test runner script
node scripts/test-runner.js           # Full test suite
node scripts/test-runner.js api       # API tests only
node scripts/test-runner.js client    # Client tests only
node scripts/test-runner.js watch     # Watch mode
node scripts/test-runner.js clean     # Clean up test environment
node scripts/test-runner.js help      # Show help
```

## Test Configuration

### Jest Configuration (`jest.config.js`)

- **Multi-project setup**: Separate environments for API and client tests
- **API tests**: Node environment
- **Client tests**: jsdom environment
- **Module mapping**: Support for `@/` path aliases
- **Coverage reporting**: Text, LCOV, HTML formats

### Setup Files

- **`tests/setup/jest.setup.js`**: Client-side test setup, mocks Next.js router, next-auth
- **`tests/setup/api.setup.js`**: API test setup, database initialization and cleanup

## Writing Tests

### API Test Example

```javascript
import { POST } from "@/app/api/auth/register/route";
import { createTestUser, cleanDatabase } from "../utils/testHelpers";

describe("/api/auth/register", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("should register a new user with valid data", async () => {
    const userData = {
      email: "test@example.com",
      password: "ValidPassword123",
    };

    const request = new Request("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });
});
```

### Client Test Example

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/register/page";

describe("RegisterPage", () => {
  it("renders registration form", () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });
});
```

## Test Helpers

### Database Helpers

```javascript
import {
  createTestUser,
  createTestLinkPage,
  createTestLinks,
  cleanDatabase,
} from "../utils/testHelpers";

// Create test user
const user = await createTestUser({
  email: "test@example.com",
  password: "TestPassword123",
});

// Create test page
const page = await createTestLinkPage(user.id, {
  title: "Test Page",
  slug: "test-page",
});

// Create test links
const links = await createTestLinks(page.id, [
  { title: "Link 1", url: "https://example.com" },
]);

// Clean database
await cleanDatabase();
```

### Mock Authentication

```javascript
// Mock session for API tests
global.mockSession = {
  user: { id: user.id, email: user.email },
};

// Mock fetch for client tests
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ success: true }),
});
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- **HTML Report**: `coverage/lcov-report/index.html`
- **Text Summary**: Displayed in terminal
- **LCOV**: `coverage/lcov.info` for CI/CD integration

## Best Practices

### 1. Test Organization

- Group related tests in `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow AAA pattern: Arrange, Act, Assert

### 2. Database Management

- Always clean database before each test
- Use test helpers for consistent data creation
- Avoid hardcoded IDs, use generated test data

### 3. Mocking

- Mock external services (email, payment, storage)
- Use consistent mock data from fixtures
- Mock at the right level (network vs function)

### 4. Assertions

- Test both success and error cases
- Validate response structure and status codes
- Check authentication and authorization

### 5. Performance

- Keep tests fast and isolated
- Use test-specific database
- Parallel test execution where possible

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run test:setup
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v1
```

## Troubleshooting

### Common Issues

#### Test Database Issues

```bash
# Reset test database
npm run test:setup
```

#### Module Resolution

```bash
# Regenerate Prisma client
npx prisma generate
```

#### Permission Issues

```bash
# On Windows, run as administrator if file permissions fail
```

### Debug Mode

```bash
# Run specific test with debug info
npm test -- --testNamePattern="specific test" --verbose
```

## Migration from Legacy Tests

The old `test-auth.js` script has been migrated to the new infrastructure:

- ✅ Registration validation tests
- ✅ Error message testing
- ✅ Password requirement validation
- ✅ Email format validation
- ✅ Duplicate email handling

## Next Steps

1. **Add more API tests**: Profile management, analytics, file uploads
2. **Component testing**: Editor components, dashboard pages
3. **E2E testing**: Consider adding Cypress for full user journeys
4. **Performance testing**: Load testing for API endpoints
5. **Visual regression**: Screenshot testing for UI components

## Contributing

When adding new tests:

1. Follow existing patterns and structure
2. Add tests to appropriate directory (`api/` or `client/`)
3. Use test helpers and fixtures for consistency
4. Update this documentation if adding new patterns
5. Ensure tests pass in CI environment
