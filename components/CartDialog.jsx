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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAtom } from "jotai";
import { _cartDialog } from "../store";
import Image from "next/image";
import GroupedButtons from "./GroupedButton";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import ProductInCart from "./ProductInCart";

const CartDialog = ({}) => {
	const [{ data, open }, setCartDialog] = useAtom(_cartDialog);
	const { data: session } = useSession();

	function handleClose() {
		setCartDialog({ data, open: false });
	}

	const { data: products, error } = useSWR("/api/carts", fetcher);

	async function payment() {
		try {
			await fetch("/api/carts", {
				method: "PUT",
				headers: {
					"content-type": "Application/JSON",
				},
			});
		} catch (e) {
			console.log(e);
		}
		setCartDialog({ data, open: false });
	}

	useEffect(() => console.log(products), [products]);

	if (!products || error || !session || !Array.isArray(products))
		return <div> </div>;

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>Panier</DialogTitle>
			<DialogContent sx={{ overflow: "visible" }}>
				<Grid>
					<Stack>
						{products.map((product, index) => (
							<ProductInCart key={index} product={product} />
						))}
					</Stack>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => payment()}>Payer</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CartDialog;
