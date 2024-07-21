"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Link from "next/link";

import { api } from "~/trpc/react";
import { useAuthStore } from "~/providers/auth-store-provider";
import { useToast } from "~/components/ui/use-toast";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Invalid Password" }),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export function UserLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isVerified, updateAuthState } = useAuthStore(
    (state) => state,
  );
  const { toast } = useToast();

  if (isAuthenticated && isVerified) {
    router.push("/");
  }

  const jwtLoginUser = api.user.jwtLoginUser.useMutation({
    onSuccess: (result) => {
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Login Error!",
          description: result.message,
        });

        router.refresh();
        return;
      }
      localStorage.setItem("token", result.token);

      toast({
        title: "Welcome to ECOMMERCE!",
        description: result.message,
      });

      updateAuthState({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        otp: "",
        isVerified: true,
        isAuthenticated: true,
      });
    },
    onError: (result) => {
      // alert(result.message);
      toast({
        variant: "destructive",
        title: "Login Error!",
        description: result.message,
      });
      router.refresh();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    // loginUser.mutate(data);
    jwtLoginUser.mutate(data);
  };

  return (
    <div className="mx-auto my-10 w-11/12 rounded-[20px] border-[1px] border-[#C1C1C1] px-[3.75rem] py-10 sm:w-5/6 md:w-[36rem]">
      <h1 className="text-center text-[32px] font-semibold">Login</h1>
      <h3 className="mt-9 text-center text-2xl font-semibold">
        Welcome back to ECOMMERCE
      </h3>
      <p className="mt-3 text-center text-base font-normal">
        The next gen business marketplace
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-5 mb-10 flex flex-col gap-y-4"
      >
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

        <div className="relative flex flex-col">
          <label htmlFor="password">Password</label>
          <div
            className={`flex rounded-[6px] border-[1px] border-[#C1C1C1] px-3 py-2 ${errors.password && "border-red-600"}`}
          >
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter you password"
              className={`w-full focus:outline-none`}
            />
            <span
              className="cursor-pointer underline"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          {!errors.password && (
            <p className="invisible text-xs">{"some stuff"}</p>
          )}
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={jwtLoginUser.isPending}
          className="mt-4 w-full rounded-[6px] bg-black py-4 text-base font-medium uppercase text-white"
        >
          {jwtLoginUser.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="mt-7 h-px bg-[#C1C1C1]"></div>

      <div className="mt-8 text-center">
        <p className="text-base font-normal">
          {"Don't have an Account? "}
          <Link href="/signup" className="font-medium uppercase">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

/*
const loginUser = api.user.loginUser.useMutation({
    onSuccess: (result) => {
      if (!result.success) {
        // alert(result.message);
        toast({
          variant: "destructive",
          title: "Login Error!",
          description: result.message,
        });

        router.refresh();
        return;
      }
      // TODO: Don't allow unverified user login

      // alert(result.message);

      toast({
        variant: "destructive",
        title: "Login Successful!",
        description: result.message,
      });

      updateAuthState({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        otp: "",
        isVerified: true,
        isAuthenticated: true,
      });
    },
    onError: (result) => {
      // alert(result.message
      toast({
        variant: "destructive",
        title: "Login Error!",
        description: result.message,
      });
      router.refresh();
    },
  });
*/