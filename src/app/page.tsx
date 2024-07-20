
import { FetchCategories } from "./_components/pages/home-page";

export default async function Home() {
	return (
		<div className="w-11/12 sm:w-5/6 md:w-[36rem] my-10 mx-auto py-10 md:pb-24  px-[3.75rem] border-[1px] border-[#C1C1C1] rounded-[20px]">
			<h1 className="text-[32px] font-semibold text-center">Please mark your interests!</h1>
			<p className="text-base font-normal text-center mt-3">We will keep you notified.</p>
			<p className="text-xl font-medium text-start mt-8">My saved interests!</p>
			<FetchCategories />
		</div>
	)
}
