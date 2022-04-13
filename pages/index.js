import Head from "next/head";
import Link from "next/link";
import Product from "../components/Product.jsx";
import prisma from "../lib/prisma";
import Header from "../components/Header";
import useSWR from "swr";
import { Grid, Button } from "@mui/material";
import { fetcher } from "../lib/fetcher";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProductDialog from "../components/ProductDialog";

export default function Home({ staticProducts, categories }) {
	const [products, setProducts] = useState(staticProducts);
	const { data } = useSWR("/api/products", fetcher);
	const { data: session } = useSession();

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
					Next.js Starter
				</h1>
				<p className="mb-10 text-xl text-center">
					🔥 Shop from the hottest items in the world 🔥
				</p>

				{session && session.user && session.user.role === 2 ? (
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
					</Grid>
				) : null}

				<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center  gap-4">
					{products &&
						products.map((product) => (
							<Product
								categories={categories}
								product={product}
								key={product.id}
							/>
						))}
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
