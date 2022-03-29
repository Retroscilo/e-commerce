// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
				const userCart = await prisma.cart.findUnique({
					where: { id: cart_id },
				});
				console.log(userCart);
				await userCart.update({
					quantity,
					products: {
						create: [
							{
								product: {
									connect: {
										id: product_id,
									},
								},
							},
						],
					},
				});
			} catch (err) {
				console.error(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
		default:
			return res.status(405).json({ msg: "Method not allowed" });
	}
}
