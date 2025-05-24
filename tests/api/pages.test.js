const {
  createTestUser,
  createTestLinkPage,
  cleanDatabase,
} = require("../utils/testHelpers");
const { testLinkPages } = require("../fixtures/testData");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Page Management API Logic", () => {
  let testUser;

  beforeEach(async () => {
    await cleanDatabase();
    testUser = await createTestUser();
  });

  describe("Page Creation", () => {
    it("should create a new page with valid data", async () => {
      const pageData = {
        title: "My Test Page",
        slug: `test-page-${Date.now()}`,
        description: "A test page description",
        isPublic: true,
        userId: testUser.id,
      };

      // Test page creation logic
      const createdPage = await prisma.linkPage.create({
        data: pageData,
      });

      expect(createdPage).toBeDefined();
      expect(createdPage.title).toBe(pageData.title);
      expect(createdPage.slug).toBe(pageData.slug);
      expect(createdPage.userId).toBe(testUser.id);
      expect(createdPage.isPublic).toBe(true);
    });

    it("should reject page creation with duplicate slug", async () => {
      const slug = "duplicate-slug";

      // Create first page
      await createTestLinkPage(testUser.id, { slug });

      // Try to create another page with the same slug
      await expect(
        prisma.linkPage.create({
          data: {
            title: "Another Page",
            slug: slug,
            userId: testUser.id,
          },
        })
      ).rejects.toThrow();
    });

    it("should validate required fields", async () => {
      // Test missing title
      await expect(
        prisma.linkPage.create({
          data: {
            slug: "test-slug",
            userId: testUser.id,
            // Missing title
          },
        })
      ).rejects.toThrow();

      // Test missing slug
      await expect(
        prisma.linkPage.create({
          data: {
            title: "Test Page",
            userId: testUser.id,
            // Missing slug
          },
        })
      ).rejects.toThrow();
    });

    it("should create page with default values", async () => {
      const pageData = {
        title: "Minimal Page",
        slug: `minimal-${Date.now()}`,
        userId: testUser.id,
      };

      const createdPage = await prisma.linkPage.create({
        data: pageData,
      });

      expect(createdPage.isPublic).toBe(false); // Default value
      expect(createdPage.description).toBe(null); // Optional field
    });
  });

  describe("Page Retrieval", () => {
    let testPage;

    beforeEach(async () => {
      testPage = await createTestLinkPage(testUser.id);
    });

    it("should find page by id", async () => {
      const foundPage = await prisma.linkPage.findUnique({
        where: { id: testPage.id },
      });

      expect(foundPage).toBeDefined();
      expect(foundPage.id).toBe(testPage.id);
      expect(foundPage.title).toBe(testPage.title);
    });

    it("should find page by slug", async () => {
      const foundPage = await prisma.linkPage.findUnique({
        where: { slug: testPage.slug },
      });

      expect(foundPage).toBeDefined();
      expect(foundPage.slug).toBe(testPage.slug);
    });

    it("should return null for non-existent page", async () => {
      const notFound = await prisma.linkPage.findUnique({
        where: { id: "non-existent-id" },
      });

      expect(notFound).toBe(null);
    });

    it("should find pages by user", async () => {
      // Create additional pages
      await createTestLinkPage(testUser.id, { slug: "page-2" });
      await createTestLinkPage(testUser.id, { slug: "page-3" });

      const userPages = await prisma.linkPage.findMany({
        where: { userId: testUser.id },
      });

      expect(userPages).toHaveLength(3);
      expect(userPages.every((page) => page.userId === testUser.id)).toBe(true);
    });

    it("should find only public pages when filtering", async () => {
      // Create a mix of public and private pages
      await createTestLinkPage(testUser.id, {
        slug: "public-1",
        isPublic: true,
      });
      await createTestLinkPage(testUser.id, {
        slug: "private-1",
        isPublic: false,
      });
      await createTestLinkPage(testUser.id, {
        slug: "public-2",
        isPublic: true,
      });

      const publicPages = await prisma.linkPage.findMany({
        where: {
          userId: testUser.id,
          isPublic: true,
        },
      });

      expect(publicPages).toHaveLength(2);
      expect(publicPages.every((page) => page.isPublic === true)).toBe(true);
    });
  });

  describe("Page Updates", () => {
    let testPage;

    beforeEach(async () => {
      testPage = await createTestLinkPage(testUser.id);
    });

    it("should update page title", async () => {
      const newTitle = "Updated Page Title";

      const updatedPage = await prisma.linkPage.update({
        where: { id: testPage.id },
        data: { title: newTitle },
      });

      expect(updatedPage.title).toBe(newTitle);
      expect(updatedPage.slug).toBe(testPage.slug); // Should remain unchanged
    });

    it("should update page visibility", async () => {
      const updatedPage = await prisma.linkPage.update({
        where: { id: testPage.id },
        data: { isPublic: !testPage.isPublic },
      });

      expect(updatedPage.isPublic).toBe(!testPage.isPublic);
    });

    it("should update page description", async () => {
      const newDescription = "Updated description";

      const updatedPage = await prisma.linkPage.update({
        where: { id: testPage.id },
        data: { description: newDescription },
      });

      expect(updatedPage.description).toBe(newDescription);
    });

    it("should update multiple fields", async () => {
      const updates = {
        title: "New Title",
        description: "New Description",
        isPublic: !testPage.isPublic,
      };

      const updatedPage = await prisma.linkPage.update({
        where: { id: testPage.id },
        data: updates,
      });

      expect(updatedPage.title).toBe(updates.title);
      expect(updatedPage.description).toBe(updates.description);
      expect(updatedPage.isPublic).toBe(updates.isPublic);
    });

    it("should reject update to duplicate slug", async () => {
      // Create another page
      const otherPage = await createTestLinkPage(testUser.id, {
        slug: "other-page",
      });

      // Try to update first page to use the other page's slug
      await expect(
        prisma.linkPage.update({
          where: { id: testPage.id },
          data: { slug: otherPage.slug },
        })
      ).rejects.toThrow();
    });
  });

  describe("Page Deletion", () => {
    let testPage;

    beforeEach(async () => {
      testPage = await createTestLinkPage(testUser.id);
    });

    it("should delete page", async () => {
      await prisma.linkPage.delete({
        where: { id: testPage.id },
      });

      const deletedPage = await prisma.linkPage.findUnique({
        where: { id: testPage.id },
      });

      expect(deletedPage).toBe(null);
    });

    it("should fail to delete non-existent page", async () => {
      await expect(
        prisma.linkPage.delete({
          where: { id: "non-existent-id" },
        })
      ).rejects.toThrow();
    });
  });

  describe("Page Analytics Integration", () => {
    let testPage;

    beforeEach(async () => {
      testPage = await createTestLinkPage(testUser.id);
    });
    it("should create page analytics record", async () => {
      const analyticsData = {
        pageId: testPage.id,
        visitorIp: "127.0.0.1",
        visitorDevice: "Desktop",
        visitorBrowser: "Chrome",
        visitorOs: "Windows",
        visitorCountry: "US",
        visitorCity: "New York",
        referrer: "https://google.com",
        sessionId: "test-session-123",
      };

      const analytics = await prisma.pageAnalytics.create({
        data: analyticsData,
      });

      expect(analytics.pageId).toBe(testPage.id);
      expect(analytics.visitorIp).toBe("127.0.0.1");
      expect(analytics.visitorDevice).toBe("Desktop");
      expect(analytics.timestamp).toBeDefined();
    });

    it("should find analytics for page", async () => {
      // Create some analytics data
      await prisma.pageAnalytics.create({
        data: {
          pageId: testPage.id,
          visitorIp: "127.0.0.1",
          sessionId: "session-1",
        },
      });

      await prisma.pageAnalytics.create({
        data: {
          pageId: testPage.id,
          visitorIp: "192.168.1.1",
          sessionId: "session-2",
        },
      });

      const analytics = await prisma.pageAnalytics.findMany({
        where: { pageId: testPage.id },
      });

      expect(analytics).toHaveLength(1);
      expect(analytics[0].pageId).toBe(testPage.id);
    });
  });
});
