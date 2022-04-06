// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClientInitializationError } from "@prisma/client/runtime";
import prisma from "./../../lib/prisma.js";

export default async function handler(req, res) {
	switch (req.method) {
		case "PUT":
			try {
				const { cart_id } = req.body;
				console.log('cart_id: ', cart_id);
				const getProducts = await prisma.productCartRelation.findMany({});
				console.log('getProducts: ', getProducts);
				const products = getProducts.filter((product) => console.log(product.cartId == cart_id));
				console.log('products: ', products);
			} catch (err) {
				console.error(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
			break;
		default:
			return res.status(405).json({ msg: "Method not allowed" });
	}
}
