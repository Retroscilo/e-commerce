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
import { _cartDialog } from "../store";
import Image from "next/image";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
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

	if (!products || error || !session) return <div>loading</div>;
	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>Panier</DialogTitle>
			<DialogContent>
				<Grid>
					<Stack>
						{products.map((product) => (
							<ProductInCart product={product} />
						))}
					</Stack>
				</Grid>
			</DialogContent>
		</Dialog>
	);
};

export default CartDialog;
