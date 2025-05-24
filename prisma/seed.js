const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Create a test user with a password that meets the validation requirements
  const hashedPassword = await bcrypt.hash("TestPassword123", 12);

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      passwordHash: hashedPassword,
      isVerified: true,
      profile: {
        create: {
          displayName: "Test User",
          bio: "This is a test user for LinkHub development",
          profession: "Software Developer",
          location: "San Francisco, CA",
          websiteUrl: "https://example.com",
        },
      },
    },
  });

  console.log("Created test user:", testUser);

  // Create a test page for the user
  const testPage = await prisma.linkPage.upsert({
    where: { slug: "testuser" },
    update: {},
    create: {
      slug: "testuser",
      title: "Test User's Links",
      description: "A collection of my favorite links",
      isPublic: true,
      userId: testUser.id,
    },
  });

  console.log("Created test page:", testPage);
  // Create some test links
  const testLinks = await Promise.all([
    prisma.link.upsert({
      where: { id: "test-link-1" },
      update: {},
      create: {
        id: "test-link-1",
        title: "My Portfolio",
        url: "https://example.com/portfolio",
        description: "Check out my latest work",
        isActive: true,
        position: 1,
        pageId: testPage.id,
      },
    }),
    prisma.link.upsert({
      where: { id: "test-link-2" },
      update: {},
      create: {
        id: "test-link-2",
        title: "GitHub Profile",
        url: "https://github.com/testuser",
        description: "My open source projects",
        isActive: true,
        position: 2,
        pageId: testPage.id,
      },
    }),
    prisma.link.upsert({
      where: { id: "test-link-3" },
      update: {},
      create: {
        id: "test-link-3",
        title: "LinkedIn",
        url: "https://linkedin.com/in/testuser",
        description: "Professional network",
        isActive: true,
        position: 3,
        pageId: testPage.id,
      },
    }),
  ]);

  console.log("Created test links:", testLinks.length);
  console.log("Seed data created successfully!");
  console.log("You can now login with:");
  console.log("Email: test@example.com");
  console.log("Password: TestPassword123");
  console.log("Public page: http://localhost:3001/testuser");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
