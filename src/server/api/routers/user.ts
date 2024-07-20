import { z } from "zod";

import type { User } from "@prisma/client";

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
    .mutation(async ({ ctx, input }) : Promise<{ success: boolean, message: string, user: User}> => {
      try {
        if (input.correctOTP !== input.enteredOTP) {
          throw new Error("Incorrect OTP Entered!");
        }
        
        const updatedUser = await ctx.db.user.update({
          where: {
            email: input.email
          },
          data: {
            verified: true 
          }
        })

        return {
          success: true,
          message: "User verified successfully!",
          user: updatedUser
        }
      } catch (error) {
        return {
          success: false,
          message: (error as Error).message,
          user: { email: "", name: "", password: "", verified: false, id: -1 }
        }
      }
    }),

  loginUser: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) : Promise<{ success: boolean, message: string, user: User}> => {
      try {
        const currentUser = await ctx.db.user.findFirst({
          where: {
            email: input.email
          }
        });
        if (!currentUser) {
          throw new Error("No such user exists!");
        } 
        if (!currentUser.verified) {
          throw new Error("User unverified!");
        }
        if (currentUser.password !== input.password) {
          throw new Error("Incorrect Password!");
        }
        return {
          success: true,
          user: currentUser,
          message: "Login successful!"
        }
      } catch (error) {
        return {
          success: false,
          user: { email: "", name: "", password: "", verified: false, id: -1 },
          message: (error as Error).message
        }
      }
    })
});
