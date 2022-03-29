import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./header.module.css";
import { useEffect } from "react";
import {
	Grid,
	CircularProgress,
	Box,
	IconButton,
	Button,
	Paper,
	MenuList,
	MenuItem,
	Divider,
	Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
	const { data: session, status } = useSession();
	const loading = status === "loading";

	return (
		<Grid
			container
			sx={{
				alignItems: "center",
				padding: 2,
				justifyContent: "space-between",
				boxShadow: 6,
			}}
		>
			{loading && <CircularProgress />}
			{!session && (
				<>
					<Grid item>Vous n'êtes pas connecté</Grid>
					<Grid item>
						<Button
							variant="contained"
							href={`/api/auth/signin`}
							disableElevation
							onClick={(e) => {
								e.preventDefault();
								signIn("_", {
									callbackUrl: `${window.location.origin}`,
								});
							}}
						>
							Se connecter
						</Button>
					</Grid>
				</>
			)}
			{session?.user && (
				<>
					<Grid item>
						{session.user.image && (
							<Box
								item
								style={{
									backgroundImage: `url('${session.user.image}')`,
								}}
								className={styles.avatar}
							/>
						)}
						<Stack sx={{ px: "15px" }}>
							<small>Signed in as</small>
							<strong>
								{session.user.email ?? session.user.name}
							</strong>
						</Stack>
					</Grid>
					<Grid item>
						<a
							href={`/api/auth/signout`}
							className={styles.button}
							onClick={(e) => {
								e.preventDefault();
								signOut();
							}}
						>
							Déconnexion
						</a>
					</Grid>
				</>
			)}
		</Grid>
	);
}

{
	/* <header>
			<noscript>
				<style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
			</noscript>
			<div className={styles.signedInStatus}>
				<p
					className={`nojs-show ${
						!session && loading ? styles.loading : styles.loaded
					}`}
				>
					{!session && (
						<>
							<span className={styles.notSignedInText}>
								You are not signed in
							</span>
							<a
								href={`/api/auth/signin`}
								className={styles.buttonPrimary}
								onClick={(e) => {
									e.preventDefault();
									signIn("_", {
										callbackUrl: `${window.location.origin}`,
									});
								}}
							>
								Sign in
							</a>
						</>
					)}
					{session?.user && (
						<>
							{session.user.image && (
								<span
									style={{
										backgroundImage: `url('${session.user.image}')`,
									}}
									className={styles.avatar}
								/>
							)}
							<span className={styles.signedInText}>
								<small>Signed in as</small>
								<br />
								<strong>
									{session.user.email ?? session.user.name}
								</strong>
							</span>
							<span>test</span>
							<a
								href={`/api/auth/signout`}
								className={styles.button}
								onClick={(e) => {
									e.preventDefault();
									signOut();
								}}
							>
								Sign out
							</a>
						</>
					)}
				</p>
			</div>
		</header> */
}
