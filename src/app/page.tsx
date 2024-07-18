import Link from "next/link";

import SendOTP from "./_components/sendOTP";
import { HomePage } from "./_components/pages/home-page";

export default async function Home() {
  return (
    <div>
      {/* // <CreateUser /> */}
      <Link href="/signup">Signup</Link>
      <hr />
      <SendOTP />
      <hr />
      <HomePage />
    </div>
  );
}
