"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { useAuthStore } from "~/providers/auth-store-provider";
import { OTPInput } from "../otp-input";


export function ValidateOTP() {
    const { otp, name, email } = useAuthStore(state => state);

    const handleOTPSubmission = (enteredOTP: string) => {
        console.log({enteredOTP})
    }

    return (
        <div>
            <h1>Verify your email</h1>
            <p>Enter the 8 digit code you have received on <span>{email}</span> </p>
            <div>
                <OTPInput length={8} onOTPSubmit={handleOTPSubmission} />
            </div>
        </div>
    )
}