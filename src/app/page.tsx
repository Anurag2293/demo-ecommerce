import Link from "next/link";

import { HomePage } from "./_components/pages/home-page";

export default async function Home() {
  return (
    <div>
      <Link href="/signup">Signup</Link>
      <hr />
      <HomePage />
    </div>
  );
}
