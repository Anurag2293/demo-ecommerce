"use client"

import { useRouter } from "next/navigation";

import { useAuthStore } from "~/providers/auth-store-provider"

export function HomePage() {
    const router = useRouter();

    const { isAuthenticated, verified } = useAuthStore(state => state);

    if (!isAuthenticated) {
        router.push("/signup");
    } else if (!verified) {
        router.push("/login");
    }

    return (
        <div>HomePage</div>
    )
}
