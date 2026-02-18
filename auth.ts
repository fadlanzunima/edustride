import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import { compare } from "bcryptjs";
import { z } from "zod";

import { prisma } from "./lib/prisma";

// Edge-compatible auth config (for middleware)
export const authConfig = {
  session: {
    strategy: "jwt",
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.level = user.level;
        token.institution = user.institution;
      }

      // Handle session update
      if (trigger === "update" && session) {
        token.name = session.name;
        token.level = session.level;
        token.institution = session.institution;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.level = token.level as string | undefined;
        session.user.institution = token.institution as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

// Full auth config with Prisma adapter (for API routes)
export const authConfigWithAdapter: NextAuthConfig = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
};

// Create NextAuth instance for API routes
const { auth, handlers, signIn, signOut } = NextAuth(authConfigWithAdapter);

export { auth, handlers, signIn, signOut };
