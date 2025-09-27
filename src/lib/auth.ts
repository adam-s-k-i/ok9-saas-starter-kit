import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    // Development credentials provider for testing
    CredentialsProvider({
      name: "Development",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "dev@example.com" },
      },
      async authorize(credentials) {
        // In development, allow any email for testing
        if (process.env.NODE_ENV === 'development') {
          // Check if user exists, create if not
          let user = await prisma.user.findUnique({
            where: { email: credentials?.email || 'dev@example.com' }
          })

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials?.email || 'dev@example.com',
                name: 'Development User',
              }
            })
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        }
        return null
      },
    }),
    // OAuth providers (configure these in production)
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}