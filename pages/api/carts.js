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
		case "PUT":
			try {
				const session = await getSession({ req });

				// Get user cart
				const getUserCart = await prisma.productCartRelation.findMany({})
				const userCart = getUserCart.filter((product) => product.cartId == session.user.cart_id);

				// Get products infos in user cart
				const productsList = userCart.map((product) => product.productId);
				const productCartInfos = await prisma.product.findMany({
					where: {
						id: {
							in: productsList
						}
					}
				});

				// Get if there's enough product for cart
				const productsQuantityInStock = userCart
					.map((product, index) => product.quantity <= productCartInfos[index].quantity)
					.every(value => value);

				if (!productsQuantityInStock) return res.status(405).json({ msg: "There is not enough stock" })

				userCart.map(async (product) => {
					// Get product infos
					const getQuantityProduct = await prisma.product.findUnique({
						where: {
							id: product.productId
						}
					});

					// Compare stock to product quantity
					product.quantity <= getQuantityProduct.quantity
						? await prisma.product.update({
							where: { id: product.productId },
							data: {
								quantity: getQuantityProduct.quantity - product.quantity
							}
						})
					: console.log("Stock unavailable")

					// Remove product from cart
					await prisma.productCartRelation.delete({
						where: {
							productId_cartId: {
								productId: product.productId,
								cartId: product.cartId
							}
						}
					})
				});
				return res.status(200);
			} catch (err) {
				console.error(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
			// Comparer stock => Fait ou non la transaction
			// Faire transaction => Virer le panier de l'utilisateur + changer les stocks
			break;
		default:
			return res.status(405).json({ msg: "Method not allowed" });
	}
}
