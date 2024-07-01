import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import dbMongoose from './db-mongoose';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      // name: 'Credentials',
      credentials: {
        email: {
          label: 'email:',
          type: 'text',
        },
        password: {
          label: 'password:',
          type: 'password',
        },
      },
      async authorize(credentials) {
        try {
          await dbMongoose();
        } catch (error) {
          console.log('error', error);
        }
        console.log('credentials', credentials);
        return { id: '1', name: 'John Doe', email: 'john@outreachmagic.io' };
      },
    }),
  ],
});

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}
