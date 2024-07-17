"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/navigation";
import { z } from "zod";

import { api } from "~/trpc/react";


const formSchema = z.object({
    name: z.string().min(1, { message: "Name must be at least 1 character long"}),
    email: z.string().email(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
            message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        })
});

type FormData = z.infer<typeof formSchema>

export function CreateUser() {
    const router = useRouter();

    const createUser = api.user.createUser.useMutation({
        onSuccess: (result, variables) => {
            console.log({ result })
            if (result.success) {
                alert(result.message);
                console.log(result.user);
                router.push(`/signup/otp?email=${variables.email}`)
            } else {
                alert(result.message);
            }
        },
        onError: (error) => {
            alert(error.shape);
            console.log(error.shape);
        }
    })

    const { 
        register, 
        handleSubmit,  
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });


    const onSubmit: SubmitHandler<FormData> = (data) => {
        createUser.mutate(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex flex-col">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    {...register("name")}
                    className="border-[1px] border-[#C1C1C1]"
                />
                {errors.name && <p>{errors.name.message}</p>}
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    // type="email"
                    {...register("email")}
                    className="border-[1px] border-[#C1C1C1]"
                />
                {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    // type="password"
                    {...register("password")}
                    className="border-[1px] border-[#C1C1C1]"
                />
                {errors.password && <p>{errors.password.message}</p>}
            </div>

            <button type="submit" className="bg-black text-white" disabled={createUser.isPending}>
                {createUser.isPending ? "Creating Account..." : "Create Account"}
            </button>
        </form>
    )
}
