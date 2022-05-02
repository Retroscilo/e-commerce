import {
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	Stack,
	TextField,
	Button
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { _adminDialog } from "../../store";

const AdminDialog = ({}) => {
	const [{ data, open, choice }, setAdminDialog] = useAtom(_adminDialog);
	const [ formValues, setFormValues ] = useState({});

	useEffect(() => {
		if (!data || data.length === 0) return;

		const form = data.reduce((prev, curr) => {
			if (curr !== "id") return ({
				...prev,
				[curr]: ""
			})
		}, {});
		console.log('form: ', form);

		setFormValues(form);
	}, [choice, data]);

	const handleChange = (e, element) => setFormValues({
		...formValues,
		[element]: e.target.value
	});

	function handleClose() {
		setAdminDialog({ data, open: false });
	}

	async function handleAdd() {
		// const newProduct = { ...data, quantity: counter };
		// mutate([...products, newProduct], false);
		// handleClose();

		await fetch("/api/admin", {
			method: "PUT",
			headers: {
				"content-type": "Application/JSON",
			},
			body: JSON.stringify({
				data: formValues,
				choice: choice
			}),
		});
		// mutate();
	}

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle className="text-center">Ajouter un {choice}</DialogTitle>
			<DialogContent>
				<Grid>
					<Stack className="m-2">
						{
							Object.keys(data).length !== 0
								&& data.map((element, index) => {
									if (element !== "id")
										return (
											<TextField
												key={index}
												label={element}
												variant="outlined"
												className="my-2"
												onChange={(e) => handleChange(e, element)}
											/>
										)
								})
						}
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
