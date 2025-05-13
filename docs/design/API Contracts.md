# LinkHub API Contracts

This document outlines the API contracts for the LinkHub application in OpenAPI 3.0 format. These contracts define the interfaces between frontend and backend components, ensuring consistent communication across the system.

## API Design Principles

- RESTful design patterns
- JWT authentication
- Consistent error handling
- Versioned endpoints
- Comprehensive documentation

## Base URL

All API endpoints are prefixed with:

```
https://api.linkhub.app/v1
```

## Authentication

Most endpoints require authentication via JWT token passed in the Authorization header:

```
Authorization: Bearer {token}
```

## Error Responses

All endpoints follow a standard error response format:

```json
{
  "status": "error",
  "code": 400,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## OpenAPI 3.0 Specification

```yaml
openapi: 3.0.0
info:
  title: LinkHub API
  description: API for managing LinkHub profiles, links, and analytics
  version: 1.0.0
  contact:
    name: LinkHub Team
    url: https://linkhub.app/contact
servers:
  - url: https://api.linkhub.app/v1
    description: Production API
  - url: https://staging-api.linkhub.app/v1
    description: Staging API
  - url: http://localhost:3000/api/v1
    description: Local Development

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        isActive:
          type: boolean
        isVerified:
          type: boolean
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    UserProfile:
      type: object
      properties:
        id:
          type: string
          format: uuid
        userId:
          type: string
          format: uuid
        displayName:
          type: string
        bio:
          type: string
        profileImageUrl:
          type: string
          format: uri
        profession:
          type: string
        location:
          type: string
        websiteUrl:
          type: string
          format: uri
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    LinkPage:
      type: object
      properties:
        id:
          type: string
          format: uuid
        userId:
          type: string
          format: uuid
        slug:
          type: string
        title:
          type: string
        description:
          type: string
        isPublic:
          type: boolean
        pageMetaTitle:
          type: string
        pageMetaDescription:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    Link:
      type: object
      properties:
        id:
          type: string
          format: uuid
        pageId:
          type: string
          format: uuid
        title:
          type: string
        url:
          type: string
          format: uri
        description:
          type: string
        icon:
          type: string
        customThumbnailUrl:
          type: string
          format: uri
        position:
          type: integer
        isActive:
          type: boolean
        isFeatured:
          type: boolean
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    PageTheme:
      type: object
      properties:
        id:
          type: string
          format: uuid
        pageId:
          type: string
          format: uuid
        themeName:
          type: string
        isCustom:
          type: boolean
        backgroundColor:
          type: string
        textColor:
          type: string
        accentColor:
          type: string
        fontFamily:
          type: string
        buttonStyle:
          type: string
        cardStyle:
          type: string
        backgroundImageUrl:
          type: string
          format: uri
        customCss:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    PageAnalyticsData:
      type: object
      properties:
        totalViews:
          type: integer
        uniqueVisitors:
          type: integer
        averageTimeOnPage:
          type: number
        topReferrers:
          type: array
          items:
            type: object
            properties:
              source:
                type: string
              count:
                type: integer
        deviceBreakdown:
          type: object
          properties:
            mobile:
              type: integer
            desktop:
              type: integer
            tablet:
              type: integer

    LinkAnalyticsData:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        clicks:
          type: integer
        uniqueClicks:
          type: integer
        clickThroughRate:
          type: number

    AuthResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success]
        data:
          type: object
          properties:
            user:
              $ref: '#/components/schemas/User'
            token:
              type: string
            expiresAt:
              type: string
              format: date-time

    Error:
      type: object
      properties:
        status:
          type: string
          enum: [error]
        code:
          type: integer
        message:
          type: string
        errors:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              message:
                type: string

paths:
  #---------------------------------------------------------------------------
  # Authentication Routes
  #---------------------------------------------------------------------------
  /auth/register:
    post:
      summary: Register a new user
      tags:
        - Authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/login:
    post:
      summary: Authenticate a user
      tags:
        - Authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          description: Authentication failed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/verify-email/{token}:
    get:
      summary: Verify user email with token
      tags:
        - Authentication
      parameters:
        - name: token
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Email verified successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  message:
                    type: string
        '400':
          description: Invalid or expired token
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/forgot-password:
    post:
      summary: Request password reset
      tags:
        - Authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
              properties:
                email:
                  type: string
                  format: email
      responses:
        '200':
          description: Password reset email sent
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  message:
                    type: string
        '404':
          description: Email not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/reset-password:
    post:
      summary: Reset password with token
      tags:
        - Authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - token
                - newPassword
              properties:
                token:
                  type: string
                newPassword:
                  type: string
                  minLength: 8
      responses:
        '200':
          description: Password reset successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  message:
                    type: string
        '400':
          description: Invalid or expired token
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/oauth/{provider}:
    get:
      summary: Initiate OAuth flow with provider
      tags:
        - Authentication
      parameters:
        - name: provider
          in: path
          required: true
          schema:
            type: string
            enum: [google, facebook, twitter, github]
      responses:
        '302':
          description: Redirect to OAuth provider
        '400':
          description: Invalid provider
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/oauth/{provider}/callback:
    get:
      summary: OAuth provider callback
      tags:
        - Authentication
      parameters:
        - name: provider
          in: path
          required: true
          schema:
            type: string
            enum: [google, facebook, twitter, github]
        - name: code
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OAuth authentication successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '400':
          description: Invalid OAuth code
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/logout:
    post:
      summary: Log out current user
      tags:
        - Authentication
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Logout successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  message:
                    type: string

  #---------------------------------------------------------------------------
  # User Profile Routes
  #---------------------------------------------------------------------------
  /user/profile:
    get:
      summary: Get current user profile
      tags:
        - User Management
      security:
        - bearerAuth: []
      responses:
        '200':
          description: User profile retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    type: object
                    properties:
                      user:
                        $ref: '#/components/schemas/User'
                      profile:
                        $ref: '#/components/schemas/UserProfile'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    put:
      summary: Update user profile
      tags:
        - User Management
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                displayName:
                  type: string
                bio:
                  type: string
                profession:
                  type: string
                location:
                  type: string
                websiteUrl:
                  type: string
                  format: uri
      responses:
        '200':
          description: Profile updated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    $ref: '#/components/schemas/UserProfile'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /user/profile/image:
    post:
      summary: Upload profile image
      tags:
        - User Management
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                image:
                  type: string
                  format: binary
      responses:
        '200':
          description: Image uploaded successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    type: object
                    properties:
                      profileImageUrl:
                        type: string
                        format: uri
        '400':
          description: Invalid image format or size
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /user/change-password:
    post:
      summary: Change user password
      tags:
        - User Management
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - currentPassword
                - newPassword
              properties:
                currentPassword:
                  type: string
                newPassword:
                  type: string
                  minLength: 8
      responses:
        '200':
          description: Password changed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  message:
                    type: string
        '400':
          description: Invalid password format
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Incorrect current password
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  #---------------------------------------------------------------------------
  # Link Page Routes
  #---------------------------------------------------------------------------
  /pages:
    get:
      summary: Get all link pages for current user
      tags:
        - Link Pages
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Pages retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/LinkPage'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    post:
      summary: Create a new link page
      tags:
        - Link Pages
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - slug
              properties:
                slug:
                  type: string
                  pattern: '^[a-z0-9-]+
                title:
                  type: string
                description:
                  type: string
                isPublic:
                  type: boolean
                pageMetaTitle:
                  type: string
                pageMetaDescription:
                  type: string
      responses:
        '201':
          description: Page created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    $ref: '#/components/schemas/LinkPage'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /pages/{pageId}:
    get:
      summary: Get a specific link page by ID
      tags:
        - Link Pages
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Page retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    $ref: '#/components/schemas/LinkPage'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    put:
      summary: Update a link page
      tags:
        - Link Pages
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                slug:
                  type: string
                  pattern: '^[a-z0-9-]+
                title:
                  type: string
                description:
                  type: string
                isPublic:
                  type: boolean
                pageMetaTitle:
                  type: string
                pageMetaDescription:
                  type: string
      responses:
        '200':
          description: Page updated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    $ref: '#/components/schemas/LinkPage'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    delete:
      summary: Delete a link page
      tags:
        - Link Pages
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Page deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  message:
                    type: string
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  #---------------------------------------------------------------------------
  # Link Routes
  #---------------------------------------------------------------------------
  /pages/{pageId}/links:
    get:
      summary: Get all links for a page
      tags:
        - Links
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Links retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Link'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    post:
      summary: Create a new link
      tags:
        - Links
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - title
                - url
              properties:
                title:
                  type: string
                url:
                  type: string
                  format: uri
                description:
                  type: string
                icon:
                  type: string
                position:
                  type: integer
                isActive:
                  type: boolean
                isFeatured:
                  type: boolean
      responses:
        '201':
          description: Link created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    $ref: '#/components/schemas/Link'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /pages/{pageId}/links/{linkId}:
    get:
      summary: Get a specific link
      tags:
        - Links
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: linkId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Link retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    $ref: '#/components/schemas/Link'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page or link not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    put:
      summary: Update a link
      tags:
        - Links
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: linkId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                url:
                  type: string
                  format: uri
                description:
                  type: string
                icon:
                  type: string
                position:
                  type: integer
                isActive:
                  type: boolean
                isFeatured:
                  type: boolean
      responses:
        '200':
          description: Link updated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    $ref: '#/components/schemas/Link'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page or link not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    delete:
      summary: Delete a link
      tags:
        - Links
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: linkId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Link deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  message:
                    type: string
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page or link not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /pages/{pageId}/links/reorder:
    post:
      summary: Reorder links in a page
      tags:
        - Links
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - linkIds
              properties:
                linkIds:
                  type: array
                  description: Ordered array of link IDs
                  items:
                    type: string
                    format: uuid
      responses:
        '200':
          description: Links reordered successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  message:
                    type: string
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  #---------------------------------------------------------------------------
  # Theme Routes
  #---------------------------------------------------------------------------
  /pages/{pageId}/theme:
    get:
      summary: Get theme for a page
      tags:
        - Themes
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Theme retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    $ref: '#/components/schemas/PageTheme'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page or theme not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    put:
      summary: Update theme for a page
      tags:
        - Themes
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                themeName:
                  type: string
                isCustom:
                  type: boolean
                backgroundColor:
                  type: string
                textColor:
                  type: string
                accentColor:
                  type: string
                fontFamily:
                  type: string
                buttonStyle:
                  type: string
                cardStyle:
                  type: string
                backgroundImageUrl:
                  type: string
                  format: uri
                customCss:
                  type: string
      responses:
        '200':
          description: Theme updated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    $ref: '#/components/schemas/PageTheme'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  #---------------------------------------------------------------------------
  # Analytics Routes
  #---------------------------------------------------------------------------
  /pages/{pageId}/analytics:
    get:
      summary: Get analytics for a page
      tags:
        - Analytics
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: startDate
          in: query
          schema:
            type: string
            format: date
        - name: endDate
          in: query
          schema:
            type: string
            format: date
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Analytics retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    $ref: '#/components/schemas/PageAnalyticsData'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /pages/{pageId}/links/analytics:
    get:
      summary: Get analytics for all links in a page
      tags:
        - Analytics
      parameters:
        - name: pageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: startDate
          in: query
          schema:
            type: string
            format: date
        - name: endDate
          in: query
          schema:
            type: string
            format: date
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Analytics retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/LinkAnalyticsData'
        '401':
          description: Unauthorized access
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Page not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  #---------------------------------------------------------------------------
  # Public Routes
  #---------------------------------------------------------------------------
  /p/{slug}:
    get:
      summary: Get public link page by slug
      tags:
        - Public
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Page retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [success]
                  data:
                    type: object
                    properties:
                      page:
                        $ref: '#/components/schemas/LinkPage'
                      profile:
                        $ref: '#/components/schemas/UserProfile'
                      theme:
                        $ref: '#/components/schemas/PageTheme'
                      links:
                        type: array
                        items:
                          $ref: '#/components/schemas/Link'
        '404':
          description: Page not found or not public
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /r/{linkId}:
    get:
      summary: Record analytics and redirect to link URL
      tags:
        - Public
      parameters:
        - name: linkId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: ref
          in: query
          schema:
            type: string
      responses:
        '302':
          description: Redirect to link URL
        '404':
          description: Link not found or inactive
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
```

## API Client Integration

A Postman collection of these API endpoints is available for download at:

```
https://api.linkhub.app/docs/postman-collection.json
```

## Authentication Flow

1. **Registration Flow**:

   - `POST /auth/register` to create an account
   - Server sends verification email
   - `GET /auth/verify-email/{token}` to verify email

2. **Login Flow**:

   - `POST /auth/login` with credentials
   - Receive JWT token
   - Include token in Authorization header for subsequent requests

3. **OAuth Flow**:
   - `GET /auth/oauth/{provider}` redirects to provider
   - Provider redirects to `GET /auth/oauth/{provider}/callback` with code
   - Receive JWT token
   - Include token in Authorization header for subsequent requests

## Rate Limiting

All API endpoints are subject to rate limiting:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- 5 requests per minute for sensitive endpoints (login, register)

## Versioning Strategy

The API follows a versioning strategy to ensure backward compatibility:

- Major version changes in URL path (`/v1`, `/v2`)
- Minor version changes in request header (`X-API-Version: 1.2`)
- Deprecation notices with sunset dates

## API Documentation

Interactive Swagger documentation is available at:

```
https://api.linkhub.app/docs
```

This API contract serves as the foundation for both backend implementation and frontend integration, ensuring consistent communication across the LinkHub application.
