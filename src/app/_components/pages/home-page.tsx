"use client"

import { useRouter } from "next/navigation";

import { useAuthStore } from "~/providers/auth-store-provider"

export function HomePage() {
    const router = useRouter();

    const { isAuthenticated } = useAuthStore(state => state);

    if (!isAuthenticated) {
        router.push("/signup");
    }

    return (
        <div>HomePage</div>
    )
}
