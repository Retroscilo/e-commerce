import {
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	Stack,
	TextField,
	Button,
	getAccordionDetailsUtilityClass,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { _adminDialog } from "../../store";
import useSWR, { mutate } from "swr";
import { fetcher } from "../../lib/fetcher";

const AdminDialog = ({}) => {
	const [{ data, open, type, id, choice }, setAdminDialog] =
		useAtom(_adminDialog);
	const [formValues, setFormValues] = useState({});
	const { mutate: mutateProduct } = useSWR("/api/products", fetcher);

	// useEffect(() => {
	// 	if (type === "edit") {
	// 		await fetch("/api/admin", {
	// 			method: "PATCH",
	// 			headers: {
	// 				"content-type": "Application/JSON",
	// 			},
	// 			body: JSON.stringify({
	// 				data: formValues,
	// 				choice: choice
	// 			}),
	// 		});
	// 	}
	// }, [type])

	useEffect(() => {
		if (!data || data.length === 0) return;

		const form = data.reduce((prev, curr) => {
			if (curr !== "id" && curr !== "created_at")
				return {
					...prev,
					[curr]: "",
				};
		}, {});

		setFormValues(form);
	}, [choice, data]);

	const handleChange = (e, element) =>
		setFormValues({
			...formValues,
			[element]: e.target.value,
		});
	const handleClose = () => setAdminDialog({ data, open: false });

	async function handleAdd() {
		await fetch("/api/admin", {
			method: "PUT",
			headers: {
				"content-type": "Application/JSON",
			},
			body: JSON.stringify({
				data: formValues,
				choice: choice,
			}),
		});
		mutateProduct();
	}

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle className="text-center">
				Ajouter un {choice}
			</DialogTitle>
			<DialogContent>
				<Grid>
					<Stack className="m-2">
						{type === "add"
							? Object.keys(data).length !== 0 &&
							  data.map((element, index) => {
									console.log("no");
									if (
										element !== "id" &&
										element !== "created_at"
									)
										return (
											<TextField
												key={index}
												label={element}
												variant="outlined"
												className="my-2"
												onChange={(e) =>
													handleChange(e, element)
												}
											/>
										);
							  })
							: type === "edit"
							? Object.keys(data).length !== 0 &&
							  data.map((element, index) => {
									console.log("yes");
									if (
										element !== "id" &&
										element !== "created_at"
									)
										return (
											<TextField
												key={index}
												label={element}
												variant="outlined"
												className="my-2"
												onChange={(e) =>
													handleChange(e, element)
												}
											/>
										);
							  })
							: null}
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							className="mt-2"
							onClick={handleAdd}
						>
							Ajouter
						</Button>
					</Stack>
				</Grid>
			</DialogContent>
		</Dialog>
	);
};

export default AdminDialog;
