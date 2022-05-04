import {
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	Stack,
	TextField,
	Button,
	InputLabel
} from "@mui/material";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
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
	const { data: product, mutate: mutateProduct } = useSWR(
		"/api/products",
		fetcher
	);

	const [image, setImage] = useState(null);
	const [createObjectURL, setCreateObjectURL] = useState(null);

	const uploadToClient = (event) => {
		if (event.target.files && event.target.files[0]) {
			const i = event.target.files[0];
			setImage(i);
			setCreateObjectURL(URL.createObjectURL(i));
		}
	};

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

	useEffect(() => {
		console.log(data);
	}, [product]);

	const handleChange = (e, element) => setFormValues({
		...formValues,
		[element]: e.target.value,
	});
	const handleClose = () => setAdminDialog({ data, open: false });

	async function handleAdd(event) {
		const body = new FormData();
		body.append("file", image);
		const response = await fetch("/api/upload", {
			method: "POST",
			body
		});

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
		handleClose();
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
									if (element === "image") {
										return (
											<div className="my-2">
												<InputLabel>{element}</InputLabel>
												<input
													key={index}
													accept="image/*"
													id="icon-button-photo"
													type="file"
													onChange={(e) => {
														uploadToClient(e);
														handleChange(e, element);
													}}
												/>
											</div>
										)
									}
									else if (
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
