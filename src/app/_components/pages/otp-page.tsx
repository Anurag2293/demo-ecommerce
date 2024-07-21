"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { useAuthStore } from "~/providers/auth-store-provider";
import { OTPInput } from "~/app/_components/otp-input";
import { useToast } from "~/components/ui/use-toast";

function maskEmail(email: string) {
  const suffix = email.substring(email.indexOf("@"));
  const prefix = email.substring(0, email.indexOf("@"));

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
  const { toast } = useToast();

  const {
    otp: correctOTP,
    email,
    isVerified,
    isAuthenticated,
    updateAuthState,
  } = useAuthStore((state) => state);

  if (isAuthenticated && isVerified) {
    router.push("/");
  } else if (isVerified && !isAuthenticated) {
    router.push("/login");
  }
  // else if (!isVerified && !isAuthenticated) {
  // router.push("/signup");
  // }

  const verifyUser = api.user.verifyUser.useMutation({
    onSuccess: (result) => {
      if (!result.success) {
        // alert("OTP authentication error!");
        // return;

        toast({
          variant: "destructive",
          title: "OTP authentication error!",
          description:
            "Signup again with different email (or) contact administrator",
        });
        // console.log({ error });
        router.push("/signup");
        return;
      }

      updateAuthState({
        userId: result.user.id,
        name: result.user.name,
        email: result.user.email,
        isAuthenticated: false,
        isVerified: true,
        otp: "",
      });

      // alert("OTP Verified successfully!");
      toast({
        title: "OTP Verified successfully!",
        description: "Login to gain access to your account!",
      });
    },
    onError: () => {
      // alert("OTP authentication error!");
      toast({
        variant: "destructive",
        title: "OTP authentication error!",
        description:
          "Signup again with different email (or) contact administrator",
      });
      // console.log({ error });
      router.push("/signup");
    },
  });

  const handleOTPSubmission = (enteredOTP: string) => {
    console.log({ enteredOTP });
    verifyUser.mutate({ email, enteredOTP, correctOTP });
  };

  return (
    <>
      <div className="mb-12 mt-8">
        <p className="text-center text-base font-normal">
          Enter the 8 digit code you have received on
        </p>
        <p className="text-center text-base font-medium">{maskEmail(email)}</p>
      </div>

      <OTPInput
        length={8}
        onOTPSubmit={handleOTPSubmission}
        isVerifying={verifyUser.isPending}
      />
    </>
  );
}
