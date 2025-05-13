# LinkHub Code Style Guide & Conventions

This document outlines the coding standards, style guidelines, and best practices for the LinkHub project. Following these guidelines ensures consistency across the codebase and improves maintainability, readability, and collaboration efficiency.

## Table of Contents

1. [General Principles](#general-principles)
2. [TypeScript Guidelines](#typescript-guidelines)
3. [React & Next.js Best Practices](#react--nextjs-best-practices)
4. [CSS & Tailwind Conventions](#css--tailwind-conventions)
5. [API & Backend Conventions](#api--backend-conventions)
6. [Testing Standards](#testing-standards)
7. [Documentation Guidelines](#documentation-guidelines)
8. [Commit Message Standards](#commit-message-standards)
9. [Code Review Checklist](#code-review-checklist)

## General Principles

### Code Formatting

- Use **Prettier** for automatic code formatting
- 2-space indentation for all files
- Maximum line length of 100 characters
- UTF-8 file encoding
- LF line endings

### Naming Conventions

- Use **camelCase** for variables, functions, and method names
- Use **PascalCase** for class, interface, type, and component names
- Use **UPPER_SNAKE_CASE** for constants
- Use **kebab-case** for file names, except for React components (PascalCase)

### File Organization

- One component per file
- Logical grouping of related files in directories
- Index files for clean exports
- Avoid deeply nested directory structures (max 4 levels)

## TypeScript Guidelines

### Type Usage

- Prefer explicit types over `any`
- Use interfaces for object shapes that will be implemented
- Use type aliases for unions, intersections, and complex types
- Explicitly define return types for functions, especially for public APIs

```typescript
// Good
interface User {
  id: string;
  email: string;
  isActive: boolean;
}

// Good
type UserRole = "admin" | "editor" | "viewer";

// Good
function fetchUser(id: string): Promise<User> {
  // implementation
}

// Avoid
function processData(data: any): any {
  // implementation
}
```

### Type Imports/Exports

- Use explicit named imports/exports
- Group and organize imports:
  1. External libraries
  2. Internal absolute imports
  3. Internal relative imports

```typescript
// Good
import { useState, useEffect } from "react";
import { Button, Input } from "@/components/ui";
import { User } from "@/types";
import { validateEmail } from "../../utils/validation";
```

### Null Handling

- Use optional chaining (`?.`) and nullish coalescing (`??`) operators
- Avoid explicit null checks when possible
- Use non-null assertion (`!`) sparingly and only when you're certain

## React & Next.js Best Practices

### Component Structure

- Use functional components with hooks
- Follow the Single Responsibility Principle
- Extract complex logic into custom hooks
- Keep components focused and reasonably sized (<250 lines)

```typescript
// Good
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isEditable }) => {
  const { t } = useTranslation();

  return (
    <header className="profile-header">
      <ProfileImage src={user.avatarUrl} alt={user.displayName} />
      <h1>{user.displayName}</h1>
      {isEditable && <EditButton onClick={handleEdit}>{t('edit')}</EditButton>}
    </header>
  );
};
```

### Props

- Use explicit prop types with TypeScript interfaces
- Destructure props in function parameters
- Use default props where appropriate
- Document complex props with JSDoc comments

```typescript
interface ButtonProps {
  /** The content to display inside the button */
  children: React.ReactNode;
  /** The variant style to apply */
  variant?: "primary" | "secondary" | "ghost";
  /** Whether the button is in a disabled state */
  disabled?: boolean;
  /** Handler called when the button is clicked */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  disabled = false,
  onClick,
}) => {
  // Implementation
};
```

### Hooks Usage

- Follow the Rules of Hooks
- Use appropriate dependencies in `useEffect`
- Use memoization (`useMemo`, `useCallback`) judiciously for performance
- Extract reusable logic into custom hooks

```typescript
// Good custom hook
function useLinks(pageId: string) {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchLinks() {
      try {
        setIsLoading(true);
        const data = await api.getLinks(pageId);
        if (isMounted) {
          setLinks(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchLinks();

    return () => {
      isMounted = false;
    };
  }, [pageId]);

  return { links, isLoading, error };
}
```

### Next.js Patterns

- Use App Router conventions and best practices
- Server Components vs. Client Components: Use Server Components by default, mark with "use client" only when needed
- Follow Next.js data fetching patterns
- Use appropriate caching strategies

## CSS & Tailwind Conventions

### Tailwind Usage

- Use Tailwind utility classes directly in JSX
- Create consistent components using Tailwind's composition pattern
- Use meaningful class ordering (layout → typography → visual)
- Extract repeated patterns into component classes using `@apply`

```typescript
// Good component with Tailwind
const LinkCard: React.FC<LinkCardProps> = ({ title, url }) => {
  return (
    <a
      href={url}
      className="block p-4 mb-3 rounded-lg shadow-md bg-white dark:bg-gray-800
                 hover:shadow-lg transition-shadow"
      target="_blank"
      rel="noopener noreferrer"
    >
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{url}</p>
    </a>
  );
};
```

### Custom CSS

- Use Tailwind when possible
- When custom CSS is needed, use CSS Modules or `styled-components`
- Follow BEM naming convention for custom CSS classes
- Use CSS variables for theming and customization

## API & Backend Conventions

### API Design

- Follow RESTful principles
- Use consistent URL patterns and naming
- Return appropriate HTTP status codes
- Include useful error messages and validation feedback

### Error Handling

- Use try/catch blocks for async code
- Create consistent error response format
- Log errors appropriately
- Handle expected edge cases explicitly

```typescript
// Good error handling
async function handleSubmit(data: FormData) {
  try {
    const response = await api.createLink(data);
    return { success: true, data: response };
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle specific API errors
      console.error("API Error:", error.message);
      return {
        success: false,
        error: { message: error.message, code: error.code },
      };
    }

    // Handle unexpected errors
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: { message: "An unexpected error occurred", code: "UNKNOWN_ERROR" },
    };
  }
}
```

### Data Access

- Use Prisma for database operations
- Create service abstractions for data access logic
- Implement proper data validation and sanitization
- Use transactions for operations that modify multiple records

## Testing Standards

### Unit Testing

- Test individual components and functions
- Use meaningful test descriptions
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies appropriately

```typescript
// Good test structure
describe('LinkCard', () => {
  it('renders link title and URL correctly', () => {
    // Arrange
    const props = {
      title: 'My Website',
      url: 'https://example.com',
    };

    // Act
    const { getByText } = render(<LinkCard {...props} />);

    // Assert
    expect(getByText('My Website')).toBeInTheDocument();
    expect(getByText('https://example.com')).toBeInTheDocument();
  });

  it('applies hover styles on mouse over', () => {
    // Test implementation
  });
});
```

### Integration Testing

- Test component interactions
- Test API integrations with mock servers
- Test database operations with test databases

### E2E Testing

- Focus on critical user flows
- Use realistic test data
- Test across multiple device sizes

## Documentation Guidelines

### Code Comments

- Use JSDoc comments for functions, components, and types
- Focus on "why" rather than "what" in comments
- Keep comments up-to-date with code changes
- Remove commented-out code

```typescript
/**
 * Authenticates a user with email and password
 *
 * @param email - The user's email address
 * @param password - The user's password
 * @returns User data and auth token if successful
 * @throws AuthError if credentials are invalid
 */
async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  // Implementation
}
```

### README and Documentation Files

- Maintain up-to-date README files
- Include setup instructions
- Document key architectural decisions
- Use diagrams for complex flows

## Commit Message Standards

Follow the Conventional Commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Where `type` is one of:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code changes that neither fix bugs nor add features
- **perf**: Performance improvements
- **test**: Adding or correcting tests
- **chore**: Changes to the build process, tools, etc.

Examples:

```
feat(auth): implement social login with Google

fix(links): resolve issue with link reordering

docs: update API documentation
```

## Code Review Checklist

Before submitting a PR, ensure:

1. Code follows style guidelines
2. All tests pass
3. New features have appropriate tests
4. Documentation is updated
5. No sensitive data or credentials are exposed
6. Performance considerations are addressed
7. Accessibility requirements are met
8. Browser compatibility is verified

When reviewing PRs, focus on:

1. Logic correctness
2. Edge cases and error handling
3. Security implications
4. Performance considerations
5. Maintainability and readability
6. Consistency with existing codebase

By following these guidelines, we ensure a consistent, maintainable, and high-quality codebase for the LinkHub project.
