import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: 'admin' | 'moderator' | 'user'
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Development credentials provider for testing
    CredentialsProvider({
      name: "Development",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "dev@example.com" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
            }
          })

          if (!user || user.status !== 'active') {
            return null
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
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
    async signIn({ user, account, profile }) {
      // For OAuth providers, ensure user exists in database
      if (account?.provider !== 'credentials' && user.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, status: true, role: true }
          })

          if (!dbUser) {
            // Create user if they don't exist (for OAuth)
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                role: 'user',
                status: 'active',
              }
            })
          } else if (dbUser.status !== 'active') {
            return false // Block inactive users
          }

          // Update last login
          await prisma.user.update({
            where: { email: user.email },
            data: { lastLogin: new Date() }
          })
        } catch (error) {
          console.error('OAuth signin error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'admin' | 'moderator' | 'user'
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}