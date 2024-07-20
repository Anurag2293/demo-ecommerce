import { z } from "zod";

import type { Category } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const categoryRouter = createTRPCRouter({
    fetchCategories: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(10),
                skip: z.number().default(0),
            })
        )
        .query(async ({ ctx, input }): Promise<{ success: boolean, message: string, categories: Category[] }> => {
            try {
                const fetchedCategories = await ctx.db.category.findMany({
                    take: input.limit,
                    skip: input.skip
                });
                return {
                    success: true,
                    message: 'Categories fetched successfully!',
                    categories: fetchedCategories
                }
            } catch (error) {
                return {
                    success: true,
                    message: 'Error fetching categories!',
                    categories: []
                }
            }
        }),
});