import NextAuth, {
  DefaultSession,
  DefaultUser,
  NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

// Augment NextAuth types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"]; // Keep existing properties like name, email, image
  }

  interface User extends DefaultUser {
    // Add custom properties here if your authorize callback returns them
    // For example, if authorize returns { id: string, email: string, role: string }
    // then User should be: { id: string, email: string, role: string }
    // id is already part of DefaultUser
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    // Add any other custom properties you want in the JWT
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.log("Missing credentials");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.log("No user found with this email:", credentials.email);
          return null;
        }

        // Skipping email verification check as requested for development
        // if (!user.isVerified) {
        //   console.log("User email not verified:", credentials.email);
        //   return null;
        // }

        if (!user.passwordHash) {
          console.log(
            "User does not have a password hash (e.g. social login user):",
            credentials.email
          );
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          console.log("Invalid password for user:", credentials.email);
          return null;
        }

        console.log("User authorized:", user.email);
        // Return the user object that will be encoded in the JWT
        // Ensure it matches the `User` interface augmentation
        return {
          id: user.id,
          email: user.email,
          // name: user.profile?.displayName, // Example from your User model if available
          // image: user.profile?.profileImageUrl, // Example
        };
      },
    }),
    // TODO: Add other providers like Google, GitHub here
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // The user object is available on initial sign in
      if (user) {
        token.id = user.id;
        // You can add other properties from the user object to the token here
        // token.email = user.email; // email is already part of the default token if returned by authorize
        // token.name = user.name; // name is already part of the default token if returned by authorize
        // token.picture = user.image; // picture is already part of the default token if returned by authorize
      }
      return token;
    },
    async session({ session, token }) {
      // The token object contains what you added in the jwt callback
      // Assign the user ID from the token to the session
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      // You can add other properties from the token to the session here
      // if (token.email && session.user) session.user.email = token.email; // Already handled by DefaultSession
      // if (token.name && session.user) session.user.name = token.name; // Already handled by DefaultSession
      // if (token.picture && session.user) session.user.image = token.picture; // Already handled by DefaultSession
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  // secret: process.env.NEXTAUTH_SECRET, // Handled automatically by NextAuth.js v5+
  // debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
