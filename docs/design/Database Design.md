# LinkHub Database Design

## Entity Relationship Diagram (ERD)

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│                │     │                │     │                │
│      User      │─────┤   UserProfile  │     │   Subscription │
│                │     │                │     │                │
└────────────────┘     └────────────────┘     └────────────────┘
        │                      │                      │
        │                      │                      │
        │                      │                      │
        ▼                      │                      │
┌────────────────┐             │                      │
│                │             │                      │
│   LinkPage     │◄────────────┘                      │
│                │◄─────────────────────────────────  │
└────────────────┘                                  │ │
        │                                           │ │
        │                                           │ │
        ▼                                           │ │
┌────────────────┐     ┌────────────────┐          │ │
│                │     │                │          │ │
│     Link       │     │  PageAnalytics │◄─────────┘ │
│                │     │                │            │
└────────────────┘     └────────────────┘            │
        │                      │                      │
        │                      │                      │
        ▼                      ▼                      │
┌────────────────┐     ┌────────────────┐            │
│                │     │                │            │
│  LinkAnalytics │     │   PageTheme    │◄───────────┘
│                │     │                │
└────────────────┘     └────────────────┘
        │
        ▼
┌────────────────┐
│                │
│  PageComponent │
│                │
└────────────────┘
```

## Schema Definitions

### Users and Authentication

#### User

```sql
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255) UNIQUE, -- Added for email verification
    email_verification_token_expires TIMESTAMP WITH TIME ZONE, -- Added for email verification token expiry
    auth_provider VARCHAR(50),
    auth_provider_id VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP WITH TIME ZONE
);
```

#### UserProfile

```sql
CREATE TABLE "UserProfile" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    bio TEXT,
    profile_image_url VARCHAR(255),
    profession VARCHAR(100),
    location VARCHAR(100),
    website_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "User"(id)
);
```

#### Subscription

```sql
CREATE TABLE "Subscription" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_auto_renew BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR(50),
    last_payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "User"(id)
);
```

### Link Management

#### LinkPage

```sql
CREATE TABLE "LinkPage" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(100),
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    page_meta_title VARCHAR(255),
    page_meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "User"(id)
);
```

#### Link

```sql
CREATE TABLE "Link" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES "LinkPage"(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    custom_thumbnail_url VARCHAR(255),
    position INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_page FOREIGN KEY (page_id) REFERENCES "LinkPage"(id)
);
```

#### PageComponent (New Table)

```sql
CREATE TYPE "ComponentType" AS ENUM (
  'TEXT',
  'IMAGE',
  'VIDEO',
  'ICON',
  'LINK',
  'HEADER',
  'BUTTON',
  'SOCIALS',
  'SPACER',
  'DIVIDER',
  'EMBED'
);

CREATE TABLE "PageComponent" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES "LinkPage"(id) ON DELETE CASCADE,
    type "ComponentType" NOT NULL,
    "order" INTEGER NOT NULL,
    content JSONB NOT NULL,
    styles JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_page_component_page FOREIGN KEY (page_id) REFERENCES "LinkPage"(id)
);

CREATE INDEX idx_pagecomponent_page_order ON "PageComponent"(page_id, "order");
```

### Themes and Customization

#### PageTheme

```sql
CREATE TABLE "PageTheme" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES "LinkPage"(id) ON DELETE CASCADE,
    theme_name VARCHAR(100),
    is_custom BOOLEAN DEFAULT FALSE,
    background_color VARCHAR(20),
    text_color VARCHAR(20),
    accent_color VARCHAR(20),
    font_family VARCHAR(100),
    button_style VARCHAR(50),
    card_style VARCHAR(50),
    background_image_url VARCHAR(255),
    custom_css TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_page FOREIGN KEY (page_id) REFERENCES "LinkPage"(id)
);
```

### Analytics

#### PageAnalytics

```sql
CREATE TABLE "PageAnalytics" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES "LinkPage"(id) ON DELETE CASCADE,
    visitor_ip VARCHAR(50),
    visitor_device VARCHAR(100),
    visitor_browser VARCHAR(100),
    visitor_os VARCHAR(100),
    visitor_country VARCHAR(100),
    visitor_city VARCHAR(100),
    referrer VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255),
    CONSTRAINT fk_page FOREIGN KEY (page_id) REFERENCES "LinkPage"(id)
);
```

#### LinkAnalytics

```sql
CREATE TABLE "LinkAnalytics" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID NOT NULL REFERENCES "Link"(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    visitor_ip VARCHAR(50),
    visitor_device VARCHAR(100),
    visitor_browser VARCHAR(100),
    visitor_os VARCHAR(100),
    visitor_country VARCHAR(100),
    visitor_city VARCHAR(100),
    referrer VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_link FOREIGN KEY (link_id) REFERENCES "Link"(id)
);
```

## Prisma Schema

```prisma
// Prisma schema for LinkHub

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id               String        @id @default(uuid())
  email            String        @unique
  passwordHash     String?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  lastLogin        DateTime?
  isActive         Boolean       @default(true)
  isVerified       Boolean       @default(false)
  authProvider     String?
  authProviderId   String?
  resetToken       String?
  resetTokenExpires DateTime?
  emailVerificationToken String? @unique
  emailVerificationTokenExpires DateTime?

  // Relations
  profile          UserProfile?
  pages            LinkPage[]
  subscription     Subscription?
}

model UserProfile {
  id              String    @id @default(uuid())
  userId          String    @unique
  displayName     String?
  bio             String?
  profileImageUrl String?
  profession      String?
  location        String?
  websiteUrl      String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Subscription {
  id              String    @id @default(uuid())
  userId          String    @unique
  tier            String
  status          String
  startDate       DateTime
  endDate         DateTime?
  isAutoRenew     Boolean   @default(false)
  paymentMethod   String?
  lastPaymentDate DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model LinkPage {
  id                 String          @id @default(uuid())
  userId             String
  slug               String          @unique
  title              String?
  description        String?
  isPublic           Boolean         @default(true)
  pageMetaTitle      String?
  pageMetaDescription String?
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt

  // Relations
  user               User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  links              Link[]
  pageAnalytics      PageAnalytics[]
  theme              PageTheme?
  components         PageComponent[] // Added relation
}

model Link {
  id                  String          @id @default(uuid())
  pageId              String
  title               String
  url                 String
  description         String?
  icon                String?
  customThumbnailUrl  String?
  position            Int             @default(0)
  isActive            Boolean         @default(true)
  isFeatured          Boolean         @default(false)
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt

  // Relations
  page                LinkPage        @relation(fields: [pageId], references: [id], onDelete: Cascade)
  analytics           LinkAnalytics[]
}

enum ComponentType {
  TEXT
  IMAGE
  VIDEO
  ICON
  LINK
  HEADER
  BUTTON
  SOCIALS
  SPACER
  DIVIDER
  EMBED
}

model PageComponent {
  id          String        @id @default(uuid())
  pageId      String
  linkPage    LinkPage      @relation(fields: [pageId], references: [id], onDelete: Cascade)
  type        ComponentType
  order       Int
  content     Json
  styles      Json?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([pageId, order])
}

model PageTheme {
  id                 String    @id @default(uuid())
  pageId             String    @unique
  themeName          String?
  isCustom           Boolean   @default(false)
  backgroundColor    String?
  textColor          String?
  accentColor        String?
  fontFamily         String?
  buttonStyle        String?
  cardStyle          String?
  backgroundImageUrl String?
  customCss          String?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  // Relations
  page               LinkPage  @relation(fields: [pageId], references: [id], onDelete: Cascade)
}

model PageAnalytics {
  id               String    @id @default(uuid())
  pageId           String
  visitorIp        String?
  visitorDevice    String?
  visitorBrowser   String?
  visitorOs        String?
  visitorCountry   String?
  visitorCity      String?
  referrer         String?
  timestamp        DateTime  @default(now())
  sessionId        String?

  // Relations
  page             LinkPage  @relation(fields: [pageId], references: [id], onDelete: Cascade)
}

model LinkAnalytics {
  id               String    @id @default(uuid())
  linkId           String
  sessionId        String?
  visitorIp        String?
  visitorDevice    String?
  visitorBrowser   String?
  visitorOs        String?
  visitorCountry   String?
  visitorCity      String?
  referrer         String?
  timestamp        DateTime  @default(now())

  // Relations
  link             Link      @relation(fields: [linkId], references: [id], onDelete: Cascade)
}
```

## Database Indexes

```sql
-- Optimize lookups by email
CREATE INDEX idx_user_email ON "User"(email);

-- Optimize lookups by slug (username/custom path)
CREATE INDEX idx_linkpage_slug ON "LinkPage"(slug);

-- Optimize link ordering
CREATE INDEX idx_link_page_position ON "Link"(page_id, position);

-- Optimize analytics queries
CREATE INDEX idx_page_analytics_timestamp ON "PageAnalytics"(timestamp);
CREATE INDEX idx_link_analytics_timestamp ON "LinkAnalytics"(timestamp);
CREATE INDEX idx_page_analytics_page_id ON "PageAnalytics"(page_id);
CREATE INDEX idx_link_analytics_link_id ON "LinkAnalytics"(link_id);

-- Optimize subscription lookups
CREATE INDEX idx_subscription_user_id ON "Subscription"(user_id);
CREATE INDEX idx_subscription_status ON "Subscription"(status);

-- Optimize PageComponent ordering and lookup
CREATE INDEX idx_pagecomponent_page_order ON "PageComponent"(page_id, "order");
```

## Key Relationships

1. **User to UserProfile**: One-to-One relationship

   - Each user has exactly one profile

2. **User to LinkPage**: One-to-Many relationship

   - A user can have multiple link pages (basic users may be limited to one)

3. **LinkPage to Link**: One-to-Many relationship

   - Each link page contains multiple links

4. **LinkPage to PageTheme**: One-to-One relationship

   - Each link page has one theme configuration

5. **LinkPage to PageAnalytics**: One-to-Many relationship

   - Each page view generates an analytics entry

6. **Link to LinkAnalytics**: One-to-Many relationship

   - Each link click generates an analytics entry

7. **User to Subscription**: One-to-One relationship

   - Each user can have one active subscription

8. \*\*LinkPage to PageComponent: One-to-Many relationship (New)
   - Each link page can have multiple page components (widgets)

## Data Migration Considerations

1. **Version Control**: Schema versions should be tracked
2. **Incremental Updates**: Use migrations for schema changes
3. **Data Backups**: Regular backup schedule before migrations
4. **Rollback Plans**: Every migration should have a rollback strategy
5. **Data Transformation**: Plans for transforming data between schema versions

## Database Access Patterns

1. **User Authentication**: High-frequency read operations
2. **Link Page Rendering**: High-frequency read operations
3. **Analytics Collection**: High-frequency write operations
4. **Profile Updates**: Low-frequency write operations
5. **Link Management**: Medium-frequency write operations

## Security Considerations

1. **Encryption**: Sensitive data (payment info) should be encrypted at rest
2. **PII Handling**: Personal identifiable information properly protected
3. **Access Control**: Row-level security for multi-tenant data
4. **Audit Trails**: Changes to critical data should be logged
5. **GDPR Compliance**: Data deletion and export capabilities

This database design provides a scalable foundation for the LinkHub application while considering performance, security, and future growth needs.
