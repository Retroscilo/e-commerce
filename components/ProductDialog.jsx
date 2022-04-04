import {
	Dialog,
	DialogTitle,
	DialogContent,
	Grid,
	Stack,
	Box,
	Button,
	DialogActions,
} from "@mui/material";
import { useAtom } from "jotai";
import { _productDialog } from "../store";
import Image from "next/image";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import GroupedButtons from "./GroupedButton";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const ProductDialog = ({}) => {
	const [counter, setCounter] = useState(0);

	const [{ data, open }, setProductDialog] = useAtom(_productDialog);
	const { data: session } = useSession();

	function handleClose() {
		setProductDialog({ data, open: false });
	}

	async function handleAdd() {
		console.log(counter);
		try {
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
		} catch (e) {
			console.log(e);
		}
		setProductDialog({ data, open: false });
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
			</DialogActions>
		</Dialog>
	);
};

export default ProductDialog;
