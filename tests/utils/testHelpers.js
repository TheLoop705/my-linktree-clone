const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

// Ensure we're using the test database
const databaseUrl = process.env.NODE_ENV === 'test' 
  ? (process.env.TEST_DATABASE_URL || "file:./prisma/test.db")
  : "file:./prisma/test.db";

const testDb = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

// Debug logging for test environment
if (process.env.NODE_ENV === 'test') {
  console.log('Test database URL:', databaseUrl);
}

/**
 * Create a test user with hashed password
 */
async function createTestUser(userData = {}) {
  const defaultUser = {
    email: `test-${Date.now()}@example.com`,
    password: "TestPassword123",
    isVerified: true,
    isActive: true,
  };

  const user = { ...defaultUser, ...userData };
  const passwordHash = await bcrypt.hash(user.password, 12);

  const createdUser = await testDb.user.create({
    data: {
      email: user.email,
      passwordHash,
      isVerified: user.isVerified,
      isActive: user.isActive,
    },
    include: {
      profile: true,
      pages: true,
    },
  });

  // Return user with plain password for testing
  return {
    ...createdUser,
    password: user.password,
  };
}

/**
 * Create a test user with profile
 */
async function createTestUserWithProfile(userData = {}, profileData = {}) {
  const user = await createTestUser(userData);

  const defaultProfile = {
    displayName: "Test User",
    bio: "Test bio",
    profession: "Developer",
  };

  const profile = await testDb.userProfile.create({
    data: {
      ...defaultProfile,
      ...profileData,
      userId: user.id,
    },
  });

  return {
    ...user,
    profile,
  };
}

/**
 * Create a test link page
 */
async function createTestLinkPage(userId, pageData = {}) {
  const defaultPage = {
    title: "Test Page",
    slug: `test-page-${Date.now()}`,
    isPublic: true,
  };

  return await testDb.linkPage.create({
    data: {
      ...defaultPage,
      ...pageData,
      userId,
    },
    include: {
      links: true,
    },
  });
}

/**
 * Create test links for a page
 */
async function createTestLinks(pageId, linksData = []) {
  const defaultLinks = [
    {
      title: "Test Link 1",
      url: "https://example.com",
      position: 0,
      isActive: true,
    },
    {
      title: "Test Link 2",
      url: "https://google.com",
      position: 1,
      isActive: true,
    },
  ];

  const links = linksData.length > 0 ? linksData : defaultLinks;

  const createdLinks = [];
  for (const linkData of links) {
    const link = await testDb.link.create({
      data: {
        ...linkData,
        pageId,
      },
    });
    createdLinks.push(link);
  }

  return createdLinks;
}

/**
 * Clean all test data
 */
async function cleanDatabase() {
  try {
    // Delete in order to respect foreign key constraints
    await testDb.linkAnalytics.deleteMany();
    await testDb.pageAnalytics.deleteMany();
    await testDb.pageComponent.deleteMany();
    await testDb.link.deleteMany();
    await testDb.linkPage.deleteMany();
    await testDb.userProfile.deleteMany();
    await testDb.subscription.deleteMany();
    await testDb.user.deleteMany();
  } catch (error) {
    console.warn("Database cleanup warning:", error.message);
  }
}

/**
 * Generate authentication headers for API tests
 */
function createAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * Mock next-auth session
 */
function mockSession(user) {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.profile?.displayName || user.email,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

module.exports = {
  testDb,
  createTestUser,
  createTestUserWithProfile,
  createTestLinkPage,
  createTestLinks,
  cleanDatabase,
  createAuthHeaders,
  mockSession,
};
