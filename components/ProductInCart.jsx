import { Box } from "@mui/system";
import Image from "next/image";

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

const QuantityInCart = ({}) => <Box></Box>;

const ProductInCart = ({ product }) => {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				border: "1px solid black",
				borderRadius: "5px",
				gap: "30px",
				px: "20px",
				mb: "20px",
			}}
		>
			{" "}
			<ProductInCartImage url={product.image} /> <h3>{product.name}</h3>
		</Box>
	);
};

export default ProductInCart;
