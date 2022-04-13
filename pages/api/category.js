// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import prisma from "./../../lib/prisma.js";

export default async function handler(req, res) {
	switch (req.method) {
		case "DELETE":
			const { product_id, category_id } = req.body;
			try {
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
