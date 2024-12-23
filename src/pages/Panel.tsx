import { useState } from "react";
import { Spinner } from "@nextui-org/react";
import { CouponModal } from "../components/modals/CouponModal";
import { CouponTable } from "../components/tables/CouponTable";
import { ReportTable } from "../components/tables/ReportTable";

export const Panel: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);

	if (loading) {
		return <Spinner label="Loading..." color="primary" size="lg" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
	}

	return <>
		<article className="w-full h-full flex flex-col items-center pb-20" aria-labelledby="manage-heading">
			<div className="w-full h-full flex flex-col justify-between">
				<section className="flex flex-col w-full h-[48%] p-4 gap-y-1">
					<div className="flex justify-between items-center">
						<h2 className="font-bold text-xl">Active Coupons</h2>
						<CouponModal button="Create Coupon" title="Create Coupon" isEdit={false} canCombine={false} code="" description="" discountAmount={1} discountType="percent" limitUses={0} setLoading={setLoading} />
					</div>
					<CouponTable setLoading={setLoading} />
				</section>
				<section className="flex relative flex-col w-full h-[48%] p-4 gap-y-1">
					<div className="flex justify-between items-center">
						<h2 className="font-bold text-xl">Reports</h2>
					</div>
					<ReportTable setLoading={setLoading} />
				</section>
			</div>
		</article>
	</>
};