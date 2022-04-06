// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import prisma from "./../../lib/prisma.js";

export default async function handler(req, res) {
	switch (req.method) {
		case "GET":
			try {
				// const data = await prisma.product.findMany({});
				return res.status(200).json({ data });
			} catch (err) {
				console.error(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
		case "PUT":
			try {
				const { cart_id, product_id, quantity } = req.body;
				const actualData = await prisma.productCartRelation.findUnique({
					where: {
						productId_cartId: {
							productId: product_id,
							cartId: cart_id,
						},
					},
				});

				await prisma.cart.update({
					where: { id: cart_id },
					data: {
						products: {
							upsert: [
								{
									create: { productId: product_id, quantity },
									update: {
										productId: product_id,
										quantity:
											actualData.quantity + quantity,
									},
									where: {
										productId_cartId: {
											productId: product_id,
											cartId: cart_id,
										},
									},
								},
							],
						},
					},
				});
				return res.status(200);
			} catch (err) {
				console.error(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
		default:
			return res.status(405).json({ msg: "Method not allowed" });
	}
}
