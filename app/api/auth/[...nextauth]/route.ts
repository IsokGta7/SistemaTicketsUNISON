import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import prisma from "@/lib/db"

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const { email, password } = credentials

        if (!email || !password) {
          throw new Error("Invalid credentials")
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          throw new Error("Invalid credentials")
        }

        // Compare passwords
        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
          throw new Error("Invalid credentials")
        }

        // Return user data
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user = token.user
      return session
    },
  },
  secret: process.env.JWT_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
