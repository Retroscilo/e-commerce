import Admin from "../components/Admin/Admin";
import Header from "../components/Header";

const AdminPage = () => (
	<div>
		<Header />

		<main className="p-10 mx-auto max-w-4xl">
			<h1 className="text-6xl font-bold mb-10 text-center">Back Office</h1>

			<Admin />
		</main>
	</div>
);

export default AdminPage;
