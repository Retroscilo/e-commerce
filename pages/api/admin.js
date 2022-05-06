import prisma from "./../../lib/prisma.js";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
	const session = await getSession({ req });

	if (!session) return res.status(200).json({ msg: "No user connected" });

	switch (req.method) {
		case "POST":
			try {
				const { id, choice, newValue } = req.body;

				if (id) {
					newValue.quantity = parseInt(newValue.quantity);
					const imagePath = newValue.image.split("\\");
					newValue.image =
						"/images/" + imagePath[imagePath.length - 1];
					switch (choice) {
						case "Category":
							const category = await prisma.category.update({
								where: {
									id: id,
								},
								data: {
									...newValue,
								},
							});
							return res.status(200).json(category);
						case "Product":
							const product = await prisma.product.update({
								where: {
									id,
								},
								data: {
									...newValue,
								},
							});
							return res.status(200).json(product);
					}
				}

				switch (choice) {
					case "Category":
						return res
							.status(200)
							.json(await prisma.category.findMany({}));
					case "Order":
						return res
							.status(200)
							.json(
								await prisma.productCartRelation.findMany({})
							);
					case "Product":
						return res
							.status(200)
							.json(await prisma.product.findMany({}));
					case "User":
						return res
							.status(200)
							.json(await prisma.user.findMany({}));
					default:
						return res
							.status(405)
							.json({ msg: "Method not allowed" });
				}
			} catch (err) {
				console.log(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
		case "PUT":
			try {
				const { data, choice } = req.body;

				const dataToInsert = Object.entries(data)
					.map((value) => ({ [value[0]]: value[1] }))
					.reduce(
						(prev, curr) => ({
							...prev,
							[Object.keys(curr)]: Object.values(curr).join(""),
						}),
						{}
					);

				switch (choice) {
					case "Category":
						const category = await prisma.category.create({
							data: dataToInsert,
						});
						return res.status(200).json(category);
					case "Product":
						const imagePath = dataToInsert.image.split("\\");
						const date = new Date();

						dataToInsert.image =
							"/images/" + imagePath[imagePath.length - 1];
						dataToInsert.created_at = date;
						dataToInsert.price = parseInt(dataToInsert.price);
						dataToInsert.quantity = parseInt(dataToInsert.quantity);

						const product = await prisma.product.create({
							data: dataToInsert,
						});
						return res.status(200).json(product);
				}

				break;
			} catch (err) {
				console.log(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
		case "DELETE":
			try {
				const { choice, product_id } = req.body;

				switch (choice) {
					case "Category":
						const category = await prisma.category.delete({
							where: {
								id: product_id,
							},
						});
						return res.status(200).json(category);
					case "Order":
						const order = await prisma.productCartRelation.delete({
							where: {
								productId_cartId: {
									productId: product_id,
									cartId: session.user.cartId,
								},
							},
						});
						return res.status(200).json(order);
					case "Product":
						const product = await prisma.product.delete({
							where: {
								id: product_id,
							},
						});
						return res.status(200).json(product);
					case "User":
						const user = await prisma.user.delete({
							where: {
								id: product_id,
							},
						});
						return res.status(200).json(user);
					default:
						return res
							.status(405)
							.json({ msg: "Method not allowed" });
				}
			} catch (err) {
				console.log(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
	}
}
