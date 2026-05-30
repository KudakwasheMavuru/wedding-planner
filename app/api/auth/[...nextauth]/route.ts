import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const USERS = [
  { id: "1", name: "Kudakwashe", email: "mavurukuda@gmail.com" },
  { id: "2", name: "Maxine", email: "maxinebeni@gmail.com" },
];

const PASSWORD = "KudaandMaxine2027!";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.password !== PASSWORD) return null;
        const user = USERS.find(u => u.email === credentials.email);
        return user ?? null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
