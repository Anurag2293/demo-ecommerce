import { z } from "zod";

import { Category, UserInterest } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const categoryRouter = createTRPCRouter({
    fetchCategories: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(10),
                skip: z.number().default(0),
                userId: z.number()
            })
        )
        .query(async ({ ctx, input }): Promise<{
            success: boolean,
            message: string,
            allCategories: Category[],
            interestedCategories: Set<number>
        }> => {
            try {
                const fetchedCategories = await ctx.db.category.findMany({
                    take: input.limit,
                    skip: input.skip
                });

                const interestedCategories = await ctx.db.userInterest.findMany({
                    where: {
                        userId: input.userId
                    }
                });

                const interestedCategoriesSet = new Set<number>();
                interestedCategories.forEach(interest => interestedCategoriesSet.add(interest.categoryId));

                return {
                    success: true,
                    message: 'Categories fetched successfully!',
                    allCategories: fetchedCategories,
                    interestedCategories: interestedCategoriesSet
                }
            } catch (error) {
                console.error("ERROR FETCHING CATEGORIES");
                console.log({error});
                return {
                    success: false,
                    message: 'Error fetching categories!',
                    allCategories: [],
                    interestedCategories: new Set<number>()
                }
            }
        }),

    markCategoryInterest: publicProcedure
        .input(
            z.object({
                userId: z.number(),
                categoryId: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.userInterest.create({
                    data: {
                        categoryId: input.categoryId,
                        userId: input.userId
                    }
                });

                return {
                    success: true,
                    message: "Marked category successfully!"
                }
            } catch (error) {
                console.error("ERROR MARKING INTEREST");
                console.log({error});
                return {
                    success: false,
                    message: (error as Error).message
                }
            }
        })
});