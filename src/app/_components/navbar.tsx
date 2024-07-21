import Link from "next/link";
import Icon from "~/app/_components/icons/Icon";

import { Toolbar } from "./toolbar";

export function Navbar() {
  return (
    <nav>
      <Toolbar />
      <div className="flex items-center justify-between px-10 py-2">
        <Link href="/">
          <h1 className="text-[32px] font-bold">ECOMMERCE</h1>
        </Link>
        <div className="mr-24 hidden gap-x-8 lg:flex">
          <Link href="/" className="text-base font-semibold">
            Categories
          </Link>
          <Link href="/" className="text-base font-semibold">
            Sale
          </Link>
          <Link href="/" className="text-base font-semibold">
            Clearance
          </Link>
          <Link href="/" className="text-base font-semibold">
            New stock
          </Link>
          <Link href="/" className="text-base font-semibold">
            Trending
          </Link>
        </div>
        <div className="flex gap-x-8">
          <Icon name="search" />
          <Icon name="cart" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-x-6 bg-[#F4F4F4] py-2">
        <Icon name="left-arrow" />
        <p className="text-[14px] font-medium">
          Get 10% off on business sign up
        </p>
        <Icon name="right-arrow" />
      </div>
    </nav>
  );
}
