"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthStore } from "~/providers/auth-store-provider";
import { api } from "~/trpc/react";

const TOTAL_CATEGORIES = 100;
const CATEGORIES_PER_PAGE = 6;
const TOTAL_PAGES = Math.ceil(TOTAL_CATEGORIES / CATEGORIES_PER_PAGE);

export function FetchCategories() {
    const router = useRouter();
    const { isAuthenticated, isVerified } = useAuthStore(state => state);

    const [currentPage, setCurrentPage] = useState(1);

    const {
        data,
        isPending,
        isError
    } = api.category.fetchCategories.useQuery(
        {
            skip: (currentPage - 1) * CATEGORIES_PER_PAGE,
            limit: CATEGORIES_PER_PAGE
        }
    );



    if (!isAuthenticated) {
        router.push("/signup");
    } else if (!isVerified) {
        router.push("/login");
    }

    return (
        <div className="mt-7">
            <div className="space-y-5">
                {
                    isPending ?
                        <div>Loading Categories...</div>
                        :
                        isError ?
                            <div>Error Fetching Categories</div>
                            :
                            data?.categories.map((category) => <div key={category.id}>
                                <p className="text-base font-normal">{category.categoryName}</p>
                            </div>)
                }
            </div>
            <div className="mt-8 flex items-center gap-x-2 text-[#ACACAC]">
                <button onClick={() => setCurrentPage(1)}>{"<<"}</button>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p-1)}>{"<"}</button>
                {Array.from({ length: TOTAL_PAGES }).map((_, index) => {
                    return (
                        <div key={index} 
                            onClick={() => setCurrentPage(index + 1)}
                            className={`text-[#ACACAC] cursor-pointer ${currentPage === (index + 1) && 'text-[#000000]'}`}
                        >
                            {index + 1}
                        </div>
                    )
                })}
                <button disabled={currentPage === TOTAL_PAGES} onClick={() => setCurrentPage(p => p+1)}>{">"}</button>
                <button onClick={() => setCurrentPage(TOTAL_PAGES)}>{">>"}</button>
            </div>
        </div>
    )
}
