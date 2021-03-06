import Head from "next/head";
import Link from "next/link";
import Product from "../components/Product.jsx";
import prisma from "../lib/prisma";
import Header from "../components/Header";
import useSWR from "swr";
import { Grid, Button, IconButton } from "@mui/material";
import { fetcher } from "../lib/fetcher";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProductDialog from "../components/ProductDialog";
import Filters from "../components/Filters";
import { useAtom } from "jotai";
import { _selectedCat } from "../store.js";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";

export default function Home({ staticProducts, categories }) {
	const [products, setProducts] = useState(staticProducts);
	const { data } = useSWR("/api/products", fetcher);
	const { data: session } = useSession();
	const [selectedCat] = useAtom(_selectedCat);

	useEffect(() => data && setProducts(data.data), [data]);

	return (
		<div>
			<Head>
				<title>(╯°益°)╯彡┻━┻┻━━┻</title>
				<meta
					name="description"
					content="PlanetScale Quickstart for Next.js"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
				/>
				<link rel="icon" href="/favicon.ico" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
				/>
			</Head>

			<Header />

			<main className="p-10 mx-auto max-w-4xl">
				<h1 className="text-6xl font-bold mb-4 text-center">
					(╯°益°)╯彡┻━┻┻━━┻
				</h1>
				<p
					className="mb-5 mt-10 text-xl text-center"
					style={{ fontSize: "25px" }}
				>
					🔥 La meilleure boutique de jeux de sociétés du moment ! 🔥{" "}
					<br />
				</p>
				<p className="mb-10 mt-10 text-xl text-center">
					Si jamais vous souhaitez jouer avec des amis, venez
					découvrir une vaste panoplie de jeux divers et variés ! De
					bons moments entre amis vous seront assurés (on l'espère !)
				</p>

				{/* {
					session && session.user && session.user.role === 2 */}
				{/* ?  */}
				<Grid
					container
					sx={{
						alignItems: "center",
						display: "flex",
						justifyContent: "center",
						boxShadow: 4,
						margin: "40px 0px",
						borderRadius: 2,
					}}
				>
					{session?.user?.role === 2 && (
						<Button
							sx={{
								width: "100%",
								padding: 1,
							}}
						>
							<Link href="/admin">
								<span
									style={{
										textDecoration: "none",
									}}
								>
									Page Admin
								</span>
							</Link>
						</Button>
					)}
				</Grid>
				<Filters categories={categories} />
				{/* : null
				} */}

				<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center  gap-4">
					{products &&
						products.map((product) => {
							if (
								selectedCat.length > 0 &&
								!product.categories
									.map((c) => c.id)
									.some((id) => selectedCat.includes(id))
							)
								return "";
							return (
								<Product
									categories={categories}
									product={product}
									key={product.id}
								/>
							);
						})}
				</div>
				<ProductDialog categories={categories} />
			</main>

			<footer></footer>
		</div>
	);
}

export async function getStaticProps(context) {
	const random = await prisma.product.findMany({
		include: {
			categories: true,
		},
	});

	//convert decimal value to string to pass through as json
	const products = random.map((product) => ({
		...product,
		categories: JSON.parse(JSON.stringify(product.categories)),
	}));

	// Get all categories
	const categories = await prisma.category.findMany({});

	return {
		props: {
			staticProducts: JSON.parse(JSON.stringify(products)),
			categories: JSON.parse(JSON.stringify(categories)),
		},
	};
}

const AddProduct = () => {
	return (
		<Box
			sx={{
				minHeight: "250px",
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
				alignItems: "center",
				gap: "10px",
			}}
		>
			<IconButton size="large">
				<AddIcon
					sx={{ width: "25px", height: "25px" }}
					size="large"
					color="primary"
				/>
			</IconButton>
			<div>Ajouter un produit</div>
		</Box>
	);
};
