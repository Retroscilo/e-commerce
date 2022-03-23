import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function MyApp({
	Component,
	pageProps: { session, ...pageProps }
}) {
	return (
		<SessionProvider
			session={pageProps.session}
			refetchInterval={0}
		>
			<Component {...pageProps} />
		</SessionProvider>
	);
}
