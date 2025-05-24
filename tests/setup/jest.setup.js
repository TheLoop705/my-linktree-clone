require("@testing-library/jest-dom");

// Global test configuration for client-side tests
global.console = {
  ...console,
  // Suppress console.log in tests unless specifically needed
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
  }),
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}));

// Setup DOM globals
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Next.js Response and Request for API route testing
global.Response = class MockResponse {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || "OK";
    this.headers = new Map(Object.entries(init.headers || {}));
    this.ok = this.status >= 200 && this.status < 300;
  }

  static json(object, init = {}) {
    return new MockResponse(JSON.stringify(object), {
      ...init,
      headers: {
        "content-type": "application/json",
        ...init.headers,
      },
    });
  }

  async json() {
    return JSON.parse(this.body);
  }

  async text() {
    return this.body;
  }
};

global.Request = class MockRequest {
  constructor(input, init = {}) {
    this.url = input;
    this.method = init.method || "GET";
    this.headers = new Map(Object.entries(init.headers || {}));
    this.body = init.body;
  }

  async json() {
    return JSON.parse(this.body);
  }

  async text() {
    return this.body;
  }
};

// Mock NextResponse for API routes
jest.mock("next/server", () => ({
  NextResponse: {
    json: (object, init = {}) => global.Response.json(object, init),
    redirect: (url, init = {}) =>
      new global.Response(null, {
        ...init,
        status: 302,
        headers: { Location: url },
      }),
    next: (init = {}) => new global.Response(null, init),
  },
}));

// Mock Prisma to use Node.js client in tests
jest.mock("@prisma/client", () => {
  const { PrismaClient } = jest.requireActual("@prisma/client");
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return new PrismaClient({
        datasources: {
          db: {
            url: process.env.TEST_DATABASE_URL || "file:./test.db",
          },
        },
      });
    }),
  };
});

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.TEST_DATABASE_URL = "file:./test.db";
process.env.DATABASE_URL = "file:./test.db";
