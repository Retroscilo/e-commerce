import { useState } from "react";
import { Box } from "@mui/system";
import { Divider, Stack, Grow } from "@mui/material";
import Image from "next/image";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const DeleteIcon = ({ show }) => (
	<Grow
		in={show}
		sx={{
			position: "absolute",
			top: 0,
			right: 0,
			background: "white",
			transform: "translate(50%, -50%) !important",
			overflow: "visible",
			borderRadius: "100px",
			color: "crimson",
			"&:hover": {
				cursor: "pointer",
			},
		}}
	>
		<DeleteOutlineOutlinedIcon sx={{ color: "crimson" }} />
	</Grow>
);

const ProductInCartImage = ({ url }) => (
	<Image
		className="w-full"
		width={40}
		height={40}
		objectFit="cover"
		src={url}
		alt="productImage"
	/>
);

const QuantityInCart = ({ quantity }) => (
	<Stack>
		<h5 style={{ margin: 0 }}>Quantité</h5>
		{quantity}
	</Stack>
);

const ProductInCart = ({ product }) => {
	const [isHovered, setIsHovered] = useState(false);
	return (
		<Box
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			sx={{
				display: "flex",
				position: "relative",
				alignItems: "center",
				border: "1px solid black",
				borderRadius: "5px",
				gap: "30px",
				px: "20px",
				mb: "20px",
			}}
		>
			{" "}
			<ProductInCartImage url={product.image} />
			<h3 style={{ flexGrow: 3 }}>{product.name}</h3>
			<QuantityInCart quantity={product.quantity} />
			<DeleteIcon show={isHovered} />
		</Box>
	);
};

export default ProductInCart;
