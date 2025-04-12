import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub; 
      return session;
    },
    async redirect({ url, baseUrl }) {
        return "/dashboard"; // Always redirect to the dashboard after login
      },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
