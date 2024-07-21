import { z } from "zod";

import type { User } from "@prisma/client";
import bcrypt from "bcrypt";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { generateOTP } from "~/server/utils/otp";
import { sendOTPEmail } from "~/server/utils/email";
import { signJwt } from "~/server/utils/jwt";

const SALT_ROUNDS = 10;

export const userRouter = createTRPCRouter({
  signupUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userExists = await ctx.db.user.findFirst({
          where: {
            email: input.email,
          },
        });

        if (userExists) {
          throw new Error("User with same email ID exists!");
        }

        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(input.password, salt);

        const newUser = await ctx.db.user.create({
          data: {
            ...input,
            password: hashedPassword,
          },
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
          otp: "",
        };
      }
    }),

  verifyUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        enteredOTP: z.string(),
        correctOTP: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<{ success: boolean; message: string; user: User }> => {
        try {
          if (input.correctOTP !== input.enteredOTP) {
            throw new Error("Incorrect OTP Entered!");
          }

          const updatedUser = await ctx.db.user.update({
            where: {
              email: input.email,
            },
            data: {
              verified: true,
            },
          });

          return {
            success: true,
            message: "User verified successfully!",
            user: updatedUser,
          };
        } catch (error) {
          return {
            success: false,
            message: (error as Error).message,
            user: {
              email: "",
              name: "",
              password: "",
              verified: false,
              id: -1,
            },
          };
        }
      },
    ),

  loginUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<{ success: boolean; message: string; user: User }> => {
        try {
          const currentUser = await ctx.db.user.findFirst({
            where: {
              email: input.email,
            },
          });
          if (!currentUser) {
            throw new Error("No such user exists!");
          }
          if (!currentUser.verified) {
            throw new Error("User unverified!");
          }

          const match = await bcrypt.compare(
            input.password,
            currentUser.password,
          );

          if (!match) {
            throw new Error("Incorrect Password!");
          }
          return {
            success: true,
            user: currentUser,
            message: "Login successful!",
          };
        } catch (error) {
          return {
            success: false,
            user: {
              email: "",
              name: "",
              password: "",
              verified: false,
              id: -1,
            },
            message: (error as Error).message,
          };
        }
      },
    ),

  jwtLoginUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<{
        success: boolean;
        message: string;
        user: User;
        token: string;
      }> => {
        try {
          const currentUser = await ctx.db.user.findFirst({
            where: {
              email: input.email,
            },
          });
          if (!currentUser) {
            throw new Error("No such user exists!");
          }
          if (!currentUser.verified) {
            throw new Error("User unverified!");
          }

          const match = await bcrypt.compare(
            input.password,
            currentUser.password,
          );

          if (!match) {
            throw new Error("Incorrect Password!");
          }

          const token = signJwt({
            id: currentUser.id,
            email: currentUser.email,
            verified: currentUser.verified,
            name: currentUser.name,
          });

          return {
            success: true,
            user: currentUser,
            message: "Login successful!",
            token,
          };
        } catch (error) {
          return {
            success: false,
            user: {
              email: "",
              name: "",
              password: "",
              verified: false,
              id: -1,
            },
            message: (error as Error).message,
            token: "",
          };
        }
      },
    ),

  loginAuthentication: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.user) {
        throw new Error("User UnAuthorised!");
      }
      return {
        success: true,
        user: ctx.user,
        message: "User Authorised!",
      };
    } catch (error) {
      return {
        success: false,
        user: null,
        message: (error as Error).message,
      };
    }
  }),

  jwtDemoQuery: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log({ ctx });
      return {
        message: `Hello ${input.name}`,
        user: ctx.user,
      };
    }),
});
