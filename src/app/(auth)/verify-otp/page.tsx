import { ValidateOTP } from "~/app/_components/pages/otp-page"

export default function OTP() {
    return (
        <div className="w-11/12 sm:w-5/6 md:w-[36rem] my-10 mx-auto py-6 px-6 sm:pt-10 sm:pb-16 sm:px-12 md:pt-10 md:pb-18 border-[1px] border-[#C1C1C1] rounded-[20px]">
            <h1 className="text-[32px] font-semibold text-center">Verify your email</h1>
            <ValidateOTP />
        </div>
    )
}
