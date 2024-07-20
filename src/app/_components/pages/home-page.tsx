"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "~/providers/auth-store-provider";
import { api } from "~/trpc/react";
import { FetchCategories } from "~/app/_components/fetch-categories";
import Icon from "~/app/_components/icons/Icon";

export function HomePage() {
    const router = useRouter();
    const { updateAuthState } = useAuthStore(state => state);

    const {
        data,
        isPending,
        isError
    } = api.user.homePageVerify.useQuery();

    useEffect(() => {
        if ((data && !data.success) || isError) {
            router.push("/login");
        } else if (data && data.success && data.user) {
            updateAuthState({
                userId: data.user.id,
                email: data.user.email,
                name: data.user.name,
                isVerified: data.user.verified,
                isAuthenticated: true,
                otp: ""
            });
        }
    }, [data, isError, router, updateAuthState]);

    if (isPending) {
        return <Icon name="spinner" />
    }

    return <FetchCategories />
}
