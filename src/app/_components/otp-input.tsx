
import { type ChangeEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react'


type Props = {
	length: number,
	onOTPSubmit: (otp: string) => void,
	isVerifying: boolean
}

export const OTPInput = (props: Props) => {
	const [otp, setOtp] = useState<string[]>(new Array(props.length).fill(""));
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		if (inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	}, []);

	const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (!/^\d*$/.test(value)) {
			return;
		}

		const newOTP = [...otp];
		newOTP[index] = value.slice(-1);
		setOtp(newOTP);

		// const combinedOTP = newOTP.join("");
		// if (combinedOTP.length === props.length) {
		// 	props.onOTPSubmit(combinedOTP);
		// }

		if (value && index < props.length - 1 && inputRefs.current[index + 1]) {
			inputRefs.current[index + 1]?.focus();
		}
	}

	const handleClick = (index: number) => {
		inputRefs.current[index]?.setSelectionRange(1, 1);

		const firstEmptyIndex = otp.indexOf("");
		if (index > 0 && firstEmptyIndex !== -1) {
			inputRefs.current[firstEmptyIndex]?.focus();
		}
	}

	const handleKeyDown = (index: number, e: KeyboardEvent) => {
		if (
			e.key === "Backspace" &&
			!otp[index] &&
			index > 0 &&
			inputRefs.current[index - 1]
		) {
			inputRefs.current[index - 1]?.focus();
		}
	}

	const handleVerifyClick = () => {
		const combinedOTP = otp.join("");
		if (combinedOTP.length === props.length) {
			props.onOTPSubmit(combinedOTP);
		}
	}

	return (
		<>
			<p>Code</p>
			<div className='flex justify-between'>
				{otp.map((value, index) => {
					return (
						<input
							key={index}
							type="text"
							value={value}
							inputMode="numeric"
							ref={(input) => {
								if (input) {
									inputRefs.current[index] = input;
								}
							}}
							onChange={(e) => handleChange(index, e)}
							onClick={() => handleClick(index)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							className={`h-12 max-w-12 pl-[18px] text-xl  rounded-[6px] border-[1px] border-[#C1C1C1] focus:outline-none ${(otp[index]?.length ?? 0) > 0 && 'border-blue-600'}`}
						/>
					)
				})}
			</div>
			<button
				type="button"
				onClick={handleVerifyClick}
				disabled={otp.join("").length < props.length}
				className={`w-full mt-16 py-3 rounded-[6px] uppercase text-white bg-black ${otp.join("").length < props.length ? 'cursor-not-allowed' : 'cursor-pointer'} `}
			>{props.isVerifying ? "Verifying..." : "Verify"}</button>
		</>
	)
}
