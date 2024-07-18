import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <Link href="/signup">Signup</Link>
      <hr />
    </div>
  );
}
