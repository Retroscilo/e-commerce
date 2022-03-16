import "../styles/globals.css";
import "../components/Header";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
