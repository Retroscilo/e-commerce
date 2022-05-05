import Admin from "../components/Admin/Admin";
import Header from "../components/Header";
import {
	Button
} from "@mui/material";

const AdminPage = () => (
	<div>
		<Header />

		<main
			className="p-10 mx-auto max-w-4xl"
			style={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column"
			}}
		>
			<h1 className="text-6xl font-bold mb-10 text-center">Back Office</h1>

			<Button className="mb-10">
				<a href="/" style={{ textDecoration: "none", color: "#4D66E3" }}>Retour à la page d'accueil</a>
			</Button>


			<Admin />
		</main>
	</div>
);

export default AdminPage;
