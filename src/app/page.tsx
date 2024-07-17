
import Link from "next/link";

import SendOTP from "./_components/sendOTP";

export default async function Home() {
	return (
		<div>
			{/* // <CreateUser /> */}
			<Link href="/signup">Signup</Link>
			<hr />
			<SendOTP />
		</div>
	);
}
