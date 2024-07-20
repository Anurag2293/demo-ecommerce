"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Link from "next/link";

import { api } from "~/trpc/react";
import { useAuthStore } from "~/providers/auth-store-provider";

const loginFormSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8, { message: "Invalid Password" })
})

type LoginFormData = z.infer<typeof loginFormSchema>

export function UserLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { isAuthenticated, isVerified, updateAuthState } = useAuthStore(state => state);

    if (isAuthenticated && isVerified) {
        router.push("/");
    }

    const loginUser = api.user.loginUser.useMutation({
        onSuccess: (result) => {
            if (!result.success) {
                alert(result.message);
                router.refresh();
                return;
            }
            // TODO: Don't allow unverified user login 

            alert(result.message);

            updateAuthState({
                userId: result.user.id,
                email: result.user.email,
                name: result.user.name,
                otp: "",
                isVerified: true,
                isAuthenticated: true
            })
        },
        onError: (result) => {
            alert(result.message);
            router.refresh();
        }
    })

    const jwtLoginUser = api.user.jwtLoginUser.useMutation({
        onSuccess: (result) => {
            if (!result.success) {
                alert(result.message);
                router.refresh();
                return;
            }
            // TODO: Don't allow unverified user login
            
            localStorage.setItem('token', result.token);
            alert(result.message);

            updateAuthState({
                userId: result.user.id,
                email: result.user.email,
                name: result.user.name,
                otp: "",
                isVerified: true,
                isAuthenticated: true
            })
        },
        onError: (result) => {
            alert(result.message);
            router.refresh();
        }
    })

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema)
    });

    const onSubmit: SubmitHandler<LoginFormData> = (data) => {
        // loginUser.mutate(data);
        jwtLoginUser.mutate(data);
    }

    return (
        <div className="w-11/12 sm:w-5/6 md:w-[36rem] my-10 mx-auto py-10 px-[3.75rem] border-[1px] border-[#C1C1C1] rounded-[20px]">
            <h1 className="text-[32px] font-semibold text-center">Login</h1>
            <h3 className="text-2xl font-semibold text-center mt-9">Welcome back to ECOMMERCE</h3>
            <p className="text-base font-normal text-center mt-3">The next gen business marketplace</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 my-5 mb-10">
                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        {...register("email")}
                        placeholder="Enter you email"
                        className={`border-[1px] rounded-[6px] py-2 px-3 focus:outline-none ${errors.email ? 'border-red-600' : 'border-[#C1C1C1]'}`}
                    />
                    {!errors.email && <p className="text-xs invisible">{"some stuff"}</p>}
                    {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col relative">
                    <label htmlFor="password">Password</label>
                    <div className={`py-2 px-3 flex border-[1px] rounded-[6px] border-[#C1C1C1] ${errors.password && 'border-red-600'}`}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register("password")}
                            placeholder="Enter you password"
                            className={`focus:outline-none w-full`}
                        />
                        <span className="underline cursor-pointer" onClick={() => setShowPassword(p => !p)}>
                            {showPassword ? 'Hide' : 'Show'}
                        </span>
                    </div>
                    {!errors.password && <p className="text-xs invisible">{"some stuff"}</p>}
                    {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loginUser.isPending}
                    className="w-full bg-black text-white rounded-[6px] mt-4 py-4 text-base font-medium uppercase"
                >
                    {loginUser.isPending ? "Logging in..." : "Login"}
                </button>

            </form>
            <div className="h-px mt-7 bg-[#C1C1C1]"></div>

            <div className="mt-8 text-center">
                <p className="text-base font-normal">{"Don't have an Account? "}<Link href="/signup" className="font-medium uppercase">Sign Up</Link></p>
            </div>
        </div>
    )
}