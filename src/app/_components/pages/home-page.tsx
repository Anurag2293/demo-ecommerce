"use client"

import { useRouter } from "next/navigation";

import { useAuthStore } from "~/providers/auth-store-provider"

export function HomePage() {
    const router = useRouter();

    const { isAuthenticated, isVerified } = useAuthStore(state => state);

    if (!isAuthenticated) {
        router.push("/signup");
    } else if (!isVerified) {
        router.push("/login");
    }

    return (
        <div>HomePage</div>
    )
}
