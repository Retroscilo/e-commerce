import prisma from "./../../lib/prisma.js";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
	const session = await getSession({ req });

	if (!session) return res.status(200).json({ msg: "No user connected" });

	switch (req.method) {
		case "POST":
			try {
				const { choice } = req.body;

				switch (choice) {
					case "Category":
						return res.status(200).json(await prisma.category.findMany({}));
					case "Order":
						return res.status(200).json(await prisma.productCartRelation.findMany({}))
					case "Product":
						return res.status(200).json(await prisma.product.findMany({}));
					case "User":
						return res.status(200).json(await prisma.user.findMany({}));
					default:
						return res.status(405).json({ msg: "Method not allowed" });
				}
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: "Something went wrong" });
		}
		case "DELETE":
			try {
				const { choice, product_id } = req.body;

				// Delete row of choose table
				switch (choice) {
					case "Category":
						await prisma.category.delete({
							where: {
								id: product_id
							}
						});
					case "Order":
						await prisma.productCartRelation.delete({
							where: {
								id: product_id
							}
						});
					case "Product":
						await prisma.product.delete({
							where: {
								id: product_id
							}
						});
					case "User":
						await prisma.user.delete({
							where: {
								id: product_id
							}
						});
					default:
						return res.status(405).json({ msg: "Method not allowed" });
				}

				// await prisma.product.delete({
				// 	where: {
				// 		id: product_id
				// 	}
				// })

				// return res.status(200);
			} catch (err) {
				console.log(err);
				return res.status(500).json({ msg: "Something went wrong" });
			}
	}
}
