import { z } from "zod";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    createUser: publicProcedure
        .input(z.object({ name: z.string(), email: z.string(), password: z.string() }))
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

    sendEmail: publicProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async ({ input }) => {
            try {
                const mailerSend = new MailerSend({
                    apiKey: process.env.MAILERSEND_API_KEY || "",
                });
                const sentFrom = new Sender("mailersend@trial-z3m5jgr0nwogdpyo.mlsender.net", "Anurag Dhote");

                const recipients = [
                    new Recipient("anuragdhote392@gmail.com", input.name)
                ];

                const emailParams = new EmailParams()
                    .setFrom(sentFrom)
                    .setTo(recipients)
                    .setReplyTo(sentFrom)
                    .setSubject("This is a Subject")
                    .setHtml("<strong>This is the HTML content</strong>")
                    .setText("This is the text content");

                await mailerSend.email.send(emailParams);

                return { success: true }
            } catch (error) {
                return { success: false, error }
            }
        })

});