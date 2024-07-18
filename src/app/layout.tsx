import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";

import { CounterStoreProvider } from "~/providers/counter-store-provider";
import { AuthStoreProvider } from "~/providers/auth-store-provider";

export const metadata: Metadata = {
  title: "Ecommerce Project",
  description: "Complete Ecommerce Store. Select from 100+ Categories!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <HydrateClient>
            <CounterStoreProvider>
              <AuthStoreProvider>{children}</AuthStoreProvider>
            </CounterStoreProvider>
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
