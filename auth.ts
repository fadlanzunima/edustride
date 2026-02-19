import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import { compare } from "bcryptjs";
import { z } from "zod";

import { prisma } from "./lib/prisma";

// Extend the session user type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      level?: string | null;
      institution?: string | null;
    };
  }

  interface User {
    level?: string | null;
    institution?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    level?: string | null;
    institution?: string | null;
    image?: string | null;
  }
}

// Auth configuration using JWT strategy (no database sessions required)
// This works better with Prisma driver adapters
export const authConfig = {
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const parsedCredentials = z
            .object({
              email: z.string().email(),
              password: z.string().min(6),
            })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            console.error(
              "Invalid credentials format:",
              parsedCredentials.error
            );
            return null;
          }

          const { email, password } = parsedCredentials.data;
          console.log("Authorizing user:", email);

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.error("User not found:", email);
            return null;
          }

          if (!user.password) {
            console.error("User has no password (OAuth only):", email);
            return null;
          }

          // Verify password
          const isPasswordValid = await compare(password, user.password);

          if (!isPasswordValid) {
            console.error("Invalid password for user:", email);
            return null;
          }

          console.log("User authorized successfully:", email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            level: user.level,
            institution: user.institution,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth sign in - store/update profile image
      if (account && profile && user.email) {
        const imageUrl =
          profile.image ?? profile.picture ?? profile.avatar_url ?? null;

        if (imageUrl) {
          try {
            // Check if user exists and update image if needed
            const existingUser = await prisma.user.findUnique({
              where: { email: user.email },
              select: { id: true, image: true },
            });

            if (existingUser) {
              // Update image if not set or different
              if (!existingUser.image || existingUser.image !== imageUrl) {
                await prisma.user.update({
                  where: { id: existingUser.id },
                  data: { image: imageUrl },
                });
                console.log(`Updated profile image for user: ${user.email}`);
              }
            }
          } catch (error) {
            console.error("Error updating OAuth profile image:", error);
            // Don't fail sign-in if image update fails
          }
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session, account, profile }) {
      if (user) {
        token.id = user.id;
        token.level = user.level;
        token.institution = user.institution;
        token.image = user.image;
      }

      // Handle OAuth profile data on initial sign in
      if (account && profile) {
        const imageUrl =
          profile.image ?? profile.picture ?? profile.avatar_url ?? null;
        if (imageUrl) {
          token.image = imageUrl;
        }
      }

      // Handle session update
      if (trigger === "update" && session) {
        token.name = session.name;
        token.level = session.level;
        token.institution = session.institution;
        token.image = session.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.level = token.level as string | undefined;
        session.user.institution = token.institution as string | undefined;
        session.user.image = token.image as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

// Create NextAuth instance
const { auth, handlers, signIn, signOut } = NextAuth(authConfig);

export { auth, handlers, signIn, signOut };
