import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    createUser: publicProcedure
        .input(z.object({ name: z.string(), email: z.string(), password: z.string()}))
        .mutation(async ({ ctx, input }) => {
            try {
                const newUser = await ctx.db.user.create({
                    data: input
                });
                console.log("newUser: ", newUser);  
                return {
                    success: true,
                    message: "User created successfully!",
                    user: newUser
                }
            } catch (error) {
                return {
                    success: false,
                    message: (error as Error).message,
                    user: null
                }
            }
        }),
    
    
});