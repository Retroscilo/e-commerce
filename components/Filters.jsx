import { IconButton, Box, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAtom } from "jotai";
import { _selectedCat } from "../store";

const Filters = ({ categories }) => {
	const [selectedCat, setSelectedCat] = useAtom(_selectedCat);
	return (
		<Box sx={{}}>
			{categories.map((cat) => (
				<Cat cat={cat} selected={selectedCat.includes(cat.id)} />
			))}
			{selectedCat.length > 0 && (
				<Chip
					sx={{ mb: 2 }}
					label="supprimer les filtres"
					onClick={() => setSelectedCat([])}
				/>
			)}
		</Box>
	);
};

const Cat = ({ cat, selected }) => {
	const [selectedCat, setSelectedCat] = useAtom(_selectedCat);

	function handleSelection(id) {
		if (!selected) return setSelectedCat([...selectedCat, id]);
		const filteredCats = selectedCat.filter((c) => id !== c);
		return setSelectedCat(filteredCats);
	}
	return (
		<Chip
			sx={{ mr: 2, mb: 2 }}
			variant={selected ? "" : "outlined"}
			onClick={() => handleSelection(cat.id)}
			label={cat.name}
		/>
	);
};

export default Filters;
