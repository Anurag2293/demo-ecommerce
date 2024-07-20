"use client";

import { useEffect } from "react";

import { api } from "~/trpc/react";

export default function JWTTest() {

    const {
        data,
        isPending,
    } = api.user.jwtDemoQuery.useQuery({ name: 'Anurag' });

    if (isPending) {
        return <div>Loading... </div>
    }

    if (data) {
        console.log({data});
    }

    return (
        <div>JWTTest: {data?.message}</div>
    )
}
