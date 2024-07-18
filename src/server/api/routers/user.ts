import { z } from "zod";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateOTP } from "~/utils/otp";

const sendOTPEmail = async (email: string, name: string, otp: string) => {
  try {
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY ?? "",
    });
    const sentFrom = new Sender(
      "mailersend@trial-z3m5jgr0nwogdpyo.mlsender.net",
      "Anurag Dhote",
    );

    const recipients = [new Recipient(email, name)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("One Time Password for verifying!")
      .setHtml(
        `<div>
          <strong>Hi, ${name}</strong>
          <h3>Welcome to Ecommerce IO!</h3>
          <p>Here's your One-Time Password (OTP) for completing signup: ${otp} </p>
        </div>`,
      )
      .setText("This is the text content");

    await mailerSend.email.send(emailParams);

    return { success: true, message: "OTP Sent successfully!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

const userSignupSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const userRouter = createTRPCRouter({
  signupUser: publicProcedure
    .input(userSignupSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newUser = await ctx.db.user.create({
          data: input,
        });
        console.log("newUser: ", newUser);

        const otp = generateOTP(8);
        const { success: OTPSentSuccessfully, message } = await sendOTPEmail(
          input.email,
          input.name,
          otp,
        );

        if (!OTPSentSuccessfully) {
          throw new Error(message);
        }

        return {
          success: true,
          message: "OTP Sent Successfully!",
          user: newUser,
          otp,
        };
      } catch (error) {
        return {
          success: false,
          message: (error as Error).message,
          user: null,
        };
      }
    }),

  sendEmail: publicProcedure
    .input(userSignupSchema)
    .mutation(async ({ input }) => {
      try {
        const mailerSend = new MailerSend({
          apiKey: process.env.MAILERSEND_API_KEY ?? "",
        });
        const sentFrom = new Sender(
          "mailersend@trial-z3m5jgr0nwogdpyo.mlsender.net",
          "Anurag Dhote",
        );

        const recipients = [new Recipient(input.email, input.name)];

        const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setTo(recipients)
          .setReplyTo(sentFrom)
          .setSubject("This is a Subject")
          .setHtml("<strong>This is the HTML content</strong>")
          .setText("This is the text content");

        await mailerSend.email.send(emailParams);

        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    }),
});
