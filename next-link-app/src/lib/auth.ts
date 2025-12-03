import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 2, // 2h max lifetime (approximate session-only)
    updateAge: 0, // no sliding extension; forces re-auth after maxAge or browser restart
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user?.passwordHash) return null;
        if (user.status === "BLOCKED") {
          throw new Error("ACCOUNT_BLOCKED");
        }

        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: user.role,
          status: user.status,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (token.sub) {
        // Always refresh role/status from DB to react to admin changes like blocking.
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, status: true, mustChangePassword: true },
        });
        token.role = dbUser?.role ?? "USER";
        token.status = dbUser?.status ?? "ACTIVE";
        token.mustChangePassword = dbUser?.mustChangePassword ?? false;
      } else if (user) {
        token.role = (user as { role?: string }).role ?? "USER";
        token.status = (user as { status?: string }).status ?? "ACTIVE";
        token.mustChangePassword =
          (user as { mustChangePassword?: boolean }).mustChangePassword ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        const userWithExtras = {
          id: token.sub,
          role: (token as { role?: string }).role ?? "USER",
          status: (token as { status?: string }).status ?? "ACTIVE",
          mustChangePassword:
            (token as { mustChangePassword?: boolean })
              .mustChangePassword ?? false,
        };
        session.user = {
          ...session.user,
          ...userWithExtras,
        };
      }
      return session;
    },
  },
  pages: {
    signOut: "/",
  },
};
