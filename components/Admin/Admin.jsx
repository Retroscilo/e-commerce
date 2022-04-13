import { Grid, Button } from "@mui/material";
import Tab from "./Tab";
import { useState, useEffect } from "react";

const Admin = ({}) => {
	const [value, setValue] = useState("Category");
	const [rows, setRows] = useState([]);
	const [columns, setColumns] = useState([]);

	const setTab = (values) => {
		console.log(values);
		if (values.length === 0) return setColumns([]);
		setColumns(Object.keys(values[0]));
		setRows(values);
	};

	async function getData(choice) {
		console.log(choice);
		try {
			const data = await fetch("/api/admin", {
				method: "POST",
				headers: { "content-type": "Application/JSON" },
				body: JSON.stringify({ choice }),
			});
			const values = await data.json();
			setTab(values);
		} catch (e) {
			console.log(e);
		}
	}

	useEffect(() => getData(value), []);

	const buttonsList = [
		{ label: "Catégories", value: "Category" },
		{ label: "Produits", value: "Product" },
		{ label: "Utilisateurs", value: "User" },
		{ label: "Commandes passées", value: "Order" },
	];

	return (
		<div className="text-center mx-auto">
			<Grid
				container
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					margin: "auto",
				}}
			>
				<Grid
					item
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-evenly",
					}}
				>
					{buttonsList.map((button, index) => (
						<Button
							key={index}
							onClick={() => {
								setValue(button.value);
								getData(button.value);
							}}
							sx={{
								backgroundColor:
									value === button.value ? "#4D66E3" : "",
								color: value === button.value ? "white" : "",
								margin: "0px 5px",
								"&:hover": {
									color:
										value === button.value
											? "#1976d2 !important"
											: "#1976d2",
								},
							}}
						>
							{button.label}
						</Button>
					))}
				</Grid>
				{columns.length === 0 && <div>"aucune donnée disponible"</div>}
				{columns.length > 0 && (
					<Grid item>
						<Tab
							rows={rows}
							columns={columns}
							choice={value}
							refresh={getData}
						/>
					</Grid>
				)}
			</Grid>
		</div>
	);
};

export default Admin;
