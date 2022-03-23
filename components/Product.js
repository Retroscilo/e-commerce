import Image from "next/image";
import { useAtom } from "jotai";
import { _productDialog } from "../store";

export default function Product({ product, categories }) {
	const { name, description, price, image } = product;
	const [productDialog, setProductDialog] = useAtom(_productDialog);
	function handleClick() {
		setProductDialog({ data: product, open: true });
	}

	const t = product.categories.map((cat) => cat.categoryId);
	const category = t
		.map((id) => categories.filter((c) => c.id === id))
		.flat();

	return (
		<div
			className="max-w-[250px] rounded overflow-hidden shadow-lg"
			onClick={handleClick}
			key={product.id}
		>
			<Image
				className="w-full"
				width={250}
				height={250}
				objectFit="cover"
				src={image}
				alt={name}
			/>
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2">{name}</div>
				<p className="text-gray-700 text-base">{description}</p>
				<p className="text-gray-900 text-xl">${price}</p>
			</div>
			<div className="px-6 pt-4 pb-2">
				{category.map((c, i) => (
					<span
						key={i}
						className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
					>
						{c.name}
					</span>
				))}
			</div>
		</div>
	);
}
