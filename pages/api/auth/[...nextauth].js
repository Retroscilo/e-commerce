import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import prisma from "../../../lib/prisma.js";

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
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
			if (
				account.provider === "google" ||
				account.provider === "github" ||
				account.provider === "facebook"
			) {
				try {
					const { email, name } = user;
					let userInDb = await prisma.user.findUnique({
						where: {
							email,
						},
					});

					if (userInDb) return true;

					const newCart = await prisma.cart.create({
						data: { created_at: new Date() },
					});
					await prisma.user.create({
						data: { email, name, cart_id: newCart.id },
					});

					return true;
				} catch (e) {
					console.log(e);
				}
			}
		},
		async session({ session }) {
			let userInDb = await prisma.user.findUnique({
				where: {
					email: session.user.email,
				},
			});

			session.user.id = userInDb.id;
			session.user.cart_id = userInDb.cart_id;
			session.user.role = userInDb.role;

			return session;
		},
	},
});
