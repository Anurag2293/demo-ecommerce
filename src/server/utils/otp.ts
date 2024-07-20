export function generateOTP(length = 8): string {
  const characters = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters.charAt(randomIndex);
  }

  return otp;
}

// export function verifyOTP(storedOTP: string, userEnteredOTP: string): boolean {
//   // Basic comparison (case-sensitive)
//   if (storedOTP === userEnteredOTP) {
//     return true; // OTPs match
//   } else {
//     // Optional: More lenient checks (case-insensitive, whitespace tolerance)
//     if (storedOTP.toLowerCase() === userEnteredOTP.toLowerCase().trim()) {
//       return true;
//     }
//   }

//   return false; // OTPs don't match
// }
