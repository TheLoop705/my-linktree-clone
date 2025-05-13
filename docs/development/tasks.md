# MVP Task Breakdown (from User Stories)

Effort: S = Small (~1-2h), M = Medium (~0.5-1d), L = Large (multi-day)

---

## Authentication & User Management

- Implement email/password registration (M)
- Integrate social login (Google, GitHub) (M)
- Email confirmation flow (M)
- User login/logout/session management (M)
- Password reset (M)
- Profile management (update name, email, password, profile picture, bio) (M)

## Link Management

- Add new link (title, URL, icon/emoji, style) (M) // Note: Will be re-evaluated/merged with PageComponent approach
- Edit existing link (S) // Note: Will be re-evaluated/merged with PageComponent approach
- Delete link (S) // Note: Will be re-evaluated/merged with PageComponent approach
- Drag-and-drop link reordering (M) // Note: Will be re-evaluated/merged with PageComponent approach
- Enable/disable link visibility (S) // Note: Will be re-evaluated/merged with PageComponent approach
- Validate link URLs (S)

## Page Customization

- Theme selection (light/dark mode, color presets) (M)
- Visual customization (background, font, spacing, layout) (M) // Note: Will apply to overall page and potentially individual components
- Profile image upload (S)
- Live preview of customization (M)
- Custom username/slug for public page (S)

## Public User Pages & Sharing

- Responsive public page layout (M)
- Dynamic routing for custom usernames (S)
- SEO meta tags and social sharing meta (S)
- Social share buttons (S)
- Copy/share public URL (S)

## Dashboard & Analytics

- Dashboard layout and navigation (M)
- Link management interface (M)
- Theme customization panel (M)
- Page preview (S)
- Basic analytics: page views, link clicks (M) // Note: Link clicks will need to adapt to PageComponents
- Analytics dashboard (S)

## Testing & DevOps

- Set up CI/CD pipeline (M)
- Configure linting and formatting (S)
- Add unit tests for core features (M)
- Add integration tests for flows (M)

---

## Widget-Based Page Builder (New Core Feature)

### Database & Core Model (Foundation)

- Define `PageComponent` model and `ComponentType` enum in `prisma/schema.prisma` (S)
- Update `Database Design.md` with `PageComponent` model (S)
- Run Prisma migration for `PageComponent` (S)

### API for Page Components

- API: Create `PageComponent` (`POST /api/pages/{pageId}/components`) (M)
- API: Update `PageComponent` (`PUT /api/pages/{pageId}/components/{componentId}`) (M)
- API: Delete `PageComponent` (`DELETE /api/pages/{pageId}/components/{componentId}`) (S)
- API: Reorder `PageComponents` (`POST /api/pages/{pageId}/components/reorder`) (M)

### Frontend - Page Editor Core

- FE: Basic Page Editor layout (canvas, component library panel, properties panel placeholders) (M)
- FE: Implement drag-and-drop for component addition & reordering on canvas (L)
- FE: Component Library Panel UI (displaying available component types) (S)
- FE: Properties Inspector UI (basic structure, to be populated by selected component) (M)

### Frontend - Individual Components (MVP: Text, Image, Link)

- FE: **Text Component**
  - Data model definition in `PageComponent.content` & `styles` (S)
  - Editor view (input for text, basic styling options like alignment, font size, color) (M)
  - Public rendering on user page (M)
- FE: **Image Component**
  - Data model definition in `PageComponent.content` & `styles` (S)
  - Editor view (input for image URL/upload, alt text, basic styling like size, alignment) (M)
  - Public rendering on user page (M)
- FE: **Link Component (as PageComponent)**
  - Data model definition (adapting from existing Link, storing URL, title, icon, styles) (M)
  - Editor view (inputs for URL, title, icon selection, styling options) (M)
  - Public rendering on user page (M)
- FE: **Video Component (MVP if time permits, else Post-MVP)**
  - Data model definition (e.g., video URL, embed type) (S)
  - Editor view (input for video URL, basic styling) (M)
  - Public rendering (M)
- FE: **Icon Component (MVP if time permits, else Post-MVP)**
  - Data model definition (e.g., icon name/SVG, color, size) (S)
  - Editor view (icon picker, styling options) (M)
  - Public rendering (M)

### Frontend - Public Page Rendering

- FE: Fetch and render ordered `PageComponents` on the public user page based on their type and data (M)

### Documentation

- Update relevant design documents (API Contracts, System Architecture) for PageComponents (M)

---

> Tasks above are ready to be added to your Kanban board. Adjust estimates as you refine requirements or implementation details.

Week 1
Set up CI/CD pipeline (M)
Configure linting and formatting (S)
Implement email/password registration (M)
User login/logout/session management (M)
Profile management (update name, email, password, profile picture, bio) (M)
Add new link (title, URL, icon/emoji, style) (M)
Week 2
Integrate social login (Google, GitHub) (M)
Password reset (M)
Edit existing link (S)
Delete link (S)
Drag-and-drop link reordering (M)
Enable/disable link visibility (S)
Validate link URLs (S)
Theme selection (light/dark mode, color presets) (M)

---

- [ ] **Task 2.4:** Implement Link Reordering (Drag and Drop) - _Superseded by Widget System_
- [ ] **Task 2.5:** Add Link Icons/Favicons - _Integrate into Link Widget_
- [ ] **Task 2.6:** Implement Link Validation - _Integrate into Link Widget_
- [ ] **Task 2.7:** Implement Link Toggle (Enable/Disable) - _Integrate into Link Widget_

---

# Development Tasks

## Phase 1: Setup & Core Authentication

### Sprint 1: Project Foundation & Initial Auth Setup

- **[ ] Task 1: Verify and Finalize Project Directory Structure**

  - Description: Ensure the project's directory structure aligns with `docs/development setup/project structure.md`. Create any missing essential directories and ensure consistency.
  - Files: `docs/development setup/project structure.md`, all project directories.
  - Priority: High

- **[ ] Task 2: Set up GitHub Issue Templates**

  - Description: Create standard issue templates for bug reports, feature requests, and user stories in the `.github/ISSUE_TEMPLATE` directory.
  - Files:
    - `.github/ISSUE_TEMPLATE/bug_report.md`
    - `.github/ISSUE_TEMPLATE/feature_request.md`
    - `.github/ISSUE_TEMPLATE/user_story.md`
  - Priority: High

- **[ ] Task 3: Install and Configure NextAuth.js Core**

  - Description: Add `next-auth` package. Set up the basic NextAuth.js configuration in `src/app/api/auth/[...nextauth]/route.ts`. Define required Prisma models for NextAuth (User, Account, Session, VerificationToken) if they don't align.
  - Files: `package.json`, `src/app/api/auth/[...nextauth]/route.ts`, `prisma/schema.prisma`.
  - Priority: High

- **[ ] Task 4: Implement Basic Email/Password Authentication**

  - Description: Configure the Credentials provider for email/password login. Implement the `authorize` function, including password hashing and comparison. Create basic login and registration API endpoints.
  - Files: `src/app/api/auth/[...nextauth]/route.ts`, `src/lib/schemas/auth.ts`, `src/app/api/auth/register/route.ts`.
  - Priority: High
  - Depends on: Task 3.

- **[ ] Task 5: Create Basic Login and Registration UI**
  - Description: Develop simple forms for user login and registration. Connect these forms to the backend authentication endpoints.
  - Files: `src/app/login/page.tsx`, `src/app/register/page.tsx` (if not existing), `src/app/components/auth/LoginForm.tsx`, `src/app/components/auth/RegisterForm.tsx`.
  - Priority: Medium
  - Depends on: Task 4.

## Phase 1: Week 2 - Profile & Initial Dashboard

- **[ ] Task 6: User Profile Management API**

  - Description: Create API endpoints for users to view and update their basic profile information (e.g., name, bio).
  - Files: `prisma/schema.prisma` (UserProfile model), `src/lib/schemas/profile.ts`, API route files (e.g., `src/app/api/profile/route.ts`).
  - Priority: Medium

- **[ ] Task 7: Basic User Profile Page UI**
  - Description: Develop the UI for users to view and edit their profile information on the dashboard.
  - Files: `src/app/dashboard/profile/page.tsx`.
  - Priority: Medium
  - Depends on: Task 6.

---

Status Update: 2025-05-13
The last action was a request to save the current status to this file. Awaiting further instructions.
I've defined the PageComponent type in pageComponents.ts and updated the main editor page (src/app/dashboard/editor/[pageId]/page.tsx) to manage the state of these components. It currently uses mock data, but it's set up to fetch components and pass them to the PageComponentCanvas.

The PageComponentCanvas now receives these components and renders a basic representation of each, allowing you to click on one to select it. This selection is then passed to the PropertiesInspectorPanel.

Next, I'll update the PropertiesInspectorPanel.tsx to correctly use the PageComponent type for the selectedComponent prop and adjust its display accordingly. This will ensure that when a component is selected on the canvas, its details are correctly shown in the inspector.

PropertiesInspectorPanel.tsx+47-32
I've updated the PropertiesInspectorPanel to correctly use the PageComponent type and handle updates.

Now, I'll modify the main editor page (src/app/dashboard/editor/[pageId]/page.tsx) to manage the state of these PageComponents. I'll use mock data for now.