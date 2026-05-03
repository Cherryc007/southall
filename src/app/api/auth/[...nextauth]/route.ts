import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const adminEmail = process.env.ADMIN_EMAIL || "admin@southallkitchen.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

        if (credentials.email !== adminEmail) return null;

        // Support both plain-text (env) and hashed passwords
        let valid = false;
        if (adminPassword.startsWith("$2")) {
          valid = await bcrypt.compare(credentials.password, adminPassword);
        } else {
          valid = credentials.password === adminPassword;
        }

        if (!valid) return null;

        return {
          id: "admin",
          email: adminEmail,
          name: "Admin",
          role: "admin",
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
