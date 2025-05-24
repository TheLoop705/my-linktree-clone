// Test fixtures for consistent test data
const testUsers = {
  validUser: {
    email: "test@example.com",
    password: "TestPassword123",
  },
  adminUser: {
    email: "admin@example.com",
    password: "AdminPassword123",
  },
  newUser: {
    email: "newuser@example.com",
    password: "NewPassword123",
  },
};

const testUserProfiles = {
  basicProfile: {
    displayName: "Test User",
    bio: "This is a test user profile",
    profession: "Software Developer",
    location: "Test City",
    websiteUrl: "https://testuser.com",
  },
  influencerProfile: {
    displayName: "Influencer User",
    bio: "Social media influencer and content creator",
    profession: "Content Creator",
    location: "Los Angeles, CA",
    websiteUrl: "https://influencer.com",
  },
};

const testLinkPages = {
  basicPage: {
    title: "My Test Page",
    slug: "test-page",
    isPublic: true,
    theme: "default",
    customCss: "",
    seoTitle: "Test Page",
    seoDescription: "This is a test page",
  },
  privatePage: {
    title: "Private Page",
    slug: "private-page",
    isPublic: false,
    theme: "dark",
    customCss: "body { background: #000; }",
    seoTitle: "Private Test Page",
    seoDescription: "This is a private test page",
  },
};

const testLinks = {
  socialLinks: [
    {
      title: "Instagram",
      url: "https://instagram.com/testuser",
      position: 0,
      isActive: true,
      type: "social",
    },
    {
      title: "Twitter",
      url: "https://twitter.com/testuser",
      position: 1,
      isActive: true,
      type: "social",
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com/in/testuser",
      position: 2,
      isActive: true,
      type: "social",
    },
  ],
  businessLinks: [
    {
      title: "My Portfolio",
      url: "https://portfolio.testuser.com",
      position: 0,
      isActive: true,
      type: "website",
    },
    {
      title: "Book a Call",
      url: "https://calendly.com/testuser",
      position: 1,
      isActive: true,
      type: "booking",
    },
    {
      title: "Download Resume",
      url: "https://drive.google.com/file/d/resume.pdf",
      position: 2,
      isActive: true,
      type: "document",
    },
  ],
};

const testApiResponses = {
  registrationSuccess: {
    message: "User registered successfully",
    success: true,
  },
  registrationError: {
    message: "Registration failed",
    success: false,
    errors: {
      email: ["Email already exists"],
    },
  },
  loginSuccess: {
    message: "Login successful",
    success: true,
  },
  loginError: {
    message: "Invalid credentials",
    success: false,
  },
  validationError: {
    message: "Validation failed",
    success: false,
    errors: {
      password: ["Password must be at least 8 characters long"],
    },
  },
};

const testHeaders = {
  json: {
    "Content-Type": "application/json",
  },
  auth: (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }),
};

module.exports = {
  testUsers,
  testUserProfiles,
  testLinkPages,
  testLinks,
  testApiResponses,
  testHeaders,
};
