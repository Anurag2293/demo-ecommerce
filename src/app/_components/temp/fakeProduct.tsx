"use client";

import { api } from "~/trpc/react";

export function CreateFakeProductCategories () {
    const createCategories = api.fakeProduct.createCategories.useMutation({
        onSuccess: () => {
            alert("Categories Created Successfully!");
        }
    });

    return (
        <div>
            <button
                className="border-2 border-cyan-200 "
                disabled={createCategories.isPending}
                onClick={() => {
                    createCategories.mutate("lol");
                }}
            >
                {createCategories.isPending ? "Creating Categories..." : "Create Categories"}
            </button>
            <hr />
        </div>
    )
}