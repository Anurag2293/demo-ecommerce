import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateOTP } from "~/utils/otp";
import { sendOTPEmail } from "~/utils/email";

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

        const otp: string = generateOTP(8);
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
          otp: ""
        };
      }
    }),
});
