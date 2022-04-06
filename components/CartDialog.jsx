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

const CartDialog = ({}) => {
	const [{ data, open }, setCartDialog] = useAtom(_cartDialog);

	function handleClose() {
		setCartDialog({ data, open: false });
	}

	const { data: products, error } = useSWR("/api/carts", fetcher);

	console.log(products);
	/* async function getData() {
		try {
			const res = await fetch("/api/carts", {
				method: "GET",
				headers: {
					"content-type": "Application/JSON",
				},
			});
			const products = await res.json();
			console.log("products: ", products);
			return products;
		} catch (e) {
			console.log(e);
		}
	} */

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>Panier</DialogTitle>
			<DialogTitle>Coucou</DialogTitle>
		</Dialog>
	);
};

export default CartDialog;
