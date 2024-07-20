import { type ReactNode } from 'react'

import { AuthStoreProvider } from "~/providers/auth-store-provider";
import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <TRPCReactProvider>
            <HydrateClient>
                <AuthStoreProvider>
                    {children}
                </AuthStoreProvider>
            </HydrateClient>
        </TRPCReactProvider>
    )
}
