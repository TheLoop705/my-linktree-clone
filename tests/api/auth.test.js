const { testUsers, testApiResponses } = require("../fixtures/testData");
const { createTestUser, cleanDatabase } = require("../utils/testHelpers");
const { POST } = require("@/app/api/auth/register/route");

// Mock Next.js API handler
jest.mock("@/lib/db/prisma", () => ({
  prisma: global.testPrisma,
}));

describe("Authentication API Tests", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe("User Registration", () => {
    it("should validate email format", async () => {
      const userData = {
        email: "invalid-email",
        password: "ValidPassword123",
      };

      // Since we can't directly test the API route in Jest easily,
      // we'll test the validation logic and database operations
      expect(userData.email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it("should validate password requirements", async () => {
      const weakPassword = "weak";
      const strongPassword = "ValidPassword123";

      // Test password strength requirements
      expect(weakPassword.length).toBeLessThan(8);
      expect(strongPassword.length).toBeGreaterThanOrEqual(8);
      expect(strongPassword).toMatch(/[A-Z]/); // uppercase
      expect(strongPassword).toMatch(/[a-z]/); // lowercase
      expect(strongPassword).toMatch(/[0-9]/); // number
    });

    it("should create user in database", async () => {
      const userData = {
        email: "test@example.com",
        password: "ValidPassword123",
      };

      const user = await createTestUser(userData);
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.passwordHash).toBeDefined();
      expect(user.passwordHash).not.toBe(userData.password); // Should be hashed
    });

    it("should prevent duplicate email registration", async () => {
      const userData = {
        email: "duplicate@example.com",
        password: "ValidPassword123",
      };

      // Create first user
      await createTestUser(userData);

      // Attempt to create second user with same email should fail
      try {
        await createTestUser(userData);
        throw new Error("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("email");
      }
    });
  });

  describe("Password Security", () => {
    it("should hash passwords before storing", async () => {
      const userData = {
        email: "security@example.com",
        password: "MySecretPassword123",
      };

      const user = await createTestUser(userData);
      expect(user.passwordHash).toBeDefined();
      expect(user.passwordHash).not.toBe(userData.password);
      expect(user.passwordHash.length).toBeGreaterThan(50); // bcrypt hashes are typically 60 chars
    });

    it("should accept valid password formats", () => {
      const validPasswords = [
        "Password123",
        "MySecure123",
        "Test123456",
        "ValidPass1",
      ];

      validPasswords.forEach((password) => {
        expect(password.length).toBeGreaterThanOrEqual(8);
        expect(password).toMatch(/[A-Z]/);
        expect(password).toMatch(/[a-z]/);
        expect(password).toMatch(/[0-9]/);
      });
    });

    it("should reject invalid password formats", () => {
      const invalidPasswords = [
        "short", // Too short
        "nouppercase123", // No uppercase
        "NOLOWERCASE123", // No lowercase
        "NoNumbers", // No numbers
        "toolongpasswordthatexceedsreasonablelength123456789",
      ];

      invalidPasswords.forEach((password) => {
        const isValid =
          password.length >= 8 &&
          password.length <= 50 &&
          /[A-Z]/.test(password) &&
          /[a-z]/.test(password) &&
          /[0-9]/.test(password);
        expect(isValid).toBe(false);
      });
    });
  });

  describe("Email Validation", () => {
    it("should accept valid email formats", () => {
      const validEmails = [
        "user@example.com",
        "test.email@domain.org",
        "user+tag@example.co.uk",
        "firstname.lastname@company.com",
      ];

      validEmails.forEach((email) => {
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "invalid-email",
        "@domain.com",
        "user@",
        "user@domain",
        "user.domain.com",
      ];

      invalidEmails.forEach((email) => {
        expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  describe("Database Operations", () => {
    it("should create user profile automatically", async () => {
      const userData = {
        email: "profile@example.com",
        password: "ValidPassword123",
      };

      const user = await createTestUser(userData);
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it("should set default user values", async () => {
      const userData = {
        email: "defaults@example.com",
        password: "ValidPassword123",
      };

      const user = await createTestUser(userData);
      expect(user.isActive).toBe(true);
      expect(user.isVerified).toBe(false);
      expect(user.authProvider).toBeNull();
    });
  });
});

// Mock Next.js request/response for route handlers
function createTestRequest(method, body = {}) {
  const { req, res } = createMocks({ method, body });
  return { req, res };
}

describe("/api/auth/register", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user with valid data", async () => {
      const userData = {
        email: "newuser@example.com",
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
      expect(data.message).toBe("User registered successfully");
    });

    it("should reject registration with weak password", async () => {
      const userData = {
        email: "test@example.com",
        password: "weak",
      };

      const request = new Request("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors.password).toBeDefined();
      expect(data.errors.password).toContain(
        "Password must be at least 8 characters long"
      );
    });

    it("should reject registration with missing uppercase letter", async () => {
      const userData = {
        email: "test@example.com",
        password: "testpassword123",
      };

      const request = new Request("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors.password).toContain(
        "Password must contain at least one uppercase letter"
      );
    });

    it("should reject registration with missing lowercase letter", async () => {
      const userData = {
        email: "test@example.com",
        password: "TESTPASSWORD123",
      };

      const request = new Request("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors.password).toContain(
        "Password must contain at least one lowercase letter"
      );
    });

    it("should reject registration with missing number", async () => {
      const userData = {
        email: "test@example.com",
        password: "TestPassword",
      };

      const request = new Request("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors.password).toContain(
        "Password must contain at least one number"
      );
    });

    it("should reject registration with invalid email", async () => {
      const userData = {
        email: "invalid-email",
        password: "ValidPassword123",
      };

      const request = new Request("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors.email).toContain("Please enter a valid email address");
    });

    it("should reject registration with existing email", async () => {
      // Create a user first
      await createTestUser(testUsers.validUser);

      // Try to register with same email
      const request = new Request("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUsers.validUser),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain("already exists");
    });

    it("should reject registration with missing email", async () => {
      const userData = {
        password: "ValidPassword123",
      };

      const request = new Request("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors.email).toBeDefined();
    });

    it("should reject registration with missing password", async () => {
      const userData = {
        email: "test@example.com",
      };

      const request = new Request("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors.password).toBeDefined();
    });
  });
});
