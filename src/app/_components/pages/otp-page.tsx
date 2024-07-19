"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { useAuthStore } from "~/providers/auth-store-provider";
import { OTPInput } from "~/app/_components/otp-input";


function maskEmail (email: string) {
    const suffix = email.substring(email.indexOf('@'));
    const prefix = email.substring(0, email.indexOf('@'));
    
    let maskedEmail = "";
    if (prefix.length > 3) {
        maskedEmail += prefix.substring(0, 3);
        maskedEmail += "***";
    } else {
        maskedEmail += prefix;
    }
    maskedEmail += suffix;
    return maskedEmail;
}

export function ValidateOTP() {
    const router = useRouter();

    const { otp: correctOTP, email, isVerified, isAuthenticated, updateAuthState } = useAuthStore(state => state);

    if (isAuthenticated && isVerified) {
        router.push("/");
    } else if (isVerified && !isAuthenticated) {
        router.push("/login");
    } else if (!isVerified && !isAuthenticated) {
        router.push("/signup");
    }

    const verifyUser = api.user.verifyUser.useMutation({
        onSuccess: (result) => {
            if (!result.success) {
                alert("OTP authentication error!");
                return; 
            }
            
            updateAuthState({
                name: result.user.name,
                email: result.user.email,
                isAuthenticated: true,
                isVerified: true,
                otp: ""
            });

            alert("OTP Verified successfully!"); 
        },
        onError: (error) => {
            alert("OTP authentication error!")
            console.log({error});
        }
    })

    const handleOTPSubmission = (enteredOTP: string) => {
        console.log({enteredOTP})
        verifyUser.mutate({ email, enteredOTP, correctOTP});
    }

    return (
        <div className="w-11/12 sm:w-5/6 md:w-[36rem] mt-10 mx-auto py-10 px-[3.75rem] border-[1px] border-[#C1C1C1] rounded-[20px]">
            <h1 className="text-[32px] font-semibold text-center">Verify your email</h1>
            <div className="mt-8 mb-12">
                <p className="text-center text-base font-normal">Enter the 8 digit code you have received on</p>
                <p className="text-center text-base font-medium">{maskEmail(email)}</p>
            </div>
            
            <OTPInput 
                length={8} 
                onOTPSubmit={handleOTPSubmission} 
                isVerifying={verifyUser.isPending} 
            />
        </div>
    )
}