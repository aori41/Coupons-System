import { Button, Input, Spinner } from "@nextui-org/react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { couponController } from "../controllers/coupon";
import { reportController } from "../controllers/report";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import Context from "../context/Context";

export const Home: React.FC = () => {
	const { appliedCoupons, setAppliedCoupons, reports, setReports, coupons } = useContext(Context);

	const [couponCode, setCouponCode] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [discountPrice, setDiscountPrice] = useState<number>(0);
	const [totalValue] = useState(100);

	useEffect(() => {
		const discount = appliedCoupons.reduce((sum, coupon) => {
			if (coupon.discountType === "ils") {
				return sum + coupon.discountAmount;
			} else if (coupon.discountType === "percent") {
				return sum + (totalValue * (coupon.discountAmount / 100));
			}
			return sum;
		}, 0);

		setDiscountPrice(discount > totalValue ? 0 : totalValue - discount);
	}, [appliedCoupons]);

	const handleCancelCoupon = (code: string) => {
		setAppliedCoupons(appliedCoupons.filter(coupon => coupon.code !== code));
	};

	const handleSubmitCoupon = async (e: FormEvent) => {
		e.preventDefault();

		if (!couponCode) {
			toast.error("Please enter a coupon code");
			return;
		}

		const codes = appliedCoupons.map(applied => applied.code);

		if (codes.includes(couponCode)) {
			toast.error("Coupon code already applied");
			return;
		}

		setLoading(true);

		const res = await couponController.apply(couponCode, codes);

		setLoading(false);

		if (res?.message) {
			toast.error("Failed: " + res.message);
			return;
		}

		const { discountAmount, discountType } = res;

		setAppliedCoupons([...appliedCoupons, { code: couponCode, discountAmount, discountType: discountType as "percent" | "ils" }]);
		setCouponCode("");
		toast.success("Coupon added successfully");
	};

	const handleFinishOrder = async () => {
		if (!appliedCoupons.length) {
			toast.success("Order finished successfully");
			return;
		}

		const codes = appliedCoupons.map(applied => applied.code);

		setLoading(true);

		const editCoupons = coupons.filter(coupon => codes.includes(coupon.code));
		await couponController.updateUsage(editCoupons);

		const res = await reportController.updateUsage(codes);

		setLoading(false);

		if (res?.message) {
			toast.error("Failed: " + res.message);
		}

		const updatedReports = reports.map(report => {
			if (codes.includes(report.couponCode)) {
				return { ...report, uses: report.uses + 1 };
			} else {
				return report;
			}
		});
		setReports(updatedReports);
		setAppliedCoupons([]);
		toast.success("Order finished successfully");
	}

	if (loading) {
		return <Spinner label="Loading..." color="primary" size="lg" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
	}

	return <>
		<article
			role="main"
			aria-labelledby="home-title"
			className="p-6 max-w-lg mx-auto flex flex-col gap-6 relative"
		>
			<header>
				<h1 id="home-title" className="text-3xl font-bold">
					Welcome to Our Shop
				</h1>
			</header>
			<section className="h-[40%]">
				<div className="h-full">
					<p className="text-lg font-semibold space-x-2">
						<span>Total:</span>
						{appliedCoupons.length > 0 ? <>
							<span className="line-through">{totalValue} ILS</span>{" "}
							<span>{discountPrice} ILS</span>
						</> : <>
							<span>{totalValue} ILS</span>
						</>}
					</p>
					{appliedCoupons.length > 0 && (
						<div className="mt-2 space-y-2 flex flex-col overflow-y-scroll h-[70%] custom-scroll">
							{appliedCoupons.map((coupon) => (
								<div key={coupon.code} className="flex items-center justify-between gap-2 p-2 border rounded-md w-full">
									<div>
										<span className="font-medium">{coupon.code}</span>
										<span> - {coupon.discountAmount} ILS</span>
									</div>
									<button
										onClick={() => handleCancelCoupon(coupon.code)}
										aria-label="Cancel coupon"
										className="text-red-500 hover:text-red-700"
									>
										<X size={16} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
				<form onSubmit={handleSubmitCoupon} aria-labelledby="form-title">
					<div className="flex flex-col gap-4" role="group" aria-label="Input and Submit">
						<label htmlFor="inputField">Have a Coupon?</label>
						<div className="flex gap-x-2">
							<Input
								id="inputField"
								type="text"
								placeholder="Enter Coupon Code"
								value={couponCode}
								onChange={(e) => setCouponCode(e.target.value)}
								aria-required="true"
								aria-label="Text input field"
							/>
							<Button type="submit" aria-label="Submit button" color="primary">
								Submit
							</Button>
						</div>
					</div>
				</form>
				<div className="flex justify-center mt-6">
					<Button
						aria-label="Finish Order"
						className="text-xl w-full font-semibold"
						color="primary"
						onClick={handleFinishOrder}
					>
						Finish Order
					</Button>
				</div>
			</section>
		</article>
	</>
};