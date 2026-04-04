import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { login } from '@/lib/api/auth'
import type { User } from '@/types'

// ── Comptes de démo (pas de backend requis) ───────────────────────────────────
const DEMO_USERS: Record<string, User & { token: string; password: string }> = {
  'user@demo.ma': {
    password: 'demo1234',
    token: 'demo-token-user',
    id: 'demo-user-1',
    nom: 'Chaimaa',
    prenom: 'Ochline',
    email: 'user@demo.ma',
    role: 'USER',
    secteurs: ['Informatique & IT'],
    regions: ['Souss-Massa'],
    typesMarcheInteresse: ['SERVICES'],
    questionnaireFait: true,
  },
  'admin@demo.ma': {
    password: 'admin1234',
    token: 'demo-token-admin',
    id: 'demo-admin-1',
    nom: 'El Mansouri',
    prenom: 'Sara',
    email: 'admin@demo.ma',
    role: 'ADMIN',
    secteurs: ['Informatique & IT'],
    regions: [],
    questionnaireFait: true,
  },
}
// ─────────────────────────────────────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Vérifier les comptes de démo en premier
        const demo = DEMO_USERS[credentials.email]
        if (demo && demo.password === credentials.password) {
          const { password: _, ...user } = demo
          return user as User & { token: string }
        }

        // Sinon appeler le vrai backend
        try {
          const { token, user } = await login({
            email: credentials.email,
            password: credentials.password,
          })
          return { ...user, token } as User & { token: string }
        } catch {
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as User & { token: string }
        token.token = u.token
        token.user = u
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...(token.user as User),
        token: token.token as string,
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
}
