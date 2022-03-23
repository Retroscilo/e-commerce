import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import prisma from "../../../lib/prisma.js";

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET
		})
	],
	theme: {
		colorScheme: "light"
	},
	callbacks: {
		async jwt({ token }) {
			token.userRole = "admin";
			return token;
		},
		async signIn({ account, user }) {
			if (account.provider === "google"
				|| account.provider === "github"
				|| account.provider === "facebook") {
				try {
					const { email, name } = user;
					let userInDb = await prisma.user.findUnique({
						where: {
							email
						}
					});

					if (userInDb) return true;

					await prisma.user.create({ data: { email, name } });

					return true;
				} catch (e) {
					console.log(e);
				}
			}
		}
	}
});
