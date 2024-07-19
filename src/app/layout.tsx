import "~/styles/globals.css";

// import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Inter } from "next/font/google"

import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";

import { AuthStoreProvider } from "~/providers/auth-store-provider";

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
        <TRPCReactProvider>
          <HydrateClient>
            <AuthStoreProvider>
              <header>
                <Navbar />
              </header>
              <main>
                {children}
              </main>
            </AuthStoreProvider>
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
