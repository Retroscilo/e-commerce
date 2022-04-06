// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { getSession } from "next-auth/react";
import prisma from "./../../lib/prisma.js";

export default async function handler(req, res) {
	switch (req.method) {
		case "GET":
			try {
				const session = await getSession({ req });
				const getProducts = await prisma.productCartRelation.findMany({});
				const products = getProducts.filter((product) => product.cartId == session.user.cart_id);
				return res.status(200).json({ products });
			} catch (err) {
				console.error(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
			break;
		default:
			return res.status(405).json({ msg: "Method not allowed" });
	}
}
