import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const fakeProductRouter = createTRPCRouter({
    createCategories: publicProcedure
        .input(z.string())
        .mutation(({ ctx }) => {
            const ecommerceCategories = [
                { categoryName: "Fabrics & Textiles" },
                { categoryName: "Hobby & Model Supplies" }
            ];

            return ctx.db.category.createMany({
                data: ecommerceCategories
            })
        })
});
