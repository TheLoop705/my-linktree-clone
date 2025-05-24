// Simple configuration test
describe("Test Infrastructure", () => {
  it("should have Jest properly configured", () => {
    expect(true).toBe(true);
  });

  it("should have access to test environment", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it("should have test helpers available", () => {
    // Test that our module paths work
    expect(() => {
      require("../utils/testHelpers");
    }).not.toThrow();
  });

  it("should have test fixtures available", () => {
    const { testUsers } = require("../fixtures/testData");
    expect(testUsers).toBeDefined();
    expect(testUsers.validUser).toBeDefined();
    expect(testUsers.validUser.email).toBe("test@example.com");
  });
});
