
import Link from "next/link";
import Icon from "~/app/_components/icons/Icon";

export function Navbar() {
    return (
        <nav>
            <div className="py-3 px-10 flex justify-end gap-x-5">
                <p className="h-3 text-xs  font-normal">Help</p>
                <p className="h-3 text-xs  font-normal">Orders & Returns</p>
                <p className="h-3 text-xs  font-normal">Hi, John</p>
            </div>
            <div className="py-2 px-10 flex justify-between items-center">
                <Link href="/"><h1 className="text-[32px] font-bold">ECOMMERCE</h1></Link>
                <div className="hidden lg:flex gap-x-8 mr-24 ">
                    <Link href="/" className="text-base font-semibold">Categories</Link>
                    <Link href="/" className="text-base font-semibold">Sale</Link>
                    <Link href="/" className="text-base font-semibold">Clearance</Link>
                    <Link href="/" className="text-base font-semibold">New stock</Link>
                    <Link href="/" className="text-base font-semibold">Trending</Link>
                </div>
                <div className="flex gap-x-8">
                    <Icon name="search" />
                    <Icon name="cart" />
                </div>
            </div>
            <div className="flex justify-center items-center gap-x-6 py-2 bg-[#F4F4F4]">
                <Icon name="left-arrow" />
                <p className="text-[14px] font-medium">Get 10% off on business sign up</p>
                <Icon name="right-arrow" />
            </div>
        </nav>
    )
}