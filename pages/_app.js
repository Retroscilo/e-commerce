import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import ProductDialog from "../components/ProductDialog";
import CartDialog from "../components/CartDialog";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function MyApp({ Component, pageProps }) {
	const theme = createTheme();
	return (
		<SessionProvider session={pageProps.session} refetchInterval={0}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
				<ProductDialog />
				<CartDialog />
			</ThemeProvider>
		</SessionProvider>
	);
}
