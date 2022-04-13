import {
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const Tab = ({
	rows,
	columns,
	choice
}) => {
	function editProduct() {
		console.log("Edit");
		return null;
	};

	async function deleteProduct(choice, product_id) {
		try {
			const data = await fetch("/api/admin", {
				method: "DELETE",
				headers: { "content-type": "Application/JSON" },
				body: JSON.stringify({ product_id, choice })
			})
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<TableContainer className="mt-8">
			<Table aria-label="a dense table">
				<TableHead>
					<TableRow>
						{
							columns.map((column, index) => (
								<TableCell key={index} className="text-left px-2">{column.charAt(0).toUpperCase() + column.slice(1)}</TableCell>
							))
						}
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						rows.map((row, index) => {
								return (
									<TableRow key={index}>
										{
											Object.values(row).map((value, index2) => (
												<TableCell key={index2} className="text-left px-2">{value}</TableCell>
											))
										}
										<TableCell className="text-center px-2">
											<EditOutlinedIcon
												className="mx-1"
												sx={{ cursor: "pointer" }}
												onClick={() => editProduct(row.id)}
											/>
											<DeleteOutlineOutlinedIcon
												className="mx-1"
												sx={{ cursor: "pointer", color: "crimson "}}
												onClick={() => deleteProduct(choice, row.id)}
											/>
										</TableCell>
									</TableRow>
								)
							}
						)
					}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default Tab;
