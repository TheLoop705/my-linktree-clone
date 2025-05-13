# LinkHub Project Structure

```
linkhub/
├── .github/                      # GitHub-specific files
│   ├── workflows/                # GitHub Actions CI/CD workflows
│   │   ├── ci.yml                # Continuous Integration workflow
│   │   └── deployment.yml        # Deployment workflow
│   ├── ISSUE_TEMPLATE/           # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md  # PR template
├── .husky/                       # Git hooks for code quality
├── prisma/                       # Prisma ORM configuration
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Database seed data
├── public/                       # Static assets
│   ├── images/                   # Image assets
│   ├── icons/                    # Icon assets
│   └── favicon.ico               # Site favicon
├── src/                          # Application source code
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── pages/            # Page management endpoints
│   │   │   └── links/            # Link management endpoints
│   │   ├── (auth)/               # Authentication routes
│   │   │   ├── login/            # Login page
│   │   │   ├── register/         # Registration page
│   │   │   └── forgot-password/  # Password recovery
│   │   ├── (dashboard)/          # Dashboard routes
│   │   │   ├── layout.tsx        # Dashboard layout
│   │   │   ├── page.tsx          # Dashboard home page
│   │   │   ├── links/            # Link management
│   │   │   ├── appearance/       # Appearance customization
│   │   │   ├── analytics/        # Analytics dashboard
│   │   │   └── settings/         # Account settings
│   │   ├── (marketing)/          # Public marketing pages
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── features/         # Features page
│   │   │   ├── pricing/          # Pricing page
│   │   │   └── about/            # About page
│   │   ├── p/[slug]/             # Public link pages
│   │   │   └── page.tsx          # Public profile page
│   │   ├── r/[linkId]/           # Redirect handler
│   │   │   └── page.tsx          # Link redirect page
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Root page
│   ├── components/               # Reusable UI components
│   │   ├── auth/                 # Authentication components
│   │   ├── dashboard/            # Dashboard components
│   │   ├── forms/                # Form components
│   │   ├── layout/               # Layout components
│   │   ├── links/                # Link-related components
│   │   ├── marketing/            # Marketing page components
│   │   ├── profile/              # Profile components
│   │   ├── theme/                # Theme components
│   │   └── ui/                   # Basic UI components
│   ├── lib/                      # Utility libraries
│   │   ├── api/                  # API client functions
│   │   ├── auth/                 # Auth utilities
│   │   ├── db/                   # Database utilities
│   │   ├── utils/                # General utilities
│   │   └── validation/           # Form validation
│   ├── hooks/                    # Custom React hooks
│   ├── context/                  # React context providers
│   ├── types/                    # TypeScript type definitions
│   ├── styles/                   # Global styles
│   └── middleware.ts             # Next.js middleware
├── docs/                         # Project documentation
│   ├── api/                      # API documentation
│   ├── architecture/             # Architecture docs
│   ├── database/                 # Database docs
│   └── ui/                       # UI/UX docs
├── scripts/                      # Utility scripts
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
├── .env.example                  # Example environment variables
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── jest.config.js                # Jest configuration
├── next.config.js                # Next.js configuration
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # NPM package configuration
├── docker-compose.yml            # Docker Compose configuration
├── Dockerfile                    # Docker configuration
└── README.md                     # Project overview
```
