"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthStore } from "~/providers/auth-store-provider";
import { api } from "~/trpc/react";
import Icon from "~/app/_components/icons/Icon";

const TOTAL_CATEGORIES = 100;
const CATEGORIES_PER_PAGE = 6;
const TOTAL_PAGES = Math.ceil(TOTAL_CATEGORIES / CATEGORIES_PER_PAGE);

export function FetchCategories() {
    const router = useRouter();
    const { isAuthenticated, isVerified, userId } = useAuthStore(state => state);

    const [currentPage, setCurrentPage] = useState(1);

    const utils = api.useUtils();

    const {
        data,
        isPending,
        isError
    } = api.category.fetchCategories.useQuery(
        {
            skip: (currentPage - 1) * CATEGORIES_PER_PAGE,
            limit: CATEGORIES_PER_PAGE,
            userId
        }
    );

    const markCategoryInterest = api.category.markCategoryInterest.useMutation({
        onSuccess: (result) => {
            if (!result.success) {
                alert("Error marking Interest! Retry Again.");
                return;
            }
            utils.category.invalidate();
            alert("Category marked successfully!"); 
        },
        onError: (result) => {
            alert("INTERNAL ERROR: Retry Again.");
        }
    });

    if (!isAuthenticated) {
        router.push("/signup");
    } else if (!isVerified) {
        router.push("/login");
    }

    if ((data && !data.success) || isError) {
        return <div>
            Error Fetching Categories
        </div>
    }

    const handleMarkInterest = (categoryId: number) => {
        markCategoryInterest.mutate({ userId, categoryId });
    }

    const handleUnMarkInterest = (categoryId: number) => {

    }

    return (
        <div className="mt-7">

            {isPending ?
                <div role="status" className="space-y-5 animate-pulse max-w-lg">
                    {Array.from({ length: CATEGORIES_PER_PAGE }).map((_, index) => 
                        <div key={index} className="h-6 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-4/5"></div>
                    )}
                </div>
                :
                <div className="space-y-5">
                    {data?.allCategories.map((category) => {
                        return (
                            <div key={category.id} className="flex items-center gap-x-3">
                                {data.interestedCategories.has(category.id) ?
                                    <span
                                        className="cursor-pointer"
                                        onClick={() => handleUnMarkInterest(category.id)}
                                    >
                                        <Icon key={String(category.id)} name="checked-interest" />
                                    </span>
                                    :
                                    <span
                                        className="cursor-pointer"
                                        onClick={() => handleMarkInterest(category.id)}
                                    >
                                        <Icon key={String(category.id)} name="unchecked-interest" />
                                    </span>
                                }
                                <span className="text-base font-normal">{category.categoryName}</span>
                            </div>
                        )
                    })}
                </div>
            }
            <div className="mt-8 flex items-center gap-x-2 text-[#ACACAC]">
                <button onClick={() => setCurrentPage(1)}>{"<<"}</button>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>{"<"}</button>
                {Array.from({ length: TOTAL_PAGES }).map((_, index) => {
                    return (
                        <div key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`text-[#ACACAC] cursor-pointer ${currentPage === (index + 1) && 'text-black'}`}
                        >
                            {index + 1}
                        </div>
                    )
                })}
                <button disabled={currentPage === TOTAL_PAGES} onClick={() => setCurrentPage(p => p + 1)}>{">"}</button>
                <button onClick={() => setCurrentPage(TOTAL_PAGES)}>{">>"}</button>
            </div>
        </div >
    )
}
