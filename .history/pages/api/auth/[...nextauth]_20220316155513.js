import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin";
      return token;
    },
    async signIn({ account, user }) {
      const { email, name } = user;
      if (account.provider === "google") {
        await dbConnect();
        let userInDb = await User.findOne({ email });
        if (userInDb) return true;

        await User.create({
          email,
          name,
        });
        return true;
      }
    },
  },
});
