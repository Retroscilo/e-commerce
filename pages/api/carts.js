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
						return {
							...product,
							quantity: p.quantity,
						};
					})
				);
				return res.status(200).json(products);
			} catch (err) {
				console.error(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
			break;
		case "PUT":
			try {
				const session = await getSession({ req });

				// User Cart
				const getUserCart = await prisma.productCartRelation.findMany(
					{}
				);
				const userCart = getUserCart.filter(
					(product) => product.cartId == session.user.cart_id
				);

				userCart.map(async (product) => {
					// Get product infos
					const getQuantityProduct = await prisma.product.findUnique({
						where: {
							id: product.productId,
						},
					});

					// Compare stock to product quantity
					product.quantity <= getQuantityProduct.quantity
						? await prisma.product.update({
								where: { id: product.productId },
								data: {
									quantity:
										getQuantityProduct.quantity -
										product.quantity,
								},
						  })
						: console.log("Stock unavailable");

					// Remove product from cart
					await prisma.productCartRelation.delete({
						where: {
							productId_cartId: {
								productId: product.productId,
								cartId: product.cartId,
							},
						},
					});
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
