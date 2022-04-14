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
	console.log('formValues: ', formValues);
	console.log('choice: ', choice);
	console.log('data: ', data);

	const columnsToObject = (columns) =>
		columns.reduce((acc, curr) => ({
			...acc,
			[curr]: ""
		}), {})

	useEffect(() => setFormValues(columnsToObject(data)), [ choice ])

	function handleClose() {
		setAdminDialog({ data, open: false });
	}

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle className="text-center">Ajouter un {choice}</DialogTitle>
			<DialogContent>
				<Grid>
					<Stack className="m-2">
						{
							Object.keys(data).length !== 0
								&& data.map((element, index) => (
									<TextField
										key={index}
										label={element}
										variant="outlined"
										className="my-2"
									/>
								))
						}
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							className="mt-2"
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
