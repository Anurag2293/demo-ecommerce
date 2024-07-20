import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google"

import Providers from "~/providers";  
import { Navbar } from "./_components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Ecommerce Project",
	description: "Complete Ecommerce Store. Select from 100+ Categories!",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={inter.className}>
			<body>
				<Providers>
					<header>
						<Navbar />
					</header>
					<main>
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
