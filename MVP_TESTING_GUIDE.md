# LinkHub MVP Testing Guide

## Overview
This guide will help you test all the core MVP features of LinkHub, a Linktree clone application.

## Prerequisites
- Application is running on `http://localhost:3001`
- Prisma Studio is running on `http://localhost:5555`
- Database has been seeded with test data

## Test User Credentials
- Email: `test@example.com`
- Password: `password123`
- Public page: `http://localhost:3001/testuser`

## MVP Features to Test

### 1. Home Page
- [ ] Visit `http://localhost:3001`
- [ ] Verify the hero section displays correctly
- [ ] Check navigation buttons (Sign In / Get Started)
- [ ] Test responsive design

### 2. User Registration
- [ ] Go to `http://localhost:3001/register`
- [ ] Register with a new email and password
- [ ] Verify account creation and automatic page setup
- [ ] Check automatic redirect to dashboard

### 3. User Authentication
- [ ] Go to `http://localhost:3001/login`
- [ ] Login with test credentials (test@example.com / password123)
- [ ] Verify successful login and redirect to dashboard
- [ ] Test logout functionality

### 4. Dashboard Functionality
- [ ] Access `http://localhost:3001/dashboard`
- [ ] View page statistics (total links, active links)
- [ ] Check page URL display and external link
- [ ] Test "View Page" button functionality

### 5. Link Management
- [ ] **Add Link**: Click "Add Link" button
  - [ ] Fill in title, URL, and description
  - [ ] Submit and verify link appears in list
- [ ] **Toggle Link Status**: Use switch to activate/deactivate links
- [ ] **Delete Link**: Use trash icon to remove links
- [ ] **External Link**: Test external link button opens URL

### 6. Theme Customization
- [ ] Test each theme option in dashboard:
  - [ ] Default (white background, blue accent)
  - [ ] Dark Mode (dark background, purple accent)
  - [ ] Gradient (pink to orange gradient)
  - [ ] Minimal (light gray background, black accent)
- [ ] Verify theme updates are saved
- [ ] Check theme applies to public page

### 7. Public User Pages
- [ ] Visit test user page: `http://localhost:3001/testuser`
- [ ] Verify profile information displays
- [ ] Check links are clickable and open in new tabs
- [ ] Test with different themes applied
- [ ] Verify only active links are displayed
- [ ] Test page with no links (empty state)

### 8. Profile Management
- [ ] Go to `http://localhost:3001/dashboard/profile`
- [ ] Update profile information
- [ ] Verify changes are saved
- [ ] Check changes reflect on public page

### 9. Error Handling
- [ ] Test invalid URLs in links
- [ ] Test accessing non-existent public pages
- [ ] Test unauthorized access to protected routes
- [ ] Test form validation

### 10. Mobile Responsiveness
- [ ] Test all pages on different screen sizes
- [ ] Verify navigation works on mobile
- [ ] Check link cards display properly on mobile

## Expected Database Structure

### Users Table
- Test user should exist with email `test@example.com`
- Should have associated LinkPage and UserProfile

### LinkPage Table
- Should have page with slug `testuser`
- Should be public and have theme information

### Links Table
- Should have sample links associated with test user's page
- Links should have proper titles, URLs, and positions

### PageTheme Table
- Should store theme selections for pages

## Common Issues and Solutions

### Database Issues
- If seed data is missing: `npm run db:seed`
- If database is corrupted: Delete `prisma/dev.db` and run `npx prisma db push && npm run db:seed`

### Authentication Issues
- Clear browser cookies and localStorage
- Restart the development server
- Check `.env.local` configuration

### Theme Issues
- Themes should persist after page refresh
- Check Prisma Studio to verify theme data is saved
- Ensure API routes are working correctly

## Success Criteria

The MVP is successful if:
- [x] Users can register and login
- [x] Users can create and manage links
- [x] Public pages display correctly with themes
- [x] Basic theme customization works
- [x] All CRUD operations function properly
- [x] Application is responsive and user-friendly

## Next Steps (Post-MVP)
- Advanced theme customization
- Analytics and click tracking
- Social media integrations
- Custom domains
- Advanced layouts and components
