import {
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Tab = ({ rows, columns, choice, refresh, handleClick }) => {
	async function deleteProduct(choice, product_id) {
		try {
			const data = await fetch("/api/admin", {
				method: "DELETE",
				headers: { "content-type": "Application/JSON" },
				body: JSON.stringify({ product_id, choice }),
			});
			await refresh(choice);
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<TableContainer className="mt-8">
			<Table aria-label="a dense table">
				<TableHead>
					<TableRow>
						{columns.map((column, index) => (
							<TableCell key={index} className="text-left px-2">
								{column.charAt(0).toUpperCase() +
									column.slice(1)}
							</TableCell>
						))}
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row, index) => {
						return (
							<TableRow key={index} sx={{ height: "150px" }}>
								{Object.values(row).map((value, index2) => (
									<TableCell
										key={index2}
										className="text-left px-2"
									>
										{value}
									</TableCell>
								))}
								<TableCell className="text-center px-2">
									<EditOutlinedIcon
										className="mx-1"
										sx={{ cursor: "pointer" }}
										onClick={() => handleClick(choice, columns, "edit", row.id)}
									/>
									<DeleteButton
										choice={choice}
										row={row}
										deleteProduct={deleteProduct}
									/>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

const DeleteButton = ({ deleteProduct, choice, row }) => {
	const [loading, setLoading] = useState(false);
	async function handleDelete() {
		setLoading(true);
		await deleteProduct(choice, row.id);
		setLoading(false);
	}
	return loading ? (
		<Box
			sx={{
				display: "flex",
				pl: "5px",
			}}
		>
			<CircularProgress size={18} />
		</Box>
	) : (
		<DeleteOutlineOutlinedIcon
			className="mx-1"
			sx={{
				cursor: "pointer",
				color: "crimson ",
			}}
			onClick={() => handleDelete()}
		/>
	);
};

export default Tab;
