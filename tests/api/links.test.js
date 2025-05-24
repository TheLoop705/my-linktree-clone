const {
  createTestUser,
  createTestLinkPage,
  createTestLinks,
  cleanDatabase,
} = require("../utils/testHelpers");
const { testLinks } = require("../fixtures/testData");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Link Management API Logic", () => {
  let testUser, testPage;

  beforeEach(async () => {
    await cleanDatabase();
    testUser = await createTestUser();
    testPage = await createTestLinkPage(testUser.id);
  });

  describe("Link Creation", () => {
    it("should create a new link", async () => {
      const linkData = {
        title: "Test Link",
        url: "https://example.com",
        pageId: testPage.id,
        position: 0,
        isActive: true,
      };

      const createdLink = await prisma.link.create({
        data: linkData,
      });

      expect(createdLink).toBeDefined();
      expect(createdLink.title).toBe(linkData.title);
      expect(createdLink.url).toBe(linkData.url);
      expect(createdLink.pageId).toBe(testPage.id);
      expect(createdLink.position).toBe(0);
      expect(createdLink.isActive).toBe(true);
    });

    it("should validate URL format", async () => {
      const linkData = {
        title: "Test Link",
        url: "invalid-url",
        pageId: testPage.id,
        position: 0,
      };

      // This would normally be validated at the API level
      // Here we test that invalid URLs can be stored but would fail validation
      const createdLink = await prisma.link.create({
        data: linkData,
      });

      expect(createdLink.url).toBe("invalid-url");

      // Test URL validation logic
      const urlRegex = /^https?:\/\/.+/;
      expect(urlRegex.test(createdLink.url)).toBe(false);
    });

    it("should create link with default values", async () => {
      const linkData = {
        title: "Minimal Link",
        url: "https://example.com",
        pageId: testPage.id,
      };

      const createdLink = await prisma.link.create({
        data: linkData,
      });

      expect(createdLink.isActive).toBe(true); // Default value
      expect(createdLink.position).toBe(0); // Default value
      expect(createdLink.description).toBe(null); // Optional field
    });

    it("should validate required fields", async () => {
      // Test missing title
      await expect(
        prisma.link.create({
          data: {
            url: "https://example.com",
            pageId: testPage.id,
            // Missing title
          },
        })
      ).rejects.toThrow();

      // Test missing URL
      await expect(
        prisma.link.create({
          data: {
            title: "Test Link",
            pageId: testPage.id,
            // Missing url
          },
        })
      ).rejects.toThrow();
    });
  });

  describe("Link Retrieval", () => {
    let testLinks;

    beforeEach(async () => {
      testLinks = await createTestLinks(testPage.id, 3);
    });

    it("should find links by page", async () => {
      const pageLinks = await prisma.link.findMany({
        where: { pageId: testPage.id },
        orderBy: { position: "asc" },
      });

      expect(pageLinks).toHaveLength(3);
      expect(pageLinks.every((link) => link.pageId === testPage.id)).toBe(true);

      // Check ordering
      expect(pageLinks[0].position).toBeLessThanOrEqual(pageLinks[1].position);
      expect(pageLinks[1].position).toBeLessThanOrEqual(pageLinks[2].position);
    });

    it("should find link by id", async () => {
      const foundLink = await prisma.link.findUnique({
        where: { id: testLinks[0].id },
      });

      expect(foundLink).toBeDefined();
      expect(foundLink.id).toBe(testLinks[0].id);
      expect(foundLink.title).toBe(testLinks[0].title);
    });

    it("should return null for non-existent link", async () => {
      const notFound = await prisma.link.findUnique({
        where: { id: "non-existent-id" },
      });

      expect(notFound).toBe(null);
    });

    it("should find only active links when filtering", async () => {
      // Create a mix of active and inactive links
      await prisma.link.create({
        data: {
          title: "Inactive Link",
          url: "https://inactive.com",
          pageId: testPage.id,
          isActive: false,
          position: 10,
        },
      });

      const activeLinks = await prisma.link.findMany({
        where: {
          pageId: testPage.id,
          isActive: true,
        },
      });

      expect(activeLinks).toHaveLength(3); // Original test links
      expect(activeLinks.every((link) => link.isActive === true)).toBe(true);
    });
  });

  describe("Link Updates", () => {
    let testLink;

    beforeEach(async () => {
      const testLinks = await createTestLinks(testPage.id, 1);
      testLink = testLinks[0];
    });

    it("should update link title", async () => {
      const newTitle = "Updated Link Title";

      const updatedLink = await prisma.link.update({
        where: { id: testLink.id },
        data: { title: newTitle },
      });

      expect(updatedLink.title).toBe(newTitle);
      expect(updatedLink.url).toBe(testLink.url); // Should remain unchanged
    });

    it("should update link URL", async () => {
      const newUrl = "https://updated-example.com";

      const updatedLink = await prisma.link.update({
        where: { id: testLink.id },
        data: { url: newUrl },
      });

      expect(updatedLink.url).toBe(newUrl);
      expect(updatedLink.title).toBe(testLink.title); // Should remain unchanged
    });

    it("should update link position", async () => {
      const newPosition = 5;

      const updatedLink = await prisma.link.update({
        where: { id: testLink.id },
        data: { position: newPosition },
      });

      expect(updatedLink.position).toBe(newPosition);
    });

    it("should toggle link active status", async () => {
      const updatedLink = await prisma.link.update({
        where: { id: testLink.id },
        data: { isActive: !testLink.isActive },
      });

      expect(updatedLink.isActive).toBe(!testLink.isActive);
    });

    it("should update multiple fields", async () => {
      const updates = {
        title: "New Title",
        url: "https://newurl.com",
        description: "New Description",
        position: 10,
      };

      const updatedLink = await prisma.link.update({
        where: { id: testLink.id },
        data: updates,
      });

      expect(updatedLink.title).toBe(updates.title);
      expect(updatedLink.url).toBe(updates.url);
      expect(updatedLink.description).toBe(updates.description);
      expect(updatedLink.position).toBe(updates.position);
    });
  });

  describe("Link Deletion", () => {
    let testLink;

    beforeEach(async () => {
      const testLinks = await createTestLinks(testPage.id, 1);
      testLink = testLinks[0];
    });

    it("should delete link", async () => {
      await prisma.link.delete({
        where: { id: testLink.id },
      });

      const deletedLink = await prisma.link.findUnique({
        where: { id: testLink.id },
      });

      expect(deletedLink).toBe(null);
    });

    it("should fail to delete non-existent link", async () => {
      await expect(
        prisma.link.delete({
          where: { id: "non-existent-id" },
        })
      ).rejects.toThrow();
    });
  });

  describe("Link Analytics Integration", () => {
    let testLink;

    beforeEach(async () => {
      const testLinks = await createTestLinks(testPage.id, 1);
      testLink = testLinks[0];
    });

    it("should create link analytics record", async () => {
      const analyticsData = {
        linkId: testLink.id,
        clicks: 5,
        uniqueClicks: 4,
        date: new Date(),
      };

      const analytics = await prisma.linkAnalytics.create({
        data: analyticsData,
      });

      expect(analytics.linkId).toBe(testLink.id);
      expect(analytics.clicks).toBe(5);
      expect(analytics.uniqueClicks).toBe(4);
    });

    it("should find analytics for link", async () => {
      // Create some analytics data
      await prisma.linkAnalytics.create({
        data: {
          linkId: testLink.id,
          clicks: 10,
          uniqueClicks: 8,
          date: new Date(),
        },
      });

      const analytics = await prisma.linkAnalytics.findMany({
        where: { linkId: testLink.id },
      });

      expect(analytics).toHaveLength(1);
      expect(analytics[0].linkId).toBe(testLink.id);
      expect(analytics[0].clicks).toBe(10);
    });
  });

  describe("Link Positioning and Reordering", () => {
    let testLinks;

    beforeEach(async () => {
      testLinks = await createTestLinks(testPage.id, 5);
    });

    it("should maintain position ordering", async () => {
      const orderedLinks = await prisma.link.findMany({
        where: { pageId: testPage.id },
        orderBy: { position: "asc" },
      });

      for (let i = 1; i < orderedLinks.length; i++) {
        expect(orderedLinks[i].position).toBeGreaterThanOrEqual(
          orderedLinks[i - 1].position
        );
      }
    });

    it("should handle position updates for reordering", async () => {
      // Move first link to position 10
      await prisma.link.update({
        where: { id: testLinks[0].id },
        data: { position: 10 },
      });

      const reorderedLinks = await prisma.link.findMany({
        where: { pageId: testPage.id },
        orderBy: { position: "asc" },
      });

      // The moved link should now be last
      expect(reorderedLinks[reorderedLinks.length - 1].id).toBe(
        testLinks[0].id
      );
      expect(reorderedLinks[reorderedLinks.length - 1].position).toBe(10);
    });

    it("should allow multiple links with same position", async () => {
      // Update multiple links to have the same position
      await prisma.link.update({
        where: { id: testLinks[0].id },
        data: { position: 5 },
      });

      await prisma.link.update({
        where: { id: testLinks[1].id },
        data: { position: 5 },
      });

      const samePositionLinks = await prisma.link.findMany({
        where: {
          pageId: testPage.id,
          position: 5,
        },
      });

      expect(samePositionLinks).toHaveLength(2);
    });
  });

  describe("Link Page Relationship", () => {
    it("should maintain foreign key relationship", async () => {
      const linkWithPage = await prisma.link.findFirst({
        where: { pageId: testPage.id },
        include: { page: true },
      });

      expect(linkWithPage.page).toBeDefined();
      expect(linkWithPage.page.id).toBe(testPage.id);
      expect(linkWithPage.page.userId).toBe(testUser.id);
    });

    it("should cascade delete when page is deleted", async () => {
      // Create some links
      await createTestLinks(testPage.id, 3);

      // Delete the page
      await prisma.linkPage.delete({
        where: { id: testPage.id },
      });

      // Links should be deleted due to cascade
      const orphanedLinks = await prisma.link.findMany({
        where: { pageId: testPage.id },
      });

      expect(orphanedLinks).toHaveLength(0);
    });
  });
});
