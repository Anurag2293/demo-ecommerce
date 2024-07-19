"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "~/providers/auth-store-provider";

export function UserLogin() {
    const router = useRouter();

    const { isAuthenticated, isVerified } = useAuthStore(state => state);

    return (
        <div>Login</div>
    )
}