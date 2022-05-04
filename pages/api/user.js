// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import prisma from "./../../lib/prisma.js";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
	const session = await getSession({ req });

	if (!session) return res.status(200).json({ msg: "No user connected" });

	switch (req.method) {
		case "GET":
			try {
				const user = await prisma.user.update({
					where: {
						email: session.user.email,
					},
					data: {
						role: session.user.role === 2 ? 1 : 2,
					},
				});
				return res.status(200).send("all righty !");
			} catch (e) {
				console.log(e);
				return res.status(500).json({ error: e.message });
			}
	}
}
