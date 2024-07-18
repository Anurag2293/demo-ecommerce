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

        // TODO: Hash password before creating user 
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

        // TODO: Create JWT Token and save in http cookie.

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

  verifyUser: publicProcedure
    .input(z.object({ email: z.string().email(), enteredOTP: z.string(), correctOTP: z.string()}))
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.correctOTP !== input.enteredOTP) {
          throw new Error("Incorrect OTP Entered!");
        }
        
        await ctx.db.user.update({
          where: {
            email: input.email
          },
          data: {
            verified: true 
          }
        })

        return {
          success: true,
          message: "User verified successfully!"
        }
      } catch (error) {
        return {
          success: false,
          message: (error as Error).message
        }
      }
    })
});
