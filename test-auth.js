// Quick authentication test script
// Test the registration and login API endpoints

const BASE_URL = "http://localhost:3001";

async function testRegistration() {
  console.log("\n=== Testing Registration ===");

  // Test with weak password
  console.log("\n1. Testing with weak password...");
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test-weak@example.com",
        password: "weak",
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }

  // Test with valid password
  console.log("\n2. Testing with valid password...");
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `test-valid-${Date.now()}@example.com`,
        password: "ValidPassword123",
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function testLogin() {
  console.log("\n=== Testing Login (Test User) ===");
  console.log("Email: test@example.com");
  console.log("Password: TestPassword123");
  console.log(
    "You can test this manually in the browser at:",
    `${BASE_URL}/login`
  );
}

async function runTests() {
  console.log("🚀 LinkHub Authentication Tests");
  console.log("================================");

  await testRegistration();
  await testLogin();

  console.log("\n✅ Tests completed!");
  console.log("\nNext steps:");
  console.log("1. Open http://localhost:3001/register to test registration UI");
  console.log("2. Open http://localhost:3001/login to test login UI");
  console.log("3. Use credentials: test@example.com / TestPassword123");
  console.log("4. Check dashboard access after successful login");
}

runTests().catch(console.error);
