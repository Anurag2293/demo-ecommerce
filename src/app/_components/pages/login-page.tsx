"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

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
                email: result.user?.email ?? "",
                name: result.user?.name ?? "",
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
        loginUser.mutate(data);
    }

    return (
        <div>
            <h1>Login</h1>
            <h3>Welcome back to ECOMMERCE</h3>
            <p>The next gen business marketplace</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input
                        {...register("email")}
                        className="border-[1px] border-[#C1C1C1]"
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        {...register("password")}
                        className="border-[1px] border-[#C1C1C1]"
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className="bg-black text-white uppercase"
                    disabled={loginUser.isPending}
                >
                    {loginUser.isPending ? "Loggin in..." : "Login"}
                </button>
            </form>
        </div>
    )
}