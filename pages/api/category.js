// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "./../../lib/prisma.js";

export default async function handler(req, res) {
	switch (req.method) {
		case "PUT":
			try {
				const { product_id, category_id } = req.body;
				const product = await prisma.product.update({
					where: { id: product_id },
					data: {
						categories: {
							create: [
								{
									category: {
										connect: { id: category_id },
									},
								},
							],
						},
					},
				});
				console.log(product);
				return res.status(200).json("ok");
			} catch (e) {
				return res.status(500).json("Something went wrong");
			}

		case "DELETE":
			try {
				const { product_id, category_id } = req.body;
				const product = await prisma.ProductCategoryRelation.deleteMany(
					{
						where: {
							productId: product_id,
							categoryId: category_id,
						},
					}
				);
				console.log(product);
				return res.status(200).json(product);
			} catch (e) {
				console.log(e);
				return res.status(500).json({ msg: "Something went wrong" });
			}
		default:
			return res.status(405).json({ msg: "Method not allowed" });
	}
}
