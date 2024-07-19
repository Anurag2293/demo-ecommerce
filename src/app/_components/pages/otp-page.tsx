"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { useAuthStore } from "~/providers/auth-store-provider";
import { OTPInput } from "~/app/_components/otp-input";


export function ValidateOTP() {
    const router = useRouter();

    const { otp: correctOTP, email, isVerified, isAuthenticated, verifyOTP } = useAuthStore(state => state);

    if (isAuthenticated && isVerified) {
        router.push("/");
    } else if (isVerified && !isAuthenticated) {
        router.push("/login");
    } else if (!isVerified && !isAuthenticated) {
        router.push("/signup");
    }

    const verifyUser = api.user.verifyUser.useMutation({
        onSuccess: (data, variables) => {
            verifyOTP();
            alert("OTP Verified successfully!"); 
            router.push("/");
        },
        onError: (error, variables) => {
            alert("OTP verified!")
            console.log({error});
        }
    })

    const handleOTPSubmission = (enteredOTP: string) => {
        console.log({enteredOTP})
        verifyUser.mutate({ email, enteredOTP, correctOTP});
    }

    return (
        <div>
            <h1>Verify your email</h1>
            <p>Enter the 8 digit code you have received on <span>{email}</span> </p>
            <div>
                <OTPInput length={8} onOTPSubmit={handleOTPSubmission} isVerifying={verifyUser.isPending} />
            </div>
        </div>
    )
}