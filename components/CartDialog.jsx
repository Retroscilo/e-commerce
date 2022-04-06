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

const CartDialog = ({}) => {
	const [{ data, open }, setCartDialog] = useAtom(_cartDialog);
	console.log('open: ', open);
	console.log('data: ', data);

	function handleClose() {
		setCartDialog({ data, open: false });
	}

	async function getData() {
		try {
			await fetch("/api/carts", {
				method: "PUT",
				headers: {
					"content-type": "Application/JSON",
				},
				body: JSON.stringify({
					cart_id: data
				}),
			})
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>Panier</DialogTitle>
			<DialogTitle onClick={getData}>Coucou</DialogTitle>
		</Dialog>
	);
};

export default CartDialog;
