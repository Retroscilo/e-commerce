// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "./../../lib/prisma.js";

export default async function handler(req, res) {
	switch (req.method) {
		case "GET":
			try {
				let data = await prisma.product.findMany({
					include: { categories: true },
				});
				data = await Promise.all(
					data.map(async (product) => {
						const cats = await Promise.all(
							product.categories.map(async (cat) => {
								return prisma.category.findUnique({
									where: { id: cat.categoryId },
								});
							})
						);
						return { ...product, categories: cats };
					})
				);
				return res.status(200).json({ data });
			} catch (err) {
				console.error(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
		case "POST":
			const { product_id, quantity } = req.body;
			try {
				const product = await prisma.product.update({
					where: {
						id: product_id,
					},
					data: {
						quantity,
					},
				});
				return res.status(200).json(product);
			} catch (e) {
				console.log(e);
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

				const result = await prisma.cart.update({
					where: { id: cart_id },
					data: {
						products: {
							upsert: [
								{
									create: { productId: product_id, quantity },
									update: {
										productId: product_id,
										quantity: actualData
											? quantity + actualData.quantity
											: quantity,
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
				return res.status(200).json(result);
			} catch (err) {
				console.error(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
		default:
			return res.status(405).json({ msg: "Method not allowed" });
	}
}
