import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../lib/prisma.js";

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
			if (account.provider === "google") {
				try {
					const { email, name } = user;
					let userInDb = await prisma.user.findUnique({
						where: {
							email,
						},
					});
					if (userInDb) return true;

					await prisma.user.create({ data: { email, name } });
					return true;
				} catch (e) {
					console.log(e);
				}
			}
		},
	},
});
