import {
	Dialog,
	DialogTitle,
	DialogContent,
	Grid,
	Stack,
	Box,
	Button,
	DialogActions,
	Chip,
	IconButton,
} from "@mui/material";
import { useAtom } from "jotai";
import { _productDialog } from "../store";
import Image from "next/image";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import GroupedButtons from "./GroupedButton";
import GroupedButtonsStock from "./GroupedButtonsStock";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

const ProductDialog = ({}) => {
	const [counter, setCounter] = useState(0);
	const { data: products, mutate } = useSWR("/api/carts", fetcher);

	const [{ data, open }, setProductDialog] = useAtom(_productDialog);
	const { mutate: mutateProduct } = useSWR("/api/products", fetcher);
	const { data: session } = useSession();
	const [stockCounter, setStockCounter] = useState();
	useEffect(() => data && setStockCounter(data.quantity), [data]);
	function handleClose() {
		setCounter(0);
		setProductDialog({ data, open: false });
	}

	async function modifyStock() {
		await fetch("/api/products", {
			method: "POST",
			headers: { "content-type": "Application/JSON" },
			body: JSON.stringify({
				product_id: data.id,
				quantity: stockCounter,
			}),
		});
		mutateProduct();
		handleClose();
	}

	async function handleAdd() {
		const newProduct = { ...data, quantity: counter };
		mutate([...products, newProduct], false);
		handleClose();
		await fetch("/api/products", {
			method: "PUT",
			headers: {
				"content-type": "Application/JSON",
			},
			body: JSON.stringify({
				cart_id: session.user.cart_id,
				product_id: data.id,
				quantity: counter,
			}),
		});
		mutate();
	}

	async function handleDelete(cat) {
		const body = {
			product_id: data.id,
			category_id: cat.id,
		};

		await fetch("/api/category", {
			method: "DELETE",
			headers: {
				"content-type": "application/JSON",
			},
			body: JSON.stringify(body),
		});
		mutateProduct();

		const newCategories = data.categories.filter(
			(cat) => cat.id !== cat.id
		);
		setProductDialog({
			open,
			data: { ...data, categories: newCategories },
		});
	}

	async function handleCatAdd(cat) {
		console.log(cat);
	}

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>{data.name}</DialogTitle>
			<DialogContent>
				<Grid container>
					<Grid item xs={6}>
						<Image
							className="w-full"
							width={250}
							height={250}
							objectFit="cover"
							src={data.image}
							alt={data.name}
						/>
					</Grid>
					<Grid item xs={6}>
						<Stack>
							<Box>{data.description}</Box>
							<Box>{data.quantity} en stock</Box>
							<Box>{data.price}€</Box>
							<Box>
								<GroupedButtons
									counter={counter}
									setCounter={setCounter}
									max={data.quantity}
								/>
							</Box>
							{session && session.user.role === 2 && (
								<>
									<Box>Editer les stocks</Box>
									<GroupedButtonsStock
										counter={stockCounter}
										setCounter={setStockCounter}
										max={data.quantity}
									/>
								</>
							)}
							<Box sx={{ mt: "10px" }}>
								{data.categories &&
									data.categories.map((cat) => (
										<Chip
											data-category={cat}
											size="small"
											label={cat.name}
											onDelete={
												session.user.role === 2
													? () => handleDelete(cat)
													: undefined
											}
										/>
									))}
								{session && session.user.role === 2 && (
									<IconButton onClick={handleCatAdd}>
										<AddIcon />
									</IconButton>
								)}
							</Box>
						</Stack>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					disableElevation
					endIcon={<AddShoppingCartIcon />}
					disabled={!counter > 0}
					onClick={handleAdd}
				>
					Ajouter au panier
				</Button>
				{session && session.user.role === 2 && (
					<Button
						variant="contained"
						disableElevation
						onClick={modifyStock}
					>
						Modifier les stocks
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default ProductDialog;
