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
	const { data: session } = useSession();
	const { data: products, error } = useSWR("/api/carts", fetcher);

	async function payment() {
		try {
			await fetch("/api/carts", {
				method: "PUT",
				headers: {
					"content-type": "Application/JSON",
				}
			})
		} catch(e) {
			console.log(e);
		}
		setCartDialog({ data, open: false });
	}

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>Panier</DialogTitle>
			<DialogTitle>Coucou</DialogTitle>
			<DialogActions>
				<Button
					onClick={payment}
				>
					Payer
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CartDialog;
