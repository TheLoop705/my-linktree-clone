const { PrismaClient } = require("@prisma/client");

// Setup for API tests
let prisma;

beforeAll(async () => {
  // Initialize Prisma client for tests
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL || "file:./test.db",
      },
    },
  });

  // Connect to database
  await prisma.$connect();

  // For now, skip the migration step to avoid permission issues
  // We'll use the existing database structure
  console.log("API test setup complete");
});

beforeEach(async () => {
  // Clean database before each test
  // Use deleteMany to clean up data in order (respecting foreign key constraints)
  try {
    // Delete dependent records first
    await prisma.linkAnalytics.deleteMany();
    await prisma.pageAnalytics.deleteMany();
    await prisma.pageComponent.deleteMany();
    await prisma.pageTheme.deleteMany();
    await prisma.link.deleteMany();
    await prisma.linkPage.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.warn("Database cleanup warning:", error.message);
  }
});

afterAll(async () => {
  // Clean up and disconnect
  if (prisma) {
    try {
      // Final cleanup
      await prisma.linkAnalytics.deleteMany();
      await prisma.pageAnalytics.deleteMany();
      await prisma.pageComponent.deleteMany();
      await prisma.pageTheme.deleteMany();
      await prisma.link.deleteMany();
      await prisma.linkPage.deleteMany();
      await prisma.userProfile.deleteMany();
      await prisma.subscription.deleteMany();
      await prisma.user.deleteMany();
    } catch (error) {
      console.warn("Final cleanup warning:", error.message);
    }
    await prisma.$disconnect();
  }
});

// Make prisma available globally in API tests
global.testPrisma = prisma;
