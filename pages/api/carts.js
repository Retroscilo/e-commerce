// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import { getSession } from "next-auth/react";
import prisma from "./../../lib/prisma.js";

export default async function handler(req, res) {
	const session = await getSession({ req });
	if (!session) return res.status(200).json({ msg: "no user connected" });
	switch (req.method) {
		case "GET":
			try {
				const getProductsRelation =
					await prisma.productCartRelation.findMany({});
				const productRelation = getProductsRelation.filter(
					(product) => product.cartId == session.user.cart_id
				);
				const products = await Promise.all(
					productRelation.map(async (p) => {
						const productId = p.productId;
						const product = await prisma.product.findUnique({
							where: {
								id: productId,
							},
						});
						return product;
					})
				);
				return res.status(200).json(products);
			} catch (err) {
				console.error(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
			break;
		default:
			return res.status(405).json({ msg: "Method not allowed" });
	}
}
