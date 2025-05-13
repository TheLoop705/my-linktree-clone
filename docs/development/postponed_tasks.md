# Postponed Tasks

This file lists commands and tasks that have been postponed, primarily because the database or other services were not running at the time.

## Database Migrations

1.  **Apply `PageComponent` schema changes:**
    Run the following command in your terminal once the database is running to apply the recent changes made to `prisma/schema.prisma` (addition of `PageComponent` model and `ComponentType` enum):
    ```bash
    npx prisma migrate dev --name add_page_components
    ```

## Dependent Feature Testing

1.  **Test Email Verification Flow:**
    Once the database is running and the migration above has been applied, ensure you thoroughly test the user registration and email verification process. This flow involves:

    - Creating a new user (database write).
    - Storing an email verification token for the user (database write).
    - Sending a verification email with a link containing this token.
    - Verifying the token and updating the user's `isVerified` status (database read/write).

    Ensure your email service (e.g., Resend, if configured) is also operational for this testing.
