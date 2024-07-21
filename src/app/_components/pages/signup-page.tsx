"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Link from "next/link";

import { api } from "~/trpc/react";
import { useAuthStore } from "~/providers/auth-store-provider";
import { useToast } from "~/components/ui/use-toast";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      },
    ),
});

type FormData = z.infer<typeof formSchema>;

export function UserSignup() {
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated, isVerified, updateAuthState } = useAuthStore(
    (state) => state,
  );

  if (isAuthenticated && isVerified) {
    router.push("/");
  }

  const createUser = api.user.signupUser.useMutation({
    onSuccess: (result, variables) => {
      if (result.success) {
        toast({
          title: "Account created successfuly!",
          description: result.message,
        });

        updateAuthState({
          userId: result.user?.id ?? -1,
          email: variables.email,
          name: variables.name,
          otp: result.otp,
          isVerified: false,
          isAuthenticated: false,
        });

        router.push("/verify-otp");
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: result.message,
        });
      }
    },
    onError: (error) => {
      alert(error.shape);
      console.log(error.shape);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    createUser.mutate(data);
  };

  return (
    <div className="mx-auto my-10 w-11/12 rounded-[20px] border-[1px] border-[#C1C1C1] px-[3.75rem] py-10 sm:w-5/6 md:w-[36rem] md:pb-24">
      <h1 className="text-center text-[32px] font-semibold">
        Create your account
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-5 mb-10 flex flex-col gap-y-4"
      >
        <div className="flex flex-col">
          <label htmlFor="name" className="text-base font-normal">
            Name
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Enter you name"
            className={`rounded-[6px] border-[1px] px-3 py-2 focus:outline-none ${errors.name ? "border-red-600" : "border-[#C1C1C1]"}`}
          />
          {!errors.name && <p className="invisible text-xs">{"some stuff"}</p>}
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            {...register("email")}
            placeholder="Enter you email"
            className={`rounded-[6px] border-[1px] px-3 py-2 focus:outline-none ${errors.email ? "border-red-600" : "border-[#C1C1C1]"}`}
          />
          {!errors.email && <p className="invisible text-xs">{"some stuff"}</p>}
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="Enter you password"
            className={`rounded-[6px] border-[1px] px-3 py-2 focus:outline-none ${errors.password ? "border-red-600" : "border-[#C1C1C1]"}`}
          />
          {!errors.password && (
            <p className="invisible text-xs">{"some stuff"}</p>
          )}
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={createUser.isPending}
          className="mt-4 w-full rounded-[6px] bg-black py-4 text-base font-medium uppercase text-white"
        >
          {createUser.isPending ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-base font-normal">
          Have an Account?{" "}
          <Link href="/login" className="font-medium uppercase">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
