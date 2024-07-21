"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import Icon from "~/app/_components/icons/Icon";
import { useToast } from "~/components/ui/use-toast";

const TOTAL_CATEGORIES = 100;
const CATEGORIES_PER_PAGE = 6;
const TOTAL_PAGES = Math.ceil(TOTAL_CATEGORIES / CATEGORIES_PER_PAGE);

function getPaginationList(currentPage: number): Array<string | number> {
  const paginationList: Array<string | number> = [];
  if (currentPage > 4) {
    paginationList.push("...");
  }
  for (let page = Math.max(1, currentPage - 3); page <= currentPage; page++) {
    paginationList.push(page);
  }
  for (
    let page = currentPage + 1;
    page <= Math.min(currentPage + 3, TOTAL_PAGES);
    page++
  ) {
    paginationList.push(page);
  }
  if (currentPage < TOTAL_PAGES - 3) {
    paginationList.push("...");
  }
  return paginationList;
}

export function FetchCategories() {
  const router = useRouter();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);

  const utils = api.useUtils();

  const { data, isPending, isError } = api.category.fetchCategories.useQuery({
    skip: (currentPage - 1) * CATEGORIES_PER_PAGE,
    limit: CATEGORIES_PER_PAGE,
  });

  const markCategoryInterest = api.category.markCategoryInterest.useMutation({
    onSuccess: (result) => {
      try {
        if (!result.success) {
          alert("Error marking Interest! Retry Again.");
          return;
        }
        void utils.category.invalidate();
        // alert("Category marked successfully!");
      } catch (error) {}
    },
    onError: (result) => {
      console.error(result.shape);
      alert("INTERNAL ERROR: Retry Again.");
    },
  });

  const unmarkCategoryInteres = api.category.unmarkCategoryInterest.useMutation(
    {
      onSuccess: (result) => {
        try {
          if (!result.success) {
            alert("Error unmarking Interest! Retry Again.");
            return;
          }
          void utils.category.invalidate();
          // alert("Category unmarked successfully!");
        } catch (error) {}
      },
      onError: (result) => {
        console.error(result.shape);
        alert("INTERNAL ERROR: Retry Again.");
      },
    },
  );

  if (data && !data.success) {
    return <div>Error Fetching Categories</div>;
  }

  if (isError) {
    // alert("User Unauthorised!");
    toast({
      variant: "destructive",
      title: "User session expired!",
      description: "Login again!",
    });

    router.push("/login");
  }

  const handleMarkInterest = (categoryId: number) => {
    markCategoryInterest.mutate({ categoryId });
  };

  const handleUnMarkInterest = (categoryId: number) => {
    unmarkCategoryInteres.mutate({ categoryId });
  };

  return (
    <div className="mt-7">
      {isPending ? (
        <div role="status" className="max-w-lg animate-pulse space-y-5">
          {Array.from({ length: CATEGORIES_PER_PAGE }).map((_, index) => (
            <div key={index} className="flex">
              <div className="size-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="ms-2 h-6 w-3/5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {data?.allCategories.map((category) => (
            <div key={category.id} className="flex items-center gap-x-3">
              {data.interestedCategories.has(category.id) ? (
                <span
                  className="cursor-pointer"
                  onClick={() => handleUnMarkInterest(category.id)}
                >
                  <Icon key={String(category.id)} name="checked-interest" />
                </span>
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => handleMarkInterest(category.id)}
                >
                  <Icon key={String(category.id)} name="unchecked-interest" />
                </span>
              )}
              <span className="text-base font-normal">
                {category.categoryName}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mx-auto mt-8 flex max-w-min items-center gap-x-2 text-[#ACACAC] md:mt-10">
        <button onClick={() => setCurrentPage(1)}>{"<<"}</button>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          {"<"}
        </button>

        {getPaginationList(currentPage).map((value, index) => {
          if (typeof value === "string") {
            if (index === 0) {
              return (
                <div
                  key={index}
                  onClick={() => setCurrentPage((p) => p - 4)}
                  className="cursor-pointer"
                >
                  {value}
                </div>
              );
            }

            return (
              <div
                key={index}
                onClick={() => setCurrentPage((p) => p + 4)}
                className="cursor-pointer"
              >
                {value}
              </div>
            );
          }
          return (
            <div
              key={index}
              onClick={() => setCurrentPage(value)}
              className={`cursor-pointer ${currentPage === value && "text-black"}`}
            >
              {value}
            </div>
          );
        })}

        <button
          disabled={currentPage === TOTAL_PAGES}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          {">"}
        </button>
        <button onClick={() => setCurrentPage(TOTAL_PAGES)}>{">>"}</button>
      </div>
    </div>
  );
}
